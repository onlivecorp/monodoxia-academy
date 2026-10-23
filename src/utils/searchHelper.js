/**
 * Global Search Helper Utilities
 * Provides string normalization, Azerbaijani/Turkish collation support,
 * highlighting matches, and client-side fallback search engine.
 */

/**
 * Normalizes text for comprehensive accent-insensitive search.
 * Converts Azerbaijani/Turkish specific characters:
 * ə -> e, ı -> i, i̇ -> i, ö -> o, ü -> u, ş -> s, ç -> c, ğ -> g
 */
export function normalizeSearchStr(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/i̇/g, 'i')
    .replace(/ı/g, 'i')
    .replace(/ə/g, 'e')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .trim();
}

/**
 * Tokenizes search query into individual words
 */
export function tokenizeQuery(query) {
  if (!query) return [];
  return query
    .trim()
    .split(/\s+/)
    .map(w => normalizeSearchStr(w))
    .filter(w => w.length > 0);
}

/**
 * Computes relevance score for search sorting
 */
export function calculateRelevance(title, subtitle, body, query, tokens) {
  const normTitle = normalizeSearchStr(title);
  const normSub = normalizeSearchStr(subtitle);
  const normBody = normalizeSearchStr(body);
  const normQ = normalizeSearchStr(query);

  let score = 0;

  // Exact full title match
  if (normTitle === normQ) score += 100;
  else if (normTitle.startsWith(normQ)) score += 75;
  else if (normTitle.includes(normQ)) score += 50;

  // Subtitle match
  if (normSub && normSub.includes(normQ)) score += 30;

  // Body match
  if (normBody && normBody.includes(normQ)) score += 15;

  // Token matches
  tokens.forEach(tok => {
    if (tok.length >= 2) {
      if (normTitle.includes(tok)) score += 12;
      if (normSub && normSub.includes(tok)) score += 6;
      if (normBody && normBody.includes(tok)) score += 3;
    }
  });

  return score;
}

/**
 * Client-Side Hybrid Search Engine (Fallback & Instant Autocomplete)
 */
export function performLocalSearch({
  query,
  category = 'all',
  courses = [],
  coaches = [],
  users = [],
  events = [],
  communityTopics = [],
  lang = 'az'
}) {
  const qTrimmed = (query || '').trim();
  if (!qTrimmed) {
    return {
      query: '',
      total: 0,
      counts: { all: 0, courses: 0, experts: 0, users: 0, events: 0, forum: 0 },
      results: []
    };
  }

  const tokens = tokenizeQuery(qTrimmed);
  const normQ = normalizeSearchStr(qTrimmed);

  const isMatch = (text) => {
    if (!text) return false;
    const norm = normalizeSearchStr(text);
    if (norm.includes(normQ)) return true;
    return tokens.every(tok => norm.includes(tok));
  };

  const results = [];
  const counts = { all: 0, courses: 0, experts: 0, users: 0, events: 0, forum: 0 };

  // 1. Courses
  if (category === 'all' || category === 'courses') {
    courses.forEach(c => {
      const title = c.title || '';
      const desc = c.description || '';
      const instructor = c.instructor || '';
      const cat = c.category || '';
      const badge = c.badge || '';

      if (isMatch(title) || isMatch(desc) || isMatch(instructor) || isMatch(cat) || isMatch(badge)) {
        const score = calculateRelevance(title, `${instructor} ${cat}`, desc, qTrimmed, tokens);
        results.push({
          id: c.id,
          type: 'courses',
          title,
          subtitle: `${instructor}${c.instructor_role ? ' • ' + c.instructor_role : ''}`,
          description: desc,
          category: cat,
          badge,
          duration: c.duration || '',
          price: c.price || '',
          occupancy: c.occupancy || 0,
          status: c.status || '',
          featured: Boolean(c.featured),
          score,
          url: '/akademiya',
          actionType: 'course',
          rawData: c
        });
        counts.courses++;
      }
    });
  }

  // 2. Experts / Coaches
  if (category === 'all' || category === 'experts') {
    coaches.forEach(coach => {
      const name = coach.name || '';
      const title = coach.title || '';
      const bio = coach.bio || '';
      const specialties = Array.isArray(coach.specialties)
        ? coach.specialties
        : (typeof coach.specialties === 'string' ? coach.specialties.split(',') : []);
      const specsStr = specialties.join(' ');

      if (isMatch(name) || isMatch(title) || isMatch(bio) || isMatch(specsStr)) {
        const score = calculateRelevance(name, `${title} ${specsStr}`, bio, qTrimmed, tokens) + 5;
        results.push({
          id: coach.id,
          type: 'experts',
          title: name,
          subtitle: title,
          description: bio,
          avatar: coach.avatar || coach.image || '',
          rating: Number(coach.rating) || 5.0,
          reviewsCount: Number(coach.reviewsCount || coach.reviews_count) || 0,
          specialties,
          hourlyRate: coach.hourlyRate || coach.hourly_rate || '',
          sessionDuration: coach.sessionDuration || coach.session_duration || '60 dəqiqə',
          experience: coach.experience || '',
          availableSlots: coach.availableSlots || [],
          score,
          url: '/koucinq',
          actionType: 'expert',
          rawData: coach
        });
        counts.experts++;
      }
    });
  }

  // 3. Users (Safe Public Attributes Only)
  if (category === 'all' || category === 'users') {
    users.forEach(u => {
      const name = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'İstifadəçi';
      const role = u.role || 'Tələbə';
      const tier = u.tier || 'Basic';

      if (isMatch(name) || isMatch(role) || isMatch(tier)) {
        const score = calculateRelevance(name, `${role} ${tier}`, '', qTrimmed, tokens);
        results.push({
          id: u.id,
          type: 'users',
          title: name,
          subtitle: `${role} • ${tier}`,
          description: u.joinedDate ? `Üzv olma tarixi: ${u.joinedDate}` : '',
          role,
          tier,
          avatar: u.avatar || u.image || '',
          joinedDate: u.joinedDate || '',
          score,
          url: '#',
          actionType: 'user',
          rawData: {
            id: u.id,
            name,
            role,
            tier,
            avatar: u.avatar || u.image || '',
            joinedDate: u.joinedDate || ''
          }
        });
        counts.users++;
      }
    });
  }

  // 4. Events
  if (category === 'all' || category === 'events') {
    events.forEach(ev => {
      const title = ev.title || '';
      const desc = ev.description || '';
      const speaker = ev.speaker || '';
      const badge = ev.typeBadge || ev.type_badge || '';
      const dateLabel = ev.datetimeLabel || ev.datetime_label || '';

      if (isMatch(title) || isMatch(desc) || isMatch(speaker) || isMatch(badge)) {
        const score = calculateRelevance(title, `${speaker} ${badge}`, desc, qTrimmed, tokens);
        results.push({
          id: ev.id,
          type: 'events',
          title,
          subtitle: `${speaker ? speaker + ' • ' : ''}${dateLabel}`,
          description: desc,
          speaker,
          datetimeLabel: dateLabel,
          typeBadge: badge,
          capacity: ev.capacity || 100,
          registered: ev.registered || 0,
          image: ev.image || '',
          score,
          url: '/tedbirler',
          actionType: 'event',
          rawData: ev
        });
        counts.events++;
      }
    });
  }

  // 5. Community Forum Topics
  if (category === 'all' || category === 'forum') {
    communityTopics.forEach(post => {
      const title = post.title || '';
      const snippet = post.snippet || post.description || '';
      const author = post.author || '';
      const badge = post.badge || '';

      if (isMatch(title) || isMatch(snippet) || isMatch(author) || isMatch(badge)) {
        const score = calculateRelevance(title, `${author} ${badge}`, snippet, qTrimmed, tokens);
        results.push({
          id: post.id,
          type: 'forum',
          title,
          subtitle: `${author ? author + ' • ' : ''}${post.timeAgo || post.time_ago || ''}`,
          description: snippet,
          author,
          badge,
          timeAgo: post.timeAgo || post.time_ago || '',
          likes: Number(post.likes) || 0,
          replies: Number(post.replies) || 0,
          pinned: Boolean(post.pinned),
          score,
          url: '/icma',
          actionType: 'forum',
          rawData: post
        });
        counts.forum++;
      }
    });
  }

  counts.all = counts.courses + counts.experts + counts.users + counts.events + counts.forum;

  // Sort by score DESC
  results.sort((a, b) => {
    if (b.score === a.score) return a.title.localeCompare(b.title);
    return b.score - a.score;
  });

  return {
    query: qTrimmed,
    total: counts[category] || counts.all,
    counts,
    results
  };
}

/**
 * Recent searches localStorage manager
 */
const STORAGE_KEY = 'monodoxia_recent_searches_v1';
const MAX_HISTORY = 8;

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveRecentSearch(term) {
  if (!term || !term.trim()) return [];
  const clean = term.trim();
  try {
    const existing = getRecentSearches();
    const filtered = existing.filter(item => item.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function removeRecentSearch(term) {
  try {
    const existing = getRecentSearches();
    const updated = existing.filter(item => item !== term);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (e) {
    return [];
  }
}

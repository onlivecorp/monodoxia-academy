export const DEFAULT_PAGE_SLUGS = {
  home: '',
  akademiya: 'akademiya',
  koucinq: 'koucinq',
  club: 'club',
  tedbirler: 'tedbirler',
  icma: 'icma',
  haqqimizda: 'haqqimizda',
  elaqe: 'elaqe',
  search: 'search'
};

export const PAGE_DEFINITIONS = [
  { id: 'akademiya', label: 'Akademiya (Kurslar)', defaultSlug: 'akademiya', icon: 'school', desc: 'Kurs kataloqu, LMS modulları, tədris zəmanəti' },
  { id: 'koucinq', label: 'Fərdi Kouçinq', defaultSlug: 'koucinq', icon: 'psychology', desc: 'Ekspert koçlar, fərdi seans rezervasiyası, ICF metodologiyası' },
  { id: 'club', label: 'Zənginlər Klubu', defaultSlug: 'club', icon: 'card_membership', desc: 'Üzvlük paketləri, imtiyazlar, qapalı icma üzvlüyü' },
  { id: 'tedbirler', label: 'Tədbirlər & Masterklaslar', defaultSlug: 'tedbirler', icon: 'event', desc: 'Canlı təqvim, vebinarlar, oflayn görüşlər, spikerlik' },
  { id: 'icma', label: 'İcma & Müzakirə Forumu', defaultSlug: 'icma', icon: 'forum', desc: 'İntellektual forum, həftəlik mövzu, icma etikası qaydaları' },
  { id: 'haqqimizda', label: 'Haqqımızda', defaultSlug: 'haqqimizda', icon: 'auto_stories', desc: 'Akademiyanın məramı, dəyərlər, sahələr və manifest' },
  { id: 'elaqe', label: 'Əlaqə', defaultSlug: 'elaqe', icon: 'contact_support', desc: 'Əlaqə məlumatları, əlaqə forması, sosial media və xəritə' },
  { id: 'search', label: 'Qlobal Axtarış', defaultSlug: 'search', icon: 'search', desc: 'Kurslar, ekspertlər, tədbirlər və müzakirələr üzrə axtarış' },
  { id: 'home', label: 'Ana Səhifə', defaultSlug: '', icon: 'home', desc: 'Əsas giriş hero mətni, statistika, hero media' }
];

export const VALID_PAGE_IDS = PAGE_DEFINITIONS.map(p => p.id);

/**
 * Normalizes and sanitizes a custom slug
 */
export function sanitizeSlug(raw) {
  if (!raw) return '';
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/^[/#]+|[/#]+$/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Returns the effective slug for a given pageId
 */
export function resolvePageSlug(pageId, customSlugs = {}) {
  const custom = customSlugs?.[pageId];
  if (custom !== undefined && custom !== null && String(custom).trim() !== '') {
    return sanitizeSlug(custom);
  }
  return DEFAULT_PAGE_SLUGS[pageId] ?? (pageId === 'home' ? '' : pageId);
}

/**
 * Returns full path URL (e.g. /haqqimizda or /about) for a given pageId
 */
export function resolvePageUrl(pageId, customSlugs = {}) {
  const slug = resolvePageSlug(pageId, customSlugs);
  if (pageId === 'home' || !slug) {
    return '/';
  }
  return `/${slug}`;
}

/**
 * Detects target pageId from window.location pathname or hash
 */
export function resolvePageFromLocation(customSlugs = {}) {
  if (typeof window === 'undefined') return 'home';

  const effectiveSlugs = { ...DEFAULT_PAGE_SLUGS, ...(customSlugs || {}) };

  // 1. Check pathname (e.g., /kurslar, /haqqimizda)
  const path = (window.location.pathname || '')
    .replace(/^\/+|\/+$/g, '')
    .trim()
    .toLowerCase();

  // 2. Check hash (e.g., #kurslar, #/kurslar)
  const hash = (window.location.hash || '')
    .replace(/^#[/]?/, '')
    .replace(/\/+$/, '')
    .trim()
    .toLowerCase();

  const candidate = sanitizeSlug(hash || path);

  if (!candidate) return 'home';

  // Check candidate against customized slugs first
  for (const [pageId, slug] of Object.entries(effectiveSlugs)) {
    const s = sanitizeSlug(slug);
    if (s && candidate === s) {
      return pageId;
    }
  }

  // Fallback: match candidate against default slugs and page ids
  for (const [pageId, defaultSlug] of Object.entries(DEFAULT_PAGE_SLUGS)) {
    const d = sanitizeSlug(defaultSlug);
    if (candidate === pageId.toLowerCase() || (d && candidate === d)) {
      return pageId;
    }
  }

  return 'home';
}

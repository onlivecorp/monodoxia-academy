import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  performLocalSearch,
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearRecentSearches
} from '../utils/searchHelper';

export default function useGlobalSearch(initialQuery = '', initialCategory = 'all') {
  const { currentLang } = useLanguage();
  const {
    coursesList = [],
    coachesList = [],
    usersList = [],
    eventsList = [],
    communityTopics = []
  } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [results, setResults] = useState([]);
  const [counts, setCounts] = useState({
    all: 0,
    courses: 0,
    experts: 0,
    users: 0,
    events: 0,
    forum: 0
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);

  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const executeSearch = useCallback(async (searchQuery, searchCategory) => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setResults([]);
      setCounts({ all: 0, courses: 0, experts: 0, users: 0, events: 0, forum: 0 });
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    // Compute local results immediately for lightning-fast responsiveness
    const localData = performLocalSearch({
      query: trimmed,
      category: searchCategory,
      courses: coursesList,
      coaches: coachesList,
      users: usersList,
      events: eventsList,
      communityTopics: communityTopics,
      lang: currentLang
    });

    // Seed state with local data immediately
    setResults(localData.results);
    setCounts(localData.counts);
    setTotal(localData.total);

    // Now query backend API for live database results
    try {
      const url = `/api.php?action=search&q=${encodeURIComponent(trimmed)}&category=${encodeURIComponent(searchCategory)}&lang=${encodeURIComponent(currentLang || 'az')}&limit=40`;
      const res = await fetch(url, {
        signal: abortControllerRef.current.signal,
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const json = await res.json();
      if (json && json.status === 'success' && Array.isArray(json.results)) {
        // If backend returned results, merge or use backend results
        if (json.results.length > 0) {
          // Re-attach rawData references from local state where matching IDs exist
          const enrichedResults = json.results.map(item => {
            let rawData = null;
            if (item.type === 'courses') rawData = coursesList.find(c => c.id === item.id);
            else if (item.type === 'experts') rawData = coachesList.find(c => c.id === item.id);
            else if (item.type === 'events') rawData = eventsList.find(e => e.id === item.id);
            else if (item.type === 'forum') rawData = communityTopics.find(p => p.id === item.id);
            else if (item.type === 'users') rawData = usersList.find(u => u.id === item.id);

            return {
              ...item,
              rawData: rawData || item
            };
          });

          setResults(enrichedResults);
          if (json.counts) {
            setCounts(json.counts);
          }
          setTotal(json.total || enrichedResults.length);
        } else if (localData.results.length > 0) {
          // Backend returned empty but local had matches (e.g. mock data loaded in context)
          setResults(localData.results);
          setCounts(localData.counts);
          setTotal(localData.total);
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Network or API failure fallback: keep local search results
        console.warn('API search failed, relying on local search data:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [coursesList, coachesList, usersList, eventsList, communityTopics, currentLang]);

  // Debounced search trigger
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSearch(query, category);
    }, 220);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, category, executeSearch]);

  const commitRecentSearch = (term) => {
    const updated = saveRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleRemoveRecent = (term, e) => {
    if (e) e.stopPropagation();
    const updated = removeRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleClearRecent = () => {
    const updated = clearRecentSearches();
    setRecentSearches(updated);
  };

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    counts,
    total,
    loading,
    error,
    recentSearches,
    commitRecentSearch,
    handleRemoveRecent,
    handleClearRecent
  };
}

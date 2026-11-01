import React, { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import useGlobalSearch from '../hooks/useGlobalSearch';
import SearchResultItem from '../components/search/SearchResultItem';
import ExpertProfileModal from '../components/modals/ExpertProfileModal';
import UserProfilePreviewModal from '../components/modals/UserProfilePreviewModal';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';

const CATEGORIES = [
  { id: 'all', labelKey: 'search_cat_all', label: 'Bütün Kateqoriyalar', icon: 'grid_view' },
  { id: 'courses', labelKey: 'search_cat_courses', label: 'Kurslar', icon: 'school' },
  { id: 'experts', labelKey: 'search_cat_experts', label: 'Uzmanlar & Kouçlar', icon: 'psychology' },
  { id: 'events', labelKey: 'search_cat_events', label: 'Tədbirlər & Masterklaslar', icon: 'event' },
  { id: 'forum', labelKey: 'search_cat_forum', label: 'İcma & Forum', icon: 'forum' }
];

export default function SearchPage() {
  const {
    openPlayer,
    openApplication,
    setSelectedTopic,
    navigateTo
  } = useApp();

  const { t } = useLanguage();

  // Read initial query from URL search parameters if available
  const getInitialParams = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        q: params.get('q') || '',
        cat: params.get('category') || 'all'
      };
    } catch (e) {
      return { q: '', cat: 'all' };
    }
  };

  const initial = getInitialParams();

  const {
    query,
    setQuery,
    category,
    setCategory,
    results,
    counts,
    total,
    loading,
    recentSearches,
    commitRecentSearch,
    handleRemoveRecent,
    handleClearRecent
  } = useGlobalSearch(initial.q, initial.cat);

  const [sortBy, setSortBy] = useState('relevance'); // relevance, name_asc, type
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Sync URL with search query
  useEffect(() => {
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (category !== 'all') params.set('category', category);

      const newUrl = params.toString() ? `/search?${params.toString()}` : '/search';
      window.history.replaceState({}, '', newUrl);
    } catch (e) {}
  }, [query, category]);

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'name_asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'type') {
      return a.type.localeCompare(b.type);
    }
    return b.score - a.score;
  });

  const handleResultClick = (item) => {
    if (query.trim()) {
      commitRecentSearch(query);
    }

    switch (item.actionType || item.type) {
      case 'course':
      case 'courses':
        if (item.rawData && openPlayer) {
          openPlayer(item.rawData);
        } else {
          navigateTo('akademiya');
        }
        break;

      case 'expert':
      case 'experts':
        setSelectedCoach(item.rawData || item);
        break;

      case 'user':
      case 'users':
        setSelectedUser(item.rawData || item);
        break;

      case 'event':
      case 'events':
        if (openApplication && item.rawData) {
          openApplication({
            type: 'event',
            id: item.rawData.id,
            title: item.rawData.title,
            price: t('event_free') || 'Ödənişsiz'
          });
        } else {
          navigateTo('tedbirler');
        }
        break;

      case 'forum':
        if (setSelectedTopic && item.rawData) {
          setSelectedTopic(item.rawData);
        }
        navigateTo('icma');
        break;

      default:
        navigateTo(item.url || 'home');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Editorial Page Hero */}
      <PageHero
        badge={t('search_page_badge')}
        title={t('search_page_title')}
        description={t('search_page_desc')}
        breadcrumbs={[{ label: t('nav_search_global') }]}
      />

      <section className="py-10 sm:py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Search Bar Card */}
          <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-4 sm:p-6 shadow-[0_10px_35px_-10px_rgba(7,19,38,0.08)] mb-8">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[24px] text-[#775a19] absolute left-4.5 pointer-events-none shrink-0">
                search
              </span>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_input_guide')}
                className="w-full bg-[#faf8f5] border border-[#e2e8f0] focus:border-[#c5a059] rounded-2xl pl-14 sm:pl-16 pr-12 py-3.5 sm:py-4 text-base sm:text-lg text-[#071326] placeholder:text-slate-400 focus:outline-hidden transition-all shadow-inner font-sans"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 p-1"
                  title={t('common_close')}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#f1f5f9]">
              {CATEGORIES.map(cat => {
                const isActive = category === cat.id;
                const count = counts[cat.id] || 0;
                const label = cat.labelKey ? (t(cat.labelKey) || cat.label) : cat.label;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-sm'
                        : 'bg-[#faf8f5] text-[#475569] hover:bg-slate-100 hover:text-[#071326]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                    <span>{label}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#c5a059]/30 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Header Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e2e8f0]">
            <div className="text-sm text-[#475569]">
              {query.trim() ? (
                <span>
                  <strong>"{query}"</strong> {t('search_results_found')}: <strong>{total}</strong>
                </span>
              ) : (
                <span>{t('search_prompt_guide')}</span>
              )}
            </div>

            {results.length > 0 && (
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-[#64748b] font-medium">{t('search_sort_label')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#071326] font-semibold focus:outline-hidden focus:border-[#c5a059] cursor-pointer"
                >
                  <option value="relevance">{t('search_sort_relevance')}</option>
                  <option value="name_asc">{t('search_sort_name')}</option>
                  <option value="type">{t('search_sort_type')}</option>
                </select>
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-[#775a19]">
              <div className="w-10 h-10 border-3 border-[#c5a059] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {t('search_searching')}
              </p>
            </div>
          )}

          {/* Results Grid / List */}
          {!loading && sortedResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedResults.map((item, index) => (
                <SearchResultItem
                  key={`${item.type}-${item.id}-${index}`}
                  item={item}
                  query={query}
                  isSelected={false}
                  onClick={() => handleResultClick(item)}
                />
              ))}
            </div>
          )}

          {/* Empty Query: Show Guide & Recent Searches */}
          {!loading && !query.trim() && (
            <div className="bg-white rounded-3xl border border-[#c5a059]/20 p-8 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-[#775a19] flex items-center justify-center mx-auto mb-4 border border-[#c5a059]/30">
                <span className="material-symbols-outlined text-[32px]">manage_search</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#071326] mb-2">
                {t('search_prompt_title')}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6 font-light">
                {t('search_prompt_desc')}
              </p>

              {recentSearches.length > 0 && (
                <div className="pt-6 border-t border-[#f1f5f9] text-left">
                  <div className="flex items-center justify-between mb-3 text-xs text-[#64748b]">
                    <span className="font-semibold uppercase tracking-wider">{t('search_recent')}</span>
                    <button
                      onClick={handleClearRecent}
                      className="text-[#775a19] hover:underline cursor-pointer"
                    >
                      {t('search_clear_recent')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#c5a059]/20 border border-[#e2e8f0] text-xs font-medium text-[#1e293b] cursor-pointer transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty Results When Query Entered */}
          {!loading && query.trim() && sortedResults.length === 0 && (
            <div className="bg-white rounded-3xl border border-[#c5a059]/20 p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#071326] mb-2">
                "{query}" {t('search_no_results')}
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed mb-6">
                {t('search_no_results_desc')}
              </p>

              <button
                type="button"
                onClick={() => { setQuery(''); setCategory('all'); }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                {t('search_reset_filters')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Linked Profile Modals */}
      <ExpertProfileModal
        coach={selectedCoach}
        isOpen={Boolean(selectedCoach)}
        onClose={() => setSelectedCoach(null)}
      />

      <UserProfilePreviewModal
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

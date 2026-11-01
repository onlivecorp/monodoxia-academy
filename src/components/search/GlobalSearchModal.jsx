import React, { useState, useEffect, useRef } from 'react';
import useGlobalSearch from '../../hooks/useGlobalSearch';
import SearchResultItem from './SearchResultItem';
import ExpertProfileModal from '../modals/ExpertProfileModal';
import UserProfilePreviewModal from '../modals/UserProfilePreviewModal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

const CATEGORIES = [
  { id: 'all', label: 'Bütün', labelKey: 'search_cat_all', icon: 'grid_view' },
  { id: 'courses', label: 'Kurslar', labelKey: 'search_cat_courses', icon: 'school' },
  { id: 'experts', label: 'Uzmanlar & Kouçlar', labelKey: 'search_cat_experts', icon: 'psychology' },
  { id: 'events', label: 'Tədbirlər', labelKey: 'search_cat_events', icon: 'event' },
  { id: 'forum', label: 'Forum', labelKey: 'search_cat_forum', icon: 'forum' }
];

const POPULAR_TAGS = [
  'Psixologiya',
  'Şüuraltı',
  'Fərqində Yaşam',
  'ICF Kouçinq',
  'Meditasiya',
  'Emosional İntellekt',
  'Nəfəs Texnikaları',
  'Liderlik'
];

export default function GlobalSearchModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const {
    openPlayer,
    openApplication,
    setSelectedTopic,
    navigateTo,
    coachesList = [],
    coursesList = [],
    communityTopics = []
  } = useApp();

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
  } = useGlobalSearch();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selectedIndex when results or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [results, category]);

  // Global keydown listeners for modal navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('[aria-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const handleResultClick = (item) => {
    commitRecentSearch(query || item.title);

    switch (item.actionType || item.type) {
      case 'course':
      case 'courses':
        onClose();
        if (item.rawData && openPlayer) {
          openPlayer(item.rawData);
        } else {
          navigateTo('akademiya');
        }
        break;

      case 'expert':
      case 'experts':
        // Open detailed expert modal
        setSelectedCoach(item.rawData || item);
        break;

      case 'user':
      case 'users':
        setSelectedUser(item.rawData || item);
        break;

      case 'event':
      case 'events':
        onClose();
        if (openApplication && item.rawData) {
          openApplication({
            type: 'event',
            id: item.rawData.id,
            title: item.rawData.title,
            price: 'Ödənişsiz'
          });
        } else {
          navigateTo('tedbirler');
        }
        break;

      case 'forum':
        onClose();
        if (setSelectedTopic && item.rawData) {
          setSelectedTopic(item.rawData);
        }
        navigateTo('icma');
        break;

      default:
        onClose();
        navigateTo(item.url || 'home');
    }
  };

  const handleFullSearch = () => {
    if (query.trim()) {
      commitRecentSearch(query);
    }
    onClose();
    navigateTo('search');
    try {
      const targetUrl = `/search?q=${encodeURIComponent(query.trim())}&category=${encodeURIComponent(category)}`;
      window.history.pushState({}, '', targetUrl);
    } catch (e) {}
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-16 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#070f1e]/80 backdrop-blur-md transition-opacity animate-fadeIn"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div
          role="dialog"
          aria-modal="true"
          className="relative bg-white border border-[#c5a059]/40 rounded-3xl shadow-[0_25px_60px_-15px_rgba(7,19,38,0.35)] w-full max-w-3xl overflow-hidden z-10 animate-scaleUp text-[#071326] flex flex-col max-h-[85vh]"
        >
          {/* Top Gold Gradient Trim */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19]" />

          {/* Search Header Bar */}
          <div className="p-4 sm:p-5 border-b border-[#e2e8f0] bg-[#faf8f5]/60 flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#775a19] shrink-0">
              search
            </span>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search_input_placeholder')}
              className="w-full bg-transparent border-0 text-[#071326] placeholder:text-[#94a3b8] text-base sm:text-lg focus:outline-hidden font-sans"
            />

            {loading && (
              <div className="w-5 h-5 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin shrink-0" />
            )}

            {query && !loading && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                title="Təmizlə"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#071326] transition-colors text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1"
            >
              <kbd className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-300">ESC</kbd>
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="px-4 py-2.5 bg-white border-b border-[#f1f5f9] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => {
              const isActive = category === cat.id;
              const count = counts[cat.id] || 0;
              const label = t(cat.labelKey) || cat.label;

              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-sm'
                      : 'bg-[#faf8f5] text-[#475569] hover:bg-slate-100 hover:text-[#071326]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                  <span>{label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-[#c5a059]/30 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Results Body */}
          <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
            {/* When Input is Empty: Show Recent Searches & Popular Suggestions */}
            {!query.trim() && (
              <div className="space-y-6 py-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs text-[#64748b]">
                      <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-[#775a19]">history</span>
                        <span>{t('search_recent')}</span>
                      </span>
                      <button
                        onClick={handleClearRecent}
                        className="text-[11px] text-[#775a19] hover:underline cursor-pointer"
                      >
                        {t('search_clear_recent')}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => setQuery(term)}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#c5a059]/15 border border-[#e2e8f0] hover:border-[#c5a059]/40 text-xs text-[#1e293b] cursor-pointer transition-all"
                        >
                          <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-[#775a19]">
                            search
                          </span>
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveRecent(term, e)}
                            className="text-slate-400 hover:text-rose-600 ml-0.5"
                            title={t('common_delete')}
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Keywords Discovery */}
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#775a19]">trending_up</span>
                    <span>{t('search_popular_tags')}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {POPULAR_TAGS.map((tag, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(tag)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50/80 border border-[#c5a059]/30 hover:border-[#c5a059] text-xs font-medium text-[#071326] transition-all cursor-pointer shadow-2xs"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts Hint */}
                <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e2e8f0] text-xs text-[#64748b] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#775a19] text-[18px]">lightbulb</span>
                    <span>İstənilən vaxt axtarış üçün <strong>⌘K</strong> və ya <strong>Ctrl+K</strong> qısayolunu istifadə edin.</span>
                  </div>
                </div>
              </div>
            )}

            {/* When Query entered and results found */}
            {query.trim() && results.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748b] pb-1 px-1">
                  <span><strong>{total}</strong> {t('search_results_found')}</span>
                  <span className="text-[11px] text-slate-400">↑ ↓ {t('search_navigate_hint')} | ↵ {t('search_select_hint')}</span>
                </div>

                {results.map((item, index) => (
                  <SearchResultItem
                    key={`${item.type}-${item.id}-${index}`}
                    item={item}
                    query={query}
                    isSelected={index === selectedIndex}
                    onClick={() => handleResultClick(item)}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {query.trim() && !loading && results.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-[#775a19] flex items-center justify-center mx-auto mb-3 border border-[#c5a059]/30">
                  <span className="material-symbols-outlined text-[32px]">search_off</span>
                </div>
                <h3 className="font-serif text-lg font-medium text-[#071326] mb-1">
                  "{query}" {t('search_no_results')}
                </h3>
                <p className="text-xs text-[#64748b] max-w-md mx-auto mb-5">
                  {t('search_no_results_desc')}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {POPULAR_TAGS.slice(0, 4).map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-[#071326] cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 sm:p-4 bg-[#faf8f5] border-t border-[#e2e8f0] flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-3 text-slate-500 text-[11px] hidden sm:flex">
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">↑</kbd>
                <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">↓</kbd>
                <span>{t('search_navigate_hint')}</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">↵</kbd>
                <span>{t('search_select_hint')}</span>
              </span>
            </div>

            {query.trim() && (
              <button
                type="button"
                onClick={handleFullSearch}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#775a19] hover:text-[#071326] transition-colors cursor-pointer"
              >
                <span>{t('search_results_found')} ({total})</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            )}
          </div>
        </div>
      </div>

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
    </>
  );
}

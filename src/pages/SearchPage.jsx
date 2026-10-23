import React, { useState, useEffect } from 'react';
import PageHero from '../components/PageHero';
import useGlobalSearch from '../hooks/useGlobalSearch';
import SearchResultItem from '../components/search/SearchResultItem';
import ExpertProfileModal from '../components/modals/ExpertProfileModal';
import UserProfilePreviewModal from '../components/modals/UserProfilePreviewModal';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  { id: 'all', label: 'Bütün Kateqoriyalar', icon: 'grid_view' },
  { id: 'courses', label: 'Kurslar', icon: 'school' },
  { id: 'experts', label: 'Uzmanlar & Kouçlar', icon: 'psychology' },
  { id: 'users', label: 'İstifadəçilər', icon: 'person' },
  { id: 'events', label: 'Tədbirlər & Masterklaslar', icon: 'event' },
  { id: 'forum', label: 'İcma & Forum', icon: 'forum' }
];

export default function SearchPage() {
  const {
    openPlayer,
    openApplication,
    setSelectedTopic,
    navigateTo
  } = useApp();

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
            price: 'Ödənişsiz'
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
        badge="Axtarış Mərkəzi"
        title="Qlobal Axtarış və İndeks"
        description="Monodoxia Academy ekosistemində tədris kursları, beynəlxalq sertifikatlı ekspertlər, tədbirlər və müzakirələr üzrə tam axtarış."
        breadcrumbs={[{ label: 'Qlobal Axtarış' }]}
      />

      <section className="py-10 sm:py-16 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Search Bar Card */}
          <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-4 sm:p-6 shadow-[0_10px_35px_-10px_rgba(7,19,38,0.08)] mb-8">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[26px] text-[#775a19] absolute left-4 pointer-events-none">
                search
              </span>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Açar söz daxil edin (kurs, kouç, mövzu, tədbir)..."
                className="w-full bg-[#faf8f5] border border-[#e2e8f0] focus:border-[#c5a059] rounded-2xl pl-13 pr-12 py-4 text-base sm:text-lg text-[#071326] placeholder:text-slate-400 focus:outline-hidden transition-all shadow-inner font-sans"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 p-1"
                  title="Təmizlə"
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
                    <span>{cat.label}</span>
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
                  <strong>"{query}"</strong> üzrə <strong>{total}</strong> nəticə tapıldı
                </span>
              ) : (
                <span>Axtarış üçün yuxarıdakı xanaya söz daxil edin</span>
              )}
            </div>

            {results.length > 0 && (
              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-[#64748b] font-medium">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-3 py-1.5 text-xs text-[#071326] font-semibold focus:outline-hidden focus:border-[#c5a059] cursor-pointer"
                >
                  <option value="relevance">Ən uyğun (Relevance)</option>
                  <option value="name_asc">Başlıq üzrə (A - Z)</option>
                  <option value="type">Növ üzrə qruplaşdır</option>
                </select>
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-[#775a19]">
              <div className="w-10 h-10 border-3 border-[#c5a059] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Axtarış aparılır...
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
                Nə axtarmaq istərdiniz?
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-6 font-light">
                Platformadakı istənilən təhsil kursu, ICF sertifikatlı kouç, yaxınlaşan tədbir və ya forum müzakirəsini dərhal tapmaq üçün açar söz daxil edin.
              </p>

              {recentSearches.length > 0 && (
                <div className="pt-6 border-t border-[#f1f5f9] text-left">
                  <div className="flex items-center justify-between mb-3 text-xs text-[#64748b]">
                    <span className="font-semibold uppercase tracking-wider">Son Axtarışlarınız</span>
                    <button
                      onClick={handleClearRecent}
                      className="text-[#775a19] hover:underline cursor-pointer"
                    >
                      Təmizlə
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
                "{query}" üzrə uyğun nəticə tapılmadı
              </h3>
              <p className="text-xs text-[#64748b] leading-relaxed mb-6">
                Zəhmət olmasa daxil etdiyiniz sözün düzgünlüyünü yoxlayın və ya kateqoriya filtrini dəyişərək yenidən yoxlayın.
              </p>

              <button
                type="button"
                onClick={() => { setQuery(''); setCategory('all'); }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                Filtrləri Sıfırla
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

import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

export default function CommunityPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    communityTopics = [],
    homeContent,
    setNewTopicModalOpen,
    openTopicDetail,
    likeTopic,
    isTopicLiked,
    currentUser,
    setAuthModalOpen,
    categoriesList = []
  } = useApp();

  const community = homeContent?.community || {};
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'popular', 'readTime'

  const safeTopics = Array.isArray(communityTopics) ? communityTopics : [];

  // Filter out drafts if not author or admin
  const visibleTopics = safeTopics.filter(t => {
    if (!t) return false;
    if (t.status === 'draft') {
      if (currentUser?.role === 'Admin') return true;
      if (currentUser && t.author === `${currentUser.firstName} ${currentUser.lastName}`) return true;
      return false;
    }
    return true;
  });

  // Extract all categories
  const allCategories = Array.from(
    new Set(
      visibleTopics.flatMap(t => {
        if (!t) return [];
        const result = [];
        if (t.badge) result.push(t.badge.replace('📌 ', '').replace('🌟 ', '').trim());
        if (t.category && t.category !== 'general') result.push(t.category);
        return result;
      }).filter(Boolean)
    )
  );

  const filteredTopics = visibleTopics.filter(t => {
    if (!t) return false;
    const cleanBadge = (t.badge || '').replace('📌 ', '').replace('🌟 ', '').trim();
    const matchesCat = filterCategory === 'all' ||
      cleanBadge === filterCategory ||
      t.badge === filterCategory ||
      t.category === filterCategory;

    const title = getLocalized(t, 'title', currentLang, defaultLang) || t.title || '';
    const desc = getLocalized(t, 'snippet', currentLang, defaultLang) || getLocalized(t, 'desc', currentLang, defaultLang) || t.snippet || t.desc || t.content || '';
    const author = t.author || '';

    const matchesSearch = !searchQuery.trim() ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    // Pinned always on top
    const aPin = Boolean(a.pinned || (typeof a.badge === 'string' && a.badge.includes('📌')));
    const bPin = Boolean(b.pinned || (typeof b.badge === 'string' && b.badge.includes('📌')));
    if (aPin !== bPin) return aPin ? -1 : 1;

    if (sortBy === 'popular') {
      return (b.likes || 0) - (a.likes || 0);
    }
    // Default: latest
    return 0;
  });

  const featuredPost = filteredTopics.find(t => t.pinned || t.isWeekly) || filteredTopics[0];
  const listPosts = featuredPost ? filteredTopics.filter(t => t.id !== featuredPost.id) : filteredTopics;

  const handleCreateArticle = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setNewTopicModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* EDITORIAL HERO */}
      <PageHero
        badge={getLocalized(community, 'badge', currentLang, defaultLang) || 'Bloq & İcma Platforması'}
        title={getLocalized(community, 'title', currentLang, defaultLang) || 'Bilik, Düşüncə və Təcrübə Bloqu'}
        description={getLocalized(community, 'desc', currentLang, defaultLang) || 'Müasir psixologiya, nevrobiologiya, kouçinq və daxili inkişaf sahəsində mütəxəssislərin elmi məqalələri və açıq müzakirələri.'}
        breadcrumbs={[{ label: 'Bloq & İcma' }]}
        adminCmsBlock="community"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#c5a059]/20">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
              <span className="material-symbols-outlined text-[#775a19] text-[18px]">verified</span>
              <span className="font-medium">Elmi və Praktik Məqalələr</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
              <span className="material-symbols-outlined text-[#775a19] text-[18px]">psychology</span>
              <span className="font-medium">Dərin İntellektual Təhlillər</span>
            </div>
          </div>

          <button
            onClick={handleCreateArticle}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg group/btn"
          >
            <span className="material-symbols-outlined text-[17px] text-[#e5c57d] group-hover/btn:scale-110 transition-transform">edit_note</span>
            <span>Məqalə / Mövzu Yaz</span>
          </button>
        </div>
      </PageHero>

      {/* MAIN CONTENT AREA */}
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

          {/* TOOLBAR: SEARCH, CATEGORY DROPDOWN & VIEW MODE */}
          <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-5 sm:p-6 shadow-[0_10px_30px_-10px_rgba(7,19,38,0.05)] flex flex-wrap items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#775a19]">search</span>
              <input
                type="text"
                placeholder="Məqalə, müəllif və ya mövzu axtar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl bg-[#faf8f5] border border-[#c5a059]/30 focus:border-[#775a19] focus:bg-white focus:outline-none transition-all placeholder-[#94a3b8] text-[#071326]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#071326] transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Kateqoriya:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-[#faf8f5] border border-[#c5a059]/30 rounded-xl text-xs font-semibold text-[#071326] focus:border-[#775a19] focus:outline-none cursor-pointer"
                >
                  <option value="all">Bütün Bloq Yazıları ({visibleTopics.length})</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>#{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-[#faf8f5] border border-[#c5a059]/30 rounded-xl text-xs font-semibold text-[#071326] focus:border-[#775a19] focus:outline-none cursor-pointer"
                >
                  <option value="latest">Ən Yenilər</option>
                  <option value="popular">Ən Çox Bəyənilənlər</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white text-[#775a19] shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                  title="Qrid görünüşü"
                >
                  <span className="material-symbols-outlined text-[18px]">grid_view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-[#775a19] shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                  title="Siyahı görünüşü"
                >
                  <span className="material-symbols-outlined text-[18px]">view_list</span>
                </button>
              </div>
            </div>

          </div>

          {/* FEATURED HERO POST (IF NOT FILTERING BY SEARCH) */}
          {featuredPost && !searchQuery && filterCategory === 'all' && (() => {
            const featuredCover = (featuredPost.coverImage || featuredPost.image || '').trim();
            return (
              <div
                onClick={() => openTopicDetail(featuredPost)}
                className="group relative bg-white rounded-3xl border border-[#c5a059]/35 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-0"
              >
                {/* Featured Cover Image (if available) */}
                {featuredCover ? (
                  <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-slate-900">
                    <img
                      src={featuredCover}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#c5a059] text-white tracking-wider uppercase shadow-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span>
                        <span>Seçilmiş Məqalə</span>
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* Featured Post Meta & Info */}
                <div className={`${featuredCover ? 'lg:col-span-5' : 'col-span-12'} p-7 sm:p-10 flex flex-col justify-between bg-white space-y-6`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {!featuredCover && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#c5a059] text-white tracking-wider uppercase shadow-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">star</span>
                          <span>Seçilmiş Məqalə</span>
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#c5a059]/15 text-[#775a19] uppercase tracking-wider">
                        #{featuredPost.badge || 'Psixologiya'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">• {featuredPost.readTime || '5 dəqiqə'}</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#071326] group-hover:text-[#775a19] transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-4 leading-relaxed font-light">
                      {(featuredPost.snippet || featuredPost.content || '').replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#071326] text-[#e5c57d] font-bold text-xs flex items-center justify-center">
                        {(featuredPost.author || 'M')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#071326] leading-tight">{featuredPost.author || 'Müəllif'}</p>
                        <p className="text-[11px] text-slate-400">{featuredPost.time || 'İndicə'}</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#775a19] group-hover:translate-x-1 transition-transform">
                      <span>Oxu</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* POSTS LISTING: GRID OR LIST VIEW */}
          {filteredTopics.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#c5a059]/15 text-[#775a19] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">article</span>
              </div>
              <h4 className="font-serif text-xl font-medium text-[#071326] mb-2">Axtarışa uyğun məqalə tapılmadı</h4>
              <p className="text-sm text-slate-500 mb-6 font-light">Digər kateqoriyalara baxa və ya öz məqalənizi yarada bilərsiniz.</p>
              <button
                onClick={handleCreateArticle}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] text-xs font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer"
              >
                Yeni Məqalə Yaz
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* BLOG CARDS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredTopics.map((post) => {
                const title = getLocalized(post, 'title', currentLang, defaultLang) || post.title;
                const plainSnippet = (post.snippet || post.content || '').replace(/<[^>]*>?/gm, '');
                const cover = (post.coverImage || post.image || '').trim();
                const readDuration = post.readTime || '3 dəqiqə';

                return (
                  <article
                    key={post.id}
                    onClick={() => openTopicDetail(post)}
                    className="group bg-white rounded-3xl border border-[#c5a059]/25 hover:border-[#c5a059]/60 shadow-[0_4px_20px_-4px_rgba(7,19,38,0.05)] hover:shadow-[0_16px_36px_-8px_rgba(7,19,38,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                  >
                    {/* Top Gold Stripe if card has no cover image */}
                    {!cover && (
                      <div className="h-1.5 w-full bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19]" />
                    )}

                    {/* Card Thumbnail ONLY if cover exists */}
                    {cover ? (
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <img
                          src={cover}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#071326]/85 backdrop-blur-sm text-[#e5c57d] border border-[#c5a059]/40 uppercase tracking-wider">
                            #{post.badge || 'Bloq'}
                          </span>
                        </div>
                        {post.status === 'draft' && (
                          <div className="absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                            Qaralama
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {!cover && (
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a059]/15 text-[#775a19] uppercase tracking-wider">
                              #{post.badge || 'Bloq'}
                            </span>
                            {post.status === 'draft' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                                Qaralama
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <span>{post.time || 'İndicə'}</span>
                          <span>•</span>
                          <span>{readDuration} oxu</span>
                        </div>

                        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#071326] group-hover:text-[#775a19] transition-colors leading-snug line-clamp-2">
                          {title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-light">
                          {plainSnippet}
                        </p>
                      </div>

                      {/* Author & Footer Meta */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-[#071326] font-bold text-xs flex items-center justify-center border border-slate-200">
                            {(post.author || 'M')[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 text-xs truncate max-w-[120px]">
                            {post.author || 'Üzv'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              likeTopic(post.id);
                            }}
                            className={`flex items-center gap-1 transition-colors ${
                              isTopicLiked(post.id) ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                            }`}
                          >
                            <span className={`material-symbols-outlined text-[15px] ${isTopicLiked(post.id) ? 'fill-current' : ''}`}>
                              favorite
                            </span>
                            <span>{post.likes || 0}</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">chat_bubble</span>
                            <span>{post.comments?.length || post.repliesCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* BLOG LIST VIEW */
            <div className="space-y-5">
              {filteredTopics.map((post) => {
                const title = getLocalized(post, 'title', currentLang, defaultLang) || post.title;
                const plainSnippet = (post.snippet || post.content || '').replace(/<[^>]*>?/gm, '');
                const cover = (post.coverImage || post.image || '').trim();

                return (
                  <article
                    key={post.id}
                    onClick={() => openTopicDetail(post)}
                    className="group bg-white rounded-3xl border border-[#c5a059]/25 hover:border-[#c5a059]/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center gap-6 cursor-pointer"
                  >
                    {/* List item thumbnail ONLY if cover exists */}
                    {cover ? (
                      <div className="w-full sm:w-48 sm:h-36 h-48 rounded-2xl overflow-hidden shrink-0 bg-slate-900">
                        <img
                          src={cover}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null}

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c5a059]/15 text-[#775a19] uppercase tracking-wider">
                          #{post.badge || 'Bloq'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{post.time || 'İndicə'} • {post.readTime || '3 dəqiqə'}</span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-medium text-[#071326] group-hover:text-[#775a19] transition-colors leading-snug">
                        {title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {plainSnippet}
                      </p>

                      <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                        <span>Müəllif: <strong>{post.author || 'Üzv'}</strong></span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-rose-500">favorite</span>
                            <span>{post.likes || 0}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">chat_bubble</span>
                            <span>{post.comments?.length || post.repliesCount || 0}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

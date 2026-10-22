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
    categoriesList,
    getCategoryLabel
  } = useApp();

  const community = homeContent?.community || {};
  const [filterTag, setFilterTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const safeTopics = Array.isArray(communityTopics) ? communityTopics : [];

  // Extract tags from topics (supports badges, categories, and tags)
  const allTags = Array.from(
    new Set(
      safeTopics.flatMap(t => {
        if (!t) return [];
        const result = [];
        if (Array.isArray(t.tags)) result.push(...t.tags);
        if (typeof t.tag === 'string') result.push(t.tag);
        if (typeof t.badge === 'string') result.push(t.badge.replace('📌 ', '').trim());
        if (typeof t.category === 'string') result.push(t.category);
        return result;
      }).filter(Boolean)
    )
  );

  const filteredTopics = safeTopics.filter(t => {
    if (!t) return false;
    const cleanBadge = (t.badge || '').replace('📌 ', '').trim();
    const matchesTag = filterTag === 'all' ||
      cleanBadge === filterTag ||
      t.badge === filterTag ||
      t.category === filterTag ||
      (Array.isArray(t.tags) && t.tags.includes(filterTag)) ||
      t.tag === filterTag;

    const title = getLocalized(t, 'title', currentLang, defaultLang) || t.title || '';
    const desc = getLocalized(t, 'snippet', currentLang, defaultLang) || getLocalized(t, 'desc', currentLang, defaultLang) || t.snippet || t.desc || t.content || '';
    const author = t.author || '';
    const badge = t.badge || '';

    const matchesSearch = !searchQuery.trim() ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  }).sort((a, b) => {
    const aWeekly = Boolean(a.isWeekly || (typeof a.badge === 'string' && a.badge.includes('Həftənin Mövzusu')));
    const bWeekly = Boolean(b.isWeekly || (typeof b.badge === 'string' && b.badge.includes('Həftənin Mövzusu')));
    if (aWeekly !== bWeekly) return aWeekly ? -1 : 1;
    const aPin = Boolean(a.pinned || (typeof a.badge === 'string' && a.badge.includes('📌')));
    const bPin = Boolean(b.pinned || (typeof b.badge === 'string' && b.badge.includes('📌')));
    if (aPin === bPin) return 0;
    return aPin ? -1 : 1;
  });

  const weeklyTopic = safeTopics.find(t => t.id === community.weeklyTopicId || t.isWeekly || t.badge?.includes('Həftənin Mövzusu'));

  const handleCreateTopic = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setNewTopicModalOpen(true);
    }
  };

  const handleWeeklyTopicClick = () => {
    if (weeklyTopic) {
      openTopicDetail(weeklyTopic);
    } else {
      handleCreateTopic();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Editorial Page Hero */}
      <PageHero
        badge={getLocalized(community, 'badge', currentLang, defaultLang) || 'İntellektual Şəbəkə'}
        title={getLocalized(community, 'title', currentLang, defaultLang) || 'Düşüncə və Təcrübə Mübadiləsi'}
        description={getLocalized(community, 'desc', currentLang, defaultLang) || 'Akademiyamızın tələbələri və klub rezidentləri üçün gündəlik fəlsəfi dialoq, dərin suallar və daxili kəşflər sahəsi.'}
        breadcrumbs={[{ label: 'İcma' }]}
        adminCmsBlock="community"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#c5a059]/20">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
              <span className="material-symbols-outlined text-[#775a19] text-[18px]">
                {community.heroBadge1Icon || 'verified_user'}
              </span>
              <span className="font-medium">{getLocalized(community, 'heroBadge1Text', currentLang, defaultLang) || 'Konfidensiallıq və Qarşılıqlı Hörmət'}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
              <span className="material-symbols-outlined text-[#775a19] text-[18px]">
                {community.heroBadge2Icon || 'psychology'}
              </span>
              <span className="font-medium">{getLocalized(community, 'heroBadge2Text', currentLang, defaultLang) || 'Moderasiya Olunan Dərin Dialoq'}</span>
            </div>
          </div>

          <button
            onClick={handleCreateTopic}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg group/btn"
          >
            <span className="material-symbols-outlined text-[17px] text-[#e5c57d] group-hover/btn:scale-110 transition-transform">add_circle</span>
            <span>{getLocalized(community, 'newTopicBtnText', currentLang, defaultLang) || 'Yeni Mövzu Başlat'}</span>
          </button>
        </div>
      </PageHero>

      {/* Main Section */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[950px] h-[650px] bg-gradient-to-b from-[#c5a059]/7 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Topics Feed (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Search & Tag Filter Toolbar */}
              <div className="bg-white/80 backdrop-blur-md border border-[#c5a059]/25 rounded-2xl p-5 shadow-[0_10px_30px_-10px_rgba(7,19,38,0.05)] space-y-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#775a19]">search</span>
                  <input
                    type="text"
                    placeholder="Mövzu və ya müəllif axtar..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-[#faf8f5] border border-[#c5a059]/30 focus:border-[#775a19] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20 outline-none transition-all placeholder-[#94a3b8] text-[#071326]"
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

                {allTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => setFilterTag('all')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                        filterTag === 'all'
                          ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-sm border border-[#c5a059]/40'
                          : 'bg-[#faf8f5] text-[#475569] hover:text-[#071326] hover:bg-white border border-[#e2e8f0]'
                      }`}
                    >
                      Bütün Mövzular ({safeTopics.length})
                    </button>
                    {allTags.map(tag => {
                      const isActive = filterTag === tag;
                      return (
                        <button
                          key={tag}
                          onClick={() => setFilterTag(tag)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-sm border border-[#c5a059]/40'
                              : 'bg-[#faf8f5] text-[#475569] hover:text-[#071326] hover:bg-white border border-[#e2e8f0]'
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Topics List */}
              {filteredTopics.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-12 text-center shadow-[0_15px_40px_-15px_rgba(7,19,38,0.07)]">
                  <div className="w-16 h-16 rounded-2xl bg-[#c5a059]/15 text-[#775a19] flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">forum</span>
                  </div>
                  <h4 className="font-serif text-xl font-medium text-[#071326] mb-2">Heç bir mövzu tapılmadı</h4>
                  <p className="text-sm text-[#64748b] mb-6 font-light">İlk intellektual mövzunu başlatmaq üçün aşağıdakı düyməyə klikləyin.</p>
                  <button
                    onClick={handleCreateTopic}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] text-xs font-semibold tracking-wider uppercase shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Yeni Mövzu Başlat
                  </button>
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const title = getLocalized(topic, 'title', currentLang, defaultLang) || topic.title;
                  const desc = getLocalized(topic, 'snippet', currentLang, defaultLang) || getLocalized(topic, 'desc', currentLang, defaultLang) || topic.snippet || topic.desc || topic.content || '';
                  const badge = getLocalized(topic, 'badge', currentLang, defaultLang) || topic.badge || topic.category || topic.tag;

                  return (
                    <div
                      key={topic.id}
                      className="group relative bg-white rounded-3xl border border-[#c5a059]/25 hover:border-[#c5a059]/60 shadow-[0_6px_25px_-6px_rgba(7,19,38,0.06)] hover:shadow-[0_15px_35px_-10px_rgba(7,19,38,0.12)] hover:-translate-y-0.5 transition-all duration-300 p-7 sm:p-8 overflow-hidden"
                    >
                      {/* Top Gold Ambient Sheen on Pinned or Hover */}
                      <div className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19] ${topic.pinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`} />

                      {/* Topic Header */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                            {topic.author?.charAt(0) || 'R'}
                          </div>
                          <div>
                            <span className="font-semibold text-xs sm:text-sm text-[#071326] block leading-tight">{topic.author || 'Rezident'}</span>
                            <span className="text-[11px] text-[#64748b] block">{topic.time || topic.time_ago || topic.date || 'İndicə'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {topic.pinned && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/30 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">push_pin</span>
                              <span>Sabitlənib</span>
                            </span>
                          )}
                          {badge && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#775a19] uppercase tracking-wider">
                              #{badge.replace('📌 ', '')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <h3 
                        onClick={() => openTopicDetail(topic)}
                        className="font-serif text-xl sm:text-2xl font-medium text-[#071326] mb-3 leading-snug group-hover:text-[#775a19] transition-colors cursor-pointer"
                      >
                        {title}
                      </h3>
                      <p 
                        onClick={() => openTopicDetail(topic)}
                        className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6 font-light cursor-pointer hover:text-slate-800 transition-colors"
                      >
                        {desc}
                      </p>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#e2d9c8]/70 text-xs text-[#64748b]">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => openTopicDetail(topic)}
                            className="flex items-center gap-1.5 hover:text-[#071326] transition-colors cursor-pointer"
                            title="Şərhləri oxu və ya yaz"
                          >
                            <span className="material-symbols-outlined text-[16px] text-[#775a19]">forum</span>
                            <span className="font-medium">{topic.comments?.length || topic.repliesCount || topic.replies || topic.commentsCount || 0} şərh</span>
                          </button>
                          <button
                            onClick={() => likeTopic(topic.id)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer px-2 py-0.5 rounded-md ${
                              isTopicLiked(topic.id)
                                ? 'text-rose-600 bg-rose-50 font-bold'
                                : 'hover:text-rose-600'
                            }`}
                            title={isTopicLiked(topic.id) ? 'Bəyənməni geri götür' : 'Bəyən'}
                          >
                            <span className={`material-symbols-outlined text-[16px] ${isTopicLiked(topic.id) ? 'text-rose-600 fill-current' : 'text-rose-500/80'}`}>
                              {isTopicLiked(topic.id) ? 'favorite' : 'favorite_border'}
                            </span>
                            <span className="font-medium">{topic.likes || 0} bəyənmə</span>
                          </button>
                        </div>

                        {topic.allowComments === false ? (
                          <span className="text-[#94a3b8] text-xs italic flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            <span>Rəylərə bağlıdır</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => openTopicDetail(topic)}
                            className="text-[#775a19] hover:text-[#071326] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Ətraflı oxu & Cavab yaz</span>
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Community Guidelines & Moderator Info */}
            <div className="space-y-8">
              
              {/* Community Rules Card */}
              <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-7 sm:p-8 shadow-[0_10px_30px_-10px_rgba(7,19,38,0.05)]">
                <div className="flex items-center gap-2.5 mb-5 text-[#071326]">
                  <span className="material-symbols-outlined text-[#775a19] text-2xl">
                    {community.rulesIcon || 'shield'}
                  </span>
                  <h4 className="font-serif text-lg font-medium">
                    {getLocalized(community, 'rulesTitle', currentLang, defaultLang) || 'İcma Etikası və Qaydaları'}
                  </h4>
                </div>
                <div className="space-y-4 text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#775a19] text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>
                      <strong className="text-[#071326] font-semibold">{getLocalized(community, 'rule1Title', currentLang, defaultLang) || 'Məxfilik prinsipi:'} </strong>
                      {getLocalized(community, 'rule1Desc', currentLang, defaultLang) || 'Müzakirə olunan şəxsi təcrübələr və etiraflar icmadan kənara çıxarılmır.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#775a19] text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>
                      <strong className="text-[#071326] font-semibold">{getLocalized(community, 'rule2Title', currentLang, defaultLang) || 'Konstruktiv yanaşma:'} </strong>
                      {getLocalized(community, 'rule2Desc', currentLang, defaultLang) || 'Qınaq və mühakimə yoxdur; hər fikir təkamül nöqteyi-nəzərindən dinlənilir.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#775a19] text-[18px] shrink-0 mt-0.5">check_circle</span>
                    <span>
                      <strong className="text-[#071326] font-semibold">{getLocalized(community, 'rule3Title', currentLang, defaultLang) || 'Səthilikdən uzaq:'} </strong>
                      {getLocalized(community, 'rule3Desc', currentLang, defaultLang) || 'Siyasi, polemik və ya kommersiya xarakterli paylaşımlar qadağandır.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Discussion Theme in Velvet Obsidian */}
              <div className="rounded-3xl bg-gradient-to-br from-[#071326] via-[#0a1932] to-[#040e1c] border border-[#c5a059]/30 p-7 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-52 h-52 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e5c57d] text-[10px] font-bold tracking-widest uppercase mb-3">
                    <span className="material-symbols-outlined text-[13px]">psychology</span>
                    <span>{getLocalized(community, 'weeklyBadge', currentLang, defaultLang) || 'Həftənin Fəlsəfi Mövzusu'}</span>
                  </div>
                  <h4 className="font-serif text-lg sm:text-xl font-medium text-white mb-2 leading-snug">
                    {getLocalized(community, 'weeklyTitle', currentLang, defaultLang) || '"Daxili təzyiq qarşısında şüurlu müşahidəçi qalmaq necə mümkündür?"'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] font-light leading-relaxed mb-6">
                    {getLocalized(community, 'weeklyDesc', currentLang, defaultLang) || 'Bu həftə mentorlarımızın fasilitasiyası ilə emosional reaktivliyi idarə etməyin nevrobioloji yollarını müzakirə edirik.'}
                  </p>
                  <button
                    onClick={handleWeeklyTopicClick}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#b38f46] text-[#071326] font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#c5a059]/20 hover:shadow-xl hover:shadow-[#c5a059]/35 hover:scale-[1.02] active:scale-[0.98] transition-all text-center cursor-pointer"
                  >
                    {weeklyTopic ? 'Müzakirəni Aç və Şərh Yaz' : (getLocalized(community, 'weeklyBtnText', currentLang, defaultLang) || 'Müzakirəyə Qoşul')}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}


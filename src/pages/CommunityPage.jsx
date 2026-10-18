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
    const aPin = Boolean(a.pinned || (typeof a.badge === 'string' && a.badge.includes('📌')));
    const bPin = Boolean(b.pinned || (typeof b.badge === 'string' && b.badge.includes('📌')));
    if (aPin === bPin) return 0;
    return aPin ? -1 : 1;
  });

  const handleCreateTopic = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else {
      setNewTopicModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        badge={getLocalized(community, 'badge', currentLang, defaultLang) || 'İntellektual Şəbəkə'}
        title={getLocalized(community, 'title', currentLang, defaultLang) || 'Düşüncə və Təcrübə Mübadiləsi'}
        description={getLocalized(community, 'desc', currentLang, defaultLang) || 'Akademiyamızın tələbələri və klub rezidentləri üçün gündəlik fəlsəfi dialoq, dərin suallar və daxili kəşflər sahəsi.'}
        breadcrumbs={[{ label: 'İcma' }]}
        adminCmsBlock="community"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-outline-variant/40">
          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                {community.heroBadge1Icon || 'verified_user'}
              </span>
              <span>{getLocalized(community, 'heroBadge1Text', currentLang, defaultLang) || 'Konfidensiallıq və Qarşılıqlı Hörmət'}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-outline-variant" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                {community.heroBadge2Icon || 'psychology'}
              </span>
              <span>{getLocalized(community, 'heroBadge2Text', currentLang, defaultLang) || 'Moderasiya Olunan Dərin Dialoq'}</span>
            </div>
          </div>

          <button
            onClick={handleCreateTopic}
            className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>{getLocalized(community, 'newTopicBtnText', currentLang, defaultLang) || 'Yeni Mövzu Başlat'}</span>
          </button>
        </div>
      </PageHero>

      {/* Main Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Topics Feed (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Search & Tag Filter Bar */}
              <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 space-y-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
                  <input
                    type="text"
                    placeholder="Mövzu və ya müəllif axtar..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded bg-surface border border-outline-variant focus:border-secondary focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {allTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <button
                      onClick={() => setFilterTag('all')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        filterTag === 'all'
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      Bütün Mövzular ({safeTopics.length})
                    </button>
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setFilterTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          filterTag === tag
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-surface-container text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Topics List */}
              {filteredTopics.length === 0 ? (
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">forum</span>
                  <h4 className="font-bold text-sm text-primary mb-1">Heç bir mövzu tapılmadı</h4>
                  <p className="text-xs text-on-surface-variant mb-4">İlk mövzunu başlatmaq üçün aşağıdakı düyməyə klikləyin.</p>
                  <button
                    onClick={handleCreateTopic}
                    className="px-4 py-2 rounded bg-secondary text-on-secondary text-xs font-semibold"
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
                      className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 hover:border-secondary transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {/* Topic Header */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                            {topic.author?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-xs text-primary block leading-tight">{topic.author || 'Rezident'}</span>
                            <span className="text-[10px] text-outline block">{topic.time || topic.time_ago || topic.date || 'İndicə'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {topic.pinned && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 flex items-center gap-1 uppercase tracking-wider">
                              <span className="material-symbols-outlined text-[13px]">push_pin</span>
                              <span>Sabitlənib</span>
                            </span>
                          )}
                          {badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary uppercase tracking-wider">
                              #{badge.replace('📌 ', '')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title & Desc */}
                      <h3 className="font-serif text-base sm:text-lg font-bold text-primary mb-2 hover:text-secondary transition-colors cursor-pointer">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
                        {desc}
                      </p>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 text-xs text-on-surface-variant">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-secondary">forum</span>
                            <span>{topic.repliesCount || topic.replies || topic.commentsCount || 0} şərh</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-outline">favorite</span>
                            <span>{topic.likes || 0} bəyənmə</span>
                          </span>
                        </div>

                        {topic.allowComments === false ? (
                          <span className="text-outline text-xs italic flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            <span>Rəylərə bağlıdır</span>
                          </span>
                        ) : (
                          <button
                            onClick={handleCreateTopic}
                            className="text-secondary hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Cavab yaz</span>
                            <span className="material-symbols-outlined text-[14px]">reply</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Community Guidelines & Moderator Info */}
            <div className="space-y-6">
              
              {/* Community Rules Card */}
              <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <span className="material-symbols-outlined text-secondary text-xl">
                    {community.rulesIcon || 'shield'}
                  </span>
                  <h4 className="font-serif text-base font-bold">
                    {getLocalized(community, 'rulesTitle', currentLang, defaultLang) || 'İcma Etikası və Qaydaları'}
                  </h4>
                </div>
                <div className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span>
                      <strong>{getLocalized(community, 'rule1Title', currentLang, defaultLang) || 'Məxfilik prinsipi:'} </strong>
                      {getLocalized(community, 'rule1Desc', currentLang, defaultLang) || 'Müzakirə olunan şəxsi təcrübələr və etiraflar icmadan kənara çıxarılmır.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span>
                      <strong>{getLocalized(community, 'rule2Title', currentLang, defaultLang) || 'Konstruktiv yanaşma:'} </strong>
                      {getLocalized(community, 'rule2Desc', currentLang, defaultLang) || 'Qınaq və mühakimə yoxdur; hər fikir təkamül nöqteyi-nəzərindən dinlənilir.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span>
                      <strong>{getLocalized(community, 'rule3Title', currentLang, defaultLang) || 'Səthilikdən uzaq:'} </strong>
                      {getLocalized(community, 'rule3Desc', currentLang, defaultLang) || 'Siyasi, polemik və ya kommersiya xarakterli paylaşımlar qadağandır.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Discussion Theme */}
              <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-6">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
                  {getLocalized(community, 'weeklyBadge', currentLang, defaultLang) || 'Həftənin Fəlsəfi Mövzusu'}
                </span>
                <h4 className="font-serif text-lg font-bold text-primary mb-2">
                  {getLocalized(community, 'weeklyTitle', currentLang, defaultLang) || '"Daxili təzyiq qarşısında şüurlu müşahidəçi qalmaq necə mümkündür?"'}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {getLocalized(community, 'weeklyDesc', currentLang, defaultLang) || 'Bu həftə mentorlarımızın fasilitasiyası ilə emosional reaktivliyi idarə etməyin nevrobioloji yollarını müzakirə edirik.'}
                </p>
                <button
                  onClick={handleCreateTopic}
                  className="w-full py-2 px-3 rounded-lg bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary/90 transition-all text-center cursor-pointer shadow-sm"
                >
                  {getLocalized(community, 'weeklyBtnText', currentLang, defaultLang) || 'Müzakirəyə Qoşul'}
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}

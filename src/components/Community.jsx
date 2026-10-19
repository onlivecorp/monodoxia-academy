import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Community() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    communityTopics,
    likeTopic,
    setNewTopicModalOpen,
    homeContent,
    currentUser,
    setAuthModalOpen,
    setAuthModalTab,
    showToast,
    openApplication,
    applicationsList
  } = useApp();
  const community = homeContent?.community || {};

  const userCommunityApp = currentUser
    ? applicationsList.find(a => a.userId === currentUser.id && (a.targetType === 'community' || a.targetType === 'forum') && !a.archived)
    : null;

  const handleOpenNewTopic = () => {
    if (!currentUser) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      showToast('Forumda mövzu açmaq üçün zəhmət olmasa daxil olun və ya qeydiyyatdan keçin.', 'warning');
      return;
    }
    setNewTopicModalOpen(true);
  };

  const defaultBullets = [];
  const bullets = community.bullets && community.bullets.length > 0 ? community.bullets : defaultBullets;

  const badgeText = getLocalized(community, 'badge', currentLang, defaultLang) || '';
  const titleText = getLocalized(community, 'title', currentLang, defaultLang) || '';
  const descText = getLocalized(community, 'desc', currentLang, defaultLang) || '';

  const topicsList = communityTopics || [];

  if (!titleText && topicsList.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="icma">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 -right-32 w-[38rem] h-[38rem] rounded-full bg-gradient-to-bl from-[#c5a059]/10 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-[#0a192f]/5 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #070f1e 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-5 space-y-6">
            {badgeText && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/70 backdrop-blur-md shadow-sm anim-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9e782f]"></span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
                  {badgeText}
                </span>
              </div>
            )}

            {titleText && (
              <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2] anim-community-title">
                {titleText}
              </h2>
            )}

            {descText && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal anim-subtext">
                {descText}
              </p>
            )}

            {bullets.length > 0 && (
              <div className="space-y-3.5 pt-2">
                {bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-7 h-7 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#775a19] flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[15px]">{i === 0 ? 'verified_user' : 'forum'}</span>
                    </div>
                    <span className="font-medium">{b}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                onClick={handleOpenNewTopic}
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#070f1e] hover:bg-[#112240] text-white text-xs font-semibold uppercase tracking-[0.16em] border border-[#c5a059]/40 shadow-lg shadow-[#070f1e]/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <span>{getLocalized(community, 'newTopicBtnText', currentLang, defaultLang) || 'Yeni Mövzu'}</span>
                <span className="material-symbols-outlined text-[16px] text-[#c5a059]">edit_note</span>
              </button>
            </div>
          </div>

          {/* RIGHT TOPICS LIST */}
          {topicsList.length > 0 && (
            <div className="lg:col-span-7 space-y-4">
              {[...topicsList].sort((a, b) => {
                const aPin = Boolean(a.pinned || (typeof a.badge === 'string' && a.badge.includes('📌')));
                const bPin = Boolean(b.pinned || (typeof b.badge === 'string' && b.badge.includes('📌')));
                if (aPin === bPin) return 0;
                return aPin ? -1 : 1;
              }).map(topic => (
                <div
                  key={topic.id}
                  className="group relative bg-white/85 hover:bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d9c8]/75 hover:border-[#c5a059]/70 shadow-sm hover:shadow-2xl hover:shadow-[#c5a059]/12 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Top Ambient Shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {topic.pinned && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-300/40 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">push_pin</span>
                          <span>Sabit</span>
                        </span>
                      )}
                      {(getLocalized(topic, 'badge', currentLang, defaultLang) || topic.badge) && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#c5a059]/15 text-[#775a19] border border-[#c5a059]/30">
                          {getLocalized(topic, 'badge', currentLang, defaultLang) || topic.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400">{topic.time || topic.time_ago || ''}</span>
                  </div>

                  <h4 className="font-serif text-xl sm:text-[1.3rem] font-semibold text-[#070f1e] group-hover:text-[#775a19] transition-colors leading-snug my-2.5">
                    "{getLocalized(topic, 'title', currentLang, defaultLang) || topic.title}"
                  </h4>

                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal mb-4">
                    {getLocalized(topic, 'snippet', currentLang, defaultLang) || getLocalized(topic, 'desc', currentLang, defaultLang) || topic.snippet || topic.desc || topic.content}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#e2d9c8]/50 text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#c5a059]">person</span>
                      <span>Müəllif: <strong className="text-[#070f1e] font-semibold">{topic.author}</strong></span>
                    </span>

                    <div className="flex items-center gap-4 text-slate-500">
                      <button
                        onClick={() => likeTopic(topic.id)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
                        title="Bəyən"
                      >
                        <span className="material-symbols-outlined text-[16px] text-red-500/80">favorite</span>
                        <span className="font-semibold text-slate-700">{topic.likes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-[#c5a059]">chat_bubble</span>
                        <span className="font-semibold text-slate-700">{topic.repliesCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

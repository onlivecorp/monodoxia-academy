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

  const defaultBullets = [
    "Konfidensiallıq və qarşılıqlı hörmət etikası",
    "Hər həftə yeni fəlsəfi və psixoloji mövzu müzakirəsi"
  ];
  const bullets = community.bullets && community.bullets.length > 0 ? community.bullets : defaultBullets;

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface-container-low border-b border-outline-variant/40" id="icma">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
              {getLocalized(community, 'badge', currentLang, defaultLang) || t('community_badge')}
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
              {getLocalized(community, 'title', currentLang, defaultLang) || t('community_title')}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {getLocalized(community, 'desc', currentLang, defaultLang) || t('community_desc')}
            </p>
            <div className="space-y-3 pt-2">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-secondary">{i === 0 ? 'verified_user' : 'forum'}</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleOpenNewTopic}
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-primary-container text-on-primary hover:bg-[#112240] text-label-md font-label-md transition-colors shadow-sm"
              >
                <span>{getLocalized(community, 'newTopicBtnText', currentLang, defaultLang) || t('community_new_topic')}</span>
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
              </button>
              <button
                onClick={() => openApplication({ id: 'forum-vip', title: 'VIP İntellektual Dialoq Qrupu', price: 'Pulsuz' }, 'community')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded border border-secondary text-primary hover:bg-secondary/10 text-label-md font-label-md transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">group_add</span>
                <span>{userCommunityApp ? `İcma Statusu: ${userCommunityApp.status}` : 'İcmaya Müraciət Et'}</span>
              </button>
            </div>
          </div>

          {/* TOPICS LIST */}
          <div className="lg:col-span-7 space-y-4">
            {communityTopics.map(topic => (
              <div
                key={topic.id}
                className="bg-surface-container-lowest p-5 rounded border border-outline-variant/60 shadow-sm hover:border-secondary/50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-outline mb-2">
                  <span className={topic.badgeClass}>
                    {getLocalized(topic, 'badge', currentLang, defaultLang)}
                  </span>
                  <span>{topic.time}</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-primary mb-1">
                  "{getLocalized(topic, 'title', currentLang, defaultLang)}"
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                  {getLocalized(topic, 'snippet', currentLang, defaultLang)}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                  <span className="text-on-surface-variant font-medium">Müəllif: {topic.author}</span>
                  <div className="flex items-center gap-4 text-outline">
                    <button
                      onClick={() => likeTopic(topic.id)}
                      className="flex items-center gap-1 hover:text-secondary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">favorite</span>
                      <span>{topic.likes}</span>
                    </button>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      <span>{topic.repliesCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

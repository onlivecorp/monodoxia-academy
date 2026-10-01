import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Academy() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { progress, openPlayer, coursesList, homeContent, openApplication, currentUser, applicationsList, categoriesList, getCategoryLabel } = useApp();
  const academy = homeContent?.academy || {};
  const [filter, setFilter] = useState('all');

  const filteredCourses = filter === 'all'
    ? coursesList
    : coursesList.filter(c => c.category === filter);

  const courseCategories = (categoriesList || []).filter(c => c.type === 'course' || c.type === 'all');

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface-container-low border-b border-outline-variant/40" id="akademiya">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
              {getLocalized(academy, 'badge', currentLang, defaultLang) || t('academy_badge')}
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif mt-1">
              {getLocalized(academy, 'title', currentLang, defaultLang) || t('academy_title')}
            </h2>
          </div>
          {/* Segmented Filter Tabs - Centralized Taxonomy */}
          <div className="flex flex-wrap gap-2 border-b border-outline-variant/60 pb-2">
            {[
              { id: 'all', label: t('filter_all') },
              ...courseCategories.map(cat => ({
                id: cat.key,
                label: getCategoryLabel(cat.key, currentLang)
              }))
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded text-label-md font-label-md transition-colors ${
                  filter === tab.id
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCourses.map(c => {
            const prog = progress[c.id] ? progress[c.id].percent : 0;
            const courseTitle = getLocalized(c, 'title', currentLang, defaultLang);
            const courseDesc = getLocalized(c, 'description', currentLang, defaultLang);
            const courseBadge = getLocalized(c, 'badge', currentLang, defaultLang);
            const courseStatus = getLocalized(c, 'status', currentLang, defaultLang);

            return (
              <div
                key={c.id}
                className={`bg-surface-container-lowest rounded ${
                  c.featured ? 'border-t-2 border-t-secondary' : ''
                } border-x border-b border-outline-variant/60 p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded ${c.badgeClass || 'bg-secondary/10 text-secondary'} font-label-sm text-label-sm font-semibold tracking-wider uppercase`}>
                        {courseBadge}
                      </span>
                      {c.category && (
                        <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium tracking-wide">
                          {getCategoryLabel(c.category, currentLang)}
                        </span>
                      )}
                    </div>
                    <span className="font-label-sm text-label-sm text-outline">{c.duration}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary font-serif mb-2">
                    {courseTitle}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                    {courseDesc}
                  </p>
                </div>
                <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">
                      Aparıcı Kouç: <strong className="text-primary font-medium">{c.instructor}</strong>
                    </span>
                    <span className="text-secondary font-semibold">{courseStatus}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-outline mb-1">
                      <span>Tələbə tərəqqisi</span>
                      <span>{prog}% tamamlandı</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${prog}%` }}></div>
                    </div>
                  </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-headline-sm text-headline-sm text-primary font-serif">{c.price}</span>
                      {(() => {
                        const userApp = currentUser
                          ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === c.id && !a.archived)
                          : null;

                        if (prog > 0 || userApp?.status === 'Təsdiqləndi' || userApp?.status === 'Tamamlandı') {
                          return (
                            <button
                              onClick={() => openPlayer(c.id)}
                              className="px-5 py-2 rounded bg-primary-container text-on-primary hover:bg-[#112240] text-label-md font-label-md transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <span>{prog > 0 ? t('course_continue') : 'Dərslərə Başla'}</span>
                              <span className="material-symbols-outlined text-[16px]">play_circle</span>
                            </button>
                          );
                        }

                        if (userApp) {
                          const statusColor = userApp.status === 'Baxılır'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : (userApp.status === 'Gözləmədə' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200');

                          return (
                            <button
                              onClick={() => openApplication(c, 'course')}
                              className={`px-4 py-2 rounded text-xs font-bold border transition-colors flex items-center gap-1.5 ${statusColor}`}
                            >
                              <span className="material-symbols-outlined text-[15px]">pending_actions</span>
                              <span>Müraciət: {userApp.status}</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={() => openApplication(c, 'course')}
                            className="px-5 py-2 rounded bg-primary-container text-on-primary hover:bg-[#112240] text-label-md font-label-md transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <span>Müraciət Et</span>
                            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        <div className="mt-12 text-center">
          <a
            className="inline-flex items-center gap-2 border border-secondary text-primary hover:bg-secondary/10 px-8 py-3 rounded text-label-md font-label-md tracking-wider transition-colors"
            href="#akademiya"
          >
            <span>Bütün kurslara bax ({coursesList.length} Proqram)</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}

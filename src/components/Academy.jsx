import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Academy() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { progress, openPlayer, coursesList, homeContent, openApplication, currentUser, applicationsList, categoriesList, getCategoryLabel, navigateTo } = useApp();
  const academy = homeContent?.academy || {};
  const [filter, setFilter] = useState('all');

  const filteredCourses = filter === 'all'
    ? coursesList
    : coursesList.filter(c => c.category === filter);

  const courseCategories = (categoriesList || []).filter(c => c.type === 'course' || c.type === 'all');

  const badgeText = getLocalized(academy, 'badge', currentLang, defaultLang) || (academy.badge !== undefined && academy.badge !== null && String(academy.badge).trim() !== '' ? academy.badge : t('academy_badge'));
  const titleText = getLocalized(academy, 'title', currentLang, defaultLang) || (academy.title !== undefined && academy.title !== null && String(academy.title).trim() !== '' ? academy.title : t('academy_title'));
  const descText = getLocalized(academy, 'desc', currentLang, defaultLang) || (academy.desc !== undefined && academy.desc !== null && String(academy.desc).trim() !== '' ? academy.desc : '');
  const ctaText = getLocalized(academy, 'ctaText', currentLang, defaultLang) || (academy.ctaText !== undefined && academy.ctaText !== null && String(academy.ctaText).trim() !== '' ? academy.ctaText : '');

  return (
    <section className="relative overflow-hidden py-10 md:py-14 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="akademiya">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-[#c5a059]/10 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #070f1e 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER & FILTER TABS */}
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/70 backdrop-blur-md shadow-sm mb-3 anim-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e782f]"></span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
                {badgeText}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2] anim-academy-title">
              {titleText}
            </h2>
            {descText && (
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-4xl font-light leading-relaxed">
                {descText}
              </p>
            )}
          </div>

          {/* Category Select Box (Dropbox) */}
          <div className="relative w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#775a19] pointer-events-none">
              filter_list
            </span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-11 pr-11 py-3 text-sm rounded-xl bg-white/95 border border-[#c5a059]/40 focus:border-[#775a19] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20 outline-none transition-all text-[#071326] font-medium appearance-none cursor-pointer shadow-sm hover:border-[#c5a059]"
            >
              <option value="all">
                {t('filter_all') || 'Bütün Proqramlar'}
              </option>
              {courseCategories.map(cat => (
                <option key={cat.key} value={cat.key}>
                  {getCategoryLabel(cat.key, currentLang)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-[#775a19] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Course Cards / Empty State */}
        {filteredCourses.length === 0 ? (
          <div className="relative overflow-hidden p-10 sm:p-14 rounded-2xl bg-white/85 backdrop-blur-md border border-[#e2d9c8]/80 shadow-xl text-center max-w-xl mx-auto">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbf9f5] to-[#f5f0e6] border border-[#c5a059]/35 text-[#8a6a1f] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">school</span>
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-[#c5a059]/15 text-[#775a19] text-[10px] font-semibold tracking-widest uppercase mb-3">
              Yeni Qəbul Mövsümü
            </span>

            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#070f1e] mb-2">
              {getLocalized(academy, 'emptyTitle', currentLang, defaultLang) || (academy.emptyTitle || 'Hal-hazırda aktiv kurs mövcud deyil')}
            </h3>
            
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              {getLocalized(academy, 'emptyDesc', currentLang, defaultLang) || (academy.emptyDesc || 'Yeni proqramlar və qeydiyyat tarixləri tezliklə elan olunacaqdır. Fərdi proqramlar və mentorluq üçün bizimlə əlaqə saxlaya bilərsiniz.')}
            </p>

            {filter !== 'all' ? (
              <button
                onClick={() => setFilter('all')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#070f1e] text-white text-xs font-semibold tracking-wide shadow-md hover:bg-[#112240] transition-colors"
              >
                <span>{getLocalized(academy, 'resetFilterBtnText', currentLang, defaultLang) || (academy.resetFilterBtnText || 'Bütün Proqramları Göstər')}</span>
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo ? navigateTo('club') : null}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#070f1e] text-white text-xs font-semibold tracking-wide shadow-md hover:bg-[#112240] transition-colors"
              >
                <span>Zənginlər Klubu ilə tanış ol</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses.map(c => {
              const prog = progress[c.id] ? progress[c.id].percent : 0;
              const courseTitle = getLocalized(c, 'title', currentLang, defaultLang);
              const courseDesc = getLocalized(c, 'description', currentLang, defaultLang);
              const courseBadge = getLocalized(c, 'badge', currentLang, defaultLang);
              const defaultStatus = getLocalized(academy, 'defaultCourseStatus', currentLang, defaultLang) || academy.defaultCourseStatus || 'Qrup qəbulu aktivdir';
              const courseStatus = getLocalized(c, 'status', currentLang, defaultLang) || defaultStatus;
              const courseDuration = getLocalized(c, 'duration', currentLang, defaultLang) || c.duration;

              return (
                <div
                  key={c.id}
                  className={`group relative bg-white/85 hover:bg-white p-7 sm:p-8 rounded-2xl border ${
                    c.featured ? 'border-[#c5a059]/80 shadow-lg shadow-[#c5a059]/10' : 'border-[#e2d9c8]/75'
                  } hover:border-[#c5a059]/70 shadow-sm hover:shadow-2xl hover:shadow-[#c5a059]/12 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Top Ambient Hover Shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top Meta Strip */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {courseBadge && (
                          <span className={`px-3 py-1 rounded-full ${c.badgeClass || 'bg-[#c5a059]/15 text-[#775a19] border border-[#c5a059]/30'} text-[11px] font-semibold tracking-wider uppercase font-sans`}>
                            {courseBadge}
                          </span>
                        )}
                        {c.category && (
                          <span className="px-2.5 py-1 rounded-full bg-[#fbf9f5] border border-[#e2d9c8]/70 text-slate-600 text-[11px] font-medium tracking-wide">
                            {getCategoryLabel(c.category, currentLang)}
                          </span>
                        )}
                      </div>
                      {courseDuration && (
                        <span className="text-xs font-mono text-slate-500 font-medium">{courseDuration}</span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl font-semibold text-[#070f1e] group-hover:text-[#775a19] transition-colors mb-3 leading-snug">
                      {courseTitle}
                    </h3>

                    {/* Desc */}
                    {courseDesc && (
                      <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                        {courseDesc}
                      </p>
                    )}
                  </div>

                  {/* Card Footer & Action */}
                  <div className="space-y-4 pt-4 border-t border-[#e2d9c8]/60">
                    {(c.instructor || courseStatus) && (
                      <div className="flex items-center justify-between text-xs">
                        {c.instructor ? (
                          <span className="text-slate-600">
                            Aparıcı Kouç: <strong className="text-[#070f1e] font-semibold">{c.instructor}</strong>
                          </span>
                        ) : <span />}
                        {courseStatus && (
                          <span className="text-[#775a19] font-semibold px-2.5 py-0.5 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/25">
                            {courseStatus}
                          </span>
                        )}
                      </div>
                    )}



                    <div className="flex items-center justify-between pt-2">
                      {c.price ? (
                        <span className="font-serif text-2xl font-bold text-[#070f1e]">{c.price}</span>
                      ) : <span />}
                      {(() => {
                        const userApp = currentUser
                          ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === c.id && !a.archived)
                          : null;

                        if (prog > 0 || userApp?.status === 'Təsdiqləndi' || userApp?.status === 'Tamamlandı') {
                          return (
                            <button
                              onClick={() => openPlayer(c.id)}
                              className="px-6 py-2.5 rounded-lg bg-[#070f1e] hover:bg-[#112240] text-white text-xs font-semibold tracking-wide border border-[#c5a059]/40 transition-all duration-200 flex items-center gap-1.5 shadow-md cursor-pointer"
                            >
                              <span>{prog > 0 ? t('course_continue') : 'Dərslərə Başla'}</span>
                              <span className="material-symbols-outlined text-[16px] text-[#c5a059]">play_circle</span>
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
                              className={`px-4 py-2.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${statusColor}`}
                            >
                              <span className="material-symbols-outlined text-[15px]">pending_actions</span>
                              <span>Müraciət: {userApp.status}</span>
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={() => openApplication(c, 'course')}
                            className="px-6 py-2.5 rounded-lg bg-[#070f1e] hover:bg-[#112240] text-white text-xs font-semibold tracking-wide border border-[#c5a059]/40 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Müraciət Et</span>
                            <span className="material-symbols-outlined text-[16px] text-[#c5a059]">how_to_reg</span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {coursesList.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => navigateTo ? navigateTo('akademiya') : null}
              className="inline-flex items-center gap-2 border border-[#c5a059] text-[#070f1e] hover:bg-[#c5a059]/10 px-8 py-3.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
            >
              <span>{ctaText || `Bütün kurslara bax (${coursesList.length} Proqram)`}</span>
              <span className="material-symbols-outlined text-[16px] text-[#775a19]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

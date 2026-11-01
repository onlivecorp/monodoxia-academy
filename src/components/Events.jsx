import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Events() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { eventsList, openApplication, currentUser, applicationsList, homeContent, navigateTo } = useApp();
  const events = homeContent?.events || {};

  const badgeText = getLocalized(events, 'badge', currentLang, defaultLang) || (events.badge !== undefined && events.badge !== null && String(events.badge).trim() !== '' ? events.badge : t('events_badge'));
  const titleText = getLocalized(events, 'title', currentLang, defaultLang) || (events.title !== undefined && events.title !== null && String(events.title).trim() !== '' ? events.title : t('events_title'));
  const descText = getLocalized(events, 'desc', currentLang, defaultLang) || (events.desc !== undefined && events.desc !== null && String(events.desc).trim() !== '' ? events.desc : '');
  const calendarBtnText = getLocalized(events, 'calendarBtnText', currentLang, defaultLang) || (events.calendarBtnText !== undefined && events.calendarBtnText !== null && String(events.calendarBtnText).trim() !== '' ? events.calendarBtnText : t('events_calendar_btn'));

  const list = eventsList || [];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="tedbirler">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[30rem] rounded-full bg-gradient-to-b from-[#c5a059]/10 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #070f1e 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/70 backdrop-blur-md shadow-sm mb-2 anim-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e782f]"></span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
                {badgeText}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2] anim-events-title">
              {titleText}
            </h2>
            {descText && (
              <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {descText}
              </p>
            )}
          </div>

          <button
            onClick={() => navigateTo ? navigateTo('events') : null}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/75 hover:bg-white border border-[#e2d9c8]/80 hover:border-[#c5a059] shadow-sm text-xs font-semibold text-[#070f1e] hover:text-[#775a19] tracking-wider uppercase transition-all duration-200 cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>{calendarBtnText}</span>
            <span className="material-symbols-outlined text-[16px] text-[#c5a059]">calendar_month</span>
          </button>
        </div>

        {/* EVENTS GRID */}
        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {list.map(e => {
              const userApp = currentUser
                ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === e.id && !a.archived)
                : null;
              const targetType = e.typeBadge === 'VEBİNAR' ? 'webinar' : 'event';
              const isFree = !e.price || ['pulsuz', 'ödənişsiz', '0', '0 ₼', '0 azn'].includes(String(e.price).trim().toLowerCase());

              return (
                <div
                  key={e.id}
                  className="group relative bg-white/85 hover:bg-white p-7 sm:p-8 rounded-2xl border border-[#e2d9c8]/75 hover:border-[#c5a059]/70 shadow-sm hover:shadow-2xl hover:shadow-[#c5a059]/15 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Ambient Shimmer on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {e.image && (
                      <div className="h-44 -mx-7 -mt-7 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden bg-[#f5f3ef] relative">
                        <img 
                          src={e.image} 
                          alt={e.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      </div>
                    )}

                    {/* Top Meta Strip */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-full ${e.badgeClass || 'bg-[#c5a059]/15 text-[#775a19] border border-[#c5a059]/30'} text-[10px] font-semibold tracking-wider uppercase font-sans`}>
                          {getLocalized(e, 'typeBadge', currentLang, defaultLang)}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isFree
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#c5a059]/15 text-[#775a19] border border-[#c5a059]/30'
                        }`}>
                          {isFree ? 'Ödənişsiz' : e.price}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#c5a059]">schedule</span>
                        <span>{e.datetime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl font-semibold text-[#070f1e] group-hover:text-[#775a19] transition-colors leading-snug my-2.5">
                      "{getLocalized(e, 'title', currentLang, defaultLang)}"
                    </h3>

                    {/* Desc */}
                    <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6 flex-1">
                      {getLocalized(e, 'desc', currentLang, defaultLang)}
                    </p>
                  </div>

                  {/* Footer & Registration */}
                  <div className="pt-4 border-t border-[#e2d9c8]/50 flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#c5a059]">person</span>
                      <span>Spiker: <strong className="text-[#070f1e] font-semibold">{e.speaker}</strong></span>
                    </span>

                    {userApp ? (
                      userApp.status === 'Təsdiqləndi' ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>Təsdiqləndi</span>
                        </span>
                      ) : ['Yeni', 'Baxılır', 'Gözləmədə'].includes(userApp.status) ? (
                        <button
                          onClick={() => openApplication(e, targetType)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px] text-amber-600">hourglass_top</span>
                          <span>Baxılır ({userApp.status})</span>
                        </button>
                      ) : ['Rədd edildi', 'İmtina edildi', 'Ləğv edildi'].includes(userApp.status) ? (
                        <button
                          onClick={() => openApplication(e, targetType)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">refresh</span>
                          <span>Yenidən Qeydiyyat</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#fbf9f5] text-[#070f1e] border border-[#e2d9c8]">
                          {userApp.status}
                        </span>
                      )
                    ) : e.status === 'Tamamlandı' ? (
                      <span className="text-xs text-slate-400 font-semibold">Tədbir Başa Çatıb</span>
                    ) : e.status === 'Bağlıdır' ? (
                      <span className="text-xs text-slate-400 font-semibold">Qeydiyyat Bağlıdır</span>
                    ) : (
                      <button
                        onClick={() => openApplication(e, targetType)}
                        className="px-4 py-2 rounded-lg bg-[#070f1e] hover:bg-[#112240] text-white text-xs font-semibold tracking-wide border border-[#c5a059]/40 shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px] text-[#c5a059]">how_to_reg</span>
                        <span>{t('event_register')} ({e.registered}/{e.capacity})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative overflow-hidden p-12 sm:p-14 rounded-2xl bg-white/85 backdrop-blur-md border border-[#e2d9c8]/80 shadow-xl text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbf9f5] to-[#f5f0e6] border border-[#c5a059]/35 text-[#8a6a1f] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">event_upcoming</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#c5a059]/15 text-[#775a19] text-[10px] font-semibold tracking-widest uppercase mb-3">
              {t('events_empty_tag') || 'Canlı Proqramlar'}
            </span>
            <h4 className="font-serif text-2xl font-bold text-[#070f1e] mb-2">
              {t('events_empty_title') || 'Tezliklə Yeni Vebinar və Tədbirlər'}
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6 font-normal">
              {t('events_empty_desc') || 'Yaxın günlərdə yeni canlı ustad dərsləri, interaktiv sual-cavab vebinarları və ekspert seminarları elan olunacaqdır.'}
            </p>
            <button
              onClick={() => navigateTo ? navigateTo('club') : null}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#070f1e] text-white text-xs font-semibold tracking-wide shadow-md hover:bg-[#112240] transition-colors"
            >
              <span>{t('events_join_club_btn') || 'Zənginlər Klubu İcmasına Qoşul'}</span>
              <span className="material-symbols-outlined text-[16px] text-[#c5a059]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

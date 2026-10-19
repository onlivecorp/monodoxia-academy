import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

export default function EventsPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    eventsList,
    homeContent,
    openApplication,
    currentUser,
    applicationsList
  } = useApp();

  const events = homeContent?.events || {};
  const [filterType, setFilterType] = useState('all');

  const normalizeStr = (str) => {
    return (str || '')
      .toLocaleLowerCase('az-AZ')
      .replace(/i̇/g, 'i')
      .replace(/ı/g, 'i')
      .replace(/ə/g, 'e')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .trim();
  };

  const filteredEvents = eventsList.filter(e => {
    if (filterType === 'all') return true;
    const badge = normalizeStr(e.typeBadge);
    const filter = normalizeStr(filterType);
    return badge.includes(filter) || filter.includes(badge);
  });

  const badgeText = getLocalized(events, 'badge', currentLang, defaultLang) || '';
  const titleText = getLocalized(events, 'title', currentLang, defaultLang) || '';
  const descText = getLocalized(events, 'desc', currentLang, defaultLang) || '';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Editorial Page Hero */}
      {(titleText || badgeText) && (
        <PageHero
          badge={badgeText}
          title={titleText}
          description={descText}
          breadcrumbs={[{ label: 'Tədbirlər' }]}
          adminCmsBlock="events"
        >
          {(events.heroBadge1Text || events.heroBadge2Text || events.heroBadge3Text) && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#c5a059]/20">
              {events.heroBadge1Text && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
                  <span className="material-symbols-outlined text-[#775a19] text-[18px]">
                    {events.heroBadge1Icon || 'calendar_month'}
                  </span>
                  <span className="font-medium">{getLocalized(events, 'heroBadge1Text', currentLang, defaultLang)}</span>
                </div>
              )}

              {events.heroBadge2Text && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
                  <span className="material-symbols-outlined text-[#775a19] text-[18px]">
                    {events.heroBadge2Icon || 'co_present'}
                  </span>
                  <span className="font-medium">{getLocalized(events, 'heroBadge2Text', currentLang, defaultLang)}</span>
                </div>
              )}

              {events.heroBadge3Text && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
                  <span className="material-symbols-outlined text-[#775a19] text-[18px]">
                    {events.heroBadge3Icon || 'mic'}
                  </span>
                  <span className="font-medium">{getLocalized(events, 'heroBadge3Text', currentLang, defaultLang)}</span>
                </div>
              )}
            </div>
          )}
        </PageHero>
      )}

      {/* Main Section */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[950px] h-[650px] bg-gradient-to-b from-[#c5a059]/7 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Filter Bar */}
          <div className="bg-white/80 backdrop-blur-md border border-[#c5a059]/25 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_-10px_rgba(7,19,38,0.05)] mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-[#071326] mr-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#775a19]">filter_list</span>
                <span>Tədbir növü:</span>
              </span>
              {[
                { id: 'all', label: 'Bütün Tədbirlər' },
                { id: 'vebinar', label: 'Vebinarlar' },
                { id: 'oflayn', label: 'Oflayn Tədbirlər' },
                { id: 'masterklas', label: 'Masterklaslar' }
              ].map(tab => {
                const isActive = filterType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-md border border-[#c5a059]/40'
                        : 'bg-[#faf8f5] text-[#475569] hover:text-[#071326] hover:bg-white border border-[#e2e8f0]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748b] self-end sm:self-center">
              <span className="material-symbols-outlined text-[16px] text-[#775a19]">event_available</span>
              <span>Aktiv tədbirlər: <strong className="text-[#071326] font-semibold text-sm">{filteredEvents.length}</strong></span>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-[0_15px_40px_-15px_rgba(7,19,38,0.07)] mb-16">
              <div className="w-16 h-16 rounded-2xl bg-[#c5a059]/15 text-[#775a19] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">event_busy</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#071326] mb-2">
                Bu kateqoriyada aktiv tədbir tapılmadı
              </h3>
              <p className="text-sm text-[#64748b] mb-6 max-w-sm mx-auto leading-relaxed font-light">
                Yaxın günlərdə yeni canlı sessiyalar və emalatxanalar elan olunacaqdır.
              </p>
              <button
                onClick={() => setFilterType('all')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] text-xs font-semibold tracking-wider uppercase shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Bütün Tədbirləri Göstər
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredEvents.map(e => {
                const userApp = currentUser
                  ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === e.id && !a.archived)
                  : null;
                const targetType = e.typeBadge === 'VEBİNAR' ? 'webinar' : 'event';
                const occupancy = Math.min(100, Math.round(((e.registered || 0) / (e.capacity || 100)) * 100));
                const isFree = !e.price || ['pulsuz', 'ödənişsiz', '0', '0 ₼', '0 azn'].includes(String(e.price).trim().toLowerCase());

                return (
                  <div
                    key={e.id}
                    className="group relative bg-white rounded-3xl border border-[#c5a059]/25 hover:border-[#c5a059]/60 shadow-[0_8px_30px_-8px_rgba(7,19,38,0.06)] hover:shadow-[0_20px_45px_-12px_rgba(7,19,38,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden p-7 sm:p-8"
                  >
                    {/* Top Ambient Gold Sheen on Hover */}
                    <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Event Image Banner if provided */}
                      {e.image && (!e.image.startsWith('data:') || e.image.length > 500) && (
                        <div className="h-44 -mx-7 -mt-7 mb-5 rounded-t-3xl overflow-hidden bg-slate-100 relative">
                          <img
                            src={e.image}
                            alt={e.title}
                            onError={(err) => {
                              err.target.parentElement.style.display = 'none';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        </div>
                      )}

                      {/* Top Badges & Datetime */}
                      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#775a19] text-[11px] font-bold uppercase tracking-wider">
                            {getLocalized(e, 'typeBadge', currentLang, defaultLang) || e.typeBadge}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isFree
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300/60'
                              : 'bg-amber-50 text-amber-800 border border-amber-300/60'
                          }`}>
                            {isFree ? 'Ödənişsiz' : e.price}
                          </span>
                          {e.status && e.status !== 'Aktiv' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#64748b] border border-slate-200">
                              {e.status}
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-[#64748b] font-medium flex items-center gap-1.5 shrink-0">
                          <span className="material-symbols-outlined text-[15px] text-[#775a19]">schedule</span>
                          <span>{e.datetime}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#071326] mb-3 leading-[1.3] group-hover:text-[#775a19] transition-colors">
                        {getLocalized(e, 'title', currentLang, defaultLang)}
                      </h3>

                      {/* Desc */}
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6 font-light line-clamp-3">
                        {getLocalized(e, 'desc', currentLang, defaultLang)}
                      </p>

                      {/* Speaker Info Capsule */}
                      <div className="p-3.5 rounded-2xl bg-[#faf8f5] border border-[#c5a059]/20 flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                          {(e.speaker || 'S')[0]}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-[#775a19] uppercase tracking-wider block font-semibold">Spiker / Təlimçi</span>
                          <span className="text-xs font-bold text-[#071326] truncate block">{e.speaker}</span>
                        </div>
                      </div>

                      {/* Capacity Indicator */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-[11px] text-[#64748b] mb-1.5">
                          <span>Qeydiyyat faizi</span>
                          <span className="font-semibold text-[#071326]">{e.registered || 0} / {e.capacity || 100} yer ({occupancy}%)</span>
                        </div>
                        <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              occupancy > 85 ? 'bg-amber-600' : 'bg-gradient-to-r from-[#c5a059] to-[#775a19]'
                            }`}
                            style={{ width: `${occupancy}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions & Accurate Status Presentation */}
                    <div className="pt-4 border-t border-[#e2e8f0]">
                      {userApp ? (
                        userApp.status === 'Təsdiqləndi' ? (
                          <div className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined text-[17px] text-emerald-600">verified</span>
                            <span>Qeydiyyatınız Təsdiqlənib</span>
                          </div>
                        ) : ['Yeni', 'Baxılır', 'Gözləmədə'].includes(userApp.status) ? (
                          <button
                            onClick={() => openApplication(e, targetType)}
                            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[17px] text-amber-600">hourglass_top</span>
                            <span>Müraciətiniz Baxılır ({userApp.status})</span>
                          </button>
                        ) : ['Rədd edildi', 'İmtina edildi', 'Ləğv edildi'].includes(userApp.status) ? (
                          <div className="flex flex-col gap-2">
                            <div className="w-full py-2 px-3 rounded-xl text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-rose-600">cancel</span>
                                <span>Müraciət: {userApp.status}</span>
                              </span>
                            </div>
                            <button
                              onClick={() => openApplication(e, targetType)}
                              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                            >
                              <span className="material-symbols-outlined text-[16px]">refresh</span>
                              <span>Yenidən Müraciət Et</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openApplication(e, targetType)}
                            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 text-[#071326] border border-slate-300 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Müraciət Statusu: {userApp.status}</span>
                          </button>
                        )
                      ) : e.status === 'Tamamlandı' ? (
                        <div className="w-full py-3 px-4 rounded-xl bg-slate-100 text-[#64748b] text-xs font-semibold flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[17px]">event_busy</span>
                          <span>Tədbir Başa Çatıb</span>
                        </div>
                      ) : e.status === 'Bağlıdır' ? (
                        <div className="w-full py-3 px-4 rounded-xl bg-slate-100 text-[#64748b] text-xs font-semibold flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[17px]">lock</span>
                          <span>Qeydiyyat Bağlıdır</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => openApplication(e, targetType)}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                        >
                          <span className="material-symbols-outlined text-[17px] text-[#e5c57d] group-hover/btn:scale-110 transition-transform">how_to_reg</span>
                          <span>Tədbirə Qeydiyyatdan Keç</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Speaker & Partnership Capsule Banner */}
          {events.speakerTitle && (
            <div className="rounded-3xl bg-gradient-to-br from-[#071326] via-[#0a1932] to-[#040e1c] border border-[#c5a059]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                {events.speakerBadge && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e5c57d] text-xs font-semibold tracking-widest uppercase mb-3">
                    <span className="material-symbols-outlined text-[15px]">campaign</span>
                    <span>{getLocalized(events, 'speakerBadge', currentLang, defaultLang)}</span>
                  </div>
                )}
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2 leading-tight">
                  {getLocalized(events, 'speakerTitle', currentLang, defaultLang)}
                </h3>
                {events.speakerDesc && (
                  <p className="text-xs sm:text-sm text-[#cbd5e1] font-light leading-relaxed">
                    {getLocalized(events, 'speakerDesc', currentLang, defaultLang)}
                  </p>
                )}
              </div>

              <button
                onClick={() => openApplication({ id: 'speaker-app', title: 'Spikerlik və Əməkdaşlıq Müraciəti' }, 'event')}
                className="relative z-10 px-8 py-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#b38f46] text-[#071326] font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#c5a059]/20 hover:shadow-xl hover:shadow-[#c5a059]/35 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
              >
                {getLocalized(events, 'speakerBtnText', currentLang, defaultLang) || 'Müraciət Et'}
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}


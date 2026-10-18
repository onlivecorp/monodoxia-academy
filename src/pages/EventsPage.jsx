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

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        badge={getLocalized(events, 'badge', currentLang, defaultLang) || 'Canlı Təqvim'}
        title={getLocalized(events, 'title', currentLang, defaultLang) || 'Yaxınlaşan Tədbirlər və Masterklaslar'}
        description={getLocalized(events, 'desc', currentLang, defaultLang) || 'Canlı interaktiv vebinarlar, psixoloji emalatxanalar və aparıcı mentorlarla açıq müzakirələr.'}
        breadcrumbs={[{ label: 'Tədbirlər' }]}
        adminCmsBlock="events"
      >
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-outline-variant/40 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              {events.heroBadge1Icon || 'calendar_month'}
            </span>
            <span>{getLocalized(events, 'heroBadge1Text', currentLang, defaultLang) || 'Canlı Təqvim Qrafiki'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              {events.heroBadge2Icon || 'co_present'}
            </span>
            <span>{getLocalized(events, 'heroBadge2Text', currentLang, defaultLang) || 'İnteraktiv Q&A Sessiyaları'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              {events.heroBadge3Icon || 'mic'}
            </span>
            <span>{getLocalized(events, 'heroBadge3Text', currentLang, defaultLang) || 'Spikerlik İmkanı'}</span>
          </div>
        </div>
      </PageHero>

      {/* Main Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-outline-variant/50">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-on-surface-variant mr-1">Tədbir növü:</span>
              {[
                { id: 'all', label: 'Bütün Tədbirlər' },
                { id: 'vebinar', label: 'Vebinarlar' },
                { id: 'oflayn', label: 'Oflayn Tədbirlər' },
                { id: 'masterklas', label: 'Masterklaslar' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-on-surface-variant">
              Aktiv tədbirlər: <strong className="text-primary font-semibold">{filteredEvents.length}</strong>
            </span>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-7 flex flex-col justify-between hover:border-secondary transition-all duration-300 shadow-sm hover:shadow-lg group"
                >
                  <div>
                    {/* Event Image Banner if provided */}
                    {e.image && (!e.image.startsWith('data:') || e.image.length > 500) && (
                      <div className="h-44 -mx-7 -mt-7 mb-5 rounded-t-2xl overflow-hidden bg-surface-container relative">
                        <img
                          src={e.image}
                          alt={e.title}
                          onError={(err) => {
                            err.target.parentElement.style.display = 'none';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}

                    {/* Top Badges & Datetime */}
                    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded ${e.badgeClass || 'bg-secondary/10 text-secondary'} text-[11px] font-bold uppercase tracking-wider`}>
                          {getLocalized(e, 'typeBadge', currentLang, defaultLang) || e.typeBadge}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isFree
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40'
                        }`}>
                          {isFree ? 'Ödənişsiz' : e.price}
                        </span>
                        {e.status && e.status !== 'Aktiv' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-on-surface-variant border border-outline-variant">
                            {e.status}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-outline font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{e.datetime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl font-bold text-primary mb-3 leading-snug group-hover:text-secondary transition-colors">
                      {getLocalized(e, 'title', currentLang, defaultLang)}
                    </h3>

                    {/* Desc */}
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                      {getLocalized(e, 'desc', currentLang, defaultLang)}
                    </p>

                    {/* Speaker Info */}
                    <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
                        <span className="material-symbols-outlined text-lg">person</span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-outline uppercase tracking-wider block">Spiker / Təlimçi</span>
                        <span className="text-xs font-bold text-primary truncate block">{e.speaker}</span>
                      </div>
                    </div>

                    {/* Capacity Indicator */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1.5">
                        <span>Qeydiyyat faizi</span>
                        <span className="font-semibold text-primary">{e.registered || 0} / {e.capacity || 100} yer ({occupancy}%)</span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            occupancy > 85 ? 'bg-amber-600' : 'bg-secondary'
                          }`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Accurate Status Presentation */}
                  <div className="pt-4 border-t border-outline-variant/40">
                    {userApp ? (
                      userApp.status === 'Təsdiqləndi' ? (
                        <div className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center gap-1.5 shadow-sm">
                          <span className="material-symbols-outlined text-[16px] text-emerald-700 dark:text-emerald-400">verified</span>
                          <span>Qeydiyyatınız Təsdiqlənib</span>
                        </div>
                      ) : ['Yeni', 'Baxılır', 'Gözləmədə'].includes(userApp.status) ? (
                        <button
                          onClick={() => openApplication(e, targetType)}
                          className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[16px] text-amber-600">hourglass_top</span>
                          <span>Müraciətiniz Baxılır ({userApp.status})</span>
                        </button>
                      ) : ['Rədd edildi', 'İmtina edildi', 'Ləğv edildi'].includes(userApp.status) ? (
                        <div className="flex flex-col gap-2">
                          <div className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px] text-rose-600">cancel</span>
                              <span>Müraciət: {userApp.status}</span>
                            </span>
                          </div>
                          <button
                            onClick={() => openApplication(e, targetType)}
                            className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                            <span>Yenidən Müraciət Et</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openApplication(e, targetType)}
                          className="w-full py-2.5 px-4 rounded-lg text-xs font-bold bg-surface-container text-primary border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Müraciət Statusu: {userApp.status}</span>
                        </button>
                      )
                    ) : e.status === 'Tamamlandı' ? (
                      <div className="w-full py-2.5 px-4 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold flex items-center justify-center gap-1.5 opacity-80">
                        <span className="material-symbols-outlined text-[16px]">event_busy</span>
                        <span>Tədbir Başa Çatıb</span>
                      </div>
                    ) : e.status === 'Bağlıdır' ? (
                      <div className="w-full py-2.5 px-4 rounded-lg bg-surface-container text-on-surface-variant text-xs font-bold flex items-center justify-center gap-1.5 opacity-80">
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        <span>Qeydiyyat Bağlıdır</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => openApplication(e, targetType)}
                        className="w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                        <span>Tədbirə Qeydiyyatdan Keç</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Workshop Info Block */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs text-secondary font-bold uppercase tracking-widest">
                {getLocalized(events, 'speakerBadge', currentLang, defaultLang) || 'Spikerlik & Əməkdaşlıq'}
              </span>
              <h3 className="font-serif text-2xl font-bold text-primary mt-1 mb-3">
                {getLocalized(events, 'speakerTitle', currentLang, defaultLang) || 'Monodoxia Platformasında Öz Vebinarını və ya Tədbirini Təşkil Et'}
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {getLocalized(events, 'speakerDesc', currentLang, defaultLang) || 'Psixologiya, nevrobiologiya, kouçinq və fərdi inkişaf sahəsində təcrübənizi 12,000+ nəfərlik auditoriyamızla bölüşmək üçün spiker kimi müraciət edin.'}
              </p>
            </div>
            <button
              onClick={() => openApplication({ id: 'speaker-app', title: 'Spikerlik və Əməkdaşlıq Müraciəti' }, 'event')}
              className="px-6 py-3 rounded-lg bg-secondary text-on-secondary font-bold text-xs hover:bg-secondary/90 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              {getLocalized(events, 'speakerBtnText', currentLang, defaultLang) || 'Spiker kimi Müraciət Et'}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}

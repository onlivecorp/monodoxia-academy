import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Events() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { eventsList, openApplication, currentUser, applicationsList, homeContent } = useApp();
  const events = homeContent?.events || {};

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface border-b border-outline-variant/40" id="tedbirler">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
              {getLocalized(events, 'badge', currentLang, defaultLang) || t('events_badge')}
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif mt-1">
              {getLocalized(events, 'title', currentLang, defaultLang) || t('events_title')}
            </h2>
          </div>
          <a className="text-secondary hover:underline font-label-md text-label-md flex items-center gap-1" href="#tedbirler">
            <span>{getLocalized(events, 'calendarBtnText', currentLang, defaultLang) || t('events_calendar_btn')}</span>
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eventsList.map(e => {
            const userApp = currentUser
              ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === e.id && !a.archived)
              : null;
            const targetType = e.typeBadge === 'VEBİNAR' ? 'webinar' : 'event';

            return (
              <div
                key={e.id}
                className="bg-surface-container-lowest p-6 rounded border border-outline-variant/60 hover:border-secondary transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 rounded ${e.badgeClass} font-label-sm text-label-sm uppercase font-semibold`}>
                      {getLocalized(e, 'typeBadge', currentLang, defaultLang)}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">{e.datetime}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-2">
                    "{getLocalized(e, 'title', currentLang, defaultLang)}"
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                    {getLocalized(e, 'desc', currentLang, defaultLang)}
                  </p>
                </div>
                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-medium">Spiker: {e.speaker}</span>
                  {userApp ? (
                    <button
                      onClick={() => openApplication(e, targetType)}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Qeydiyyat: {userApp.status}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openApplication(e, targetType)}
                      className="text-secondary hover:underline text-xs font-semibold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                      <span>{t('event_register')} ({e.registered}/{e.capacity})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Coaches() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { openBooking, coachesList, homeContent } = useApp();
  const coaches = homeContent?.coaches || {};

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface border-b border-outline-variant/40" id="koucinq">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
            {getLocalized(coaches, 'badge', currentLang, defaultLang) || t('experts_badge')}
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
            {getLocalized(coaches, 'title', currentLang, defaultLang) || t('experts_title')}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {getLocalized(coaches, 'desc', currentLang, defaultLang) || t('experts_desc')}
          </p>
        </div>

        {coachesList && coachesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coachesList.map(c => {
              const coachTitle = getLocalized(c, 'title', currentLang, defaultLang);
              const coachBio = getLocalized(c, 'bio', currentLang, defaultLang);
              const specialties = getLocalizedArray(c, 'specialties', currentLang, defaultLang);

              return (
                <div
                  key={c.id}
                  className="bg-surface-container-lowest rounded border border-outline-variant/60 overflow-hidden group hover:border-secondary transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/4] bg-surface-container overflow-hidden flex items-center justify-center">
                      {c.image ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={c.image}
                          alt={c.name}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-container to-surface-container-high flex flex-col items-center justify-center text-secondary p-4 text-center">
                          <span className="material-symbols-outlined text-[56px] mb-2 opacity-80">psychology</span>
                          <span className="font-serif text-base font-bold text-surface-bright">{c.name}</span>
                          <span className="text-[11px] text-secondary-fixed mt-1">{coachTitle}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="font-label-sm text-label-sm text-secondary tracking-widest uppercase mb-1">
                        {coachTitle}
                      </div>
                      <h3 className="font-headline-md text-headline-md font-serif text-primary">{c.name}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 mb-4">
                        {coachBio}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {specialties.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-secondary/10 text-secondary border border-secondary/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => openBooking(c.id)}
                      className="w-full block py-2.5 text-center border border-secondary text-primary hover:bg-secondary hover:text-surface-bright rounded text-label-sm font-label-sm uppercase tracking-wider transition-colors"
                    >
                      {t('expert_book_btn')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-outline-variant/70 bg-surface-container-low max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-secondary/10 border border-secondary/30 text-secondary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[30px]">workspace_premium</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-lg font-serif text-primary">Ekspert Heyəti Formalaşdırılır</h3>
              <p className="text-xs text-on-surface-variant mt-2 max-w-md mx-auto leading-relaxed">
                Monodoxia Academy ekspert heyəti qeydiyyatdan keçmiş və sertifikatlaşdırılmış mütəxəssis üzvlər arasından təyin olunur. Tezliklə təsdiqlənmiş kouçlarımız burada təqdim olunacaqdır.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}




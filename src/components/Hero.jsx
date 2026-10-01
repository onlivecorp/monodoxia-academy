import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Hero() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { homeContent } = useApp();
  const hero = homeContent?.hero || {};

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-outline-variant/40 bg-surface">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-secondary/30 bg-secondary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase">
                {getLocalized(hero, 'badge', currentLang, defaultLang) || t('hero_badge')}
              </span>
            </div>
            <h1 className="font-display-xl text-display-xl-mobile md:text-display-xl text-primary leading-tight">
              {getLocalized(hero, 'title1', currentLang, defaultLang) || t('hero_title_1')}<br/>
              <span className="italic font-normal text-secondary">{getLocalized(hero, 'title2', currentLang, defaultLang) || t('hero_title_2')}</span><br/>
              {getLocalized(hero, 'title3', currentLang, defaultLang) || t('hero_title_3')}
            </h1>
            <p className="font-body-xl text-body-xl text-on-surface-variant max-w-xl leading-relaxed">
              {getLocalized(hero, 'desc', currentLang, defaultLang) || t('hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                className="bg-primary-container text-on-primary hover:bg-[#112240] px-8 py-3.5 rounded text-label-lg font-label-lg tracking-wider text-center transition-all duration-200 border border-secondary/40 shadow-sm flex items-center justify-center gap-2"
                href={hero.btnPrimaryLink || '#akademiya'}
              >
                <span>{getLocalized(hero, 'btnPrimaryText', currentLang, defaultLang) || t('hero_cta_primary')}</span>
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </a>
              <a
                className="bg-transparent hover:bg-secondary/5 text-primary border border-secondary px-7 py-3.5 rounded text-label-lg font-label-lg text-center transition-colors duration-200"
                href={hero.btnSecondaryLink || '#club'}
              >
                {getLocalized(hero, 'btnSecondaryText', currentLang, defaultLang) || t('hero_cta_secondary')}
              </a>
            </div>
            {/* STATS */}
            <div className="pt-8 border-t border-outline-variant/30 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="font-headline-md text-headline-md text-primary font-semibold">{hero.stat1Num || '12,000+'}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 tracking-wider uppercase">
                  {getLocalized(hero, 'stat1Label', currentLang, defaultLang) || t('hero_students')}
                </div>
              </div>
              <div className="border-l border-outline-variant/40 pl-6">
                <div className="font-headline-md text-headline-md text-secondary font-semibold">{hero.stat2Num || '98%'}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 tracking-wider uppercase">
                  {getLocalized(hero, 'stat2Label', currentLang, defaultLang) || t('hero_satisfaction')}
                </div>
              </div>
              <div className="border-l border-outline-variant/40 pl-6">
                <div className="font-headline-md text-headline-md text-primary font-semibold">{hero.stat3Num || 'ICF & PhD'}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant mt-1 tracking-wider uppercase">
                  {getLocalized(hero, 'stat3Label', currentLang, defaultLang) || t('hero_coaches')}
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT MEDIA */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 bg-secondary/10 rounded-full blur-2xl"></div>
              <div className="relative bg-surface-container-lowest p-3 border border-outline-variant/60 shadow-xl rounded-t-[10rem] rounded-b-xl overflow-hidden">
                <div className="overflow-hidden rounded-t-[9.5rem] rounded-b-lg aspect-[4/5] bg-surface-container">
                  <img
                    alt="Meditative sanctuary setting"
                    className="w-full h-full object-cover object-center filter contrast-[1.02] hover:scale-105 transition-transform duration-700"
                    src={hero.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6A42fLsKyb7QEyw763LYrM2DhMvrcMod35fdqpYFnlKrGTcsg11v2ljzwkebadfB8h3tfo-a23eJ2C1IgUxOWL0A7cON3aCvZ3irV6bqO5eStKS9edI_Qda-YAOeRR0EMqS_cCqNkoDRtBJgrns8bUxgLQjRFG1ZVUGF2Ob9e9CG4dgb2myU2AJgY2j8uSiSRSDuMt6yq1zuCRYVZhvt2-Eiq7WHllVLEpzNMbm6AuMR7CS-ijR7"}
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-surface-bright/95 backdrop-blur-md p-4 rounded border border-secondary/30 text-center shadow-lg">
                  <div className="font-quote-editorial text-sm italic text-secondary">
                    "{getLocalized(hero, 'quote', currentLang, defaultLang) || t('hero_quote')}"
                  </div>
                  <div className="font-label-sm text-[9px] tracking-widest text-on-surface-variant uppercase mt-1">
                    {getLocalized(hero, 'quoteSub', currentLang, defaultLang) || t('hero_philosophy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

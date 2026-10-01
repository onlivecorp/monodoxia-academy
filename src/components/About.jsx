import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function About() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { homeContent, pillarsList } = useApp();
  const about = homeContent?.about || {};

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface-container-low border-b border-outline-variant/40" id="haqqimizda">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* IMAGE BLOCK */}
          <div className="lg:col-span-5">
            <div className="relative p-2 bg-surface-container-lowest rounded border border-outline-variant/50 shadow-md">
              <div className="overflow-hidden rounded aspect-[4/3] bg-surface-container">
                <img
                  alt="Still life of mindfulness journal and warm tea"
                  className="w-full h-full object-cover filter brightness-[0.98]"
                  src={about.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJ9v48nWJzTbw80sDrDtTVhJ3mvXbVUbCeHjTMi_Y-NUPyOTMrFxaSuOPQsSmEsuH1iFUesyI1GA23YGlZQlqzMJLdnrhTp12XLt8NPffBd1uWx8YenygyqGA2zja0D9d-rKVoNVykmJRjh03f9EEtW4IghPWZy_-gBbdmrV1VbwrBwzlJWS1Ixvco8e0IdrYq8AHbaR5Pdystz7aBbXr4cWkfac3BRp_ESWqbNA0K6eg7X2YuuMP"}
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
                  {getLocalized(about, 'imageBadgeLeft', currentLang, defaultLang) || 'Gündəlik Fərqindəlik'}
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  {getLocalized(about, 'imageBadgeRight', currentLang, defaultLang) || '01 / SÜKUT'}
                </span>
              </div>
            </div>
          </div>
          {/* CONTENT BLOCK */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-secondary"></span>
              <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
                {getLocalized(about, 'badge', currentLang, defaultLang) || t('about_badge')}
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
              {getLocalized(about, 'title', currentLang, defaultLang) || t('about_title')}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {getLocalized(about, 'desc', currentLang, defaultLang) || t('about_desc')}
            </p>
            {/* PILLARS DYNAMIC LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {pillarsList.map((p) => (
                <div key={p.id} className="p-5 rounded bg-surface-container-lowest border border-outline-variant/40 hover:border-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">{p.icon || 'psychology'}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                    {getLocalized(p, 'title', currentLang, defaultLang)}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {getLocalized(p, 'desc', currentLang, defaultLang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

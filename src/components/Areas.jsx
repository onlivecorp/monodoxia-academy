import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Areas() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { homeContent, areasList } = useApp();
  const areas = homeContent?.areas || {};

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface border-b border-outline-variant/40">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
            {getLocalized(areas, 'badge', currentLang, defaultLang) || t('areas_badge')}
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
            {getLocalized(areas, 'title', currentLang, defaultLang) || t('areas_title')}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {getLocalized(areas, 'desc', currentLang, defaultLang) || t('areas_desc')}
          </p>
        </div>

        {/* DYNAMIC AREAS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areasList.map((a) => (
            <div
              key={a.id}
              className="group bg-surface-container-lowest p-6 rounded border border-outline-variant/60 hover:border-secondary transition-all duration-300 gold-glow-hover flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:bg-secondary group-hover:text-surface-bright transition-colors">
                  <span className="material-symbols-outlined text-[22px]">{a.icon}</span>
                </div>
                <span className="font-label-sm text-label-sm text-outline tracking-wider">
                  {getLocalized(a, 'number', currentLang, defaultLang)}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary mt-1 mb-2">
                  {getLocalized(a, 'title', currentLang, defaultLang)}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  {getLocalized(a, 'desc', currentLang, defaultLang)}
                </p>
              </div>
              <a className="inline-flex items-center text-secondary font-label-md text-label-md hover:underline gap-1" href="#akademiya">
                <span>{t('area_explore')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

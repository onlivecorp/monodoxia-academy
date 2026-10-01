import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Testimonials() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { testimonialsList, homeContent } = useApp();
  const testimonials = homeContent?.testimonials || {};

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface-container-low border-b border-outline-variant/40">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
            {getLocalized(testimonials, 'badge', currentLang, defaultLang) || t('testimonials_badge')}
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
            {getLocalized(testimonials, 'title', currentLang, defaultLang) || t('testimonials_title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsList.map(item => (
            <div key={item.id} className="bg-surface-container-lowest p-8 rounded border border-outline-variant/50 relative flex flex-col justify-between shadow-sm">
              <div>
                <span className="material-symbols-outlined text-secondary/40 text-[36px] mb-4">format_quote</span>
                <p className="font-quote-editorial text-quote-editorial text-primary mb-6">
                  "{getLocalized(item, 'quote', currentLang, defaultLang)}"
                </p>
              </div>
              <div className="pt-4 border-t border-outline-variant/30">
                <div className="font-label-md text-label-md text-primary font-semibold">{item.author}</div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                  {getLocalized(item, 'role', currentLang, defaultLang)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

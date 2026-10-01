import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function FAQ() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { faqsList, homeContent } = useApp();
  const faq = homeContent?.faq || {};

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface border-b border-outline-variant/40" id="faq">
      <div className="max-w-4xl mx-auto px-gutter md:px-margin">
        <div className="text-center space-y-3 mb-14">
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
            {getLocalized(faq, 'badge', currentLang, defaultLang) || t('faq_badge')}
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
            {getLocalized(faq, 'title', currentLang, defaultLang) || t('faq_title')}
          </h2>
        </div>

        <div className="space-y-4">
          {faqsList.map((item, idx) => (
            <details key={item.id} className="group bg-surface-container-lowest p-6 rounded border border-outline-variant/60 [&_summary::-webkit-details-marker]:hidden" open={idx === 0}>
              <summary className="flex items-center justify-between cursor-pointer font-headline-sm text-headline-sm text-primary">
                <span>{getLocalized(item, 'question', currentLang, defaultLang)}</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary">expand_more</span>
              </summary>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 leading-relaxed">
                {getLocalized(item, 'answer', currentLang, defaultLang)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

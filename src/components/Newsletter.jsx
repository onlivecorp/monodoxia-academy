import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Newsletter() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { showToast, homeContent } = useApp();
  const newsletter = homeContent?.newsletter || {};
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast('Bülletenə abunəliyiniz təsdiqləndi!', 'success');
    setEmail('');
  };

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface-container text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-gutter md:px-margin space-y-6">
        <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
          {getLocalized(newsletter, 'badge', currentLang, defaultLang) || t('newsletter_badge')}
        </span>
        <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
          {getLocalized(newsletter, 'title', currentLang, defaultLang) || t('newsletter_title')}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {getLocalized(newsletter, 'desc', currentLang, defaultLang) || t('newsletter_desc')}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
          <input
            className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded focus:border-secondary focus:ring-1 focus:ring-secondary text-sm outline-none text-primary placeholder-outline"
            placeholder={getLocalized(newsletter, 'placeholder', currentLang, defaultLang) || t('newsletter_placeholder')}
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-primary-container text-on-primary hover:bg-[#112240] px-7 py-3 rounded text-label-md font-label-md tracking-wider transition-colors border border-secondary/40 whitespace-nowrap"
            type="submit"
          >
            {getLocalized(newsletter, 'btnText', currentLang, defaultLang) || t('newsletter_btn')}
          </button>
        </form>
        <div className="text-xs text-outline pt-1">
          {getLocalized(newsletter, 'disclaimer', currentLang, defaultLang) || 'Heç bir spam yoxdur. İstənilən vaxt abunəlikdən çıxa bilərsiniz.'}
        </div>
      </div>
    </section>
  );
}



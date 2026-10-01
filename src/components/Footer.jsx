import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { currentLang, defaultLang, changeLang, supportedLangs, t } = useLanguage();
  const { homeContent } = useApp();
  const footer = homeContent?.footer || {};

  return (
    <footer className="bg-primary-container text-on-primary-container border-t border-outline">
      <div className="w-full px-gutter md:px-margin py-space-2xl max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* BRAND */}
          <div className="lg:col-span-5 space-y-4">
            <a className="inline-block" href="#">
              <img
                alt="Monodoxia Academy"
                className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                src={footer.logoUrl || "https://lh3.googleusercontent.com/aida/AEtjO1Ud98aRG900y6U00sYKP3tPpJm2M8DOTtpOTm-yCKU1-KoIjXzck8LkNUZdIXLZCRhGkaBOPjFJI6jFegMuTxHL6Dm0z4tn4kd1uP-5Ww85geF1sh1ER7t3Oql4l_nLbT6KcbyVI7gdLHhrqv8JOeTfFP1KaLl4S8KCpZ713-fQYpNMUfE36W-Cz4-OXs9eSeAsw7TuNvQt0Fyc8jzIdOtN-9lJwrWssyk055OT8Oc3R6NR1QlJbq6WLA"}
              />
            </a>
            <p className="font-body-md text-body-md text-on-primary-container max-w-sm leading-relaxed">
              {getLocalized(footer, 'desc', currentLang, defaultLang) || 'Fərdi İnkişaf və Psixologiya Mərkəzi. İnsanın daxili azadlığı, şüur transformasiyası və ahəngdar varlığı üçün etibarlı akademik platforma.'}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <span className="material-symbols-outlined text-[20px] text-secondary cursor-pointer">psychology</span>
              <span className="material-symbols-outlined text-[20px] text-secondary cursor-pointer">public</span>
              <span className="material-symbols-outlined text-[20px] text-secondary cursor-pointer">mail</span>
            </div>
          </div>

          {/* NAV LINKS */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-label-sm text-label-sm text-secondary-fixed tracking-widest uppercase">NAVİQASİYA</div>
            <ul className="space-y-2 font-body-md text-body-md">
              <li><a className="hover:text-on-primary transition-colors text-secondary-fixed font-medium" href="#akademiya">{t('nav_academy')}</a></li>
              <li><a className="text-on-primary-container hover:text-on-primary transition-colors" href="#koucinq">{t('nav_coaching')}</a></li>
              <li><a className="text-on-primary-container hover:text-on-primary transition-colors" href="#club">{t('nav_club')}</a></li>
              <li><a className="text-on-primary-container hover:text-on-primary transition-colors" href="#tedbirler">{t('nav_events')}</a></li>
              <li><a className="text-on-primary-container hover:text-on-primary transition-colors" href="#icma">{t('nav_community')}</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-label-sm text-label-sm text-secondary-fixed tracking-widest uppercase">ƏLAQƏ VƏ ÜNVAN</div>
            <p className="font-body-md text-body-md text-on-primary-container">
              {getLocalized(footer, 'address', currentLang, defaultLang) || 'Nizami küçəsi 142, İntellektual İnkişaf Mərkəzi, Bakı, Azərbaycan'}
            </p>
            <p className="font-body-md text-body-md text-on-primary-container">
              Əlaqə: {footer.email || 'contact@monodoxia.academy'}<br/>
              Tel: {footer.phone || '+994 (12) 490 88 00'}
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-outline/30 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-on-primary-container gap-4">
          <div>
            {getLocalized(footer, 'copyright', currentLang, defaultLang) || '© 2025 Monodoxia Academy. Fərdi İnkişaf və Psixologiya Mərkəzi. Bütün hüquqlar qorunur.'}
          </div>
          <div className="flex items-center space-x-3">
            {(supportedLangs || []).filter(l => l.active !== false && l.enabled !== false).map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                className={`uppercase font-medium transition-colors ${
                  currentLang === lang.code ? 'text-secondary-fixed font-bold underline' : 'hover:text-on-primary opacity-80'
                }`}
              >
                {lang.code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}



import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { currentLang, defaultLang, changeLang, supportedLangs, t } = useLanguage();
  const { homeContent, platformSettings, navigateTo, getPageUrl } = useApp();
  const footer = homeContent?.footer || {};
  const contactEmail = platformSettings?.contactEmail || footer.email || 'contact@monodoxia.academy';
  const contactPhone = platformSettings?.contactPhone || footer.phone || '+994 (12) 490 88 00';

  return (
    <footer className="bg-primary-container text-on-primary-container border-t border-outline">
      <div className="w-full px-gutter md:px-margin py-space-2xl max-w-7xl mx-auto flex flex-col gap-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* BRAND */}
          <div className="lg:col-span-5 space-y-4">
            <a
              className="inline-flex items-center p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-md border border-white/20 transition-transform hover:scale-105 cursor-pointer"
              href={getPageUrl ? getPageUrl('home') : '/'}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
            >
              <img
                alt="Monodoxia Academy"
                className="h-10 md:h-12 w-auto object-contain"
                src={footer.logoUrl || "/logo.png"}
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + '/logo.png') {
                    e.currentTarget.src = '/logo.png';
                  }
                }}
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
              <li>
                <a
                  className="hover:text-on-primary transition-colors text-secondary-fixed font-medium cursor-pointer"
                  href={getPageUrl ? getPageUrl('akademiya') : '/akademiya'}
                  onClick={(e) => { e.preventDefault(); navigateTo('akademiya'); }}
                >
                  {t('nav_academy')}
                </a>
              </li>
              <li>
                <a
                  className="text-on-primary-container hover:text-on-primary transition-colors cursor-pointer"
                  href={getPageUrl ? getPageUrl('koucinq') : '/koucinq'}
                  onClick={(e) => { e.preventDefault(); navigateTo('koucinq'); }}
                >
                  {t('nav_coaching')}
                </a>
              </li>
              <li>
                <a
                  className="text-on-primary-container hover:text-on-primary transition-colors cursor-pointer"
                  href={getPageUrl ? getPageUrl('club') : '/club'}
                  onClick={(e) => { e.preventDefault(); navigateTo('club'); }}
                >
                  {t('nav_club')}
                </a>
              </li>
              <li>
                <a
                  className="text-on-primary-container hover:text-on-primary transition-colors cursor-pointer"
                  href={getPageUrl ? getPageUrl('tedbirler') : '/tedbirler'}
                  onClick={(e) => { e.preventDefault(); navigateTo('tedbirler'); }}
                >
                  {t('nav_events')}
                </a>
              </li>
              <li>
                <a
                  className="text-on-primary-container hover:text-on-primary transition-colors cursor-pointer"
                  href={getPageUrl ? getPageUrl('icma') : '/icma'}
                  onClick={(e) => { e.preventDefault(); navigateTo('icma'); }}
                >
                  {t('nav_community')}
                </a>
              </li>
              <li>
                <a
                  className="text-on-primary-container hover:text-on-primary transition-colors cursor-pointer"
                  href={getPageUrl ? getPageUrl('haqqimizda') : '/haqqimizda'}
                  onClick={(e) => { e.preventDefault(); navigateTo('haqqimizda'); }}
                >
                  {t('nav_about')}
                </a>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-label-sm text-label-sm text-secondary-fixed tracking-widest uppercase">ƏLAQƏ VƏ ÜNVAN</div>
            <p className="font-body-md text-body-md text-on-primary-container">
              {getLocalized(footer, 'address', currentLang, defaultLang) || 'Nizami küçəsi 142, İntellektual İnkişaf Mərkəzi, Bakı, Azərbaycan'}
            </p>
            <p className="font-body-md text-body-md text-on-primary-container">
              Əlaqə: <a href={`mailto:${contactEmail}`} className="hover:text-secondary-fixed transition-colors underline">{contactEmail}</a><br/>
              Tel: <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="hover:text-secondary-fixed transition-colors">{contactPhone}</a>
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



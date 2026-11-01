import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './languages';
import { translations } from './locales';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('monodoxia_lang');
    if (saved) return saved;
    // Browser language detection
    const browser = navigator.language?.split('-')[0]?.toLowerCase();
    const supported = (JSON.parse(localStorage.getItem('monodoxia_supported_langs') || 'null') || INITIAL_SUPPORTED_LANGUAGES);
    const found = supported.find(l => l.code === browser && l.enabled !== false);
    return found ? found.code : DEFAULT_LANGUAGE;
  });

  // Admin-configurable supported languages (persisted via AppContext)
  const [supportedLangs, setSupportedLangs] = useState(() => {
    const saved = localStorage.getItem('monodoxia_supported_langs');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORTED_LANGUAGES;
  });

  useEffect(() => {
    localStorage.setItem('monodoxia_lang', lang);
    document.documentElement.lang = lang;
    // Set dir attribute for RTL languages
    const langConfig = supportedLangs.find(l => l.code === lang);
    document.documentElement.dir = langConfig?.dir || 'ltr';
  }, [lang, supportedLangs]);

  // Sync supportedLangs to localStorage whenever admin updates them
  useEffect(() => {
    localStorage.setItem('monodoxia_supported_langs', JSON.stringify(supportedLangs));
  }, [supportedLangs]);

  // Custom static translations overrides (editable in Admin Panel)
  const [customTranslations, setCustomTranslations] = useState(() => {
    const saved = localStorage.getItem('monodoxia_static_translations');
    return saved ? JSON.parse(saved) : {};
  });

  const updateStaticTranslation = (langCode, key, value) => {
    setCustomTranslations(prev => {
      const next = {
        ...prev,
        [langCode]: {
          ...(prev[langCode] || {}),
          [key]: value
        }
      };
      localStorage.setItem('monodoxia_static_translations', JSON.stringify(next));
      return next;
    });
  };

  const saveAllStaticTranslations = (newTranslations) => {
    setCustomTranslations(newTranslations);
    localStorage.setItem('monodoxia_static_translations', JSON.stringify(newTranslations));
  };

  const t = (key, fallback) => {
    if (!key) return fallback !== undefined ? fallback : '';
    if (customTranslations[lang]?.[key] !== undefined && customTranslations[lang][key] !== '') {
      return customTranslations[lang][key];
    }
    const dict = translations[lang] || translations[DEFAULT_LANGUAGE];
    if (dict?.[key] !== undefined && dict[key] !== '') {
      return dict[key];
    }
    if (translations[DEFAULT_LANGUAGE]?.[key] !== undefined && translations[DEFAULT_LANGUAGE][key] !== '') {
      return translations[DEFAULT_LANGUAGE][key];
    }
    if (fallback !== undefined && fallback !== null && fallback !== '') {
      return fallback;
    }
    return '';
  };

  // Safe language change that validates against supported list
  const changeLang = (code) => {
    const isSupported = supportedLangs.some(l => l.code === code && l.enabled !== false);
    if (isSupported) setLang(code);
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      currentLang: lang,
      setLang: changeLang,
      changeLang,
      t,
      rawTranslations: translations,
      customTranslations,
      updateStaticTranslation,
      saveAllStaticTranslations,
      supportedLangs,
      setSupportedLangs,
      defaultLang: DEFAULT_LANGUAGE
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

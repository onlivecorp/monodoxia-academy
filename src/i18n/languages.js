// Monodoxia Academy - Centralized Language Configuration

export const DEFAULT_LANGUAGE = 'az';

export const INITIAL_SUPPORTED_LANGUAGES = [
  {
    code: 'az',
    name: 'Azərbaycan',
    nativeName: 'Azərbaycan dili',
    flag: '🇦🇿',
    dir: 'ltr',
    isDefault: true,
    enabled: true,
    active: true
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US/UK)',
    flag: '🇬🇧',
    dir: 'ltr',
    isDefault: false,
    enabled: true,
    active: true
  },
  {
    code: 'tr',
    name: 'Türkçe',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    isDefault: false,
    enabled: true,
    active: true
  },
  {
    code: 'ru',
    name: 'Русский',
    nativeName: 'Русский язык',
    flag: '🇷🇺',
    dir: 'ltr',
    isDefault: false,
    enabled: true,
    active: true
  }
];

export function getLanguageConfig(code, languages = INITIAL_SUPPORTED_LANGUAGES) {
  return languages.find(l => l.code === code) || languages.find(l => l.isDefault) || languages[0];
}

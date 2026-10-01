// Monodoxia Academy - Universal Localizer & Translation Engine
import { DEFAULT_LANGUAGE } from './languages';

/**
 * Resolves localized string value with hierarchical fallback.
 * Hierarchy:
 * 1. item.translations[currentLang][field]
 * 2. item[field + '_' + currentLang]
 * 3. item.translations[defaultLang][field]
 * 4. item[field + '_' + defaultLang]
 * 5. item[field] (base property)
 * 6. safeFallback (default: '')
 */
export function getLocalized(item, field, currentLang = 'az', defaultLang = DEFAULT_LANGUAGE, safeFallback = '') {
  if (!item || !field) return safeFallback;

  // 1. Nested translation object for current language
  if (item.translations && item.translations[currentLang] && item.translations[currentLang][field] !== undefined) {
    const val = item.translations[currentLang][field];
    if (typeof val === 'string' && val.trim() !== '') return val;
    if (typeof val === 'number') return String(val);
  }

  // 2. Direct property like title_en, desc_ru
  const directKey = `${field}_${currentLang}`;
  if (item[directKey] !== undefined && typeof item[directKey] === 'string' && item[directKey].trim() !== '') {
    return item[directKey];
  }

  // 3. Nested translation object for default language
  if (currentLang !== defaultLang && item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
    const val = item.translations[defaultLang][field];
    if (typeof val === 'string' && val.trim() !== '') return val;
    if (typeof val === 'number') return String(val);
  }

  // 4. Direct property for default language (e.g. title_az)
  const defaultDirectKey = `${field}_${defaultLang}`;
  if (currentLang !== defaultLang && item[defaultDirectKey] !== undefined && typeof item[defaultDirectKey] === 'string' && item[defaultDirectKey].trim() !== '') {
    return item[defaultDirectKey];
  }

  // 5. Base property (e.g. item.title, item.description)
  if (item[field] !== undefined && item[field] !== null) {
    if (typeof item[field] === 'string' && item[field].trim() !== '') return item[field];
    if (typeof item[field] === 'number') return String(item[field]);
  }

  return safeFallback;
}

/**
 * Resolves localized array (e.g., features, perks, specialties)
 */
export function getLocalizedArray(item, field, currentLang = 'az', defaultLang = DEFAULT_LANGUAGE) {
  if (!item || !field) return [];

  // 1. Nested translations
  if (item.translations && item.translations[currentLang] && item.translations[currentLang][field] !== undefined) {
    const val = item.translations[currentLang][field];
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === 'string' && val.trim() !== '') return val.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // 2. Fallback to default language translations
  if (currentLang !== defaultLang && item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
    const val = item.translations[defaultLang][field];
    if (Array.isArray(val) && val.length > 0) return val;
    if (typeof val === 'string' && val.trim() !== '') return val.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // 3. Base array property
  if (Array.isArray(item[field])) {
    return item[field];
  }
  if (typeof item[field] === 'string' && item[field].trim() !== '') {
    return item[field].split('\n').map(s => s.trim()).filter(Boolean);
  }

  return [];
}

/**
 * Compute translation completion status for an entity
 */
export function getTranslationStatus(item, translatableFields = [], supportedLanguages = ['az', 'en', 'tr', 'ru'], defaultLang = DEFAULT_LANGUAGE) {
  if (!item || !Array.isArray(translatableFields) || translatableFields.length === 0) {
    return {};
  }

  const result = {};

  supportedLanguages.forEach(lang => {
    const langCode = typeof lang === 'string' ? lang : lang.code;
    const missing = [];

    translatableFields.forEach(field => {
      let hasValue = false;

      if (item.translations && item.translations[langCode] && item.translations[langCode][field]) {
        const val = item.translations[langCode][field];
        if (typeof val === 'string' && val.trim() !== '') hasValue = true;
        else if (Array.isArray(val) && val.length > 0) hasValue = true;
      } else if (item[`${field}_${langCode}`]) {
        hasValue = true;
      } else if (langCode === defaultLang && item[field]) {
        hasValue = true;
      }

      if (!hasValue) {
        missing.push(field);
      }
    });

    const total = translatableFields.length;
    const completed = total - missing.length;
    const percent = Math.round((completed / total) * 100);

    result[langCode] = {
      complete: missing.length === 0,
      missing,
      completed,
      total,
      percent,
      status: missing.length === 0 ? 'complete' : missing.length === total ? 'missing' : 'partial'
    };
  });

  return result;
}

/**
 * Clones default language values into a target language translation slot
 */
export function copyFromDefaultLanguage(item, targetLang, defaultLang = DEFAULT_LANGUAGE, translatableFields = []) {
  if (!item || !targetLang) return item;

  const currentTranslations = item.translations ? { ...item.translations } : {};
  const targetObj = { ...(currentTranslations[targetLang] || {}) };

  translatableFields.forEach(field => {
    // Get source value from default language translation or base property
    const sourceVal = (item.translations && item.translations[defaultLang] && item.translations[defaultLang][field]) || item[field];
    if (sourceVal !== undefined) {
      targetObj[field] = Array.isArray(sourceVal) ? [...sourceVal] : sourceVal;
    }
  });

  return {
    ...item,
    translations: {
      ...currentTranslations,
      [targetLang]: targetObj
    }
  };
}

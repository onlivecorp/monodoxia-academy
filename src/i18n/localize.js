// Monodoxia Academy - Universal Localizer & Translation Engine
import { DEFAULT_LANGUAGE } from './languages.js';

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

  const isCorrupted = (val) => {
    if (typeof val !== 'string') return false;
    return val.includes('???') || val.includes('??') || val.includes('D~');
  };

  const isDummyEnglishArea = (val) => {
    if (typeof val !== 'string') return false;
    return val.startsWith('New Area') || val.includes('/ PILLAR') || val.startsWith('Detailed information about this personal');
  };

  // 1. When viewing in default language (AZ)
  if (currentLang === defaultLang) {
    // If translations has specific clean AZ entry, check it
    if (item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
      const val = item.translations[defaultLang][field];
      if (typeof val === 'string' && val.trim() !== '' && !isCorrupted(val) && !isDummyEnglishArea(val)) return val;
      if (typeof val === 'number') return String(val);
    }
    // Base property
    if (item[field] !== undefined && item[field] !== null) {
      if (typeof item[field] === 'string' && item[field].trim() !== '') {
        if (!isCorrupted(item[field]) && !isDummyEnglishArea(item[field])) {
          return item[field];
        }
      } else if (typeof item[field] === 'number') {
        return String(item[field]);
      }
    }
    const defaultDirectKey = `${field}_${defaultLang}`;
    if (item[defaultDirectKey] !== undefined && typeof item[defaultDirectKey] === 'string' && item[defaultDirectKey].trim() !== '') {
      if (!isCorrupted(item[defaultDirectKey]) && !isDummyEnglishArea(item[defaultDirectKey])) {
        return item[defaultDirectKey];
      }
    }
    return safeFallback;
  }

  // 2. Nested translation object for non-default current language
  if (item.translations && item.translations[currentLang] && item.translations[currentLang][field] !== undefined) {
    const val = item.translations[currentLang][field];
    if (typeof val === 'string' && val.trim() !== '' && !isCorrupted(val)) return val;
    if (typeof val === 'number') return String(val);
  }

  // 3. Direct property like title_en, desc_ru
  const directKey = `${field}_${currentLang}`;
  if (item[directKey] !== undefined && typeof item[directKey] === 'string' && item[directKey].trim() !== '' && !isCorrupted(item[directKey])) {
    return item[directKey];
  }

  // 4. Safe fallback for caller's localized dictionary text (avoids showing Azerbaijani on EN/TR/RU)
  if (safeFallback !== undefined && safeFallback !== null && typeof safeFallback === 'string' && safeFallback.trim() !== '') {
    // If safeFallback was passed as the Azerbaijani base property, don't use it as language-specific fallback
    if (safeFallback !== item[field] && !isCorrupted(safeFallback)) {
      return safeFallback;
    }
  }

  // 5. Fallback to base property (authoring language)
  if (item[field] !== undefined && item[field] !== null) {
    if (typeof item[field] === 'string' && item[field].trim() !== '' && !isCorrupted(item[field])) return item[field];
    if (typeof item[field] === 'number') return String(item[field]);
  }

  // 6. Fallback to default language translation object
  if (item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
    const val = item.translations[defaultLang][field];
    if (typeof val === 'string' && val.trim() !== '' && !isCorrupted(val)) return val;
    if (typeof val === 'number') return String(val);
  }

  // 7. Direct property for default language (e.g. title_az)
  const defaultDirectKey = `${field}_${defaultLang}`;
  if (item[defaultDirectKey] !== undefined && typeof item[defaultDirectKey] === 'string' && item[defaultDirectKey].trim() !== '' && !isCorrupted(item[defaultDirectKey])) {
    return item[defaultDirectKey];
  }

  return safeFallback;
}

/**
 * Resolves localized array (e.g., features, perks, specialties)
 */
export function getLocalizedArray(item, field, currentLang = 'az', defaultLang = DEFAULT_LANGUAGE, safeFallbackArray = []) {
  if (!item || !field) return Array.isArray(safeFallbackArray) ? safeFallbackArray : [];

  const isCorruptedArray = (arr) => {
    if (!Array.isArray(arr)) return false;
    return arr.some(s => typeof s === 'string' && (s.includes('???') || s.includes('??') || s.includes('D~')));
  };

  // When viewing in default language, base array or translations[defaultLang] is primary
  if (currentLang === defaultLang) {
    if (item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
      const val = item.translations[defaultLang][field];
      if (Array.isArray(val) && val.length > 0 && !isCorruptedArray(val)) return val;
      if (typeof val === 'string' && val.trim() !== '' && !val.includes('???')) return val.split('\n').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(item[field]) && item[field].length > 0 && !isCorruptedArray(item[field])) {
      return item[field];
    }
    if (typeof item[field] === 'string' && item[field].trim() !== '' && !item[field].includes('???')) {
      return item[field].split('\n').map(s => s.trim()).filter(Boolean);
    }
    return Array.isArray(safeFallbackArray) ? safeFallbackArray : [];
  }

  // 1. Nested translations for non-default language
  if (item.translations && item.translations[currentLang] && item.translations[currentLang][field] !== undefined) {
    const val = item.translations[currentLang][field];
    if (Array.isArray(val) && val.length > 0 && !isCorruptedArray(val)) return val;
    if (typeof val === 'string' && val.trim() !== '' && !val.includes('???')) return val.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // 2. Direct property like features_en
  const directKey = `${field}_${currentLang}`;
  if (item[directKey] !== undefined) {
    if (Array.isArray(item[directKey]) && item[directKey].length > 0 && !isCorruptedArray(item[directKey])) return item[directKey];
    if (typeof item[directKey] === 'string' && item[directKey].trim() !== '' && !item[directKey].includes('???')) {
      return item[directKey].split('\n').map(s => s.trim()).filter(Boolean);
    }
  }

  // 3. Safe fallback array if provided
  if (Array.isArray(safeFallbackArray) && safeFallbackArray.length > 0) {
    return safeFallbackArray;
  }

  // 4. Fallback to default language translations
  if (item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
    const val = item.translations[defaultLang][field];
    if (Array.isArray(val) && val.length > 0 && !isCorruptedArray(val)) return val;
    if (typeof val === 'string' && val.trim() !== '' && !val.includes('???')) return val.split('\n').map(s => s.trim()).filter(Boolean);
  }

  // 5. Base array property fallback
  if (Array.isArray(item[field]) && item[field].length > 0 && !isCorruptedArray(item[field])) {
    return item[field];
  }
  if (typeof item[field] === 'string' && item[field].trim() !== '' && !item[field].includes('???')) {
    return item[field].split('\n').map(s => s.trim()).filter(Boolean);
  }

  return Array.isArray(safeFallbackArray) ? safeFallbackArray : [];
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

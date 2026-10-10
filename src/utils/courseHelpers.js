// Monodoxia Academy - Course Utilities: Deadline Formatting & Occupancy Calculations

const MONTH_NAMES = {
  az: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktabr', 'Noyabr', 'Dekabr'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
};

/**
 * Format a datetime-local string (e.g. "2026-11-20T18:00") into a localized deadline string
 */
export function formatCourseDeadline(datetimeStr, lang = 'az') {
  if (!datetimeStr) return '';
  try {
    const d = new Date(datetimeStr);
    if (isNaN(d.getTime())) return datetimeStr;

    const day = d.getDate();
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${mins}`;
    const mIdx = d.getMonth();

    const months = MONTH_NAMES[lang] || MONTH_NAMES.az;
    const mName = months[mIdx];

    switch (lang) {
      case 'en':
        return `Deadline: ${mName} ${day}, ${year} ${timeStr}`;
      case 'tr':
        return `Son Tarih: ${day} ${mName} ${year}, ${timeStr}`;
      case 'ru':
        return `Дедлайн: ${day} ${mName} ${year}, ${timeStr}`;
      case 'az':
      default:
        return `Son tarix: ${day} ${mName} ${year}, ${timeStr}`;
    }
  } catch (err) {
    return datetimeStr;
  }
}

/**
 * Generate full dictionary of deadline translations for all supported languages
 */
export function generateDeadlineTranslations(datetimeStr) {
  if (!datetimeStr) return {};
  return {
    az: { duration: formatCourseDeadline(datetimeStr, 'az') },
    en: { duration: formatCourseDeadline(datetimeStr, 'en') },
    tr: { duration: formatCourseDeadline(datetimeStr, 'tr') },
    ru: { duration: formatCourseDeadline(datetimeStr, 'ru') }
  };
}

/**
 * Automatically calculate occupancy percentage from applicants and max participants
 */
export function calculateOccupancy(appliedCount = 0, maxParticipants = 30) {
  const max = Math.max(1, Number(maxParticipants) || 30);
  const count = Math.max(0, Number(appliedCount) || 0);
  const percent = Math.min(100, Math.round((count / max) * 100));
  return {
    appliedCount: count,
    maxParticipants: max,
    percent
  };
}

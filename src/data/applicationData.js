// Monodoxia Academy - Applications & Unified Registration System Data

export const APPLICATION_STATUSES = [
  { id: 'Yeni', label: 'Yeni', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'Baxılır', label: 'Baxılır', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300' },
  { id: 'Təsdiqləndi', label: 'Təsdiqləndi', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 'Gözləmədə', label: 'Gözləmədə', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
  { id: 'Rədd edildi', label: 'Rədd edildi', badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300' },
  { id: 'Ləğv edildi', label: 'Ləğv edildi', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400' },
  { id: 'Tamamlandı', label: 'Tamamlandı', badgeClass: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300' }
];

export const PAYMENT_STATUSES = [
  'Tələb olunmur',
  'Gözlənilir',
  'Ödənilib',
  'Qaytarıldı'
];

export const ATTENDANCE_STATUSES = [
  'Gözlənilir',
  'İştirak etdi',
  'İştirak etmədi',
  'Onlayn qoşuldu'
];

export const TARGET_TYPE_MAP = {
  course: { label: 'Kurs', icon: 'school', color: 'text-indigo-600 dark:text-indigo-400' },
  club: { label: 'Klub', icon: 'card_membership', color: 'text-amber-600 dark:text-amber-400' },
  event: { label: 'Tədbir', icon: 'event', color: 'text-rose-600 dark:text-rose-400' },
  webinar: { label: 'Vebinar', icon: 'videocam', color: 'text-sky-600 dark:text-sky-400' },
  community: { label: 'İcma', icon: 'groups', color: 'text-teal-600 dark:text-teal-400' },
  forum: { label: 'Forum', icon: 'forum', color: 'text-purple-600 dark:text-purple-400' }
};

export const INITIAL_FORM_FIELDS = [
  {
    id: 'fld_phone',
    targetType: 'all',
    label: 'Əlaqə Nömrəsi (WhatsApp)',
    fieldType: 'text',
    placeholder: '+994 50 000 00 00',
    isRequired: true,
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'fld_exp',
    targetType: 'all',
    label: 'Təcrübə / Hazırlıq Səviyyəniz',
    fieldType: 'select',
    options: ['Başlanğıc (İlk dəfədir)', 'Orta (Müəyyən təcrübəm var)', 'İrəli (Peşəkar fəaliyyət)'],
    isRequired: true,
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'fld_goal',
    targetType: 'all',
    label: 'Müraciət Məqsədi və Gözləntiləriniz',
    fieldType: 'textarea',
    placeholder: 'Bu proqramdan əsas öyrənmək istədiyiniz və ya inkişaf hədəfləriniz nədir?',
    isRequired: true,
    isActive: true,
    sortOrder: 3
  },
  {
    id: 'fld_prof',
    targetType: 'course',
    label: 'Peşəniz və Hazırkı Fəaliyyət Sahəniz',
    fieldType: 'text',
    placeholder: 'Məsələn: Həkim, Təhsilverən, Rəhbər, Tələbə...',
    isRequired: false,
    isActive: true,
    sortOrder: 4
  },
  {
    id: 'fld_file',
    targetType: 'course',
    label: 'CV / Rezüme və ya Sənəd Linki',
    fieldType: 'text',
    placeholder: 'Google Drive, LinkedIn və ya fayl linki',
    isRequired: false,
    isActive: true,
    sortOrder: 5
  },
  {
    id: 'fld_telegram',
    targetType: 'club',
    label: 'Telegram İstifadəçi Adınız (@username)',
    fieldType: 'text',
    placeholder: '@istifadeci_adi',
    isRequired: false,
    isActive: true,
    sortOrder: 6
  },
  {
    id: 'fld_source',
    targetType: 'event',
    label: 'Tədbir haqqında haradan eşitmisiniz?',
    fieldType: 'select',
    options: ['Instagram / Sosial Şəbəkələr', 'Dost tövsiyəsi', 'Veb sayt / Axtarış', 'Bülleten / Email', 'Digər'],
    isRequired: false,
    isActive: true,
    sortOrder: 7
  }
];

export const INITIAL_APPLICATIONS = [];

export const INITIAL_NOTIFICATIONS = [];


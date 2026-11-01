// Monodoxia Academy - Universal Localizer & Translation Engine
import { DEFAULT_LANGUAGE } from './languages.js';
import { COACHES } from '../data/mockData.js';

export const COACH_TITLE_MAP = {
  'Kouç & Ekspert': {
    az: 'Kouç & Ekspert',
    en: 'Coach & Expert',
    tr: 'Koç & Uzman',
    ru: 'Коуч и Эксперт'
  },
  'Kouç və Ekspert': {
    az: 'Kouç & Ekspert',
    en: 'Coach & Expert',
    tr: 'Koç & Uzman',
    ru: 'Коуч и Эксперт'
  },
  'PhD Psixologiya | ICF PCC': {
    az: 'PhD Psixologiya | ICF PCC',
    en: 'PhD Psychology | ICF PCC',
    tr: 'PhD Psikoloji | ICF PCC',
    ru: 'PhD Психология | ICF PCC'
  },
  'ICF MCC Kouç | EQ Master': {
    az: 'ICF MCC Kouç | EQ Master',
    en: 'ICF MCC Coach | EQ Master',
    tr: 'ICF MCC Koç | EQ Master',
    ru: 'ICF MCC Коуч | EQ Master'
  },
  'Münasibət Kouçu | Somatik Təlimçi': {
    az: 'Münasibət Kouçu | Somatik Təlimçi',
    en: 'Relationship Coach | Somatic Practitioner',
    tr: 'İlişki Koçu | Somatik Eğitmen',
    ru: 'Коуч по отношениям | Соматический практик'
  },
  'Baş Kouç & Təlimçi': {
    az: 'Baş Kouç & Təlimçi',
    en: 'Head Coach & Trainer',
    tr: 'Baş Koç & Eğitmen',
    ru: 'Главный коуч и тренер'
  }
};

export const SEDAQET_BIO_MAP = {
  az: 'Sədaqət Rzayeva — Monodoxia Academy fərdi inkişaf və kouçinq ekspertidir. Fərdi inkişaf, emosional balans və hədəf yönümlü kouçinq üzrə ixtisaslaşmışdır.',
  en: 'Sedaqet Rzayeva — Personal development and coaching expert at Monodoxia Academy. Specialized in personal growth, emotional balance, and goal-oriented coaching.',
  tr: 'Sedaqet Rzayeva — Monodoxia Academy kişisel gelişim ve koçluk uzmanıdır. Kişisel gelişim, duygusal denge ve hedef odaklı koçluk alanlarında uzmanlaşmıştır.',
  ru: 'Седагат Рзаева — эксперт по личностному развитию и коучингу Monodoxia Academy. Специализируется на личностном росте, эмоциональном балансе и целеполагании.'
};

export const SPECIALTY_MAP = {
  'Fərdi İnkişaf': {
    az: 'Fərdi İnkişaf',
    en: 'Personal Growth',
    tr: 'Kişisel Gelişim',
    ru: 'Личностное развитие'
  },
  'Şəxsi İnkişaf': {
    az: 'Şəxsi İnkişaf',
    en: 'Personal Growth',
    tr: 'Kişisel Gelişim',
    ru: 'Личностное развитие'
  },
  'Psixologiya': {
    az: 'Psixologiya',
    en: 'Psychology',
    tr: 'Psikoloji',
    ru: 'Психология'
  },
  'Həyat Balansı': {
    az: 'Həyat Balansı',
    en: 'Life Balance',
    tr: 'Yaşam Dengesi',
    ru: 'Баланс жизни'
  },
  'Kouçinq': {
    az: 'Kouçinq',
    en: 'Coaching',
    tr: 'Koçluk',
    ru: 'Коучинг'
  },
  'Motivasiya': {
    az: 'Motivasiya',
    en: 'Motivation',
    tr: 'Motivasyon',
    ru: 'Мотивация'
  },
  'Travma terapiyası': {
    az: 'Travma terapiyası',
    en: 'Trauma Therapy',
    tr: 'Travma Terapisi',
    ru: 'Терапия травм'
  },
  'Şüuraltı inanc dəyişimi': {
    az: 'Şüuraltı inanc dəyişimi',
    en: 'Subconscious Beliefs',
    tr: 'Bilinçaltı İnanç Dönüşümü',
    ru: 'Трансформация убеждений'
  },
  'Mindfulness': {
    az: 'Mindfulness',
    en: 'Mindfulness',
    tr: 'Mindfulness',
    ru: 'Майндфулнесс'
  },
  'EQ Liderlik': {
    az: 'EQ Liderlik',
    en: 'EQ Leadership',
    tr: 'EQ Liderlik',
    ru: 'EQ Лидерство'
  },
  'Karyera sıçrayışı': {
    az: 'Karyera sıçrayışı',
    en: 'Career Breakthrough',
    tr: 'Kariyer Sıçraması',
    ru: 'Карьерный прорыв'
  },
  'Stres menecmenti': {
    az: 'Stres menecmenti',
    en: 'Stress Management',
    tr: 'Stres Yönetimi',
    ru: 'Стресс-менеджмент'
  },
  'Münasibətlər': {
    az: 'Münasibətlər',
    en: 'Relationships',
    tr: 'İlişkiler',
    ru: 'Отношения'
  },
  'Bədən-zihin harmoniyası': {
    az: 'Bədən-zihin harmoniyası',
    en: 'Mind-Body Harmony',
    tr: 'Beden-Zihin Dengesi',
    ru: 'Гармония разума и тела'
  },
  'Özünü bağışlama': {
    az: 'Özünü bağışlama',
    en: 'Self-Forgiveness',
    tr: 'Kendini Bağışlama',
    ru: 'Прощение себя'
  }
};

export function translateSpecialty(spec, lang = 'az') {
  if (!spec || typeof spec !== 'string') return spec;
  const trimmed = spec.trim();
  if (SPECIALTY_MAP[trimmed] && SPECIALTY_MAP[trimmed][lang]) {
    return SPECIALTY_MAP[trimmed][lang];
  }
  const lower = trimmed.toLowerCase();
  for (const [key, mapping] of Object.entries(SPECIALTY_MAP)) {
    if (key.toLowerCase() === lower && mapping[lang]) {
      return mapping[lang];
    }
  }
  return spec;
}

export function translateExperience(exp, lang = 'az') {
  if (!exp || typeof exp !== 'string') return exp;
  const numMatch = exp.match(/^(\d+\+?)\s*(?:il|years?|yrs?|yıl|лет|года)?/i);
  if (numMatch) {
    const num = numMatch[1];
    if (lang === 'en') return `${num} yrs`;
    if (lang === 'tr') return `${num} yıl`;
    if (lang === 'ru') return `${num} лет`;
    return `${num} il`;
  }
  return exp;
}

export const STATIC_TITLE_MAP = {
  'VIP İntellektual Dialoq Qrupu': {
    az: 'VIP İntellektual Dialoq Qrupu',
    en: 'VIP Intellectual Dialogue Group',
    tr: 'VIP Entelektüel Diyalog Grubu',
    ru: 'VIP Группа интеллектуального диалога'
  },
  'Zənginlər Klubu Üzvlük Müraciəti': {
    az: 'Zənginlər Klubu Üzvlük Müraciəti',
    en: 'Wealth Club Membership Application',
    tr: 'Zenginler Kulübü Üyelik Başvurusu',
    ru: 'Заявка на членство в Клуб Богатых'
  },
  'Spikerlik və Əməkdaşlıq Müraciəti': {
    az: 'Spikerlik və Əməkdaşlıq Müraciəti',
    en: 'Speaker & Partnership Application',
    tr: 'Konuşmacı ve İş Birliği Başvurusu',
    ru: 'Заявка на спикерство и сотрудничество'
  },
  'Həftənin Mövzusu Hazırlanır': {
    az: 'Həftənin Mövzusu Hazırlanır',
    en: 'Topic of the Week in Preparation',
    tr: 'Haftanın Konusu Hazırlanıyor',
    ru: 'Тема недели готовится'
  },
  'Dialoq Məkanı': {
    az: 'Dialoq Məkanı',
    en: 'Space of Dialogue',
    tr: 'Diyalog Alanı',
    ru: 'Пространство диалога'
  },
  'Mövzu Başlat': {
    az: 'Mövzu Başlat',
    en: 'Start Topic',
    tr: 'Konu Başlat',
    ru: 'Начать тему'
  },
  'Canlı Proqramlar': {
    az: 'Canlı Proqramlar',
    en: 'Live Programs',
    tr: 'Canlı Programlar',
    ru: 'Живые Программы'
  },
  'Tezliklə Yeni Vebinar və Tədbirlər': {
    az: 'Tezliklə Yeni Vebinar və Tədbirlər',
    en: 'Upcoming Webinars & Events',
    tr: 'Yakında Yeni Webinar ve Etkinlikler',
    ru: 'Скоро Новые Вебинары и Мероприятия'
  },
  'Yaxın günlərdə yeni canlı ustad dərsləri, interaktiv sual-cavab vebinarları və ekspert seminarları elan olunacaqdır.': {
    az: 'Yaxın günlərdə yeni canlı ustad dərsləri, interaktiv sual-cavab vebinarları və ekspert seminarları elan olunacaqdır.',
    en: 'New live masterclasses, interactive Q&A webinars, and expert seminars will be announced in the coming days.',
    tr: 'Yakın günlerde yeni canlı ustalık sınıfları, etkileşimli soru-cevap webinarları ve uzman seminerleri duyurulacaktır.',
    ru: 'В ближайшие дни будут анонсированы новые живые мастер-классы, интерактивные вебинары «вопрос-ответ» и экспертные семинары.'
  },
  'Zənginlər Klubu İcmasına Qoşul': {
    az: 'Zənginlər Klubu İcmasına Qoşul',
    en: 'Join Wealth Club Community',
    tr: 'Zenginler Kulübü Topluluğuna Katıl',
    ru: 'Присоединиться к Сообществу Клуба Богатых'
  },
  'Zənginlər Klubu ilə tanış ol': {
    az: 'Zənginlər Klubu ilə tanış ol',
    en: 'Explore the Wealth Club',
    tr: 'Zenginler Kulübü ile Tanışın',
    ru: 'Познакомьтесь с Клубом Богатых'
  },
  'Başqa bir sualınız var?': {
    az: 'Başqa bir sualınız var?',
    en: 'Have another question?',
    tr: 'Başka bir sorunuz var mı?',
    ru: 'Остались вопросы?'
  },
  'Akademiya və fərdi kouçinq koordinatorlarımız sizə kömək etməkdən məmnun olar.': {
    az: 'Akademiya və fərdi kouçinq koordinatorlarımız sizə kömək etməkdən məmnun olar.',
    en: 'Our academy and coaching coordinators would be delighted to assist you.',
    tr: 'Akademi ve koçluk koordinatörlerimiz size yardımcı olmaktan memnuniyet duyacaktır.',
    ru: 'Координаторы Академии и менторы с радостью помогут вам сориентироваться.'
  },
  'Fərdi Məsləhət Al': {
    az: 'Fərdi Məsləhət Al',
    en: 'Get Personal Consultation',
    tr: 'Bireysel Danışmanlık Al',
    ru: 'Получить консультацию'
  },
  'Məzun Rəyləri': {
    az: 'Məzun Rəyləri',
    en: 'Graduate Reviews',
    tr: 'Mezun Yorumları',
    ru: 'Отзывы Выпускников'
  },
  'Tələbə Təcrübələri': {
    az: 'Tələbə Təcrübələri',
    en: 'Student Experiences',
    tr: 'Öğrenci Deneyimleri',
    ru: 'Опыт Студентов'
  },
  'Tələbə': {
    az: 'Tələbə',
    en: 'Student',
    tr: 'Öğrenci',
    ru: 'Студент'
  },
  'Həftəlik Mastermind': {
    az: 'Həftəlik Mastermind',
    en: 'Weekly Mastermind',
    tr: 'Haftalık Mastermind',
    ru: 'Еженедельный Мастермайнд'
  },
  '100+ Saatlıq Meditasiya Arxivi': {
    az: '100+ Saatlıq Meditasiya Arxivi',
    en: '100+ Hours Meditation Archive',
    tr: '100+ Saatlik Meditasyon Arşivi',
    ru: '100+ Часов Архива Медитаций'
  },
  'Klub İmtiyazları': {
    az: 'Klub İmtiyazları',
    en: 'Club Privileges',
    tr: 'Kulüp Ayrıcalıkları',
    ru: 'Привилегии Клуба'
  },
  'Zənginlər Klubu Üzvlərinə Nələr Təqdim Olunur?': {
    az: 'Zənginlər Klubu Üzvlərinə Nələr Təqdim Olunur?',
    en: 'What Is Offered to Wealth Club Members?',
    tr: 'Zenginler Kulübü Üyelerine Neler Sunuluyor?',
    ru: 'Что предлагается участникам Клуба Богатых?'
  },
  'Klubumuz sadəcə qrup deyil, hər bir üzvünün zehni, emosional və peşəkar təkamülünü sürətləndirən intellektual ailədir.': {
    az: 'Klubumuz sadəcə qrup deyil, hər bir üzvünün zehni, emosional və peşəkar təkamülünü sürətləndirən intellektual ailədir.',
    en: 'Our club is not just a group; it is an intellectual sanctuary accelerating mental, emotional, and professional evolution.',
    tr: 'Kulübümüz sıradan bir topluluk değil; her üyenin zihinsel, duygusal ve profesyonel evrimini hızlandıran entelektüel bir ailedir.',
    ru: 'Наш клуб — это не просто группа, а интеллектуальная семья, ускоряющая ментальную, эмоциональную и профессиональную эволюцию каждого участника.'
  },
  'Məhdud Sayda Qəbul Siyasəti': {
    az: 'Məhdud Sayda Qəbul Siyasəti',
    en: 'Limited Intake Policy',
    tr: 'Sınırlı Kontenjan Politikası',
    ru: 'Политика ограниченного приема'
  },
  'Daxili intellektual təhlükəsizliyi və məxfiliyi qorumaq üçün hər ay yalnız 25 yeni Üzv qəbul edilir.': {
    az: 'Daxili intellektual təhlükəsizliyi və məxfiliyi qorumaq üçün hər ay yalnız 25 yeni Üzv qəbul edilir.',
    en: 'To preserve confidentiality and high-level dialogue, only 25 new residents are admitted each month.',
    tr: 'İç entelektüel güvenliği ve gizliliği korumak amacıyla her ay yalnızca 25 yeni üye kabul edilmektedir.',
    ru: 'Для защиты внутренней безопасности и конфиденциальности ежемесячно принимаются только 25 новых резидентов.'
  },
  'Bizimlə Əlaqə': {
    az: 'Bizimlə Əlaqə',
    en: 'Contact Us',
    tr: 'Bize Ulaşın',
    ru: 'Связаться с нами'
  },
  'Həftəlik canlı mentorluq və mastermind sessiyaları: Təcrübəli mentorlarla birbaşa dialoq.': {
    az: 'Həftəlik canlı mentorluq və mastermind sessiyaları: Təcrübəli mentorlarla birbaşa dialoq.',
    en: 'Weekly live mentoring and mastermind sessions: Direct dialogue with experienced mentors.',
    tr: 'Haftalık canlı mentorluk ve mastermind seansları: Deneyimli mentorlarla doğrudan diyalog.',
    ru: 'Еженедельные живые менторские и мастермайнд-сессии: Прямой диалог с опытными наставниками.'
  },
  'Həftəlik canlı mentorluq və mastermind sessiyaları': {
    az: 'Həftəlik canlı mentorluq və mastermind sessiyaları',
    en: 'Weekly live mentoring and mastermind sessions',
    tr: 'Haftalık canlı mentorluk ve mastermind seansları',
    ru: 'Еженедельные живые менторские и мастермайнд-сессии'
  },
  'Özəl meditasiya və təcrübə arxivi: 100+ saatlıq audio və video bələdçilər.': {
    az: 'Özəl meditasiya və təcrübə arxivi: 100+ saatlıq audio və video bələdçilər.',
    en: 'Exclusive meditation and practice archive: 100+ hours of audio and video guides.',
    tr: 'Özel meditasyon ve pratik arşivi: 100+ saatlik ses ve video rehberler.',
    ru: 'Эксклюзивный архив медитаций и практик: 100+ часов аудио- и видеоматериалов.'
  },
  'Özəl meditasiya və təcrübə arxivi (100+ saat)': {
    az: 'Özəl meditasiya və təcrübə arxivi (100+ saat)',
    en: 'Exclusive meditation and practice archive (100+ hours)',
    tr: 'Özel meditasyon ve pratik arşivi (100+ saat)',
    ru: 'Эксклюзивный архив медитаций и практик (100+ часов)'
  },
  'Qapalı intellektual icma müzakirələri: Konfidensial təhlükəsiz platforma.': {
    az: 'Qapalı intellektual icma müzakirələri: Konfidensial təhlükəsiz platforma.',
    en: 'Private intellectual community discussions: Confidential secure platform.',
    tr: 'Kapalı entelektüel topluluk tartışmaları: Gizli ve güvenli platform.',
    ru: 'Закрытые дискуссии интеллектуального сообщества: Конфиденциальная безопасная платформа.'
  },
  'Qapalı intellektual icma müzakirələri': {
    az: 'Qapalı intellektual icma müzakirələri',
    en: 'Private intellectual community discussions',
    tr: 'Kapalı entelektüel topluluk tartışmaları',
    ru: 'Закрытые дискуссии интеллектуального сообщества'
  },
  'Oflayn tədbirlərə və retreat-lərə VIP giriş: Qapalı illik düşərgələr.': {
    az: 'Oflayn tədbirlərə və retreat-lərə VIP giriş: Qapalı illik düşərgələr.',
    en: 'VIP access to offline events and retreats: Exclusive annual camps.',
    tr: 'Yüz yüze etkinliklere ve inzivalara VIP giriş: Özel yıllık kamplar.',
    ru: 'VIP доступ к офлайн мероприятиям и ретритам: Закрытые ежегодные кемпы.'
  },
  'Oflayn tədbirlərə və retreat-lərə VIP giriş': {
    az: 'Oflayn tədbirlərə və retreat-lərə VIP giriş',
    en: 'VIP access to offline events and retreats',
    tr: 'Yüz yüze etkinliklere ve inzivalara VIP giriş',
    ru: 'VIP доступ к офлайн мероприятиям и ретритам'
  }
};

export const ROLE_TRANSLATION_MAP = {
  'Tələbə': { az: 'Tələbə', en: 'Student', tr: 'Öğrenci', ru: 'Студент' },
  'Student': { az: 'Tələbə', en: 'Student', tr: 'Öğrenci', ru: 'Студент' },
  'Öğrenci': { az: 'Tələbə', en: 'Student', tr: 'Öğrenci', ru: 'Студент' },
  'Студент': { az: 'Tələbə', en: 'Student', tr: 'Öğrenci', ru: 'Студент' },
  'Kouç': { az: 'Kouç', en: 'Coach', tr: 'Koç', ru: 'Коуч' },
  'Coach': { az: 'Kouç', en: 'Coach', tr: 'Koç', ru: 'Коуч' },
  'Koç': { az: 'Kouç', en: 'Coach', tr: 'Koç', ru: 'Коуч' },
  'Коуч': { az: 'Kouç', en: 'Coach', tr: 'Koç', ru: 'Коуч' },
  'Kouç & Ekspert': { az: 'Kouç & Ekspert', en: 'Coach & Expert', tr: 'Koç & Uzman', ru: 'Коуч и Эксперт' },
  'Kouç və Ekspert': { az: 'Kouç & Ekspert', en: 'Coach & Expert', tr: 'Koç & Uzman', ru: 'Коуч и Эксперт' },
  'Admin': { az: 'Admin', en: 'Admin', tr: 'Admin', ru: 'Администратор' },
  'Administrator': { az: 'Admin', en: 'Admin', tr: 'Admin', ru: 'Администратор' },
  'Администратор': { az: 'Admin', en: 'Admin', tr: 'Admin', ru: 'Администратор' },
  'Moderator': { az: 'Moderator', en: 'Moderator', tr: 'Moderatör', ru: 'Модератор' },
  'Moderatör': { az: 'Moderator', en: 'Moderator', tr: 'Moderatör', ru: 'Модератор' },
  'Модератор': { az: 'Moderator', en: 'Moderator', tr: 'Moderatör', ru: 'Модератор' },
  'Üzv': { az: 'Üzv', en: 'Member', tr: 'Üye', ru: 'Участник' },
  'Member': { az: 'Üzv', en: 'Member', tr: 'Üye', ru: 'Участник' },
  'Üye': { az: 'Üzv', en: 'Member', tr: 'Üye', ru: 'Участник' },
  'Участник': { az: 'Üzv', en: 'Member', tr: 'Üye', ru: 'Участник' },
  'Məzun': { az: 'Məzun', en: 'Graduate', tr: 'Mezun', ru: 'Выпускник' },
  'Graduate': { az: 'Məzun', en: 'Graduate', tr: 'Mezun', ru: 'Выпускник' },
  'Mezun': { az: 'Məzun', en: 'Graduate', tr: 'Mezun', ru: 'Выпускник' },
  'Выпускник': { az: 'Məzun', en: 'Graduate', tr: 'Mezun', ru: 'Выпускник' },
  'İstifadəçi': { az: 'İstifadəçi', en: 'User', tr: 'Kullanıcı', ru: 'Пользователь' },
  'User': { az: 'İstifadəçi', en: 'User', tr: 'Kullanıcı', ru: 'Пользователь' },
  'Kullanıcı': { az: 'İstifadəçi', en: 'User', tr: 'Kullanıcı', ru: 'Пользователь' },
  'Пользователь': { az: 'İstifadəçi', en: 'User', tr: 'Kullanıcı', ru: 'Пользователь' }
};

export function translateRole(role, lang = 'az') {
  if (!role) return '';
  const trimmed = String(role).trim();
  if (ROLE_TRANSLATION_MAP[trimmed]?.[lang]) {
    return ROLE_TRANSLATION_MAP[trimmed][lang];
  }
  const lower = trimmed.toLowerCase();
  for (const [key, map] of Object.entries(ROLE_TRANSLATION_MAP)) {
    if (key.toLowerCase() === lower && map[lang]) {
      return map[lang];
    }
  }
  return trimmed;
}

export const STATUS_TRANSLATION_MAP = {
  'Yeni': { az: 'Yeni', en: 'New', tr: 'Yeni', ru: 'Новая' },
  'Baxılır': { az: 'Baxılır', en: 'Under Review', tr: 'İnceleniyor', ru: 'На рассмотрении' },
  'Təsdiqləndi': { az: 'Təsdiqləndi', en: 'Confirmed', tr: 'Onaylandı', ru: 'Подтверждено' },
  'Təsdiqlənib': { az: 'Təsdiqlənib', en: 'Confirmed', tr: 'Onaylandı', ru: 'Подтверждено' },
  'Gözləmədə': { az: 'Gözləmədə', en: 'Pending', tr: 'Beklemede', ru: 'В ожидании' },
  'Gözləyir': { az: 'Gözləyir', en: 'Pending', tr: 'Bekliyor', ru: 'В ожидании' },
  'Rədd edildi': { az: 'Rədd edildi', en: 'Rejected', tr: 'Reddedildi', ru: 'Отклонено' },
  'Ləğv edildi': { az: 'Ləğv edildi', en: 'Cancelled', tr: 'İptal edildi', ru: 'Отменено' },
  'Tamamlandı': { az: 'Tamamlandı', en: 'Completed', tr: 'Tamamlandı', ru: 'Завершено' },
  'Ödənildi': { az: 'Ödənildi', en: 'Paid', tr: 'Ödendi', ru: 'Оплачено' },
  'Ödənilib': { az: 'Ödənilib', en: 'Paid', tr: 'Ödendi', ru: 'Оплачено' },
  'Qaytarıldı': { az: 'Qaytarıldı', en: 'Refunded', tr: 'İade edildi', ru: 'Возвращено' },
  'İmtina edildi': { az: 'İmtina edildi', en: 'Declined', tr: 'Reddedildi', ru: 'Отклонено' },
  'Tələb olunmur': { az: 'Tələb olunmur', en: 'Not required', tr: 'Gerekli değil', ru: 'Не требуется' },
  'Gözlənilir': { az: 'Gözlənilir', en: 'Expected', tr: 'Bekleniyor', ru: 'Ожидается' },
  'İştirak edəcək': { az: 'İştirak edəcək', en: 'Will attend', tr: 'Katılacak', ru: 'Будет участвовать' },
  'İştirak etməyəcək': { az: 'İştirak etməyəcək', en: 'Will not attend', tr: 'Katılmayacak', ru: 'Не будет участвовать' },
  'İştirak etdi': { az: 'İştirak etdi', en: 'Attended', tr: 'Katıldı', ru: 'Принял участие' },
  'İştirak etmədi': { az: 'İştirak etmədi', en: 'Did not attend', tr: 'Katılmadı', ru: 'Не принял участие' },
  'Onlayn qoşuldu': { az: 'Onlayn qoşuldu', en: 'Joined online', tr: 'Çevrimiçi katıldı', ru: 'Подключился онлайн' }
};

export const TARGET_TYPE_TRANSLATIONS = {
  course: { az: 'Kurs', en: 'Course', tr: 'Kurs', ru: 'Курс' },
  club: { az: 'Klub', en: 'Club', tr: 'Kulüp', ru: 'Клуб' },
  event: { az: 'Tədbir', en: 'Event', tr: 'Etkinlik', ru: 'Мероприятие' },
  webinar: { az: 'Vebinar', en: 'Webinar', tr: 'Webinar', ru: 'Вебинар' },
  community: { az: 'İcma', en: 'Community', tr: 'Topluluk', ru: 'Сообщество' },
  forum: { az: 'Forum', en: 'Forum', tr: 'Forum', ru: 'Форум' },
  coach_booking: { az: 'Ekspert / Kouç Rezervasiyası', en: 'Coach / Expert Booking', tr: 'Koç / Uzman Rezervasyonu', ru: 'Бронь коуча / эксперта' }
};

export function translateTargetType(type, lang = 'az') {
  if (!type) return '';
  return TARGET_TYPE_TRANSLATIONS[type]?.[lang] || type;
}

export function translateStatus(status, lang = 'az') {
  if (!status) return '';
  const trimmed = String(status).trim();
  if (STATUS_TRANSLATION_MAP[trimmed]?.[lang]) {
    return STATUS_TRANSLATION_MAP[trimmed][lang];
  }
  const lower = trimmed.toLowerCase();
  for (const [key, map] of Object.entries(STATUS_TRANSLATION_MAP)) {
    if (key.toLowerCase() === lower && map[lang]) {
      return map[lang];
    }
  }
  if (lower.includes('təsdiq') || lower.includes('confirm') || lower.includes('onay') || lower.includes('подтвержд')) {
    return STATUS_TRANSLATION_MAP['Təsdiqləndi']?.[lang] || trimmed;
  }
  if (lower.includes('ləğv') || lower.includes('cancel') || lower.includes('iptal') || lower.includes('отмен')) {
    return STATUS_TRANSLATION_MAP['Ləğv edildi']?.[lang] || trimmed;
  }
  if (lower.includes('gözlə') || lower.includes('wait') || lower.includes('pend') || lower.includes('ожидан')) {
    return STATUS_TRANSLATION_MAP['Gözləmədə']?.[lang] || trimmed;
  }
  if (lower.includes('ödəni') || lower.includes('paid') || lower.includes('ödendi') || lower.includes('оплач')) {
    return STATUS_TRANSLATION_MAP['Ödənildi']?.[lang] || trimmed;
  }
  return trimmed;
}

export function translatePrice(price, lang = 'az') {
  if (price === undefined || price === null) return '';
  const str = String(price).trim();
  const lower = str.toLowerCase();
  if (
    lower === 'pulsuz' ||
    lower === 'free' ||
    lower === 'ücretsiz' ||
    lower === 'ucretsiz' ||
    lower === 'бесплатно' ||
    lower === '0' ||
    lower === '0₼' ||
    lower === '0 azn' ||
    lower === 'ödənişsiz' ||
    lower === 'odenissiz'
  ) {
    const freeMap = {
      az: 'Pulsuz',
      en: 'Free',
      tr: 'Ücretsiz',
      ru: 'Бесплатно'
    };
    return freeMap[lang] || freeMap.az;
  }
  return str;
}

export function translateTitle(title, lang = 'az') {
  if (!title) return '';
  const trimmed = String(title).trim();
  if (STATIC_TITLE_MAP[trimmed]?.[lang]) {
    return STATIC_TITLE_MAP[trimmed][lang];
  }
  const lower = trimmed.toLowerCase();
  for (const [key, map] of Object.entries(STATIC_TITLE_MAP)) {
    if (key.toLowerCase() === lower && map[lang]) {
      return map[lang];
    }
  }
  return trimmed;
}

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

  // 4b. Known dynamic dictionary fallbacks for non-default languages
  const rawT = typeof item[field] === 'string' ? item[field].trim() : (typeof item.title === 'string' ? item.title.trim() : (typeof item.name === 'string' ? item.name.trim() : ''));
  if (rawT && STATIC_TITLE_MAP[rawT]?.[currentLang]) {
    return STATIC_TITLE_MAP[rawT][currentLang];
  }
  if (field === 'title' || field === 'targetTitle' || field === 'name') {
    if (COACH_TITLE_MAP[rawT]?.[currentLang]) {
      return COACH_TITLE_MAP[rawT][currentLang];
    }
    if (rawT === 'Kouç & Ekspert' || rawT === 'Kouç və Ekspert') {
      return COACH_TITLE_MAP['Kouç & Ekspert'][currentLang] || safeFallback;
    }
  }
  if (field === 'role' || field === 'authorRole' || field === 'userRole') {
    const rawR = item[field] !== undefined ? item[field] : (item.role !== undefined ? item.role : '');
    const transRole = translateRole(rawR, currentLang);
    if (transRole) return transRole;
  }
  if (field === 'price') {
    const rawP = item[field] !== undefined ? item[field] : (item.price !== undefined ? item.price : '');
    return translatePrice(rawP, currentLang);
  }
  if (field === 'status') {
    const rawS = item[field] !== undefined ? item[field] : (item.status !== undefined ? item.status : '');
    return translateStatus(rawS, currentLang);
  }
  if (field === 'bio') {
    const rawB = typeof item[field] === 'string' ? item[field] : (typeof item.bio === 'string' ? item.bio : '');
    if (rawB.includes('Monodoxia Academy fərdi inkişaf və kouçinq ekspertidir') || rawB.includes('Sədaqət Rzayeva')) {
      return SEDAQET_BIO_MAP[currentLang] || safeFallback;
    }
  }

  // 5. Fallback to base property (authoring language)
  if (item[field] !== undefined && item[field] !== null) {
    if (typeof item[field] === 'string' && item[field].trim() !== '' && !isCorrupted(item[field])) {
      const rawVal = item[field].trim();
      if (STATIC_TITLE_MAP[rawVal]?.[currentLang]) {
        return STATIC_TITLE_MAP[rawVal][currentLang];
      }
      if (field === 'title' && COACH_TITLE_MAP[rawVal]?.[currentLang]) {
        return COACH_TITLE_MAP[rawVal][currentLang];
      }
      if (field === 'role' || field === 'authorRole' || field === 'userRole') {
    const rawR = item[field] !== undefined ? item[field] : (item.role !== undefined ? item.role : '');
    const transRole = translateRole(rawR, currentLang);
    if (transRole) return transRole;
  }
  if (field === 'price') {
        return translatePrice(rawVal, currentLang);
      }
      if (field === 'status') {
        return translateStatus(rawVal, currentLang);
      }
      return item[field];
    }
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

  const postProcess = (arr) => {
    if (!Array.isArray(arr)) return [];
    if (field === 'specialties' && currentLang !== defaultLang) {
      return arr.map(s => translateSpecialty(s, currentLang));
    }
    if (currentLang !== defaultLang) {
      return arr.map(s => {
        if (typeof s === 'string') {
          const trimmed = s.trim();
          if (STATIC_TITLE_MAP[trimmed]?.[currentLang]) {
            return STATIC_TITLE_MAP[trimmed][currentLang];
          }
        }
        return s;
      });
    }
    return arr;
  };

  const isCorruptedArray = (arr) => {
    if (!Array.isArray(arr)) return false;
    return arr.some(s => typeof s === 'string' && (s.includes('???') || s.includes('??') || s.includes('D~')));
  };

  // When viewing in default language, base array or translations[defaultLang] is primary
  if (currentLang === defaultLang) {
    if (item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
      const val = item.translations[defaultLang][field];
      if (Array.isArray(val) && val.length > 0 && !isCorruptedArray(val)) return postProcess(val);
      if (typeof val === 'string' && val.trim() !== '' && !val.includes('???')) return postProcess(val.split('\n').map(s => s.trim()).filter(Boolean));
    }
    if (Array.isArray(item[field]) && item[field].length > 0 && !isCorruptedArray(item[field])) {
      return postProcess(item[field]);
    }
    if (typeof item[field] === 'string' && item[field].trim() !== '' && !item[field].includes('???')) {
      return postProcess(item[field].split('\n').map(s => s.trim()).filter(Boolean));
    }
    return Array.isArray(safeFallbackArray) ? safeFallbackArray : [];
  }

  // 1. Nested translations for non-default language
  if (item.translations && item.translations[currentLang] && item.translations[currentLang][field] !== undefined) {
    const val = item.translations[currentLang][field];
    if (Array.isArray(val) && val.length > 0 && !isCorruptedArray(val)) return postProcess(val);
    if (typeof val === 'string' && val.trim() !== '' && !val.includes('???')) return postProcess(val.split('\n').map(s => s.trim()).filter(Boolean));
  }

  // 2. Direct property like features_en
  const directKey = `${field}_${currentLang}`;
  if (item[directKey] !== undefined) {
    if (Array.isArray(item[directKey]) && item[directKey].length > 0 && !isCorruptedArray(item[directKey])) return postProcess(item[directKey]);
    if (typeof item[directKey] === 'string' && item[directKey].trim() !== '' && !item[directKey].includes('???')) {
      return postProcess(item[directKey].split('\n').map(s => s.trim()).filter(Boolean));
    }
  }

  // 3. Safe fallback array if provided
  if (Array.isArray(safeFallbackArray) && safeFallbackArray.length > 0) {
    return postProcess(safeFallbackArray);
  }

  // 4. Fallback to default language translations
  if (item.translations && item.translations[defaultLang] && item.translations[defaultLang][field] !== undefined) {
    const val = item.translations[defaultLang][field];
    if (Array.isArray(val) && val.length > 0 && !isCorruptedArray(val)) return postProcess(val);
    if (typeof val === 'string' && val.trim() !== '' && !val.includes('???')) return postProcess(val.split('\n').map(s => s.trim()).filter(Boolean));
  }

  // 5. Base array property fallback
  if (Array.isArray(item[field]) && item[field].length > 0 && !isCorruptedArray(item[field])) {
    return postProcess(item[field]);
  }
  if (typeof item[field] === 'string' && item[field].trim() !== '' && !item[field].includes('???')) {
    return postProcess(item[field].split('\n').map(s => s.trim()).filter(Boolean));
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

/**
 * Universal coach localizer: ensures title, bio, specialties, and experience
 * are properly translated across all 4 languages (AZ, EN, TR, RU).
 */
export function localizeCoach(coach, currentLang = 'az', defaultLang = DEFAULT_LANGUAGE, t = null) {
  if (!coach) return coach;

  const seed = Array.isArray(COACHES)
    ? COACHES.find(sc => sc.id === coach.id || (sc.name && coach.name && sc.name.toLowerCase().trim() === coach.name.toLowerCase().trim()))
    : null;

  const merged = {
    ...seed,
    ...coach,
    translations: {
      ...(seed?.translations || {}),
      ...(coach.translations || {})
    }
  };

  const title = getLocalized(merged, 'title', currentLang, defaultLang) || (t ? t('expert_coach_expert') : 'Kouç & Ekspert');
  const bio = getLocalized(merged, 'bio', currentLang, defaultLang) || (t ? t('coach_default_bio_text') : (merged.bio || ''));
  const specialties = getLocalizedArray(merged, 'specialties', currentLang, defaultLang);
  const rawExp = getLocalized(merged, 'experience', currentLang, defaultLang) || merged.experience || '';
  const experience = translateExperience(rawExp, currentLang);

  return {
    ...merged,
    title,
    bio,
    specialties,
    experience
  };
}

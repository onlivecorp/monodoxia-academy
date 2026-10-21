import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  COURSES,
  COACHES,
  COMMUNITY_TOPICS,
  EVENTS,
  AREAS,
  INITIAL_PILLARS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_HOME_CONTENT
} from '../data/mockData';
import {
  INITIAL_APPLICATIONS,
  INITIAL_FORM_FIELDS,
  INITIAL_NOTIFICATIONS
} from '../data/applicationData';
import { INITIAL_CATEGORIES } from '../data/categoryData';
import {
  PERMISSION_MODULES,
  ALL_PERMISSION_KEYS,
  INITIAL_ROLES
} from '../data/rbacData';
import {
  DEFAULT_PAGE_SLUGS,
  PAGE_DEFINITIONS,
  VALID_PAGE_IDS,
  resolvePageSlug,
  resolvePageUrl,
  resolvePageFromLocation,
  sanitizeSlug
} from '../utils/pageRouter';

const INITIAL_USERS = [
  { id: 'u7', name: 'Admin Baş Koordinator', email: 'admin@monodoxia.academy', role: 'Admin', tier: 'VIP', status: 'Aktiv', joinedDate: '2025-01-01' }
];

const INITIAL_SETTINGS = {
  siteTitle: "Monodoxia Academy",
  subtitle: "Fərdi İnkişaf və Psixologiya Mərkəzi",
  currency: "AZN (₼)",
  defaultLang: "az",
  contactEmail: "contact@monodoxia.academy",
  contactPhone: "+994 (12) 490 88 00",
  showSafetyBanner: true,
  safetyText: "Monodoxia Academy təhsil, fərdi inkişaf və kouçinq platformasıdır. Təqdim edilən proqramlar və materiallar tibbi, psixiatrik və ya kliniki diaqnostika və müalicəni əvəz etmir.",
  maintenanceMode: false,
  allowRegistrations: true,
  pageSlugs: { ...DEFAULT_PAGE_SLUGS },
  maintenanceTitle: "Planlaşdırılmış Texniki Təkmilləşdirmə",
  maintenanceDesc: "Hörmətli ziyarətçi, Monodoxia Academy platformasında təhsil, analitika və təhlükəsizlik sistemlərini yeniləmək məqsədilə planlaşdırılmış texniki təkmilləşdirmə işləri aparılır. Sistem ən qısa zamanda yenidən tam fəaliyyətini bərpa edəcəkdir.",
  maintenanceNotice: "Tezliklə Aktiv",
  maintenanceTranslations: {
    az: {
      title: "Planlaşdırılmış Texniki Təkmilləşdirmə",
      desc: "Hörmətli ziyarətçi, Monodoxia Academy platformasında təhsil, analitika və təhlükəsizlik sistemlərini yeniləmək məqsədilə planlaşdırılmış texniki təkmilləşdirmə işləri aparılır. Sistem ən qısa zamanda yenidən tam fəaliyyətini bərpa edəcəkdir.",
      notice: "Tezliklə Aktiv"
    },
    en: {
      title: "Scheduled System Maintenance",
      desc: "Dear visitor, scheduled maintenance is currently underway to enhance learning, analytics, and security systems. We will be back online shortly.",
      notice: "Back Soon"
    },
    ru: {
      title: "Плановое техническое обслуживание",
      desc: "Уважаемый посетитель, на платформе Monodoxia Academy проводятся плановые технические работы для улучшения систем безопасности и качества. Скоро мы вернемся к работе.",
      notice: "Скоро открытие"
    },
    tr: {
      title: "Planlı Bakım ve Güncelleme",
      desc: "Değerli ziyaretçimiz, Monodoxia Academy platformunda eğitim, analitik ve güvenlik sistemlerini geliştirmek amacıyla teknik bakım çalışmaları yürütülmektedir. Çok yakında yeniden hizmetinizdeyiz.",
      notice: "Yakında Aktif"
    }
  }
};

const INITIAL_CLUB_TIERS = [
  {
    id: "free",
    name: "Giriş (Free)",
    price: "0",
    period: "Ömürlük",
    features: ["Açıq bloq yazılarına və ictimai müzakirələrə giriş", "Aylıq ümumi vebinarlara dinləyici qismində qatılmaq", "Bülleten və psixoloji bələdçi bildirişləri"],
    active: true,
    translations: {
      az: {
        name: "Giriş (Free)",
        period: "Ömürlük",
        features: ["Açıq bloq yazılarına və ictimai müzakirələrə giriş", "Aylıq ümumi vebinarlara dinləyici qismində qatılmaq", "Bülleten və psixoloji bələdçi bildirişləri"]
      },
      en: {
        name: "Intro (Free)",
        period: "Lifetime",
        features: ["Access to public blog posts and community discussions", "Attend monthly general webinars as a listener", "Newsletter and psychological guide updates"]
      },
      tr: {
        name: "Giriş (Ücretsiz)",
        period: "Ömür boyu",
        features: ["Açık blog yazılarına ve topluluk tartışmalarına erişim", "Aylık genel webinarlara dinleyici olarak katılma", "Bülten ve psikolojik rehber bildirimleri"]
      },
      ru: {
        name: "Вводный (Free)",
        period: "Бессрочно",
        features: ["Доступ к открытым статьям блога и обсуждениям", "Участие в ежемесячных вебинарах в качестве слушателя", "Рассылка и уведомления психологических гидов"]
      }
    }
  },
  {
    id: "basic",
    name: "Basic Rezident",
    price: "45",
    period: "/ aylıq",
    features: ["Coaching Club standart müzakirə platforması", "20+ saatlıq səsli meditasiya kitabxanası", "Kurslara 10% daimi tələbə endirimi", "Ayda 1 canlı sual-cavab sessiyası"],
    active: true,
    translations: {
      az: {
        name: "Basic Rezident",
        period: "/ aylıq",
        features: ["Coaching Club standart müzakirə platforması", "20+ saatlıq səsli meditasiya kitabxanası", "Kurslara 10% daimi tələbə endirimi", "Ayda 1 canlı sual-cavab sessiyası"]
      },
      en: {
        name: "Basic Resident",
        period: "/ monthly",
        features: ["Coaching Club standard discussion platform", "20+ hours of audio meditation library", "10% permanent student discount on courses", "1 live Q&A session per month"]
      },
      tr: {
        name: "Basic Üye",
        period: "/ aylık",
        features: ["Coaching Club standart tartışma platformu", "20+ saatlik sesli meditasyon kütüphanesi", "Kurslarda %10 sürekli öğrenci indirimi", "Ayda 1 canlı soru-cevap oturumu"]
      },
      ru: {
        name: "Базовый резидент",
        period: "/ месяц",
        features: ["Стандартная дискуссионная платформа Coaching Club", "20+ часов аудиомедитаций в библиотеке", "Постоянная скидка 10% на курсы", "1 живая сессия вопросов и ответов в месяц"]
      }
    }
  },
  {
    id: "premium",
    name: "Premium Rezident",
    price: "95",
    period: "/ aylıq",
    popular: true,
    features: ["Bütün canlı klub tədbirləri və masterklaslar", "Telegram VIP məxfi müzakirə otağı", "Kurslara 25% fərdi endirim", "Aylıq 1 fərdi diaqnostik orientasiya", "Tam 100+ saatlıq meditasiya və video arxivi"],
    active: true,
    translations: {
      az: {
        name: "Premium Rezident",
        period: "/ aylıq",
        features: ["Bütün canlı klub tədbirləri və masterklaslar", "Telegram VIP məxfi müzakirə otağı", "Kurslara 25% fərdi endirim", "Aylıq 1 fərdi diaqnostik orientasiya", "Tam 100+ saatlıq meditasiya və video arxivi"]
      },
      en: {
        name: "Premium Resident",
        period: "/ monthly",
        features: ["All live club events and masterclasses", "Telegram VIP private discussion group", "25% personal discount on courses", "1 monthly individual diagnostic orientation", "Full 100+ hours meditation and video archive"]
      },
      tr: {
        name: "Premium Üye",
        period: "/ aylık",
        features: ["Tüm canlı kulüp etkinlikleri ve masterclasslar", "Telegram VIP gizli tartışma odası", "Kurslarda %25 kişisel indirim", "Ayda 1 bireysel diagnostik oryantasyon", "Tam 100+ saatlik meditasyon ve video arşivi"]
      },
      ru: {
        name: "Премиум резидент",
        period: "/ месяц",
        features: ["Все живые клубные мероприятия и мастер-классы", "Закрытая VIP группа в Telegram", "Персональная скидка 25% на курсы", "1 индивидуальная диагностическая ориентация в месяц", "Полный архив 100+ часов медитаций и видео"]
      }
    }
  },
  {
    id: "vip",
    name: "VIP Salon",
    price: "250",
    period: "/ aylıq",
    features: ["Bütün Premium imtiyazlar daxil", "Hər ay 2 fərdi ICF kouçinq sessiyası", "Oflayn illik retreat və düşərgələrə prioritet giriş", "Şəxsi inkişaf mentoru və 24/7 dəstək xətti"],
    active: true,
    translations: {
      az: {
        name: "VIP Salon",
        period: "/ aylıq",
        features: ["Bütün Premium imtiyazlar daxil", "Hər ay 2 fərdi ICF kouçinq sessiyası", "Oflayn illik retreat və düşərgələrə prioritet giriş", "Şəxsi inkişaf mentoru və 24/7 dəstək xətti"]
      },
      en: {
        name: "VIP Lounge",
        period: "/ monthly",
        features: ["All Premium benefits included", "2 personal ICF coaching sessions each month", "Priority access to annual offline retreats and camps", "Personal development mentor and 24/7 support line"]
      },
      tr: {
        name: "VIP Salon",
        period: "/ aylık",
        features: ["Tüm Premium ayrıcalıklar dahil", "Her ay 2 bireysel ICF koçluk seansı", "Yıllık inziva ve kamplara öncelikli erişim", "Kişisel gelişim mentoru ve 7/24 destek hattı"]
      },
      ru: {
        name: "VIP Салон",
        period: "/ месяц",
        features: ["Все привилегии Premium включены", "2 индивидуальные сессии ICF-коучинга каждый месяц", "Приоритетный доступ к ежегодным выездным ретритам", "Персональный ментор развития и поддержка 24/7"]
      }
    }
  }
];

const INITIAL_SQL_CONFIG = {
  engine: "MySQL / MariaDB (cPanel / DirectAdmin / Plesk)",
  host: "localhost",
  port: "3306",
  database: "monodoxia_academy_db",
  username: "monodoxia_user",
  password: "••••••••••••",
  charset: "utf8mb4_unicode_ci",
  ssl: false,
  maxConnections: 25,
  timeoutMs: 5000,
  tablePrefix: "mdx_",
  status: "Qoşulub (22ms)",
  lastTested: new Date().toLocaleTimeString('az-AZ')
};

const AppContext = createContext();

export function safeSetLocalStorage(key, val) {
  try {
    const serialized = typeof val === 'string' ? val : JSON.stringify(val);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.warn(`localStorage save failed for ${key}:`, err);
    if (key === 'monodoxia_admin_events' && Array.isArray(val)) {
      try {
        const stripped = val.map(ev => ({
          ...ev,
          image: (ev && typeof ev.image === 'string' && ev.image.startsWith('data:')) ? '' : (ev?.image || '')
        }));
        localStorage.setItem(key, JSON.stringify(stripped));
      } catch (e2) {}
    }
  }
}

export function AppProvider({ children }) {
  // Current User Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('monodoxia_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // SQL Database Configuration for Hostings
  const [sqlConfig, setSqlConfig] = useState(() => {
    const saved = localStorage.getItem('monodoxia_sql_config');
    return saved ? JSON.parse(saved) : INITIAL_SQL_CONFIG;
  });

  // Course progress tracking
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('monodoxia_progress');
    return saved ? JSON.parse(saved) : {
      'course-1': { completedLessons: ['l1-1', 'l1-2'], percent: 33 },
      'course-2': { completedLessons: [], percent: 0 },
      'course-3': { completedLessons: [], percent: 0 },
      'course-4': { completedLessons: [], percent: 0 }
    };
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('monodoxia_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('monodoxia_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [userTier, setUserTier] = useState(() => {
    const saved = localStorage.getItem('monodoxia_tier');
    if (!saved) return 'Free';
    if (saved.startsWith('{') || saved.startsWith('"')) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed.id || parsed.name || 'Free';
        }
        return String(parsed);
      } catch (e) {
        return 'Free';
      }
    }
    return saved;
  });

  const [safetyAck, setSafetyAck] = useState(() => {
    return localStorage.getItem('monodoxia_safety_ack') === 'true';
  });

  // Dynamic Collections (Editable in Admin Panel)
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : INITIAL_USERS;
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  // Dynamic Roles & RBAC (Role-Based Access Control)
  const [rolesList, setRolesList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_roles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_ROLES;
  });

  const [coursesList, setCoursesList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return (COURSES && Array.isArray(COURSES) && COURSES.length > 0) ? COURSES : [];
  });

  // Centralized Taxonomy & Categories
  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [clubTiersList, setClubTiersList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_tiers');
    return saved ? JSON.parse(saved) : INITIAL_CLUB_TIERS;
  });

  const [eventsList, setEventsList] = useState(() => {
    try {
      const saved = localStorage.getItem('monodoxia_admin_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading monodoxia_admin_events from localStorage:', e);
    }
    return (EVENTS && Array.isArray(EVENTS) && EVENTS.length > 0) ? EVENTS : [];
  });

  const [communityTopics, setCommunityTopics] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_topics');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return (COMMUNITY_TOPICS && Array.isArray(COMMUNITY_TOPICS) && COMMUNITY_TOPICS.length > 0) ? COMMUNITY_TOPICS : [];
  });

  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Home Page Dynamic Content & Blocks (CMS)
  const [homeContent, setHomeContent] = useState(() => {
    const saved = localStorage.getItem('monodoxia_home_content');
    return saved ? JSON.parse(saved) : INITIAL_HOME_CONTENT;
  });

  const [pillarsList, setPillarsList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_pillars');
    return saved ? JSON.parse(saved) : INITIAL_PILLARS;
  });

  const [areasList, setAreasList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_areas');
    return saved ? JSON.parse(saved) : AREAS;
  });

  const [coachesList, setCoachesList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_coaches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return COACHES;
  });

  const [testimonialsList, setTestimonialsList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_testimonials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return (INITIAL_TESTIMONIALS && Array.isArray(INITIAL_TESTIMONIALS) && INITIAL_TESTIMONIALS.length > 0) ? INITIAL_TESTIMONIALS : [];
  });

  const [faqsList, setFaqsList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_faqs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return (INITIAL_FAQS && Array.isArray(INITIAL_FAQS) && INITIAL_FAQS.length > 0) ? INITIAL_FAQS : [];
  });

  // Applications, Dynamic Form Fields & Registrations
  const [applicationsList, setApplicationsList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_applications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(app => !['APP-1001', 'APP-1002', 'APP-1003', 'APP-1004', 'APP-1005', 'APP-1006'].includes(app.id));
      } catch (e) {
        return INITIAL_APPLICATIONS;
      }
    }
    return INITIAL_APPLICATIONS;
  });

  const [formFieldsList, setFormFieldsList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_form_fields');
    return saved ? JSON.parse(saved) : INITIAL_FORM_FIELDS;
  });

  const [userNotifications, setUserNotifications] = useState(() => {
    const saved = localStorage.getItem('monodoxia_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(n => !['notif-1', 'notif-2'].includes(n.id));
      } catch (e) {
        return INITIAL_NOTIFICATIONS;
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeCoach, setActiveCoach] = useState(null);
  const [newTopicModalOpen, setNewTopicModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState('overview');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('applications');

  // Application Modal
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [activeApplicationTarget, setActiveApplicationTarget] = useState(null);

  // Page Routing (Separate pages with customizable URL slugs)
  const validPages = VALID_PAGE_IDS;

  const [currentPage, setCurrentPage] = useState(() => {
    let initialSlugs = DEFAULT_PAGE_SLUGS;
    try {
      const saved = localStorage.getItem('monodoxia_admin_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pageSlugs || parsed.page_slugs) {
          initialSlugs = { ...DEFAULT_PAGE_SLUGS, ...(parsed.pageSlugs || parsed.page_slugs) };
        }
      }
    } catch (e) {}
    return resolvePageFromLocation(initialSlugs);
  });

  const getPageSlug = (pageId) => {
    return resolvePageSlug(pageId, platformSettings?.pageSlugs || platformSettings?.page_slugs);
  };

  const getPageUrl = (pageId) => {
    return resolvePageUrl(pageId, platformSettings?.pageSlugs || platformSettings?.page_slugs);
  };

  // Sync current page with browser back/forward and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const page = resolvePageFromLocation(platformSettings?.pageSlugs || platformSettings?.page_slugs);
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [platformSettings?.pageSlugs, platformSettings?.page_slugs]);

  // Synchronize on mount if settings change
  useEffect(() => {
    const targetPage = resolvePageFromLocation(platformSettings?.pageSlugs || platformSettings?.page_slugs);
    if (targetPage && targetPage !== currentPage) {
      setCurrentPage(targetPage);
    }
  }, [platformSettings?.pageSlugs, platformSettings?.page_slugs]);

  const navigateTo = (page) => {
    const target = validPages.includes(page) ? page : 'home';
    const targetUrl = resolvePageUrl(target, platformSettings?.pageSlugs || platformSettings?.page_slugs);

    try {
      if (window.location.pathname !== targetUrl || window.location.hash) {
        window.history.pushState({ page: target }, '', targetUrl);
      }
    } catch (e) {
      const slug = getPageSlug(target);
      window.location.hash = slug || target;
    }

    setCurrentPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePageSlugs = (newSlugs) => {
    const current = platformSettings?.pageSlugs || platformSettings?.page_slugs || DEFAULT_PAGE_SLUGS;
    const merged = { ...current };

    Object.entries(newSlugs || {}).forEach(([k, v]) => {
      if (validPages.includes(k)) {
        if (k === 'home') {
          merged[k] = sanitizeSlug(v);
        } else {
          merged[k] = sanitizeSlug(v) || DEFAULT_PAGE_SLUGS[k];
        }
      }
    });

    updatePlatformSettings({
      pageSlugs: merged,
      page_slugs: merged
    });

    // Also update browser URL if the current page's slug was modified
    const newTargetUrl = resolvePageUrl(currentPage, merged);
    try {
      window.history.replaceState({ page: currentPage }, '', newTargetUrl);
    } catch (e) {}

    showToast('Səhifə linkləri (URL) uğurla yeniləndi və yadda saxlanıldı', 'success');
  };

  // Toasts
  const [toasts, setToasts] = useState([]);

  // CSRF Protection Token
  const [csrfToken, setCsrfToken] = useState(() => {
    return sessionStorage.getItem('monodoxia_csrf') || '';
  });

  // Centralized Authenticated API Call Helper
  const apiCall = async (action, data = null, method = 'POST') => {
    const token = csrfToken || sessionStorage.getItem('monodoxia_csrf') || '';
    const options = {
      method,
      headers: {
        ...(data ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { 'X-CSRF-Token': token } : {})
      },
      credentials: 'include'
    };
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    try {
      const res = await fetch(`/api.php?action=${action}`, options);
      const resData = await res.json().catch(() => null);
      if (resData?.csrf_token) {
        setCsrfToken(resData.csrf_token);
        sessionStorage.setItem('monodoxia_csrf', resData.csrf_token);
      }
      return resData;
    } catch (e) {
      return null;
    }
  };

  // Live MySQL Hydration on App Mount
  useEffect(() => {
    fetch('/api.php?action=get_all', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data?.status === 'success') {
          if (data.csrf_token) {
            setCsrfToken(data.csrf_token);
            sessionStorage.setItem('monodoxia_csrf', data.csrf_token);
          }
          if (data.users && data.users.length > 0) {
            const mappedUsers = data.users.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role || 'Tələbə',
              tier: u.tier || 'Free',
              status: u.status || 'Aktiv',
              joinedDate: u.joined_date || (u.created_at ? u.created_at.split(' ')[0] : new Date().toISOString().split('T')[0])
            }));
            setUsersList(mappedUsers);

            // Sync current session with MySQL role and tier
            setCurrentUser(prev => {
              if (!prev || !prev.email) return prev;
              const matched = mappedUsers.find(u => (u.email || '').toLowerCase() === prev.email.toLowerCase());
              if (matched) {
                const names = matched.name ? matched.name.split(' ') : [prev.firstName, prev.lastName];
                return {
                  ...prev,
                  id: matched.id || prev.id,
                  firstName: names[0] || prev.firstName,
                  lastName: names.slice(1).join(' ') || prev.lastName,
                  role: matched.role || prev.role,
                  tier: matched.tier || prev.tier,
                  status: matched.status || prev.status
                };
              }
              return prev;
            });
          }
          if (Array.isArray(data.courses)) {
            const mappedCourses = data.courses.map(c => {
              let parsedTranslations = {};
              if (typeof c.translations_json === 'string' && c.translations_json.trim()) {
                try { parsedTranslations = JSON.parse(c.translations_json); } catch (e) {}
              } else if (c.translations && typeof c.translations === 'object') {
                parsedTranslations = c.translations;
              } else if (c.translations_json && typeof c.translations_json === 'object') {
                parsedTranslations = c.translations_json;
              }

              let parsedModules = [];
              if (typeof c.modules_json === 'string' && c.modules_json.trim()) {
                try { parsedModules = JSON.parse(c.modules_json); } catch (e) {}
              } else if (Array.isArray(c.modules)) {
                parsedModules = c.modules;
              } else if (Array.isArray(c.modules_json)) {
                parsedModules = c.modules_json;
              }

              let parsedTags = [];
              if (typeof c.tags_json === 'string' && c.tags_json.trim()) {
                try { parsedTags = JSON.parse(c.tags_json); } catch (e) {}
              } else if (Array.isArray(c.tags)) {
                parsedTags = c.tags;
              } else if (Array.isArray(c.tags_json)) {
                parsedTags = c.tags_json;
              }

              return {
                id: c.id,
                category: c.category || 'psychology',
                badge: c.badge || 'KURS',
                badgeClass: c.badge_class || c.badgeClass || 'bg-secondary/10 text-secondary',
                duration: c.duration || '8 Həftə',
                deadline: c.deadline || null,
                maxParticipants: Number(c.max_participants || c.maxParticipants) || 30,
                initialParticipants: Number(c.initial_participants || c.initialParticipants) || 0,
                title: c.title || '',
                description: c.description || '',
                instructor: c.instructor || '',
                instructorRole: c.instructor_role || c.instructorRole || 'Kouç',
                status: c.status || 'Qrup qəbulu aktivdir',
                occupancy: Number(c.occupancy) || 0,
                price: c.price || '0',
                featured: Boolean(Number(c.featured)),
                isOnline: c.is_online !== undefined ? Boolean(Number(c.is_online)) : true,
                translations: parsedTranslations,
                modules: parsedModules,
                tags: parsedTags
              };
            });
            setCoursesList(mappedCourses);
            localStorage.setItem('monodoxia_admin_courses', JSON.stringify(mappedCourses));
          }
          if (Array.isArray(data.events)) {
            const mappedEvents = data.events.map(e => {
              let parsedTrans = {};
              if (typeof e.translations_json === 'string' && e.translations_json.trim()) {
                try { parsedTrans = JSON.parse(e.translations_json); } catch (err) {}
              } else if (typeof e.translations === 'object' && e.translations) {
                parsedTrans = e.translations;
              }
              return {
                id: e.id,
                title: e.title,
                datetime: e.datetime_label || e.datetime || 'Tezliklə',
                typeBadge: e.type_badge || e.typeBadge || 'VEBİNAR',
                badgeClass: e.badge_class || e.badgeClass || 'bg-secondary/10 text-secondary',
                speaker: e.speaker || 'Ekspert',
                speakerRole: e.speaker_role || e.speakerRole || 'Spiker',
                capacity: Number(e.capacity) || 100,
                registered: Number(e.registered) || 0,
                desc: e.description || e.desc || '',
                isOnline: e.is_online !== undefined ? Boolean(Number(e.is_online)) : (e.isOnline ?? true),
                image: e.image || '',
                price: e.price || 'Pulsuz',
                status: e.status || 'Aktiv',
                translations: parsedTrans
              };
            });
            setEventsList(mappedEvents);
            safeSetLocalStorage('monodoxia_admin_events', mappedEvents);
          }
          if (data.community && data.community.length > 0) {
            const mappedCommunity = data.community.map(p => ({
              id: p.id,
              badge: p.badge,
              badgeClass: p.badge_class || 'text-secondary font-semibold',
              title: p.title,
              snippet: p.snippet || p.content || '',
              content: p.content || p.snippet || '',
              desc: p.snippet || p.content || '',
              author: p.author,
              authorRole: p.author_role || 'Rezident',
              time: p.time_ago || 'İndicə',
              likes: Number(p.likes) || 0,
              repliesCount: Number(p.replies) || 0,
              pinned: Boolean(Number(p.pinned)),
              allowComments: p.allow_comments !== undefined && p.allow_comments !== null ? Boolean(Number(p.allow_comments)) : (p.allowComments !== undefined ? Boolean(p.allowComments) : true),
              translations: typeof p.translations_json === 'string' ? JSON.parse(p.translations_json || '{}') : (p.translations_json || {})
            }));
            setCommunityTopics(mappedCommunity);
            safeSetLocalStorage('monodoxia_admin_topics', mappedCommunity);
          }
          if (Array.isArray(data.club_tiers)) {
            const mappedTiers = data.club_tiers.map(t => {
              let parsedFeatures = [];
              if (typeof t.features_json === 'string' && t.features_json.trim()) {
                try { parsedFeatures = JSON.parse(t.features_json); } catch (e) {}
              } else if (Array.isArray(t.features)) {
                parsedFeatures = t.features;
              } else if (Array.isArray(t.features_json)) {
                parsedFeatures = t.features_json;
              }

              let parsedTranslations = {};
              if (typeof t.translations === 'string' && t.translations.trim()) {
                try { parsedTranslations = JSON.parse(t.translations); } catch (e) {}
              } else if (t.translations && typeof t.translations === 'object') {
                parsedTranslations = t.translations;
              } else if (typeof t.translations_json === 'string' && t.translations_json.trim()) {
                try { parsedTranslations = JSON.parse(t.translations_json); } catch (e) {}
              }

              return {
                id: t.id,
                name: t.name,
                price: t.price,
                period: t.period,
                popular: Boolean(Number(t.popular)),
                active: t.active !== undefined ? Boolean(Number(t.active)) : true,
                features: parsedFeatures,
                translations: parsedTranslations
              };
            });
            if (mappedTiers.length > 0) {
              setClubTiersList(mappedTiers);
              localStorage.setItem('monodoxia_admin_tiers', JSON.stringify(mappedTiers));
            }
          }
          if (data.categories && data.categories.length > 0) {
            setCategoriesList(data.categories.map(cat => ({
              id: cat.id,
              key: cat.slug || cat.id,
              type: cat.target_type || 'course',
              name: cat.name,
              icon: cat.icon || 'category',
              translations: typeof cat.translations_json === 'string' ? JSON.parse(cat.translations_json || '{}') : (cat.translations_json || {})
            })));
          }
          if (data.coaches && data.coaches.length > 0) {
            setCoachesList(data.coaches.map(c => ({
              id: c.id,
              name: c.name,
              title: c.title,
              bio: c.bio,
              rating: Number(c.rating) || 5.0,
              reviewsCount: Number(c.reviews_count) || 0,
              hourlyRate: c.hourly_rate || '100 ₼ / saat',
              sessionDuration: c.session_duration || '60 dəqiqə',
              image: c.avatar_url || '',
              isActive: Boolean(Number(c.is_active ?? 1)),
              specialties: typeof c.specialties_json === 'string' ? JSON.parse(c.specialties_json || '[]') : (c.specialties_json || []),
              languages: typeof c.languages_json === 'string' ? JSON.parse(c.languages_json || '[]') : (c.languages_json || []),
              availableSlots: typeof c.available_slots_json === 'string' ? JSON.parse(c.available_slots_json || '[]') : (c.available_slots_json || []),
              translations: typeof c.translations_json === 'string' ? JSON.parse(c.translations_json || '{}') : (c.translations_json || {})
            })));
          }
          if (data.cms_blocks && data.cms_blocks.length > 0) {
            const blockMap = {};
            data.cms_blocks.forEach(b => {
              try {
                blockMap[b.block_key] = typeof b.content_json === 'string' ? JSON.parse(b.content_json) : b.content_json;
              } catch (e) {}
            });
            setHomeContent(prev => ({ ...prev, ...blockMap }));
          }
          if (data.student_progress && data.student_progress.length > 0) {
            const progMap = {};
            data.student_progress.forEach(p => {
              progMap[p.course_id] = {
                completedLessons: typeof p.completed_lessons_json === 'string' ? JSON.parse(p.completed_lessons_json || '[]') : (p.completed_lessons_json || []),
                percent: Number(p.percent) || 0
              };
            });
            setProgress(prev => ({ ...prev, ...progMap }));
          }
          if (data.student_certificates && data.student_certificates.length > 0) {
            setCertificates(data.student_certificates.map(c => ({
              id: c.id,
              courseTitle: c.course_title,
              studentName: c.student_name,
              instructor: c.instructor,
              date: c.issue_date
            })));
          }
          if (data.bookings && data.bookings.length > 0) {
            setBookings(data.bookings.map(b => ({
              id: b.id,
              coachId: b.coach_id,
              coachName: b.coach_name,
              slot: b.slot,
              format: b.format,
              notes: b.notes,
              date: b.created_at ? b.created_at.split(' ')[0] : ''
            })));
          }
          if (data.applications && data.applications.length > 0) {
            const mappedApps = data.applications.map(a => ({
              id: a.id,
              userId: a.user_id,
              userName: a.user_name,
              userEmail: a.user_email,
              userPhone: a.user_phone,
              targetType: a.target_type,
              targetId: a.target_id,
              targetTitle: a.target_title,
              price: a.price,
              status: a.status,
              paymentStatus: a.payment_status,
              attendanceStatus: a.attendance_status,
              adminNote: a.admin_note,
              formResponses: typeof a.form_responses === 'string' ? JSON.parse(a.form_responses || '{}') : (a.form_responses || {}),
              userNote: a.user_note,
              appliedAt: a.applied_at
            }));
            setApplicationsList(mappedApps);
            safeSetLocalStorage('monodoxia_applications', mappedApps);
          }
          if (Array.isArray(data.notifications)) {
            const mappedNotifs = data.notifications.map(n => ({
              id: String(n.id),
              userId: String(n.user_id),
              title: n.title,
              message: n.message,
              type: n.type || 'info',
              isRead: Boolean(Number(n.is_read)),
              createdAt: n.created_at ? n.created_at.replace('T', ' ').substring(0, 16) : ''
            }));
            setUserNotifications(mappedNotifs);
            safeSetLocalStorage('monodoxia_notifications', mappedNotifs);
          }
          if (data.form_fields && data.form_fields.length > 0) {
            setFormFieldsList(data.form_fields.map(f => {
              let parsedTrans = {};
              try {
                parsedTrans = typeof f.translations_json === 'string' ? JSON.parse(f.translations_json || '{}') : (f.translations_json || {});
              } catch (e) {}

              const opts = typeof f.options_json === 'string' ? JSON.parse(f.options_json || '[]') : (f.options_json || []);

              if (!parsedTrans || Object.keys(parsedTrans).length === 0) {
                const matchInitial = INITIAL_FORM_FIELDS.find(initF => initF.id === f.id);
                if (matchInitial?.translations) {
                  parsedTrans = matchInitial.translations;
                } else {
                  parsedTrans = {
                    az: { label: f.label || '', placeholder: f.placeholder || '', options: opts }
                  };
                }
              }

              return {
                id: f.id,
                targetType: f.target_type || 'all',
                target_type: f.target_type || 'all',
                label: f.label,
                fieldType: f.field_type || 'text',
                field_type: f.field_type || 'text',
                options: opts,
                placeholder: f.placeholder || '',
                isRequired: Boolean(Number(f.is_required)),
                is_required: Number(f.is_required) || 0,
                isActive: Boolean(Number(f.is_active ?? 1)),
                is_active: Number(f.is_active ?? 1),
                sortOrder: Number(f.sort_order) || 0,
                sort_order: Number(f.sort_order) || 0,
                translations: parsedTrans
              };
            }));
          }
          if (data.settings && data.settings.length > 0) {
            const mappedSettings = {};
            data.settings.forEach(s => {
              let val = s.key_value;
              if (val === 'true' || val === '1' || val === 1 || val === true) val = true;
              else if (val === 'false' || val === '0' || val === 0 || val === false) val = false;
              else if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
                try { val = JSON.parse(val); } catch (e) {}
              }
              mappedSettings[s.key_name] = val;
            });
            const resolvedEmail = mappedSettings.contactEmail || mappedSettings.contact_email;
            if (resolvedEmail) {
              mappedSettings.contactEmail = resolvedEmail;
              mappedSettings.contact_email = resolvedEmail;
            }
            const resolvedPhone = mappedSettings.contactPhone || mappedSettings.contact_phone;
            if (resolvedPhone) {
              mappedSettings.contactPhone = resolvedPhone;
              mappedSettings.contact_phone = resolvedPhone;
            }
            if (mappedSettings.maintenanceMode !== undefined) {
              const b = Boolean(mappedSettings.maintenanceMode === true || mappedSettings.maintenanceMode === 'true' || mappedSettings.maintenanceMode === 1 || mappedSettings.maintenanceMode === '1');
              mappedSettings.maintenanceMode = b;
              mappedSettings.maintenance_mode = b ? '1' : '0';
            } else if (mappedSettings.maintenance_mode !== undefined) {
              const b = Boolean(mappedSettings.maintenance_mode === '1' || mappedSettings.maintenance_mode === 1 || mappedSettings.maintenance_mode === true || mappedSettings.maintenance_mode === 'true');
              mappedSettings.maintenanceMode = b;
              mappedSettings.maintenance_mode = b ? '1' : '0';
            }
            if (mappedSettings.page_slugs && !mappedSettings.pageSlugs) {
              mappedSettings.pageSlugs = mappedSettings.page_slugs;
            } else if (mappedSettings.pageSlugs && !mappedSettings.page_slugs) {
              mappedSettings.page_slugs = mappedSettings.pageSlugs;
            }
            if (mappedSettings.pageSlugs) {
              mappedSettings.pageSlugs = { ...DEFAULT_PAGE_SLUGS, ...mappedSettings.pageSlugs };
            }
            setPlatformSettings(prev => ({ ...prev, ...mappedSettings }));
          }
          if (data.roles && data.roles.length > 0) {
            const mappedRoles = data.roles.map(r => ({
              id: r.id,
              name: r.name,
              code: r.code,
              description: r.description,
              isSystem: Boolean(Number(r.is_system)),
              isActive: Boolean(Number(r.is_active ?? 1)),
              color: r.color || '#b45309',
              badgeClass: r.badge_class || 'bg-amber-100 text-amber-800 border-amber-300',
              permissions: typeof r.permissions === 'string' ? JSON.parse(r.permissions || '[]') : (r.permissions || []),
              createdAt: r.created_at ? r.created_at.split(' ')[0] : '2025-01-01',
              updatedAt: r.updated_at ? r.updated_at.split(' ')[0] : '2025-01-01'
            }));
            setRolesList(mappedRoles);
          }
        }
      })
      .catch(() => {});
  }, []);

  // LocalStorage Sync
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('monodoxia_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('monodoxia_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('monodoxia_admin_roles', JSON.stringify(rolesList));
  }, [rolesList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('monodoxia_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('monodoxia_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('monodoxia_tier', userTier);
  }, [userTier]);

  useEffect(() => {
    localStorage.setItem('monodoxia_admin_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_admin_courses', JSON.stringify(coursesList));
  }, [coursesList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_admin_categories', JSON.stringify(categoriesList));
  }, [categoriesList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_admin_tiers', JSON.stringify(clubTiersList));
  }, [clubTiersList]);

  useEffect(() => {
    safeSetLocalStorage('monodoxia_admin_events', eventsList);
  }, [eventsList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_admin_topics', JSON.stringify(communityTopics));
  }, [communityTopics]);

  useEffect(() => {
    localStorage.setItem('monodoxia_admin_settings', JSON.stringify(platformSettings));
  }, [platformSettings]);

  useEffect(() => {
    localStorage.setItem('monodoxia_sql_config', JSON.stringify(sqlConfig));
  }, [sqlConfig]);

  useEffect(() => {
    localStorage.setItem('monodoxia_home_content', JSON.stringify(homeContent));
  }, [homeContent]);

  useEffect(() => {
    localStorage.setItem('monodoxia_pillars', JSON.stringify(pillarsList));
  }, [pillarsList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_areas', JSON.stringify(areasList));
  }, [areasList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_coaches', JSON.stringify(coachesList));
  }, [coachesList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_testimonials', JSON.stringify(testimonialsList));
  }, [testimonialsList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_faqs', JSON.stringify(faqsList));
  }, [faqsList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_applications', JSON.stringify(applicationsList));
  }, [applicationsList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_form_fields', JSON.stringify(formFieldsList));
  }, [formFieldsList]);

  useEffect(() => {
    localStorage.setItem('monodoxia_notifications', JSON.stringify(userNotifications));
  }, [userNotifications]);

  // Real-time Multi-Tab Synchronization
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'monodoxia_applications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setApplicationsList(parsed);
        } catch (err) {}
      }
      if (e.key === 'monodoxia_notifications' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setUserNotifications(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Periodic and Window-Focus Live Background Sync
  useEffect(() => {
    let isSubscribed = true;
    const fetchLiveUpdates = async () => {
      try {
        const res = await fetch('/api.php?action=get_all', { credentials: 'include' });
        const data = await res.json().catch(() => null);
        if (!isSubscribed || data?.status !== 'success') return;

        if (Array.isArray(data.applications) && data.applications.length > 0) {
          const remoteApps = data.applications.map(a => ({
            id: a.id,
            userId: a.user_id,
            userName: a.user_name,
            userEmail: a.user_email,
            userPhone: a.user_phone,
            targetType: a.target_type,
            targetId: a.target_id,
            targetTitle: a.target_title,
            price: a.price,
            status: a.status,
            paymentStatus: a.payment_status,
            attendanceStatus: a.attendance_status,
            adminNote: a.admin_note,
            formResponses: typeof a.form_responses === 'string' ? JSON.parse(a.form_responses || '{}') : (a.form_responses || {}),
            userNote: a.user_note,
            appliedAt: a.applied_at
          }));

          setApplicationsList(prev => {
            if (currentUser) {
              remoteApps.forEach(rApp => {
                if (rApp.userId === currentUser.id) {
                  const match = prev.find(p => p.id === rApp.id);
                  if (match && match.status !== rApp.status) {
                    showToast(`"${rApp.targetTitle}" müraciətinizin statusu yeniləndi: ${rApp.status}`, 'info');
                  }
                }
              });
            }
            safeSetLocalStorage('monodoxia_applications', remoteApps);
            return remoteApps;
          });
        }

        if (Array.isArray(data.notifications)) {
          const remoteNotifs = data.notifications.map(n => ({
            id: String(n.id),
            userId: String(n.user_id),
            title: n.title,
            message: n.message,
            type: n.type || 'info',
            isRead: Boolean(Number(n.is_read)),
            createdAt: n.created_at ? n.created_at.replace('T', ' ').substring(0, 16) : ''
          }));

          setUserNotifications(remoteNotifs);
          safeSetLocalStorage('monodoxia_notifications', remoteNotifs);
        }
      } catch (err) {}
    };

    const intervalId = setInterval(fetchLiveUpdates, 20000);
    const handleFocus = () => fetchLiveUpdates();
    window.addEventListener('focus', handleFocus);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Auth Operations
  const login = async (email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    try {
      const token = csrfToken || sessionStorage.getItem('monodoxia_csrf') || '';
      const res = await fetch('/api.php?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'X-CSRF-Token': token } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ email: normalizedEmail, password })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success' && data.user) {
        if (data.csrf_token) {
          setCsrfToken(data.csrf_token);
          sessionStorage.setItem('monodoxia_csrf', data.csrf_token);
        }
        const names = data.user.name ? data.user.name.split(' ') : [normalizedEmail.split('@')[0], ''];
        const user = {
          id: data.user.id,
          firstName: names[0] || normalizedEmail.split('@')[0],
          lastName: names.slice(1).join(' ') || '',
          name: data.user.name || normalizedEmail.split('@')[0],
          email: data.user.email,
          role: data.user.role || 'Tələbə',
          tier: data.user.tier || 'Free',
          status: data.user.status || 'Aktiv',
          joinedDate: data.user.joined_date || new Date().toISOString().split('T')[0],
          country: 'Azərbaycan',
          city: 'Bakı'
        };
        setCurrentUser(user);
        setUserTier(user.tier);
        setAuthModalOpen(false);
        showToast(`Daxil oldunuz: ${user.firstName} (${user.role})`, 'success');
        return { success: true, user };
      } else {
        const errorMsg = data.message || 'Email və ya şifrə yanlışdır.';
        showToast(errorMsg, 'error');
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      // Offline fallback: Check existing registered user from DB/cache ONLY
      const isAdminFallback = normalizedEmail === 'admin@monodoxia.academy' && password === 'admin123';
      const existing = usersList.find(u => (u.email || '').toLowerCase() === normalizedEmail) || 
        (isAdminFallback ? INITIAL_USERS[0] : null);

      if (existing && (!isAdminFallback || password === 'admin123')) {
        const names = existing.name ? existing.name.split(' ') : [email.split('@')[0], ''];
        const user = {
          id: existing.id,
          firstName: names[0] || email.split('@')[0],
          lastName: names.slice(1).join(' ') || '',
          name: existing.name || email.split('@')[0],
          email: existing.email,
          role: existing.role || 'Tələbə',
          tier: existing.tier || 'Free',
          country: 'Azərbaycan',
          city: 'Bakı'
        };
        setCurrentUser(user);
        setUserTier(user.tier);
        setAuthModalOpen(false);
        showToast(`Daxil oldunuz: ${user.firstName} (${user.role})`, 'success');
        return { success: true, user };
      }
      showToast('Giriş xətası: Serverlə əlaqə qurula bilmədi.', 'error');
      return { success: false, message: err.message };
    }
  };

  const register = async (data) => {
    const rawName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    const token = csrfToken || sessionStorage.getItem('monodoxia_csrf') || '';
    try {
      const res = await fetch('/api.php?action=register_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'X-CSRF-Token': token } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          name: rawName,
          email: data.email,
          password: data.password,
          role: 'Tələbə',
          tier: 'Free',
          status: 'Aktiv'
        })
      });
      const resData = await res.json();
      if (res.ok && resData.status === 'success' && resData.user) {
        if (resData.csrf_token) {
          setCsrfToken(resData.csrf_token);
          sessionStorage.setItem('monodoxia_csrf', resData.csrf_token);
        }
        const user = {
          id: resData.user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          name: rawName || resData.user.name,
          email: resData.user.email,
          birthDate: data.birthDate,
          country: data.country || 'Azərbaycan',
          city: data.city || 'Bakı',
          role: 'Tələbə',
          tier: 'Free',
          joinedAt: new Date().toISOString(),
          focusAreas: []
        };
        setCurrentUser(user);
        setUsersList(prev => [{
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'Tələbə',
          tier: 'Free',
          status: 'Aktiv',
          joinedDate: new Date().toISOString().split('T')[0]
        }, ...prev]);
        setAuthModalOpen(false);
        showToast(`Xoş gəldiniz, ${user.firstName}! Hesabınız yaradıldı.`, 'success');
        setTimeout(() => setOnboardingOpen(true), 400);
        return;
      } else {
        showToast(resData.message || 'Qeydiyyat zamanı xəta baş verdi.', 'error');
        return;
      }
    } catch (e) {
      const user = {
        id: 'usr_' + Date.now(),
        firstName: data.firstName,
        lastName: data.lastName,
        name: rawName,
        email: data.email,
        birthDate: data.birthDate,
        country: data.country || 'Azərbaycan',
        city: data.city || 'Bakı',
        role: 'Tələbə',
        tier: 'Free',
        joinedAt: new Date().toISOString(),
        focusAreas: []
      };
      setCurrentUser(user);
      setUsersList(prev => [{
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'Tələbə',
        tier: 'Free',
        status: 'Aktiv',
        joinedDate: new Date().toISOString().split('T')[0]
      }, ...prev]);
      setAuthModalOpen(false);
      showToast(`Xoş gəldiniz, ${user.firstName}! Hesabınız yaradıldı.`, 'success');
      setTimeout(() => setOnboardingOpen(true), 400);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api.php?action=logout', { credentials: 'include' });
    } catch (e) {}
    setCurrentUser(null);
    showToast('Hesabdan çıxış edildi', 'info');
  };

  const acknowledgeSafety = () => {
    setSafetyAck(true);
    localStorage.setItem('monodoxia_safety_ack', 'true');
    showToast('Etik məxfilik və təhlükəsizlik razılığı qəbul edildi.', 'info');
  };

  // Course LMS Player
  const openPlayer = (courseId) => {
    const course = coursesList.find(c => c.id === courseId);
    if (!course) return;
    const firstModule = course.modules && course.modules.length > 0 ? course.modules[0] : null;
    const firstLesson = firstModule && firstModule.lessons && firstModule.lessons.length > 0 ? firstModule.lessons[0] : null;
    if (!firstLesson) {
      showToast('Bu kursun hələ dərsi əlavə edilməyib.', 'warning');
      return;
    }
    setActiveCourse(course);
    setActiveLesson(firstLesson);
    setPlayerModalOpen(true);
  };

  const toggleLessonDone = (courseId, lessonId) => {
    setProgress(prev => {
      const courseProg = prev[courseId] || { completedLessons: [], percent: 0 };
      const list = [...courseProg.completedLessons];
      const idx = list.indexOf(lessonId);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(lessonId);
      }

      const course = coursesList.find(c => c.id === courseId);
      let total = 0;
      if (course?.modules) {
        course.modules.forEach(m => total += (m.lessons?.length || 0));
      }
      const percent = total > 0 ? Math.min(100, Math.round((list.length / total) * 100)) : 0;

      apiCall('save_student_progress', {
        courseId,
        completedLessons: list,
        percent
      });

      if (percent === 100 && courseProg.percent < 100 && course) {
        const cert = {
          id: 'MDX-' + Math.floor(100000 + Math.random() * 900000),
          courseTitle: course.title,
          studentName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Tələbə",
          date: new Date().toLocaleDateString('az-AZ'),
          instructor: course.instructor
        };
        setCertificates(cPrev => [...cPrev, cert]);
        setActiveCertificate(cert);
        setCertificateModalOpen(true);
        apiCall('save_certificate', cert);
        showToast('Təbriklər! Kursu tamamladınız və sertifikat qazandınız.', 'success');
      }

      return {
        ...prev,
        [courseId]: { completedLessons: list, percent }
      };
    });
  };

  // Booking
  const openBooking = (coachOrId) => {
    const coachId = typeof coachOrId === 'object' && coachOrId?.id ? coachOrId.id : coachOrId;
    const coach = coachesList.find(c => c.id === coachId) || (typeof coachOrId === 'object' && coachOrId?.name ? coachOrId : null);
    if (!coach) return;
    setActiveCoach(coach);
    setBookingModalOpen(true);
  };

  const confirmBooking = (bookingData) => {
    const newBooking = {
      id: 'BK-' + Date.now(),
      ...bookingData,
      date: new Date().toLocaleDateString('az-AZ')
    };
    setBookings(prev => [...prev, newBooking]);
    setBookingModalOpen(false);
    apiCall('save_booking', newBooking);
    showToast(`Sessiya uğurla təyin edildi: ${bookingData.coachName}`, 'success');
  };

  // Community
  const likeTopic = (topicId) => {
    setCommunityTopics(prev => prev.map(t => {
      if (t.id === topicId) return { ...t, likes: t.likes + 1 };
      return t;
    }));
    apiCall('like_community_post', { id: topicId });
    showToast('Bəyənmə qeydə alındı', 'info');
  };

  const addTopic = (title, content, badge = "İcma Müzakirəsi", author = null, translations = {}) => {
    const newT = {
      id: 'topic-' + Date.now(),
      badge: badge || "İcma Müzakirəsi",
      badgeClass: "text-secondary font-semibold",
      time: "İndicə",
      title,
      snippet: content,
      content,
      desc: content,
      author: author || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Rezident"),
      likes: 1,
      repliesCount: 0,
      translations: translations || {}
    };
    setCommunityTopics(prev => {
      const next = [newT, ...prev];
      safeSetLocalStorage('monodoxia_admin_topics', next);
      return next;
    });
    setNewTopicModalOpen(false);
    apiCall('save_community_post', newT);
    showToast('Mövzu uğurla dərc edildi.', 'success');
  };

  const deleteTopic = (topicId) => {
    setCommunityTopics(prev => {
      const next = prev.filter(t => t.id !== topicId);
      safeSetLocalStorage('monodoxia_admin_topics', next);
      return next;
    });
    apiCall('delete_community_post', { id: topicId });
    showToast('Mövzu uğurla silindi', 'info');
  };

  const pinTopic = (topicId) => {
    let updatedItem = null;
    setCommunityTopics(prev => {
      const next = prev.map(t => {
        if (t.id === topicId) {
          const isCurrentlyPinned = Boolean(t.pinned || t.badge?.includes('Sabitlənmiş'));
          const nextPinned = !isCurrentlyPinned;
          let nextBadge = t.badge || 'İcma Müzakirəsi';
          if (nextPinned) {
            if (!nextBadge.includes('Sabitlənmiş')) nextBadge = '📌 Sabitlənmiş Müzakirə';
          } else {
            nextBadge = nextBadge.replace('📌 Sabitlənmiş Müzakirə', 'İcma Müzakirəsi').trim() || 'İcma Müzakirəsi';
          }
          updatedItem = { ...t, pinned: nextPinned, badge: nextBadge };
          return updatedItem;
        }
        return t;
      });
      safeSetLocalStorage('monodoxia_admin_topics', next);
      return next;
    });
    if (updatedItem) {
      apiCall('save_community_post', updatedItem);
    }
    showToast('Mövzu başlığa sabitləndi', 'success');
  };

  // Event Registration
  const registerEvent = (eventId) => {
    setEventsList(prev => prev.map(e => {
      if (e.id === eventId) {
        if (e.registered >= e.capacity) {
          showToast('Təəssüf ki, bütün yerlər doludur.', 'error');
          return e;
        }
        showToast(`Tədbirə qeydiyyatınız təsdiqləndi: ${e.title}`, 'success');
        return { ...e, registered: e.registered + 1 };
      }
      return e;
    }));
  };

  // Club Tier upgrade - routes to application workflow for admin approval
  const joinClubTier = (tier) => {
    openApplication(tier, 'club');
  };

  // ========================================================
  // MƏRKƏZLƏŞDİRİLMİŞ MÜRACİƏT VƏ QEYDİYYAT SİSTEMİ
  // ========================================================

  const openApplication = (targetItem, targetType = 'course') => {
    if (!currentUser) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      showToast('Müraciət etmək üçün zəhmət olmasa daxil olun və ya qeydiyyatdan keçin.', 'warning');
      return;
    }

    let title = targetItem.title || targetItem.name || 'Proqram';
    let rawPrice = (targetItem.price !== undefined && targetItem.price !== null) ? String(targetItem.price).trim() : '';
    let price = 'Pulsuz';
    if (rawPrice && rawPrice !== '0' && !['pulsuz', 'ödənişsiz', 'free'].includes(rawPrice.toLowerCase())) {
      price = (rawPrice.startsWith('₼') || rawPrice.endsWith('AZN') || rawPrice.endsWith('₼')) ? rawPrice : `${rawPrice} AZN`;
    }

    setActiveApplicationTarget({
      item: targetItem,
      type: targetType,
      id: targetItem.id,
      title: title,
      price: price,
      speaker: targetItem.speaker || targetItem.instructor || null,
      duration: targetItem.duration || targetItem.datetime || null
    });
    setApplicationModalOpen(true);
  };

  const submitApplication = (formData) => {
    if (!currentUser) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      return { success: false, error: 'İstifadəçi daxil olmayıb' };
    }

    // Duplicate Check
    const duplicate = applicationsList.find(a =>
      a.userId === currentUser.id &&
      a.targetId === formData.targetId &&
      !['Rədd edildi', 'Ləğv edildi'].includes(a.status) &&
      !a.archived
    );

    if (duplicate) {
      showToast(`Siz artıq "${formData.targetTitle}" üzrə müraciət etmisiniz. Cari status: ${duplicate.status}`, 'warning');
      return { success: false, duplicate: true, existing: duplicate };
    }

    const newApp = {
      id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'İstifadəçi',
      userEmail: currentUser.email,
      userPhone: formData.userPhone || currentUser.phone || '',
      targetType: formData.targetType,
      targetId: formData.targetId,
      targetTitle: formData.targetTitle,
      status: 'Yeni',
      paymentStatus: (formData.price && formData.price !== 'Pulsuz' && formData.price !== '0' && formData.price !== '₼ 0') ? 'Gözlənilir' : 'Tələb olunmur',
      attendanceStatus: 'Gözlənilir',
      price: formData.price || 'Pulsuz',
      formResponses: formData.formResponses || {},
      userNote: formData.userNote || '',
      adminNote: '',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      archived: false
    };

    setApplicationsList(prev => [newApp, ...prev]);

    // Send internal notification
    const newNotif = {
      id: 'notif-' + Date.now(),
      userId: currentUser.id,
      title: 'Müraciətiniz Qəbul Edildi',
      message: `"${formData.targetTitle}" üzrə müraciətiniz qeydə alındı. Administrator tərəfindən baxılır.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setUserNotifications(prev => {
      const next = [newNotif, ...prev];
      safeSetLocalStorage('monodoxia_notifications', next);
      return next;
    });

    setApplicationModalOpen(false);
    showToast(`Müraciətiniz uğurla göndərildi: ${formData.targetTitle}`, 'success');

    // Also try API sync in background if configured
    try {
      apiCall('submit_application', {
        id: newApp.id,
        user_id: newApp.userId,
        user_name: newApp.userName,
        user_email: newApp.userEmail,
        user_phone: newApp.userPhone,
        target_type: newApp.targetType,
        target_id: newApp.targetId,
        target_title: newApp.targetTitle,
        price: newApp.price,
        form_responses: newApp.formResponses,
        user_note: newApp.userNote,
        notification_id: newNotif.id
      }).catch(() => {});
    } catch (e) {}

    return { success: true, application: newApp };
  };

  const submitTopicApplication = (title, content, badge = "İcma Müzakirəsi") => {
    if (!currentUser) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      showToast('Mövzu başlatmaq üçün daxil olun', 'warning');
      return null;
    }

    const topicId = 'topic-' + Date.now();
    const newApp = {
      id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
      userId: currentUser.id,
      userName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'Rezident',
      userEmail: currentUser.email || '',
      userPhone: currentUser.phone || '',
      targetType: 'community',
      targetId: topicId,
      targetTitle: title,
      price: 'Pulsuz',
      status: 'Yeni',
      paymentStatus: 'Tələb olunmur',
      attendanceStatus: 'Tələb olunmur',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: null,
      adminNote: '',
      userNote: content,
      formResponses: {
        fld_topic_title: title,
        fld_topic_content: content,
        fld_badge: badge
      },
      archived: false
    };

    setApplicationsList(prev => [newApp, ...prev]);

    // Send internal notification to the user
    const newNotif = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: currentUser.id,
      title: 'Mövzu Müraciətiniz Qəbul Edildi',
      message: `"${title}" adlı yeni icma mövzusu üzrə müraciətiniz qeydə alındı və moderator baxışına göndərildi. Administrator təsdiqindən sonra saytda dərc ediləcək.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setUserNotifications(prev => {
      const next = [newNotif, ...prev];
      safeSetLocalStorage('monodoxia_notifications', next);
      return next;
    });

    setNewTopicModalOpen(false);
    showToast('Mövzu müraciətiniz administratora göndərildi. Təsdiqdən sonra saytda görünəcək.', 'success');

    // Sync application to backend
    apiCall('submit_application', {
      id: newApp.id,
      user_id: newApp.userId,
      user_name: newApp.userName,
      user_email: newApp.userEmail,
      user_phone: newApp.userPhone,
      target_type: newApp.targetType,
      target_id: newApp.targetId,
      target_title: newApp.targetTitle,
      price: newApp.price,
      form_responses: newApp.formResponses,
      user_note: newApp.userNote,
      notification_id: newNotif.id
    }).catch(() => {});

    return newApp;
  };

  const updateApplicationStatus = (
    appId,
    newStatus,
    adminNote = null,
    paymentStatus = null,
    attendanceStatus = null,
    extraUpdates = {}
  ) => {
    // 1. Locate existing application synchronously
    const currentApp = applicationsList.find(a => a.id === appId);
    if (!currentApp) {
      console.warn('updateApplicationStatus: application not found for ID', appId);
      return;
    }

    let resolvedPayment = paymentStatus;
    if (resolvedPayment === null || resolvedPayment === undefined) {
      if (newStatus === 'Təsdiqləndi' || newStatus === 'Tamamlandı') {
        resolvedPayment = 'Ödənildi';
      } else if (newStatus === 'Rədd edildi' || newStatus === 'Ləğv edildi') {
        resolvedPayment = 'Qaytarıldı';
      } else {
        resolvedPayment = currentApp.paymentStatus || 'Gözlənilir';
      }
    }

    let resolvedAttendance = attendanceStatus;
    if (resolvedAttendance === null || resolvedAttendance === undefined) {
      if (newStatus === 'Təsdiqləndi' || newStatus === 'Tamamlandı') {
        resolvedAttendance = 'İştirak edəcək';
      } else if (newStatus === 'Rədd edildi' || newStatus === 'Ləğv edildi') {
        resolvedAttendance = 'İştirak etməyəcək';
      } else {
        resolvedAttendance = currentApp.attendanceStatus || 'Gözlənilir';
      }
    }

    const resolvedStatus = newStatus || currentApp.status;
    const resolvedAdminNote = adminNote !== null ? adminNote : (currentApp.adminNote || '');

    const updatedApp = {
      ...currentApp,
      ...(extraUpdates || {}),
      status: resolvedStatus,
      adminNote: resolvedAdminNote,
      paymentStatus: resolvedPayment,
      attendanceStatus: resolvedAttendance,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Update state & localStorage immediately
    setApplicationsList(prev => {
      const nextList = prev.map(app => (app.id === appId ? updatedApp : app));
      safeSetLocalStorage('monodoxia_applications', nextList);
      return nextList;
    });

    // In-app notification for the applicant
    const isTopic = updatedApp.targetType === 'community' || updatedApp.targetType === 'forum';
    const notifType = (resolvedStatus === 'Təsdiqləndi' || resolvedStatus === 'Tamamlandı')
      ? 'success'
      : (['Rədd edildi', 'Ləğv edildi'].includes(resolvedStatus) ? 'error' : 'warning');

    let notifTitle = `Müraciət Statusu: ${resolvedStatus}`;
    let notifMsg = '';

    if (isTopic) {
      const topicNotes = resolvedAdminNote ? ` Moderator Qeydi: "${resolvedAdminNote}"` : '';
      if (resolvedStatus === 'Təsdiqləndi') {
        notifTitle = 'Mövzunuz Dərc Edildi';
        const pinText = (updatedApp.isPinned ?? updatedApp.pinned) ? ' Önə çıxarılan mövzu olaraq sabitləndi.' : '';
        const commentText = updatedApp.allowComments === false ? ' Mövzu rəylərə bağlı rejimdədir.' : ' Müzakirə və rəylərə açıqdır.';
        notifMsg = `Təbriklər! "${updatedApp.targetTitle}" adlı icma mövzunuz moderator heyəti tərəfindən təsdiqləndi və forumda dərc edildi.${pinText}${commentText}${topicNotes ? ' (' + topicNotes.trim() + ')' : ''}`;
      } else if (resolvedStatus === 'Rədd edildi') {
        notifTitle = 'Mövzu Qəbul Edilmədi';
        notifMsg = `"${updatedApp.targetTitle}" adlı icma mövzusu üzrə təklifiniz icma standartlarına və ya etik qaydalara uyğun görülmədi.${topicNotes ? ' (' + topicNotes.trim() + ')' : ''}`;
      } else if (resolvedStatus === 'Ləğv edildi') {
        notifTitle = 'Mövzu Sorğusu Ləğv Edildi';
        notifMsg = `"${updatedApp.targetTitle}" adlı icma mövzusu sorğunuz ləğv edildi.${topicNotes ? ' (' + topicNotes.trim() + ')' : ''}`;
      } else if (resolvedStatus === 'Baxılır') {
        notifTitle = 'Mövzunuz Moderator Baxışındadır';
        notifMsg = `"${updatedApp.targetTitle}" adlı icma mövzusu moderator heyəti tərəfindən nəzərdən keçirilir.${topicNotes ? ' (' + topicNotes.trim() + ')' : ''}`;
      } else if (resolvedStatus === 'Gözləmədə') {
        notifTitle = 'Mövzu Gözləmə Rejimindədir';
        notifMsg = `"${updatedApp.targetTitle}" adlı mövzunuz növbəti redaksiya planına uyğun olaraq gözləməyə alındı.${topicNotes ? ' (' + topicNotes.trim() + ')' : ''}`;
      } else {
        notifTitle = `Mövzu Statusu: ${resolvedStatus}`;
        notifMsg = `"${updatedApp.targetTitle}" adlı mövzunuzun vəziyyəti: ${resolvedStatus}.${topicNotes ? ' (' + topicNotes.trim() + ')' : ''}`;
      }
    } else {
      const details = [];
      if (resolvedPayment && resolvedPayment !== 'Tələb olunmur') details.push(`Ödəniş: ${resolvedPayment}`);
      if (resolvedAttendance && resolvedAttendance !== 'Tələb olunmur') details.push(`İştirak: ${resolvedAttendance}`);
      if (resolvedAdminNote) details.push(`Qeyd: ${resolvedAdminNote}`);
      const detailsSuffix = details.length > 0 ? ` (${details.join(' | ')})` : '';
      notifMsg = `"${updatedApp.targetTitle}" müraciətinizin statusu yeniləndi: ${resolvedStatus}.${detailsSuffix}`;
    }

    const newNotif = {
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: updatedApp.userId,
      category: isTopic ? 'community' : 'application',
      title: notifTitle,
      message: notifMsg,
      type: notifType,
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setUserNotifications(prev => {
      const nextNotifs = [newNotif, ...prev];
      safeSetLocalStorage('monodoxia_notifications', nextNotifs);
      return nextNotifs;
    });

    // If approved, update live event/course occupancy / community topics
    if (resolvedStatus === 'Təsdiqləndi') {
      if (updatedApp.targetType === 'event' || updatedApp.targetType === 'webinar') {
        setEventsList(prev => prev.map(e => e.id === updatedApp.targetId ? { ...e, registered: Math.min(e.capacity, (e.registered || 0) + 1) } : e));
      } else if (updatedApp.targetType === 'course') {
        setCoursesList(prev => prev.map(c => c.id === updatedApp.targetId ? { ...c, occupancy: Math.min(100, (c.occupancy || 0) + 2) } : c));
      } else if (updatedApp.targetType === 'club') {
        let approvedTier = 'Basic';
        const title = updatedApp.targetTitle || '';
        if (title.toLowerCase().includes('vip')) {
          approvedTier = 'VIP';
        } else if (title.toLowerCase().includes('premium')) {
          approvedTier = 'Premium';
        } else if (title.toLowerCase().includes('basic')) {
          approvedTier = 'Basic';
        } else if (updatedApp.targetId) {
          approvedTier = updatedApp.targetId.replace('tier-', '').toUpperCase();
        }
        setUserTier(approvedTier);
        localStorage.setItem('monodoxia_tier', approvedTier);

        // If the approved application belongs to current user, update currentUser.tier
        if (currentUser && currentUser.id === updatedApp.userId) {
          updateCurrentUser({ tier: approvedTier });
        }
      } else if (updatedApp.targetType === 'community' || updatedApp.targetType === 'forum') {
        const topicId = updatedApp.targetId || ('topic-' + Date.now());
        const topicTitle = updatedApp.targetTitle || updatedApp.formResponses?.fld_topic_title || 'İcma Müzakirəsi';
        const topicContent = updatedApp.userNote || updatedApp.formResponses?.fld_topic_content || '';
        const topicBadge = updatedApp.formResponses?.fld_badge || 'İcma Müzakirəsi';
        const topicAuthor = updatedApp.userName || 'Rezident';
        const isPinned = Boolean(updatedApp.isPinned ?? updatedApp.pinned ?? false);
        const allowComments = updatedApp.allowComments !== undefined ? Boolean(updatedApp.allowComments) : true;

        const approvedTopic = {
          id: topicId,
          badge: topicBadge,
          badgeClass: 'text-secondary font-semibold',
          time: 'İndicə',
          title: topicTitle,
          snippet: topicContent,
          content: topicContent,
          desc: topicContent,
          author: topicAuthor,
          authorRole: 'Rezident',
          likes: 1,
          repliesCount: 0,
          pinned: isPinned,
          allowComments: allowComments,
          translations: {}
        };

        setCommunityTopics(prev => {
          if (prev.some(t => t.id === topicId)) {
            const next = prev.map(t => t.id === topicId ? { ...t, ...approvedTopic, pinned: isPinned, allowComments: allowComments } : t);
            safeSetLocalStorage('monodoxia_admin_topics', next);
            return next;
          }
          const next = [approvedTopic, ...prev];
          safeSetLocalStorage('monodoxia_admin_topics', next);
          return next;
        });

        apiCall('save_community_post', approvedTopic).catch(() => {});
      }
    } else if (resolvedStatus === 'Rədd edildi' || resolvedStatus === 'Ləğv edildi') {
      if (updatedApp.targetType === 'community' || updatedApp.targetType === 'forum') {
        if (updatedApp.targetId) {
          setCommunityTopics(prev => {
            const next = prev.filter(t => t.id !== updatedApp.targetId);
            safeSetLocalStorage('monodoxia_admin_topics', next);
            return next;
          });
          apiCall('delete_community_post', { id: updatedApp.targetId }).catch(() => {});
        }
      }
    }

    // Broadcast across local tabs & dispatch custom event
    try {
      window.dispatchEvent(new CustomEvent('monodoxia:application_updated', { detail: updatedApp }));
    } catch (e) {}

    showToast(`Müraciət statusu yeniləndi: ${resolvedStatus}`, notifType);

    // Sync with API
    apiCall('update_application_status', {
      id: appId,
      status: resolvedStatus,
      admin_note: resolvedAdminNote,
      payment_status: resolvedPayment,
      attendance_status: resolvedAttendance,
      user_phone: updatedApp.userPhone,
      user_name: updatedApp.userName,
      user_note: updatedApp.userNote,
      form_responses: updatedApp.formResponses,
      is_pinned: updatedApp.isPinned ?? updatedApp.pinned ? 1 : 0,
      allow_comments: updatedApp.allowComments !== false ? 1 : 0,
      notification_id: newNotif.id
    }).catch(err => {
      console.warn('API update_application_status sync failed:', err);
    });
  };

  const cancelApplication = (appId) => {
    updateApplicationStatus(appId, 'Ləğv edildi', 'İstifadəçi tərəfindən ləğv edildi.');
  };

  const deleteApplication = (appId, permanent = false) => {
    if (permanent) {
      setApplicationsList(prev => prev.filter(a => a.id !== appId));
    } else {
      setApplicationsList(prev => prev.map(a => a.id === appId ? { ...a, archived: true } : a));
    }
    showToast('Müraciət silindi / arxivləşdirildi.', 'info');

    apiCall('delete_application', { id: appId, permanent }).catch(() => {});
  };

  // Form Fields Management
  const addFormField = (fieldData) => {
    const newField = {
      id: fieldData.id || ('fld_' + Date.now()),
      targetType: fieldData.targetType || fieldData.target_type || 'all',
      target_type: fieldData.targetType || fieldData.target_type || 'all',
      label: fieldData.label || '',
      fieldType: fieldData.fieldType || fieldData.field_type || 'text',
      field_type: fieldData.fieldType || fieldData.field_type || 'text',
      options: fieldData.options || [],
      placeholder: fieldData.placeholder || '',
      isRequired: Boolean(fieldData.isRequired !== undefined ? fieldData.isRequired : fieldData.is_required),
      is_required: (fieldData.isRequired || fieldData.is_required) ? 1 : 0,
      isActive: fieldData.isActive !== undefined ? Boolean(fieldData.isActive) : true,
      is_active: (fieldData.isActive !== undefined ? fieldData.isActive : true) ? 1 : 0,
      sortOrder: fieldData.sortOrder || fieldData.sort_order || (formFieldsList.length + 1),
      sort_order: fieldData.sortOrder || fieldData.sort_order || (formFieldsList.length + 1),
      translations: fieldData.translations || {}
    };

    setFormFieldsList(prev => {
      const next = [...prev, newField];
      localStorage.setItem('monodoxia_form_fields', JSON.stringify(next));
      return next;
    });
    showToast(`Form sahəsi əlavə edildi: ${newField.label}`, 'success');

    apiCall('save_form_field', newField).catch(() => {});
  };

  const updateFormField = (id, updates) => {
    const current = formFieldsList.find(f => f.id === id) || {};
    const mergedField = {
      ...current,
      ...updates,
      id,
      targetType: updates.targetType || updates.target_type || current.targetType || current.target_type || 'all',
      target_type: updates.targetType || updates.target_type || current.targetType || current.target_type || 'all',
      fieldType: updates.fieldType || updates.field_type || current.fieldType || current.field_type || 'text',
      field_type: updates.fieldType || updates.field_type || current.fieldType || current.field_type || 'text',
      label: updates.label !== undefined ? updates.label : (current.label || ''),
      placeholder: updates.placeholder !== undefined ? updates.placeholder : (current.placeholder || ''),
      options: updates.options !== undefined ? updates.options : (current.options || []),
      isRequired: updates.isRequired !== undefined ? Boolean(updates.isRequired) : Boolean(current.isRequired),
      is_required: updates.isRequired !== undefined ? (updates.isRequired ? 1 : 0) : (current.is_required ? 1 : 0),
      isActive: updates.isActive !== undefined ? Boolean(updates.isActive) : (current.isActive !== undefined ? Boolean(current.isActive) : true),
      is_active: updates.isActive !== undefined ? (updates.isActive ? 1 : 0) : (current.is_active !== undefined ? (current.is_active ? 1 : 0) : 1),
      sortOrder: updates.sortOrder || updates.sort_order || current.sortOrder || current.sort_order || 0,
      sort_order: updates.sortOrder || updates.sort_order || current.sortOrder || current.sort_order || 0,
      translations: updates.translations || current.translations || {}
    };

    setFormFieldsList(prev => {
      const next = prev.map(f => f.id === id ? mergedField : f);
      localStorage.setItem('monodoxia_form_fields', JSON.stringify(next));
      return next;
    });

    showToast('Form sahəsi yeniləndi', 'success');
    apiCall('save_form_field', mergedField).catch(() => {});
  };

  const deleteFormField = (id) => {
    setFormFieldsList(prev => {
      const next = prev.filter(f => f.id !== id);
      localStorage.setItem('monodoxia_form_fields', JSON.stringify(next));
      return next;
    });
    showToast('Form sahəsi silindi', 'info');

    apiCall('delete_form_field', { id }).catch(() => {});
  };

  // Notifications
  const markNotificationRead = (notifId) => {
    setUserNotifications(prev => {
      const updated = notifId === 'all'
        ? prev.map(n => currentUser ? (String(n.userId) === String(currentUser.id) ? { ...n, isRead: true } : n) : { ...n, isRead: true })
        : prev.map(n => String(n.id) === String(notifId) ? { ...n, isRead: true } : n);
      safeSetLocalStorage('monodoxia_notifications', updated);
      return updated;
    });
    apiCall('mark_notification_read', { id: notifId, user_id: currentUser?.id }).catch(() => {});
  };

  const clearNotifications = (arg = 'all') => {
    // If called directly from an event handler like onClick={clearNotifications}, arg is the React SyntheticEvent
    const isSingle = typeof arg === 'string' && arg !== 'all' && arg.trim() !== '';
    const notifId = isSingle ? arg : 'all';
    const userId = currentUser?.id;

    if (notifId === 'all') {
      setUserNotifications(prev => {
        const remaining = userId
          ? prev.filter(n => {
              const nUid = String(n.userId || '').replace(/^#/, '');
              const cUid = String(userId || '').replace(/^#/, '');
              const nAlt = nUid.startsWith('u') ? nUid.slice(1) : ('u' + nUid);
              return nUid !== cUid && nAlt !== cUid && String(n.userId) !== String(userId);
            })
          : [];
        safeSetLocalStorage('monodoxia_notifications', remaining);
        return remaining;
      });
      if (userId) {
        apiCall('clear_notifications', { user_id: userId }).catch(() => {});
      } else {
        apiCall('clear_notifications', {}).catch(() => {});
      }
      showToast('Bildirişlər təmizləndi', 'info');
    } else {
      setUserNotifications(prev => {
        const remaining = prev.filter(n => String(n.id) !== String(notifId));
        safeSetLocalStorage('monodoxia_notifications', remaining);
        return remaining;
      });
      apiCall('delete_notification', { id: notifId, user_id: userId }).catch(() => {});
      showToast('Bildiriş silindi', 'info');
    }
  };

  const deleteNotification = (notifId) => {
    if (typeof notifId === 'string' && notifId) {
      clearNotifications(notifId);
    }
  };

  const updateCurrentUser = (updates) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      return updated;
    });
    // Sync usersList in a separate synchronous setState call (safe — React batches these)
    setUsersList(uList => {
      // We need current user id — read it from the functional closure via currentUser ref
      // currentUser is captured in closure; fine since we only need its .id
      if (!currentUser) return uList;
      const updatedName = `${updates.firstName || currentUser.firstName || ''} ${updates.lastName || currentUser.lastName || ''}`.trim();
      return uList.map(u => u.id === currentUser.id
        ? { ...u, name: updatedName || u.name, email: updates.email || u.email }
        : u
      );
    });
    showToast('Profil məlumatları yeniləndi', 'success');
  };

  // Admin Operations (CRUD)
  const updateUser = (id, updates) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => {
        const next = { ...prev, ...updates };
        localStorage.setItem('monodoxia_user', JSON.stringify(next));
        return next;
      });
    }
    showToast('İstifadəçi məlumatı yeniləndi', 'success');
    const target = usersList.find(u => u.id === id);
    const merged = { ...(target || {}), ...updates, id };
    apiCall('save_user', merged).catch(() => {});
  };

  const addUser = (newUser) => {
    const user = {
      id: 'usr_' + Date.now(),
      ...newUser,
      translations: newUser.translations || {},
      status: newUser.status || 'Aktiv',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsersList(prev => [user, ...prev]);
    showToast(`İstifadəçi əlavə edildi: ${user.name}`, 'success');

    apiCall('save_user', user).catch(() => {});
  };

  const deleteUser = (id) => {
    // Prevent deleting the currently logged-in user or the last active Admin
    if (currentUser?.id === id) {
      showToast('Cari daxil olmuş admin hesabı silinə bilməz!', 'warning');
      return;
    }
    const target = usersList.find(u => u.id === id);
    if (target?.role === 'Admin') {
      const remainingAdmins = usersList.filter(u => u.role === 'Admin' && u.id !== id);
      if (remainingAdmins.length === 0) {
        showToast('Sistemdəki yeganə Admin hesabı silinə bilməz!', 'warning');
        return;
      }
    }

    setUsersList(prev => prev.filter(u => u.id !== id));
    showToast('İstifadəçi silindi', 'info');

    apiCall('delete_user', { id }).catch(() => {});
  };

  // ========================================================
  // RBAC (ROLE-BASED ACCESS CONTROL) SİSTEMİ
  // ========================================================

  const getUserEffectivePermissions = (user = currentUser) => {
    if (!user) return [];
    if (user.role === 'Admin') return ['*'];

    const userRoles = Array.isArray(user.roles) && user.roles.length > 0
      ? user.roles
      : [user.role || 'Tələbə'];

    if (userRoles.includes('Admin')) return ['*'];

    const permsSet = new Set();
    userRoles.forEach(rCodeOrId => {
      const found = rolesList.find(r => r.code === rCodeOrId || r.id === rCodeOrId);
      if (found && found.isActive !== false) {
        if (found.permissions?.includes('*')) {
          permsSet.add('*');
        } else if (Array.isArray(found.permissions)) {
          found.permissions.forEach(p => permsSet.add(p));
        }
      }
    });

    return Array.from(permsSet);
  };

  const hasPermission = (permissionKey, user = currentUser) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    const perms = getUserEffectivePermissions(user);
    if (perms.includes('*')) return true;
    if (perms.includes(permissionKey)) return true;
    const [mod] = (permissionKey || '').split('.');
    if (perms.includes(`${mod}.*`)) return true;
    return false;
  };

  const canAccessAdmin = (user = currentUser) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    const perms = getUserEffectivePermissions(user);
    if (perms.includes('*')) return true;
    const adminViewPerms = [
      'dashboard.view', 'applications.view', 'registrations.view',
      'users.view', 'roles.view', 'courses.view', 'categories.view',
      'club.view', 'events.view', 'community.view', 'translations.view',
      'maintenance.view', 'content.view', 'database.view', 'settings.view'
    ];
    return adminViewPerms.some(vp => perms.includes(vp));
  };

  const addRole = (newRole) => {
    const role = {
      id: 'role-' + Date.now(),
      name: (newRole.name || '').trim(),
      code: (newRole.code || newRole.name || '').trim(),
      description: newRole.description || '',
      isSystem: false,
      isActive: newRole.isActive !== undefined ? Boolean(newRole.isActive) : true,
      color: newRole.color || '#b45309',
      badgeClass: newRole.badgeClass || 'bg-amber-100 text-amber-800 border-amber-300',
      permissions: Array.isArray(newRole.permissions) ? newRole.permissions : [],
      translations: newRole.translations || {},
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setRolesList(prev => [...prev, role]);
    showToast(`Yeni rol yaradıldı: ${role.name}`, 'success');

    try {
      fetch('/api.php?action=save_role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(role)
      }).catch(() => {});
    } catch (e) {}

    return role;
  };

  const updateRole = (id, updates) => {
    const existing = rolesList.find(r => r.id === id);
    if (!existing) return;

    let safeUpdates = { ...updates, updatedAt: new Date().toISOString().split('T')[0] };
    // Critical safety: Super Admin role can never lose full privileges
    if (existing.isSystem && existing.code === 'Admin') {
      safeUpdates.isSystem = true;
      safeUpdates.isActive = true;
      safeUpdates.permissions = ['*'];
      safeUpdates.code = 'Admin';
    }

    setRolesList(prev => prev.map(r => r.id === id ? { ...r, ...safeUpdates } : r));

    // Cascade role code update to users if code changed
    if (safeUpdates.code && safeUpdates.code !== existing.code && existing.code !== 'Admin') {
      const oldCode = existing.code;
      const newCode = safeUpdates.code;

      setUsersList(prev => prev.map(u => {
        let changed = false;
        let nextRole = u.role;
        let nextRoles = u.roles;
        if (u.role === oldCode) {
          nextRole = newCode;
          changed = true;
        }
        if (Array.isArray(u.roles) && u.roles.includes(oldCode)) {
          nextRoles = u.roles.map(r => r === oldCode ? newCode : r);
          changed = true;
        }
        return changed ? { ...u, role: nextRole, roles: nextRoles } : u;
      }));

      if (currentUser) {
        let cuChanged = false;
        let cuRole = currentUser.role;
        let cuRoles = currentUser.roles;
        if (currentUser.role === oldCode) {
          cuRole = newCode;
          cuChanged = true;
        }
        if (Array.isArray(currentUser.roles) && currentUser.roles.includes(oldCode)) {
          cuRoles = currentUser.roles.map(r => r === oldCode ? newCode : r);
          cuChanged = true;
        }
        if (cuChanged) {
          setCurrentUser(prev => prev ? { ...prev, role: cuRole, roles: cuRoles } : prev);
        }
      }
    }

    showToast(`"${existing.name}" rolu yeniləndi`, 'success');

    try {
      fetch('/api.php?action=save_role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...existing, ...safeUpdates, oldCode: existing.code })
      }).catch(() => {});
    } catch (e) {}
  };

  const deleteRole = (id) => {
    const target = rolesList.find(r => r.id === id);
    if (!target) return false;

    if (target.isSystem || ['Admin', 'Tələbə', 'Kouç', 'Moderator'].includes(target.code)) {
      showToast('Kritik sistem rolları silinə bilməz!', 'warning');
      return false;
    }

    const assignedCount = usersList.filter(u => u.role === target.code || (Array.isArray(u.roles) && u.roles.includes(target.code))).length;
    if (assignedCount > 0) {
      showToast(`Bu rol hazırda ${assignedCount} istifadəçiyə təyin olunub. Silmədən öncə istifadəçilərin rolunu dəyişin.`, 'warning');
      return false;
    }

    setRolesList(prev => prev.filter(r => r.id !== id));
    showToast(`"${target.name}" rolu silindi`, 'info');

    try {
      fetch('/api.php?action=delete_role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, code: target.code })
      }).catch(() => {});
    } catch (e) {}

    return true;
  };

  const toggleRoleActive = (id) => {
    const target = rolesList.find(r => r.id === id);
    if (!target) return;
    if (target.isSystem && target.code === 'Admin') {
      showToast('Super Admin rolu deaktiv edilə bilməz!', 'warning');
      return;
    }
    const newStatus = !target.isActive;
    updateRole(id, { isActive: newStatus });
  };

  const duplicateRole = (id) => {
    const source = rolesList.find(r => r.id === id);
    if (!source) return;
    const cloned = {
      name: `${source.name} (Kopya)`,
      code: `${source.code}_kopya_${Date.now().toString().slice(-4)}`,
      description: source.description ? `${source.description} (Klonlanmış)` : '',
      color: source.color || '#b45309',
      badgeClass: source.badgeClass,
      permissions: source.permissions ? [...source.permissions] : [],
      isActive: true
    };
    addRole(cloned);
  };

  const updateCourse = (id, updates) => {
    let mergedCourse = null;
    setCoursesList(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, ...updates };

      const azTrans = { ...(updated.translations?.az || {}) };
      if (updates.title !== undefined) azTrans.title = updates.title;
      if (updates.description !== undefined) azTrans.description = updates.description;
      if (updates.badge !== undefined) azTrans.badge = updates.badge;
      if (updates.status !== undefined) azTrans.status = updates.status;
      if (updates.duration !== undefined) azTrans.duration = updates.duration;

      if (updates.translations?.az) {
        if (updates.translations.az.title !== undefined) updated.title = updates.translations.az.title;
        if (updates.translations.az.description !== undefined) updated.description = updates.translations.az.description;
        if (updates.translations.az.badge !== undefined) updated.badge = updates.translations.az.badge;
        if (updates.translations.az.status !== undefined) updated.status = updates.translations.az.status;
        if (updates.translations.az.duration !== undefined) updated.duration = updates.translations.az.duration;
      }

      updated.translations = {
        ...(updated.translations || {}),
        az: azTrans
      };

      mergedCourse = updated;
      return updated;
    }));
    if (mergedCourse) {
      apiCall('save_course', mergedCourse);
    }
    showToast('Kurs parametrləri yeniləndi', 'success');
  };

  const addCourse = (newCourse) => {
    const courseId = newCourse.id || ('course-' + Date.now());
    const course = {
      id: courseId,
      category: newCourse.category || 'psychology',
      badge: newCourse.badge || 'YENİ KURS',
      badgeClass: newCourse.badgeClass || 'bg-secondary/10 text-secondary',
      duration: newCourse.duration || '8 Həftə',
      deadline: newCourse.deadline || null,
      maxParticipants: Number(newCourse.maxParticipants) || 30,
      initialParticipants: Number(newCourse.initialParticipants) || 0,
      title: newCourse.title,
      description: newCourse.description || '',
      instructor: newCourse.instructor || '',
      instructorRole: newCourse.instructorRole || 'Sertifikatlı Kouç',
      status: newCourse.status || 'Qrup qəbulu aktivdir',
      occupancy: Number(newCourse.occupancy) || 0,
      price: newCourse.price || '0',
      featured: Boolean(newCourse.featured),
      isOnline: newCourse.isOnline !== undefined ? Boolean(newCourse.isOnline) : true,
      translations: newCourse.translations || {
        az: {
          title: newCourse.title,
          description: newCourse.description,
          badge: newCourse.badge || 'YENİ KURS',
          status: newCourse.status || 'Qrup qəbulu aktivdir',
          duration: newCourse.duration || '8 Həftə'
        }
      },
      modules: newCourse.modules || [
        {
          id: 'm1',
          title: 'Modul 1: Giriş və Əsaslar',
          lessons: [
            { id: 'l1', title: '1.1 Orientasiya və Məqsədlər', duration: '20 dəq', type: 'video' }
          ]
        }
      ],
      tags: newCourse.tags || []
    };
    setCoursesList(prev => [...prev.filter(c => c.id !== courseId), course]);
    apiCall('save_course', course);
    showToast(`Yeni kurs əlavə edildi: ${course.title}`, 'success');
  };

  const deleteCourse = (id) => {
    setCoursesList(prev => prev.filter(c => c.id !== id));
    apiCall('delete_course', { id });
    showToast('Kurs silindi', 'info');
  };

  const updateClubTier = (id, updates) => {
    let updatedTier = null;
    setClubTiersList(prev => {
      const next = prev.map(t => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (typeof updated.features === 'string') {
            updated.features = updated.features.split('\n').map(s => s.trim()).filter(Boolean);
          }

          const azTrans = { ...(updated.translations?.az || {}) };
          if (updates.name !== undefined) azTrans.name = updates.name;
          if (updates.period !== undefined) azTrans.period = updates.period;
          if (updates.features !== undefined) azTrans.features = updated.features;

          if (updates.translations?.az) {
            if (updates.translations.az.name !== undefined) updated.name = updates.translations.az.name;
            if (updates.translations.az.period !== undefined) updated.period = updates.translations.az.period;
            if (updates.translations.az.features !== undefined) updated.features = updates.translations.az.features;
          }

          updated.translations = {
            ...(updated.translations || {}),
            az: azTrans
          };

          updatedTier = updated;
          return updated;
        }
        return t;
      });
      localStorage.setItem('monodoxia_admin_tiers', JSON.stringify(next));
      return next;
    });

    if (updatedTier) {
      apiCall('save_club_tier', updatedTier).catch(() => {});
    }
    showToast('Abunəlik tarifi yeniləndi', 'success');
  };

  const addClubTier = (newTier) => {
    const tier = {
      id: 'tier-' + Date.now(),
      name: newTier.name,
      price: newTier.price,
      period: newTier.period || '/ aylıq',
      popular: Boolean(newTier.popular),
      translations: {
        ...(newTier.translations || {}),
        az: {
          ...(newTier.translations?.az || {}),
          name: newTier.name,
          period: newTier.period || '/ aylıq',
          features: Array.isArray(newTier.features)
            ? newTier.features
            : (newTier.features || '').split('\n').map(s => s.trim()).filter(Boolean)
        }
      },
      features: Array.isArray(newTier.features)
        ? newTier.features
        : (newTier.features || '').split('\n').map(s => s.trim()).filter(Boolean),
      active: true
    };
    setClubTiersList(prev => {
      const next = [...prev, tier];
      localStorage.setItem('monodoxia_admin_tiers', JSON.stringify(next));
      return next;
    });
    showToast(`Yeni abunəlik paketi əlavə edildi: ${tier.name}`, 'success');

    apiCall('save_club_tier', tier).catch(() => {});
  };

  const deleteClubTier = (id) => {
    setClubTiersList(prev => {
      const next = prev.filter(t => t.id !== id);
      localStorage.setItem('monodoxia_admin_tiers', JSON.stringify(next));
      return next;
    });
    showToast('Abunəlik paketi silindi', 'info');

    apiCall('delete_club_tier', { id }).catch(() => {});
  };

  const addEvent = (newEvent) => {
    const ev = {
      id: 'event-' + Date.now(),
      typeBadge: newEvent.typeBadge || 'VEBİNAR',
      badgeClass: 'bg-secondary/10 text-secondary',
      datetime: newEvent.datetime,
      title: newEvent.title,
      desc: newEvent.desc,
      speaker: newEvent.speaker,
      capacity: Number(newEvent.capacity) || 100,
      registered: 0,
      image: newEvent.image || '',
      price: newEvent.price || (newEvent.isFree ? 'Pulsuz' : '0 ₼'),
      status: newEvent.status || 'Aktiv',
      translations: {
        ...(newEvent.translations || {}),
        az: {
          ...(newEvent.translations?.az || {}),
          title: newEvent.title,
          desc: newEvent.desc,
          typeBadge: newEvent.typeBadge || 'VEBİNAR'
        }
      },
      isOnline: newEvent.isOnline ?? true
    };
    setEventsList(prev => {
      const next = [ev, ...prev];
      safeSetLocalStorage('monodoxia_admin_events', next);
      return next;
    });
    apiCall('save_event', ev).catch(err => {
      console.error('save_event API call failed:', err);
    });
    showToast(`Tədbir yaradıldı: ${ev.title}`, 'success');
  };

  const updateEvent = (id, updates) => {
    let mergedEvent = null;
    setEventsList(prev => {
      const next = prev.map(e => {
        if (e.id !== id) return e;
        const updated = { ...e, ...updates };

        const azTrans = { ...(updated.translations?.az || {}) };
        if (updates.title !== undefined) azTrans.title = updates.title;
        if (updates.desc !== undefined) azTrans.desc = updates.desc;
        if (updates.typeBadge !== undefined) azTrans.typeBadge = updates.typeBadge;
        if (updates.datetime !== undefined) azTrans.datetime = updates.datetime;

        if (updates.translations?.az) {
          if (updates.translations.az.title !== undefined) updated.title = updates.translations.az.title;
          if (updates.translations.az.desc !== undefined) updated.desc = updates.translations.az.desc;
          if (updates.translations.az.typeBadge !== undefined) updated.typeBadge = updates.translations.az.typeBadge;
          if (updates.translations.az.datetime !== undefined) updated.datetime = updates.translations.az.datetime;
        }

        updated.translations = {
          ...(updated.translations || {}),
          az: azTrans
        };

        mergedEvent = updated;
        return updated;
      });
      safeSetLocalStorage('monodoxia_admin_events', next);
      return next;
    });
    if (mergedEvent) {
      apiCall('save_event', mergedEvent).catch(err => {
        console.error('save_event API update failed:', err);
      });
    }
    showToast('Tədbir məlumatları yeniləndi', 'success');
  };

  const deleteEvent = (id) => {
    setEventsList(prev => {
      const next = prev.filter(e => e.id !== id);
      safeSetLocalStorage('monodoxia_admin_events', next);
      return next;
    });
    apiCall('delete_event', { id }).catch(err => {
      console.error('delete_event API call failed:', err);
    });
    showToast('Tədbir silindi', 'info');
  };

  // Centralized Category Operations & Localizer
  const getCategoryLabel = (keyOrId, lang = 'az') => {
    if (!keyOrId) return '';
    const cat = categoriesList.find(c => c.key === keyOrId || c.id === keyOrId);
    if (!cat) return keyOrId;
    if (cat.translations && cat.translations[lang] && cat.translations[lang].name) {
      return cat.translations[lang].name;
    }
    return cat.name || cat.key || keyOrId;
  };

  const addCategory = (categoryData) => {
    const rawKey = categoryData.key || categoryData.name || 'category';
    const key = rawKey.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
    const newCat = {
      id: 'cat-' + Date.now(),
      key,
      slug: key,
      type: categoryData.type || 'course',
      target_type: categoryData.type || 'course',
      icon: categoryData.icon || 'category',
      name: categoryData.name || 'Yeni Kateqoriya',
      translations: {
        az: { name: categoryData.translations?.az?.name || categoryData.name || 'Yeni Kateqoriya', desc: categoryData.translations?.az?.desc || '' },
        en: { name: categoryData.translations?.en?.name || '', desc: categoryData.translations?.en?.desc || '' },
        tr: { name: categoryData.translations?.tr?.name || '', desc: categoryData.translations?.tr?.desc || '' },
        ru: { name: categoryData.translations?.ru?.name || '', desc: categoryData.translations?.ru?.desc || '' }
      }
    };
    setCategoriesList(prev => [...prev, newCat]);
    apiCall('save_category', newCat);
    showToast(`Kateqoriya əlavə edildi: ${newCat.name}`, 'success');
    return newCat;
  };

  const updateCategory = (id, updates) => {
    let mergedCat = null;
    setCategoriesList(prev => prev.map(c => {
      if (c.id === id) {
        mergedCat = { ...c, ...updates };
        return mergedCat;
      }
      return c;
    }));
    if (mergedCat) {
      apiCall('save_category', mergedCat);
    }
    showToast('Kateqoriya yeniləndi', 'success');
  };

  const deleteCategory = (id) => {
    setCategoriesList(prev => prev.filter(c => c.id !== id));
    apiCall('delete_category', { id });
    showToast('Kateqoriya silindi', 'info');
  };

  const updateTopic = (id, updates) => {
    let updatedItem = null;
    setCommunityTopics(prev => {
      const next = prev.map(t => {
        if (t.id === id) {
          updatedItem = {
            ...t,
            ...updates,
            snippet: updates.snippet ?? t.snippet ?? updates.content,
            content: updates.content ?? updates.snippet ?? t.content,
            desc: updates.snippet ?? updates.content ?? t.desc
          };
          return updatedItem;
        }
        return t;
      });
      safeSetLocalStorage('monodoxia_admin_topics', next);
      return next;
    });
    if (updatedItem) {
      apiCall('save_community_post', updatedItem);
    }
    showToast('İcma mövzusu yeniləndi', 'success');
  };

  const updatePlatformSettings = (newSettings) => {
    let merged = null;
    setPlatformSettings(prev => {
      merged = { ...prev, ...newSettings };
      if (newSettings.contactEmail !== undefined) {
        merged.contact_email = newSettings.contactEmail;
      }
      if (newSettings.contactPhone !== undefined) {
        merged.contact_phone = newSettings.contactPhone;
      }
      if (newSettings.contact_email !== undefined && !newSettings.contactEmail) {
        merged.contactEmail = newSettings.contact_email;
      }
      if (newSettings.contact_phone !== undefined && !newSettings.contactPhone) {
        merged.contactPhone = newSettings.contact_phone;
      }
      if (newSettings.maintenanceMode !== undefined) {
        merged.maintenance_mode = newSettings.maintenanceMode ? '1' : '0';
      }
      if (newSettings.maintenance_mode !== undefined) {
        merged.maintenanceMode = Boolean(newSettings.maintenance_mode === '1' || newSettings.maintenance_mode === 1 || newSettings.maintenance_mode === true);
      }
      if (newSettings.pageSlugs !== undefined) {
        merged.page_slugs = newSettings.pageSlugs;
      }
      if (newSettings.page_slugs !== undefined) {
        merged.pageSlugs = newSettings.page_slugs;
      }
      try {
        localStorage.setItem('monodoxia_admin_settings', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });

    if (merged) {
      apiCall('save_settings', merged).catch(() => {});
    }
    showToast('Platforma parametrləri yeniləndi', 'success');
  };

  const updateSqlConfig = (newConfig) => {
    setSqlConfig(prev => ({ ...prev, ...newConfig }));
    showToast('SQL Verilənlər Bazası konfiqurasiyası yadda saxlanıldı', 'success');
  };

  const testSqlConnection = async () => {
    showToast('Hostinger SQL serverinə qoşulma yoxlanılır...', 'info');
    const startTime = performance.now();
    try {
      const res = await fetch('/api.php?action=status');
      const latency = Math.round(performance.now() - startTime);
      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 'success') {
        const statusMsg = `Qoşuldu (${data.database || sqlConfig.database} • ${data.latency_ms || latency}ms)`;
        setSqlConfig(prev => ({
          ...prev,
          status: statusMsg,
          lastTested: new Date().toLocaleTimeString('az-AZ')
        }));
        showToast(`Hosting SQL bazası ilə əlaqə uğurla təsdiqləndi! (${data.tables_count || 0} cədvəl aşkarlandı)`, 'success');
        return { success: true, data };
      } else if (data?.status === 'config_required') {
        setSqlConfig(prev => ({
          ...prev,
          status: 'Konfiqurasiya Tələb Olunur (Şifrə daxil edilməyib)',
          lastTested: new Date().toLocaleTimeString('az-AZ')
        }));
        showToast(data.message || 'Hostinger SQL şifrəsini api.php və ya db_config.php faylında qeyd edin.', 'warning');
        return { success: false, data };
      } else {
        const errorMsg = data?.message || `HTTP ${res.status}: Qoşulmaq mümkün olmadı`;
        setSqlConfig(prev => ({
          ...prev,
          status: `Xəta: ${errorMsg.substring(0, 36)}...`,
          lastTested: new Date().toLocaleTimeString('az-AZ')
        }));
        showToast(`SQL Əlaqə Xətası: ${errorMsg}`, 'error');
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const fallbackMsg = isLocalhost
        ? 'Lokal Rejim (Vite dev serverdə PHP mühərriki yoxdur. Hostinger serverinə yükləndikdə aktiv olacaq).'
        : `Serverlə əlaqə qurulmadı: ${err.message}`;

      setSqlConfig(prev => ({
        ...prev,
        status: isLocalhost ? 'Lokal Rejim (Offline mock)' : 'Əlaqə yoxdur',
        lastTested: new Date().toLocaleTimeString('az-AZ')
      }));
      showToast(fallbackMsg, isLocalhost ? 'info' : 'error');
      return { success: false, error: err.message, isLocal: isLocalhost };
    }
  };

  const migrateDatabaseTables = async () => {
    showToast('Hostinger SQL cədvəlləri yoxlanılır və miqrasiya edilir...', 'info');
    try {
      const res = await fetch('/api.php?action=migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === 'success') {
        showToast(data.message || 'Bütün SQL cədvəlləri uğurla miqrasiya edildi!', 'success');
        return { success: true, tables: data.migrated_tables };
      } else {
        const msg = data?.message || `Miqrasiya xətası (HTTP ${res.status})`;
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    } catch (err) {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocalhost) {
        showToast('Lokal Vite rejimindəsiniz. Hostinger-də "hostinger_monodoxia_schema.sql" faylını phpMyAdmin-dən idxal edə və ya canlı serverdə bu düyməni sıxa bilərsiniz.', 'info');
      } else {
        showToast(`Miqrasiya sorğusu göndərilmədi: ${err.message}`, 'error');
      }
      return { success: false, error: err.message };
    }
  };

  // Home Content CMS Block Editor
  const updateHomeBlock = (blockKey, blockData) => {
    const currentBlock = homeContent?.[blockKey] || {};
    const mergedBlock = {
      ...currentBlock,
      ...blockData,
      translations: {
        ...(currentBlock.translations || {}),
        ...(blockData?.translations || {})
      }
    };

    setHomeContent(prev => {
      const prevBlock = prev?.[blockKey] || {};
      const updated = {
        ...prevBlock,
        ...blockData,
        translations: {
          ...(prevBlock.translations || {}),
          ...(blockData?.translations || {})
        }
      };
      const nextContent = {
        ...prev,
        [blockKey]: updated
      };
      try {
        localStorage.setItem('monodoxia_home_content', JSON.stringify(nextContent));
      } catch (e) {}
      return nextContent;
    });

    apiCall('save_cms_block', { block_key: blockKey, content: mergedBlock });
    showToast(`"${blockKey.toUpperCase()}" bloku uğurla yeniləndi!`, 'success');
  };

  const resetHomeBlock = (blockKey) => {
    if (INITIAL_HOME_CONTENT[blockKey]) {
      setHomeContent(prev => ({
        ...prev,
        [blockKey]: INITIAL_HOME_CONTENT[blockKey]
      }));
      apiCall('save_cms_block', { block_key: blockKey, content: INITIAL_HOME_CONTENT[blockKey] });
      showToast(`"${blockKey.toUpperCase()}" bloku ilkin vəziyyətinə qaytarıldı`, 'info');
    }
  };

  // Pillars Operations
  const addPillar = (pillar) => {
    const newPillar = {
      id: 'pillar-' + Date.now(),
      icon: pillar.icon || 'psychology',
      title: pillar.title,
      desc: pillar.desc,
      translations: pillar.translations || {
        az: { title: pillar.title, desc: pillar.desc }
      }
    };
    setPillarsList(prev => [...prev, newPillar]);
    showToast(`Yeni dəyər kartı əlavə edildi: ${newPillar.title}`, 'success');
  };

  const updatePillar = (id, updates) => {
    setPillarsList(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Məram kartı yeniləndi', 'success');
  };

  const deletePillar = (id) => {
    setPillarsList(prev => prev.filter(p => p.id !== id));
    showToast('Sütun silindi', 'info');
  };

  const updateAllPillars = (newList) => {
    setPillarsList(newList);
  };

  // Areas Operations
  const addArea = (area) => {
    const newArea = {
      id: 'area-' + Date.now(),
      number: area.number || `0${areasList.length + 1} / SAHƏ`,
      title: area.title,
      icon: area.icon || 'explore',
      desc: area.desc
    };
    setAreasList(prev => [...prev, newArea]);
    showToast(`Yeni inkişaf sahəsi əlavə edildi: ${newArea.title}`, 'success');
  };

  const updateArea = (id, updates) => {
    setAreasList(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast('İnkişaf sahəsi yeniləndi', 'success');
  };

  const deleteArea = (id) => {
    setAreasList(prev => prev.filter(a => a.id !== id));
    showToast('İnkişaf sahəsi silindi', 'info');
  };

  const updateAllAreas = (newList) => {
    setAreasList(newList);
  };

  // Coaches Operations
  const addCoach = (coach) => {
    const newCoach = {
      id: coach.id || ('coach-' + Date.now()),
      userId: coach.userId || null,
      name: coach.name,
      title: coach.title || 'Sertifikatlı Kouç & Ekspert',
      experience: coach.experience || '5+ il təcrübə',
      bio: coach.bio || coach.experience || '',
      image: coach.image || '',
      specialties: Array.isArray(coach.specialties) ? coach.specialties : (coach.specialties ? coach.specialties.split(',').map(s => s.trim()).filter(Boolean) : ['Fərdi İnkişaf']),
      availableSlots: coach.availableSlots || ['Sabah 15:00', 'Cümə 18:00']
    };
    setCoachesList(prev => [...prev, newCoach]);
    if (coach.userId) {
      setUsersList(prev => prev.map(u => u.id === coach.userId ? { ...u, role: 'Kouç' } : u));
    }
    apiCall('save_coach', newCoach);
    showToast(`Ekspert heyətinə təyin edildi: ${newCoach.name}`, 'success');
  };

  const updateCoach = (id, updates) => {
    let mergedCoach = null;
    setCoachesList(prev => prev.map(c => {
      if (c.id === id) {
        const spec = typeof updates.specialties === 'string'
          ? updates.specialties.split(',').map(s => s.trim()).filter(Boolean)
          : updates.specialties;
        mergedCoach = { ...c, ...updates, ...(spec ? { specialties: spec } : {}) };
        return mergedCoach;
      }
      return c;
    }));
    if (mergedCoach) {
      apiCall('save_coach', mergedCoach);
    }
    showToast('Kouç profili yeniləndi', 'success');
  };

  const deleteCoach = (id) => {
    setCoachesList(prev => prev.filter(c => c.id !== id));
    apiCall('delete_coach', { id });
    showToast('Kouç silindi', 'info');
  };

  const syncAllLocalDataToDatabase = async () => {
    showToast('Bütün lokal məlumatlar MySQL bazasına sinxronlaşdırılır...', 'info');
    const payload = {
      courses: coursesList,
      events: eventsList,
      community: communityTopics,
      coaches: coachesList,
      club_tiers: clubTiersList,
      categories: categoriesList,
      cms_blocks: homeContent
    };
    const res = await apiCall('sync_all_local_data', payload);
    if (res?.status === 'success') {
      showToast('Bütün məlumatlar Hostinger SQL bazasına uğurla yazıldı!', 'success');
      return { success: true, synced: res.synced };
    } else {
      const msg = res?.message || 'Sinxronizasiya xətası baş verdi.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  // Testimonials Operations
  const addTestimonial = (testimonial) => {
    const newT = {
      id: 't-' + Date.now(),
      quote: testimonial.quote,
      author: testimonial.author,
      role: testimonial.role || 'Məzun',
      translations: testimonial.translations || {
        az: { quote: testimonial.quote, author: testimonial.author, role: testimonial.role || 'Məzun' }
      }
    };
    setTestimonialsList(prev => [...prev, newT]);
    showToast(`Yeni rəy əlavə edildi: ${newT.author}`, 'success');
  };

  const updateTestimonial = (id, updates) => {
    setTestimonialsList(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('Rəy yeniləndi', 'success');
  };

  const deleteTestimonial = (id) => {
    setTestimonialsList(prev => prev.filter(t => t.id !== id));
    showToast('Rəy silindi', 'info');
  };

  // FAQ Operations
  const addFaq = (faq) => {
    const newFaq = {
      id: 'faq-' + Date.now(),
      question: faq.question,
      answer: faq.answer,
      translations: faq.translations || {
        az: { question: faq.question, answer: faq.answer },
        en: { question: '', answer: '' },
        tr: { question: '', answer: '' },
        ru: { question: '', answer: '' }
      }
    };
    setFaqsList(prev => [...prev, newFaq]);
    showToast('Yeni sual əlavə edildi', 'success');
  };

  const updateFaq = (id, updates) => {
    setFaqsList(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    showToast('Sual məlumatı yeniləndi', 'success');
  };

  const deleteFaq = (id) => {
    setFaqsList(prev => prev.filter(f => f.id !== id));
    showToast('Sual silindi', 'info');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      progress,
      certificates,
      bookings,
      userTier,
      safetyAck,
      communityTopics,
      topicsList: communityTopics,
      eventsList,
      usersList,
      coursesList,
      clubTiersList,
      platformSettings,
      sqlConfig,
      toasts,
      showToast,
      login,
      register,
      logout,
      acknowledgeSafety,
      // Modals
      authModalOpen, setAuthModalOpen,
      authModalTab, setAuthModalTab,
      onboardingOpen, setOnboardingOpen,
      playerModalOpen, setPlayerModalOpen,
      activeCourse, activeLesson, setActiveLesson,
      openPlayer, toggleLessonDone,
      certificateModalOpen, setCertificateModalOpen,
      activeCertificate,
      bookingModalOpen, setBookingModalOpen,
      activeCoach, openBooking, openBookingModal: openBooking, confirmBooking,
      newTopicModalOpen, setNewTopicModalOpen,
      likeTopic, addTopic, deleteTopic, pinTopic,
      registerEvent, joinClubTier,
      adminModalOpen, setAdminModalOpen,
      adminModalTab, setAdminModalTab,
      profileModalOpen, setProfileModalOpen,
      activeProfileTab, setActiveProfileTab,
      applicationModalOpen, setApplicationModalOpen,
      activeApplicationTarget, setActiveApplicationTarget,
      // Applications & Registrations
      applicationsList, setApplicationsList,
      formFieldsList, setFormFieldsList,
      userNotifications, setUserNotifications,
      openApplication,
      submitApplication,
      submitTopicApplication,
      updateApplicationStatus,
      cancelApplication,
      deleteApplication,
      addFormField,
      updateFormField,
      deleteFormField,
      markNotificationRead,
      clearNotifications,
      deleteNotification,
      updateCurrentUser,
      // Admin Operations
      updateUser, addUser, deleteUser,
      // RBAC System
      rolesList, setRolesList,
      permissionModules: PERMISSION_MODULES,
      allPermissions: ALL_PERMISSION_KEYS,
      getUserEffectivePermissions,
      hasPermission,
      canAccessAdmin,
      addRole,
      updateRole,
      deleteRole,
      toggleRoleActive,
      duplicateRole,
      updateCourse, addCourse, deleteCourse,
      categoriesList, getCategoryLabel, addCategory, updateCategory, deleteCategory,
      updateClubTier, addClubTier, deleteClubTier,
      addEvent, updateEvent, deleteEvent,
      updateTopic,
      updatePlatformSettings,
      updateSqlConfig,
      testSqlConnection,
      migrateDatabaseTables,
      syncAllLocalDataToDatabase,
      apiCall,
      // CMS & Home Blocks
      homeContent,
      updateHomeBlock,
      resetHomeBlock,
      pillarsList,
      addPillar,
      updatePillar,
      deletePillar,
      updateAllPillars,
      areasList,
      addArea,
      updateArea,
      deleteArea,
      updateAllAreas,
      coachesList,
      addCoach,
      updateCoach,
      deleteCoach,
      testimonialsList,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      faqsList,
      addFaq,
      updateFaq,
      deleteFaq,
      // Page Routing & Slug Settings
      currentPage,
      setCurrentPage,
      navigateTo,
      getPageSlug,
      getPageUrl,
      updatePageSlugs,
      PAGE_DEFINITIONS,
      DEFAULT_PAGE_SLUGS
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

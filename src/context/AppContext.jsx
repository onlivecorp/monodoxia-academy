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

const INITIAL_USERS = [
  { id: 'u7', name: 'Admin Baş Koordinator', email: 'admin@monodoxia.academy', role: 'Admin', tier: 'VIP', status: 'Aktiv', joinedDate: '2025-01-01' }
];

const INITIAL_SETTINGS = {
  siteTitle: "Monodoxia Academy",
  subtitle: "Fərdi İnkişaf və Psixologiya Mərkəzi",
  currency: "AZN (₼)",
  defaultLang: "az",
  showSafetyBanner: true,
  safetyText: "Monodoxia Academy təhsil, fərdi inkişaf və kouçinq platformasıdır. Təqdim edilən proqramlar və materiallar tibbi, psixiatrik və ya kliniki diaqnostika və müalicəni əvəz etmir.",
  maintenanceMode: false,
  allowRegistrations: true
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

export function AppProvider({ children }) {
  // Current User Session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('monodoxia_user');
    return saved ? JSON.parse(saved) : null;
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
    return localStorage.getItem('monodoxia_tier') || 'Free';
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
        return parsed.filter(u => !['u1', 'u2', 'u3', 'u4', 'u5', 'u6'].includes(u.id));
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [coursesList, setCoursesList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_courses');
    return saved ? JSON.parse(saved) : COURSES;
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
    const saved = localStorage.getItem('monodoxia_admin_events');
    return saved ? JSON.parse(saved) : EVENTS;
  });

  const [communityTopics, setCommunityTopics] = useState(() => {
    const saved = localStorage.getItem('monodoxia_admin_topics');
    return saved ? JSON.parse(saved) : COMMUNITY_TOPICS;
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
        return parsed.filter(c => !['coach-leyla', 'coach-farid', 'coach-nargiz'].includes(c.id) && !['Dr. Leyla Əliyeva', 'Fərid Məmmədov', 'Nərgiz Qasımova'].includes(c.name));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [testimonialsList, setTestimonialsList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [faqsList, setFaqsList] = useState(() => {
    const saved = localStorage.getItem('monodoxia_faqs');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
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
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('applications');

  // Application Modal
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [activeApplicationTarget, setActiveApplicationTarget] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Live MySQL Hydration on App Mount
  useEffect(() => {
    fetch('/api.php?action=get_all')
      .then(res => res.json())
      .then(data => {
        if (data?.status === 'success') {
          if (data.users && data.users.length > 0) {
            setUsersList(data.users.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role || 'Tələbə',
              tier: u.tier || 'Free',
              status: u.status || 'Aktiv',
              joinedDate: u.joined_date || (u.created_at ? u.created_at.split(' ')[0] : new Date().toISOString().split('T')[0])
            })));
          }
          if (data.applications && data.applications.length > 0) {
            setApplicationsList(data.applications.map(a => ({
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
            })));
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
    localStorage.setItem('monodoxia_admin_events', JSON.stringify(eventsList));
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

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Auth Operations
  const login = (email, password) => {
    const user = {
      id: 'usr_' + Date.now(),
      firstName: email.split('@')[0],
      lastName: 'Tələbə',
      email: email,
      role: email.includes('admin') ? 'Admin' : (email.includes('coach') ? 'Kouç' : 'Tələbə'),
      country: 'Azərbaycan',
      city: 'Bakı'
    };
    setCurrentUser(user);
    setAuthModalOpen(false);
    showToast(`Daxil oldunuz: ${user.firstName}`, 'success');
  };

  const register = (data) => {
    const user = {
      id: 'usr_' + Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate,
      country: data.country || 'Azərbaycan',
      city: data.city || 'Bakı',
      role: 'Tələbə',
      joinedAt: new Date().toISOString(),
      focusAreas: []
    };
    setCurrentUser(user);
    const newEntry = {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      role: 'Tələbə',
      tier: 'Free',
      status: 'Aktiv',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsersList(prev => [newEntry, ...prev]);

    // Save directly to MySQL database
    try {
      fetch('/api.php?action=register_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name: newEntry.name,
          email: user.email,
          password: data.password || null,
          role: 'Tələbə',
          tier: 'Free',
          status: 'Aktiv',
          joined_date: newEntry.joinedDate
        })
      }).catch(err => console.warn('MySQL user sync error:', err));
    } catch (e) {}

    setAuthModalOpen(false);
    showToast(`Xoş gəldiniz, ${user.firstName}! Hesabınız yaradıldı.`, 'success');
    setTimeout(() => {
      setOnboardingOpen(true);
    }, 400);
  };

  const logout = () => {
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
    setActiveCourse(course);
    setActiveLesson(course.modules[0].lessons[0]);
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
      course.modules.forEach(m => total += m.lessons.length);
      const percent = Math.min(100, Math.round((list.length / total) * 100));

      if (percent === 100 && courseProg.percent < 100) {
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
        showToast('Təbriklər! Kursu tamamladınız və sertifikat qazandınız.', 'success');
      }

      return {
        ...prev,
        [courseId]: { completedLessons: list, percent }
      };
    });
  };

  // Booking
  const openBooking = (coachId) => {
    const coach = coachesList.find(c => c.id === coachId);
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
    showToast(`Sessiya uğurla təyin edildi: ${bookingData.coachName}`, 'success');
  };

  // Community
  const likeTopic = (topicId) => {
    setCommunityTopics(prev => prev.map(t => {
      if (t.id === topicId) return { ...t, likes: t.likes + 1 };
      return t;
    }));
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
      author: author || (currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Rezident"),
      likes: 1,
      repliesCount: 0,
      translations: translations || {}
    };
    setCommunityTopics(prev => [newT, ...prev]);
    setNewTopicModalOpen(false);
    showToast('Mövzu uğurla dərc edildi.', 'success');
  };

  const deleteTopic = (topicId) => {
    setCommunityTopics(prev => prev.filter(t => t.id !== topicId));
    showToast('Mövzu uğurla silindi', 'info');
  };

  const pinTopic = (topicId) => {
    setCommunityTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        return { ...t, badge: "📌 Sabitlənmiş Müzakirə" };
      }
      return t;
    }));
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

  // Club Tier upgrade
  const joinClubTier = (tier) => {
    setUserTier(tier);
    showToast(`Təbriklər! Siz artıq Monodoxia Coaching Club "${tier}" üzvüsünüz.`, 'success');
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
    let price = targetItem.price ? (String(targetItem.price).startsWith('₼') ? targetItem.price : `₼ ${targetItem.price}`) : 'Pulsuz';
    if (price === '₼ 0' || price === '0') price = 'Pulsuz';

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
    setUserNotifications(prev => [newNotif, ...prev]);

    setApplicationModalOpen(false);
    showToast(`Müraciətiniz uğurla göndərildi: ${formData.targetTitle}`, 'success');

    // Also try API sync in background if configured
    try {
      fetch('/api.php?action=submit_application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: newApp.userId,
          user_name: newApp.userName,
          user_email: newApp.userEmail,
          user_phone: newApp.userPhone,
          target_type: newApp.targetType,
          target_id: newApp.targetId,
          target_title: newApp.targetTitle,
          price: newApp.price,
          form_responses: newApp.formResponses,
          user_note: newApp.userNote
        })
      }).catch(() => {});
    } catch (e) {}

    return { success: true, application: newApp };
  };

  const updateApplicationStatus = (appId, newStatus, adminNote = null, paymentStatus = null, attendanceStatus = null) => {
    let updatedApp = null;

    setApplicationsList(prev => prev.map(app => {
      if (app.id === appId) {
        updatedApp = {
          ...app,
          status: newStatus,
          adminNote: adminNote !== null ? adminNote : app.adminNote,
          paymentStatus: paymentStatus !== null ? paymentStatus : app.paymentStatus,
          attendanceStatus: attendanceStatus !== null ? attendanceStatus : app.attendanceStatus
        };
        return updatedApp;
      }
      return app;
    }));

    if (updatedApp) {
      // In-app notification for the applicant
      const notifType = (newStatus === 'Təsdiqləndi' || newStatus === 'Tamamlandı') ? 'success' : (['Rədd edildi', 'Ləğv edildi'].includes(newStatus) ? 'error' : 'warning');
      const notifMsg = `"${updatedApp.targetTitle}" müraciətinizin statusu yeniləndi: ${newStatus}.${adminNote ? ' Qeyd: ' + adminNote : ''}`;

      const newNotif = {
        id: 'notif-' + Date.now(),
        userId: updatedApp.userId,
        title: `Müraciət Statusu: ${newStatus}`,
        message: notifMsg,
        type: notifType,
        isRead: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setUserNotifications(prev => [newNotif, ...prev]);

      // If approved, update live event/course occupancy
      if (newStatus === 'Təsdiqləndi') {
        if (updatedApp.targetType === 'event' || updatedApp.targetType === 'webinar') {
          setEventsList(prev => prev.map(e => e.id === updatedApp.targetId ? { ...e, registered: Math.min(e.capacity, (e.registered || 0) + 1) } : e));
        } else if (updatedApp.targetType === 'course') {
          setCoursesList(prev => prev.map(c => c.id === updatedApp.targetId ? { ...c, occupancy: Math.min(100, (c.occupancy || 0) + 2) } : c));
        } else if (updatedApp.targetType === 'club') {
          setUserTier(updatedApp.targetTitle.includes('VIP') ? 'VIP' : (updatedApp.targetTitle.includes('Premium') ? 'Premium' : 'Basic'));
        }
      }

      showToast(`Müraciət statusu yeniləndi: ${newStatus}`, 'success');

      // Sync with API
      try {
        fetch('/api.php?action=update_application_status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: appId,
            status: newStatus,
            admin_note: adminNote,
            payment_status: paymentStatus,
            attendance_status: attendanceStatus
          })
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const cancelApplication = (appId) => {
    updateApplicationStatus(appId, 'Ləğv edildi', 'İstifadəçi tərəfindən ləğv edildi.');
    showToast('Müraciətiniz ləğv edildi.', 'info');
  };

  const deleteApplication = (appId, permanent = false) => {
    if (permanent) {
      setApplicationsList(prev => prev.filter(a => a.id !== appId));
    } else {
      setApplicationsList(prev => prev.map(a => a.id === appId ? { ...a, archived: true } : a));
    }
    showToast('Müraciət silindi / arxivləşdirildi.', 'info');

    try {
      fetch('/api.php?action=delete_application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, permanent })
      }).catch(() => {});
    } catch (e) {}
  };

  // Form Fields Management
  const addFormField = (fieldData) => {
    const newField = {
      id: 'fld_' + Date.now(),
      targetType: fieldData.targetType || 'all',
      label: fieldData.label,
      fieldType: fieldData.fieldType || 'text',
      options: fieldData.options || [],
      placeholder: fieldData.placeholder || '',
      isRequired: Boolean(fieldData.isRequired),
      isActive: true,
      sortOrder: (formFieldsList.length + 1)
    };
    setFormFieldsList(prev => [...prev, newField]);
    showToast(`Form sahəsi əlavə edildi: ${newField.label}`, 'success');

    try {
      fetch('/api.php?action=save_form_field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newField)
      }).catch(() => {});
    } catch (e) {}
  };

  const updateFormField = (id, updates) => {
    setFormFieldsList(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    showToast('Form sahəsi yeniləndi', 'success');

    try {
      fetch('/api.php?action=save_form_field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      }).catch(() => {});
    } catch (e) {}
  };

  const deleteFormField = (id) => {
    setFormFieldsList(prev => prev.filter(f => f.id !== id));
    showToast('Form sahəsi silindi', 'info');

    try {
      fetch('/api.php?action=delete_form_field', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(() => {});
    } catch (e) {}
  };

  // Notifications
  const markNotificationRead = (notifId) => {
    if (notifId === 'all') {
      setUserNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } else {
      setUserNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    }
  };

  const clearNotifications = () => {
    setUserNotifications(prev => prev.filter(n => n.userId !== currentUser?.id));
    showToast('Bildirişlər təmizləndi', 'info');
  };

  const updateCurrentUser = (updates) => {
    setCurrentUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Also update in usersList
      setUsersList(uList => uList.map(u => u.id === updated.id ? { ...u, name: `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || updated.name, email: updated.email } : u));
      return updated;
    });
    showToast('Profil məlumatları yeniləndi', 'success');
  };

  // Admin Operations (CRUD)
  const updateUser = (id, updates) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    showToast('İstifadəçi məlumatı yeniləndi', 'success');
    const target = usersList.find(u => u.id === id);
    if (target) {
      const merged = { ...target, ...updates };
      fetch('/api.php?action=save_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      }).catch(() => {});
    }
  };

  const addUser = (newUser) => {
    const user = {
      id: 'u_' + Date.now(),
      ...newUser,
      translations: newUser.translations || {},
      status: newUser.status || 'Aktiv',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsersList(prev => [user, ...prev]);
    showToast(`İstifadəçi əlavə edildi: ${user.name}`, 'success');

    fetch('/api.php?action=save_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).catch(() => {});
  };

  const deleteUser = (id) => {
    setUsersList(prev => prev.filter(u => u.id !== id));
    showToast('İstifadəçi silindi', 'info');

    fetch('/api.php?action=delete_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(() => {});
  };

  const updateCourse = (id, updates) => {
    setCoursesList(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Kurs parametrləri yeniləndi', 'success');
  };

  const addCourse = (newCourse) => {
    const course = {
      id: 'course-' + Date.now(),
      category: newCourse.category || 'psychology',
      badge: newCourse.badge || 'YENİ KURS',
      badgeClass: 'bg-secondary/10 text-secondary',
      duration: newCourse.duration || '8 Həftə',
      title: newCourse.title,
      description: newCourse.description,
      instructor: newCourse.instructor,
      instructorRole: 'Sertifikatlı Kouç',
      status: 'Qrup qəbulu aktivdir',
      occupancy: 0,
      price: newCourse.price,
      featured: false,
      translations: newCourse.translations || {},
      modules: [
        {
          id: 'm1',
          title: 'Modul 1: Giriş və Əsaslar',
          lessons: [
            { id: 'l1', title: '1.1 Orientasiya və Məqsədlər', duration: '20 dəq', type: 'video' }
          ]
        }
      ]
    };
    setCoursesList(prev => [...prev, course]);
    showToast(`Yeni kurs əlavə edildi: ${course.title}`, 'success');
  };

  const deleteCourse = (id) => {
    setCoursesList(prev => prev.filter(c => c.id !== id));
    showToast('Kurs silindi', 'info');
  };

  const updateClubTier = (id, updates) => {
    setClubTiersList(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (typeof updated.features === 'string') {
          updated.features = updated.features.split('\n').map(s => s.trim()).filter(Boolean);
        }
        return updated;
      }
      return t;
    }));
    showToast('Abunəlik tarifi yeniləndi', 'success');
  };

  const addClubTier = (newTier) => {
    const tier = {
      id: 'tier-' + Date.now(),
      name: newTier.name,
      price: newTier.price,
      period: newTier.period || '/ aylıq',
      popular: Boolean(newTier.popular),
      translations: newTier.translations || {},
      features: Array.isArray(newTier.features)
        ? newTier.features
        : (newTier.features || '').split('\n').map(s => s.trim()).filter(Boolean),
      active: true
    };
    setClubTiersList(prev => [...prev, tier]);
    showToast(`Yeni abunəlik paketi əlavə edildi: ${tier.name}`, 'success');
  };

  const deleteClubTier = (id) => {
    setClubTiersList(prev => prev.filter(t => t.id !== id));
    showToast('Abunəlik paketi silindi', 'info');
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
      translations: newEvent.translations || {},
      isOnline: newEvent.isOnline ?? true
    };
    setEventsList(prev => [ev, ...prev]);
    showToast(`Tədbir yaradıldı: ${ev.title}`, 'success');
  };

  const updateEvent = (id, updates) => {
    setEventsList(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showToast('Tədbir məlumatları yeniləndi', 'success');
  };

  const deleteEvent = (id) => {
    setEventsList(prev => prev.filter(e => e.id !== id));
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
      type: categoryData.type || 'course',
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
    showToast(`Kateqoriya əlavə edildi: ${newCat.name}`, 'success');
    return newCat;
  };

  const updateCategory = (id, updates) => {
    setCategoriesList(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Kateqoriya yeniləndi', 'success');
  };

  const deleteCategory = (id) => {
    setCategoriesList(prev => prev.filter(c => c.id !== id));
    showToast('Kateqoriya silindi', 'info');
  };

  const updateTopic = (id, updates) => {
    setCommunityTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('İcma mövzusu yeniləndi', 'success');
  };

  const updatePlatformSettings = (newSettings) => {
    setPlatformSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Sistem tənzimləmələri yadda saxlanıldı', 'success');
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
    setHomeContent(prev => ({
      ...prev,
      [blockKey]: {
        ...prev[blockKey],
        ...blockData
      }
    }));
    showToast(`"${blockKey.toUpperCase()}" bloku uğurla yeniləndi!`, 'success');
  };

  const resetHomeBlock = (blockKey) => {
    if (INITIAL_HOME_CONTENT[blockKey]) {
      setHomeContent(prev => ({
        ...prev,
        [blockKey]: INITIAL_HOME_CONTENT[blockKey]
      }));
      showToast(`"${blockKey.toUpperCase()}" bloku ilkin vəziyyətinə qaytarıldı`, 'info');
    }
  };

  // Pillars Operations
  const addPillar = (pillar) => {
    const newPillar = {
      id: 'pillar-' + Date.now(),
      icon: pillar.icon || 'psychology',
      title: pillar.title,
      desc: pillar.desc
    };
    setPillarsList(prev => [...prev, newPillar]);
    showToast(`Yeni sütun əlavə edildi: ${newPillar.title}`, 'success');
  };

  const updatePillar = (id, updates) => {
    setPillarsList(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Sütun məlumatı yeniləndi', 'success');
  };

  const deletePillar = (id) => {
    setPillarsList(prev => prev.filter(p => p.id !== id));
    showToast('Sütun silindi', 'info');
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

  // Coaches Operations
  const addCoach = (coach) => {
    const newCoach = {
      id: coach.id || ('coach-' + Date.now()),
      userId: coach.userId || null,
      name: coach.name,
      title: coach.title || 'Sertifikatlı Kouç & Ekspert',
      experience: coach.experience || '5+ il təcrübə',
      bio: coach.bio || '',
      image: coach.image || '',
      specialties: Array.isArray(coach.specialties) ? coach.specialties : (coach.specialties ? coach.specialties.split(',').map(s => s.trim()).filter(Boolean) : ['Fərdi İnkişaf']),
      availableSlots: coach.availableSlots || ['Sabah 15:00', 'Cümə 18:00']
    };
    setCoachesList(prev => [...prev, newCoach]);
    if (coach.userId) {
      setUsersList(prev => prev.map(u => u.id === coach.userId ? { ...u, role: 'Kouç' } : u));
    }
    showToast(`Ekspert heyətinə təyin edildi: ${newCoach.name}`, 'success');
  };

  const updateCoach = (id, updates) => {
    setCoachesList(prev => prev.map(c => {
      if (c.id === id) {
        const spec = typeof updates.specialties === 'string'
          ? updates.specialties.split(',').map(s => s.trim()).filter(Boolean)
          : updates.specialties;
        return { ...c, ...updates, ...(spec ? { specialties: spec } : {}) };
      }
      return c;
    }));
    showToast('Kouç profili yeniləndi', 'success');
  };

  const deleteCoach = (id) => {
    setCoachesList(prev => prev.filter(c => c.id !== id));
    showToast('Kouç silindi', 'info');
  };

  // Testimonials Operations
  const addTestimonial = (testimonial) => {
    const newT = {
      id: 't-' + Date.now(),
      quote: testimonial.quote,
      author: testimonial.author,
      role: testimonial.role || 'Məzun'
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
      answer: faq.answer
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
      activeCoach, openBooking, confirmBooking,
      newTopicModalOpen, setNewTopicModalOpen,
      likeTopic, addTopic, deleteTopic, pinTopic,
      registerEvent, joinClubTier,
      adminModalOpen, setAdminModalOpen,
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
      updateApplicationStatus,
      cancelApplication,
      deleteApplication,
      addFormField,
      updateFormField,
      deleteFormField,
      markNotificationRead,
      clearNotifications,
      updateCurrentUser,
      // Admin Operations
      updateUser, addUser, deleteUser,
      updateCourse, addCourse, deleteCourse,
      categoriesList, getCategoryLabel, addCategory, updateCategory, deleteCategory,
      updateClubTier, addClubTier, deleteClubTier,
      addEvent, updateEvent, deleteEvent,
      updateTopic,
      updatePlatformSettings,
      updateSqlConfig,
      testSqlConnection,
      migrateDatabaseTables,
      // CMS & Home Blocks
      homeContent,
      updateHomeBlock,
      resetHomeBlock,
      pillarsList,
      addPillar,
      updatePillar,
      deletePillar,
      areasList,
      addArea,
      updateArea,
      deleteArea,
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
      deleteFaq
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

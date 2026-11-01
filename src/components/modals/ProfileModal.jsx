import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APPLICATION_STATUSES, TARGET_TYPE_MAP, INITIAL_FORM_FIELDS } from '../../data/applicationData';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalized, translateStatus, translatePrice, translateTitle } from '../../i18n/localize';

export default function ProfileModal() {
  const { currentLang, defaultLang, t } = useLanguage();
  const {
    profileModalOpen,
    setProfileModalOpen,
    setAdminModalOpen,
    currentUser,
    userTier,
    certificates,
    bookings,
    setOnboardingOpen,
    applicationsList,
    cancelApplication,
    deleteApplication,
    formFieldsList = [],
    userNotifications,
    markNotificationRead,
    clearNotifications,
    deleteNotification,
    updateCurrentUser,
    activeProfileTab,
    setActiveProfileTab,
    openPlayer,
    showToast,
    // Certificate System
    certificatesList = [],
    setCertViewModalOpen,
    setActiveCertView,
    coachesList = [],
    addCoachCertificate,
    deleteCoachCertificate,
    updateCoach,
    updateBookingStatus,
    updateBookingEndTime,
    refreshBookings,
  } = useApp();

  const activeTab = activeProfileTab || 'profile';
  const setActiveTab = setActiveProfileTab;
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    country: 'Azərbaycan',
    city: 'Bakı',
    bio: '',
    linkedin: '',
    instagram: ''
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [expandedAppId, setExpandedAppId] = useState(null);

  // Coach custom certificate states
  const [showCoachCertForm, setShowCoachCertForm] = useState(false);
  const [coachCertTitle, setCoachCertTitle] = useState('');
  const [coachCertIssuer, setCoachCertIssuer] = useState('');
  const [coachCertYear, setCoachCertYear] = useState(new Date().getFullYear().toString());
  const [coachCertId, setCoachCertId] = useState('');
  const [coachCertUrl, setCoachCertUrl] = useState('');
  const [bookingEndTimes, setBookingEndTimes] = useState({});

  // Expert Profile Edit states
  const [expertBio, setExpertBio] = useState('');
  const [expertSpecialties, setExpertSpecialties] = useState('');
  const [expertSlots, setExpertSlots] = useState([]);
  const [expertNewSlot, setExpertNewSlot] = useState('');
  const [expertSchedule, setExpertSchedule] = useState([]);
  const [newSlotDate, setNewSlotDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newSlotStart, setNewSlotStart] = useState('14:00');
  const [newSlotEnd, setNewSlotEnd] = useState('15:00');
  const [newSlotStatus, setNewSlotStatus] = useState('Dolu'); // 'Dolu' | 'Mövcud'
  const [newSlotNote, setNewSlotNote] = useState('');
  const [expertProfileSaved, setExpertProfileSaved] = useState(false);
  const [expertProfileInited, setExpertProfileInited] = useState(false);
  const [expertImage, setExpertImage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || currentUser.name?.split(' ')[0] || '',
        lastName: currentUser.lastName || currentUser.name?.split(' ').slice(1).join(' ') || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        avatar: currentUser.avatar || currentUser.image || '',
        country: currentUser.country || 'Azərbaycan',
        city: currentUser.city || 'Bakı',
        bio: currentUser.bio || '',
        linkedin: currentUser.linkedin || '',
        instagram: currentUser.instagram || ''
      });
    }
  }, [currentUser]);

  // Immediately refresh bookings whenever modal is opened
  useEffect(() => {
    if (profileModalOpen && refreshBookings) {
      refreshBookings();
    }
  }, [profileModalOpen]);

  if (!profileModalOpen || !currentUser) return null;

  const isCoachOrAdmin = currentUser?.role === 'Kouç' || currentUser?.role === 'Admin';
  const myCoachProfile = (coachesList || []).find(
    c => (c.userId && String(c.userId) === String(currentUser?.id)) ||
         (c.user_id && String(c.user_id) === String(currentUser?.id)) ||
         (c.name && currentUser?.name && c.name.toLowerCase().trim() === currentUser?.name.toLowerCase().trim()) ||
         (currentUser?.id === 'usr_1792923099303' && (c.id === 'coach-1792923105867' || (c.name && c.name.includes('Sədaqət')))) ||
         (currentUser?.id === 'u-nargiz' && (c.id === 'coach-nargiz' || (c.name && c.name.includes('Nərgiz'))))
  ) || (currentUser?.role === 'Admin' ? (coachesList[0] || null) : null);

  const coachIncomingBookings = (bookings || []).filter(b => {
    if (currentUser?.role === 'Admin') return true;
    if (currentUser?.role !== 'Kouç' && !myCoachProfile) return false;

    const uName = (currentUser?.name || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`).toLowerCase().trim();
    const bCoachName = (b.coachName || b.coach_name || '').toLowerCase().trim();
    const bCoachId = String(b.coachId || b.coach_id || '');

    // 1. Match by coach profile ID
    if (myCoachProfile && (bCoachId === myCoachProfile.id || bCoachId === String(myCoachProfile.user_id) || bCoachId === String(myCoachProfile.userId))) return true;

    // 2. Match by coach profile name
    if (myCoachProfile?.name) {
      const pName = myCoachProfile.name.toLowerCase().trim();
      if (bCoachName === pName || bCoachName.includes(pName) || pName.includes(bCoachName)) return true;
    }

    // 3. Match by logged-in coach name
    if (uName && bCoachName) {
      if (bCoachName === uName || bCoachName.includes(uName) || uName.includes(bCoachName)) return true;
    }

    // 4. Match by logged-in coach ID or known coach seeds
    if (bCoachId && (bCoachId === String(currentUser?.id) ||
        (currentUser?.id === 'usr_1792923099303' && bCoachId === 'coach-1792923105867') ||
        (currentUser?.id === 'u-nargiz' && bCoachId === 'coach-nargiz'))) return true;

    // 5. Match by known name aliases
    if (uName.includes('sədaqət') || uName.includes('sedaqet')) {
      if (bCoachName.includes('sədaqət') || bCoachName.includes('sedaqet') || bCoachId === 'coach-1792923105867') return true;
    }
    if (uName.includes('nərgiz') || uName.includes('nargiz')) {
      if (bCoachName.includes('nərgiz') || bCoachName.includes('nargiz') || bCoachId === 'coach-nargiz') return true;
    }

    return false;
  });

  const myClientBookings = (bookings || []).filter(b => {
    if (!currentUser?.id) return false;
    return String(b.userId || b.user_id) === String(currentUser.id) ||
           (b.userEmail && currentUser.email && b.userEmail.toLowerCase() === currentUser.email.toLowerCase());
  });

  const myApplications = (applicationsList || []).filter(a => String(a.userId) === String(currentUser?.id) && !a.archived);
  const totalApplicationsCount = myApplications.length + coachIncomingBookings.length + myClientBookings.length;
  const myNotifications = (userNotifications || []).filter(n => {
    if (!currentUser?.id) return false;
    const nUid = String(n.userId || '').replace(/^#/, '');
    const cUid = String(currentUser.id || '').replace(/^#/, '');
    const nAlt = nUid.startsWith('u') ? nUid.slice(1) : ('u' + nUid);
    return nUid === cUid || nAlt === cUid || String(n.userId) === String(currentUser.id);
  });
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const fallbackFieldDict = {
    fld_phone: { az: 'Əlaqə Nömrəsi (WhatsApp)', en: 'Contact Number (WhatsApp)', tr: 'İletişim Numarası (WhatsApp)', ru: 'Контактный Номер (WhatsApp)' },
    phone: { az: 'Əlaqə Nömrəsi (WhatsApp)', en: 'Contact Number (WhatsApp)', tr: 'İletişim Numarası (WhatsApp)', ru: 'Контактный Номер (WhatsApp)' },
    fld_exp: { az: 'Təcrübə / Hazırlıq Səviyyəniz', en: 'Experience / Preparation Level', tr: 'Deneyim / Hazırlık Seviyeniz', ru: 'Опыт / Уровень Подготовки' },
    exp: { az: 'Təcrübə / Hazırlıq Səviyyəniz', en: 'Experience / Preparation Level', tr: 'Deneyim / Hazırlık Seviyeniz', ru: 'Опыт / Уровень Подготовки' },
    fld_goal: { az: 'Müraciət Məqsədi və Gözləntiləriniz', en: 'Application Purpose & Expectations', tr: 'Başvuru Amacı ve Beklentileriniz', ru: 'Цель Заявки и Ожидания' },
    goal: { az: 'Müraciət Məqsədi və Gözləntiləriniz', en: 'Application Purpose & Expectations', tr: 'Başvuru Amacı ve Beklentileriniz', ru: 'Цель Заявки и Ожидания' },
    fld_prof: { az: 'Peşəniz və Hazırkı Fəaliyyət Sahəniz', en: 'Profession & Current Field', tr: 'Mesleğiniz ve Mevcut Faaliyet Alanınız', ru: 'Профессия и Сфера Деятельности' },
    prof: { az: 'Peşəniz və Hazırkı Fəaliyyət Sahəniz', en: 'Profession & Current Field', tr: 'Mesleğiniz ve Mevcut Faaliyet Alanınız', ru: 'Профессия и Сфера Деятельности' },
    fld_file: { az: 'CV / Rezüme və ya Sənəd Linki', en: 'CV / Resume or Document Link', tr: 'CV / Özgeçmiş veya Belge Bağlantısı', ru: 'CV / Резюме или Ссылка на Документ' },
    file: { az: 'CV / Rezüme və ya Sənəd Linki', en: 'CV / Resume or Document Link', tr: 'CV / Özgeçmiş veya Belge Bağlantısı', ru: 'CV / Резюме или Ссылка на Документ' },
    fld_telegram: { az: 'Telegram İstifadəçi Adınız (@username)', en: 'Telegram Username (@username)', tr: 'Telegram Kullanıcı Adınız (@username)', ru: 'Имя Пользователя Telegram (@username)' },
    telegram: { az: 'Telegram İstifadəçi Adınız (@username)', en: 'Telegram Username (@username)', tr: 'Telegram Kullanıcı Adınız (@username)', ru: 'Имя Пользователя Telegram (@username)' },
    fld_source: { az: 'Tədbir haqqında haradan eşitmisiniz?', en: 'Where did you hear about the event?', tr: 'Etkinliği nereden duydunuz?', ru: 'Откуда вы узнали о мероприятии?' },
    source: { az: 'Tədbir haqqında haradan eşitmisiniz?', en: 'Where did you hear about the event?', tr: 'Etkinliği nereden duydunuz?', ru: 'Откуда вы узнали о мероприятии?' },
    // Forum / Community topic fields
    topic_title: { az: 'Mövzu Başlığı', en: 'Topic Title', tr: 'Konu Başlığı', ru: 'Заголовок темы' },
    fld_topic_title: { az: 'Mövzu Başlığı', en: 'Topic Title', tr: 'Konu Başlığı', ru: 'Заголовок темы' },
    topictitle: { az: 'Mövzu Başlığı', en: 'Topic Title', tr: 'Konu Başlığı', ru: 'Заголовок темы' },
    'topic title': { az: 'Mövzu Başlığı', en: 'Topic Title', tr: 'Konu Başlığı', ru: 'Заголовок темы' },
    topic_content: { az: 'Mövzu Məzmunu', en: 'Topic Content', tr: 'Konu İçeriği', ru: 'Содержание темы' },
    fld_topic_content: { az: 'Mövzu Məzmunu', en: 'Topic Content', tr: 'Konu İçeriği', ru: 'Содержание темы' },
    topiccontent: { az: 'Mövzu Məzmunu', en: 'Topic Content', tr: 'Konu İçeriği', ru: 'Содержание темы' },
    'topic content': { az: 'Mövzu Məzmunu', en: 'Topic Content', tr: 'Konu İçeriği', ru: 'Содержание темы' },
    badge: { az: 'Nişan / Etiket', en: 'Badge', tr: 'Rozet / Etiket', ru: 'Значок / Бейдж' },
    fld_badge: { az: 'Nişan / Etiket', en: 'Badge', tr: 'Rozet / Etiket', ru: 'Значок / Бейдж' },
    cover_image: { az: 'Qapaq Şəkli', en: 'Cover Image', tr: 'Kapak Görseli', ru: 'Обложка' },
    fld_cover_image: { az: 'Qapaq Şəkli', en: 'Cover Image', tr: 'Kapak Görseli', ru: 'Обложка' },
    coverimage: { az: 'Qapaq Şəkli', en: 'Cover Image', tr: 'Kapak Görseli', ru: 'Обложка' },
    'cover image': { az: 'Qapaq Şəkli', en: 'Cover Image', tr: 'Kapak Görseli', ru: 'Обложка' },
    read_time: { az: 'Oxuma Müddəti', en: 'Read Time', tr: 'Okuma Süresi', ru: 'Время чтения' },
    fld_read_time: { az: 'Oxuma Müddəti', en: 'Read Time', tr: 'Okuma Süresi', ru: 'Время чтения' },
    readtime: { az: 'Oxuma Müddəti', en: 'Read Time', tr: 'Okuma Süresi', ru: 'Время чтения' },
    'read time': { az: 'Oxuma Müddəti', en: 'Read Time', tr: 'Okuma Süresi', ru: 'Время чтения' },
    category: { az: 'Kateqoriya', en: 'Category', tr: 'Kategori', ru: 'Категория' },
    fld_category: { az: 'Kateqoriya', en: 'Category', tr: 'Kategori', ru: 'Категория' },
    author: { az: 'Müəllif', en: 'Author', tr: 'Yazar', ru: 'Автор' },
    fld_author: { az: 'Müəllif', en: 'Author', tr: 'Yazar', ru: 'Автор' },
    title: { az: 'Başlıq', en: 'Title', tr: 'Başlık', ru: 'Заголовок' },
    fld_title: { az: 'Başlıq', en: 'Title', tr: 'Başlık', ru: 'Заголовок' },
    content: { az: 'Məzmun', en: 'Content', tr: 'İçerik', ru: 'Содержимое' },
    fld_content: { az: 'Məzmun', en: 'Content', tr: 'İçerik', ru: 'Содержимое' }
  };

  const getFieldLabel = (fieldKey) => {
    if (!fieldKey) return '';
    const normKey = String(fieldKey).trim().toLowerCase();
    const cleanKey = normKey.replace(/^fld_/, '').replace(/_/g, ' ').trim();
    const underKey = normKey.replace(/^fld_/, '').replace(/\s+/g, '_').trim();

    // 1. Check fallbackFieldDict
    if (fallbackFieldDict[normKey]) {
      const dict = fallbackFieldDict[normKey];
      return dict[currentLang] || dict[defaultLang] || dict.az || fieldKey;
    }
    if (fallbackFieldDict[cleanKey]) {
      const dict = fallbackFieldDict[cleanKey];
      return dict[currentLang] || dict[defaultLang] || dict.az || fieldKey;
    }
    if (fallbackFieldDict[underKey]) {
      const dict = fallbackFieldDict[underKey];
      return dict[currentLang] || dict[defaultLang] || dict.az || fieldKey;
    }

    // 2. Check formFieldsList from AppContext
    const foundInList = (formFieldsList || []).find(f => f.id === fieldKey || f.key === fieldKey || f.id === normKey || f.key === normKey);
    if (foundInList) {
      return getLocalized(foundInList, 'label', currentLang, defaultLang, foundInList.label || fieldKey);
    }
    // 3. Check INITIAL_FORM_FIELDS
    const foundInInitial = (INITIAL_FORM_FIELDS || []).find(f => f.id === fieldKey || f.key === fieldKey || f.id === normKey || f.key === normKey);
    if (foundInInitial) {
      return getLocalized(foundInInitial, 'label', currentLang, defaultLang, foundInInitial.label || fieldKey);
    }

    // 4. Clean up raw keys like fld_1792261416101 or underscores
    return cleanKey || fieldKey;
  };

  const formatFormResponseValue = (key, val) => {
    if (!val) return '—';
    const sVal = String(val).trim();
    if (key && (key.includes('read_time') || key.includes('readtime') || key === 'read time')) {
      const numMatch = sVal.match(/\d+/);
      if (numMatch) {
        return `${numMatch[0]} ${t('common_minutes') || 'dəqiqə'}`;
      }
    }
    return sVal;
  };

  const getTierDescription = (tier) => {
    const tKey = `profile_tier_desc_${String(tier || 'free').toLowerCase()}`;
    const localized = t(tKey);
    if (localized) return localized;
    if (tier === 'VIP') return t('profile_tier_desc_vip') || 'Bütün qapalı klub tədbirlərinə, mentor sessiyalarına və VIP arxivinə tam limitsiz giriş.';
    if (tier === 'Premium') return t('profile_tier_desc_premium') || 'Genişləndirilmiş tədris modulları və aylıq kouçinq sessiyalarında endirimlər.';
    if (tier === 'Basic') return t('profile_tier_desc_basic') || 'Əsas dərslərə və ictimai icma müzakirələrinə sərbəst çıxış.';
    return t('profile_tier_desc_free') || 'Başlanğıc giriş səviyyəsi. Klub və təlimlərə qoşularaq dərəcənizi yüksəldə bilərsiniz.';
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Şəkil ölçüsü 10MB-dan çox ola bilməz', 'error');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api.php?action=upload_image&prefix=avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const resData = await res.json().catch(() => null);
      if (resData && resData.status === 'success' && resData.url) {
        setProfileForm(p => ({ ...p, avatar: resData.url }));
        updateCurrentUser({ avatar: resData.url, image: resData.url });
        showToast('Profil şəkli bazada saxlanıldı!', 'success');
        return;
      }
    } catch (err) {}
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setProfileForm(p => ({ ...p, avatar: dataUrl }));
      updateCurrentUser({ avatar: dataUrl, image: dataUrl });
      showToast('Profil şəkli yeniləndi!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const fullName = `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`.trim();
    updateCurrentUser({
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      name: fullName || currentUser.name,
      email: profileForm.email.trim(),
      phone: profileForm.phone.trim(),
      avatar: profileForm.avatar,
      image: profileForm.avatar,
      country: profileForm.country.trim(),
      city: profileForm.city.trim(),
      bio: profileForm.bio.trim(),
      linkedin: profileForm.linkedin.trim(),
      instagram: profileForm.instagram.trim()
    });
    setEditingProfile(false);
    showToast('Profil məlumatları uğurla saxlanıldı!', 'success');
  };

  const getBookingStatusText = (status) => {
    if (!status) return t('status_pending') || 'Gözləyir';
    const s = String(status).toLowerCase();
    if (s.includes('təsdiq') || s.includes('confirm') || s.includes('onay') || s.includes('подтвержд')) {
      return t('booking_status_confirmed') || 'Təsdiqləndi';
    }
    if (s.includes('ləğv') || s.includes('cancel') || s.includes('iptal') || s.includes('отмен')) {
      return t('booking_status_cancelled') || 'Ləğv edildi';
    }
    if (s.includes('gözlə') || s.includes('wait') || s.includes('pend') || s.includes('bekle') || s.includes('ожида')) {
      return t('status_pending') || 'Gözləyir';
    }
    return status;
  };

  const getBookingFormatText = (format) => {
    if (!format) return t('booking_format_online') || 'Online (Təhlükəsiz Video Otaq)';
    if (String(format).toLowerCase().includes('online')) {
      return t('booking_format_online') || 'Online (Təhlükəsiz Video Otaq)';
    }
    return format;
  };

  const getApplicationStatusText = (status) => {
    if (!status) return t('status_pending') || 'Gözləyir';
    return translateStatus(status, currentLang);
  };

  const getPaymentStatusText = (status) => {
    if (!status) return status;
    return translateStatus(status, currentLang);
  };

  const getAttendanceStatusText = (status) => {
    if (!status) return status;
    return translateStatus(status, currentLang);
  };

  const getTargetTypeLabel = (targetType) => {
    switch (targetType) {
      case 'course': return t('type_course') || 'Kurs';
      case 'club': return t('type_club') || 'Klub';
      case 'event': return t('type_event') || 'Tədbir';
      case 'webinar': return t('type_webinar') || 'Vebinar';
      case 'community': return t('type_community') || 'İcma';
      case 'forum': return t('type_forum') || 'Forum';
      case 'coach_booking': return t('type_coach_booking') || 'Ekspert / Kouç Rezervasiyası';
      default: return TARGET_TYPE_MAP[targetType]?.label || t('profile_target_program') || 'Proqram';
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordStatus({ type: 'error', text: t('profile_err_current_pass') || 'Cari şifrənizi daxil edin!' });
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: t('profile_err_min_pass') || 'Yeni şifrə ən azı 8 simvoldan ibarət olmalıdır!' });
      return;
    }
    if (!/[A-Za-z]/.test(passwordForm.newPassword) || !/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordStatus({ type: 'error', text: t('profile_err_format_pass') || 'Yeni şifrədə ən azı bir hərf və bir rəqəm olmalıdır!' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', text: t('profile_err_match_pass') || 'Təkrar şifrə uyğun gəlmir!' });
      return;
    }

    try {
      const res = await fetch('/api.php?action=change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        updateCurrentUser({ password: passwordForm.newPassword });
        setPasswordStatus({ type: 'success', text: t('profile_success_pass_db') || 'Şifrəniz bazada təhlükəsiz şəkildə yeniləndi!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast(t('profile_password_updated') || 'Şifrə uğurla dəyişdirildi', 'success');
      } else {
        setPasswordStatus({ type: 'error', text: data.message || 'Cari şifrə yanlışdır və ya xəta baş verdi!' });
      }
    } catch (err) {
      updateCurrentUser({ password: passwordForm.newPassword });
      setPasswordStatus({ type: 'success', text: t('profile_success_pass_local') || 'Şifrəniz yerli profildə yeniləndi!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast(t('profile_password_updated') || 'Şifrə yeniləndi', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-md bg-slate-900/40">
      <div className="bg-[#fcfbf9] text-slate-800 rounded-3xl border border-amber-900/10 shadow-[0_25px_70px_rgba(15,23,42,0.22)] max-w-3xl w-full my-auto overflow-hidden animate-fadeIn relative flex flex-col max-h-[92vh]">
        
        {/* Subtle Warm Top Glow */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-amber-500/10 via-amber-500/[0.03] to-transparent pointer-events-none" />

        {/* Header with User Summary & Tabs */}
        <div className="p-5 sm:p-7 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shrink-0 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* AVATAR WITH QUICK UPLOAD */}
              <div className="relative group shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-amber-50 to-slate-100 flex items-center justify-center shadow-md">
                  {profileForm.avatar || currentUser.avatar || currentUser.image ? (
                    <img
                      src={profileForm.avatar || currentUser.avatar || currentUser.image}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-500/10 text-amber-700 flex items-center justify-center font-serif font-bold text-2xl uppercase">
                      {currentUser.firstName ? currentUser.firstName[0] : (currentUser.name ? currentUser.name[0] : 'U')}
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 rounded-2xl bg-slate-900/60 text-amber-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">{t('profile_change_avatar') || 'Dəyiş'}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg sm:text-2xl text-slate-900 font-bold leading-tight">
                    {currentUser.firstName || currentUser.name} {currentUser.lastName || ''}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 tracking-wide uppercase">
                    {userTier || currentUser.tier || 'Free'} {t('profile_member_label') || 'Üzv'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {currentUser.role || t('nav_student_role') || 'Tələbə'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 block mt-1 font-mono">{currentUser.email}</span>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <span className="text-amber-600 font-bold">#</span>ID: {currentUser.id}
                  </span>
                  {currentUser.joinedDate && <span className="text-slate-400">• {t('profile_registered_label') || 'Qeydiyyat:'} {currentUser.joinedDate}</span>}
                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={() => { setProfileModalOpen(false); setAdminModalOpen(true); }}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[12px]">admin_panel_settings</span>
                      <span>{t('nav_admin') || 'İdarəetmə Paneli'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setProfileModalOpen(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200"
              title={t('common_close') || 'Bağla'}
              aria-label={t('common_close') || 'Bağla'}
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-6 border-b border-slate-200/80 -mb-5 sm:-mb-7 overflow-x-auto pb-0 text-xs scrollbar-thin">
            {/* Expert Profile Tab FIRST for Kouç and Admin */}
            {(currentUser?.role === 'Kouç' || currentUser?.role === 'Admin') && (() => {
              const isAdm = currentUser?.role === 'Admin';
              const myCoachProfile = coachesList.find(
                c => (c.userId && String(c.userId) === String(currentUser?.id)) ||
                     (c.user_id && String(c.user_id) === String(currentUser?.id)) ||
                     (c.name && currentUser?.name && c.name.toLowerCase().trim() === currentUser?.name.toLowerCase().trim()) ||
                     (currentUser?.id === 'usr_1792923099303' && (c.id === 'coach-1792923105867' || (c.name && c.name.includes('Sədaqət')))) ||
                     (currentUser?.id === 'u-nargiz' && (c.id === 'coach-nargiz' || (c.name && c.name.includes('Nərgiz'))))
              ) || (isAdm ? (coachesList[0] || null) : null);
              if (!myCoachProfile && !isAdm) return null;
              return (
                <button
                  onClick={() => {
                    setActiveTab('expert_profile');
                    if (refreshBookings) refreshBookings();
                    if (!expertProfileInited) {
                      setExpertBio(myCoachProfile.bio || myCoachProfile.experience || '');
                      const specs = Array.isArray(myCoachProfile.specialties)
                        ? myCoachProfile.specialties.join(', ')
                        : (myCoachProfile.specialties || '');
                      setExpertSpecialties(specs);
                      const rawAvail = Array.isArray(myCoachProfile.availableSlots) ? myCoachProfile.availableSlots : (Array.isArray(myCoachProfile.available_slots) ? myCoachProfile.available_slots : []);
                      const filteredAvail = rawAvail.filter(s => s !== 'Sabah 15:00' && s !== 'Cümə 18:00');
                      setExpertSlots(filteredAvail);

                      const rawSched = Array.isArray(myCoachProfile.scheduleSlots) ? myCoachProfile.scheduleSlots : [];
                      const filteredSched = rawSched.filter(s => {
                        const lbl = typeof s === 'string' ? s : s?.label;
                        return lbl !== 'Sabah 15:00' && lbl !== 'Cümə 18:00';
                      });

                      const initialSched = filteredSched.length > 0
                        ? filteredSched
                        : filteredAvail.map((s, idx) => ({
                            id: 'slot-init-' + idx,
                            label: typeof s === 'string' ? s : (s.label || s.slot || 'Saat'),
                            date: '',
                            startTime: '',
                            endTime: '',
                            isBooked: false,
                            note: ''
                          }));
                      setExpertSchedule(initialSched);
                      setExpertProfileInited(true);
                      setExpertImage(myCoachProfile.image || myCoachProfile.avatar || '');
                    }
                  }}
                  className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs shrink-0 ${
                    activeTab === 'expert_profile'
                      ? 'border-amber-600 text-amber-800 font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-amber-600">manage_accounts</span>
                  <span>{t('profile_tab_my_expert') || 'Ekspert Profilim & Rezervasiyalar'}</span>
                  {(() => {
                    const reqCount = (bookings || []).filter(b => {
                      if (isAdm) return true;
                      const matchId = (b.coachId && b.coachId === myCoachProfile.id) || (b.coach_id && b.coach_id === myCoachProfile.id);
                      const matchName = b.coachName && myCoachProfile.name && (
                        b.coachName.toLowerCase().trim() === myCoachProfile.name.toLowerCase().trim() ||
                        b.coachName.toLowerCase().includes(myCoachProfile.name.toLowerCase().trim()) ||
                        myCoachProfile.name.toLowerCase().includes(b.coachName.toLowerCase().trim())
                      );
                      return (matchId || matchName) && b.status === 'Gözləyir';
                    }).length;
                    return reqCount > 0 ? (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                        {reqCount}
                      </span>
                    ) : null;
                  })()}
                </button>
              );
            })()}

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs shrink-0 ${
                activeTab === 'profile'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">account_circle</span>
              <span>{t('profile_tab_profile') || 'Profil Məlumatlarım'}</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'security'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">lock_reset</span>
              <span>{t('profile_tab_security') || 'Təhlükəsizlik & Şifrə'}</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'applications'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">assignment</span>
              <span>{t('profile_tab_applications') || 'Müraciətlər & Qeydiyyat'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {totalApplicationsCount}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('notifications');
                markNotificationRead('all');
              }}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs relative ${
                activeTab === 'notifications'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">notifications</span>
              <span>{t('profile_tab_notifications') || 'Bildirişlər'}</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('learning')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'learning'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">workspace_premium</span>
              <span>{t('profile_learning_coaching') || 'Tədris & Kouçinq'}</span>
            </button>

            {/* Certificates Tab */}
            <button
              onClick={() => setActiveTab('certificates')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'certificates'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">card_membership</span>
              <span>{t('profile_tab_certificates') || 'Sertifikatlarım'}</span>
              {(() => { const n = certificatesList.filter(c => String(c.userId) === String(currentUser?.id) && c.status === 'Yayında').length; return n > 0 ? <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">{n}</span> : null; })()}
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'membership'
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">card_membership</span>
              <span>{t('profile_tab_membership') || 'Üzvlük (Paket)'}</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-sm bg-[#faf9f6]">
          {/* TAB 1: PROFILE INFO & EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                    <span className="material-symbols-outlined text-[16px]">badge</span>
                    {t('profile_personal_info') || 'Şəxsi Profil Məlumatları'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t('profile_manage_sub') || 'Hesab rekvizitlərinizi və ictimai profilinizi tənzimləyin'}
                  </p>
                </div>
                {!editingProfile ? (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50/80 text-amber-900 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>{t('profile_edit_btn') || 'Profili Redaktə Et'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    {t('profile_cancel_btn') || 'Ləğv Et'}
                  </button>
                )}
              </div>

              {/* AVATAR SELECTOR / UPLOAD IN VIEW & EDIT */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-amber-50 flex items-center justify-center shrink-0 shadow-sm">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif font-bold text-2xl text-amber-700">
                      {profileForm.firstName ? profileForm.firstName[0] : 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="font-semibold text-slate-800 text-xs">{t('profile_avatar_title') || 'Profil Şəkli / Avatar'}</div>
                  <p className="text-[11px] text-slate-500">
                    {t('profile_avatar_note') || 'JPG, PNG və ya WebM formatında maksimum 5MB fayl yükləyə bilərsiniz.'}
                  </p>
                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <label className="cursor-pointer px-3 py-1 rounded-xl bg-amber-100/70 hover:bg-amber-200/70 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1 transition-all">
                      <span className="material-symbols-outlined text-[15px]">upload</span>
                      <span>{t('profile_upload_new_img') || 'Yeni Şəkil Yüklə'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                    {profileForm.avatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm(p => ({ ...p, avatar: '' }));
                          updateCurrentUser({ avatar: '', image: '' });
                        }}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2 py-1 transition-colors"
                      >
                        {t('profile_delete_img') || 'Şəkli Sil'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth_first_name_label') || 'Ad'} *</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth_last_name_label') || 'Soyad'}</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_field_email_full') || t('profile_field_email') || 'E-poçt Ünvanı'} *</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_field_phone_wa') || 'Telefon / WhatsApp'}</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+994 50 123 45 67"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_field_country') || 'Ölkə'}</label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_field_city') || 'Şəhər'}</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_field_bio') || 'Haqqında / Bio'}</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder={t('profile_field_bio_ph') || 'Özünüz haqqında qısa məlumat, peşə və maraq sahələriniz...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_field_linkedin') || 'LinkedIn Profili'}</label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/in/..."
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_field_instagram') || 'Instagram Profili'}</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/..."
                        value={profileForm.instagram}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, instagram: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/70">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      {t('profile_cancel_btn') || 'İmtina'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>{t('common_save') || 'Yadda Saxla'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-300 transition-colors shadow-sm">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">{t('auth_first_name_label') || 'Ad'}</span>
                      <strong className="text-slate-900 text-sm sm:text-base font-serif font-semibold">
                        {currentUser.firstName} {currentUser.lastName}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-300 transition-colors shadow-sm">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">{t('profile_field_email') || 'E-poçt'}</span>
                      <strong className="text-slate-900 font-mono">{currentUser.email}</strong>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-300 transition-colors shadow-sm">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">{t('profile_field_phone_wa') || `${t('contact_phone_label') || 'Telefon'} / WhatsApp`}</span>
                      <strong className="text-slate-900">{currentUser.phone || `+994 ${t('profile_loc_not_specified') || '(qeyd edilməyib)'}`}</strong>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-300 transition-colors shadow-sm">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">{t('profile_field_city') || 'Məkan'}</span>
                      <strong className="text-slate-900">{currentUser.city || 'Bakı'}, {currentUser.country || 'Azərbaycan'}</strong>
                    </div>
                  </div>

                  {currentUser.bio && (
                    <div className="p-4 rounded-2xl border border-slate-200/80 bg-white text-xs shadow-sm">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">{t('profile_field_bio') || 'Haqqında / Bio'}</span>
                      <p className="text-slate-700 leading-relaxed">{currentUser.bio}</p>
                    </div>
                  )}

                  {(currentUser.linkedin || currentUser.instagram) && (
                    <div className="p-4 rounded-2xl border border-slate-200/80 bg-white text-xs flex items-center gap-4 flex-wrap shadow-sm">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">{t('profile_social_profiles') || 'Sosial Profillər:'}</span>
                      {currentUser.linkedin && (
                        <a href={currentUser.linkedin} target="_blank" rel="noreferrer" className="text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[15px]">link</span>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {currentUser.instagram && (
                        <a href={currentUser.instagram} target="_blank" rel="noreferrer" className="text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200/80 flex justify-between items-center text-xs flex-wrap gap-2">
                <span className="text-slate-500 font-mono">{t('profile_user_id_label') || 'Platforma İstifadəçi ID:'} #{currentUser.id}</span>
                <button
                  onClick={() => {
                    setProfileModalOpen(false);
                    setOnboardingOpen(true);
                  }}
                  className="text-amber-700 hover:text-amber-900 flex items-center gap-1.5 font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>{t('profile_update_roadmap') || 'Fərdi İnkişaf Xəritəsini Yenilə'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-[16px]">security</span>
                  {t('profile_sec_title') || 'Hesab Təhlükəsizliyi və Şifrə Yeniləmə'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('profile_sec_desc') || 'Hesabınızın təhlükəsizliyini təmin etmək üçün mütəmadi olaraq şifrənizi yeniləyin'}
                </p>
              </div>

              {passwordStatus && (
                <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                  passwordStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {passwordStatus.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{passwordStatus.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_curr_pass') || 'Cari Şifrə (Köhnə)'}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_new_pass') || 'Yeni Şifrə (Minimum 8 simvol, hərf və rəqəm)'} *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('profile_new_pass_confirm') || 'Yeni Şifrə Təkrarı'} *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    <span>{t('profile_update_pass_btn') || 'Şifrəni Yenilə'}</span>
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>{t('profile_sec_status') || 'Hesab Təhlükəsizlik Statusu: Aktiv & Qorunur'}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {t('profile_sec_note') || 'Hesabınız 256-bit SSL şifrələməsi və qorunan sessiya protokolu ilə təmin olunmuşdur. Şübhəli daxilolma cəhdləri qeydə alındıqda dərhal e-poçt bildirişi alacaqsınız.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATIONS & REGISTRATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                  {t('profile_apps_history_title') || 'Bütün Müraciət və Qeydiyyat Tarixçəsi'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('profile_apps_history_desc') || 'Kurslar, klublar, fərdi kouçinq və tədbirlər üçün olan müraciətlərin aktual vəziyyəti'}
                </p>
              </div>

              {/* Saytdan Gələn Kouçinq Rezervasiya Müraciətləri (Kouç üçün) */}
              {(currentUser?.role === 'Kouç' || currentUser?.role === 'Admin') && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-200 dark:border-amber-800">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5 font-mono">
                        <span className="material-symbols-outlined text-[17px] text-amber-600">psychology</span>
                        {t('profile_coach_incoming_title') || 'Saytdan Gələn Fərdi Kouçinq Rezervasiyaları'} ({coachIncomingBookings.length})
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        {t('profile_coach_incoming_desc') || 'Ziyarətçi və tələbələrinizin sizin üçün göndərdiyi seans müraciətləri'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshBookings && refreshBookings()}
                      className="px-2.5 py-1 rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title={t('profile_refresh_list') || 'Siyahını yenilə'}
                    >
                      <span className="material-symbols-outlined text-[14px]">refresh</span>
                      <span>{t('profile_refresh_btn') || 'Yenilə'}</span>
                    </button>
                  </div>

                  {coachIncomingBookings.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-amber-300/60 rounded-xl bg-white/70">
                      <span className="material-symbols-outlined text-3xl text-amber-500 mb-1">event_available</span>
                      <p className="text-xs font-semibold text-slate-700">{t('profile_no_coach_bookings') || 'Hələ yeni kouçinq rezervasiyası daxil olmayıb.'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t('profile_no_coach_bookings_sub') || 'Ziyarətçilər və tələbələr saytdan sizin üçün fərdi seans rezervasiya etdikdə müraciətlər dərhal burada görünəcək.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {coachIncomingBookings.map(b => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">{b.userName || b.user_name || (t('profile_booking_user_fallback') || 'İstifadəçi')}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'Təsdiqləndi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              b.status === 'Ləğv edildi' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                              'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {getBookingStatusText(b.status)}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">#{b.id}</span>
                            {b.isGuest && (
                              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-semibold">
                                {t('guest_label') || 'Qonaq'}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-700 flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">schedule</span>
                              {b.slot || `${b.selectedDate || ''} ${b.startTime || ''}${b.endTime ? '-' + b.endTime : ''}`}
                            </span>
                            <span className="text-slate-500">• {getBookingFormatText(b.format)}</span>
                            {b.userEmail && <span className="text-slate-400 font-mono text-[11px]">({b.userEmail})</span>}
                            {b.userPhone && (
                              <a
                                href={`https://wa.me/${String(b.userPhone).replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-700 hover:underline text-[11px] font-medium flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-[13px]">chat</span>
                                <span>{b.userPhone}</span>
                              </a>
                            )}
                            {b.userAddress && <span className="text-slate-600 text-[11px] font-medium">{t('profile_field_address') || 'Ünvan'}: {b.userAddress}</span>}
                          </div>

                          {b.notes && (
                            <p className="text-[11px] text-slate-600 italic bg-slate-50 p-1.5 rounded border border-slate-200/80 mt-1">
                              "{b.notes}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {b.status !== 'Təsdiqləndi' && (
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <label className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{t('booking_end_time_label') || 'Bitiş saatı:'}</label>
                                <input
                                  type="time"
                                  value={bookingEndTimes[b.id] || b.endTime || (b.startTime ? (() => { const [h,m] = (b.startTime||'00:00').split(':').map(Number); return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`; })() : '15:00')}
                                  onChange={e => setBookingEndTimes(prev => ({ ...prev, [b.id]: e.target.value }))}
                                  className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                  title="Seans bitiş saatını təyin edin"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(b.id, 'Təsdiqləndi', { endTime: bookingEndTimes[b.id] || b.endTime || (b.startTime ? (() => { const [h,m] = (b.startTime||'00:00').split(':').map(Number); return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`; })() : '') })}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                                title="Rezervasiyanı qəbul et və bitiş saatını təsdiqlə"
                              >
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                <span>{t('booking_accept_short') || 'Qəbul Et'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(b.id, 'Ləğv edildi')}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 border border-rose-200 cursor-pointer transition-colors"
                                title="Rezervasiyanı rədd et"
                              >
                                <span className="material-symbols-outlined text-[15px]">cancel</span>
                                <span>{t('booking_reject_short') || 'Rədd Et'}</span>
                              </button>
                            </div>
                          )}
                          {b.status === 'Təsdiqləndi' && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">check</span>
                                {t('booking_status_confirmed_done') || 'Təsdiqlənib'}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(b.id, 'Ləğv edildi')}
                                className="text-slate-400 hover:text-rose-600 text-xs transition-colors"
                                title={t('common_cancel') || 'Ləğv et'}
                              >
                                {t('common_cancel') || 'Ləğv Et'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              )}

              {totalApplicationsCount === 0 && currentUser?.role !== 'Kouç' && (
                <div className="text-center py-14 border border-dashed border-slate-300 rounded-2xl bg-white">
                  <span className="material-symbols-outlined text-[44px] text-slate-400 mb-2">inbox</span>
                  <p className="text-xs text-slate-700 font-medium">{t('profile_no_applications') || 'Hələ heç bir müraciətiniz yoxdur.'}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Kurs və ya tədbir seçərək qeydiyyatdan keçə bilərsiniz.
                  </p>
                </div>
              )}

              {myApplications.length > 0 && (
                <div className="space-y-3.5">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    {t('profile_course_event_apps') || 'Kurs və Tədbir Müraciətləri'} ({myApplications.length})
                  </h5>
                  {myApplications.map(app => {
                    const statusObj = APPLICATION_STATUSES.find(s => s.id === app.status) || {
                      badgeClass: 'bg-slate-100 text-slate-800 border-slate-200'
                    };
                    const typeObj = TARGET_TYPE_MAP[app.targetType] || {
                      label: t('profile_target_program') || 'Proqram',
                      icon: 'assignment',
                      color: 'text-amber-700'
                    };
                    const isExpanded = expandedAppId === app.id;
                    const canCancel = ['Yeni', 'Baxılır', 'Gözləmədə'].includes(app.status);

                    return (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 transition-all hover:border-amber-300 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[20px]">{typeObj.icon}</span>
                            </span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-amber-800">
                                  #{app.id} • {getTargetTypeLabel(app.targetType)}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {app.appliedAt}
                                </span>
                              </div>
                              <h5 className="font-serif font-bold text-slate-900 text-sm sm:text-base leading-snug mt-0.5">
                                {translateTitle(app.targetTitle, currentLang)}
                              </h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              app.status === 'Təsdiqləndi' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                              app.status === 'Ləğv edildi' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                              'bg-amber-50 text-amber-800 border-amber-300'
                            }`}>
                              {getApplicationStatusText(app.status)}
                            </span>
                          </div>
                        </div>

                        <div className={`grid gap-2.5 pt-3.5 text-xs text-slate-600 ${app.targetType === 'community' || app.targetType === 'forum' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                          {app.targetType !== 'community' && app.targetType !== 'forum' && (
                            <div>
                              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">{t('common_amount') || 'Məbləğ'}</span>
                              <span className="font-bold text-amber-800 font-mono">{translatePrice(app.price, currentLang) || (t('common_free') || 'Pulsuz')}</span>
                            </div>
                          )}
                          {app.targetType === 'community' || app.targetType === 'forum' ? (
                            <>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">{t('community_pin_label') || 'Önə Çıxarma'}</span>
                                <span className={`font-semibold flex items-center gap-1 ${(app.isPinned ?? app.pinned) ? 'text-amber-700' : 'text-slate-600'}`}>
                                  <span className="material-symbols-outlined text-[13px]">
                                    {(app.isPinned ?? app.pinned) ? 'push_pin' : 'remove'}
                                  </span>
                                  <span>{(app.isPinned ?? app.pinned) ? (t('community_pinned') || 'Önə Çıxarılıb') : (t('community_standard') || 'Standart')}</span>
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">{t('community_comments_label') || 'Rəy İcazəsi'}</span>
                                <span className={`font-semibold flex items-center gap-1 ${app.allowComments === false ? 'text-rose-600' : 'text-emerald-700'}`}>
                                  <span className="material-symbols-outlined text-[13px]">
                                    {app.allowComments === false ? 'lock' : 'chat'}
                                  </span>
                                  <span>{app.allowComments === false ? (t('community_closed') || 'Bağlıdır') : (t('community_open') || 'Açıqdır')}</span>
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">{t('payment_status_label') || 'Ödəniş Statusu'}</span>
                                <span className={`font-medium ${['Ödənildi', 'Ödənilib'].includes(app.paymentStatus) ? 'text-emerald-700 font-bold' : (['Qaytarıldı', 'İmtina edildi'].includes(app.paymentStatus) ? 'text-rose-600 font-bold' : 'text-slate-800')}`}>
                                  {getPaymentStatusText(app.paymentStatus)}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">{t('attendance_status_label') || 'İştirak Statusu'}</span>
                                <span className={`font-medium ${['İştirak edəcək', 'İştirak etdi'].includes(app.attendanceStatus) ? 'text-emerald-700 font-bold' : (['İştirak etməyəcək', 'İştirak etmədi'].includes(app.attendanceStatus) ? 'text-rose-600 font-bold' : 'text-slate-800')}`}>
                                  {getAttendanceStatusText(app.attendanceStatus)}
                                </span>
                              </div>
                            </>
                          )}
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">{t('contact_label') || 'Əlaqə'}</span>
                            <span className="font-mono text-slate-800">{app.userPhone || (t('not_specified') || 'Qeyd olunmayıb')}</span>
                          </div>
                        </div>

                        {app.adminNote && (
                          <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
                            <span className="font-bold text-amber-800 flex items-center gap-1 mb-0.5">
                              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                              {t('admin_note_label') || 'Administrator Qeydi:'}
                            </span>
                            <p className="text-slate-700 italic">
                              {app.adminNote === 'Admin paneldən təsdiqləndi.'
                                ? (t('admin_approved_note') || app.adminNote)
                                : app.adminNote}
                            </p>
                          </div>
                        )}

                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                          <button
                            onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                            className="text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold transition-colors"
                          >
                            <span>{isExpanded ? (t('app_hide_details') || 'Detalları gizlə') : (t('app_view_details') || 'Form detallarına bax')}</span>
                            <span className="material-symbols-outlined text-[15px]">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>

                          <div className="flex items-center gap-2">
                            {app.targetType === 'course' && app.status === 'Təsdiqləndi' && (
                              <button
                                onClick={() => {
                                  setProfileModalOpen(false);
                                  openPlayer(app.targetId);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
                              >
                                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                                <span>{t('app_start_lessons') || 'Dərslərə Başla'}</span>
                              </button>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  cancelApplication(app.id);
                                }}
                                className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                <span>{t('cancel_application') || 'Müraciəti Ləğv Et'}</span>
                              </button>
                            )}
                            {app.status === 'Ləğv edildi' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteApplication(app.id, true);
                                }}
                                className="text-slate-400 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
                                title="Müraciəti tarixçədən təmizlə"
                              >
                                <span className="material-symbols-outlined text-[13px]">delete</span>
                                <span>Sil</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2.5 animate-fadeIn">
                            <span className="font-bold text-amber-900 block border-b border-slate-200 pb-1.5 uppercase font-mono tracking-wider text-[11px]">
                              {t('submitted_form_responses') || 'Təqdim Edilmiş Form Cavabları:'}
                            </span>
                            {app.userNote && (
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                                <strong className="text-slate-500 block text-[11px]">{t('applicant_note_label') || 'Müraciətçinin qeydi:'}</strong>
                                <p className="text-slate-800 mt-0.5">{app.userNote}</p>
                              </div>
                            )}
                            {Object.entries(app.formResponses || {}).map(([key, val]) => (
                              <div key={key} className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                                <strong className="text-slate-500 block text-[11px] font-semibold mb-0.5">
                                  {getFieldLabel(key)}:
                                </strong>
                                <span className="text-slate-900 font-medium text-xs break-words">
                                  {formatFormResponseValue(key, val)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                    <span className="material-symbols-outlined text-[16px]">notifications</span>
                    {t('profile_system_notifications') || 'Sistem Bildirişləri'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t('profile_system_notifications_desc') || 'Müraciət statusları və təlim xəbərdarlıqları'}
                  </p>
                </div>
                {myNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearNotifications('all')}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                    <span>{t('profile_clear_notifications') || 'Təmizlə'}</span>
                  </button>
                )}
              </div>

              {myNotifications.length === 0 ? (
                <div className="text-center py-14 border border-dashed border-slate-300 rounded-2xl bg-white">
                  <span className="material-symbols-outlined text-[44px] text-slate-400 mb-2">notifications_off</span>
                  <p className="text-xs text-slate-700 font-medium">{t('profile_no_notifications') || 'Hələ heç bir bildirişiniz yoxdur.'}</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myNotifications.map(notif => {
                    const isTopicNotif = notif.category === 'community' || (notif.title && (notif.title.includes('Mövzu') || notif.title.includes('İcma')));
                    let icon = notif.type === 'success' ? 'check_circle' : (notif.type === 'error' ? 'error' : (notif.type === 'warning' ? 'schedule' : 'info'));
                    if (isTopicNotif) {
                      if (notif.type === 'success') icon = 'verified';
                      else if (notif.type === 'error') icon = 'cancel';
                      else if (notif.type === 'warning') icon = 'pending';
                      else icon = 'forum';
                    }

                    const iconColor = notif.type === 'success' ? 'text-emerald-600' : (notif.type === 'error' ? 'text-rose-600' : (notif.type === 'warning' ? 'text-amber-600' : 'text-blue-600'));

                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead && markNotificationRead) markNotificationRead(notif.id);
                        }}
                        className={`p-4 rounded-2xl border text-xs flex items-start gap-3.5 transition-all shadow-sm ${
                          notif.isRead
                            ? 'bg-white border-slate-200/80 text-slate-600'
                            : (isTopicNotif 
                                ? 'bg-amber-50/70 border-amber-300 text-slate-900 font-medium cursor-pointer' 
                                : 'bg-white border-amber-300 text-slate-900 font-medium cursor-pointer')
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[22px] ${iconColor} mt-0.5 shrink-0`}>
                          {icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 truncate">
                              {isTopicNotif && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider shrink-0 font-mono">
                                  İCMA
                                </span>
                              )}
                              <span className="font-bold text-slate-900 truncate">{notif.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-slate-400 font-mono">{notif.createdAt}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (deleteNotification) deleteNotification(notif.id);
                                  else clearNotifications(notif.id);
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50"
                                title="Bildirişi sil"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed break-words">
                            {notif.message}
                          </p>

                          {/* Quick Action for Coach Booking Notification */}
                          {(notif.type === 'booking' || (notif.title && notif.title.includes('Rezervasiya'))) && (currentUser?.role === 'Kouç' || currentUser?.role === 'Admin') && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab('applications');
                                  if (refreshBookings) refreshBookings();
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                              >
                                <span className="material-symbols-outlined text-[15px]">event_available</span>
                                <span>Müraciətə Bax & Cavabla (Qəbul / Rədd)</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: LEARNING & COACHING */}
          {activeTab === 'learning' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  {t('profile_learning_certs_coaching') || 'Tədris, Sertifikatlar & Kouçinq'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('profile_learning_certs_desc') || 'Tamamlanmış kurslar və rezerv edilmiş kouçinq sessiyaları'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl border border-amber-200 bg-white flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">{t('profile_earned_certificates') || 'Qazanılmış Sertifikatlar'}</span>
                    <strong className="text-3xl font-serif text-slate-900">{certificates.length}</strong>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200/90 bg-white flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">{t('profile_booked_sessions') || 'Rezerv Olunmuş Sessiyalar'}</span>
                    <strong className="text-3xl font-serif text-slate-900">{bookings.length}</strong>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                    <span className="material-symbols-outlined text-[28px]">event_available</span>
                  </div>
                </div>
              </div>

              {bookings.length > 0 && (
                <div className="mt-5">
                  <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono mb-3">{t('profile_coaching_reservations') || 'Kouçinq Rezervasiyaları:'}</h5>
                  <div className="space-y-2.5">
                    {bookings.map(b => (
                      <div key={b.id} className="p-4 rounded-2xl border border-slate-200 text-xs flex justify-between items-center bg-white hover:border-amber-300 transition-colors shadow-sm">
                        <div>
                          <strong className="text-slate-900 text-sm font-serif block">{b.coachName}</strong>
                          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">{b.date} • {b.time}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                          {getBookingStatusText(b.status || 'Təsdiqləndi')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MEMBERSHIP / TIER */}
          {activeTab === 'membership' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-[16px]">card_membership</span>
                  {t('profile_membership_level_title') || 'Üzvlük Səviyyəsi və Üzvlük'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {t('profile_membership_level_desc') || 'Monodoxia Academy cəmiyyətindəki cari statusunuz və əlavə imkanlar'}
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/60 border border-amber-300/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] uppercase font-bold font-mono tracking-widest text-amber-800 block mb-1">{t('profile_current_status_label') || 'Cari Status'}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    {userTier || currentUser.tier || 'Free'} {t('profile_member_label') || 'Üzv'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 max-w-md leading-relaxed">
                    {getTierDescription(userTier || currentUser.tier)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    const el = document.getElementById('club');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 shrink-0 self-start sm:self-center cursor-pointer relative z-10"
                >
                  {t('profile_upgrade_plan_btn') || 'Paketi Yüksəlt'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: EXPERT PROFILE EDIT */}
          {activeTab === 'expert_profile' && (() => {
            const isAdm = currentUser?.role === 'Admin';
            const myCoachProfile = coachesList.find(
              c => (c.userId && String(c.userId) === String(currentUser?.id)) ||
                   (c.user_id && String(c.user_id) === String(currentUser?.id)) ||
                   (c.name && currentUser?.name && c.name.toLowerCase().trim() === currentUser?.name.toLowerCase().trim()) ||
                   (currentUser?.id === 'usr_1792923099303' && (c.id === 'coach-1792923105867' || (c.name && c.name.includes('Sədaqət')))) ||
                   (currentUser?.id === 'u-nargiz' && (c.id === 'coach-nargiz' || (c.name && c.name.includes('Nərgiz'))))
            ) || (isAdm ? (coachesList[0] || null) : null);
            if (!myCoachProfile && !isAdm) return null;

            // Incoming booking requests for this coach (or all for Admin)
            const coachIncomingBookings = (bookings || []).filter(b => {
              if (isAdm) return true;
              const matchId = (b.coachId && b.coachId === myCoachProfile.id) || (b.coach_id && b.coach_id === myCoachProfile.id);
              const matchName = b.coachName && myCoachProfile.name && (
                b.coachName.toLowerCase().trim() === myCoachProfile.name.toLowerCase().trim() ||
                b.coachName.toLowerCase().includes(myCoachProfile.name.toLowerCase().trim()) ||
                myCoachProfile.name.toLowerCase().includes(b.coachName.toLowerCase().trim())
              );
              return matchId || matchName;
            });

            const handleAddNewScheduleSlot = (e) => {
              e?.preventDefault();
              if (!newSlotStart || !newSlotEnd) {
                showToast('Başlama və bitmə saatını seçin', 'error');
                return;
              }
              const formattedDate = newSlotDate ? newSlotDate.split('-').reverse().join('.') : '';
              const label = `${formattedDate ? formattedDate + ' ' : ''}${newSlotStart} - ${newSlotEnd}`.trim();
              
              const newEntry = {
                id: 'slot-' + Date.now(),
                date: newSlotDate,
                startTime: newSlotStart,
                endTime: newSlotEnd,
                label,
                isBooked: newSlotStatus === 'Dolu',
                note: newSlotNote.trim()
              };

              setExpertSchedule(prev => [...prev, newEntry]);
              setNewSlotNote('');
              showToast(`${label} (${newSlotStatus === 'Dolu' ? 'Dolu / Rezerv' : 'Mövcud / Boş'}) əlavə edildi`, 'success');
            };

            const handleToggleSlotStatus = (slotId) => {
              setExpertSchedule(prev => prev.map(s => {
                if (s.id === slotId) {
                  return { ...s, isBooked: !s.isBooked };
                }
                return s;
              }));
            };

            const handleRemoveScheduleSlot = (slotId) => {
              setExpertSchedule(prev => prev.filter(s => s.id !== slotId));
            };

            const handleSaveExpertProfile = (e) => {
              e.preventDefault();
              const specsArr = expertSpecialties
                .split(',')
                .map(s => s.trim())
                .filter(Boolean);

              // Quick available slots: only non-booked slots
              const availableList = expertSchedule
                .filter(s => !s.isBooked)
                .map(s => s.label);

              const bookedList = expertSchedule
                .filter(s => s.isBooked)
                .map(s => ({
                  id: s.id,
                  slot: s.label,
                  date: s.date,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  note: s.note,
                  isBooked: true
                }));

              updateCoach(myCoachProfile.id, {
                bio: expertBio.trim(),
                experience: expertBio.trim(),
                specialties: specsArr,
                scheduleSlots: expertSchedule,
                bookedSlots: bookedList,
                availableSlots: availableList.length > 0 ? availableList : expertSlots,
                image: expertImage || myCoachProfile.image || ''
              });
              setExpertProfileSaved(true);
              setTimeout(() => setExpertProfileSaved(false), 3000);
            };

            return (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                    <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                    {t('profile_expert_title') || 'Ekspert Profil və Cədvəl İdarəetməsi'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t('profile_expert_desc') || 'Metodologiyanız, ixtisaslarınız, təqviminiz və saytdan gələn seans müraciətləri'}
                  </p>
                </div>

                {expertProfileSaved && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    {t('profile_expert_saved') || 'Ekspert profil məlumatlarınız və təqvim saatlarınız uğurla yadda saxlanıldı!'}
                  </div>
                )}

                {/* 1. SECTION: GƏLƏN REZERVASIYA MÜRACİƏTLƏRİ (SAYTDAN GƏLƏNLƏR) */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[17px] text-amber-600">inbox</span>
                        {t('profile_incoming_bookings_title') || 'Saytdan Gələn Rezervasiya Müraciətləri'} ({coachIncomingBookings.length})
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t('profile_incoming_bookings_hint') || 'Müraciəti "Qəbul Et" kliklədikdə həmin saat avtomatik olaraq təqvimdə DOLU / REZERV OLUNMUŞ kimi qeyd edilir.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => refreshBookings && refreshBookings()}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-semibold hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
                      title={t('common_refresh') || 'Rezervasiyaları yenilə'}
                    >
                      <span className="material-symbols-outlined text-[15px]">refresh</span>
                      <span>{t('common_refresh') || 'Yenilə'}</span>
                    </button>
                  </div>

                  {coachIncomingBookings.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                      {t('profile_no_incoming_bookings') || 'Hələlik saytdan daxil olan seans müraciəti yoxdur.'}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {coachIncomingBookings.map(b => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">{b.userName || b.user_name || (t('profile_booking_user_fallback') || 'İstifadəçi')}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                b.status === 'Təsdiqləndi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                b.status === 'Ləğv edildi' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                                'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {getBookingStatusText(b.status)}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">#{b.id}</span>
                            </div>

                            <div className="text-xs text-slate-700 flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[13px]">schedule</span>
                                {b.slot || `${b.selectedDate || ''} ${b.startTime || ''}-${b.endTime || ''}`}
                              </span>
                              <span className="text-slate-500">• {getBookingFormatText(b.format)}</span>
                              {b.userEmail && <span className="text-slate-400 font-mono text-[11px]">({b.userEmail})</span>}
                              {b.userPhone && <span className="text-slate-600 text-[11px] font-medium">Tel: {b.userPhone}</span>}
                              {b.userAddress && <span className="text-slate-600 text-[11px] font-medium">{t('profile_field_address') || 'Ünvan'}: {b.userAddress}</span>}
                              {b.isGuest && <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-semibold">{t('guest_label') || 'Qonaq'}</span>}
                            </div>

                            {b.notes && (
                              <p className="text-[11px] text-slate-600 italic bg-white p-1.5 rounded border border-slate-200/80 mt-1">
                                "{b.notes}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {b.status !== 'Təsdiqləndi' && (
                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                  <label className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{t('booking_end_time_label') || 'Bitiş saatı:'}</label>
                                  <input
                                    type="time"
                                    value={bookingEndTimes[b.id] || b.endTime || (b.startTime ? (() => { const [h,m] = (b.startTime||'00:00').split(':').map(Number); return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`; })() : '15:00')}
                                    onChange={e => setBookingEndTimes(prev => ({ ...prev, [b.id]: e.target.value }))}
                                    className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    title="Seans bitiş saatını təyin edin"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => updateBookingStatus(b.id, 'Təsdiqləndi', { endTime: bookingEndTimes[b.id] || b.endTime || (b.startTime ? (() => { const [h,m] = (b.startTime||'00:00').split(':').map(Number); return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`; })() : '') })}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                                  title="Rezervasiyanı qəbul et və bitiş saatını təsdiqlə"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  <span>{t('booking_accept_btn') || 'Qəbul Et & Rezervlə'}</span>
                                </button>
                              </div>
                            )}
                            {b.status === 'Təsdiqləndi' && (
                              <div className="flex items-center gap-1.5">
                                <label className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{t('booking_end_time_label') || 'Bitiş saatı:'}</label>
                                <input
                                  type="time"
                                  defaultValue={b.endTime || ''}
                                  onChange={e => setBookingEndTimes(prev => ({ ...prev, [b.id]: e.target.value }))}
                                  className="px-2 py-1 rounded-lg border border-amber-300 text-xs bg-amber-50 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => { const t = bookingEndTimes[b.id]; if (t) updateBookingEndTime(b.id, t); }}
                                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[14px]">update</span>
                                  <span>{t('common_refresh') || 'Yenilə'}</span>
                                </button>
                              </div>
                            )}
                            {b.status !== 'Ləğv edildi' && (
                              <button
                                type="button"
                                onClick={() => updateBookingStatus(b.id, 'Ləğv edildi')}
                                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                title="Ləğv et və saatı boşalt"
                              >
                                <span className="material-symbols-outlined text-[15px]">close</span>
                                <span>{t('common_cancel') || 'Ləğv Et'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveExpertProfile} className="space-y-5">
                  {/* 2. SECTION: TƏQVİM VƏ DOLU / BOŞ SAATLARIN QEYDİ */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[17px] text-amber-600">calendar_month</span>
                          {t('profile_schedule_title') || 'Təqvim: Dolu / Rezerv Olunmuş və Mövcud Saatlar'}
                        </label>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {t('profile_schedule_desc') || 'Tarix və saat aralığını (neçədən neçəyə) seçərək Dolu / Rezerv və ya Mövcud / Boş kimi qeyd edin. Dolu olan saatlar müştərilərə deaktiv görünür, digərləri rezerv edilə bilir.'}
                        </p>
                      </div>
                    </div>

                    {/* New Slot Creator Form */}
                    <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-amber-700">calendar_today</span>
                            {t('schedule_date') || 'Tarix'}
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={newSlotDate}
                            onChange={e => setNewSlotDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {t('schedule_start_time') || 'Başlama Saatı'}
                          </label>
                          <input
                            type="time"
                            value={newSlotStart}
                            onChange={e => setNewSlotStart(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {t('schedule_end_time') || 'Bitmə Saatı'}
                          </label>
                          <input
                            type="time"
                            value={newSlotEnd}
                            onChange={e => setNewSlotEnd(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {t('schedule_slot_status') || 'Saat Vəziyyəti'}
                          </label>
                          <select
                            value={newSlotStatus}
                            onChange={e => setNewSlotStatus(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="Dolu">{t('schedule_status_booked') || '🔴 Dolu / Rezerv edilib'}</option>
                            <option value="Mövcud">{t('schedule_status_available') || '🟢 Mövcud / Boşdur'}</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={newSlotNote}
                          onChange={e => setNewSlotNote(e.target.value)}
                          placeholder={t('schedule_note_placeholder') || 'Qeyd (məs: Şəxsi görüş, Fərdi seans və s. - istəyə bağlı)'}
                          className="flex-1 w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewScheduleSlot}
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors shrink-0"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_circle</span>
                          <span>{t('schedule_add_slot_btn') || '+ Saat Aralığını Əlavə Et'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Schedule Slots List */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                        <span>{t('schedule_recorded_slots') || 'Cədvəldə Qeyd Edilən Saatlar'} ({expertSchedule.length})</span>
                        <span className="text-[10px] font-normal lowercase">
                          {expertSchedule.filter(s => s.isBooked).length} {t('schedule_booked_count') || 'dolu'}, {expertSchedule.filter(s => !s.isBooked).length} {t('schedule_available_count') || 'boş'}
                        </span>
                      </div>

                      {expertSchedule.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                          {t('schedule_no_slots') || 'Hələlik cədvələ heç bir saat aralığı əlavə edilməyib. Yuxarıdakı form vasitəsilə dolu və ya boş vaxtlarınızı qeyd edin.'}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {expertSchedule.map(s => (
                            <div
                              key={s.id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                                s.isBooked
                                  ? 'bg-rose-50/70 border-rose-200 text-slate-800'
                                  : 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs">{s.label}</span>
                                  <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    s.isBooked
                                      ? 'bg-rose-200 text-rose-900 border border-rose-300'
                                      : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                                  }`}>
                                    {s.isBooked ? (t('schedule_booked_badge') || 'Dolu / Rezerv') : (t('schedule_available_badge') || 'Mövcud')}
                                  </span>
                                </div>
                                {(s.note || s.clientName) && (
                                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                    {s.clientName && <span className="font-semibold text-slate-700">{s.clientName} · </span>}
                                    {s.note}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSlotStatus(s.id)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                    s.isBooked
                                      ? 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300'
                                  }`}
                                  title="Vəziyyəti dəyiş"
                                >
                                  {s.isBooked ? (t('schedule_toggle_free') || 'Boş et') : (t('schedule_toggle_busy') || 'Dolu et')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveScheduleSlot(s.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                                  title={t('common_remove') || 'Sil'}
                                >
                                  <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. SECTION: PROFİL ŞƏKLİ */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">photo_camera</span>
                      {t('profile_image_title') || 'Profil Şəkli'}
                    </label>
                    <p className="text-[11px] text-slate-400">{t('profile_image_desc') || 'URL daxil edin və ya fayl yükləyin. Şəkil ekspert kartında görünəcək.'}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Preview */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-200 bg-amber-50 flex items-center justify-center shrink-0">
                        {expertImage ? (
                          <img src={expertImage} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-[32px] text-amber-300">person</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <input
                          type="text"
                          value={expertImage}
                          onChange={e => setExpertImage(e.target.value)}
                          placeholder={t('profile_image_url_ph') || 'https://... şəkil URL-i'}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer transition-colors">
                          <span className="material-symbols-outlined text-[15px]">upload</span>
                          <span>{t('common_upload_file') || 'Fayl Yüklə'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 10 * 1024 * 1024) { showToast('Şəkil 10MB-dan böyük ola bilməz', 'error'); return; }
                              try {
                                const formData = new FormData();
                                formData.append('image', file);
                                const res = await fetch('/api.php?action=upload_image&prefix=coach', {
                                  method: 'POST',
                                  body: formData,
                                  credentials: 'include'
                                });
                                const resData = await res.json().catch(() => null);
                                if (resData && resData.status === 'success' && resData.url) {
                                  setExpertImage(resData.url);
                                  showToast('Şəkil serverdə (MySQL) saxlanıldı!', 'success');
                                  return;
                                }
                              } catch (err) {}
                              const reader = new FileReader();
                              reader.onload = ev => {
                                setExpertImage(ev.target.result);
                                showToast('Şəkil seçildi', 'info');
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {expertImage && (
                          <button type="button" onClick={() => setExpertImage('')} className="text-[11px] text-rose-500 hover:text-rose-700 underline cursor-pointer">
                            {t('common_remove_image') || 'Şəkli sil'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4. SECTION: METODOLOGİYA VƏ TƏCRÜBƏ */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px] text-amber-600">psychology</span>
                        {t('coach_methodology_title') || 'Metodologiya və Təcrübə (Haqqında Mətni)'}
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">{t('coach_methodology_desc') || 'Profilinizin əsas haqqında mətni. Müştərilərin ilk gördüyü məlumatdır.'}</p>
                      <textarea
                        rows={4}
                        value={expertBio}
                        onChange={e => setExpertBio(e.target.value)}
                        placeholder={t('coach_methodology_ph') || 'Özünüz, metodologiyanız, təhsiliniz və təcrübəniz barədə yazın...'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* 4. SECTION: İXTİSASLAŞDIĞI SAHƏLƏR */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">category</span>
                      {t('coach_specialties_title') || 'İxtisaslaşdığı Sahələr'}
                    </label>
                    <p className="text-[11px] text-slate-400">{t('coach_specialties_desc') || 'Vergüllə ayırın. Məs: Fərdi İnkişaf, Psixologiya, Liderlik'}</p>
                    <input
                      type="text"
                      value={expertSpecialties}
                      onChange={e => setExpertSpecialties(e.target.value)}
                      placeholder={t('coach_specialties_ph') || 'Fərdi İnkişaf, Psixologiya, Liderlik'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                    {expertSpecialties && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {expertSpecialties.split(',').map(s => s.trim()).filter(Boolean).map((sp, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium">{sp}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>{t('common_save_all_changes') || 'Bütün Dəyişiklikləri Yadda Saxla'}</span>
                    </button>
                  </div>
                </form>
              </div>
            );
          })()}

          {/* TAB: CERTIFICATES */}
          {activeTab === 'certificates' && (() => {
            const myCerts = certificatesList.filter(
              c => String(c.userId) === String(currentUser?.id) && c.status !== 'Silindi'
            );
            const BASE_URL = window.location.origin;
            const handleView = (cert) => { setActiveCertView(cert); setCertViewModalOpen(true); };
            const handleCopyLink = (cert) => {
              const url = `${BASE_URL}/#/certificates/verify/${cert.publicId}`;
              navigator.clipboard.writeText(url).then(() => showToast('Link kopyalandı!', 'success'));
            };

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 font-mono">
                    <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                    {t('profile_my_certificates') || 'Sertifikatlarım'}
                  </h4>
                  <span className="text-[11px] text-slate-500">{myCerts.length} {t('cert_unit_count') || 'sertifikat'}</span>
                </div>

                {myCerts.length === 0 ? (
                  <div className="p-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-[48px] text-amber-200">workspace_premium</span>
                    <p className="text-xs text-slate-500 text-center">{t('profile_no_certs_title') || 'Hələ sertifikatınız yoxdur.'}<br />{t('profile_no_certs_desc') || 'Kursları tamamladıqca sertifikatlarınız burada görünəcək.'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {myCerts.map(cert => {
                      const verifyUrl = cert.publicId ? `${BASE_URL}/#/certificates/verify/${cert.publicId}` : '';
                      const isRevoked = cert.status === 'İptal Edilmiş';
                      return (
                        <div key={cert.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                          {/* Mini cert preview card */}
                          <div className="flex items-start gap-4">
                            {/* Gold icon */}
                            <div className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a192f, #112240)' }}>
                              <span className="material-symbols-outlined text-[28px]" style={{ color: '#d4af37' }}>workspace_premium</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[11px] font-bold text-amber-700">{cert.number}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${ isRevoked ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300' }`}>
                                  {isRevoked ? 'İptal Edilmiş' : '✓ Etibarlı'}
                                </span>
                              </div>
                              <div className="font-serif text-sm font-bold text-slate-900 mt-1 truncate">
                                {cert.fields?.courseName || '—'}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {cert.fields?.dateValue || cert.issuedAt || '—'}
                                {cert.fields?.durationValue && <> · {cert.fields.durationValue}</>}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          {!isRevoked && (
                            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                              <button
                                onClick={() => handleView(cert)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                                {t('cert_view_download') || 'Bax / Yüklə'}
                              </button>
                              {verifyUrl && (
                                <button
                                  onClick={() => handleCopyLink(cert)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">link</span>
                                  {t('cert_copy_link') || 'Link Kopyala'}
                                </button>
                              )}
                              {verifyUrl && (
                                <a
                                  href={verifyUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                                  {t('cert_verify_action') || 'Doğrula'}
                                </a>
                              )}
                            </div>
                          )}
                          {isRevoked && (
                            <div className="mt-3 pt-3 border-t border-red-100 text-[11px] text-red-600">
                              ⚠ Bu sertifikat ləğv edilmişdir{cert.revokedReason ? `: ${cert.revokedReason}` : '.'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Coach Section: My Professional & External Certificates */}
                {(() => {
                  const myCoachProfile = coachesList.find(
                    c => (c.userId && String(c.userId) === String(currentUser?.id)) ||
                         (c.user_id && String(c.user_id) === String(currentUser?.id)) ||
                         (c.name && currentUser?.name && c.name.toLowerCase().trim() === currentUser?.name.toLowerCase().trim()) ||
                         (currentUser?.id === 'usr_1792923099303' && (c.id === 'coach-1792923105867' || (c.name && c.name.includes('Sədaqət')))) ||
                         (currentUser?.id === 'u-nargiz' && (c.id === 'coach-nargiz' || (c.name && c.name.includes('Nərgiz'))))
                  );
                  if (!myCoachProfile && currentUser?.role !== 'Kouç' && currentUser?.role !== 'Admin') return null;

                  const coachId = myCoachProfile ? myCoachProfile.id : 'coach-nargiz';
                  const myCustomCerts = myCoachProfile?.customCertificates || [];

                  const handleSaveCoachCert = (e) => {
                    e.preventDefault();
                    if (!coachCertTitle.trim() || !coachCertIssuer.trim()) return;
                    addCoachCertificate(coachId, {
                      title: coachCertTitle.trim(),
                      issuer: coachCertIssuer.trim(),
                      issueDate: coachCertYear.trim(),
                      credentialId: coachCertId.trim(),
                      credentialUrl: coachCertUrl.trim()
                    });
                    setCoachCertTitle('');
                    setCoachCertIssuer('');
                    setCoachCertYear(new Date().getFullYear().toString());
                    setCoachCertId('');
                    setCoachCertUrl('');
                    setShowCoachCertForm(false);
                  };

                  return (
                    <div className="pt-6 border-t border-slate-200 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 font-mono">
                            <span className="material-symbols-outlined text-[16px] text-amber-600">verified</span>
                            {t('profile_expert_certs_heading') || 'Ekspert Sertifikatlarım'} ({myCustomCerts.length})
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {t('profile_expert_certs_subdesc') || 'Profilinizdə və ekspert kartınızda görünəcək peşəkar akkreditasiyalarınız'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCoachCertForm(!showCoachCertForm)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] hover:text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {showCoachCertForm ? 'close' : 'add'}
                          </span>
                          <span>{showCoachCertForm ? (t('common_close') || 'Bağla') : (t('profile_add_cert_btn') || '+ Sertifikat Əlavə Et')}</span>
                        </button>
                      </div>

                      {showCoachCertForm && (
                        <form onSubmit={handleSaveCoachCert} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 animate-fadeIn">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                {t('cert_field_name_req') || 'Sertifikatın Adı *'}
                              </label>
                              <input
                                type="text"
                                required
                                value={coachCertTitle}
                                onChange={(e) => setCoachCertTitle(e.target.value)}
                                placeholder="Məs: ICF ACC / EMCC Kouç Sertifikatı"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                {t('cert_field_issuer_req') || 'Təşkilat / İnstitut *'}
                              </label>
                              <input
                                type="text"
                                required
                                value={coachCertIssuer}
                                onChange={(e) => setCoachCertIssuer(e.target.value)}
                                placeholder="Məs: International Coaching Federation"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                {t('cert_field_date') || 'Verilmə Tarixi / İli'}
                              </label>
                              <input
                                type="text"
                                value={coachCertYear}
                                onChange={(e) => setCoachCertYear(e.target.value)}
                                placeholder="2024"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                {t('cert_field_id') || 'Qeydiyyat Nömrəsi (ID)'}
                              </label>
                              <input
                                type="text"
                                value={coachCertId}
                                onChange={(e) => setCoachCertId(e.target.value)}
                                placeholder="Məs: ID-77881"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                {t('cert_field_url') || 'Onlayn Təsdiq Linki'}
                              </label>
                              <input
                                type="url"
                                value={coachCertUrl}
                                onChange={(e) => setCoachCertUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowCoachCertForm(false)}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/60 rounded-lg cursor-pointer"
                            >
                              {t('common_cancel') || 'Ləğv et'}
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm cursor-pointer"
                            >
                              {t('common_save') || 'Yadda Saxla'}
                            </button>
                          </div>
                        </form>
                      )}

                      {myCustomCerts.length === 0 ? (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                          {t('profile_no_custom_certs_desc') || 'Hələlik peşəkar sertifikat əlavə edilməyib.'}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {myCustomCerts.map(cc => (
                            <div key={cc.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{cc.issuer}</div>
                                <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{cc.title}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{cc.issueDate} {cc.credentialId && `· ID: ${cc.credentialId}`}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteCoachCertificate(coachId, cc.id)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                                title="Sil"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

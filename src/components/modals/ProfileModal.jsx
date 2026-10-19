import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APPLICATION_STATUSES, TARGET_TYPE_MAP, INITIAL_FORM_FIELDS } from '../../data/applicationData';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalized } from '../../i18n/localize';

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
    showToast
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

  if (!profileModalOpen || !currentUser) return null;

  const myApplications = (applicationsList || []).filter(a => String(a.userId) === String(currentUser?.id) && !a.archived);
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
    fld_exp: { az: 'Təcrübə / Hazırlıq Səviyyəniz', en: 'Experience / Preparation Level', tr: 'Deneyim / Hazırlık Seviyeniz', ru: 'Опыт / Уровень Подготовки' },
    fld_goal: { az: 'Müraciət Məqsədi və Gözləntiləriniz', en: 'Application Purpose & Expectations', tr: 'Başvuru Amacı ve Beklentileriniz', ru: 'Цель Заявки и Ожидания' },
    fld_prof: { az: 'Peşəniz və Hazırkı Fəaliyyət Sahəniz', en: 'Profession & Current Field', tr: 'Mesleğiniz ve Mevcut Faaliyet Alanınız', ru: 'Профессия и Сфера Деятельности' },
    fld_file: { az: 'CV / Rezüme və ya Sənəd Linki', en: 'CV / Resume or Document Link', tr: 'CV / Özgeçmiş veya Belge Bağlantısı', ru: 'CV / Резюме или Ссылка на Документ' },
    fld_telegram: { az: 'Telegram İstifadəçi Adınız (@username)', en: 'Telegram Username (@username)', tr: 'Telegram Kullanıcı Adınız (@username)', ru: 'Имя Пользователя Telegram (@username)' },
    fld_source: { az: 'Tədbir haqqında haradan eşitmisiniz?', en: 'Where did you hear about the event?', tr: 'Etkinliği nereden duydunuz?', ru: 'Откуда вы узнали о мероприятии?' }
  };

  const getFieldLabel = (fieldKey) => {
    // 1. Check formFieldsList from AppContext
    const foundInList = (formFieldsList || []).find(f => f.id === fieldKey || f.key === fieldKey);
    if (foundInList) {
      return getLocalized(foundInList, 'label', currentLang, defaultLang, foundInList.label || fieldKey);
    }
    // 2. Check INITIAL_FORM_FIELDS
    const foundInInitial = (INITIAL_FORM_FIELDS || []).find(f => f.id === fieldKey || f.key === fieldKey);
    if (foundInInitial) {
      return getLocalized(foundInInitial, 'label', currentLang, defaultLang, foundInInitial.label || fieldKey);
    }
    // 3. Fallback dictionary
    if (fallbackFieldDict[fieldKey]) {
      const dict = fallbackFieldDict[fieldKey];
      return dict[currentLang] || dict[defaultLang] || dict.az || fieldKey;
    }
    // 4. Clean up raw keys like fld_1792261416101 or underscores
    return fieldKey.replace(/^fld_/, '').replace(/_/g, ' ');
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Şəkil ölçüsü 5MB-dan çox ola bilməz', 'error');
      return;
    }
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordStatus({ type: 'error', text: 'Cari şifrənizi daxil edin!' });
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'Yeni şifrə ən azı 8 simvoldan ibarət olmalıdır!' });
      return;
    }
    if (!/[A-Za-z]/.test(passwordForm.newPassword) || !/[0-9]/.test(passwordForm.newPassword)) {
      setPasswordStatus({ type: 'error', text: 'Yeni şifrədə ən azı bir hərf və bir rəqəm olmalıdır!' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'Təkrar şifrə uyğun gəlmir!' });
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
        setPasswordStatus({ type: 'success', text: 'Şifrəniz bazada təhlükəsiz şəkildə yeniləndi!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Şifrə uğurla dəyişdirildi', 'success');
      } else {
        setPasswordStatus({ type: 'error', text: data.message || 'Cari şifrə yanlışdır və ya xəta baş verdi!' });
      }
    } catch (err) {
      updateCurrentUser({ password: passwordForm.newPassword });
      setPasswordStatus({ type: 'success', text: 'Şifrəniz yerli profildə yeniləndi!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Şifrə yeniləndi', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto backdrop-blur-md bg-slate-950/70">
      <div className="bg-[#0b1324] text-slate-100 rounded-3xl border border-amber-500/25 shadow-[0_25px_70px_rgba(0,0,0,0.65)] max-w-3xl w-full my-auto overflow-hidden animate-fadeIn relative flex flex-col max-h-[92vh]">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none" />

        {/* Header with User Summary & Tabs */}
        <div className="p-5 sm:p-7 border-b border-white/10 bg-slate-900/60 backdrop-blur-sm shrink-0 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* AVATAR WITH QUICK UPLOAD */}
              <div className="relative group shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/10 to-slate-900 flex items-center justify-center shadow-lg shadow-black/40">
                  {profileForm.avatar || currentUser.avatar || currentUser.image ? (
                    <img
                      src={profileForm.avatar || currentUser.avatar || currentUser.image}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-500/15 text-amber-300 flex items-center justify-center font-serif font-bold text-2xl uppercase">
                      {currentUser.firstName ? currentUser.firstName[0] : (currentUser.name ? currentUser.name[0] : 'U')}
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 rounded-2xl bg-black/60 text-amber-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5">Dəyiş</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg sm:text-2xl text-white font-semibold leading-tight">
                    {currentUser.firstName || currentUser.name} {currentUser.lastName || ''}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-wide uppercase">
                    {userTier || currentUser.tier || 'Free'} Rezident
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                    {currentUser.role || 'Tələbə'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 block mt-1 font-mono">{currentUser.email}</span>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <span className="text-amber-400/70">#</span>ID: {currentUser.id}
                  </span>
                  {currentUser.joinedDate && <span className="text-slate-500">• Qeydiyyat: {currentUser.joinedDate}</span>}
                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={() => { setProfileModalOpen(false); setAdminModalOpen(true); }}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1 shadow-md shadow-amber-500/20"
                    >
                      <span className="material-symbols-outlined text-[12px]">admin_panel_settings</span>
                      <span>İdarəetmə Paneli</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setProfileModalOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
              title="Bağla"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-6 border-b border-white/10 -mb-5 sm:-mb-7 overflow-x-auto pb-0 text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'profile'
                  ? 'border-amber-400 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.25)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">account_circle</span>
              <span>Profil Məlumatlarım</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'security'
                  ? 'border-amber-400 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.25)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">lock_reset</span>
              <span>Təhlükəsizlik & Şifrə</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'applications'
                  ? 'border-amber-400 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.25)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">assignment</span>
              <span>Müraciətlər & Qeydiyyat</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white/10 text-amber-300 border border-amber-500/20">
                {myApplications.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('notifications');
                markNotificationRead('all');
              }}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs relative ${
                activeTab === 'notifications'
                  ? 'border-amber-400 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.25)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">notifications</span>
              <span>Bildirişlər</span>
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
                  ? 'border-amber-400 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.25)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">workspace_premium</span>
              <span>Tədris & Kouçinq</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`pb-3.5 px-3.5 font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap text-xs ${
                activeTab === 'membership'
                  ? 'border-amber-400 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.25)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">card_membership</span>
              <span>Rezidentlik (Paket)</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 text-sm bg-gradient-to-b from-[#0b1324] to-[#080d1a]">
          {/* TAB 1: PROFILE INFO & EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">badge</span>
                    Şəxsi Profil Məlumatları
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hesab rekvizitlərinizi və ictimai profilinizi tənzimləyin
                  </p>
                </div>
                {!editingProfile ? (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Profili Redaktə Et</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Ləğv Et
                  </button>
                )}
              </div>

              {/* AVATAR SELECTOR / UPLOAD IN VIEW & EDIT */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-slate-900 flex items-center justify-center shrink-0 shadow-md">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif font-bold text-2xl text-amber-300">
                      {profileForm.firstName ? profileForm.firstName[0] : 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="font-semibold text-white text-xs">Profil Şəkli / Avatar</div>
                  <p className="text-[11px] text-slate-400">
                    JPG, PNG və ya WebM formatında maksimum 5MB fayl yükləyə bilərsiniz.
                  </p>
                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <label className="cursor-pointer px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-all">
                      <span className="material-symbols-outlined text-[15px]">upload</span>
                      <span>Yeni Şəkil Yüklə</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                    {profileForm.avatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileForm(p => ({ ...p, avatar: '' }));
                          updateCurrentUser({ avatar: '', image: '' });
                        }}
                        className="text-rose-400 hover:text-rose-300 text-xs font-semibold px-2 py-1 transition-colors"
                      >
                        Şəkli Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Ad *</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Soyad</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">E-poçt Ünvanı *</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon / WhatsApp</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+994 50 123 45 67"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Ölkə</label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Şəhər</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Haqqında / Bio</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Özünüz haqqında qısa məlumat, peşə və maraq sahələriniz..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profili</label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/in/..."
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram Profili</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/..."
                        value={profileForm.instagram}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, instagram: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      İmtina
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Yadda Saxla</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-500/20 transition-colors">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Tam Ad</span>
                      <strong className="text-white text-sm sm:text-base font-serif font-semibold">
                        {currentUser.firstName} {currentUser.lastName}
                      </strong>
                    </div>
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-500/20 transition-colors">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">E-poçt</span>
                      <strong className="text-white font-mono">{currentUser.email}</strong>
                    </div>
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-500/20 transition-colors">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Telefon / WhatsApp</span>
                      <strong className="text-white">{currentUser.phone || '+994 (qeyd edilməyib)'}</strong>
                    </div>
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-500/20 transition-colors">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Məkan</span>
                      <strong className="text-white">{currentUser.city || 'Bakı'}, {currentUser.country || 'Azərbaycan'}</strong>
                    </div>
                  </div>

                  {currentUser.bio && (
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] text-xs">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1.5">Haqqında / Bio</span>
                      <p className="text-slate-300 leading-relaxed">{currentUser.bio}</p>
                    </div>
                  )}

                  {(currentUser.linkedin || currentUser.instagram) && (
                    <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] text-xs flex items-center gap-4 flex-wrap">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Sosial Profillər:</span>
                      {currentUser.linkedin && (
                        <a href={currentUser.linkedin} target="_blank" rel="noreferrer" className="text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[15px]">link</span>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {currentUser.instagram && (
                        <a href={currentUser.instagram} target="_blank" rel="noreferrer" className="text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs flex-wrap gap-2">
                <span className="text-slate-400 font-mono">Platforma İstifadəçi ID: #{currentUser.id}</span>
                <button
                  onClick={() => {
                    setProfileModalOpen(false);
                    setOnboardingOpen(true);
                  }}
                  className="text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Fərdi İnkişaf Xəritəsini Yenilə</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">security</span>
                  Hesab Təhlükəsizliyi və Şifrə Yeniləmə
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Hesabınızın təhlükəsizliyini təmin etmək üçün mütəmadi olaraq şifrənizi yeniləyin
                </p>
              </div>

              {passwordStatus && (
                <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                  passwordStatus.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {passwordStatus.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{passwordStatus.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cari Şifrə (Köhnə)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Yeni Şifrə (Minimum 8 simvol, hərf və rəqəm) *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Yeni Şifrə Təkrarı *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-slate-900/80 text-white text-xs focus:outline-none focus:border-amber-400/60 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    <span>Şifrəni Yenilə</span>
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Hesab Təhlükəsizlik Statusu: Aktiv & Qorunur</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Hesabınız 256-bit SSL şifrələməsi və qorunan sessiya protokolu ilə təmin olunmuşdur. Şübhəli daxilolma cəhdləri qeydə alındıqda dərhal e-poçt bildirişi alacaqsınız.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATIONS & REGISTRATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                  Bütün Müraciət və Qeydiyyat Tarixçəsi
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kurslar, klublar, tədbirlər və icma üçün göndərdiyiniz müraciətlərin aktual vəziyyəti
                </p>
              </div>

              {myApplications.length === 0 ? (
                <div className="text-center py-14 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <span className="material-symbols-outlined text-[44px] text-slate-500 mb-2">inbox</span>
                  <p className="text-xs text-slate-300">Hələ heç bir müraciətiniz yoxdur.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Kurs və ya tədbir seçərək qeydiyyatdan keçə bilərsiniz.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {myApplications.map(app => {
                    const statusObj = APPLICATION_STATUSES.find(s => s.id === app.status) || {
                      badgeClass: 'bg-slate-800 text-slate-200 border-slate-700'
                    };
                    const typeObj = TARGET_TYPE_MAP[app.targetType] || {
                      label: 'Proqram',
                      icon: 'assignment',
                      color: 'text-amber-400'
                    };
                    const isExpanded = expandedAppId === app.id;
                    const canCancel = ['Yeni', 'Baxılır', 'Gözləmədə'].includes(app.status);

                    return (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 transition-all hover:border-amber-500/30 hover:bg-white/[0.04] shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[20px]">{typeObj.icon}</span>
                            </span>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-amber-400/90">
                                  #{app.id} • {typeObj.label}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {app.appliedAt}
                                </span>
                              </div>
                              <h5 className="font-serif font-semibold text-white text-sm sm:text-base leading-snug mt-0.5">
                                {app.targetTitle}
                              </h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
                              app.status === 'Təsdiqləndi' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                              app.status === 'Ləğv edildi' ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                              'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        <div className={`grid gap-2.5 pt-3.5 text-xs text-slate-300 ${app.targetType === 'community' || app.targetType === 'forum' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                          {app.targetType !== 'community' && app.targetType !== 'forum' && (
                            <div>
                              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">Məbləğ</span>
                              <span className="font-semibold text-amber-300 font-mono">{app.price || 'Pulsuz'}</span>
                            </div>
                          )}
                          {app.targetType === 'community' || app.targetType === 'forum' ? (
                            <>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">Önə Çıxarma</span>
                                <span className={`font-semibold flex items-center gap-1 ${(app.isPinned ?? app.pinned) ? 'text-amber-400' : 'text-slate-400'}`}>
                                  <span className="material-symbols-outlined text-[13px]">
                                    {(app.isPinned ?? app.pinned) ? 'push_pin' : 'remove'}
                                  </span>
                                  <span>{(app.isPinned ?? app.pinned) ? 'Önə Çıxarılıb' : 'Standart'}</span>
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">Rəy İcazəsi</span>
                                <span className={`font-semibold flex items-center gap-1 ${app.allowComments === false ? 'text-rose-400' : 'text-emerald-400'}`}>
                                  <span className="material-symbols-outlined text-[13px]">
                                    {app.allowComments === false ? 'lock' : 'chat'}
                                  </span>
                                  <span>{app.allowComments === false ? 'Bağlıdır' : 'Açıqdır'}</span>
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">Ödəniş Statusu</span>
                                <span className={`font-medium ${['Ödənildi', 'Ödənilib'].includes(app.paymentStatus) ? 'text-emerald-400 font-bold' : (['Qaytarıldı', 'İmtina edildi'].includes(app.paymentStatus) ? 'text-rose-400 font-bold' : 'text-slate-200')}`}>
                                  {app.paymentStatus}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">İştirak Statusu</span>
                                <span className={`font-medium ${['İştirak edəcək', 'İştirak etdi'].includes(app.attendanceStatus) ? 'text-emerald-400 font-bold' : (['İştirak etməyəcək', 'İştirak etmədi'].includes(app.attendanceStatus) ? 'text-rose-400 font-bold' : 'text-slate-200')}`}>
                                  {app.attendanceStatus}
                                </span>
                              </div>
                            </>
                          )}
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">Əlaqə</span>
                            <span className="font-mono text-slate-200">{app.userPhone || 'Qeyd olunmayıb'}</span>
                          </div>
                        </div>

                        {app.adminNote && (
                          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs">
                            <span className="font-bold text-amber-300 flex items-center gap-1 mb-0.5">
                              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                              Administrator Qeydi:
                            </span>
                            <p className="text-slate-200 italic">{app.adminNote}</p>
                          </div>
                        )}

                        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs flex-wrap gap-2">
                          <button
                            onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                            className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium transition-colors"
                          >
                            <span>{isExpanded ? 'Detalları gizlə' : 'Form detallarına bax'}</span>
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
                                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-bold flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-amber-500/20 transition-all"
                              >
                                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                                <span>Dərslərə Başla</span>
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
                                className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                <span>Müraciəti Ləğv Et</span>
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
                                className="text-slate-400 hover:text-rose-400 text-[11px] font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                                title="Müraciəti tarixçədən təmizlə"
                              >
                                <span className="material-symbols-outlined text-[13px]">delete</span>
                                <span>Sil</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3.5 p-4 rounded-xl bg-slate-900/80 border border-white/10 text-xs space-y-2.5 animate-fadeIn">
                            <span className="font-bold text-amber-300 block border-b border-white/10 pb-1.5 uppercase font-mono tracking-wider text-[11px]">
                              Təqdim Edilmiş Form Cavabları:
                            </span>
                            {app.userNote && (
                              <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                                <strong className="text-slate-400 block text-[11px]">Müraciətçinin qeydi:</strong>
                                <p className="text-slate-200 mt-0.5">{app.userNote}</p>
                              </div>
                            )}
                            {Object.entries(app.formResponses || {}).map(([key, val]) => (
                              <div key={key} className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                                <strong className="text-slate-400 block text-[11px] font-semibold mb-0.5">
                                  {getFieldLabel(key)}:
                                </strong>
                                <span className="text-white font-medium text-xs break-words">
                                  {String(val || '—')}
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">notifications</span>
                    Sistem Bildirişləri
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Müraciət statusları və təlim xəbərdarlıqları
                  </p>
                </div>
                {myNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearNotifications('all')}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                    <span>Təmizlə</span>
                  </button>
                )}
              </div>

              {myNotifications.length === 0 ? (
                <div className="text-center py-14 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                  <span className="material-symbols-outlined text-[44px] text-slate-500 mb-2">notifications_off</span>
                  <p className="text-xs text-slate-300">Hələ heç bir bildirişiniz yoxdur.</p>
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

                    const iconColor = notif.type === 'success' ? 'text-emerald-400' : (notif.type === 'error' ? 'text-rose-400' : (notif.type === 'warning' ? 'text-amber-400' : 'text-blue-400'));

                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead && markNotificationRead) markNotificationRead(notif.id);
                        }}
                        className={`p-4 rounded-2xl border text-xs flex items-start gap-3.5 transition-all ${
                          notif.isRead
                            ? 'bg-white/[0.02] border-white/5 text-slate-400'
                            : (isTopicNotif 
                                ? 'bg-amber-500/10 border-amber-500/30 text-white font-medium shadow-sm cursor-pointer' 
                                : 'bg-white/[0.05] border-amber-500/30 text-white font-medium shadow-sm cursor-pointer')
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[22px] ${iconColor} mt-0.5 shrink-0`}>
                          {icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-2 truncate">
                              {isTopicNotif && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider shrink-0 font-mono">
                                  İCMA
                                </span>
                              )}
                              <span className="font-bold text-white truncate">{notif.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-slate-500 font-mono">{notif.createdAt}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (deleteNotification) deleteNotification(notif.id);
                                  else clearNotifications(notif.id);
                                }}
                                className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-500/10"
                                title="Bildirişi sil"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed break-words">
                            {notif.message}
                          </p>
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  Tədris, Sertifikatlar & Kouçinq
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tamamlanmış kurslar və rezerv edilmiş kouçinq sessiyaları
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Qazanılmış Sertifikatlar</span>
                    <strong className="text-3xl font-serif text-white">{certificates.length}</strong>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                    <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Rezerv Olunmuş Sessiyalar</span>
                    <strong className="text-3xl font-serif text-white">{bookings.length}</strong>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-[28px]">event_available</span>
                  </div>
                </div>
              </div>

              {bookings.length > 0 && (
                <div className="mt-5">
                  <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono mb-3">Kouçinq Rezervasiyaları:</h5>
                  <div className="space-y-2.5">
                    {bookings.map(b => (
                      <div key={b.id} className="p-4 rounded-2xl border border-white/10 text-xs flex justify-between items-center bg-white/[0.02] hover:border-amber-500/20 transition-colors">
                        <div>
                          <strong className="text-white text-sm font-serif block">{b.coachName}</strong>
                          <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">{b.date} • {b.time}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                          Təsdiqləndi
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">card_membership</span>
                  Rezidentlik Səviyyəsi və Üzvlük
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Monodoxia Academy cəmiyyətindəki cari statusunuz və əlavə imkanlar
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#0d172a] to-amber-500/5 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] uppercase font-bold font-mono tracking-widest text-amber-400 block mb-1">Cari Status</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {userTier || currentUser.tier || 'Free'} Rezident
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 max-w-md leading-relaxed">
                    {userTier === 'VIP' ? 'Bütün qapalı klub tədbirlərinə, mentor sessiyalarına və VIP arxivinə tam limitsiz giriş.' :
                     userTier === 'Premium' ? 'Genişləndirilmiş tədris modulları və aylıq kouçinq sessiyalarında endirimlər.' :
                     userTier === 'Basic' ? 'Əsas dərslərə və ictimai icma müzakirələrinə sərbəst çıxış.' :
                     'Başlanğıc giriş səviyyəsi. Klub və təlimlərə qoşularaq dərəcənizi yüksəldə bilərsiniz.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    const el = document.getElementById('club');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 shrink-0 self-start sm:self-center cursor-pointer relative z-10"
                >
                  Paketi Yüksəlt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

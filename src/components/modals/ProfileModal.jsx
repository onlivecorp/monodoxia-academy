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
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-surface-bright rounded-2xl border border-outline-variant shadow-2xl max-w-3xl w-full my-auto overflow-hidden animate-fadeIn relative flex flex-col max-h-[92vh]">
        {/* Header with User Summary & Tabs */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/40 bg-surface-container/20 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* AVATAR WITH QUICK UPLOAD */}
              <div className="relative group shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary bg-surface-container flex items-center justify-center shadow-md">
                  {profileForm.avatar || currentUser.avatar || currentUser.image ? (
                    <img
                      src={profileForm.avatar || currentUser.avatar || currentUser.image}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-2xl uppercase">
                      {currentUser.firstName ? currentUser.firstName[0] : (currentUser.name ? currentUser.name[0] : 'U')}
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span className="text-[8px] font-bold">Dəyiş</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-headline-sm text-lg sm:text-xl font-serif text-primary leading-tight">
                    {currentUser.firstName || currentUser.name} {currentUser.lastName || ''}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/15 text-secondary border border-secondary/20">
                    {userTier || currentUser.tier || 'Free'} Rezident
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-primary">
                    {currentUser.role || 'Tələbə'}
                  </span>
                </div>
                <span className="text-xs text-outline block mt-0.5">{currentUser.email}</span>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-on-surface-variant">
                  <span>ID: #{currentUser.id}</span>
                  {currentUser.joinedDate && <span>• Qeydiyyat: {currentUser.joinedDate}</span>}
                  {currentUser.role === 'Admin' && (
                    <button
                      onClick={() => { setProfileModalOpen(false); setAdminModalOpen(true); }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-on-secondary hover:bg-secondary/90 transition-colors flex items-center gap-1 shadow-sm"
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
              className="text-outline hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 mt-5 border-b border-outline-variant/40 -mb-5 overflow-x-auto pb-0 text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">account_circle</span>
              <span>Profil Məlumatlarım</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">lock_reset</span>
              <span>Təhlükəsizlik & Şifrə</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">assignment</span>
              <span>Müraciətlər & Qeydiyyat</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-surface-container text-primary">
                {myApplications.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('notifications');
                markNotificationRead('all');
              }}
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap relative ${
                activeTab === 'notifications'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
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
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'learning'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">workspace_premium</span>
              <span>Tədris & Kouçinq</span>
            </button>

            <button
              onClick={() => setActiveTab('membership')}
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'membership'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">card_membership</span>
              <span>Rezidentlik (Paket)</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-sm">
          {/* TAB 1: PROFILE INFO & EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Şəxsi Profil Məlumatları
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Hesab rekvizitlərinizi və ictimai profilinizi tənzimləyin
                  </p>
                </div>
                {!editingProfile ? (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="px-3 py-1.5 rounded border border-secondary text-secondary hover:bg-secondary/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Profili Redaktə Et</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="px-3 py-1.5 rounded text-xs text-outline hover:text-primary"
                  >
                    Ləğv Et
                  </button>
                )}
              </div>

              {/* AVATAR SELECTOR / UPLOAD IN VIEW & EDIT */}
              <div className="p-4 rounded-xl bg-surface-container/20 border border-outline-variant/40 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary bg-surface-container flex items-center justify-center shrink-0">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-2xl text-secondary">
                      {profileForm.firstName ? profileForm.firstName[0] : 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="font-semibold text-primary text-xs">Profil Şəkli / Avatar</div>
                  <p className="text-[11px] text-outline">
                    JPG, PNG və ya WebM formatında maksimum 5MB fayl yükləyə bilərsiniz.
                  </p>
                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <label className="cursor-pointer px-3 py-1 rounded bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-xs font-semibold flex items-center gap-1 transition-colors">
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
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2 py-1"
                      >
                        Şəkli Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4 p-4 rounded-xl bg-surface-container/15 border border-outline-variant/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Ad *</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Soyad</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">E-poçt Ünvanı *</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Telefon / WhatsApp</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+994 50 123 45 67"
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Ölkə</label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Şəhər</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Haqqında / Bio</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Özünüz haqqında qısa məlumat, peşə və maraq sahələriniz..."
                      className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">LinkedIn Profili</label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/in/..."
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Instagram Profili</label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/..."
                        value={profileForm.instagram}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, instagram: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 py-2 rounded-lg text-xs text-outline hover:text-primary"
                    >
                      İmtina
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold shadow-sm flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Yadda Saxla</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-bright">
                      <span className="text-[10px] uppercase text-outline block">Tam Ad</span>
                      <strong className="text-primary text-sm font-serif">
                        {currentUser.firstName} {currentUser.lastName}
                      </strong>
                    </div>
                    <div className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-bright">
                      <span className="text-[10px] uppercase text-outline block">E-poçt</span>
                      <strong className="text-primary">{currentUser.email}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-bright">
                      <span className="text-[10px] uppercase text-outline block">Telefon / WhatsApp</span>
                      <strong className="text-primary">{currentUser.phone || '+994 (qeyd edilməyib)'}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-bright">
                      <span className="text-[10px] uppercase text-outline block">Məkan</span>
                      <strong className="text-primary">{currentUser.city || 'Bakı'}, {currentUser.country || 'Azərbaycan'}</strong>
                    </div>
                  </div>

                  {currentUser.bio && (
                    <div className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-bright text-xs">
                      <span className="text-[10px] uppercase text-outline block mb-1">Haqqında / Bio</span>
                      <p className="text-primary leading-relaxed">{currentUser.bio}</p>
                    </div>
                  )}

                  {(currentUser.linkedin || currentUser.instagram) && (
                    <div className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-bright text-xs flex items-center gap-4">
                      <span className="text-[10px] uppercase text-outline">Sosial Profillər:</span>
                      {currentUser.linkedin && (
                        <a href={currentUser.linkedin} target="_blank" rel="noreferrer" className="text-secondary hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">link</span>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {currentUser.instagram && (
                        <a href={currentUser.instagram} target="_blank" rel="noreferrer" className="text-secondary hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                          <span>Instagram</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs">
                <span className="text-outline">Platforma İstifadəçi ID: #{currentUser.id}</span>
                <button
                  onClick={() => {
                    setProfileModalOpen(false);
                    setOnboardingOpen(true);
                  }}
                  className="text-secondary hover:underline flex items-center gap-1 font-medium"
                >
                  <span className="material-symbols-outlined text-[15px]">tune</span>
                  Fərdi İnkişaf Xəritəsini Yenilə
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Hesab Təhlükəsizliyi və Şifrə Yeniləmə
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Hesabınızın təhlükəsizliyini təmin etmək üçün mütəmadi olaraq şifrənizi yeniləyin
                </p>
              </div>

              {passwordStatus && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  passwordStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {passwordStatus.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{passwordStatus.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-3.5 p-4 rounded-xl bg-surface-container/20 border border-outline-variant/40 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Cari Şifrə (Köhnə)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Yeni Şifrə (Minimum 8 simvol, hərf və rəqəm) *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Yeni Şifrə Təkrarı *</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    <span>Şifrəni Yenilə</span>
                  </button>
                </div>
              </form>

              <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-bright text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Hesab Təhlükəsizlik Statusu: Aktiv</span>
                </div>
                <p className="text-on-surface-variant text-[11px] leading-relaxed">
                  Hesabınız 256-bit SSL şifrələməsi və qorunan sessiya protokolu ilə təmin olunmuşdur. Şübhəli daxilolma cəhdləri qeydə alındıqda dərhal e-poçt bildirişi alacaqsınız.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATIONS & REGISTRATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Bütün Müraciət və Qeydiyyat Tarixçəsi
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Kurslar, klublar, tədbirlər və icma üçün göndərdiyiniz müraciətlərin aktual vəziyyəti
                </p>
              </div>

              {myApplications.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-outline-variant/60 rounded-xl">
                  <span className="material-symbols-outlined text-[44px] text-outline mb-2">inbox</span>
                  <p className="text-xs text-on-surface-variant">Hələ heç bir müraciətiniz yoxdur.</p>
                  <p className="text-[11px] text-outline mt-1">
                    Kurs və ya tədbir seçərək qeydiyyatdan keçə bilərsiniz.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myApplications.map(app => {
                    const statusObj = APPLICATION_STATUSES.find(s => s.id === app.status) || {
                      badgeClass: 'bg-slate-100 text-slate-800'
                    };
                    const typeObj = TARGET_TYPE_MAP[app.targetType] || {
                      label: 'Proqram',
                      icon: 'assignment',
                      color: 'text-primary'
                    };
                    const isExpanded = expandedAppId === app.id;
                    const canCancel = ['Yeni', 'Baxılır', 'Gözləmədə'].includes(app.status);

                    return (
                      <div
                        key={app.id}
                        className="rounded-xl border border-outline-variant/50 bg-surface-bright p-4 transition-all hover:border-secondary/40 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-outline-variant/20">
                          <div className="flex items-center gap-2.5">
                            <span className={`p-2 rounded-lg bg-surface-container ${typeObj.color} flex items-center justify-center`}>
                              <span className="material-symbols-outlined text-[20px]">{typeObj.icon}</span>
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                                  #{app.id} • {typeObj.label}
                                </span>
                                <span className="text-[10px] text-outline">
                                  {app.appliedAt}
                                </span>
                              </div>
                              <h5 className="font-semibold text-primary text-sm leading-snug">
                                {app.targetTitle}
                              </h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusObj.badgeClass}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        <div className={`grid gap-2 pt-3 text-xs text-on-surface-variant ${app.targetType === 'community' || app.targetType === 'forum' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                          {app.targetType !== 'community' && app.targetType !== 'forum' && (
                            <div>
                              <span className="text-[10px] uppercase text-outline block">Məbləğ</span>
                              <span className="font-medium text-primary">{app.price || 'Pulsuz'}</span>
                            </div>
                          )}
                          {app.targetType === 'community' || app.targetType === 'forum' ? (
                            <>
                              <div>
                                <span className="text-[10px] uppercase text-outline block">Önə Çıxarma</span>
                                <span className={`font-semibold flex items-center gap-1 ${(app.isPinned ?? app.pinned) ? 'text-amber-600' : 'text-on-surface-variant'}`}>
                                  <span className="material-symbols-outlined text-[13px]">
                                    {(app.isPinned ?? app.pinned) ? 'push_pin' : 'remove'}
                                  </span>
                                  <span>{(app.isPinned ?? app.pinned) ? 'Önə Çıxarılıb' : 'Standart'}</span>
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase text-outline block">Rəy İcazəsi</span>
                                <span className={`font-semibold flex items-center gap-1 ${app.allowComments === false ? 'text-rose-600' : 'text-emerald-600'}`}>
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
                                <span className="text-[10px] uppercase text-outline block">Ödəniş Statusu</span>
                                <span className={`font-medium ${['Ödənildi', 'Ödənilib'].includes(app.paymentStatus) ? 'text-emerald-600 font-bold' : (['Qaytarıldı', 'İmtina edildi'].includes(app.paymentStatus) ? 'text-rose-600 font-bold' : 'text-primary')}`}>
                                  {app.paymentStatus}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] uppercase text-outline block">İştirak Statusu</span>
                                <span className={`font-medium ${['İştirak edəcək', 'İştirak etdi'].includes(app.attendanceStatus) ? 'text-emerald-600 font-bold' : (['İştirak etməyəcək', 'İştirak etmədi'].includes(app.attendanceStatus) ? 'text-rose-600 font-bold' : 'text-primary')}`}>
                                  {app.attendanceStatus}
                                </span>
                              </div>
                            </>
                          )}
                          <div>
                            <span className="text-[10px] uppercase text-outline block">Əlaqə</span>
                            <span className="font-medium text-primary">{app.userPhone || 'Qeyd olunmayıb'}</span>
                          </div>
                        </div>

                        {app.adminNote && (
                          <div className="mt-3 p-2.5 rounded-lg bg-secondary/5 border border-secondary/20 text-xs">
                            <span className="font-bold text-secondary flex items-center gap-1 mb-0.5">
                              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                              Administrator Qeydi:
                            </span>
                            <p className="text-primary italic">{app.adminNote}</p>
                          </div>
                        )}

                        <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                          <button
                            onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                            className="text-secondary hover:underline flex items-center gap-1 font-medium"
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
                                className="px-3 py-1 rounded bg-primary text-surface-bright text-[11px] font-semibold flex items-center gap-1 hover:bg-[#112240]"
                              >
                                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                                Dərslərə Başla
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
                                className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold hover:underline flex items-center gap-1 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[14px]">cancel</span>
                                Müraciəti Ləğv Et
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
                                className="text-outline hover:text-rose-600 text-[11px] font-medium hover:underline flex items-center gap-1 transition-colors"
                                title="Müraciəti tarixçədən təmizlə"
                              >
                                <span className="material-symbols-outlined text-[13px]">delete</span>
                                Sil
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-3 p-3 rounded-lg bg-surface-container/30 border border-outline-variant/30 text-xs space-y-2 animate-fadeIn">
                            <span className="font-bold text-primary block border-b border-outline-variant/20 pb-1">
                              Təqdim Edilmiş Form Cavabları:
                            </span>
                            {app.userNote && (
                              <div>
                                <strong className="text-on-surface-variant block">Müraciətçinin qeydi:</strong>
                                <p className="text-primary mt-0.5">{app.userNote}</p>
                              </div>
                            )}
                            {Object.entries(app.formResponses || {}).map(([key, val]) => (
                              <div key={key} className="bg-surface-bright/60 p-2 rounded border border-outline-variant/20">
                                <strong className="text-on-surface-variant block text-[11px] font-semibold mb-0.5">
                                  {getFieldLabel(key)}:
                                </strong>
                                <span className="text-primary font-medium text-xs break-words">
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Sistem Bildirişləri
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Müraciət statusları və təlim xəbərdarlıqları
                  </p>
                </div>
                {myNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearNotifications('all')}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                    Təmizlə
                  </button>
                )}
              </div>

              {myNotifications.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-outline-variant/60 rounded-xl">
                  <span className="material-symbols-outlined text-[44px] text-outline mb-2">notifications_off</span>
                  <p className="text-xs text-on-surface-variant">Hələ heç bir bildirişiniz yoxdur.</p>
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
                        className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                          notif.isRead
                            ? 'bg-surface-bright border-outline-variant/30 text-on-surface-variant'
                            : (isTopicNotif ? 'bg-amber-500/5 border-amber-500/30 text-primary font-medium shadow-sm cursor-pointer' : 'bg-secondary/5 border-secondary/30 text-primary font-medium shadow-sm cursor-pointer')
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[20px] ${iconColor} mt-0.5 shrink-0`}>
                          {icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <div className="flex items-center gap-1.5 truncate">
                              {isTopicNotif && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-secondary/10 text-secondary uppercase tracking-wider shrink-0">
                                  İCMA
                                </span>
                              )}
                              <span className="font-bold text-primary truncate">{notif.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-outline">{notif.createdAt}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (deleteNotification) deleteNotification(notif.id);
                                  else clearNotifications(notif.id);
                                }}
                                className="text-outline hover:text-rose-600 transition-colors p-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                title="Bildirişi sil"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed break-words">
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
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Tədris, Sertifikatlar & Kouçinq
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Tamamlanmış kurslar və rezerv edilmiş kouçinq sessiyaları
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-xl border border-outline-variant/40 bg-surface-bright flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Qazanılmış Sertifikatlar</span>
                    <strong className="text-2xl font-serif text-primary">{certificates.length}</strong>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[36px]">workspace_premium</span>
                </div>

                <div className="p-4 rounded-xl border border-outline-variant/40 bg-surface-bright flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Rezerv Olunmuş Sessiyalar</span>
                    <strong className="text-2xl font-serif text-primary">{bookings.length}</strong>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[36px]">event_available</span>
                </div>
              </div>

              {bookings.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-xs font-bold text-primary uppercase mb-2">Kouçinq Rezervasiyaları:</h5>
                  <div className="space-y-2">
                    {bookings.map(b => (
                      <div key={b.id} className="p-3.5 rounded-xl border border-outline-variant/40 text-xs flex justify-between items-center bg-surface-bright">
                        <div>
                          <strong className="text-primary block">{b.coachName}</strong>
                          <span className="text-[11px] text-outline">{b.date} • {b.time}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
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
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                  Rezidentlik Səviyyəsi və Üzvlük
                </h4>
                <p className="text-[11px] text-on-surface-variant">
                  Monodoxia Academy cəmiyyətindəki cari statusunuz və əlavə imkanlar
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-secondary/15 via-surface-container to-secondary/5 border border-secondary/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-secondary block">Cari Status</span>
                  <h3 className="font-serif text-2xl font-bold text-primary mt-0.5">
                    {userTier || currentUser.tier || 'Free'} Rezident
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-1 max-w-md">
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
                  className="px-5 py-2.5 rounded-lg bg-secondary text-on-secondary font-bold text-xs uppercase tracking-wider hover:bg-secondary/90 transition-colors shadow shrink-0 self-start sm:self-center"
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

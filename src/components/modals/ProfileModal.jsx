import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APPLICATION_STATUSES, TARGET_TYPE_MAP } from '../../data/applicationData';

export default function ProfileModal() {
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
    userNotifications,
    markNotificationRead,
    clearNotifications,
    updateCurrentUser,
    activeProfileTab,
    setActiveProfileTab,
    openPlayer
  } = useApp();

  const [activeTab, setActiveTab] = useState(activeProfileTab || 'applications');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    country: currentUser?.country || 'Azərbaycan',
    city: currentUser?.city || 'Bakı'
  });
  const [expandedAppId, setExpandedAppId] = useState(null);

  useEffect(() => {
    if (activeProfileTab) {
      setActiveTab(activeProfileTab);
    }
  }, [activeProfileTab]);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
        country: currentUser.country || 'Azərbaycan',
        city: currentUser.city || 'Bakı'
      });
    }
  }, [currentUser]);

  if (!profileModalOpen || !currentUser) return null;

  // Filter applications for current user (non-archived)
  const myApplications = applicationsList.filter(a => a.userId === currentUser.id && !a.archived);
  const myNotifications = userNotifications.filter(n => n.userId === currentUser.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateCurrentUser({
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      phone: profileForm.phone.trim(),
      country: profileForm.country.trim(),
      city: profileForm.city.trim()
    });
    setEditingProfile(false);
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-surface-bright rounded-xl border border-outline-variant shadow-2xl max-w-2xl w-full my-auto overflow-hidden animate-fadeIn relative flex flex-col max-h-[90vh]">
        {/* Header with User Summary & Tabs */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/40 bg-surface-container/20 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-secondary/10 border-2 border-secondary text-secondary flex items-center justify-center font-bold text-xl uppercase shrink-0 shadow-inner">
                {currentUser.firstName ? currentUser.firstName[0] : 'U'}
              </div>
              <div>
                <h3 className="font-headline-sm text-base sm:text-lg font-serif text-primary leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </h3>
                <span className="text-xs text-outline block">{currentUser.email}</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-primary">
                    {currentUser.role || 'Tələbə'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary/15 text-secondary border border-secondary/20">
                    {userTier} Rezident
                  </span>
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
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-b border-outline-variant/40 -mb-5 overflow-x-auto pb-0 text-xs">
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'applications'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">assignment</span>
              <span>Müraciətlərim & Qeydiyyatlarım</span>
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
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">person</span>
              <span>Profil Məlumatlarım</span>
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
              <span>Sertifikatlar & Tədris</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-sm">
          {/* TAB 1: APPLICATIONS & REGISTRATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Bütün Müraciət və Qeydiyyat Tarixçəsi
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Kurslar, klublar, tədbirlər və icma üçün göndərdiyiniz müraciətlərin aktual vəziyyəti
                  </p>
                </div>
              </div>

              {myApplications.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-outline-variant/60 rounded-xl">
                  <span className="material-symbols-outlined text-[40px] text-outline mb-2">inbox</span>
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
                        className="rounded-lg border border-outline-variant/50 bg-surface-bright p-4 transition-all hover:border-secondary/40 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-outline-variant/20">
                          <div className="flex items-center gap-2">
                            <span className={`p-1.5 rounded-md bg-surface-container ${typeObj.color} flex items-center justify-center`}>
                              <span className="material-symbols-outlined text-[18px]">{typeObj.icon}</span>
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
                            <span className={`px-2.5 py-1 rounded text-xs font-bold border ${statusObj.badgeClass}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        {/* Status detail grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs text-on-surface-variant">
                          <div>
                            <span className="text-[10px] uppercase text-outline block">Məbləğ</span>
                            <span className="font-medium text-primary">{app.price || 'Pulsuz'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-outline block">Ödəniş Statusu</span>
                            <span className={`font-medium ${app.paymentStatus === 'Ödənilib' ? 'text-emerald-600 font-bold' : 'text-primary'}`}>
                              {app.paymentStatus}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-outline block">İştirak Statusu</span>
                            <span className={`font-medium ${app.attendanceStatus === 'İştirak etdi' ? 'text-emerald-600 font-bold' : 'text-primary'}`}>
                              {app.attendanceStatus}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase text-outline block">Əlaqə</span>
                            <span className="font-medium text-primary">{app.userPhone || 'Qeyd olunmayıb'}</span>
                          </div>
                        </div>

                        {/* Admin note banner */}
                        {app.adminNote && (
                          <div className="mt-3 p-2.5 rounded bg-secondary/5 border border-secondary/20 text-xs">
                            <span className="font-bold text-secondary flex items-center gap-1 mb-0.5">
                              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                              Administrator Qeydi:
                            </span>
                            <p className="text-primary italic">{app.adminNote}</p>
                          </div>
                        )}

                        {/* Expandable answers & Actions */}
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
                                onClick={() => {
                                  if (window.confirm('Bu müraciəti ləğv etmək istədiyinizdən əminsiniz?')) {
                                    cancelApplication(app.id);
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold hover:underline"
                              >
                                Müraciəti Ləğv Et
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded details */}
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
                              <div key={key}>
                                <strong className="text-on-surface-variant block">{key}:</strong>
                                <span className="text-primary">{String(val)}</span>
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

          {/* TAB 2: NOTIFICATIONS */}
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
                    onClick={clearNotifications}
                    className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                    Təmizlə
                  </button>
                )}
              </div>

              {myNotifications.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-outline-variant/60 rounded-xl">
                  <span className="material-symbols-outlined text-[40px] text-outline mb-2">notifications_off</span>
                  <p className="text-xs text-on-surface-variant">Hələ heç bir bildirişiniz yoxdur.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myNotifications.map(notif => {
                    const icon = notif.type === 'success' ? 'check_circle' : (notif.type === 'error' ? 'error' : (notif.type === 'warning' ? 'schedule' : 'info'));
                    const iconColor = notif.type === 'success' ? 'text-emerald-600' : (notif.type === 'error' ? 'text-rose-600' : (notif.type === 'warning' ? 'text-amber-600' : 'text-blue-600'));

                    return (
                      <div
                        key={notif.id}
                        className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 transition-colors ${
                          notif.isRead
                            ? 'bg-surface-bright border-outline-variant/30 text-on-surface-variant'
                            : 'bg-secondary/5 border-secondary/30 text-primary font-medium shadow-sm'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[20px] ${iconColor} mt-0.5 shrink-0`}>
                          {icon}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-primary">{notif.title}</span>
                            <span className="text-[10px] text-outline">{notif.createdAt}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
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

          {/* TAB 3: PROFILE INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Şəxsi Profil Məlumatları
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Müraciətlər zamanı avtomatik tətbiq olunan şəxsi rekvizitlər
                  </p>
                </div>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="px-3 py-1.5 rounded border border-secondary text-secondary hover:bg-secondary/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    Redaktə Et
                  </button>
                )}
              </div>

              {editingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 p-4 rounded-lg bg-surface-container/20 border border-outline-variant/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Ad</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Soyad</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Telefon / WhatsApp</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+994 50 123 45 67"
                        className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-primary mb-1">Şəhər</label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-3 py-1.5 rounded text-xs text-outline hover:text-primary"
                    >
                      İmtina
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold"
                    >
                      Yadda Saxla
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-outline-variant/30 bg-surface-bright">
                    <span className="text-[10px] uppercase text-outline block">Tam Ad</span>
                    <strong className="text-primary text-sm font-serif">
                      {currentUser.firstName} {currentUser.lastName}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg border border-outline-variant/30 bg-surface-bright">
                    <span className="text-[10px] uppercase text-outline block">E-poçt</span>
                    <strong className="text-primary">{currentUser.email}</strong>
                  </div>
                  <div className="p-3 rounded-lg border border-outline-variant/30 bg-surface-bright">
                    <span className="text-[10px] uppercase text-outline block">Telefon</span>
                    <strong className="text-primary">{currentUser.phone || '+994 (qeyd edilməyib)'}</strong>
                  </div>
                  <div className="p-3 rounded-lg border border-outline-variant/30 bg-surface-bright">
                    <span className="text-[10px] uppercase text-outline block">Məkan</span>
                    <strong className="text-primary">{currentUser.city || 'Bakı'}, {currentUser.country || 'Azərbaycan'}</strong>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs">
                <span className="text-outline">Platforma ID: #{currentUser.id}</span>
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

          {/* TAB 4: CERTIFICATES & LEARNING */}
          {activeTab === 'learning' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Tədris & Sertifikasiya
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Tamamlanmış kurslar və rezerv edilmiş kouçinq sessiyaları
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-lg border border-outline-variant/40 bg-surface-bright flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Qazanılmış Sertifikatlar</span>
                    <strong className="text-lg font-serif text-primary">{certificates.length}</strong>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[32px]">workspace_premium</span>
                </div>

                <div className="p-4 rounded-lg border border-outline-variant/40 bg-surface-bright flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-on-surface-variant block">Rezerv Olunmuş Sessiyalar</span>
                    <strong className="text-lg font-serif text-primary">{bookings.length}</strong>
                  </div>
                  <span className="material-symbols-outlined text-primary text-[32px]">event_available</span>
                </div>
              </div>

              {bookings.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-xs font-bold text-primary uppercase mb-2">Kouçinq Rezervasiyaları:</h5>
                  <div className="space-y-2">
                    {bookings.map(b => (
                      <div key={b.id} className="p-3 rounded border border-outline-variant/40 text-xs flex justify-between items-center bg-surface-bright">
                        <div>
                          <strong className="text-primary block">{b.coachName}</strong>
                          <span className="text-[11px] text-outline">{b.date} • {b.time}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Təsdiqləndi
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

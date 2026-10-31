import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

// Tab Components
import AdminOverviewTab from './AdminOverviewTab';
import AdminApplicationsTab from './AdminApplicationsTab';
import AdminRegistrationsTab from './AdminRegistrationsTab';
import AdminUsersTab from './AdminUsersTab';
import AdminRolesTab from './AdminRolesTab';
import AdminCoursesTab from './AdminCoursesTab';
import AdminCategoriesTab from './AdminCategoriesTab';
import AdminClubTab from './AdminClubTab';
import AdminEventsTab from './AdminEventsTab';
import AdminCommunityTab from './AdminCommunityTab';
import AdminStaticTranslationsTab from './AdminStaticTranslationsTab';
import AdminTranslationsTab from './AdminTranslationsTab';
import AdminMaintenanceTab from './AdminMaintenanceTab';
import AdminCmsTab from './AdminCmsTab';
import AdminPagesTab from './AdminPagesTab';
import AdminNavigationTab from './AdminNavigationTab';
import AdminDatabaseTab from './AdminDatabaseTab';
import AdminSettingsTab from './AdminSettingsTab';
import AdminCertificatesTab from './AdminCertificatesTab';
import AdminContactMessagesTab from './AdminContactMessagesTab';
import AdminContactSettingsTab from './AdminContactSettingsTab';
import AdminBookingsTab from './AdminBookingsTab';

export default function AdminModal() {
  const {
    currentUser,
    adminModalOpen,
    setAdminModalOpen,
    platformSettings,
    applicationsList = [],
    bookings = [],
    hasPermission,
    canAccessAdmin,
    adminModalTab,
    setAdminModalTab,
    unreadContactMessagesCount
  } = useApp();

  const [activeTab, setActiveTab] = useState(adminModalTab || 'overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [initialCreateTarget, setInitialCreateTarget] = useState(null);

  useEffect(() => {
    if (adminModalOpen && adminModalTab) {
      setActiveTab(adminModalTab);
    }
  }, [adminModalOpen, adminModalTab]);

  const handleQuickCreate = (targetTab) => {
    setQuickCreateOpen(false);
    setActiveTab(targetTab);
    setInitialCreateTarget(targetTab);
  };

  // Close mobile drawer on ESC or tab switch
  useEffect(() => {
    setMobileMenuOpen(false);
    setQuickCreateOpen(false);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && adminModalOpen) {
        setAdminModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminModalOpen, setAdminModalOpen]);

  const pendingAppsCount = applicationsList.filter(a => a.status === 'Yeni' && !a.archived).length;

  const allowedNavCategories = useMemo(() => {
    const navCategories = [
      {
        group: 'Analitika',
        items: [
          { id: 'overview', icon: 'dashboard', label: 'İcmal & Statistika', perm: 'dashboard.view' }
        ]
      },
      {
        group: 'İdarəetmə',
        items: [
          { id: 'contact_messages', icon: 'inbox', label: 'Əlaqə Mesajları', perm: 'contacts.view', badge: unreadContactMessagesCount > 0 ? unreadContactMessagesCount : null },
          { id: 'bookings', icon: 'calendar_month', label: 'Rezervasiyalar', perm: 'applications.view', badge: (bookings || []).filter(b => b.status === 'Gözləyir').length || null },
          { id: 'applications', icon: 'assignment', label: 'Müraciətlər', perm: 'applications.view', badge: pendingAppsCount > 0 ? pendingAppsCount : null },
          { id: 'registrations', icon: 'how_to_reg', label: 'Qeydiyyatlar', perm: 'registrations.view' },
          { id: 'users', icon: 'group', label: 'İstifadəçilər', perm: 'users.view' },
          { id: 'roles', icon: 'shield_person', label: 'Rollar & İcazələr (RBAC)', perm: 'roles.view' },
          { id: 'courses', icon: 'school', label: 'Kurslar & LMS', perm: 'courses.view' },
          { id: 'categories', icon: 'category', label: 'Kateqoriyalar', perm: 'categories.view' },
          { id: 'certificates', icon: 'workspace_premium', label: 'Sertifikatlar', perm: 'courses.view' },
          { id: 'club', icon: 'card_membership', label: 'Zənginlər Klubu', perm: 'club.view' },
          { id: 'events', icon: 'event', label: 'Tədbirlər', perm: 'events.view' },
          { id: 'community', icon: 'forum', label: 'İcma & Forum', perm: 'community.view' }
        ]
      },
      {
        group: 'Tərcümələr (i18n)',
        items: [
          { id: 'static_translations', icon: 'spellcheck', label: 'Statik Çevrilər (UI)', perm: 'translations.view' },
          { id: 'translations', icon: 'translate', label: 'Dinamik Məzmun Çevriləri', perm: 'translations.view' }
        ]
      },
      {
        group: 'Sistem & Rejimlər',
        items: [
          { id: 'pages', icon: 'auto_stories', label: 'Səhifələr İdarəetməsi', perm: 'content.view' },
          { id: 'contact_settings', icon: 'contact_support', label: 'Əlaqə Səhifəsi Parametrləri', perm: 'contacts.settings' },
          { id: 'navigation', icon: 'menu_open', label: 'Naviqasiya Menyusu', perm: 'content.view' },
          { id: 'content', icon: 'edit_document', label: 'Məzmun (CMS Blokları)', perm: 'content.view' },
          { id: 'maintenance', icon: 'construction', label: 'Texniki Qulluq Ekranı', perm: 'maintenance.view', highlight: Boolean(platformSettings?.maintenanceMode) },
          { id: 'database', icon: 'database', label: 'SQL Bazası', perm: 'database.view' },
          { id: 'settings', icon: 'settings', label: 'Ümumi Parametrlər', perm: 'settings.view' }
        ]
      }
    ];

    return navCategories.map(cat => ({
      ...cat,
      items: cat.items.filter(item => hasPermission ? hasPermission(item.perm) : true)
    })).filter(cat => cat.items.length > 0);
  }, [hasPermission, pendingAppsCount, platformSettings?.maintenanceMode]);

  // Fallback to first available tab if current activeTab is not permitted
  useEffect(() => {
    if (!adminModalOpen) return;
    const allAllowedItemIds = allowedNavCategories.flatMap(c => c.items.map(i => i.id));
    if (allAllowedItemIds.length > 0 && !allAllowedItemIds.includes(activeTab)) {
      setActiveTab(allAllowedItemIds[0]);
    }
  }, [adminModalOpen, allowedNavCategories, activeTab]);

  if (!adminModalOpen || (!canAccessAdmin?.(currentUser) && currentUser?.role !== 'Admin')) return null;

  return (
    <div className="fixed inset-0 z-50 admin-backdrop w-screen h-screen overflow-hidden animate-fadeIn">
      <div className="admin-shell w-full h-full flex flex-col overflow-hidden">

        {/* Top Banner if Maintenance Mode is active - sits at the very top, not overlapping topbar */}
        {Boolean(platformSettings?.maintenanceMode) && (
          <div className="bg-amber-600 text-white text-xs font-bold py-1.5 px-4 text-center shrink-0 flex items-center justify-center gap-2 shadow-sm select-none border-b border-amber-700/40">
            <span className="material-symbols-outlined text-[15px]">build</span>
            <span>TEXNİKİ QULLUQ REJİMİ AKTİVDİR — Sayt hazırda yalnız Administrator və Heyət üçün açıqdır.</span>
          </div>
        )}

        {/* TOPBAR */}
        <header className="admin-topbar h-[58px] px-4 md:px-6 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center justify-center"
              aria-label="Menyu aç"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Logo Mark */}
            <div className="flex items-center justify-center p-1 bg-white rounded-lg border border-slate-200 shadow-xs h-9 w-9">
              <img src="/favicon.svg" alt="Logo" className="h-7 w-7 object-contain" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: '14px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em', margin: 0 }}>
                  Monodoxia Core Management Studio
                </h3>
                <span style={{ padding: '1px 7px', background: 'linear-gradient(135deg,#b45309,#d4af37)', color: '#ffffff', fontSize: '9px', fontWeight: 800, borderRadius: '4px', letterSpacing: '0.08em' }}>
                  PRO
                </span>
              </div>
              <p className="hidden sm:block" style={{ fontSize: '11px', color: '#64748b', marginTop: '1px', letterSpacing: '0.01em', margin: 0 }}>
                Platforma · LMS · Abunəliklər · SQL · i18n
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Sürətli Yarat Menyu (Quick Create Dropdown) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: 'linear-gradient(135deg, #b45309 0%, #d4af37 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#ffffff',
                  boxShadow: '0 2px 4px rgba(180,83,9,0.2)',
                  transition: 'all 0.15s ease'
                }}
                title="Yeni Rol, Paket və ya Məzmun Yarat"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
                <span className="hidden sm:inline">Sürətli Yarat</span>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {quickCreateOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {quickCreateOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setQuickCreateOpen(false)} />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 6px)',
                      width: '240px',
                      background: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0',
                      padding: '6px 0',
                      zIndex: 50
                    }}
                    className="animate-fadeIn"
                  >
                    <div style={{ padding: '6px 12px 4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
                      Sürətli Əlavə Etmə Menyu
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickCreate('roles')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>shield_person</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Rol & Səlahiyyət (RBAC)</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Yeni rol, icazələr & tərcümələr</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickCreate('club')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fffbeb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>card_membership</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Abunəlik Paketi (Tier)</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Üzvlük tarifi & imtiyazlar</div>
                      </div>
                    </button>

                    <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

                    <button
                      type="button"
                      onClick={() => handleQuickCreate('courses')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#334155'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748b' }}>school</span>
                      <span>Yeni Kurs & LMS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickCreate('events')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#334155'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748b' }}>event</span>
                      <span>Yeni Tədbir</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickCreate('users')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#334155'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748b' }}>person_add</span>
                      <span>İstifadəçi Əlavə Et</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick access to Texniki Qulluq Ekranı */}
            <button
              type="button"
              onClick={() => setActiveTab('maintenance')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                background: platformSettings?.maintenanceMode ? '#fef3c7' : '#f8fafc',
                border: platformSettings?.maintenanceMode ? '1px solid #fde68a' : '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                color: platformSettings?.maintenanceMode ? '#b45309' : '#334155',
                transition: 'all 0.15s ease'
              }}
              title="Texniki Qulluq Ekranı Tənzimləmələri"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>construction</span>
              <span className="hidden sm:inline">Texniki Qulluq Ekranı</span>
            </button>

            {/* Live Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '100px' }}>
              <div className="admin-live-dot" />
              <span style={{ fontSize: '10px', color: '#15803d', fontWeight: 700 }}>SİSTEM AKTİV</span>
            </div>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={() => setAdminModalOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              title="Paneli bağla (ESC)"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>close</span>
            </button>
          </div>
        </header>

        {/* BODY (SIDEBAR + MAIN CONTENT) */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* MOBILE OVERLAY BACKDROP */}
          {mobileMenuOpen && (
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-xs"
            />
          )}

          {/* SIDEBAR */}
          <aside className={`admin-sidebar admin-scroll p-3 flex flex-col gap-0.5 overflow-y-auto shrink-0 z-30 transition-transform duration-200 ${
            mobileMenuOpen
              ? 'translate-x-0 absolute inset-y-0 left-0 w-[240px] shadow-2xl bg-white'
              : '-translate-x-full md:translate-x-0 md:static w-[220px]'
          }`}>
            {allowedNavCategories.map((group, groupIdx) => (
              <div key={groupIdx} className="flex flex-col gap-0.5">
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 700, padding: groupIdx === 0 ? '6px 12px 4px' : '12px 12px 4px' }}>
                  {group.group}
                </div>
                {group.items.map(tab => {
                  const isTabActive = tab.id === 'maintenance'
                    ? (activeTab === 'maintenance' || activeTab === 'coming_soon')
                    : activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`admin-nav-item ${isTabActive ? 'active' : ''}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '17px', flexShrink: 0, color: isTabActive ? '#b45309' : tab.highlight ? '#d97706' : '#64748b' }}>
                        {tab.icon}
                      </span>
                      <span className="flex-1 truncate text-left">{tab.label}</span>
                      {tab.badge && (
                        <span style={{ fontSize: '9px', fontWeight: 800, background: '#2563eb', color: '#ffffff', padding: '1px 6px', borderRadius: '100px', marginLeft: 'auto' }}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Sidebar Footer */}
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>v2.5 Enterprise Edition</div>
              <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '2px' }}>Monodoxia Studio</div>
            </div>
          </aside>

          {/* MAIN CONTENT VIEW */}
          <main className="admin-content admin-scroll flex-1 p-4 md:p-6 overflow-y-auto">
            {activeTab === 'overview' && (
              <AdminOverviewTab setActiveTab={setActiveTab} onQuickCreate={handleQuickCreate} />
            )}

            {activeTab === 'bookings' && (
              <AdminBookingsTab />
            )}

            {activeTab === 'applications' && (
              <AdminApplicationsTab />
            )}

            {activeTab === 'registrations' && (
              <AdminRegistrationsTab />
            )}

            {activeTab === 'users' && (
              <AdminUsersTab />
            )}

            {activeTab === 'roles' && (
              <AdminRolesTab
                initialCreate={initialCreateTarget === 'roles'}
                onResetInitialCreate={() => setInitialCreateTarget(null)}
              />
            )}

            {activeTab === 'courses' && (
              <AdminCoursesTab />
            )}

            {activeTab === 'categories' && (
              <AdminCategoriesTab />
            )}

            {activeTab === 'club' && (
              <AdminClubTab
                initialCreate={initialCreateTarget === 'club'}
                onResetInitialCreate={() => setInitialCreateTarget(null)}
              />
            )}

            {activeTab === 'events' && (
              <AdminEventsTab />
            )}

            {activeTab === 'community' && (
              <AdminCommunityTab />
            )}

            {(activeTab === 'maintenance' || activeTab === 'coming_soon') && (
              <AdminMaintenanceTab />
            )}

            {activeTab === 'static_translations' && (
              <AdminStaticTranslationsTab />
            )}

            {activeTab === 'translations' && (
              <AdminTranslationsTab />
            )}

            {activeTab === 'pages' && (
              <AdminPagesTab />
            )}

            {activeTab === 'navigation' && (
              <AdminNavigationTab />
            )}

            {activeTab === 'content' && (
              <AdminCmsTab />
            )}

            {activeTab === 'database' && (
              <AdminDatabaseTab />
            )}

            {activeTab === 'certificates' && (
              <AdminCertificatesTab />
            )}

            {activeTab === 'contact_messages' && (
              <AdminContactMessagesTab />
            )}

            {activeTab === 'contact_settings' && (
              <AdminContactSettingsTab />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsTab setActiveTab={setActiveTab} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

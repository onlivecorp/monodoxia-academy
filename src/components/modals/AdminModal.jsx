import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

// Tab Components
import AdminOverviewTab from './AdminOverviewTab';
import AdminApplicationsTab from './AdminApplicationsTab';
import AdminRegistrationsTab from './AdminRegistrationsTab';
import AdminUsersTab from './AdminUsersTab';
import AdminCoursesTab from './AdminCoursesTab';
import AdminCategoriesTab from './AdminCategoriesTab';
import AdminClubTab from './AdminClubTab';
import AdminEventsTab from './AdminEventsTab';
import AdminCommunityTab from './AdminCommunityTab';
import AdminStaticTranslationsTab from './AdminStaticTranslationsTab';
import AdminTranslationsTab from './AdminTranslationsTab';
import AdminMaintenanceTab from './AdminMaintenanceTab';
import AdminCmsTab from './AdminCmsTab';
import AdminDatabaseTab from './AdminDatabaseTab';
import AdminSettingsTab from './AdminSettingsTab';

export default function AdminModal() {
  const {
    currentUser,
    adminModalOpen,
    setAdminModalOpen,
    platformSettings,
    applicationsList = []
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on ESC or tab switch
  useEffect(() => {
    setMobileMenuOpen(false);
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

  if (!adminModalOpen || currentUser?.role !== 'Admin') return null;

  const pendingAppsCount = applicationsList.filter(a => a.status === 'Yeni' && !a.archived).length;

  const navCategories = [
    {
      group: 'Analitika',
      items: [
        { id: 'overview', icon: 'dashboard', label: 'İcmal & Statistika' }
      ]
    },
    {
      group: 'İdarəetmə',
      items: [
        { id: 'applications', icon: 'assignment', label: 'Müraciətlər', badge: pendingAppsCount > 0 ? pendingAppsCount : null },
        { id: 'registrations', icon: 'how_to_reg', label: 'Qeydiyyatlar' },
        { id: 'users', icon: 'group', label: 'İstifadəçilər & RBAC' },
        { id: 'courses', icon: 'school', label: 'Kurslar & LMS' },
        { id: 'categories', icon: 'category', label: 'Kateqoriyalar' },
        { id: 'club', icon: 'card_membership', label: 'Club Tiers' },
        { id: 'events', icon: 'event', label: 'Tədbirlər' },
        { id: 'community', icon: 'forum', label: 'İcma & Forum' }
      ]
    },
    {
      group: 'Tərcümələr (i18n)',
      items: [
        { id: 'static_translations', icon: 'spellcheck', label: 'Statik Çevrilər (UI)' },
        { id: 'translations', icon: 'translate', label: 'Dinamik Məzmun Çevriləri' }
      ]
    },
    {
      group: 'Sistem & Rejimlər',
      items: [
        { id: 'maintenance', icon: 'construction', label: 'Texniki Qulluq Ekranı', highlight: Boolean(platformSettings?.maintenanceMode) },
        { id: 'content', icon: 'edit_document', label: 'Məzmun (CMS)' },
        { id: 'database', icon: 'database', label: 'SQL Bazası' },
        { id: 'settings', icon: 'settings', label: 'Ümumi Parametrlər' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 admin-backdrop w-screen h-screen overflow-hidden animate-fadeIn">
      <div className="admin-shell w-full h-full flex flex-col overflow-hidden">

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
            <div style={{
              background: 'linear-gradient(135deg,rgba(197,160,89,0.18) 0%,rgba(197,160,89,0.06) 100%)',
              border: '1px solid rgba(197,160,89,0.3)',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>
                admin_panel_settings
              </span>
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
            {navCategories.map((group, groupIdx) => (
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
              <AdminOverviewTab setActiveTab={setActiveTab} />
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

            {activeTab === 'courses' && (
              <AdminCoursesTab />
            )}

            {activeTab === 'categories' && (
              <AdminCategoriesTab />
            )}

            {activeTab === 'club' && (
              <AdminClubTab />
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

            {activeTab === 'content' && (
              <AdminCmsTab />
            )}

            {activeTab === 'database' && (
              <AdminDatabaseTab />
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

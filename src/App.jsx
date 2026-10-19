import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';

import SafetyBanner from './components/SafetyBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import MaintenanceScreen from './components/MaintenanceScreen';
import ErrorBoundary from './components/ErrorBoundary';

import AuthModal from './components/modals/AuthModal';
const OnboardingModal = lazy(() => import('./components/modals/OnboardingModal'));
const PlayerModal = lazy(() => import('./components/modals/PlayerModal'));
const CertificateModal = lazy(() => import('./components/modals/CertificateModal'));
const BookingModal = lazy(() => import('./components/modals/BookingModal'));
const AdminModal = lazy(() => import('./components/modals/AdminModal'));
const NewTopicModal = lazy(() => import('./components/modals/NewTopicModal'));
const ProfileModal = lazy(() => import('./components/modals/ProfileModal'));
const ApplicationModal = lazy(() => import('./components/modals/ApplicationModal'));

import HomePage from './pages/HomePage';
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const CoachingPage = lazy(() => import('./pages/CoachingPage'));
const ClubPage = lazy(() => import('./pages/ClubPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function AppContent() {
  const { platformSettings, currentUser, setAuthModalOpen, canAccessAdmin, adminModalOpen, setAdminModalOpen, currentPage } = useApp();
  const [adminBypass, setAdminBypass] = useState(() => {
    return sessionStorage.getItem('monodoxia_admin_bypass') === 'true';
  });

  const isAdminUser = currentUser?.role === 'Admin' || Boolean(canAccessAdmin?.(currentUser));
  const isMaintenanceModeActive = Boolean(
    platformSettings?.maintenanceMode ||
    platformSettings?.maintenance_mode === '1' ||
    platformSettings?.maintenance_mode === 1 ||
    platformSettings?.maintenance_mode === true
  );

  // When maintenance is active, show MaintenanceScreen unless an admin explicitly bypassed
  const isMaintenance = isMaintenanceModeActive && (!isAdminUser || !adminBypass);

  // Ensure all hooks run unconditionally before any conditional return
  useEffect(() => {
    const titles = {
      home: platformSettings?.siteTitle ? `${platformSettings.siteTitle} — ${platformSettings.subtitle || 'Fərdi İnkişaf və Psixologiya Mərkəzi'}` : 'Monodoxia Academy',
      akademiya: 'Akademiya və Kurslar | Monodoxia Academy',
      koucinq: 'Fərdi Kouçinq | Monodoxia Academy',
      club: 'Coaching Club | Monodoxia Academy',
      tedbirler: 'Tədbirlər və Masterklaslar | Monodoxia Academy',
      icma: 'İcma və Forum | Monodoxia Academy',
      haqqimizda: 'Haqqımızda | Monodoxia Academy'
    };
    document.title = titles[currentPage] || platformSettings?.siteTitle || 'Monodoxia Academy';
  }, [currentPage, platformSettings?.siteTitle, platformSettings?.subtitle]);

  if (isMaintenance) {
    return (
      <div className="bg-[#fbf9f5] text-[#1e293b] min-h-screen flex flex-col justify-between">
        <ToastContainer />
        {isAdminUser && (
          <div className="w-full bg-[#05224a] text-white text-xs py-2.5 px-4 flex items-center justify-between shadow-md relative z-30 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[18px]">admin_panel_settings</span>
              <span><strong>Admin Statusu:</strong> Texniki Qulluq Rejimi aktivdir (Ziyarətçilər bu ekranı görür).</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sessionStorage.setItem('monodoxia_admin_bypass', 'true');
                  setAdminBypass(true);
                  if (setAdminModalOpen) setAdminModalOpen(true);
                }}
                className="bg-[#c5a059] hover:bg-[#b08b46] text-[#05224a] font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]">dashboard</span>
                <span>Admin Paneli</span>
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('monodoxia_admin_bypass', 'true');
                  setAdminBypass(true);
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                <span>Saytı İdarə Et (Bypass)</span>
              </button>
            </div>
          </div>
        )}
        <MaintenanceScreen 
          onAdminLogin={() => {
            if (isAdminUser) {
              sessionStorage.setItem('monodoxia_admin_bypass', 'true');
              setAdminBypass(true);
              if (setAdminModalOpen) setAdminModalOpen(true);
            } else {
              setAuthModalOpen(true);
            }
          }} 
        />
        <AuthModal />
        <Suspense fallback={null}>
          <AdminModal />
        </Suspense>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'akademiya':
        return <AcademyPage />;
      case 'koucinq':
        return <CoachingPage />;
      case 'club':
        return <ClubPage />;
      case 'tedbirler':
        return <EventsPage />;
      case 'icma':
        return <CommunityPage />;
      case 'haqqimizda':
        return <AboutPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col justify-between">
      <ToastContainer />

      {/* Top Banner if Maintenance Mode is active and Admin is in bypass mode */}
      {isMaintenanceModeActive && isAdminUser && (
        <div className="bg-amber-600 text-white text-xs font-bold py-2 px-4 flex items-center justify-between gap-3 shadow-sm relative z-30 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">build</span>
            <span>TEXNİKİ QULLUQ REJİMİ AKTİVDİR — Sayt hazırda yalnız sizin üçün açıqdır (Admin Bypass). Ziyarətçilər Təmir Ekranını görür.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sessionStorage.removeItem('monodoxia_admin_bypass');
                setAdminBypass(false);
              }}
              className="bg-white hover:bg-amber-50 text-amber-900 px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Təmir Ekranına Qayıt</span>
            </button>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="bg-amber-800 hover:bg-amber-900 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">settings</span>
              <span>Rejimi Dəyiş</span>
            </button>
          </div>
        </div>
      )}

      <SafetyBanner />
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-[40vh] flex items-center justify-center text-secondary">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {renderCurrentPage()}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />

      {/* Modals */}
      <AuthModal />
      <Suspense fallback={null}>
        <OnboardingModal />
        <PlayerModal />
        <CertificateModal />
        <BookingModal />
        <AdminModal />
        <NewTopicModal />
        <ProfileModal />
        <ApplicationModal />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

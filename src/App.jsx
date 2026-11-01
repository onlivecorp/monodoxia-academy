import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { getLocalized } from './i18n/localize';
import { AppProvider, useApp } from './context/AppContext';

import SafetyBanner from './components/SafetyBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import MaintenanceScreen from './components/MaintenanceScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { lazyRetry } from './utils/lazyRetry';

import AuthModal from './components/modals/AuthModal';
const OnboardingModal = lazyRetry(() => import('./components/modals/OnboardingModal'));
const PlayerModal = lazyRetry(() => import('./components/modals/PlayerModal'));
const CertificateModal = lazyRetry(() => import('./components/modals/CertificateModal'));
const BookingModal = lazyRetry(() => import('./components/modals/BookingModal'));
const AdminModal = lazyRetry(() => import('./components/modals/AdminModal'));
const NewTopicModal = lazyRetry(() => import('./components/modals/NewTopicModal'));
const ProfileModal = lazyRetry(() => import('./components/modals/ProfileModal'));
const ApplicationModal = lazyRetry(() => import('./components/modals/ApplicationModal'));
const CertificateViewModal = lazyRetry(() => import('./components/modals/CertificateViewModal'));
const TopicDetailModal = lazyRetry(() => import('./components/modals/TopicDetailModal'));
const CertificateVerifyPage = lazyRetry(() => import('./certificates/CertificateVerifyPage'));

import HomePage from './pages/HomePage';
const AcademyPage = lazyRetry(() => import('./pages/AcademyPage'));
const CoachingPage = lazyRetry(() => import('./pages/CoachingPage'));
const ClubPage = lazyRetry(() => import('./pages/ClubPage'));
const EventsPage = lazyRetry(() => import('./pages/EventsPage'));
const CommunityPage = lazyRetry(() => import('./pages/CommunityPage'));
const AboutPage = lazyRetry(() => import('./pages/AboutPage'));
const ContactPage = lazyRetry(() => import('./pages/ContactPage'));
const SearchPage = lazyRetry(() => import('./pages/SearchPage'));
import GlobalSearchModal from './components/search/GlobalSearchModal';

function AppContent() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    platformSettings,
    currentUser,
    setAuthModalOpen,
    authModalOpen,
    canAccessAdmin,
    adminModalOpen,
    setAdminModalOpen,
    currentPage,
    certViewModalOpen,
    homeContent,
    searchModalOpen,
    setSearchModalOpen,
    onboardingOpen,
    playerModalOpen,
    certificateModalOpen,
    bookingModalOpen,
    newTopicModalOpen,
    profileModalOpen,
    applicationModalOpen,
    topicDetailModalOpen
  } = useApp();
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
    try {
      sessionStorage.setItem('monodoxia_page_force_refreshed', 'false');
    } catch (e) {}
  }, []);

  useEffect(() => {
    const defaultTagline = t('splash_tagline') || 'Fərdi İnkişaf və Psixologiya Mərkəzi';
    const siteTitle = getLocalized(platformSettings, 'siteTitle', currentLang, defaultLang, 'Monodoxia Academy') || platformSettings?.siteTitle || 'Monodoxia Academy';
    const subtitle = getLocalized(platformSettings, 'subtitle', currentLang, defaultLang, defaultTagline) || platformSettings?.subtitle || defaultTagline;
    const titles = {
      home: `${siteTitle} — ${subtitle}`,
      akademiya: `${t('nav_academy') || 'Akademiya və Kurslar'} | ${siteTitle}`,
      koucinq: `${t('nav_coaching') || 'Fərdi Kouçinq'} | ${siteTitle}`,
      club: `${t('nav_club') || 'Zənginlər Klubu'} | ${siteTitle}`,
      tedbirler: `${t('nav_events') || 'Tədbirlər və Masterklaslar'} | ${siteTitle}`,
      icma: `${t('nav_community') || 'İcma və Forum'} | ${siteTitle}`,
      haqqimizda: `${t('nav_about') || 'Haqqımızda'} | ${siteTitle}`,
      elaqe: `${t('nav_contact') || 'Əlaqə'} | ${siteTitle}`,
      search: `${t('search_title') || 'Qlobal Axtarış'} | ${siteTitle}`
    };
    document.title = titles[currentPage] || siteTitle;
  }, [currentPage, platformSettings?.siteTitle, platformSettings?.subtitle, currentLang, defaultLang, t]);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K or / to open Global Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
        return;
      }

      // Check for forward slash '/' when not inside an input, textarea or contentEditable
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchModalOpen]);

  // Global scroll & reveal animation observer for all pages and dynamic content
  useEffect(() => {
    let observer;
    const observeAll = () => {
      const elements = document.querySelectorAll(
        '.anim-badge, .anim-about-badge, .anim-subtext, [class*="anim-"][class*="-title"]'
      );
      if (!elements || elements.length === 0) return;

      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.05,
            rootMargin: '60px 0px 60px 0px',
          }
        );
      }

      elements.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          observer.observe(el);
        }
      });
    };

    observeAll();
    const t1 = setTimeout(observeAll, 120);
    const t2 = setTimeout(observeAll, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (observer) observer.disconnect();
    };
  }, [currentPage, homeContent]);

  // Public Certificate Verification Route handling
  const resolveVerifyRoute = () => {
    try {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      const params = new URLSearchParams(window.location.search);
      const certParam = params.get('cert') || params.get('certId') || params.get('code');

      if (hash.startsWith('#/certificates/verify/')) {
        return { publicId: decodeURIComponent(hash.replace('#/certificates/verify/', '').replace(/\/$/, '').split('?')[0]) };
      }
      if (path.startsWith('/certificates/verify/')) {
        return { publicId: decodeURIComponent(path.replace('/certificates/verify/', '').replace(/\/$/, '').split('?')[0]) };
      }
      if (hash.startsWith('#verify/')) {
        return { publicId: decodeURIComponent(hash.replace('#verify/', '').replace(/\/$/, '').split('?')[0]) };
      }
      if (path.startsWith('/verify/')) {
        return { publicId: decodeURIComponent(path.replace('/verify/', '').replace(/\/$/, '').split('?')[0]) };
      }
      if (certParam) {
        return { certId: decodeURIComponent(certParam) };
      }
    } catch (e) {}
    return null;
  };

  const [verifyRoute, setVerifyRoute] = useState(resolveVerifyRoute);

  useEffect(() => {
    const handleLocation = () => {
      setVerifyRoute(resolveVerifyRoute());
    };
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);

  // When visiting a public certificate verification link, render the verify page directly
  if (verifyRoute) {
    return (
      <div className="min-h-screen bg-[#f8f5ec]">
        <ToastContainer />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <CertificateVerifyPage publicId={verifyRoute.publicId} certId={verifyRoute.certId} />
        </Suspense>
      </div>
    );
  }

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
        {authModalOpen && <AuthModal />}
        <Suspense fallback={null}>
          {adminModalOpen && <AdminModal />}
          {certViewModalOpen && <CertificateViewModal />}
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
      case 'elaqe':
        return <ContactPage />;
      case 'search':
        return <SearchPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      <ToastContainer />

      {/* Top Banner if Maintenance Mode is active and Admin is in bypass mode */}
      {isMaintenanceModeActive && isAdminUser && (
        <div className="bg-amber-600 text-white text-xs font-bold py-2 px-3 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm relative z-30 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[16px] shrink-0">build</span>
            <span className="leading-snug">TEXNİKİ QULLUQ REJİMİ AKTİVDİR — Sayt hazırda yalnız sizin üçün açıqdır (Admin Bypass).</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => {
                sessionStorage.removeItem('monodoxia_admin_bypass');
                setAdminBypass(false);
              }}
              className="bg-white hover:bg-amber-50 text-amber-900 px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Təmir Ekranı</span>
            </button>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="bg-amber-800 hover:bg-amber-900 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[14px]">settings</span>
              <span>Rejim</span>
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
      {authModalOpen && <AuthModal />}
      <Suspense fallback={null}>
        {onboardingOpen && <OnboardingModal />}
        {playerModalOpen && <PlayerModal />}
        {certificateModalOpen && <CertificateModal />}
        {bookingModalOpen && <BookingModal />}
        {adminModalOpen && <AdminModal />}
        {newTopicModalOpen && <NewTopicModal />}
        {profileModalOpen && <ProfileModal />}
        {applicationModalOpen && <ApplicationModal />}
        {certViewModalOpen && <CertificateViewModal />}
        {topicDetailModalOpen && <TopicDetailModal />}
      </Suspense>
      <GlobalSearchModal
        isOpen={Boolean(searchModalOpen)}
        onClose={() => setSearchModalOpen(false)}
      />
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

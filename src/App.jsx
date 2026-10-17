import React, { Suspense, lazy } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';

import SafetyBanner from './components/SafetyBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import MaintenanceScreen from './components/MaintenanceScreen';

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
  const { platformSettings, currentUser, setAuthModalOpen, canAccessAdmin, adminModalOpen, currentPage } = useApp();
  const isAdminUser = currentUser?.role === 'Admin' || Boolean(canAccessAdmin?.(currentUser));
  const isMaintenance = Boolean(platformSettings?.maintenanceMode) && !isAdminUser;

  if (isMaintenance) {
    return (
      <div className="bg-[#fbf9f5] text-[#1e293b] min-h-screen flex flex-col justify-between">
        <ToastContainer />
        <MaintenanceScreen onAdminLogin={() => setAuthModalOpen(true)} />
        <AuthModal />
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

      {/* Top Banner if Maintenance Mode is active but user is Admin / Staff */}
      {Boolean(platformSettings?.maintenanceMode) && isAdminUser && !adminModalOpen && (
        <div className="bg-amber-600 text-white text-xs font-bold py-2 px-4 text-center relative z-30 flex items-center justify-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[16px]">build</span>
          <span>TEXNİKİ QULLUQ REJİMİ AKTİVDİR — Sayt hazırda yalnız Administrator və Heyət üçün açıqdır.</span>
        </div>
      )}

      <SafetyBanner />
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[40vh] flex items-center justify-center text-secondary">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          {renderCurrentPage()}
        </Suspense>
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
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}

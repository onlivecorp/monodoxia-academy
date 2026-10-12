import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';

import SafetyBanner from './components/SafetyBanner';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import MaintenanceScreen from './components/MaintenanceScreen';

import AuthModal from './components/modals/AuthModal';
import OnboardingModal from './components/modals/OnboardingModal';
import PlayerModal from './components/modals/PlayerModal';
import CertificateModal from './components/modals/CertificateModal';
import BookingModal from './components/modals/BookingModal';
import AdminModal from './components/modals/AdminModal';
import NewTopicModal from './components/modals/NewTopicModal';
import ProfileModal from './components/modals/ProfileModal';
import ApplicationModal from './components/modals/ApplicationModal';

import HomePage from './pages/HomePage';
import AcademyPage from './pages/AcademyPage';
import CoachingPage from './pages/CoachingPage';
import ClubPage from './pages/ClubPage';
import EventsPage from './pages/EventsPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';

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
        {renderCurrentPage()}
      </main>
      <Footer />

      {/* Modals */}
      <AuthModal />
      <OnboardingModal />
      <PlayerModal />
      <CertificateModal />
      <BookingModal />
      <AdminModal />
      <NewTopicModal />
      <ProfileModal />
      <ApplicationModal />
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

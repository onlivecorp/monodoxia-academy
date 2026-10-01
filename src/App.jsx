import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';

import SafetyBanner from './components/SafetyBanner';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Areas from './components/Areas';
import Academy from './components/Academy';
import Club from './components/Club';
import Coaches from './components/Coaches';
import Community from './components/Community';
import Events from './components/Events';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Newsletter from './components/Newsletter';
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

function AppContent() {
  const { platformSettings, currentUser, setAuthModalOpen } = useApp();
  const isMaintenance = Boolean(platformSettings?.maintenanceMode) && currentUser?.role !== 'Admin';

  if (isMaintenance) {
    return (
      <div className="bg-[#fbf9f5] text-[#1e293b] min-h-screen flex flex-col justify-between">
        <ToastContainer />
        <MaintenanceScreen onAdminLogin={() => setAuthModalOpen(true)} />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col justify-between">
      <ToastContainer />

      {/* Top Banner if Maintenance Mode is active but user is Admin */}
      {Boolean(platformSettings?.maintenanceMode) && currentUser?.role === 'Admin' && (
        <div className="bg-amber-600 text-white text-xs font-bold py-2 px-4 text-center sticky top-0 z-[100] flex items-center justify-center gap-2 shadow-md">
          <span className="material-symbols-outlined text-[16px]">build</span>
          <span>TEXNİKİ QULLUQ REJİMİ AKTİVDİR — Sayt hazırda yalnız Administratorlara açıqdır.</span>
        </div>
      )}

      <SafetyBanner />
      <Header />
      <main>
        <Hero />
        <About />
        <Areas />
        <Academy />
        <Club />
        <Coaches />
        <Community />
        <Events />
        <Testimonials />
        <FAQ />
        <Newsletter />
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

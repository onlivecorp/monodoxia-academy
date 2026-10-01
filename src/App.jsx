import React from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppProvider } from './context/AppContext';

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

import AuthModal from './components/modals/AuthModal';
import OnboardingModal from './components/modals/OnboardingModal';
import PlayerModal from './components/modals/PlayerModal';
import CertificateModal from './components/modals/CertificateModal';
import BookingModal from './components/modals/BookingModal';
import AdminModal from './components/modals/AdminModal';
import NewTopicModal from './components/modals/NewTopicModal';
import ProfileModal from './components/modals/ProfileModal';
import ApplicationModal from './components/modals/ApplicationModal';

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <div className="bg-background text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col justify-between">
          <ToastContainer />
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

          {/*  */}
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
      </AppProvider>
    </LanguageProvider>
  );
}

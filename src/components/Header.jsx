import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { lang, setLang, supportedLangs, t } = useLanguage();
  const {
    currentUser,
    userTier,
    logout,
    setAuthModalOpen,
    setAuthModalTab,
    setAdminModalOpen,
    setProfileModalOpen,
    userNotifications,
    setActiveProfileTab,
    homeContent
  } = useApp();

  const logoUrl = homeContent?.navbar?.logoUrl;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#akademiya', label: t('nav_academy'), active: true },
    { href: '#koucinq', label: t('nav_coaching') },
    { href: '#club', label: t('nav_club') },
    { href: '#tedbirler', label: t('nav_events') },
    { href: '#icma', label: t('nav_community') },
    { href: '#haqqimizda', label: t('nav_about') },
  ];

  return (
    <header className="w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 shadow-sm sticky top-0 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* BRAND LOGO */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <>
              <div className="w-10 h-10 rounded bg-primary-container border border-secondary/40 flex items-center justify-center text-secondary shadow-sm transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.4" />
                  <polygon points="12,3 15,12 12,21 9,12" stroke="currentColor" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-widest text-primary font-semibold leading-none">
                  MONODOXIA
                </span>
                <span className="text-[10px] tracking-[0.25em] text-secondary uppercase font-sans mt-1 font-medium">
                  ACADEMY
                </span>
              </div>
            </>
          )}
        </a>

        {/* CENTER DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap font-label-md text-sm transition-all duration-200 py-1 ${
                link.active
                  ? 'text-primary font-semibold border-b-2 border-secondary'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
          
          {/* Admin Panel Quick Access */}
          <button
            onClick={() => setAdminModalOpen(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/5 text-secondary hover:bg-secondary/15 text-xs font-semibold whitespace-nowrap transition-colors"
            title={t('nav_admin')}
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span className="hidden xl:inline">{t('nav_admin')}</span>
            <span className="xl:hidden">Admin</span>
          </button>

          {/* Divider */}
          <div className="hidden md:block w-[1px] h-6 bg-outline-variant/60"></div>

          {/* Language Switcher */}
          <div className="relative group">
            <button className="flex items-center space-x-1 px-2.5 py-1.5 rounded border border-transparent hover:border-outline-variant text-on-surface-variant hover:text-secondary text-xs font-semibold transition-all">
              <span className="material-symbols-outlined text-[17px]">language</span>
              <span className="uppercase tracking-wider">{lang}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg py-1 w-32 z-50">
              {(supportedLangs || []).filter(l => l.active !== false && l.enabled !== false).map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    lang === item.code
                      ? 'font-bold text-secondary bg-surface-container-low'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <span>{item.flag} {item.code.toUpperCase()}</span>
                  {lang === item.code && <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Controls */}
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-1">
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="text-xs font-semibold text-primary whitespace-nowrap">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <span className="text-[10px] text-secondary font-medium tracking-wide uppercase whitespace-nowrap">
                  {currentUser.role || 'Tələbə'} • {userTier}
                </span>
              </div>
              {/* Notifications Bell */}
              {(() => {
                const unreadNotifs = (userNotifications || []).filter(n => n.userId === currentUser.id && !n.isRead).length;
                return (
                  <button
                    onClick={() => {
                      setActiveProfileTab('notifications');
                      setProfileModalOpen(true);
                    }}
                    className="relative p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                    title={`Bildirişlər ${unreadNotifs > 0 ? `(${unreadNotifs} oxunmamış)` : ''}`}
                  >
                    <span className="material-symbols-outlined text-[21px]">notifications</span>
                    {unreadNotifs > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse shadow-sm">
                        {unreadNotifs}
                      </span>
                    )}
                  </button>
                );
              })()}

              <button
                onClick={() => {
                  setActiveProfileTab('applications');
                  setProfileModalOpen(true);
                }}
                className="w-9 h-9 rounded-full bg-secondary/10 border border-secondary text-secondary flex items-center justify-center font-bold text-xs uppercase hover:bg-secondary hover:text-surface-bright transition-colors"
                title="Hesabım və Müraciətlərim"
              >
                {currentUser.firstName ? currentUser.firstName[0] : 'U'}
              </button>
              <button
                onClick={logout}
                className="text-on-surface-variant hover:text-red-700 p-1.5 transition-colors"
                title="Çıxış"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); }}
                className="px-3 py-2 text-on-surface hover:text-secondary text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors"
              >
                {t('nav_login')}
              </button>
              <button
                onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
                className="bg-primary-container text-on-primary hover:bg-[#112240] px-4 sm:px-5 py-2 sm:py-2.5 rounded text-xs sm:text-sm font-medium tracking-wide transition-all shadow-sm flex items-center gap-1.5 border border-secondary/30 whitespace-nowrap"
              >
                <span>{t('nav_join')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-on-surface-variant hover:text-primary"
            aria-label="Menyu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant px-4 py-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded text-sm font-medium text-on-surface hover:bg-surface-container hover:text-secondary"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-outline-variant flex items-center justify-between">
            <button
              onClick={() => { setAdminModalOpen(true); setMobileMenuOpen(false); }}
              className="text-xs text-secondary font-semibold flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>{t('nav_admin')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

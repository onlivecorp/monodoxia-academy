import React, { useState, useEffect } from 'react';
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
    homeContent,
    canAccessAdmin,
    currentPage,
    navigateTo,
    getPageUrl
  } = useApp();

  const logoUrl = homeContent?.navbar?.logoUrl || '/header_logo.svg';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'akademiya', href: getPageUrl ? getPageUrl('akademiya') : '/akademiya', label: t('nav_academy'), icon: 'school' },
    { id: 'koucinq', href: getPageUrl ? getPageUrl('koucinq') : '/koucinq', label: t('nav_coaching'), icon: 'psychology' },
    { id: 'club', href: getPageUrl ? getPageUrl('club') : '/club', label: t('nav_club'), icon: 'diamond' },
    { id: 'tedbirler', href: getPageUrl ? getPageUrl('tedbirler') : '/tedbirler', label: t('nav_events'), icon: 'event' },
    { id: 'icma', href: getPageUrl ? getPageUrl('icma') : '/icma', label: t('nav_community'), icon: 'forum' },
    { id: 'haqqimizda', href: getPageUrl ? getPageUrl('haqqimizda') : '/haqqimizda', label: t('nav_about'), icon: 'info' },
  ];

  const unreadNotifs = (userNotifications || []).filter(
    n => String(n.userId) === String(currentUser?.id) && !n.isRead
  ).length;

  const validLangs = (supportedLangs || []).filter(l => l.active !== false && l.enabled !== false);

  return (
    <header className="w-full bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 shadow-sm sticky top-0 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* BRAND LOGO */}
        <a
          href={getPageUrl ? getPageUrl('home') : '/'}
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer min-w-0"
        >
          <img
            src={logoUrl}
            alt="Monodoxia Academy"
            className="h-8 sm:h-10 md:h-12 w-auto max-w-[135px] sm:max-w-[200px] md:max-w-none object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              if (e.currentTarget.src !== window.location.origin + '/header_logo.svg') {
                e.currentTarget.src = '/header_logo.svg';
              }
            }}
          />
        </a>

        {/* CENTER DESKTOP NAVIGATION LINKS */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(link.id);
                }}
                className={`whitespace-nowrap font-label-md text-sm transition-all duration-200 py-1 cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-secondary'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {/* Desktop Language Switcher */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center space-x-1 px-2.5 py-1.5 rounded border border-transparent hover:border-outline-variant text-on-surface-variant hover:text-secondary text-xs font-semibold transition-all">
              <span className="material-symbols-outlined text-[17px]">language</span>
              <span className="uppercase tracking-wider">{lang}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg py-1 w-32 z-50">
              {validLangs.map((item) => (
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

          {/* Logged in Desktop and Mobile Mini Controls */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Desktop Name & Role */}
              <div className="hidden md:flex flex-col text-right leading-tight">
                <span className="text-xs font-semibold text-primary whitespace-nowrap">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <span className="text-[10px] text-secondary font-medium tracking-wide uppercase whitespace-nowrap">
                  {currentUser.role || 'Tələbə'} • {userTier}
                </span>
              </div>

              {/* Notifications Bell (Desktop/Tablet) */}
              <button
                onClick={() => {
                  setActiveProfileTab('notifications');
                  setProfileModalOpen(true);
                }}
                className="hidden sm:flex relative p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                title={`Bildirişlər ${unreadNotifs > 0 ? `(${unreadNotifs} oxunmamış)` : ''}`}
              >
                <span className="material-symbols-outlined text-[20px] sm:text-[21px]">notifications</span>
                {unreadNotifs > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse shadow-sm">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {/* Avatar Button */}
              <button
                onClick={() => {
                  setActiveProfileTab('applications');
                  setProfileModalOpen(true);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary/10 border border-secondary text-secondary flex items-center justify-center font-bold text-xs uppercase hover:bg-secondary hover:text-surface-bright transition-colors shrink-0"
                title="Hesabım və Müraciətlərim"
              >
                {currentUser.avatar || currentUser.image ? (
                  <img
                    src={currentUser.avatar || currentUser.image}
                    alt={currentUser.name || 'User'}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  currentUser.firstName ? currentUser.firstName[0] : (currentUser.name ? currentUser.name[0] : 'U')
                )}
              </button>

              {/* Desktop Logout Button */}
              <button
                onClick={logout}
                className="hidden sm:flex text-on-surface-variant hover:text-red-700 p-1.5 transition-colors"
                title="Çıxış"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); }}
                className="hidden sm:block px-3 py-2 text-on-surface hover:text-secondary text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors"
              >
                {t('nav_login')}
              </button>
              <button
                onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
                className="bg-primary-container text-on-primary hover:bg-[#112240] px-3 sm:px-5 py-1.5 sm:py-2.5 rounded text-xs sm:text-sm font-medium tracking-wide transition-all shadow-sm flex items-center gap-1 border border-secondary/30 whitespace-nowrap"
              >
                <span>{t('nav_join')}</span>
                <span className="material-symbols-outlined text-[14px] sm:text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* MOBILE BURGER MENU BUTTON - FULLY VISIBLE & PROMINENT */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg bg-surface-container-low hover:bg-secondary/15 text-primary border border-outline-variant/80 hover:border-secondary flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer ml-1"
            aria-label="Menyu"
            title="Naviqasiya menyusu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* LUXURY MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-start">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#070f1e]/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative bg-[#fcfbf9] border-b border-[#c5a059]/30 shadow-2xl w-full max-h-[92vh] overflow-y-auto px-5 py-5 space-y-5 animate-fadeIn">
            {/* Top Close Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e2d9c8]/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c5a059]" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#775a19] font-sans">
                  Monodoxia Menyu
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#070f1e] hover:bg-black/5"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Mobile User Profile Card */}
            {currentUser ? (
              <div className="p-3.5 rounded-xl bg-white border border-[#c5a059]/30 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059]/15 border border-[#c5a059] text-[#775a19] font-bold flex items-center justify-center shrink-0 text-sm">
                    {currentUser.avatar || currentUser.image ? (
                      <img src={currentUser.avatar || currentUser.image} alt="User" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      currentUser.firstName ? currentUser.firstName[0] : 'U'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#070f1e] truncate">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-[10px] text-[#775a19] font-semibold uppercase tracking-wider">{currentUser.role || 'Tələbə'} • {userTier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setActiveProfileTab('notifications');
                      setProfileModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="relative p-2 rounded-lg text-slate-600 hover:bg-black/5"
                    title="Bildirişlər"
                  >
                    <span className="material-symbols-outlined text-[19px]">notifications</span>
                    {unreadNotifs > 0 && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-bold text-[8px] flex items-center justify-center">
                        {unreadNotifs}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveProfileTab('applications');
                      setProfileModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-lg text-slate-600 hover:bg-black/5"
                    title="Profil"
                  >
                    <span className="material-symbols-outlined text-[19px]">account_circle</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-4 rounded-xl border border-[#c5a059]/50 text-[#070f1e] font-semibold text-xs tracking-wider uppercase text-center hover:bg-black/5"
                >
                  {t('nav_login')}
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#070f1e] to-[#112240] text-[#c5a059] font-semibold text-xs tracking-wider uppercase text-center shadow-md border border-[#c5a059]/40"
                >
                  {t('nav_join')}
                </button>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-gradient-to-r from-[#070f1e] to-[#112240] text-[#e5c57d] font-bold shadow-md'
                        : 'text-slate-800 hover:bg-black/5 hover:text-[#775a19]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#c5a059]' : 'text-slate-400'}`}>
                        {link.icon || 'arrow_forward'}
                      </span>
                      <span>{link.label}</span>
                    </div>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Language Switcher Strip */}
            <div className="pt-2 border-t border-[#e2d9c8]/70">
              <span className="block text-[10px] font-bold tracking-[0.16em] uppercase text-slate-400 mb-2">
                Dil Seçimi (Language)
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {validLangs.map((item) => {
                  const isCurrent = lang === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                      }}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all border ${
                        isCurrent
                          ? 'bg-[#070f1e] text-[#c5a059] border-[#c5a059] shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">{item.flag}</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider">{item.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Admin Access Quick Button if Authorized */}
            {(currentUser?.role === 'Admin' || canAccessAdmin?.(currentUser)) && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setAdminModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9e782f] to-[#c5a059] text-white font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                  <span>{t('nav_admin') || 'Admin İdarəetmə Paneli'}</span>
                </button>
              </div>
            )}

            {/* Mobile Logout Button */}
            {currentUser && (
              <div className="pt-1">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">logout</span>
                  <span>Çıxış Et</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

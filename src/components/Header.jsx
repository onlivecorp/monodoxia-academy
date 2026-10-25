import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import FlagIcon from './common/FlagIcon';

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
    getPageUrl,
    setSearchModalOpen,
    openSearchModal
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

  const DEFAULT_FALLBACK_LINKS = [
    { id: 'akademiya', pageId: 'akademiya', label: 'Akademiya', labelKey: 'nav_academy', type: 'internal', href: '/akademiya', icon: 'school', visible: true, openInNewTab: false, order: 1 },
    { id: 'koucinq', pageId: 'koucinq', label: 'Kouçinq', labelKey: 'nav_coaching', type: 'internal', href: '/koucinq', icon: 'psychology', visible: true, openInNewTab: false, order: 2 },
    { id: 'club', pageId: 'club', label: 'Zənginlər Klubu', labelKey: 'nav_club', type: 'internal', href: '/club', icon: 'diamond', visible: true, openInNewTab: false, order: 3 },
    { id: 'tedbirler', pageId: 'tedbirler', label: 'Tədbirlər', labelKey: 'nav_events', type: 'internal', href: '/tedbirler', icon: 'event', visible: true, openInNewTab: false, order: 4 },
    { id: 'icma', pageId: 'icma', label: 'İcma', labelKey: 'nav_community', type: 'internal', href: '/icma', icon: 'forum', visible: true, openInNewTab: false, order: 5 },
    { id: 'haqqimizda', pageId: 'haqqimizda', label: 'Haqqımızda', labelKey: 'nav_about', type: 'internal', href: '/haqqimizda', icon: 'info', visible: true, openInNewTab: false, order: 6 },
    { id: 'elaqe', pageId: 'elaqe', label: 'Əlaqə', labelKey: 'nav_contact', type: 'internal', href: '/elaqe', icon: 'contact_support', visible: true, openInNewTab: false, order: 7 },
  ];

  const rawNavItems = homeContent?.navbar?.items && Array.isArray(homeContent.navbar.items) && homeContent.navbar.items.length > 0
    ? homeContent.navbar.items
    : DEFAULT_FALLBACK_LINKS;

  const activeNavItems = [...rawNavItems]
    .filter(item => item.visible !== false)
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  const navLinks = activeNavItems.map(item => {
    let label = item.translations?.[lang];
    if (!label) {
      if (item.labelKey) {
        label = t(item.labelKey);
      } else {
        label = item.label || item.id;
      }
    }

    let href = item.href;
    if (item.type === 'internal') {
      if (item.pageId && getPageUrl) {
        href = getPageUrl(item.pageId);
      } else if (!href) {
        href = `/${item.pageId || item.id}`;
      }
    }

    return {
      ...item,
      label,
      href
    };
  });

  const handleLinkClick = (e, link) => {
    if (link.type === 'external') {
      if (link.openInNewTab) {
        e.preventDefault();
        window.open(link.href, '_blank', 'noopener,noreferrer');
      }
      setMobileMenuOpen(false);
      return;
    }

    // Internal navigation
    if (link.pageId) {
      const validPages = ['home', 'akademiya', 'koucinq', 'club', 'tedbirler', 'icma', 'haqqimizda', 'elaqe'];
      if (validPages.includes(link.pageId)) {
        e.preventDefault();
        navigateTo(link.pageId);
        setMobileMenuOpen(false);
        return;
      }
    }

    if (link.href && link.href.startsWith('#')) {
      setMobileMenuOpen(false);
      return;
    }

    if (link.href && link.href.startsWith('/')) {
      const cleanPath = link.href.replace(/^\//, '').split('?')[0].split('#')[0];
      const validPages = ['home', 'akademiya', 'koucinq', 'club', 'tedbirler', 'icma', 'haqqimizda', 'elaqe'];
      if (validPages.includes(cleanPath)) {
        e.preventDefault();
        navigateTo(cleanPath);
        setMobileMenuOpen(false);
        return;
      }
    }

    if (link.openInNewTab) {
      e.preventDefault();
      window.open(link.href, '_blank', 'noopener,noreferrer');
    }
    setMobileMenuOpen(false);
  };

  const isLinkActive = (link) => {
    if (link.type === 'external') return false;
    if (link.pageId) return currentPage === link.pageId;
    if (link.id) return currentPage === link.id;
    return false;
  };

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
            const isActive = isLinkActive(link);
            return (
              <a
                key={link.id}
                href={link.href}
                target={link.type === 'external' && link.openInNewTab ? '_blank' : undefined}
                rel={link.type === 'external' && link.openInNewTab ? 'noopener noreferrer' : undefined}
                onClick={(e) => handleLinkClick(e, link)}
                className={`whitespace-nowrap font-label-md text-sm transition-all duration-200 py-1 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-secondary'
                    : 'text-on-surface-variant hover:text-secondary'
                }`}
              >
                <span>{link.label}</span>
                {link.type === 'external' && (
                  <span className="material-symbols-outlined text-[13px] opacity-60">open_in_new</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {/* Desktop Global Search Trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant/60 hover:border-secondary bg-surface-container-low/60 hover:bg-surface-container-low text-on-surface-variant hover:text-secondary text-xs font-medium transition-all cursor-pointer shadow-2xs group shrink-0"
            title="Qlobal Axtarış"
            aria-label="Qlobal Axtarış"
          >
            <span className="material-symbols-outlined text-[17px] text-[#775a19] group-hover:scale-105 transition-transform shrink-0">
              search
            </span>
            <span className="text-slate-500 font-medium whitespace-nowrap">Axtarış...</span>
          </button>

          {/* Desktop Language Switcher */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-outline-variant/60 hover:border-secondary bg-surface-container-low/60 hover:bg-surface-container-low text-on-surface-variant hover:text-secondary text-xs font-semibold transition-all cursor-pointer">
              <FlagIcon code={lang} className="w-4 h-3" />
              <span className="uppercase tracking-wider font-bold">{lang}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block bg-white border border-[#c5a059]/40 rounded-xl shadow-xl py-1.5 w-44 z-50 animate-fadeIn">
              {validLangs.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                    lang === item.code
                      ? 'font-bold text-secondary bg-[#c5a059]/15'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FlagIcon code={item.code} className="w-4 h-3" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    {item.code}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Quick Language Toggle */}
          <button
            onClick={() => {
              const codes = validLangs.map(l => l.code);
              const nextIdx = (codes.indexOf(lang) + 1) % codes.length;
              setLang(codes[nextIdx]);
            }}
            className="sm:hidden flex items-center gap-1 px-2 py-1.5 rounded-md border border-outline-variant/70 bg-surface-container-low text-xs font-bold text-slate-700 hover:border-secondary cursor-pointer shrink-0"
            title="Dili dəyiş"
          >
            <FlagIcon code={lang} className="w-4 h-3" />
            <span className="text-[10px] uppercase font-mono">{lang}</span>
          </button>

          {/* Mobile Quick Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-outline-variant/70 bg-surface-container-low text-slate-700 hover:text-secondary hover:border-secondary transition-colors cursor-pointer shrink-0"
            title="Qlobal Axtarış"
            aria-label="Qlobal Axtarış"
          >
            <span className="material-symbols-outlined text-[19px] text-[#775a19]">search</span>
          </button>

          {/* Logged in Desktop and Mobile Mini Controls */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
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

            {/* Mobile Drawer Search Bar Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#c5a059]/40 text-slate-500 hover:text-primary hover:border-[#c5a059] shadow-xs cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#775a19] text-[20px]">search</span>
                <span className="text-xs font-medium">Kurs, ekspert və ya forum axtar...</span>
              </div>
              <kbd className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 text-slate-600">
                Axtar
              </kbd>
            </button>

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
                const isActive = isLinkActive(link);
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    target={link.type === 'external' && link.openInNewTab ? '_blank' : undefined}
                    rel={link.type === 'external' && link.openInNewTab ? 'noopener noreferrer' : undefined}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`px-3.5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-gradient-to-r from-[#070f1e] to-[#112240] text-[#e5c57d] font-bold shadow-md'
                        : 'text-slate-800 hover:bg-black/5 hover:text-[#775a19]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#c5a059]' : 'text-slate-400'}`}>
                        {link.icon || (link.type === 'external' ? 'open_in_new' : 'arrow_forward')}
                      </span>
                      <span>{link.label}</span>
                    </div>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                    ) : link.type === 'external' ? (
                      <span className="material-symbols-outlined text-[16px] text-slate-300">open_in_new</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Language Switcher Strip */}
            <div className="pt-2 border-t border-[#e2d9c8]/70">
              <span className="block text-[10px] font-bold tracking-[0.16em] uppercase text-slate-400 mb-2.5">
                Dil Seçimi (Language)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {validLangs.map((item) => {
                  const isCurrent = lang === item.code;
                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-all border cursor-pointer ${
                        isCurrent
                          ? 'bg-[#070f1e] text-[#c5a059] border-[#c5a059] shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FlagIcon code={item.code} className="w-5 h-3.5" />
                        <span>{item.name}</span>
                      </div>
                      <span className={`text-[10px] uppercase font-mono tracking-wider ${isCurrent ? 'text-[#c5a059]' : 'text-slate-400'}`}>
                        {item.code}
                      </span>
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

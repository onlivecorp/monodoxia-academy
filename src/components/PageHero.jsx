import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';

export default function PageHero({
  badge,
  title,
  description,
  breadcrumbs = [],
  adminCmsBlock,
  children
}) {
  const { navigateTo, currentUser, canAccessAdmin, setAdminModalOpen, setAdminModalTab } = useApp();
  const { t } = useLanguage();
  const isAdminUser = currentUser?.role === 'Admin' || Boolean(canAccessAdmin?.(currentUser));

  const handleAdminEdit = () => {
    if (setAdminModalTab) setAdminModalTab('pages');
    setAdminModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-background border-b border-outline-variant/60 pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Decorative luxury background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-radial from-secondary/10 via-transparent to-transparent pointer-events-none blur-3xl opacity-70" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-secondary flex items-center gap-1 transition-colors group cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
              <span>{t('common_home') || 'Ana Səhifə'}</span>
            </button>
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                <span className="text-outline-variant">/</span>
                {bc.page ? (
                  <button
                    onClick={() => navigateTo(bc.page)}
                    className="hover:text-secondary transition-colors cursor-pointer"
                  >
                    {bc.label}
                  </button>
                ) : (
                  <span className="text-secondary font-semibold">{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Admin shortcut if logged in */}
          {isAdminUser && (
            <button
              onClick={handleAdminEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 transition-all cursor-pointer"
              title={t('hero_admin_edit_title') || 'Bu səhifəni Səhifələr İdarəetməsi ekranında redaktə et'}
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              <span>{t('hero_admin_edit') || 'Admin: Bu Səhifəni Redaktə Et'}</span>
            </button>
          )}
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 border border-secondary/20 text-secondary font-label-sm text-xs font-semibold tracking-wider uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span>{badge}</span>
            </div>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight leading-tight mb-4">
            {title}
          </h1>

          {description && (
            <p className="font-body-lg text-base sm:text-lg text-on-surface-variant leading-relaxed mb-6 max-w-2xl">
              {description}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

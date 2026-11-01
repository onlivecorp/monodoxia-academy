import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';

export default function MaintenanceScreen({ onAdminLogin, onClosePreview }) {
  const { t, lang, setLang, supportedLangs } = useLanguage();
  const { platformSettings, homeContent } = useApp();
  const footer = homeContent?.footer || {};

  // Multi-language maintenance texts from platformSettings with defaults
  const trans = platformSettings?.maintenanceTranslations?.[lang] || {};
  const azTrans = platformSettings?.maintenanceTranslations?.az || {};

  const title = trans.title || platformSettings?.maintenanceTitle || azTrans.title || t('maintenance_title_default') || "Planlaşdırılmış Texniki Təkmilləşdirmə";
  const desc = trans.desc || platformSettings?.maintenanceDesc || azTrans.desc || t('maintenance_desc_default') || "Hörmətli ziyarətçi, Monodoxia Academy platformasında təhsil, analitika və təhlükəsizlik sistemlərini yeniləmək məqsədilə planlaşdırılmış texniki təkmilləşdirmə işləri aparılır. Sistem ən qısa zamanda yenidən tam fəaliyyətini bərpa edəcəkdir.";
  const notice = trans.notice || platformSettings?.maintenanceNotice || azTrans.notice || t('maintenance_notice_default') || "Tezliklə Aktiv";
  const contactEmail = platformSettings?.contactEmail || platformSettings?.contact_email || footer.email || "contact@monodoxia.academy";
  const contactPhone = platformSettings?.contactPhone || platformSettings?.contact_phone || footer.phone || "+994 (12) 490 88 00";

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-[#fbf9f5] text-[#1e293b] relative overflow-hidden select-none px-4 py-8">
      {onClosePreview && (
        <div className="relative z-20 w-full max-w-4xl bg-[#05224a] text-white text-xs py-2 px-4 flex items-center justify-between rounded-lg mb-4 shadow-md">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#c5a059]">visibility</span>
            <span><strong>{t('maintenance_preview_badge') || 'Admin Önizləmə Rejimi: Ziyarətçilər saytı hazırda bu şəkildə görür.'}</strong></span>
          </span>
          <button
            onClick={onClosePreview}
            className="bg-[#c5a059] hover:bg-[#b08b46] text-[#05224a] text-[11px] font-bold px-3 py-1 rounded transition-colors cursor-pointer"
          >
            {t('maintenance_exit_preview') || 'Önizləmədən Çıx'}
          </button>
        </div>
      )}
      {/* Background Decorative Ambient Radial Glows (Light Theme) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-40 blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.25) 0%, rgba(5,34,74,0.08) 60%, transparent 100%)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-30 blur-[110px]"
        style={{ background: '#f5e7c8' }}
      />

      {/* Top Bar Branding & Language Switcher */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b border-[#e2d9c8] pb-5">
        <div className="flex items-center gap-3">
          <img src="/header_logo.svg" alt="Monodoxia Academy" className="h-10 md:h-12 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-white border border-[#e2d9c8] rounded-lg p-0.5 shadow-sm text-xs font-semibold">
            {(supportedLangs || [
              { code: 'az', label: 'AZ' },
              { code: 'en', label: 'EN' },
              { code: 'ru', label: 'RU' },
              { code: 'tr', label: 'TR' }
            ]).filter(l => l.active !== false && l.enabled !== false).map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all uppercase ${
                  lang === item.code
                    ? 'bg-[#05224a] text-white shadow-sm'
                    : 'text-[#64748b] hover:text-[#05224a]'
                }`}
              >
                {item.code}
              </button>
            ))}
          </div>

          {/* Maintenance Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-xs text-[#8a6a1f]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#b45309] animate-pulse"></span>
            <span className="font-bold text-[11px] tracking-wider uppercase">{t('maintenance_badge') || 'Texniki Qulluq'}</span>
          </div>
        </div>
      </header>

      {/* Main Content Card (Light Luxury Academic Card) */}
      <main className="relative z-10 w-full max-w-2xl my-auto text-center py-12 px-6 sm:px-14 bg-white/90 backdrop-blur-md border border-[#e8dfcf] rounded-2xl shadow-[0_20px_50px_rgba(5,34,74,0.06)]">
        {/* Animated Icon Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-[#fbf8f1] to-[#f4ede0] border border-[#c5a059]/40 mb-6 shadow-inner relative group">
          <span className="material-symbols-outlined text-[40px] text-[#8a6a1f] animate-spin" style={{ animationDuration: '14s' }}>
            settings
          </span>
          <div className="absolute inset-0 rounded-2xl bg-[#c5a059]/10 blur-sm -z-10"></div>
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#05224a] mb-4 leading-tight tracking-tight">
          {title}
        </h2>

        <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl mx-auto mb-8 font-normal">
          {desc}
        </p>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-left">
          <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[#e8dfcf]">
            <span className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold block mb-1">{t('maintenance_status_label') || 'Status'}</span>
            <span className="text-xs font-bold text-[#b45309] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">tune</span> {t('maintenance_updating') || 'Yenilənmə Gedir'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[#e8dfcf]">
            <span className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold block mb-1">{t('maintenance_data_label') || 'Məlumatlar'}</span>
            <span className="text-xs font-bold text-[#059669] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">verified_user</span> {t('maintenance_data_safe') || '100% Qorunur'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#fbf9f5] border border-[#e8dfcf]">
            <span className="text-[10px] uppercase tracking-wider text-[#64748b] font-semibold block mb-1">{t('maintenance_duration_label') || 'Müddət'}</span>
            <span className="text-xs font-bold text-[#8a6a1f] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">schedule</span> {notice}
            </span>
          </div>
        </div>

        {/* Contact Support */}
        <div className="pt-5 border-t border-[#e8dfcf] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#64748b]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#8a6a1f]">mail</span>
            {t('maintenance_contact') || 'Əlaqə:'} <a href={`mailto:${contactEmail}`} className="text-[#05224a] font-semibold hover:text-[#8a6a1f] transition-colors underline">{contactEmail}</a>
          </span>
          <span className="hidden sm:inline text-[#cbd5e1]">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#8a6a1f]">phone</span>
            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="hover:text-[#05224a] transition-colors">{contactPhone}</a>
          </span>
        </div>
      </main>

      {/* Footer & Discreet Administrator Access */}
      <footer className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-[#e2d9c8] text-xs text-[#64748b]">
        <div>
          © 2025 Monodoxia Academy. {t('maintenance_rights') || 'Bütün hüquqlar qorunur.'}
        </div>

        {/* Administrator Access Button */}
        <div>
          <button
            onClick={onAdminLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2d9c8] hover:border-[#8a6a1f] bg-white hover:bg-[#fbf9f5] text-[#475569] hover:text-[#05224a] transition-all text-xs font-semibold cursor-pointer shadow-sm"
            title={t('maintenance_admin_login') || 'Administrator Girişi'}
          >
            <span className="material-symbols-outlined text-[15px] text-[#8a6a1f]">admin_panel_settings</span>
            <span>{t('maintenance_admin_login') || 'Administrator Girişi'}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

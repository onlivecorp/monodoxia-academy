import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function MaintenanceScreen({ onAdminLogin }) {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-[#071326] text-[#e2e8f0] relative overflow-hidden select-none px-4 py-8">
      {/* Background Decorative Ambient Glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #c5a059 0%, #05224a 70%, transparent 100%)' }}
      />
      <div 
        className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full pointer-events-none opacity-10 blur-[100px]"
        style={{ background: '#d4af37' }}
      />

      {/* Top Bar Branding */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#8a6a1f] p-[1px] shadow-lg">
            <div className="w-full h-full bg-[#071326] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[#e6c565] text-[20px]">psychology_alt</span>
            </div>
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-white tracking-wide">MONODOXIA</h1>
            <p className="text-[10px] tracking-widest uppercase text-[#c5a059]">Academy · Baku</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#c5a059]">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="font-semibold text-[11px] tracking-wider uppercase">Texniki Qulluq</span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 w-full max-w-2xl my-auto text-center py-10 px-6 sm:px-12 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {/* Animated Icon Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-[#c5a059]/20 to-transparent border border-[#c5a059]/40 mb-6 shadow-inner relative group">
          <span className="material-symbols-outlined text-[42px] text-[#e6c565] animate-spin" style={{ animationDuration: '14s' }}>
            settings
          </span>
          <div className="absolute inset-0 rounded-2xl bg-[#c5a059]/10 blur-md -z-10"></div>
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
          Planlaşdırılmış Texniki Təkmilləşdirmə
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto mb-8 font-light">
          Hörmətli ziyarətçi, <strong>Monodoxia Academy</strong> platformasında təhsil, analitika və təhlükəsizlik sistemlərini yeniləmək məqsədilə texniki qulluq işləri aparılır.
          <br className="hidden sm:inline" />
          {' '}Sistem ən qısa zamanda yenidən tam fəaliyyətini bərpa edəcəkdir.
        </p>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-8 text-left">
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Status</span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">tune</span> Yenilənmə Gedir
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Məlumatlar</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">verified_user</span> 100% Qorunur
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Müddət</span>
            <span className="text-xs font-bold text-[#e6c565] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">schedule</span> Tezliklə Aktiv
            </span>
          </div>
        </div>

        {/* Contact Support */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#c5a059]">mail</span>
            Əlaqə: <a href="mailto:contact@monodoxia.academy" className="text-slate-200 hover:text-[#c5a059] transition-colors underline">contact@monodoxia.academy</a>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#c5a059]">phone</span>
            +994 (12) 490 88 00
          </span>
        </div>
      </main>

      {/* Footer & Discreet Administrator Access */}
      <footer className="relative z-10 w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
        <div>
          © 2025 Monodoxia Academy. Bütün hüquqlar qorunur.
        </div>

        {/* Administrator Access Button */}
        <div>
          <button
            onClick={onAdminLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#c5a059]/40 bg-white/5 hover:bg-[#c5a059]/10 text-slate-400 hover:text-[#e6c565] transition-all text-xs font-medium cursor-pointer"
            title="Administrator Girişi"
          >
            <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
            <span>Administrator Girişi</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

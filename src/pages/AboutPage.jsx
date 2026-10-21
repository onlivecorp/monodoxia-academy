import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';
import About from '../components/About';
import Areas from '../components/Areas';

export default function AboutPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { homeContent, navigateTo } = useApp();

  const about = homeContent?.about || {};

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Editorial Page Hero */}
      <PageHero
        badge={getLocalized(about, 'badge', currentLang, defaultLang) || 'Akademiyanın Məramı'}
        title={getLocalized(about, 'title', currentLang, defaultLang) || 'Haqqımızda — Monodoxia Academy'}
        description={getLocalized(about, 'desc', currentLang, defaultLang) || 'Akademik psixoloji tədqiqatları, qədim daxili müdrikliyi və müasir fərdi kouçinq metodologiyasını bir araya gətirən elit inkişaf ekosistemidir.'}
        breadcrumbs={[{ label: 'Haqqımızda' }]}
        adminCmsBlock="about"
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#c5a059]/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {about.heroBadge1Icon || 'psychology'}
            </span>
            <span className="font-medium">{getLocalized(about, 'heroBadge1Text', currentLang, defaultLang) || 'Elmi & Psixoloji Əsaslar'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {about.heroBadge2Icon || 'auto_stories'}
            </span>
            <span className="font-medium">{getLocalized(about, 'heroBadge2Text', currentLang, defaultLang) || 'Qədim Fəlsəfi Miras'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {about.heroBadge3Icon || 'verified'}
            </span>
            <span className="font-medium">{getLocalized(about, 'heroBadge3Text', currentLang, defaultLang) || 'Etik Təhlükəsizlik Zəmanəti'}</span>
          </div>
        </div>
      </PageHero>

      {/* About Section: Frame Stili, Video və 4 Məram Dəyər Kartı */}
      <About />

      {/* 8 Fundamental Sahə */}
      <Areas />

      {/* Velvet Obsidian Manifesto Centerpiece Section */}
      <section className="py-20 lg:py-28 bg-[#faf8f5] relative overflow-hidden">
        {/* Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#c5a059]/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071326] via-[#0a1932] to-[#040e1c] border border-[#c5a059]/35 p-10 sm:p-16 lg:p-20 text-center text-white shadow-[0_25px_60px_-15px_rgba(7,19,38,0.35)]">
            
            {/* Ambient Corner Glows */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#c5a059]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 backdrop-blur-md mb-6">
                <span className="material-symbols-outlined text-[15px] text-[#e5c57d]">auto_awesome</span>
                <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#e5c57d] uppercase">
                  {getLocalized(about, 'manifestoBadge', currentLang, defaultLang) || 'Monodoxia Manifesti'}
                </span>
              </div>

              {/* Serif Headline */}
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight leading-[1.25] mb-6">
                {getLocalized(about, 'manifestoTitle', currentLang, defaultLang) || '"İnsan xarici dünyanı fəth etməzdən əvvəl öz daxili krallığını kəşf etməlidir."'}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-[#cbd5e1] font-light leading-relaxed mb-8 max-w-2xl mx-auto">
                {getLocalized(about, 'manifestoDesc', currentLang, defaultLang) || 'Müasir dünyada informasiya həddindən artıq çox, fərqindəlik isə azdır. Monodoxia Academy hər kəsin daxilindəki sükutu dinləməsi, emosional və psixoloji bütövlüyünü bərpa etməsi üçün təhlükəsiz bir platformadır.'}
              </p>

              {/* Core Tenets Bar */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pb-10 text-xs sm:text-sm text-[#94a3b8]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#c5a059]">
                    {about.manifestoTenet1Icon || 'verified'}
                  </span>
                  <span>{getLocalized(about, 'manifestoTenet1Text', currentLang, defaultLang) || 'Dərin Elmilik'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#c5a059]">
                    {about.manifestoTenet2Icon || 'lock'}
                  </span>
                  <span>{getLocalized(about, 'manifestoTenet2Text', currentLang, defaultLang) || 'Mütləq Məxfilik'}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[17px] text-[#c5a059]">
                    {about.manifestoTenet3Icon || 'workspace_premium'}
                  </span>
                  <span>{getLocalized(about, 'manifestoTenet3Text', currentLang, defaultLang) || 'Transformasiya Zəmanəti'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigateTo('akademiya')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#b38f46] text-[#071326] font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#c5a059]/25 hover:shadow-xl hover:shadow-[#c5a059]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>{getLocalized(about, 'manifestoBtn1Text', currentLang, defaultLang) || 'Akademiyanı Kəşf Et'}</span>
                  <span className="material-symbols-outlined text-[17px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </button>
                <button
                  onClick={() => navigateTo('club')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl border border-[#c5a059]/50 text-[#e5c57d] hover:bg-[#c5a059]/15 font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">diamond</span>
                  <span>{getLocalized(about, 'manifestoBtn2Text', currentLang, defaultLang) || 'Coaching Club-a Qoşul'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}


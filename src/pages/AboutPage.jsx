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
    <div className="min-h-screen bg-background">
      <PageHero
        badge={getLocalized(about, 'badge', currentLang, defaultLang) || 'Akademiyanın Məramı'}
        title={getLocalized(about, 'title', currentLang, defaultLang) || 'Haqqımızda — Monodoxia Academy'}
        description={getLocalized(about, 'desc', currentLang, defaultLang) || 'Akademik psixoloji tədqiqatları, qədim daxili müdrikliyi və müasir fərdi kouçinq metodologiyasını bir araya gətirən elit inkişaf ekosistemidir.'}
        breadcrumbs={[{ label: 'Haqqımızda' }]}
        adminCmsBlock="about"
      >
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-outline-variant/40 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
            <span>Elmi & Psixoloji Əsaslar</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">auto_stories</span>
            <span>Qədim Fəlsəfi Miras</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
            <span>Etik Təhlükəsizlik Zəmanəti</span>
          </div>
        </div>
      </PageHero>

      {/* About Section: Frame Stili, Video və 4 Məram Dəyər Kartı */}
      <About />

      {/* 8 Fundamental Sahə */}
      <Areas />

      {/* Extra Philosophy & Manifesto Section */}
      <section className="py-16 bg-surface-container-low border-b border-outline-variant/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs text-secondary font-bold uppercase tracking-widest block mb-2">
              Monodoxia Manifesti
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-6">
              "İnsan xarici dünyanı fəth etməzdən əvvəl öz daxili krallığını kəşf etməlidir."
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-8">
              Müasir dünyada informasiya həddindən artıq çox, fərqindəlik isə azdır. Monodoxia Academy hər kəsin daxilindəki sükutu dinləməsi, emosional və psixoloji bütövlüyünü bərpa etməsi üçün təhlükəsiz bir platformadır.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('akademiya')}
                className="px-6 py-3 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                Akademiyanı Kəşf Et
              </button>
              <button
                onClick={() => navigateTo('club')}
                className="px-6 py-3 rounded-lg border border-secondary text-secondary font-bold text-xs hover:bg-secondary/10 transition-all cursor-pointer"
              >
                Coaching Club-a Qoşul
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

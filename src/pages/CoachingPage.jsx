import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

export default function CoachingPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    coachesList,
    homeContent,
    openBookingModal,
    testimonialsList
  } = useApp();

  const coachesCms = homeContent?.coaches || {};
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Extract unique specialties from coaches list
  const allSpecialties = Array.from(
    new Set(
      coachesList.flatMap(c => {
        if (Array.isArray(c.specialties)) return c.specialties;
        if (typeof c.specialties === 'string') return c.specialties.split(',').map(s => s.trim());
        return [];
      }).filter(Boolean)
    )
  );

  const filteredCoaches = selectedSpecialty === 'all'
    ? coachesList
    : coachesList.filter(c => {
        const specs = Array.isArray(c.specialties) ? c.specialties : (c.specialties || '').split(',').map(s => s.trim());
        return specs.some(s => s.toLowerCase() === selectedSpecialty.toLowerCase());
      });

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        badge={getLocalized(coachesCms, 'badge', currentLang, defaultLang) || 'Ekspert Heyəti'}
        title={getLocalized(coachesCms, 'title', currentLang, defaultLang) || 'Fərdi Kouçinq və Mentorluq'}
        description={getLocalized(coachesCms, 'desc', currentLang, defaultLang) || 'Hər biri öz sahəsində akademik dərəcəyə və yüzlərlə saatlıq uğurlu fərdi kouçinq təcrübəsinə malik beynəlxalq sertifikatlı mentorlarımız.'}
        breadcrumbs={[{ label: 'Kouçinq' }]}
        adminCmsBlock="coaches"
      >
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-outline-variant/40 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
            <span>ICF Etik Məcəlləsi</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">lock</span>
            <span>100% Tam Konfidensiallıq</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">videocam</span>
            <span>Təhlükəsiz Onlayn Otaqlar</span>
          </div>
        </div>
      </PageHero>

      {/* Main Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Specialty Filter */}
          {allSpecialties.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-outline-variant/50">
              <span className="text-xs font-semibold text-on-surface-variant mr-2">İxtisas sahəsi:</span>
              <button
                onClick={() => setSelectedSpecialty('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedSpecialty === 'all'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                }`}
              >
                Bütün Kouçlar ({coachesList.length})
              </button>
              {allSpecialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedSpecialty === spec
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          )}

          {/* Coaches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredCoaches.map((c) => {
              const specialtiesList = Array.isArray(c.specialties)
                ? c.specialties
                : (c.specialties || '').split(',').map(s => s.trim()).filter(Boolean);

              return (
                <div
                  key={c.id}
                  className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-7 flex flex-col justify-between hover:border-secondary transition-all duration-300 shadow-sm hover:shadow-lg group"
                >
                  <div>
                    {/* Coach Avatar & Role */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative shrink-0">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-secondary/40 shadow-sm group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center border-2 border-secondary/40 text-secondary">
                            <span className="material-symbols-outlined text-3xl">person</span>
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Aktiv qəbul" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-bold text-primary truncate">{c.name}</h3>
                        <p className="text-xs text-secondary font-semibold uppercase tracking-wider">{c.title}</p>
                        {c.experience && (
                          <span className="text-[11px] text-outline">{c.experience} təcrübə</span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                      {c.bio}
                    </p>

                    {/* Specialties Chips */}
                    {specialtiesList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {specialtiesList.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-4 border-t border-outline-variant/40 flex items-center gap-3">
                    <button
                      onClick={() => openBookingModal(c)}
                      className="w-full py-2.5 px-4 rounded bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>Fərdi Seans Rezervasiya Et</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coaching Standards & Methodology Section */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-8 sm:p-12 mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs text-secondary font-semibold uppercase tracking-widest">İş Metodologiyası</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1 mb-3">
                Monodoxia Fərdi Kouçinq Standartları
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Hər bir fərdlə iş prosesi elmi əsaslı psixoloji çərçivədə və tamamilə fərdiləşdirilmiş addımlarla aparılır.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40">
                <span className="font-serif text-2xl font-bold text-secondary mb-2 block">01</span>
                <h4 className="font-bold text-sm text-primary mb-1">Daxili Diaqnostika</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  İlkin görüşdə cari maneələr, emosional bloklar və hədəflər müəyyən edilir.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40">
                <span className="font-serif text-2xl font-bold text-secondary mb-2 block">02</span>
                <h4 className="font-bold text-sm text-primary mb-1">İnkişaf Strategiyası</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Şəxsin xarakterinə və həyat ritminə uyğun fərdi transformasiya xəritəsi cızılır.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40">
                <span className="font-serif text-2xl font-bold text-secondary mb-2 block">03</span>
                <h4 className="font-bold text-sm text-primary mb-1">Müntəzəm Seanslar</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Həftəlik və ya 2 həftədən bir keçirilən 60 dəqiqəlik dərin fərdi sessiyalar.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40">
                <span className="font-serif text-2xl font-bold text-secondary mb-2 block">04</span>
                <h4 className="font-bold text-sm text-primary mb-1">Davamlı Monitorinq</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Seanslar arası praktiki tapşırıqlar, fərdi rəy və davamlı inkişafın təhlili.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          {testimonialsList && testimonialsList.length > 0 && (
            <div className="border border-secondary/30 bg-secondary/5 rounded-2xl p-8 sm:p-10 text-center max-w-3xl mx-auto">
              <span className="material-symbols-outlined text-4xl text-secondary mb-3">format_quote</span>
              <p className="font-serif text-lg sm:text-xl text-primary italic leading-relaxed mb-4">
                "{testimonialsList[0].quote}"
              </p>
              <div className="font-semibold text-xs text-primary">{testimonialsList[0].author}</div>
              <div className="text-[11px] text-secondary">{testimonialsList[0].role}</div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

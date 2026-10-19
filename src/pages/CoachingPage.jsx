import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

export default function CoachingPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    coachesList,
    homeContent,
    openBooking,
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
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Editorial Page Hero */}
      <PageHero
        badge={getLocalized(coachesCms, 'badge', currentLang, defaultLang) || 'Ekspert Heyəti'}
        title={getLocalized(coachesCms, 'title', currentLang, defaultLang) || 'Fərdi Kouçinq və Mentorluq'}
        description={getLocalized(coachesCms, 'desc', currentLang, defaultLang) || 'Hər biri öz sahəsində akademik dərəcəyə və yüzlərlə saatlıq uğurlu fərdi kouçinq təcrübəsinə malik beynəlxalq sertifikatlı mentorlarımız.'}
        breadcrumbs={[{ label: 'Kouçinq' }]}
        adminCmsBlock="coaches"
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#c5a059]/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {coachesCms.heroBadge1Icon || 'verified_user'}
            </span>
            <span className="font-medium">{getLocalized(coachesCms, 'heroBadge1Text', currentLang, defaultLang) || 'ICF Etik Məcəlləsi'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {coachesCms.heroBadge2Icon || 'lock'}
            </span>
            <span className="font-medium">{getLocalized(coachesCms, 'heroBadge2Text', currentLang, defaultLang) || '100% Tam Konfidensiallıq'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {coachesCms.heroBadge3Icon || 'videocam'}
            </span>
            <span className="font-medium">{getLocalized(coachesCms, 'heroBadge3Text', currentLang, defaultLang) || 'Təhlükəsiz Onlayn Otaqlar'}</span>
          </div>
        </div>
      </PageHero>

      {/* Main Section */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-[#c5a059]/6 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Specialty Filter Bar */}
          {allSpecialties.length > 0 && (
            <div className="bg-white/80 backdrop-blur-md border border-[#c5a059]/25 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_-10px_rgba(7,19,38,0.05)] mb-12 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#071326] mr-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#775a19]">tune</span>
                <span>İxtisas sahəsi:</span>
              </span>
              <button
                onClick={() => setSelectedSpecialty('all')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  selectedSpecialty === 'all'
                    ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-md border border-[#c5a059]/40'
                    : 'bg-[#faf8f5] text-[#475569] hover:text-[#071326] hover:bg-white border border-[#e2e8f0]'
                }`}
              >
                Bütün Kouçlar ({coachesList.length})
              </button>
              {allSpecialties.map(spec => {
                const isActive = selectedSpecialty === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-md border border-[#c5a059]/40'
                        : 'bg-[#faf8f5] text-[#475569] hover:text-[#071326] hover:bg-white border border-[#e2e8f0]'
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          )}

          {/* Coaches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredCoaches.map((c) => {
              const coachTitle = getLocalized(c, 'title', currentLang, defaultLang) || c.title;
              const coachBio = getLocalized(c, 'bio', currentLang, defaultLang) || c.bio;
              const coachExp = getLocalized(c, 'experience', currentLang, defaultLang) || c.experience;
              const rawSpecialties = getLocalizedArray(c, 'specialties', currentLang, defaultLang);
              const specialtiesList = rawSpecialties.length > 0
                ? rawSpecialties
                : (Array.isArray(c.specialties) ? c.specialties : (c.specialties || '').split(',').map(s => s.trim()).filter(Boolean));

              return (
                <div
                  key={c.id}
                  className="group relative bg-white rounded-3xl border border-[#c5a059]/25 hover:border-[#c5a059]/60 shadow-[0_8px_30px_-8px_rgba(7,19,38,0.06)] hover:shadow-[0_20px_45px_-12px_rgba(7,19,38,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden p-7 sm:p-8"
                >
                  {/* Top Ambient Sheen on Hover */}
                  <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Coach Avatar & Role */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative shrink-0">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#c5a059]/40 shadow-sm group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] font-serif font-bold text-xl flex items-center justify-center border-2 border-[#c5a059]/40 shadow-sm">
                            {(c.name || 'M')[0]}
                          </div>
                        )}
                        <span 
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center" 
                          title="Aktiv Qəbul"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-[#071326] group-hover:text-[#775a19] transition-colors truncate">
                          {c.name}
                        </h3>
                        <p className="text-xs text-[#775a19] font-semibold uppercase tracking-wider truncate">
                          {coachTitle}
                        </p>
                        {coachExp && (
                          <div className="inline-flex items-center gap-1 mt-1 text-[11px] text-[#64748b]">
                            <span className="material-symbols-outlined text-[13px] text-[#c5a059]">verified</span>
                            <span>{coachExp} təcrübə</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-6 font-light line-clamp-3">
                      {coachBio}
                    </p>

                    {/* Specialties Chips */}
                    {specialtiesList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {specialtiesList.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg bg-[#faf8f5] text-[#334155] border border-[#e2e8f0] text-[11px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-5 border-t border-[#e2e8f0]">
                    <button
                      onClick={() => openBooking(c.id)}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                    >
                      <span className="material-symbols-outlined text-[17px] text-[#e5c57d] group-hover/btn:scale-110 transition-transform">calendar_today</span>
                      <span>Fərdi Seans Rezervasiya Et</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coaching Standards & Methodology Section */}
          <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-8 sm:p-12 mb-20 shadow-[0_15px_40px_-15px_rgba(7,19,38,0.06)] relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#775a19] text-xs font-semibold tracking-widest uppercase mb-3">
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                <span>{getLocalized(coachesCms, 'standardsBadge', currentLang, defaultLang) || 'İş Metodologiyası'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#071326] tracking-tight mb-3">
                {getLocalized(coachesCms, 'standardsTitle', currentLang, defaultLang) || 'Monodoxia Fərdi Kouçinq Standartları'}
              </h2>
              <p className="text-sm sm:text-base text-[#64748b] font-light leading-relaxed">
                {getLocalized(coachesCms, 'standardsDesc', currentLang, defaultLang) || 'Hər bir fərdlə iş prosesi elmi əsaslı psixoloji çərçivədə və tamamilə fərdiləşdirilmiş addımlarla aparılır.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-[#faf8f5] p-6 sm:p-7 rounded-2xl border border-[#c5a059]/20 hover:border-[#c5a059]/50 transition-all hover:-translate-y-1 duration-300">
                <span className="font-serif text-3xl font-bold bg-gradient-to-r from-[#c5a059] to-[#775a19] bg-clip-text text-transparent mb-3 block">
                  {coachesCms.step1Num || '01'}
                </span>
                <h4 className="font-serif font-medium text-base text-[#071326] mb-1.5">
                  {getLocalized(coachesCms, 'step1Title', currentLang, defaultLang) || 'Daxili Diaqnostika'}
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
                  {getLocalized(coachesCms, 'step1Desc', currentLang, defaultLang) || 'İlkin görüşdə cari maneələr, emosional bloklar və hədəflər müəyyən edilir.'}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#faf8f5] p-6 sm:p-7 rounded-2xl border border-[#c5a059]/20 hover:border-[#c5a059]/50 transition-all hover:-translate-y-1 duration-300">
                <span className="font-serif text-3xl font-bold bg-gradient-to-r from-[#c5a059] to-[#775a19] bg-clip-text text-transparent mb-3 block">
                  {coachesCms.step2Num || '02'}
                </span>
                <h4 className="font-serif font-medium text-base text-[#071326] mb-1.5">
                  {getLocalized(coachesCms, 'step2Title', currentLang, defaultLang) || 'İnkişaf Strategiyası'}
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
                  {getLocalized(coachesCms, 'step2Desc', currentLang, defaultLang) || 'Şəxsin xarakterinə və həyat ritminə uyğun fərdi transformasiya xəritəsi cızılır.'}
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#faf8f5] p-6 sm:p-7 rounded-2xl border border-[#c5a059]/20 hover:border-[#c5a059]/50 transition-all hover:-translate-y-1 duration-300">
                <span className="font-serif text-3xl font-bold bg-gradient-to-r from-[#c5a059] to-[#775a19] bg-clip-text text-transparent mb-3 block">
                  {coachesCms.step3Num || '03'}
                </span>
                <h4 className="font-serif font-medium text-base text-[#071326] mb-1.5">
                  {getLocalized(coachesCms, 'step3Title', currentLang, defaultLang) || 'Müntəzəm Seanslar'}
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
                  {getLocalized(coachesCms, 'step3Desc', currentLang, defaultLang) || 'Həftəlik və ya 2 həftədən bir keçirilən 60 dəqiqəlik dərin fərdi sessiyalar.'}
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-[#faf8f5] p-6 sm:p-7 rounded-2xl border border-[#c5a059]/20 hover:border-[#c5a059]/50 transition-all hover:-translate-y-1 duration-300">
                <span className="font-serif text-3xl font-bold bg-gradient-to-r from-[#c5a059] to-[#775a19] bg-clip-text text-transparent mb-3 block">
                  {coachesCms.step4Num || '04'}
                </span>
                <h4 className="font-serif font-medium text-base text-[#071326] mb-1.5">
                  {getLocalized(coachesCms, 'step4Title', currentLang, defaultLang) || 'Davamlı Monitorinq'}
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
                  {getLocalized(coachesCms, 'step4Desc', currentLang, defaultLang) || 'Seanslar arası praktiki tapşırıqlar, fərdi rəy və davamlı inkişafın təhlili.'}
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          {testimonialsList && testimonialsList.length > 0 && (
            <div className="rounded-3xl bg-gradient-to-br from-[#071326] via-[#0a1932] to-[#040e1c] border border-[#c5a059]/30 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden text-white">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <span className="material-symbols-outlined text-4xl text-[#e5c57d]">format_quote</span>
                <p className="font-serif text-lg sm:text-2xl text-white italic leading-relaxed max-w-2xl mx-auto font-light">
                  "{getLocalized(testimonialsList[0], 'quote', currentLang, defaultLang) || testimonialsList[0].quote}"
                </p>
                <div className="pt-2">
                  <div className="font-semibold text-sm text-[#e5c57d] tracking-wide">{testimonialsList[0].author}</div>
                  <div className="text-xs text-[#cbd5e1] font-light">{getLocalized(testimonialsList[0], 'role', currentLang, defaultLang) || testimonialsList[0].role}</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}


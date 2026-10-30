import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import ExpertProfileModal from './modals/ExpertProfileModal';
import { COACHES } from '../data/mockData';

export default function Coaches() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { openBooking, coachesList, homeContent, usersList = [], currentUser } = useApp();
  const coaches = homeContent?.coaches || {};
  const [selectedCoach, setSelectedCoach] = useState(null);

  const badgeText = getLocalized(coaches, 'badge', currentLang, defaultLang) || (coaches.badge !== undefined && coaches.badge !== null && String(coaches.badge).trim() !== '' ? coaches.badge : t('experts_badge'));
  const titleText = getLocalized(coaches, 'title', currentLang, defaultLang) || (coaches.title !== undefined && coaches.title !== null && String(coaches.title).trim() !== '' ? coaches.title : t('experts_title'));
  const descText = getLocalized(coaches, 'desc', currentLang, defaultLang) || (coaches.desc !== undefined && coaches.desc !== null && String(coaches.desc).trim() !== '' ? coaches.desc : t('experts_desc'));

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="koucinq">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[28rem] rounded-full bg-gradient-to-b from-[#c5a059]/10 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #070f1e 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/70 backdrop-blur-md shadow-sm anim-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9e782f]"></span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
              {badgeText}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2] anim-coaches-title">
            {titleText}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal anim-subtext">
            {descText}
          </p>
        </div>

        {/* COACHES GRID */}
        {coachesList && coachesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coachesList.map(c => {
              const coachTitle = getLocalized(c, 'title', currentLang, defaultLang);
              const coachBio = getLocalized(c, 'bio', currentLang, defaultLang);
              const specialties = getLocalizedArray(c, 'specialties', currentLang, defaultLang);

              return (
                <div
                  key={c.id}
                  className="group relative bg-white/85 hover:bg-white rounded-2xl border border-[#e2d9c8]/75 hover:border-[#c5a059]/70 shadow-sm hover:shadow-2xl hover:shadow-[#c5a059]/15 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Ambient Gold Shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {/* CLICKABLE INFO AREA */}
                  <div
                    onClick={() => setSelectedCoach(c)}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCoach(c); } }}
                    title="Ekspert profilini və haqqında məlumatı aç"
                  >
                    {/* PHOTO CONTAINER */}
                    <div className="relative aspect-[4/4] bg-[#f5f3ef] overflow-hidden flex items-center justify-center">
                      {(() => {
                        let coachImg = c.image || c.avatar;
                        if (coachImg && coachImg.includes('googleusercontent.com')) coachImg = '';
                        if (!coachImg) {
                          const matchedUser = (usersList || []).find(u => 
                            (c.userId && String(u.id) === String(c.userId)) || 
                            (c.name && u.name && u.name.toLowerCase().trim() === c.name.toLowerCase().trim())
                          ) || (currentUser && ((c.userId && String(currentUser.id) === String(c.userId)) || (c.name && currentUser.name && c.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim())) ? currentUser : null);
                          coachImg = matchedUser?.avatar || matchedUser?.image || '';
                          if (coachImg && coachImg.includes('googleusercontent.com')) coachImg = '';
                        }
                        if (!coachImg) {
                          try {
                            const imgStore = JSON.parse(localStorage.getItem('monodoxia_coach_images') || '{}');
                            if (imgStore[c.id] && !imgStore[c.id].includes('googleusercontent.com')) coachImg = imgStore[c.id];
                          } catch (e) {}
                        }
                        if (!coachImg) {
                          const seed = COACHES.find(sc => sc.id === c.id || (sc.name && c.name && sc.name.toLowerCase().trim() === c.name.toLowerCase().trim()));
                          if (seed?.image) coachImg = seed.image;
                        }
                        if (!coachImg) {
                          coachImg = c.id === 'coach-farid' ? '/images/coaches/coach-farid.jpg' : (c.id === 'coach-nargiz' ? '/images/coaches/coach-nargiz.jpg' : '/images/coaches/coach-sedaqet.jpg');
                        }
                        return coachImg ? (
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            src={coachImg}
                            alt={c.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/coaches/coach-sedaqet.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#070f1e] to-[#112240] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[64px] text-[#c5a059]/40">person</span>
                          </div>
                        );
                      })()}

                      {/* Floating Verification Tag */}
                      <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#070f1e]/85 backdrop-blur-md border border-[#c5a059]/40 text-white text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 shadow-md">
                        <span className="material-symbols-outlined text-[#c5a059] text-[13px]">verified</span>
                        <span>ICF & PhD</span>
                      </div>
                    </div>

                    {/* CONTENT INFO */}
                    <div className="p-7">
                      <div className="text-[11px] font-semibold text-[#775a19] tracking-[0.16em] uppercase font-sans mb-1.5">
                        {coachTitle}
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#070f1e] group-hover:text-[#775a19] transition-colors leading-snug flex items-center gap-1.5">
                        <span>{c.name}</span>
                        <span className="material-symbols-outlined text-[18px] text-[#c5a059] opacity-70 group-hover:opacity-100 transition-opacity">open_in_new</span>
                      </h3>

                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal mt-2.5 mb-5">
                        {coachBio}
                      </p>

                      {/* SPECIALTIES */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {specialties.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-[#fbf9f5] text-[#775a19] border border-[#c5a059]/30">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ACTION CTA */}
                  <div className="p-7 pt-0 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openBooking(c.id);
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#070f1e] hover:bg-[#112240] text-white text-xs font-semibold uppercase tracking-[0.16em] border border-[#c5a059]/40 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t('expert_book_btn')}</span>
                      <span className="material-symbols-outlined text-[16px] text-[#c5a059]">calendar_month</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCoach(c)}
                      className="w-full py-2 px-3 rounded-lg border border-[#c5a059]/35 hover:border-[#c5a059] bg-[#faf8f5] hover:bg-white text-[#775a19] text-[11px] font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px]">badge</span>
                      <span>Haqqında & Profil Məlumatı</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-8 rounded-2xl border border-[#e2d9c8]/80 bg-white/80 backdrop-blur-md max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbf9f5] to-[#f5f0e6] border border-[#c5a059]/35 text-[#8a6a1f] mx-auto flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#c5a059]/15 text-[#775a19] text-[10px] font-semibold tracking-widest uppercase mb-3">
                Akademik Akkreditasiya
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#070f1e]">Ekspert Heyəti Formalaşdırılır</h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed font-normal">
                Monodoxia Academy ekspert heyəti qeydiyyatdan keçmiş və beynəlxalq sertifikatlaşdırılmış mütəxəssis üzvlər arasından təyin olunur. Tezliklə təsdiqlənmiş kouçlarımız burada təqdim olunacaqdır.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Expert Profile Modal */}
      <ExpertProfileModal
        coach={selectedCoach}
        isOpen={Boolean(selectedCoach)}
        onClose={() => setSelectedCoach(null)}
      />
    </section>
  );
}

import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Coaches() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { openBooking, coachesList, homeContent } = useApp();
  const coaches = homeContent?.coaches || {};

  const badgeText = getLocalized(coaches, 'badge', currentLang, defaultLang) || '';
  const titleText = getLocalized(coaches, 'title', currentLang, defaultLang) || '';
  const descText = getLocalized(coaches, 'desc', currentLang, defaultLang) || '';

  if (!coachesList || coachesList.length === 0) {
    return null;
  }

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
        {(titleText || badgeText) && (
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            {badgeText && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/70 backdrop-blur-md shadow-sm anim-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9e782f]"></span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
                  {badgeText}
                </span>
              </div>
            )}

            {titleText && (
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2] anim-coaches-title">
                {titleText}
              </h2>
            )}

            {descText && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal anim-subtext">
                {descText}
              </p>
            )}
          </div>
        )}

        {/* COACHES GRID */}
        {coachesList && coachesList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coachesList.map(c => {
              const coachTitle = getLocalized(c, 'title', currentLang, defaultLang) || c.title || '';
              const coachBio = getLocalized(c, 'bio', currentLang, defaultLang) || c.bio || '';
              const specialties = getLocalizedArray(c, 'specialties', currentLang, defaultLang);

              return (
                <div
                  key={c.id}
                  className="group relative bg-white/85 hover:bg-white rounded-2xl border border-[#e2d9c8]/75 hover:border-[#c5a059]/70 shadow-sm hover:shadow-2xl hover:shadow-[#c5a059]/15 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Ambient Gold Shimmer */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  <div>
                    {/* PHOTO CONTAINER */}
                    <div className="relative aspect-[4/4] bg-[#f5f3ef] overflow-hidden flex items-center justify-center">
                      {c.image ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          src={c.image}
                          alt={c.name}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#070f1e] to-[#112240] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[64px] text-[#c5a059]/40">person</span>
                        </div>
                      )}
                    </div>

                    {/* CONTENT INFO */}
                    <div className="p-7">
                      {coachTitle && (
                        <div className="text-[11px] font-semibold text-[#775a19] tracking-[0.16em] uppercase font-sans mb-1.5">
                          {coachTitle}
                        </div>
                      )}

                      <h3 className="font-serif text-2xl font-bold text-[#070f1e] group-hover:text-[#775a19] transition-colors leading-snug">
                        {c.name}
                      </h3>

                      {coachBio && (
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-normal mt-2.5 mb-5">
                          {coachBio}
                        </p>
                      )}

                      {/* SPECIALTIES */}
                      {specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {specialties.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-[#fbf9f5] text-[#775a19] border border-[#c5a059]/30">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION CTA */}
                  <div className="p-7 pt-0">
                    <button
                      onClick={() => openBooking(c.id)}
                      className="w-full py-3.5 rounded-xl bg-[#070f1e] hover:bg-[#112240] text-white text-xs font-semibold uppercase tracking-[0.16em] border border-[#c5a059]/40 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t('expert_book_btn') || 'Seans Təyin Et'}</span>
                      <span className="material-symbols-outlined text-[16px] text-[#c5a059]">calendar_month</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

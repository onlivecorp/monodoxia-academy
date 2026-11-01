import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Testimonials() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { testimonialsList, homeContent } = useApp();
  const testimonials = homeContent?.testimonials || {};

  const badgeText = getLocalized(testimonials, 'badge', currentLang, defaultLang) || (testimonials.badge !== undefined && testimonials.badge !== null && String(testimonials.badge).trim() !== '' ? testimonials.badge : t('testimonials_badge'));
  const titleText = getLocalized(testimonials, 'title', currentLang, defaultLang) || (testimonials.title !== undefined && testimonials.title !== null && String(testimonials.title).trim() !== '' ? testimonials.title : t('testimonials_title'));
  const descText = getLocalized(testimonials, 'desc', currentLang, defaultLang) || (testimonials.desc !== undefined && testimonials.desc !== null && String(testimonials.desc).trim() !== '' ? testimonials.desc : '');

  const list = testimonialsList || [];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="reyler">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[28rem] rounded-full bg-gradient-to-b from-[#c5a059]/10 via-[#c5a059]/5 to-transparent blur-3xl" />
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

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2] anim-testimonials-title">
            {titleText}
          </h2>

          {descText && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal anim-subtext">
              {descText}
            </p>
          )}
        </div>

        {/* TESTIMONIALS GRID */}
        {list.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {list.map((item, idx) => {
              const authorName = getLocalized(item, 'author', currentLang, defaultLang) || item.author || 'Məzun';
              const authorRole = getLocalized(item, 'role', currentLang, defaultLang) || item.role;
              const quoteContent = getLocalized(item, 'quote', currentLang, defaultLang) || item.quote;

              const initials = authorName
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={item.id || idx}
                  className="group relative bg-white/85 hover:bg-white p-8 sm:p-9 rounded-2xl border border-[#e2d9c8]/75 hover:border-[#c5a059]/70 shadow-sm hover:shadow-2xl hover:shadow-[#c5a059]/15 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Ambient Shimmer on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top Icon & Rating */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fbf9f5] to-[#f5f0e6] border border-[#c5a059]/30 text-[#8a6a1f] flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">format_quote</span>
                      </div>

                      <div className="flex items-center gap-0.5 text-[#c5a059]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[15px] fill-current">
                            star
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quote Text */}
                    <p className="font-serif italic text-base sm:text-lg text-[#070f1e] leading-relaxed mb-6 font-normal">
                      "{quoteContent}"
                    </p>
                  </div>

                  {/* Author & Role Strip */}
                  <div className="pt-5 border-t border-[#e2d9c8]/60 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#070f1e] to-[#112240] text-[#e9c176] font-serif font-semibold text-xs flex items-center justify-center shrink-0 border border-[#c5a059]/40 shadow-sm">
                      {initials}
                    </div>

                    <div>
                      <h4 className="font-serif text-base font-bold text-[#070f1e] group-hover:text-[#775a19] transition-colors leading-snug">
                        {authorName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {authorRole}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 px-8 rounded-2xl border border-[#e2d9c8]/80 bg-white/85 backdrop-blur-md max-w-xl mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbf9f5] to-[#f5f0e6] border border-[#c5a059]/35 text-[#8a6a1f] mx-auto flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[32px]">reviews</span>
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#c5a059]/15 text-[#775a19] text-[10px] font-semibold tracking-widest uppercase mb-3">
                {t('testimonials_empty_tag') || 'Məzun Rəyləri'}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#070f1e]">
                {t('testimonials_empty_title') || 'Tələbə Təcrübələri'}
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed font-normal">
                {t('testimonials_empty_desc') || 'Monodoxia Academy məzunlarının və klub Üzvlərinin yeni təcrübə paylaşımları tezliklə əlavə olunacaqdır.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

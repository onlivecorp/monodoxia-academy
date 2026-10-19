import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function FAQ() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { faqsList, homeContent, navigateTo } = useApp();
  const faq = homeContent?.faq || {};

  const badgeText = getLocalized(faq, 'badge', currentLang, defaultLang) || '';
  const titleText = getLocalized(faq, 'title', currentLang, defaultLang) || '';
  const descText = getLocalized(faq, 'desc', currentLang, defaultLang) || '';

  const list = faqsList || [];

  if (list.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="faq">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[28rem] rounded-full bg-gradient-to-b from-[#c5a059]/10 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #070f1e 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-12">
        {/* HEADER */}
        {(titleText || badgeText) && (
          <div className="text-center space-y-4 mb-14">
            {badgeText && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/70 backdrop-blur-md shadow-sm anim-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9e782f]"></span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
                  {badgeText}
                </span>
              </div>
            )}

            {titleText && (
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2] anim-faq-title">
                {titleText}
              </h2>
            )}

            {descText && (
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed font-normal anim-subtext">
                {descText}
              </p>
            )}
          </div>
        )}

        {/* ACCORDION LIST */}
        {list.length > 0 && (
          <div className="space-y-4">
            {list.map((item, idx) => (
              <details
                key={item.id || idx}
                className="group relative bg-white/85 hover:bg-white p-6 sm:p-7 rounded-2xl border border-[#e2d9c8]/75 hover:border-[#c5a059]/70 shadow-sm hover:shadow-xl hover:shadow-[#c5a059]/10 open:border-[#c5a059] open:shadow-xl open:shadow-[#c5a059]/10 transition-all duration-300 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                open={idx === 0}
              >
                {/* Left Active Gold Accent Indicator */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[#9e782f] to-[#c5a059] opacity-0 group-open:opacity-100 transition-opacity duration-300" />

                <summary className="flex items-center justify-between cursor-pointer list-none select-none">
                  <span className="font-serif text-lg sm:text-xl font-semibold text-[#070f1e] group-hover:text-[#775a19] group-open:text-[#775a19] transition-colors pr-4 leading-snug">
                    {getLocalized(item, 'question', currentLang, defaultLang) || item.question}
                  </span>
                  
                  <div className="w-9 h-9 rounded-full bg-[#fbf9f5] group-hover:bg-[#070f1e] group-open:bg-[#070f1e] border border-[#c5a059]/35 group-hover:border-[#070f1e] group-open:border-[#070f1e] text-[#8a6a1f] group-hover:text-[#c5a059] group-open:text-[#c5a059] flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-[20px] group-open:rotate-180 transition-transform duration-300">
                      expand_more
                    </span>
                  </div>
                </summary>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-4 mt-4 border-t border-[#e2d9c8]/50">
                  {getLocalized(item, 'answer', currentLang, defaultLang) || item.answer}
                </p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

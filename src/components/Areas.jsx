import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Areas() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { homeContent, areasList, navigateTo } = useApp();
  const areas = homeContent?.areas || {};
  const activeAreas = (areas?.items && Array.isArray(areas.items) && areas.items.length > 0)
    ? areas.items
    : (areasList && areasList.length > 0 ? areasList : []);

  const badgeText = getLocalized(areas, 'badge', currentLang, defaultLang) || (areas.badge !== undefined && areas.badge !== null && String(areas.badge).trim() !== '' ? areas.badge : t('areas_badge'));
  const titleText = getLocalized(areas, 'title', currentLang, defaultLang) || (areas.title !== undefined && areas.title !== null && String(areas.title).trim() !== '' ? areas.title : t('areas_title'));
  const descText = getLocalized(areas, 'desc', currentLang, defaultLang) || (areas.desc !== undefined && areas.desc !== null && String(areas.desc).trim() !== '' ? areas.desc : t('areas_desc'));
  const generalBtnText = getLocalized(areas, 'btnText', currentLang, defaultLang) || (areas.btnText !== undefined && areas.btnText !== null && String(areas.btnText).trim() !== '' ? areas.btnText : '');
  const generalLink = areas.link || areas.exploreLink || '';

  const handleLinkClick = (e, targetLink) => {
    if (!targetLink) return;
    if (targetLink.startsWith('http://') || targetLink.startsWith('https://')) {
      if (targetLink.includes('monodoxia.com/haqqimizda') || targetLink.endsWith('/haqqimizda')) {
        e.preventDefault();
        if (navigateTo) navigateTo('haqqimizda');
        return;
      }
      return;
    }
    if (targetLink.startsWith('#')) {
      const id = targetLink.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (id === 'akademiya' && navigateTo) {
        e.preventDefault();
        navigateTo('akademiya');
      }
    } else if (targetLink.startsWith('/') || ['akademiya', 'club', 'coaching', 'community', 'events', 'haqqimizda'].includes(targetLink)) {
      e.preventDefault();
      const clean = targetLink.replace(/^\//, '');
      if (navigateTo) navigateTo(clean);
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="saheler">
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
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9e782f]"></span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
              {badgeText}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.2]">
            {titleText}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {descText}
          </p>
        </div>

        {/* DYNAMIC AREAS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeAreas.map((a, idx) => {
            const cardLink = a.link || generalLink || '#akademiya';
            const btnLabel = getLocalized(a, 'btnText', currentLang, defaultLang) ||
                             generalBtnText ||
                             t('area_explore');

            return (
              <div
                key={a.id || idx}
                className="group relative bg-white/75 hover:bg-white p-7 rounded-2xl border border-[#e2d9c8]/75 hover:border-[#c5a059]/70 shadow-sm hover:shadow-2xl hover:shadow-[#c5a059]/12 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle Top Accent Shimmer on Hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* ICON */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fbf9f5] to-[#f5f0e6] group-hover:bg-gradient-to-br group-hover:from-[#070f1e] group-hover:to-[#112240] border border-[#c5a059]/30 group-hover:border-[#070f1e] text-[#8a6a1f] group-hover:text-[#c5a059] flex items-center justify-center transition-all duration-300 shadow-sm mb-5">
                    <span className="material-symbols-outlined text-[24px] transition-transform duration-300 group-hover:scale-110">
                      {a.icon || 'psychology'}
                    </span>
                  </div>

                  {/* NUMBER / CATEGORY */}
                  <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase text-[#775a19] mb-1.5 font-sans">
                    {getLocalized(a, 'number', currentLang, defaultLang)}
                  </span>

                  {/* TITLE */}
                  <h3 className="font-serif text-xl font-semibold text-[#070f1e] group-hover:text-[#775a19] transition-colors mb-3 leading-snug">
                    {getLocalized(a, 'title', currentLang, defaultLang)}
                  </h3>

                  {/* DESC */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {getLocalized(a, 'desc', currentLang, defaultLang)}
                  </p>
                </div>

                {/* ACTION LINK */}
                <a
                  className="inline-flex items-center justify-between text-xs font-semibold tracking-wider text-[#070f1e] group-hover:text-[#775a19] uppercase pt-4 border-t border-[#e2d9c8]/50 group-hover:border-[#c5a059]/50 transition-all duration-300 cursor-pointer"
                  href={cardLink}
                  onClick={(e) => handleLinkClick(e, cardLink)}
                >
                  <span>{btnLabel}</span>
                  <span className="material-symbols-outlined text-[16px] text-[#c5a059] transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>
            );
          })}
        </div>

        {/* GENERAL SECTION CTA BUTTON IF CONFIGURED */}
        {(generalBtnText || generalLink) && (
          <div className="mt-12 text-center">
            <a
              href={generalLink || '#haqqimizda'}
              onClick={(e) => handleLinkClick(e, generalLink || '#haqqimizda')}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#070f1e] to-[#112240] text-[#e5c57d] hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-xl hover:shadow-[#070f1e]/20 transition-all duration-300 hover:-translate-y-0.5 border border-[#c5a059]/30 cursor-pointer group"
            >
              <span>{generalBtnText || 'Kəşf et'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

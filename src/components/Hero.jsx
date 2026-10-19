import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import { getHeroMediaStyles, parseVideoUrl } from '../utils/heroMediaHelper';

export default function Hero() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { homeContent, navigateTo, getPageUrl } = useApp();
  const hero = homeContent?.hero || {};

  const mediaStyles = getHeroMediaStyles(hero);
  const parsedVideo = parseVideoUrl(hero.videoUrl);
  const isVideo = hero.mediaType === 'video' && Boolean(hero.videoUrl);

  const badgeText = getLocalized(hero, 'badge', currentLang, defaultLang) || t('hero_badge');
  const title1 = getLocalized(hero, 'title1', currentLang, defaultLang) || t('hero_title_1');
  const title2 = getLocalized(hero, 'title2', currentLang, defaultLang) || t('hero_title_2');
  const title3 = getLocalized(hero, 'title3', currentLang, defaultLang) || t('hero_title_3');
  const descText = getLocalized(hero, 'desc', currentLang, defaultLang) || t('hero_desc');
  const primaryBtnText = getLocalized(hero, 'btnPrimaryText', currentLang, defaultLang) || t('hero_cta_primary');
  const secondaryBtnText = getLocalized(hero, 'btnSecondaryText', currentLang, defaultLang) || t('hero_cta_secondary');
  const stat1Label = getLocalized(hero, 'stat1Label', currentLang, defaultLang) || t('hero_students');
  const stat2Label = getLocalized(hero, 'stat2Label', currentLang, defaultLang) || t('hero_satisfaction');
  const stat3Label = getLocalized(hero, 'stat3Label', currentLang, defaultLang) || t('hero_coaches');
  const quoteText = getLocalized(hero, 'quote', currentLang, defaultLang) || t('hero_quote');
  const quoteSubText = getLocalized(hero, 'quoteSub', currentLang, defaultLang) || t('hero_philosophy');

  const primaryLink = hero.btnPrimaryLink || (getPageUrl ? getPageUrl('akademiya') : '/akademiya');
  const secondaryLink = hero.btnSecondaryLink || (getPageUrl ? getPageUrl('club') : '/club');

  const handlePrimaryClick = (e) => {
    if (!hero.btnPrimaryLink || hero.btnPrimaryLink.startsWith('/') || hero.btnPrimaryLink === 'akademiya') {
      e.preventDefault();
      const target = hero.btnPrimaryLink ? hero.btnPrimaryLink.replace(/^\//, '') : 'akademiya';
      navigateTo(target);
    }
  };

  const handleSecondaryClick = (e) => {
    if (!hero.btnSecondaryLink || hero.btnSecondaryLink.startsWith('/') || hero.btnSecondaryLink === 'club') {
      e.preventDefault();
      const target = hero.btnSecondaryLink ? hero.btnSecondaryLink.replace(/^\//, '') : 'club';
      navigateTo(target);
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[#e2d9c8]/70 bg-[#fbf9f5]">
      {/* AMBIENT LUXURY GLOW & GEOMETRIC ACCENTS */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#c5a059]/15 to-transparent blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] rounded-full bg-gradient-to-bl from-[#0a192f]/5 via-[#c5a059]/10 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #070f1e 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/75 backdrop-blur-md shadow-sm animate-text-reveal">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9e782f]"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.18em] uppercase">
                {badgeText}
              </span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.15rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.12]">
              <span className="block anim-hero-title">{title1}</span>
              <span className="block italic font-normal gold-shimmer-text anim-hero-title [animation-delay:180ms]">
                {title2}
              </span>
              <span className="block anim-hero-title [animation-delay:360ms]">{title3}</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal anim-hero-title [animation-delay:480ms]">
              {descText}
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 animate-text-reveal-soft animate-delay-400">
              <a
                className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg bg-[#070f1e] hover:bg-[#0d1c32] text-white text-sm font-semibold tracking-wide border border-[#c5a059]/40 shadow-lg shadow-[#070f1e]/15 hover:shadow-xl hover:shadow-[#c5a059]/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
                href={primaryLink}
                onClick={handlePrimaryClick}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                <span>{primaryBtnText}</span>
                <span className="material-symbols-outlined text-[18px] text-[#c5a059] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  north_east
                </span>
              </a>

              <a
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-white/70 hover:bg-[#c5a059]/10 text-[#070f1e] hover:text-[#775a19] text-sm font-semibold tracking-wide border border-[#c5a059]/60 hover:border-[#c5a059] shadow-sm backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                href={secondaryLink}
                onClick={handleSecondaryClick}
              >
                <span>{secondaryBtnText}</span>
                <span className="material-symbols-outlined text-[18px] opacity-70">
                  arrow_forward
                </span>
              </a>
            </div>

            {/* STATS STRIP */}
            <div className="pt-8 border-t border-[#e2d9c8]/70 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl animate-text-reveal-soft animate-delay-500">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#070f1e] tracking-tight">
                  {hero.stat1Num || '12,000+'}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[0.14em] uppercase">
                  {stat1Label}
                </div>
              </div>
              <div className="border-l border-[#e2d9c8]/80 pl-4 sm:pl-6 space-y-1">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#775a19] tracking-tight">
                  <span className="gold-shimmer-text">{hero.stat2Num || '98%'}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[0.14em] uppercase">
                  {stat2Label}
                </div>
              </div>
              <div className="border-l border-[#e2d9c8]/80 pl-4 sm:pl-6 space-y-1">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#070f1e] tracking-tight">
                  {hero.stat3Num || 'ICF & PhD'}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[0.14em] uppercase">
                  {stat3Label}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT MEDIA */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full" style={{ maxWidth: mediaStyles.maxWidth }}>
              {hero.showGlow !== false && (
                <div className="absolute -inset-6 bg-gradient-to-tr from-[#c5a059]/20 via-[#c5a059]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              )}

              {/* FLOATING LUXURY PILL BADGE */}
              <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#070f1e]/85 backdrop-blur-md border border-[#c5a059]/40 text-white shadow-lg flex items-center gap-1.5 pointer-events-none">
                <span className="material-symbols-outlined text-[#c5a059] text-[15px]">verified</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase">
                  Beynəlxalq Standart
                </span>
              </div>

              {/* MEDIA CONTAINER */}
              <div
                className={`relative shadow-2xl overflow-hidden transition-all duration-300 group ${
                  mediaStyles.isFrameless
                    ? 'bg-transparent p-0'
                    : 'bg-white p-3 shadow-[0_20px_50px_rgba(7,15,30,0.14)]'
                }`}
                style={{
                  borderRadius: mediaStyles.outerRadius,
                  border: mediaStyles.strokeWidth > 0 ? `${mediaStyles.strokeWidth}px solid ${mediaStyles.strokeColor}` : 'none'
                }}
              >
                <div
                  className="overflow-hidden w-full bg-[#f5f3ef] relative"
                  style={{
                    borderRadius: mediaStyles.innerRadius,
                    aspectRatio: mediaStyles.aspectRatio === 'auto' ? undefined : mediaStyles.aspectRatio
                  }}
                >
                  {isVideo ? (
                    parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
                      <iframe
                        src={parsedVideo.embedUrl}
                        title="Hero Video"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={parsedVideo.rawUrl || hero.videoUrl}
                        poster={hero.videoPoster || hero.image}
                        autoPlay={hero.videoAutoplay !== false}
                        loop={hero.videoLoop !== false}
                        muted={hero.videoMuted !== false}
                        controls={hero.videoControls === true}
                        playsInline
                        className="w-full h-full"
                        style={{ objectFit: mediaStyles.objectFit }}
                      />
                    )
                  ) : (
                    <img
                      alt="Meditative sanctuary setting"
                      className="w-full h-full filter contrast-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                      style={{ objectFit: mediaStyles.objectFit }}
                      src={
                        hero.image ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6A42fLsKyb7QEyw763LYrM2DhMvrcMod35fdqpYFnlKrGTcsg11v2ljzwkebadfB8h3tfo-a23eJ2C1IgUxOWL0A7cON3aCvZ3irV6bqO5eStKS9edI_Qda-YAOeRR0EMqS_cCqNkoDRtBJgrns8bUxgLQjRFG1ZVUGF2Ob9e9CG4dgb2myU2AJgY2j8uSiSRSDuMt6yq1zuCRYVZhvt2-Eiq7WHllVLEpzNMbm6AuMR7CS-ijR7"
                      }
                    />
                  )}
                </div>

                {/* QUOTE OVERLAY */}
                {hero.showQuote !== false && (
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-[#c5a059]/35 text-center shadow-xl pointer-events-auto">
                    <div className="flex items-center justify-center gap-1 mb-1 text-[#c5a059]">
                      <span className="material-symbols-outlined text-[18px]">format_quote</span>
                    </div>
                    <div className="font-serif text-sm sm:text-base italic text-[#070f1e] font-medium leading-snug">
                      "{quoteText}"
                    </div>
                    <div className="text-[10px] font-semibold tracking-[0.2em] text-[#775a19] uppercase mt-2">
                      {quoteSubText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

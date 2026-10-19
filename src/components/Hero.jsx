import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import { getHeroMediaStyles, parseVideoUrl } from '../utils/heroMediaHelper';

export default function Hero() {
  const { currentLang, defaultLang } = useLanguage();
  const { homeContent, navigateTo, getPageUrl } = useApp();
  const hero = homeContent?.hero || {};

  const mediaStyles = getHeroMediaStyles(hero);
  const parsedVideo = parseVideoUrl(hero.videoUrl);
  const isVideo = hero.mediaType === 'video' && Boolean(hero.videoUrl);

  const badgeText = getLocalized(hero, 'badge', currentLang, defaultLang) || '';
  const title1 = getLocalized(hero, 'title1', currentLang, defaultLang) || '';
  const title2 = getLocalized(hero, 'title2', currentLang, defaultLang) || '';
  const title3 = getLocalized(hero, 'title3', currentLang, defaultLang) || '';
  const descText = getLocalized(hero, 'desc', currentLang, defaultLang) || '';
  const primaryBtnText = getLocalized(hero, 'btnPrimaryText', currentLang, defaultLang) || '';
  const secondaryBtnText = getLocalized(hero, 'btnSecondaryText', currentLang, defaultLang) || '';
  const stat1Num = hero.stat1Num || '';
  const stat1Label = getLocalized(hero, 'stat1Label', currentLang, defaultLang) || '';
  const stat2Num = hero.stat2Num || '';
  const stat2Label = getLocalized(hero, 'stat2Label', currentLang, defaultLang) || '';
  const stat3Num = hero.stat3Num || '';
  const stat3Label = getLocalized(hero, 'stat3Label', currentLang, defaultLang) || '';
  const quoteText = getLocalized(hero, 'quote', currentLang, defaultLang) || '';
  const quoteSubText = getLocalized(hero, 'quoteSub', currentLang, defaultLang) || '';
  const floatingBadgeText = getLocalized(hero, 'floatingBadge', currentLang, defaultLang) || '';

  // Rotating titles: ONLY what admin configured
  const rotatingTitles = useMemo(() => {
    if (hero.rotatingTitles) {
      if (Array.isArray(hero.rotatingTitles)) {
        return hero.rotatingTitles.filter(Boolean);
      }
      if (typeof hero.rotatingTitles === 'string') {
        return hero.rotatingTitles.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }
    return title3 ? [title3] : [];
  }, [hero.rotatingTitles, title3]);

  const [activeTitleIdx, setActiveTitleIdx] = useState(0);
  const [isTitleExiting, setIsTitleExiting] = useState(false);
  const [isTitlePaused, setIsTitlePaused] = useState(false);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    if (rotatingTitles.length <= 1 || isTitlePaused) return;

    const interval = setInterval(() => {
      setIsTitleExiting(true);
      transitionTimerRef.current = setTimeout(() => {
        setActiveTitleIdx((prev) => (prev + 1) % rotatingTitles.length);
        setIsTitleExiting(false);
      }, 380);
    }, 3800);

    return () => {
      clearInterval(interval);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [rotatingTitles.length, isTitlePaused]);

  useEffect(() => {
    setActiveTitleIdx(0);
    setIsTitleExiting(false);
  }, [currentLang]);

  const handleNextTitle = () => {
    if (rotatingTitles.length <= 1 || isTitleExiting) return;
    setIsTitleExiting(true);
    setTimeout(() => {
      setActiveTitleIdx((prev) => (prev + 1) % rotatingTitles.length);
      setIsTitleExiting(false);
    }, 320);
  };

  const handleSelectTitleIdx = (idx) => {
    if (idx === activeTitleIdx || isTitleExiting) return;
    setIsTitleExiting(true);
    setTimeout(() => {
      setActiveTitleIdx(idx);
      setIsTitleExiting(false);
    }, 320);
  };

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

  const title1Words = useMemo(() => {
    if (typeof title1 === 'string' && title1.trim()) {
      return title1.split(' ').filter(Boolean);
    }
    return [];
  }, [title1]);

  const hasAnyHeroContent = Boolean(
    badgeText || title1 || title2 || title3 || descText ||
    primaryBtnText || secondaryBtnText || stat1Num || stat2Num || stat3Num ||
    hero.image || isVideo
  );

  if (!hasAnyHeroContent) {
    return null;
  }

  const hasStats = Boolean(stat1Num || stat2Num || stat3Num);
  const hasCtas = Boolean(primaryBtnText || secondaryBtnText);
  const hasMedia = Boolean(hero.image || isVideo);

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
        <div className={`grid grid-cols-1 ${hasMedia ? 'lg:grid-cols-12' : ''} gap-12 lg:gap-12 items-center`}>
          {/* LEFT CONTENT */}
          <div className={`${hasMedia ? 'lg:col-span-7' : 'max-w-3xl'} space-y-6 md:space-y-8 relative`}>
            {/* AMBIENT GOLD HALO FOR HERO TYPOGRAPHY */}
            <div className="hero-title-halo" />

            {/* BADGE WITH SHIMMER AND PULSING BEACON */}
            {badgeText && (
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-white/80 hover:bg-white backdrop-blur-md shadow-sm anim-hero-badge relative group transition-all duration-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9e782f]"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#775a19] tracking-[0.18em] uppercase select-none">
                  {badgeText}
                </span>
                <span className="material-symbols-outlined text-[13px] text-[#c5a059] opacity-70 group-hover:rotate-45 transition-transform duration-500">
                  sparkles
                </span>
              </div>
            )}

            {/* HEADLINE WITH KINETIC REVEAL */}
            {(title1Words.length > 0 || title2 || title3) && (
              <div 
                className="relative z-10"
                onMouseEnter={() => setIsTitlePaused(true)}
                onMouseLeave={() => setIsTitlePaused(false)}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.15rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.14]">
                  {/* LINE 1: WORD-BY-WORD STAGGERED REVEAL */}
                  {title1Words.length > 0 && (
                    <div className="hero-text-mask flex flex-wrap items-baseline">
                      {title1Words.map((word, idx) => (
                        <span 
                          key={idx} 
                          className="hero-hover-word mr-[0.28em] inline-block cursor-default"
                          style={{
                            animation: 'heroWordReveal 1s cubic-bezier(0.16, 1, 0.3, 1) both',
                            animationDelay: `${0.12 + idx * 0.08}s`
                          }}
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* LINE 2: LIQUID GOLD SHIMMER & LUXURY ITALIC FOCUS */}
                  {title2 && (
                    <div className="hero-text-mask mt-0.5">
                      <span className="block italic font-normal gold-shimmer-text anim-hero-line-2 cursor-default select-none hover:brightness-110 transition-all">
                        {title2}
                      </span>
                    </div>
                  )}

                  {/* LINE 3: DYNAMIC 3D KINETIC TITLE SWITCHER */}
                  {(rotatingTitles.length > 0 || title3) && (
                    <div className="hero-text-mask relative mt-1 min-h-[1.25em] flex items-baseline">
                      <div
                        onClick={rotatingTitles.length > 1 ? handleNextTitle : undefined}
                        title={rotatingTitles.length > 1 ? "Dəyişmək üçün klikləyin" : undefined}
                        className={`inline-flex items-center gap-3 select-none group/dyn transition-all ${
                          rotatingTitles.length > 1 ? 'cursor-pointer' : ''
                        } ${isTitleExiting ? 'anim-hero-dynamic-exit' : 'anim-hero-dynamic-enter'}`}
                      >
                        <span className="block font-medium tracking-tight text-[#070f1e] group-hover/dyn:text-[#775a19] transition-colors duration-300">
                          {rotatingTitles[activeTitleIdx] || title3}
                        </span>
                        {rotatingTitles.length > 1 && (
                          <span 
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c5a059]/15 text-[#775a19] opacity-70 group-hover/dyn:opacity-100 group-hover/dyn:bg-[#c5a059]/25 transition-all duration-300 transform group-hover/dyn:rotate-180"
                            title="Dəyişdir"
                          >
                            <span className="material-symbols-outlined text-[16px]">sync</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </h1>

                {/* DYNAMIC TITLE INDICATOR PILLS */}
                {rotatingTitles.length > 1 && (
                  <div className="flex items-center gap-2 pt-3 anim-hero-desc">
                    <div className="h-[2px] w-8 bg-gradient-to-r from-[#c5a059] to-transparent rounded-full" />
                    <div className="flex items-center gap-1.5">
                      {rotatingTitles.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectTitleIdx(i)}
                          className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                            i === activeTitleIdx
                              ? 'w-6 bg-[#c5a059] shadow-[0_0_8px_rgba(197,160,89,0.7)]'
                              : 'w-1.5 bg-[#e2d9c8] hover:bg-[#c5a059]/60'
                          }`}
                          aria-label={`Title ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DESCRIPTION */}
            {descText && (
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal anim-hero-desc">
                {descText}
              </p>
            )}

            {/* CTA BUTTONS */}
            {hasCtas && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 anim-hero-cta">
                {primaryBtnText && (
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
                )}

                {secondaryBtnText && (
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
                )}
              </div>
            )}

            {/* STATS STRIP */}
            {hasStats && (
              <div className="pt-8 border-t border-[#e2d9c8]/70 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl anim-hero-stats">
                {stat1Num && (
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#070f1e] tracking-tight">
                      {stat1Num}
                    </div>
                    {stat1Label && (
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[0.14em] uppercase">
                        {stat1Label}
                      </div>
                    )}
                  </div>
                )}
                {stat2Num && (
                  <div className="border-l border-[#e2d9c8]/80 pl-4 sm:pl-6 space-y-1">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#775a19] tracking-tight">
                      <span className="gold-shimmer-text">{stat2Num}</span>
                    </div>
                    {stat2Label && (
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[0.14em] uppercase">
                        {stat2Label}
                      </div>
                    )}
                  </div>
                )}
                {stat3Num && (
                  <div className="border-l border-[#e2d9c8]/80 pl-4 sm:pl-6 space-y-1">
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#070f1e] tracking-tight">
                      {stat3Num}
                    </div>
                    {stat3Label && (
                      <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[0.14em] uppercase">
                        {stat3Label}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT MEDIA */}
          {hasMedia && (
            <div className="lg:col-span-5 relative flex justify-center anim-hero-media">
              <div className="relative w-full" style={{ maxWidth: mediaStyles.maxWidth }}>
                {hero.showGlow !== false && (
                  <div className="absolute -inset-6 bg-gradient-to-tr from-[#c5a059]/20 via-[#c5a059]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                )}

                {/* FLOATING LUXURY PILL BADGE */}
                {floatingBadgeText && (
                  <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#070f1e]/85 backdrop-blur-md border border-[#c5a059]/40 text-white shadow-lg flex items-center gap-1.5 pointer-events-none">
                    <span className="material-symbols-outlined text-[#c5a059] text-[15px]">verified</span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase">
                      {floatingBadgeText}
                    </span>
                  </div>
                )}

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
                    ) : hero.image ? (
                      <img
                        alt="Hero"
                        className="w-full h-full filter contrast-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                        style={{ objectFit: mediaStyles.objectFit }}
                        src={hero.image}
                      />
                    ) : null}
                  </div>

                  {/* QUOTE OVERLAY */}
                  {hero.showQuote !== false && quoteText && (
                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-[#c5a059]/35 text-center shadow-xl pointer-events-auto anim-hero-quote">
                      <div className="flex items-center justify-center gap-1 mb-1 text-[#c5a059]">
                        <span className="material-symbols-outlined text-[18px]">format_quote</span>
                      </div>
                      <div className="font-serif text-sm sm:text-base italic text-[#070f1e] font-medium leading-snug">
                        "{quoteText}"
                      </div>
                      {quoteSubText && (
                        <div className="text-[10px] font-semibold tracking-[0.2em] text-[#775a19] uppercase mt-2">
                          {quoteSubText}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

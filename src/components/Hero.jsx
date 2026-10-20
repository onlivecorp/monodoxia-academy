import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
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
  const quoteText = getLocalized(hero, 'quote', currentLang, defaultLang) || (hero.quote !== undefined && hero.quote !== null && String(hero.quote).trim() !== '' ? hero.quote : t('hero_quote'));
  const quoteSubText = getLocalized(hero, 'quoteSub', currentLang, defaultLang) || (hero.quoteSub !== undefined && hero.quoteSub !== null && String(hero.quoteSub).trim() !== '' ? hero.quoteSub : t('hero_philosophy'));

  // Top Badge features
  const showBadge = hero.showBadge !== false;
  const badgeIcon = hero.badgeIcon || 'sparkles';
  const showBadgeBeacon = hero.showBadgeBeacon !== false;
  const showBadgeIcon = hero.showBadgeIcon !== false;
  const badgeStyle = hero.badgeStyle || 'glass';

  // Headline features
  const title1Animation = hero.title1Animation !== false;
  const title2Shimmer = hero.title2Shimmer !== false;
  const title2Italic = hero.title2Italic !== false;
  const title2Color = hero.title2Color || '';
  const headlineSize = hero.headlineSize || 'normal';

  // Rotating headline & indicator features
  const showRotatingIndicator = hero.showRotatingIndicator !== false;
  const showRotatingSyncIcon = hero.showRotatingSyncIcon !== false;
  const rotationInterval = Number(hero.rotationInterval) || 3800;

  // Description features
  const showDesc = hero.showDesc !== false;
  const descSize = hero.descSize || 'normal';
  const descWidth = hero.descWidth || 'xl';

  // CTA button features
  const showBtnPrimary = hero.showBtnPrimary !== false;
  const btnPrimaryIcon = hero.btnPrimaryIcon || 'north_east';
  const btnPrimaryShowIcon = hero.btnPrimaryShowIcon !== false;
  const btnPrimaryStyle = hero.btnPrimaryStyle || 'dark';
  const btnPrimaryNewTab = hero.btnPrimaryNewTab === true;

  const showBtnSecondary = hero.showBtnSecondary !== false;
  const btnSecondaryIcon = hero.btnSecondaryIcon || 'arrow_forward';
  const btnSecondaryShowIcon = hero.btnSecondaryShowIcon !== false;
  const btnSecondaryStyle = hero.btnSecondaryStyle || 'glass';
  const btnSecondaryNewTab = hero.btnSecondaryNewTab === true;

  const mediaBadgeText = getLocalized(hero, 'mediaBadgeText', currentLang, defaultLang) || hero.mediaBadgeText || 'Beynəlxalq Standart';
  const mediaBadgeIcon = hero.mediaBadgeIcon || 'verified';
  const showMediaBadge = hero.showMediaBadge !== false;
  const showStats = hero.showStats !== false;
  const isRotatingEnabled = hero.enableRotatingTitles === true || Boolean(hero.rotatingTitles);
  const rotatingBadgeText = getLocalized(hero, 'rotatingBadgeText', currentLang, defaultLang) || hero.rotatingBadgeText || (currentLang === 'az' ? 'Daimi İnkişaf' : currentLang === 'ru' ? 'Трансформация' : 'Lifelong Evolution');

  // Dynamic rotating titles for high-end kinetic headline
  const rotatingTitles = useMemo(() => {
    const defaultTitle = typeof title3 === 'string' && title3.trim() ? title3 : 'Həyatını dəyiş.';
    if (!isRotatingEnabled) {
      return [defaultTitle];
    }
    const customArray = getLocalizedArray(hero, 'rotatingTitles', currentLang, defaultLang);
    if (Array.isArray(customArray) && customArray.length > 0) {
      const items = customArray.map(s => String(s).trim()).filter(Boolean);
      if (items.length > 0) return items;
    }
    const rawVal = getLocalized(hero, 'rotatingTitles', currentLang, defaultLang) || hero.rotatingTitles;
    if (rawVal) {
      const items = (Array.isArray(rawVal) ? rawVal : String(rawVal).split(/\r?\n|,/))
        .map(s => String(s).trim())
        .filter(Boolean);
      if (items.length > 0) return items;
    }
    const listByLang = {
      az: [
        'Potensialını kəşf et.',
        'Daxili gücünü tap.',
        'Şüurlu gələcək qur.',
        'Öz zirvənə çat.'
      ],
      en: [
        'Unlock your potential.',
        'Awaken inner clarity.',
        'Architect your future.',
        'Master your mind.'
      ],
      ru: [
        'Раскрой свой потенциал.',
        'Обрети внутреннюю силу.',
        'Строй осознанное будущее.',
        'Достигни своих вершин.'
      ],
      tr: [
        'Potansiyelini keşfet.',
        'İçsel gücünü bul.',
        'Bilinçli gelecek kur.',
        'Kendi zirvene ulaş.'
      ]
    };
    const langKey = currentLang && listByLang[currentLang] ? currentLang : 'az';
    const presets = listByLang[langKey] || listByLang.az;
    return presets.length > 0 ? presets : [defaultTitle];
  }, [title3, currentLang, isRotatingEnabled, hero.rotatingTitles, hero.translations, defaultLang]);

  const [activeTitleIdx, setActiveTitleIdx] = useState(0);
  const [isTitleExiting, setIsTitleExiting] = useState(false);
  const [isTitlePaused, setIsTitlePaused] = useState(false);
  const transitionTimerRef = useRef(null);

  // Cycle rotating title automatically using configured rotationInterval
  useEffect(() => {
    if (rotatingTitles.length <= 1 || isTitlePaused) return;

    const interval = setInterval(() => {
      setIsTitleExiting(true);
      transitionTimerRef.current = setTimeout(() => {
        setActiveTitleIdx((prev) => (prev + 1) % rotatingTitles.length);
        setIsTitleExiting(false);
      }, 380);
    }, rotationInterval);

    return () => {
      clearInterval(interval);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [rotatingTitles.length, isTitlePaused, rotationInterval]);

  // Reset index if language changes
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
    if (btnPrimaryNewTab) return;
    if (!hero.btnPrimaryLink || hero.btnPrimaryLink.startsWith('/') || hero.btnPrimaryLink === 'akademiya') {
      e.preventDefault();
      const target = hero.btnPrimaryLink ? hero.btnPrimaryLink.replace(/^\//, '') : 'akademiya';
      navigateTo(target);
    }
  };

  const handleSecondaryClick = (e) => {
    if (btnSecondaryNewTab) return;
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
    return ['Özünü', 'tanı.'];
  }, [title1]);

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
          <div className="lg:col-span-7 space-y-6 md:space-y-8 relative">
            {/* AMBIENT GOLD HALO FOR HERO TYPOGRAPHY */}
            <div className="hero-title-halo" />

            {/* BADGE WITH SHIMMER AND PULSING BEACON */}
            {showBadge && (
              <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full shadow-sm anim-hero-badge relative group transition-all duration-300 ${
                badgeStyle === 'dark' 
                  ? 'border border-[#c5a059]/60 bg-[#070f1e] text-[#fbf9f5] hover:bg-[#0c182b]'
                  : badgeStyle === 'gold'
                  ? 'border border-[#c5a059] bg-[#c5a059]/15 text-[#775a19] hover:bg-[#c5a059]/25'
                  : badgeStyle === 'minimal'
                  ? 'border border-[#e2d9c8] bg-white/60 text-[#775a19] hover:bg-white'
                  : 'border border-[#c5a059]/40 bg-white/80 hover:bg-white backdrop-blur-md'
              }`}>
                {showBadgeBeacon && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9e782f]"></span>
                  </span>
                )}
                <span className={`text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase select-none ${
                  badgeStyle === 'dark' ? 'text-[#f5e6c8]' : 'text-[#775a19]'
                }`}>
                  {badgeText}
                </span>
                {showBadgeIcon && (
                  <span className="material-symbols-outlined text-[13px] text-[#c5a059] opacity-80 group-hover:rotate-45 transition-transform duration-500">
                    {badgeIcon}
                  </span>
                )}
              </div>
            )}

            {/* HEADLINE WITH KINETIC REVEAL & DYNAMIC ROTATING TITLE */}
            <div 
              className="relative z-10"
              onMouseEnter={() => setIsTitlePaused(true)}
              onMouseLeave={() => setIsTitlePaused(false)}
            >
              <h1 className={`${
                headlineSize === 'compact'
                  ? 'text-3xl sm:text-4xl lg:text-[3.1rem] xl:text-[3.5rem]'
                  : headlineSize === 'large'
                  ? 'text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-[4.75rem]'
                  : 'text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.15rem]'
              } text-[#070f1e] font-serif font-medium tracking-tight leading-[1.14]`}>
                {/* LINE 1: WORD-BY-WORD STAGGERED REVEAL OR CLEAN */}
                <div className="hero-text-mask flex flex-wrap items-baseline">
                  {title1Animation ? (
                    title1Words.map((word, idx) => (
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
                    ))
                  ) : (
                    <span className="cursor-default">{title1}</span>
                  )}
                </div>

                {/* LINE 2: LIQUID GOLD SHIMMER & LUXURY ITALIC FOCUS */}
                <div className="hero-text-mask mt-0.5">
                  <span 
                    className={`block cursor-default select-none transition-all ${
                      title2Italic ? 'italic' : 'font-serif font-medium'
                    } ${
                      title2Shimmer ? 'gold-shimmer-text anim-hero-line-2 hover:brightness-110' : ''
                    }`}
                    style={!title2Shimmer && title2Color ? { color: title2Color } : (!title2Shimmer ? { color: '#775a19' } : {})}
                  >
                    {title2}
                  </span>
                </div>

                {/* LINE 3: DYNAMIC 3D KINETIC TITLE SWITCHER OR CLEAN STATIC LINE */}
                <div className="hero-text-mask relative mt-1 min-h-[1.25em] flex items-baseline">
                  {rotatingTitles.length > 1 ? (
                    <div
                      onClick={handleNextTitle}
                      title="Növbəti hədəf (dəyişmək üçün klikləyin)"
                      className={`inline-flex items-center gap-3 cursor-pointer select-none group/dyn transition-all ${
                        isTitleExiting ? 'anim-hero-dynamic-exit' : 'anim-hero-dynamic-enter'
                      }`}
                    >
                      <span className="block font-medium tracking-tight text-[#070f1e] group-hover/dyn:text-[#775a19] transition-colors duration-300">
                        {rotatingTitles[activeTitleIdx] || title3}
                      </span>
                      {showRotatingSyncIcon && (
                        <span 
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c5a059]/15 text-[#775a19] opacity-70 group-hover/dyn:opacity-100 group-hover/dyn:bg-[#c5a059]/25 transition-all duration-300 transform group-hover/dyn:rotate-180"
                          title="Dəyişdir"
                        >
                          <span className="material-symbols-outlined text-[16px]">sync</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="block font-medium tracking-tight text-[#070f1e]">
                      {title3}
                    </span>
                  )}
                </div>
              </h1>

              {/* DYNAMIC TITLE INDICATOR PILLS */}
              {rotatingTitles.length > 1 && showRotatingIndicator && (
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
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#775a19]/75 select-none hidden sm:inline">
                    {rotatingBadgeText}
                  </span>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            {showDesc && (
              <p className={`${
                descSize === 'sm' ? 'text-sm sm:text-base' : descSize === 'lg' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
              } ${
                descWidth === '2xl' ? 'max-w-2xl' : descWidth === 'full' ? 'max-w-none' : 'max-w-xl'
              } text-slate-600 leading-relaxed font-normal anim-hero-desc`}>
                {descText}
              </p>
            )}

            {/* CTA BUTTONS */}
            {(showBtnPrimary || showBtnSecondary) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 anim-hero-cta">
                {showBtnPrimary && (
                  <a
                    className={`group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg text-sm tracking-wide transition-all duration-300 cursor-pointer overflow-hidden ${
                      btnPrimaryStyle === 'gold'
                        ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] hover:from-[#b8934b] hover:to-[#c5a059] text-[#070f1e] font-bold border border-[#f5e6c8]/60 shadow-lg shadow-[#c5a059]/25 hover:shadow-xl hover:shadow-[#c5a059]/35 hover:-translate-y-0.5'
                        : btnPrimaryStyle === 'outline'
                        ? 'bg-transparent hover:bg-[#070f1e] text-[#070f1e] hover:text-white font-semibold border-2 border-[#070f1e] shadow-sm hover:-translate-y-0.5'
                        : 'bg-[#070f1e] hover:bg-[#0d1c32] text-white font-semibold border border-[#c5a059]/40 shadow-lg shadow-[#070f1e]/15 hover:shadow-xl hover:shadow-[#c5a059]/20 hover:-translate-y-0.5'
                    }`}
                    href={primaryLink}
                    target={btnPrimaryNewTab ? '_blank' : undefined}
                    rel={btnPrimaryNewTab ? 'noopener noreferrer' : undefined}
                    onClick={handlePrimaryClick}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                    <span>{primaryBtnText}</span>
                    {btnPrimaryShowIcon && (
                      <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                        btnPrimaryStyle === 'gold' ? 'text-[#070f1e]' : 'text-[#c5a059]'
                      }`}>
                        {btnPrimaryIcon}
                      </span>
                    )}
                  </a>
                )}

                {showBtnSecondary && (
                  <a
                    className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                      btnSecondaryStyle === 'outline'
                        ? 'bg-transparent hover:bg-[#c5a059]/10 text-[#775a19] border-2 border-[#c5a059] shadow-none hover:-translate-y-0.5'
                        : btnSecondaryStyle === 'light'
                        ? 'bg-[#f4efe6] hover:bg-[#ede5d6] text-[#070f1e] hover:text-[#775a19] border border-[#d8cdb8] shadow-sm hover:-translate-y-0.5'
                        : 'bg-white/70 hover:bg-[#c5a059]/10 text-[#070f1e] hover:text-[#775a19] border border-[#c5a059]/60 hover:border-[#c5a059] shadow-sm backdrop-blur-sm hover:-translate-y-0.5'
                    }`}
                    href={secondaryLink}
                    target={btnSecondaryNewTab ? '_blank' : undefined}
                    rel={btnSecondaryNewTab ? 'noopener noreferrer' : undefined}
                    onClick={handleSecondaryClick}
                  >
                    <span>{secondaryBtnText}</span>
                    {btnSecondaryShowIcon && (
                      <span className="material-symbols-outlined text-[18px] opacity-70">
                        {btnSecondaryIcon}
                      </span>
                    )}
                  </a>
                )}
              </div>
            )}

            {/* STATS STRIP */}
            {showStats && (
              <div className="pt-8 border-t border-[#e2d9c8]/70 grid grid-cols-3 gap-4 sm:gap-6 max-w-xl anim-hero-stats">
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
            )}
          </div>

          {/* RIGHT MEDIA */}
          <div className="lg:col-span-5 relative flex justify-center items-center anim-hero-media w-full">
            <div className="relative w-full mx-auto" style={{ maxWidth: mediaStyles.maxWidth, width: '100%' }}>
              {hero.showGlow !== false && (
                <div className="absolute -inset-6 bg-gradient-to-tr from-[#c5a059]/20 via-[#c5a059]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              )}

              {/* FLOATING LUXURY PILL BADGE */}
              {showMediaBadge && (
                <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-[#070f1e]/85 backdrop-blur-md border border-[#c5a059]/40 text-white shadow-lg flex items-center gap-1.5 pointer-events-none">
                  <span className="material-symbols-outlined text-[#c5a059] text-[15px]">{mediaBadgeIcon}</span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase">
                    {mediaBadgeText}
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
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-xl border border-[#c5a059]/35 text-center shadow-xl pointer-events-auto anim-hero-quote">
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

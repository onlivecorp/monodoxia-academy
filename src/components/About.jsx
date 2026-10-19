import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import { getAboutMediaStyles, parseVideoUrl } from '../utils/heroMediaHelper';

export default function About() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { homeContent, pillarsList } = useApp();
  const about = homeContent?.about || {};
  const activePillars = (about?.pillars && Array.isArray(about.pillars) && about.pillars.length > 0)
    ? about.pillars
    : (pillarsList || []);

  const mediaStyles = getAboutMediaStyles(about);
  const parsedVideo = parseVideoUrl(about.videoUrl);
  const isVideo = about.mediaType === 'video' && Boolean(about.videoUrl);
  const showBadges = about.showBadges !== false && (Boolean(about.imageBadgeLeft) || Boolean(about.imageBadgeRight) || !about.showBadges);

  const badgeText = getLocalized(about, 'badge', currentLang, defaultLang) || t('about_badge');
  const titleText = getLocalized(about, 'title', currentLang, defaultLang) || t('about_title');
  const descText = getLocalized(about, 'desc', currentLang, defaultLang) || t('about_desc');
  const badgeLeft = getLocalized(about, 'imageBadgeLeft', currentLang, defaultLang) || 'Gündəlik Fərqindəlik';
  const badgeRight = getLocalized(about, 'imageBadgeRight', currentLang, defaultLang) || '01 / SÜKUT';

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#fbf9f5] border-b border-[#e2d9c8]/70" id="haqqimizda">
      {/* AMBIENT LUXURY GLOW */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-[#c5a059]/10 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div className="absolute top-10 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-[#0a192f]/5 via-[#c5a059]/8 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #070f1e 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* IMAGE / MEDIA BLOCK */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full" style={{ maxWidth: mediaStyles.maxWidth }}>
              {/* AMBIENT MEDIA HALO */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#c5a059]/15 via-transparent to-[#0a192f]/5 rounded-3xl blur-2xl pointer-events-none" />

              {/* MEDIA CONTAINER */}
              <div
                className={`relative shadow-2xl overflow-hidden transition-all duration-300 group ${
                  mediaStyles.isFrameless
                    ? 'bg-transparent p-0 shadow-none'
                    : 'bg-white p-3 shadow-[0_20px_45px_rgba(7,15,30,0.12)] border border-[#e2d9c8]/60'
                }`}
                style={{
                  borderRadius: mediaStyles.outerRadius,
                  border: mediaStyles.strokeWidth > 0 ? `${mediaStyles.strokeWidth}px solid ${mediaStyles.strokeColor}` : undefined
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
                        title="About Video"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={parsedVideo.rawUrl || about.videoUrl}
                        poster={about.videoPoster || about.image}
                        autoPlay={about.videoAutoplay !== false}
                        loop={about.videoLoop !== false}
                        muted={about.videoMuted !== false}
                        controls={about.videoControls === true}
                        playsInline
                        className="w-full h-full"
                        style={{ objectFit: mediaStyles.objectFit }}
                      />
                    )
                  ) : (
                    <img
                      alt="Still life of mindfulness journal and warm tea"
                      className="w-full h-full filter contrast-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
                      style={{ objectFit: mediaStyles.objectFit }}
                      src={
                        about.image ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJ9v48nWJzTbw80sDrDtTVhJ3mvXbVUbCeHjTMi_Y-NUPyOTMrFxaSuOPQsSmEsuH1iFUesyI1GA23YGlZQlqzMJLdnrhTp12XLt8NPffBd1uWx8YenygyqGA2zja0D9d-rKVoNVykmJRjh03f9EEtW4IghPWZy_-gBbdmrV1VbwrBwzlJWS1Ixvco8e0IdrYq8AHbaR5Pdystz7aBbXr4cWkfac3BRp_ESWqbNA0K6eg7X2YuuMP"
                      }
                    />
                  )}
                </div>

                {/* BADGES / LABELS STRIP */}
                {showBadges && (
                  <div className={`flex items-center justify-between border-t border-[#e2d9c8]/50 ${mediaStyles.isFrameless ? 'pt-3 px-1' : 'pt-3 pb-1 px-2'}`}>
                    <span className="text-[11px] font-semibold text-[#775a19] tracking-[0.2em] uppercase font-sans">
                      {badgeLeft}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-500 tracking-wider">
                      {badgeRight}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONTENT BLOCK */}
          <div className="lg:col-span-7 space-y-6">
            {/* BADGE */}
            <div className="inline-flex items-center gap-3 animate-text-reveal">
              <span className="w-8 h-[2px] bg-gradient-to-r from-[#8a6a1f] to-[#c5a059] rounded-full"></span>
              <span className="text-xs font-semibold text-[#775a19] tracking-[0.22em] uppercase font-sans">
                {badgeText}
              </span>
            </div>

            {/* HEADLINE */}
            <h2 className="text-2xl sm:text-3xl lg:text-[2.6rem] text-[#070f1e] font-serif font-medium tracking-tight leading-[1.22] animate-text-reveal animate-delay-100">
              {titleText}
            </h2>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl animate-text-reveal-soft animate-delay-200">
              {descText}
            </p>

            {/* PILLARS DYNAMIC LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-3">
              {activePillars.map((p) => (
                <div 
                  key={p.id} 
                  className="group relative p-6 rounded-xl bg-white/70 hover:bg-white border border-[#e2d9c8]/70 hover:border-[#c5a059]/60 shadow-sm hover:shadow-xl hover:shadow-[#c5a059]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle Top Accent on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* ICON */}
                  <div className="w-11 h-11 rounded-lg bg-[#fbf9f5] group-hover:bg-[#070f1e] border border-[#c5a059]/30 group-hover:border-[#070f1e] text-[#8a6a1f] group-hover:text-[#c5a059] flex items-center justify-center mb-4 transition-all duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover:scale-110">
                      {p.icon || 'psychology'}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="font-serif text-lg font-semibold text-[#070f1e] group-hover:text-[#775a19] transition-colors mb-2">
                    {getLocalized(p, 'title', currentLang, defaultLang)}
                  </h3>

                  {/* DESC */}
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {getLocalized(p, 'desc', currentLang, defaultLang)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

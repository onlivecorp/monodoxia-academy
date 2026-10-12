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
  const showBadges = about.showBadges !== false && (Boolean(about.imageBadgeLeft) || Boolean(about.imageBadgeRight));

  return (
    <section className="py-space-2xl md:py-space-3xl bg-surface-container-low border-b border-outline-variant/40" id="haqqimizda">
      <div className="max-w-7xl mx-auto px-gutter md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* IMAGE / MEDIA BLOCK */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full" style={{ maxWidth: mediaStyles.maxWidth }}>
              {/* MEDIA CONTAINER */}
              <div
                className={`relative shadow-md overflow-hidden transition-all duration-300 ${
                  mediaStyles.isFrameless
                    ? 'bg-transparent p-0 shadow-none'
                    : 'bg-surface-container-lowest p-2.5'
                }`}
                style={{
                  borderRadius: mediaStyles.outerRadius,
                  border: mediaStyles.strokeWidth > 0 ? `${mediaStyles.strokeWidth}px solid ${mediaStyles.strokeColor}` : 'none'
                }}
              >
                <div
                  className="overflow-hidden w-full bg-surface-container relative"
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
                      className="w-full h-full filter brightness-[0.98] hover:scale-105 transition-transform duration-700"
                      style={{ objectFit: mediaStyles.objectFit }}
                      src={
                        about.image ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJ9v48nWJzTbw80sDrDtTVhJ3mvXbVUbCeHjTMi_Y-NUPyOTMrFxaSuOPQsSmEsuH1iFUesyI1GA23YGlZQlqzMJLdnrhTp12XLt8NPffBd1uWx8YenygyqGA2zja0D9d-rKVoNVykmJRjh03f9EEtW4IghPWZy_-gBbdmrV1VbwrBwzlJWS1Ixvco8e0IdrYq8AHbaR5Pdystz7aBbXr4cWkfac3BRp_ESWqbNA0K6eg7X2YuuMP"
                      }
                    />
                  )}
                </div>

                {/* BADGES / LABELS */}
                {showBadges && (
                  <div className={`flex items-center justify-between ${mediaStyles.isFrameless ? 'pt-3 px-1' : 'p-3'}`}>
                    <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
                      {getLocalized(about, 'imageBadgeLeft', currentLang, defaultLang) || 'Gündəlik Fərqindəlik'}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {getLocalized(about, 'imageBadgeRight', currentLang, defaultLang) || '01 / SÜKUT'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* CONTENT BLOCK */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[1px] bg-secondary"></span>
              <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
                {getLocalized(about, 'badge', currentLang, defaultLang) || t('about_badge')}
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary font-serif">
              {getLocalized(about, 'title', currentLang, defaultLang) || t('about_title')}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {getLocalized(about, 'desc', currentLang, defaultLang) || t('about_desc')}
            </p>
            {/* PILLARS DYNAMIC LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {activePillars.map((p) => (
                <div key={p.id} className="p-5 rounded bg-surface-container-lowest border border-outline-variant/40 hover:border-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">{p.icon || 'psychology'}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                    {getLocalized(p, 'title', currentLang, defaultLang)}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
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

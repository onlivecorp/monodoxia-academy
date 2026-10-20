import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Club() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { clubTiersList, homeContent, openApplication, currentUser, applicationsList, userTier } = useApp();
  const club = homeContent?.club || {};

  const premiumTier = clubTiersList.find(t => t.id === 'premium') || clubTiersList[2];
  const userClubApp = currentUser ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === (premiumTier?.id || 'premium') && !a.archived) : null;

  const defaultPerks = [
    "Həftəlik canlı mentorluq və mastermind sessiyaları: Təcrübəli mentorlarla birbaşa dialoq.",
    "Özəl meditasiya və təcrübə arxivi: 100+ saatlıq audio və video bələdçilər.",
    "Qapalı intellektual icma müzakirələri: Konfidensial təhlükəsiz platforma.",
    "Oflayn tədbirlərə və retreat-lərə VIP giriş: Qapalı illik düşərgələr."
  ];
  const clubPerks = getLocalizedArray(club, 'perks', currentLang, defaultLang);
  const perks = clubPerks && clubPerks.length > 0 ? clubPerks : (club.perks && club.perks.length > 0 ? club.perks : defaultPerks);

  const tierBadge = getLocalized(club, 'tierBadge', currentLang, defaultLang) || 'PREMIUM REZİDENT';
  const tierName = getLocalized(club, 'tierTitle', currentLang, defaultLang) || (premiumTier ? getLocalized(premiumTier, 'name', currentLang, defaultLang) : t('club_tier_title'));
  const tierSubtitle = getLocalized(club, 'tierSubtitle', currentLang, defaultLang) || t('club_tier_sub');
  const tierPrice = (club.tierPrice !== undefined && club.tierPrice !== null && String(club.tierPrice).trim() !== '') ? club.tierPrice : (premiumTier ? premiumTier.price : '95');
  const tierPeriod = getLocalized(club, 'tierPeriod', currentLang, defaultLang) || (premiumTier ? getLocalized(premiumTier, 'period', currentLang, defaultLang) : (t('club_tier_period') || '/ aylıq'));
  const tierOffer = getLocalized(club, 'tierOffer', currentLang, defaultLang) || t('club_tier_offer');
  
  const clubFeatures = getLocalizedArray(club, 'tierFeatures', currentLang, defaultLang);
  const tierFeatures = clubFeatures && clubFeatures.length > 0
    ? clubFeatures
    : (premiumTier ? getLocalizedArray(premiumTier, 'features', currentLang, defaultLang) : []);
  const tierCtaText = getLocalized(club, 'tierCtaText', currentLang, defaultLang) || t('club_tier_cta');

  const badgeText = getLocalized(club, 'badge', currentLang, defaultLang) || (club.badge !== undefined && club.badge !== null && String(club.badge).trim() !== '' ? club.badge : t('club_badge'));
  const titleText = getLocalized(club, 'title', currentLang, defaultLang) || (club.title !== undefined && club.title !== null && String(club.title).trim() !== '' ? club.title : t('club_title'));
  const descText = getLocalized(club, 'desc', currentLang, defaultLang) || (club.desc !== undefined && club.desc !== null && String(club.desc).trim() !== '' ? club.desc : t('club_desc'));

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-br from-[#051124] via-[#091b36] to-[#040e1c] text-white border-b border-[#0a192f]" id="club">
      {/* AMBIENT LUXURY GLOW & GEOMETRIC ACCENTS */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-1/4 -right-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-bl from-[#c5a059]/15 via-[#c5a059]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-[#c5a059]/10 via-[#0a192f]/20 to-transparent blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/40 bg-[#c5a059]/10 backdrop-blur-md shadow-sm anim-badge">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e9c176]"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#e9c176] tracking-[0.2em] uppercase font-sans">
                {badgeText}
              </span>
            </div>

            {/* HEADLINE */}
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-medium text-white tracking-tight leading-[1.2] anim-club-title">
              <span className="block">{titleText}</span>
            </h2>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl anim-subtext">
              {descText}
            </p>

            {/* PRIVILEGES LIST */}
            <ul className="space-y-4 pt-2">
              {perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#e9c176] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                  </div>
                  <span className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>

            {/* ACTION & CAPACITY STATUS */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => openApplication(premiumTier || { id: 'premium', title: tierName, price: `₼ ${tierPrice}` }, 'club')}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e9c176] to-[#c5a059] hover:from-[#c5a059] hover:to-[#b98d2c] text-[#070f1e] font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#c5a059]/25 hover:shadow-xl hover:shadow-[#c5a059]/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <span>
                  {userTier === 'Premium' || userTier === 'VIP' 
                    ? 'Rezident Statusunuz Aktivdir' 
                    : (userClubApp ? `Müraciət: ${userClubApp.status}` : (getLocalized(club, 'ctaBtnText', currentLang, defaultLang) || t('club_join_btn')))}
                </span>
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              </button>

              <span className="text-xs text-slate-300 flex items-center gap-1.5 justify-center sm:justify-start px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="material-symbols-outlined text-[16px] text-[#e9c176]">lock</span>
                <span>{getLocalized(club, 'limitedText', currentLang, defaultLang) || t('club_limited')}</span>
              </span>
            </div>
          </div>

          {/* RIGHT TIER CARD */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Halo behind card */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#c5a059]/20 via-[#c5a059]/10 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative bg-white/95 backdrop-blur-xl text-[#070f1e] p-8 sm:p-9 rounded-2xl border border-[#c5a059]/50 shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
              {/* Floating Pill Badge */}
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#9e782f] via-[#c5a059] to-[#8a6a1f] text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">stars</span>
                <span>{tierBadge}</span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-serif text-2xl font-bold text-[#070f1e]">
                {tierName}
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6 font-normal">
                {tierSubtitle}
              </p>

              {/* Price Block */}
              <div className="py-4 border-y border-[#e2d9c8]/70 mb-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-serif font-bold gold-shimmer-text">
                    ₼ {tierPrice}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {tierPeriod}
                  </span>
                </div>
                {tierOffer && (
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#c5a059]/15 text-[#775a19] text-xs font-semibold mt-2 border border-[#c5a059]/30">
                    {tierOffer}
                  </div>
                )}
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8">
                {tierFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <span className="material-symbols-outlined text-[#775a19] text-[18px] shrink-0">check_circle</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Card Action Button */}
              <button
                onClick={() => openApplication(premiumTier || { id: 'premium', title: tierName, price: `₼ ${tierPrice}` }, 'club')}
                className="w-full py-4 text-center bg-[#070f1e] hover:bg-[#112240] text-white rounded-xl text-xs font-semibold uppercase tracking-[0.16em] border border-[#c5a059]/40 shadow-lg shadow-[#070f1e]/25 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                {userTier === 'Premium' || userTier === 'VIP' ? 'Aktiv Rezident' : (userClubApp ? `Müraciət Statusu: ${userClubApp.status}` : tierCtaText)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

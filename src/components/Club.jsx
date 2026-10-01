import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Club() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { joinClubTier, clubTiersList, homeContent, openApplication, currentUser, applicationsList, userTier } = useApp();
  const club = homeContent?.club || {};

  const premiumTier = clubTiersList.find(t => t.id === 'premium') || clubTiersList[2];
  const userClubApp = currentUser ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === (premiumTier?.id || 'premium') && !a.archived) : null;

  const defaultPerks = [
    "Həftəlik canlı mentorluq və mastermind sessiyaları: Təcrübəli mentorlarla birbaşa dialoq.",
    "Özəl meditasiya və təcrübə arxivi: 100+ saatlıq audio və video bələdçilər.",
    "Qapalı intellektual icma müzakirələri: Konfidensial təhlükəsiz platforma.",
    "Oflayn tədbirlərə və retreat-lərə VIP giriş: Qapalı illik düşərgələr."
  ];
  const perks = club.perks && club.perks.length > 0 ? club.perks : defaultPerks;

  const tierName = premiumTier ? getLocalized(premiumTier, 'name', currentLang, defaultLang) : t('club_tier_title');
  const tierPeriod = premiumTier ? getLocalized(premiumTier, 'period', currentLang, defaultLang) : '/ aylıq';
  const tierFeatures = premiumTier ? getLocalizedArray(premiumTier, 'features', currentLang, defaultLang) : [];

  return (
    <section className="py-space-2xl md:py-space-3xl bg-primary-container text-on-primary relative overflow-hidden" id="club">
      <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-gutter md:px-margin relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary-fixed/40 bg-secondary-fixed/10">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>
              <span className="font-label-sm text-label-sm text-secondary-fixed tracking-widest uppercase">
                {getLocalized(club, 'badge', currentLang, defaultLang) || t('club_badge')}
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl font-serif text-surface-bright">
              {getLocalized(club, 'title', currentLang, defaultLang) || t('club_title')}
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed">
              {getLocalized(club, 'desc', currentLang, defaultLang) || t('club_desc')}
            </p>
            <ul className="space-y-4 pt-2">
              {perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary-fixed text-[20px] mt-0.5">verified</span>
                  <span className="font-body-md text-body-md text-surface-bright">
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => openApplication(premiumTier || { id: 'premium', title: 'Premium Rezidentlik', price: '₼ 95' }, 'club')}
                className="bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container px-8 py-3.5 rounded text-label-lg font-label-lg tracking-wider text-center transition-colors font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <span>{userTier === 'Premium' || userTier === 'VIP' ? 'Rezident Statusunuz Aktivdir' : (userClubApp ? `Müraciət: ${userClubApp.status}` : (getLocalized(club, 'ctaBtnText', currentLang, defaultLang) || t('club_join_btn')))}</span>
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              </button>
              <span className="text-xs text-on-primary-container flex items-center gap-1 justify-center sm:justify-start">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>{getLocalized(club, 'limitedText', currentLang, defaultLang) || t('club_limited')}</span>
              </span>
            </div>
          </div>

          {/* Dynamic Membership Tier Card */}
          <div className="lg:col-span-5">
            <div className="bg-surface-bright text-on-surface p-8 rounded-lg border border-secondary/40 shadow-2xl relative">
              <div className="absolute -top-3 right-6 bg-secondary text-surface-bright px-3 py-1 rounded text-label-sm font-label-sm uppercase tracking-widest">
                PREMIUM REZİDENT
              </div>
              <h3 className="font-headline-md text-headline-md font-serif text-primary">
                {tierName}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-6">
                {t('club_tier_sub')}
              </p>
              <div className="py-4 border-y border-outline-variant/40 mb-6">
                <span className="font-display-lg text-display-lg text-primary font-serif">
                  ₼ {premiumTier ? premiumTier.price : '95'}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  {' '}{tierPeriod}
                </span>
                <div className="text-xs text-secondary mt-1">{t('club_tier_offer')}</div>
              </div>
              <div className="space-y-3 mb-8">
                {tierFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => openApplication(premiumTier || { id: 'premium', title: 'Premium Rezidentlik', price: '₼ 95' }, 'club')}
                className="block w-full py-3 text-center bg-primary-container text-on-primary hover:bg-[#112240] rounded text-label-md font-label-md uppercase tracking-wider transition-colors shadow-sm"
              >
                {userTier === 'Premium' || userTier === 'VIP' ? 'Aktiv Rezident' : (userClubApp ? `Müraciət Statusu: ${userClubApp.status}` : t('club_tier_cta'))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

export default function ClubPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    homeContent,
    clubTiersList,
    joinClubTier,
    currentUser,
    userTier,
    applicationsList,
    openApplication
  } = useApp();

  const club = homeContent?.club || {};
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        badge={getLocalized(club, 'badge', currentLang, defaultLang) || 'Qapalı İcma Üzvliyi'}
        title={getLocalized(club, 'title', currentLang, defaultLang) || 'Monodoxia Coaching Club'}
        description={getLocalized(club, 'desc', currentLang, defaultLang) || 'Davamlı inkişaf fərdi bir hadisə deyil, doğru mühitin bəhrəsidir. Dərin suallar verən seçkin şəxslərin qapalı ekosistemi.'}
        breadcrumbs={[{ label: 'Coaching Club' }]}
        adminCmsBlock="club"
      >
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-outline-variant/40 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              {club.heroBadge1Icon || 'verified'}
            </span>
            <span>{getLocalized(club, 'heroBadge1Text', currentLang, defaultLang) || 'Məhdud Sayda Üzvlük'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              {club.heroBadge2Icon || 'groups'}
            </span>
            <span>{getLocalized(club, 'heroBadge2Text', currentLang, defaultLang) || 'Həftəlik Mastermind'}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">
              {club.heroBadge3Icon || 'spa'}
            </span>
            <span>{getLocalized(club, 'heroBadge3Text', currentLang, defaultLang) || '100+ Saatlıq Meditasiya Arxivi'}</span>
          </div>
        </div>
      </PageHero>

      {/* Main Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Billing Cycle Toggle */}
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="inline-flex items-center p-1 rounded-full bg-surface-container-low border border-outline-variant/60 shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Aylıq Ödəniş
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-secondary text-on-secondary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>İllik Abunəlik</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">2 AY HƏDİYYƏ</span>
              </button>
            </div>
            <p className="text-xs text-outline mt-3">İllik ödənişdə 2 ay hədiyyə və bütün tədbirlərə prioritet qeydiyyat haqqı verilir.</p>
          </div>

          {/* All Membership Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {(clubTiersList || []).map((tier) => {
              const currentTierStr = typeof userTier === 'string' ? userTier : (userTier?.id || userTier?.name || '');
              const isCurrentTier = currentTierStr.toLowerCase() === (tier.id || '').toLowerCase();
              const isPopular = tier.id === 'premium' || Boolean(tier.popular);
              const rawPrice = Number(tier.price) || 0;
              const displayPrice = billingCycle === 'annual' && rawPrice > 0
                ? Math.round(rawPrice * 10)
                : rawPrice;
              const periodText = billingCycle === 'annual' && rawPrice > 0 ? '/ illik' : (tier.period || '/ aylıq');
              const tierName = getLocalized(tier, 'name', currentLang, defaultLang) || tier.name || tier.id || 'Klub Rezidentliyi';
              const userTierApp = currentUser && Array.isArray(applicationsList)
                ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === tier.id && !a.archived)
                : null;

              return (
                <div
                  key={tier.id}
                  className={`bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border ${
                    isPopular
                      ? 'border-secondary ring-2 ring-secondary/30 shadow-lg relative'
                      : 'border-outline-variant/60 shadow-sm hover:border-secondary/60'
                  } flex flex-col justify-between transition-all duration-300`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-secondary text-on-secondary text-[10px] font-bold tracking-wider uppercase shadow-sm">
                      Ən Çox Seçilən
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="font-serif text-lg font-bold text-primary">{tierName}</h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {tier.id === 'free' && 'İctimai müzakirələrə giriş'}
                        {tier.id === 'basic' && 'Aylıq ümumi sessiyalar və materiallar'}
                        {tier.id === 'premium' && 'Bütün masterklaslar və VIP cəmiyyət'}
                        {tier.id === 'vip' && 'Fərdi kouçinq sessiyaları və eksklüziv qrup'}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="my-6 pb-6 border-b border-outline-variant/40">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-3xl font-bold text-primary">₼ {displayPrice}</span>
                        <span className="text-xs text-outline">{periodText}</span>
                      </div>
                      {billingCycle === 'annual' && rawPrice > 0 && (
                        <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                          Aylıq cəmi ~₼ {Math.round(displayPrice / 12)}
                        </span>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-8">
                      {(tier.features || []).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px] text-secondary shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Join CTA */}
                  <div>
                    {isCurrentTier ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Cari Rezidentliyiniz</span>
                      </button>
                    ) : userTierApp && userTierApp.status !== 'Ləğv edildi' && userTierApp.status !== 'Rədd edildi' ? (
                      <button
                        onClick={() => openApplication(tier, 'club')}
                        className="w-full py-2.5 px-4 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center justify-center gap-1.5 hover:bg-amber-200 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">pending</span>
                        <span>Müraciət: {userTierApp.status}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openApplication(tier, 'club')}
                        className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isPopular
                            ? 'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm'
                            : 'bg-primary text-on-primary hover:bg-primary/90'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">stars</span>
                        <span>{tier.id === 'free' ? 'Qoşul (Ödənişsiz)' : 'Rezident Ol'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Club Perks Highlights */}
          <div className="bg-surface-container-low border border-outline-variant/60 rounded-3xl p-8 sm:p-12 mb-16">
            <div className="max-w-3xl mb-10">
              <span className="text-xs text-secondary font-semibold uppercase tracking-widest">
                {getLocalized(club, 'perksBadge', currentLang, defaultLang) || 'Klub İmtiyazları'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1 mb-3">
                {getLocalized(club, 'perksTitle', currentLang, defaultLang) || 'Coaching Club Rezidentlərinə Nələr Təqdim Olunur?'}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {getLocalized(club, 'perksDesc', currentLang, defaultLang) || 'Klubumuz sadəcə qrup deyil, hər bir üzvünün zehni, emosional və peşəkar təkamülünü sürətləndirən intellektual ailədir.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(Array.isArray(club.perks) && club.perks.length > 0 ? club.perks : [
                "Həftəlik canlı mentorluq və mastermind sessiyaları",
                "Özəl meditasiya və təcrübə arxivi (100+ saat)",
                "Qapalı intellektual icma müzakirələri",
                "Oflayn tədbirlərə və retreat-lərə VIP giriş"
              ]).map((perk, pIdx) => {
                const perkStr = typeof perk === 'string' ? perk : (perk?.text || perk?.title || '');
                const title = perkStr.includes(':') ? perkStr.split(':')[0] : perkStr;
                const desc = perkStr.includes(':') ? perkStr.split(':')[1] : (perk?.desc || '');
                return (
                  <div key={pIdx} className="flex items-start gap-4 p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xl">
                        {pIdx === 0 ? 'psychology' : pIdx === 1 ? 'graphic_eq' : pIdx === 2 ? 'forum' : 'nature_people'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary mb-1">
                        {title}
                      </h4>
                      {desc ? (
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {desc}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Club Intake Notice */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-2xl">
                  {club.noticeIcon || 'lock'}
                </span>
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-primary">
                  {getLocalized(club, 'noticeTitle', currentLang, defaultLang) || 'Məhdud Sayda Qəbul Siyasəti'}
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {getLocalized(club, 'noticeDesc', currentLang, defaultLang) || 'Daxili intellektual təhlükəsizliyi və məxfiliyi qorumaq üçün hər ay yalnız 25 yeni rezident qəbul edilir.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => openApplication({ id: 'club-resident', title: 'Coaching Club Rezidentlik Müraciəti' }, 'club')}
              className="px-6 py-3 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              {getLocalized(club, 'noticeBtnText', currentLang, defaultLang) || 'Müraciət Ərizəsi Göndər'}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}

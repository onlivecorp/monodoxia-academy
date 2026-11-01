import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../i18n/localize';
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
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Editorial Page Hero */}
      <PageHero
        badge={getLocalized(club, 'badge', currentLang, defaultLang) || t('club_badge') || 'Qapalı İcma Üzvlüyü'}
        title={getLocalized(club, 'title', currentLang, defaultLang) || t('club_title') || 'Zənginlər Klubu'}
        description={getLocalized(club, 'desc', currentLang, defaultLang) || t('club_desc') || 'Davamlı inkişaf fərdi bir hadisə deyil, doğru mühitin bəhrəsidir. Dərin suallar verən seçkin şəxslərin qapalı ekosistemi.'}
        breadcrumbs={[{ label: t('nav_club') || 'Zənginlər Klubu' }]}
        adminCmsBlock="club"
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#c5a059]/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {club.heroBadge1Icon || 'verified'}
            </span>
            <span className="font-medium">{getLocalized(club, 'heroBadge1Text', currentLang, defaultLang) || t('club_limited') || 'Məhdud Sayda Üzvlük'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {club.heroBadge2Icon || 'groups'}
            </span>
            <span className="font-medium">{getLocalized(club, 'heroBadge2Text', currentLang, defaultLang) || 'Həftəlik Mastermind'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {club.heroBadge3Icon || 'spa'}
            </span>
            <span className="font-medium">{getLocalized(club, 'heroBadge3Text', currentLang, defaultLang) || '100+ Saatlıq Meditasiya Arxivi'}</span>
          </div>
        </div>
      </PageHero>

      {/* Main Section */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[950px] h-[650px] bg-gradient-to-b from-[#c5a059]/7 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Billing Cycle Toggle */}
          <div className="flex flex-col items-center justify-center mb-14 text-center">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-[#c5a059]/30 shadow-md">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-sm'
                    : 'text-[#64748b] hover:text-[#071326]'
                }`}
              >
                {t('club_billing_monthly') || 'Aylıq Ödəniş'}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] shadow-sm'
                    : 'text-[#64748b] hover:text-[#071326]'
                }`}
              >
                <span>{t('club_billing_annual') || 'İllik Abunəlik'}</span>
                {!club.annualBadgeDisabled && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#c5a059] to-[#775a19] text-[#071326] tracking-wider uppercase shadow-sm">
                    {getLocalized(club, 'annualBadgeText', currentLang, defaultLang) || t('club_annual_badge') || '2 AY HƏDİYYƏ'}
                  </span>
                )}
              </button>
            </div>
            <p className="text-xs text-[#64748b] mt-3 font-light">
              {getLocalized(club, 'annualNoteText', currentLang, defaultLang) || club.annualNoteText || t('club_annual_note') || 'İllik ödənişdə 2 ay pulsuz və bütün qapalı tədbirlərə prioritet qeydiyyat haqqı verilir.'}
            </p>
          </div>


          {/* Membership Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 items-stretch">
            {(clubTiersList || []).map((tier) => {
              const currentTierStr = (currentUser?.tier || (typeof userTier === 'string' ? userTier : (userTier?.id || userTier?.name)) || '').toLowerCase().trim();
              const isCurrentTier = Boolean(
                currentUser &&
                currentTierStr &&
                (
                  currentTierStr === (tier.id || '').toLowerCase().trim() ||
                  (tier.name && tier.name.toLowerCase().includes(currentTierStr)) ||
                  (currentTierStr === 'free' && ((tier.id || '').toLowerCase() === 'free' || tier.name?.toLowerCase().includes('giriş'))) ||
                  (currentTierStr === 'basic' && (tier.id || '').toLowerCase() === 'basic') ||
                  (currentTierStr === 'premium' && (tier.id || '').toLowerCase() === 'premium') ||
                  (currentTierStr === 'vip' && (tier.id || '').toLowerCase() === 'vip')
                )
              );
              const isPopular = tier.id === 'premium' || Boolean(tier.popular);
              const rawPrice = Number(tier.price) || 0;
              const customAnnual = tier.annualPrice ? Number(tier.annualPrice) : null;
              const displayPrice = billingCycle === 'annual' && rawPrice > 0
                ? (customAnnual && customAnnual > 0 ? customAnnual : Math.round(rawPrice * 10))
                : rawPrice;
              const periodText = billingCycle === 'annual' && rawPrice > 0 ? (t('club_tier_period_annual') || '/ illik') : (getLocalized(tier, 'period', currentLang, defaultLang, t('club_tier_period')) || tier.period || t('club_tier_period') || '/ aylıq');
              const tierName = getLocalized(tier, 'name', currentLang, defaultLang, tier.name) || tier.name || tier.id || 'Klub Üzvlüyü';
              const userTierApp = currentUser && Array.isArray(applicationsList)
                ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === tier.id && !a.archived)
                : null;
              const defaultTierDesc = tier.id === 'free' ? (t('club_tier_free_desc') || 'İctimai müzakirələrə və vebinarlara dinləyici kimi giriş') :
                tier.id === 'basic' ? (t('club_tier_basic_desc') || 'Aylıq ümumi sessiyalar, rəqəmsal materiallar və qrup') :
                tier.id === 'premium' ? (t('club_tier_premium_desc') || 'Bütün masterklaslar, qapalı icma və VIP şəbəkə') :
                (t('club_tier_vip_desc') || 'Fərdi kouçinq sessiyaları və təsisçi ilə birbaşa əlaqə');
              const tierDesc = getLocalized(tier, 'desc', currentLang, defaultLang, defaultTierDesc) || defaultTierDesc;

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                    isPopular
                      ? 'bg-gradient-to-br from-[#071326] via-[#091a34] to-[#040e1c] text-white border-2 border-[#c5a059] shadow-[0_20px_50px_-10px_rgba(7,19,38,0.35)] lg:-translate-y-2'
                      : 'bg-white text-[#071326] border border-[#c5a059]/25 hover:border-[#c5a059]/60 shadow-[0_8px_30px_-8px_rgba(7,19,38,0.06)] hover:shadow-[0_20px_45px_-12px_rgba(7,19,38,0.12)] hover:-translate-y-1'
                  }`}
                >
                  {/* Popular Floating Badge */}
                  {isPopular && (
                    <div className="absolute top-0 right-0">
                      <div className="px-4 py-1.5 rounded-bl-2xl bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#b38f46] text-[#071326] text-[10px] font-bold tracking-[0.2em] uppercase shadow-md flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                        <span>{t('club_popular_badge') || 'Ən Çox Seçilən'}</span>
                      </div>
                    </div>
                  )}

                  {/* Top Ambient Glow inside Popular card */}
                  {isPopular && (
                    <div className="absolute -top-20 -left-20 w-52 h-52 bg-[#c5a059]/20 rounded-full blur-3xl pointer-events-none" />
                  )}

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-6 pt-2">
                      <h3 className={`font-serif text-2xl font-medium tracking-tight ${isPopular ? 'text-white' : 'text-[#071326]'}`}>
                        {tierName}
                      </h3>
                      <p className={`text-xs mt-1.5 leading-relaxed font-light ${isPopular ? 'text-[#cbd5e1]' : 'text-[#64748b]'}`}>
                        {tierDesc}
                      </p>
                    </div>

                    {/* Price */}
                    <div className={`my-6 pb-6 border-b ${isPopular ? 'border-white/15' : 'border-[#e2e8f0]'}`}>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight ${isPopular ? 'text-[#e5c57d]' : 'text-[#071326]'}`}>
                          ₼ {displayPrice}
                        </span>
                        <span className={`text-xs font-light ${isPopular ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>{periodText}</span>
                      </div>
                      {billingCycle === 'annual' && rawPrice > 0 && (
                        <span className="text-[11px] text-emerald-500 font-medium block mt-1.5">
                          {t('club_monthly_approx_prefix') || 'Aylıq cəmi ~₼'} {Math.round(displayPrice / 12)}
                        </span>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3.5 mb-8">
                      {getLocalizedArray(tier, 'features', currentLang, defaultLang).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                          <span className={`material-symbols-outlined text-[17px] shrink-0 mt-0.5 ${isPopular ? 'text-[#e5c57d]' : 'text-[#775a19]'}`}>
                            check_circle
                          </span>
                          <span className={`leading-snug font-light ${isPopular ? 'text-[#e2e8f0]' : 'text-[#475569]'}`}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Join CTA */}
                  <div className="relative z-10 pt-4">
                    {isCurrentTier ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center justify-center gap-2 shadow-sm cursor-not-allowed select-none opacity-90"
                      >
                        <span className="material-symbols-outlined text-[17px] text-emerald-600">verified</span>
                        <span>{t('club_active_status') || 'Statusunuz Aktivdir'}</span>
                      </button>
                    ) : userTierApp && userTierApp.status !== 'Ləğv edildi' && userTierApp.status !== 'Rədd edildi' ? (
                      <button
                        onClick={() => openApplication(tier, 'club')}
                        className="w-full py-3 px-4 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300 flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[17px] text-amber-600">pending</span>
                        <span>{t('profile_app_card_status') || 'Müraciət'}: {userTierApp.status}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openApplication(tier, 'club')}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 group/btn ${
                          isPopular
                            ? 'bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#b38f46] text-[#071326] shadow-lg shadow-[#c5a059]/25 hover:shadow-xl hover:shadow-[#c5a059]/40 hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] shadow-md hover:shadow-lg'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[17px] group-hover/btn:scale-110 transition-transform">
                          {isPopular ? 'auto_awesome' : 'stars'}
                        </span>
                        <span>{tier.id === 'free' ? (t('club_free_join') || 'Qoşul (Ödənişsiz)') : (t('club_join_btn') || 'Üzv ol')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Club Perks Highlights */}
          <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-8 sm:p-12 mb-20 shadow-[0_15px_40px_-15px_rgba(7,19,38,0.06)] relative overflow-hidden">
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#775a19] text-xs font-semibold tracking-widest uppercase mb-3">
                <span className="material-symbols-outlined text-[15px]">diamond</span>
                <span>{getLocalized(club, 'perksBadge', currentLang, defaultLang) || 'Klub İmtiyazları'}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium text-[#071326] tracking-tight mb-3">
                {getLocalized(club, 'perksTitle', currentLang, defaultLang) || 'Zənginlər Klubu Üzvlərinə Nələr Təqdim Olunur?'}
              </h2>
              <p className="text-sm sm:text-base text-[#64748b] font-light leading-relaxed">
                {getLocalized(club, 'perksDesc', currentLang, defaultLang) || 'Klubumuz sadəcə qrup deyil, hər bir üzvünün zehni, emosional və peşəkar təkamülünü sürətləndirən intellektual ailədir.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
                  <div 
                    key={pIdx} 
                    className="flex items-start gap-4 p-6 rounded-2xl bg-[#faf8f5] border border-[#c5a059]/20 hover:border-[#c5a059]/50 transition-all hover:-translate-y-1 duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#775a19] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">
                        {pIdx === 0 ? 'psychology' : pIdx === 1 ? 'graphic_eq' : pIdx === 2 ? 'forum' : 'nature_people'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-base text-[#071326] mb-1.5">
                        {title}
                      </h4>
                      {desc ? (
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-light">
                          {desc}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Club Intake Notice Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-[#071326] via-[#0a1932] to-[#040e1c] border border-[#c5a059]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e5c57d] flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-3xl">
                  {club.noticeIcon || 'lock'}
                </span>
              </div>
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-medium text-white mb-1.5">
                  {getLocalized(club, 'noticeTitle', currentLang, defaultLang) || 'Məhdud Sayda Qəbul Siyasəti'}
                </h4>
                <p className="text-xs sm:text-sm text-[#cbd5e1] font-light max-w-xl leading-relaxed">
                  {getLocalized(club, 'noticeDesc', currentLang, defaultLang) || 'Daxili intellektual təhlükəsizliyi və məxfiliyi qorumaq üçün hər ay yalnız 25 yeni Üzv qəbul edilir.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => openApplication({ id: 'club-resident', title: 'Zənginlər Klubu Üzvlük Müraciəti' }, 'club')}
              className="relative z-10 px-8 py-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#b38f46] text-[#071326] font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#c5a059]/20 hover:shadow-xl hover:shadow-[#c5a059]/35 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              {getLocalized(club, 'noticeBtnText', currentLang, defaultLang) || 'Bizimlə Əlaqə'}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}


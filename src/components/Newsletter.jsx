import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';

export default function Newsletter() {
  const { t, currentLang, defaultLang } = useLanguage();
  const { showToast, homeContent } = useApp();
  const newsletter = homeContent?.newsletter || {};
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    showToast(
      currentLang === 'en' 
        ? 'Successfully subscribed to the newsletter!'
        : currentLang === 'ru'
        ? 'Вы успешно подписались на рассылку!'
        : 'Bülletenə abunəliyiniz uğurla təsdiqləndi!',
      'success'
    );
    setEmail('');
    setTimeout(() => {
      setIsSubscribed(false);
    }, 6000);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5] relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-br from-[#c5a059]/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Luxury Obsidian Card Container */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071326] via-[#0a1932] to-[#040e1c] border border-[#c5a059]/30 shadow-[0_25px_60px_-15px_rgba(7,19,38,0.35)] p-8 sm:p-12 lg:p-16">
          
          {/* Subtle Ambient Gold Glows Inside Card */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c5a059]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />
          
          {/* Subtle Grid Watermark Accent */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(197, 160, 89, 0.8) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/40 backdrop-blur-md anim-badge">
              <span className="material-symbols-outlined text-[15px] text-[#e5c57d]">auto_awesome</span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#e5c57d] uppercase">
                {getLocalized(newsletter, 'badge', currentLang, defaultLang) || t('newsletter_badge')}
              </span>
            </div>

            {/* Prominent Serif Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-serif font-medium text-white tracking-tight leading-[1.2] anim-newsletter-title">
              {getLocalized(newsletter, 'title', currentLang, defaultLang) || t('newsletter_title')}
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#cbd5e1] font-light leading-relaxed max-w-xl mx-auto anim-subtext">
              {getLocalized(newsletter, 'desc', currentLang, defaultLang) || t('newsletter_desc')}
            </p>

            {/* Quick Benefits / Value Props */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-[#94a3b8]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#c5a059]">verified</span>
                <span>Hər bazar günü</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#c5a059]">psychology</span>
                <span>Elmi & fəlsəfi qeydlər</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#c5a059]">lock</span>
                <span>Spam yoxdur</span>
              </div>
            </div>

            {/* Form */}
            {isSubscribed ? (
              <div className="pt-4 animate-fadeIn">
                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/50 text-white backdrop-blur-md">
                  <span className="material-symbols-outlined text-2xl text-[#e5c57d]">check_circle</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#e5c57d]">Təşəkkür edirik!</p>
                    <p className="text-xs text-white/80">Bülletenimizə uğurla abunə oldunuz. İlk say poçtunuza çatdırılacaq.</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="pt-4 max-w-lg mx-auto">
                <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 sm:p-2 bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-2xl shadow-inner focus-within:border-[#c5a059]/60 focus-within:ring-2 focus-within:ring-[#c5a059]/20 transition-all">
                  <div className="flex-1 flex items-center px-4 py-2 sm:py-0">
                    <span className="material-symbols-outlined text-[20px] text-[#c5a059]/70 mr-3 shrink-0">mail</span>
                    <input
                      className="w-full bg-transparent text-white placeholder-white/45 text-sm sm:text-base outline-none focus:outline-none"
                      placeholder={getLocalized(newsletter, 'placeholder', currentLang, defaultLang) || t('newsletter_placeholder')}
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    className="bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#b38f46] text-[#071326] font-semibold text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded-xl shadow-lg shadow-[#c5a059]/20 hover:shadow-xl hover:shadow-[#c5a059]/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shrink-0"
                    type="submit"
                  >
                    <span>{getLocalized(newsletter, 'btnText', currentLang, defaultLang) || t('newsletter_btn')}</span>
                    <span className="material-symbols-outlined text-[17px] group-hover:translate-x-0.5 transition-transform">send</span>
                  </button>
                </div>
              </form>
            )}

            {/* Privacy Disclaimer */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#94a3b8] pt-1">
              <span className="material-symbols-outlined text-[14px] text-[#c5a059]/60">shield</span>
              <span>{getLocalized(newsletter, 'disclaimer', currentLang, defaultLang) || 'Heç bir spam yoxdur. İstənilən vaxt abunəlikdən çıxa bilərsiniz.'}</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}




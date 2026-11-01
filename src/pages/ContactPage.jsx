import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

export default function ContactPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    platformSettings = {},
    submitContactMessage,
    showToast,
    navigateTo
  } = useApp();

  const isPageActive = platformSettings?.contactPageActive !== false && platformSettings?.contact_page_active !== false && platformSettings?.contact_page_active !== '0';
  const showCards = platformSettings?.contactCardsVisible !== false && platformSettings?.contact_cards_visible !== false && platformSettings?.contact_cards_visible !== '0';

  const title = platformSettings?.contactTitle || platformSettings?.contact_title || 'Bizimlə əlaqə saxlayın';
  const subtitle = platformSettings?.contactSubtitle || platformSettings?.contact_subtitle || 'Sual, təklif və əməkdaşlıq üçün bizimlə əlaqə saxlayın. Komandamız ən qısa zamanda sizə cavab verəcəkdir.';
  const phone = platformSettings?.contactPhone || platformSettings?.contact_phone || '+994 (12) 490 88 00';
  const email = platformSettings?.contactEmail || platformSettings?.contact_email || 'contact@monodoxia.academy';
  const address = platformSettings?.contactAddress || platformSettings?.contact_address || 'Nizami küçəsi 142, İntellektual İnkişaf Mərkəzi, Bakı, Azərbaycan';
  const workHours = platformSettings?.contactWorkHours || platformSettings?.contact_work_hours || 'Bazar ertəsi – Şənbə: 09:00 – 19:00';
  const mapEmbed = platformSettings?.contactMapEmbed || platformSettings?.contact_map_embed || '';

  const formConfig = platformSettings?.contactFormSettings || {};
  const isFormActive = formConfig.isActive !== false;
  const showPhoneField = formConfig.showPhone !== false;
  const requirePhoneField = Boolean(formConfig.requirePhone);
  const showSubjectField = formConfig.showSubject !== false;
  const requireSubjectField = formConfig.requireSubject !== false;

  const socials = Array.isArray(platformSettings?.contactSocials)
    ? platformSettings.contactSocials.filter(s => s.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [
        { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/monodoxia.academy', icon: 'photo_camera' },
        { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/monodoxia', icon: 'work' },
        { id: 'facebook', name: 'Facebook', url: 'https://facebook.com/monodoxia.academy', icon: 'public' },
        { id: 'telegram', name: 'Telegram', url: 'https://t.me/monodoxia', icon: 'send' },
        { id: 'whatsapp', name: 'WhatsApp', url: 'https://wa.me/994124908800', icon: 'chat' }
      ];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    hp_website: '' // honeypot
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    showToast('Kopyalandı: ' + text, 'info');
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Ad və soyad ən azı 2 simvol olmalıdır.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Düzgün e-poçt ünvanı daxil edin.';
    }

    if (showPhoneField && requirePhoneField && !formData.phone.trim()) {
      errors.phone = 'Əlaqə nömrəsi daxil edilməlidir.';
    }

    if (showSubjectField && requireSubjectField && (!formData.subject.trim() || formData.subject.trim().length < 2)) {
      errors.subject = 'Mövzu ən azı 2 simvol olmalıdır.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Mesaj mətni ən azı 5 simvol olmalıdır.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      showToast('Zəhmət olmasa formadakı xətaları düzəldin', 'warning');
      return;
    }

    setIsSubmitting(true);
    const res = await submitContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject.trim() || 'Ümumi Əlaqə Müraciəti',
      message: formData.message.trim(),
      hp_website: formData.hp_website
    });
    setIsSubmitting(false);

    if (res?.success) {
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        hp_website: ''
      });
      setFormErrors({});
    } else {
      setSubmitError(res?.message || 'Mesaj göndərilərkən xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.');
    }
  };

  if (!isPageActive) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
        <PageHero
          badge="Əlaqə"
          title="Bizimlə Əlaqə"
          description="Əlaqə xidməti hazırda müvəqqəti olaraq deaktivdir."
          breadcrumbs={[{ label: 'Əlaqə' }]}
        />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-[32px]">pause_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-[#071326] mb-3">Əlaqə Səhifəsi Müvəqqəti Dayandırılıb</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Hörmətli istifadəçi, əlaqə forması və əlaqə məlumatları hazırda administrator tərəfindən yenilənməkdədir. Təcili suallarınız üçün birbaşa ana səhifəyə qayıda bilərsiniz.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-2.5 rounded-xl bg-[#05224a] text-white font-semibold hover:bg-[#071326] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Ana Səhifəyə Qayıt</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Page Hero */}
      <PageHero
        badge="ƏLAQƏ & DƏSTƏK"
        title={title}
        description={subtitle}
        breadcrumbs={[{ label: 'Əlaqə' }]}
        adminCmsBlock="contact"
      >
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 pt-4 border-t border-[#c5a059]/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[17px]">verified_user</span>
            <span className="font-medium">Konfidensiallıq Zəmanəti</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[17px]">bolt</span>
            <span className="font-medium">Operativ Cavablandırma</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[17px]">support_agent</span>
            <span className="font-medium">Akademik Dəstək Komandası</span>
          </div>
        </div>
      </PageHero>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        {/* 1. Contact Cards Grid */}
        {showCards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Phone Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c5a059]/30 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">call</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Telefon</h3>
                <p className="text-xs text-slate-500 mb-3">Birbaşa zəng və ya mesaj</p>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-sm font-semibold text-[#05224a] hover:text-[#b45309] transition-colors break-words block"
                >
                  {phone}
                </a>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Xətt açıqdır
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(phone, 'phone')}
                  className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Nömrəni kopyala"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'phone' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c5a059]/30 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">mail</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">E-poçt</h3>
                <p className="text-xs text-slate-500 mb-3">Rəsmi yazışma və təkliflər</p>
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-semibold text-[#05224a] hover:text-[#b45309] transition-colors break-all block"
                >
                  {email}
                </a>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>24 saat ərzində cavab</span>
                <button
                  type="button"
                  onClick={() => handleCopy(email, 'email')}
                  className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="E-poçtu kopyala"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'email' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c5a059]/30 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">location_on</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Fiziki Ünvan</h3>
                <p className="text-xs text-slate-500 mb-3">Mərkəzi ofis və tədris zalı</p>
                <p className="text-sm font-medium text-slate-700 leading-snug">
                  {address}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Bakı, Azərbaycan</span>
                <button
                  type="button"
                  onClick={() => handleCopy(address, 'address')}
                  className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Ünvanı kopyala"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedKey === 'address' ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Work Hours Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c5a059]/30 text-[#b45309] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">schedule</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">İş Rejimi</h3>
                <p className="text-xs text-slate-500 mb-3">Qəbul və kouçinq saatları</p>
                <p className="text-sm font-medium text-slate-700 leading-snug">
                  {workHours}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Bazar: İstirahət günü</span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">event_available</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Interactive Form & Map / Social Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-100/50 via-transparent to-transparent rounded-bl-full pointer-events-none" />

            <div className="relative z-10 mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5a059]/10 text-[#775a19] text-xs font-bold tracking-wider uppercase mb-2">
                <span className="material-symbols-outlined text-[14px]">edit_square</span>
                <span>Bizə Yazın</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#05224a] tracking-tight">
                Əlaqə Forması
              </h2>
              <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
                Təlimlər, fərdi kouçinq və ya əməkdaşlıqla bağlı suallarınızı ünvanlayın. Komandamız sorğunuza diqqətlə baxacaqdır.
              </p>
            </div>

            {submitSuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 sm:p-8 text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[32px]">task_alt</span>
                </div>
                <h3 className="text-xl font-bold text-emerald-900 mb-2">
                  Mesajınız Uğurla Qəbul Edildi!
                </h3>
                <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto mb-6">
                  {formConfig.successMessage || 'Mesajınız uğurla qəbul edildi! Ən qısa zamanda sizinlə əlaqə saxlayacağıq.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitSuccess(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_comment</span>
                  <span>Yeni Mesaj Göndər</span>
                </button>
              </div>
            ) : !isFormActive ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
                <span className="material-symbols-outlined text-amber-600 text-[32px] mb-2">info</span>
                <p className="text-sm font-semibold text-amber-900">
                  Əlaqə forması hazırda texniki profilaktika səbəbindən bağlıdır.
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Zəhmət olmasa yuxarıdakı birbaşa telefon nömrəsi və ya e-poçt ünvanı vasitəsilə bizimlə əlaqə saxlayın.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5 relative z-10">
                {/* Honeypot field (hidden from humans, traps bots) */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <label htmlFor="hp_website">Vebsayt</label>
                  <input
                    type="text"
                    id="hp_website"
                    name="hp_website"
                    tabIndex="-1"
                    autoComplete="off"
                    value={formData.hp_website}
                    onChange={e => setFormData({ ...formData, hp_website: e.target.value })}
                  />
                </div>

                {submitError && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-rose-600 text-[18px] shrink-0 mt-0.5">error</span>
                    <div>
                      <div className="font-bold">Göndərilmə xətası:</div>
                      <div>{submitError}</div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="contact_name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Ad və Soyadınız <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                        person
                      </span>
                      <input
                        id="contact_name"
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={e => {
                          setFormData({ ...formData, name: e.target.value });
                          if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                        }}
                        placeholder="Məs: Cəmil Əliyev"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:outline-none transition-all ${
                          formErrors.name
                            ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-[#05224a] focus:ring-2 focus:ring-[#05224a]/10'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="contact_email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      E-poçt Ünvanınız <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                        alternate_email
                      </span>
                      <input
                        id="contact_email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={formData.email}
                        onChange={e => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                        }}
                        placeholder="ad@example.com"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:outline-none transition-all ${
                          formErrors.email
                            ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                            : 'border-slate-300 focus:border-[#05224a] focus:ring-2 focus:ring-[#05224a]/10'
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone field */}
                  {showPhoneField && (
                    <div>
                      <label htmlFor="contact_phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Telefon Nömrəniz {requirePhoneField ? <span className="text-rose-500">*</span> : <span className="text-slate-400 font-normal lowercase">(istəyə görə)</span>}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                          phone
                        </span>
                        <input
                          id="contact_phone"
                          type="tel"
                          disabled={isSubmitting}
                          value={formData.phone}
                          onChange={e => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                          }}
                          placeholder="+994 (50) 000 00 00"
                          className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:outline-none transition-all ${
                            formErrors.phone
                              ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                              : 'border-slate-300 focus:border-[#05224a] focus:ring-2 focus:ring-[#05224a]/10'
                          }`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.phone}</p>
                      )}
                    </div>
                  )}

                  {/* Subject field */}
                  {showSubjectField && (
                    <div className={showPhoneField ? '' : 'sm:col-span-2'}>
                      <label htmlFor="contact_subject" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Müraciətin Mövzusu {requireSubjectField ? <span className="text-rose-500">*</span> : <span className="text-slate-400 font-normal lowercase">(istəyə görə)</span>}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                          topic
                        </span>
                        <input
                          id="contact_subject"
                          type="text"
                          disabled={isSubmitting}
                          value={formData.subject}
                          onChange={e => {
                            setFormData({ ...formData, subject: e.target.value });
                            if (formErrors.subject) setFormErrors({ ...formErrors, subject: null });
                          }}
                          placeholder="Məs: Fərdi kouçinq və ya kurs haqqında"
                          className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:outline-none transition-all ${
                            formErrors.subject
                              ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                              : 'border-slate-300 focus:border-[#05224a] focus:ring-2 focus:ring-[#05224a]/10'
                          }`}
                        />
                      </div>
                      {formErrors.subject && (
                        <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.subject}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="contact_message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mesajınız <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact_message"
                    rows={5}
                    required
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={e => {
                      setFormData({ ...formData, message: e.target.value });
                      if (formErrors.message) setFormErrors({ ...formErrors, message: null });
                    }}
                    placeholder="Sualınızı, təklifinizi və ya ehtiyacınızı ətraflı qeyd edin..."
                    className={`w-full p-3.5 rounded-xl border bg-slate-50/50 text-sm text-slate-900 focus:bg-white focus:outline-none transition-all resize-y ${
                      formErrors.message
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#05224a] focus:ring-2 focus:ring-[#05224a]/10'
                    }`}
                  />
                  {formErrors.message && (
                    <p className="text-rose-600 text-xs mt-1 font-medium">{formErrors.message}</p>
                  )}
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                    <span>Məlumatlarınız tam məxfi saxlanılır.</span>
                    <span>{formData.message.length} / 6000</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#05224a] to-[#0a1932] text-white font-bold text-sm tracking-wide hover:from-[#071326] hover:to-[#05224a] transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Göndərilir...</span>
                    </>
                  ) : (
                    <>
                      <span>Mesajı Göndər</span>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Social Links & Interactive Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Social Links Card */}
            {socials.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#775a19] text-[20px]">share</span>
                  <h3 className="font-bold text-slate-900 text-lg">Sosial Şəbəkələrimiz</h3>
                </div>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Monodoxia Academy-nin gündəlik psixoloji qeydləri, analitik məqalələri və canlı yayımlarını izləyin.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {socials.map((soc) => (
                    <a
                      key={soc.id || soc.name}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#c5a059] hover:bg-[#fffdf8] text-xs font-semibold text-slate-700 hover:text-[#775a19] transition-all shadow-2xs group cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px] text-[#c5a059] group-hover:scale-110 transition-transform">
                        {soc.icon || 'link'}
                      </span>
                      <span>{soc.name}</span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:translate-x-0.5 transition-transform">
                        arrow_outward
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Map Card */}
            {mapEmbed && mapEmbed.trim() !== '' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#775a19] text-[20px]">map</span>
                    <h3 className="font-bold text-slate-900 text-base">Xəritədə Məkanımız</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Bakı Mərkəzi
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-snug">
                  {address}
                </p>

                <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
                  {mapEmbed.includes('<iframe') ? (
                    <div
                      className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(mapEmbed, {
                          ADD_TAGS: ['iframe'],
                          ADD_ATTR: ['allowfullscreen', 'frameborder', 'loading', 'referrerpolicy', 'src', 'width', 'height', 'style', 'title']
                        })
                      }}
                    />
                  ) : (
                    <iframe
                      src={mapEmbed}
                      title="Monodoxia Academy Xəritə Məkanı"
                      className="w-full h-full border-0"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Quick Consultation Callout */}
            <div className="rounded-3xl bg-gradient-to-br from-[#05224a] to-[#0a1932] text-white p-6 sm:p-7 shadow-md relative overflow-hidden border border-[#c5a059]/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#c5a059]/20 text-[#e5c57d] text-[10px] font-bold tracking-wider uppercase mb-2">
                  Fərdi Sessiya
                </span>
                <h4 className="text-lg font-bold mb-1.5">
                  Koç ilə Fərdi Seans Təyin Edin
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Sizə ən uyğun vaxtı seçərək ICF sertifikatlı kouçlarımızla birbaşa onlayn görüş rezervasiya edə bilərsiniz.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('koucinq')}
                  className="px-4 py-2 rounded-xl bg-[#c5a059] hover:bg-[#b08b46] text-[#05224a] text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span>Kouçinq Cədvəlinə Bax</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

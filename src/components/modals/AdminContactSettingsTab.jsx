import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminContactSettingsTab() {
  const { platformSettings = {}, updatePlatformSettings, showToast, getPageUrl } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('page'); // 'page' | 'info' | 'socials' | 'form'

  const [formState, setFormState] = useState({
    contactTitle: 'Bizimlə əlaqə saxlayın',
    contactSubtitle: 'Sual, təklif və əməkdaşlıq üçün bizimlə əlaqə saxlayın. Komandamız ən qısa zamanda sizə cavab verəcəkdir.',
    contactPageActive: true,
    contactCardsVisible: true,
    contactPhone: '+994 (12) 490 88 00',
    contactEmail: 'contact@monodoxia.academy',
    contactAddress: 'Nizami küçəsi 142, İntellektual İnkişaf Mərkəzi, Bakı, Azərbaycan',
    contactWorkHours: 'Bazar ertəsi – Şənbə: 09:00 – 19:00',
    contactMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3039.4284941913495!2d49.8452643!3d40.3771911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307da829c9ef71%3A0xe67cb56d05eb3e8!2sNizami%20St%2C%20Baku!5e0!3m2!1sen!2saz!4v1716000000000!5m2!1sen!2saz',
    contactSocials: [
      { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/monodoxia.academy', icon: 'photo_camera', active: true, order: 1 },
      { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/monodoxia', icon: 'work', active: true, order: 2 },
      { id: 'facebook', name: 'Facebook', url: 'https://facebook.com/monodoxia.academy', icon: 'public', active: true, order: 3 },
      { id: 'telegram', name: 'Telegram', url: 'https://t.me/monodoxia', icon: 'send', active: true, order: 4 },
      { id: 'whatsapp', name: 'WhatsApp', url: 'https://wa.me/994124908800', icon: 'chat', active: true, order: 5 }
    ],
    contactFormSettings: {
      isActive: true,
      showPhone: true,
      requirePhone: false,
      showSubject: true,
      requireSubject: true,
      targetEmail: 'contact@monodoxia.academy',
      successMessage: 'Mesajınız uğurla qəbul edildi! Ən qısa zamanda sizinlə əlaqə saxlayacağıq.',
      errorMessage: 'Mesaj göndərilərkən xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.',
      antiSpamEnabled: true
    }
  });

  useEffect(() => {
    if (platformSettings) {
      setFormState(prev => ({
        ...prev,
        contactTitle: platformSettings.contactTitle ?? platformSettings.contact_title ?? prev.contactTitle,
        contactSubtitle: platformSettings.contactSubtitle ?? platformSettings.contact_subtitle ?? prev.contactSubtitle,
        contactPageActive: platformSettings.contactPageActive !== undefined
          ? platformSettings.contactPageActive
          : (platformSettings.contact_page_active !== undefined ? Boolean(Number(platformSettings.contact_page_active)) : prev.contactPageActive),
        contactCardsVisible: platformSettings.contactCardsVisible !== undefined
          ? platformSettings.contactCardsVisible
          : (platformSettings.contact_cards_visible !== undefined ? Boolean(Number(platformSettings.contact_cards_visible)) : prev.contactCardsVisible),
        contactPhone: platformSettings.contactPhone ?? platformSettings.contact_phone ?? prev.contactPhone,
        contactEmail: platformSettings.contactEmail ?? platformSettings.contact_email ?? prev.contactEmail,
        contactAddress: platformSettings.contactAddress ?? platformSettings.contact_address ?? prev.contactAddress,
        contactWorkHours: platformSettings.contactWorkHours ?? platformSettings.contact_work_hours ?? prev.contactWorkHours,
        contactMapEmbed: platformSettings.contactMapEmbed ?? platformSettings.contact_map_embed ?? prev.contactMapEmbed,
        contactSocials: Array.isArray(platformSettings.contactSocials) ? platformSettings.contactSocials : prev.contactSocials,
        contactFormSettings: platformSettings.contactFormSettings ? { ...prev.contactFormSettings, ...platformSettings.contactFormSettings } : prev.contactFormSettings
      }));
    }
  }, [platformSettings]);

  // Socials Management
  const [newSocial, setNewSocial] = useState({
    name: '',
    url: '',
    icon: 'public'
  });

  const handleAddSocial = () => {
    if (!newSocial.name.trim() || !newSocial.url.trim()) {
      showToast('Şəbəkə adı və URL tələb olunur', 'warning');
      return;
    }
    const id = 'soc_' + Date.now();
    const item = {
      id,
      name: newSocial.name.trim(),
      url: newSocial.url.trim(),
      icon: newSocial.icon || 'public',
      active: true,
      order: (formState.contactSocials || []).length + 1
    };
    setFormState(prev => ({
      ...prev,
      contactSocials: [...(prev.contactSocials || []), item]
    }));
    setNewSocial({ name: '', url: '', icon: 'public' });
    showToast('Sosial şəbəkə əlavə edildi', 'success');
  };

  const handleRemoveSocial = (id) => {
    setFormState(prev => ({
      ...prev,
      contactSocials: (prev.contactSocials || []).filter(s => s.id !== id)
    }));
  };

  const handleToggleSocial = (id) => {
    setFormState(prev => ({
      ...prev,
      contactSocials: (prev.contactSocials || []).map(s => s.id === id ? { ...s, active: !s.active } : s)
    }));
  };

  const handleMoveSocial = (index, direction) => {
    const list = [...(formState.contactSocials || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    list.forEach((item, idx) => { item.order = idx + 1; });
    setFormState(prev => ({ ...prev, contactSocials: list }));
  };

  const handleSaveAll = (e) => {
    if (e) e.preventDefault();
    updatePlatformSettings({
      contactTitle: formState.contactTitle,
      contact_title: formState.contactTitle,
      contactSubtitle: formState.contactSubtitle,
      contact_subtitle: formState.contactSubtitle,
      contactPageActive: formState.contactPageActive,
      contact_page_active: formState.contactPageActive ? '1' : '0',
      contactCardsVisible: formState.contactCardsVisible,
      contact_cards_visible: formState.contactCardsVisible ? '1' : '0',
      contactPhone: formState.contactPhone,
      contact_phone: formState.contactPhone,
      contactEmail: formState.contactEmail,
      contact_email: formState.contactEmail,
      contactAddress: formState.contactAddress,
      contact_address: formState.contactAddress,
      contactWorkHours: formState.contactWorkHours,
      contact_work_hours: formState.contactWorkHours,
      contactMapEmbed: formState.contactMapEmbed,
      contact_map_embed: formState.contactMapEmbed,
      contactSocials: formState.contactSocials,
      contactFormSettings: formState.contactFormSettings
    });
    showToast('Əlaqə səhifəsi parametrləri uğurla yadda saxlanıldı', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b45309]">contact_support</span>
            <span>Əlaqə Səhifəsinin İdarə Edilməsi</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Saytın “Əlaqə” səhifəsinin məzmunu, əlaqə detalları, sosial şəbəkələr və form parametrlərini tənzimləyin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getPageUrl ? getPageUrl('elaqe') : '/elaqe'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Səhifəyə Bax</span>
          </a>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-1.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Yadda Saxla</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('page')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'page'
              ? 'bg-[#05224a] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">web</span>
          <span>A. Səhifə Parametrləri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('info')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'info'
              ? 'bg-[#05224a] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>B. Əlaqə Məlumatları & Xəritə</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('socials')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'socials'
              ? 'bg-[#05224a] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">share</span>
          <span>C. Sosial Şəbəkələr ({formState.contactSocials?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('form')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'form'
              ? 'bg-[#05224a] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">edit_note</span>
          <span>D. Əlaqə Forması Parametrləri</span>
        </button>
      </div>

      {/* Tab A: Səhifə Parametrləri */}
      {activeSubTab === 'page' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Əsas Səhifə Başlığı və Təsviri
            </h3>
            <p className="text-xs text-slate-500">
              Ziyarətçilər “Əlaqə” səhifəsinə daxil olduqda PageHero bölməsində bu başlıq və mətn görünəcəkdir.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Səhifə Başlığı *</label>
              <input
                type="text"
                required
                value={formState.contactTitle}
                onChange={e => setFormState({ ...formState, contactTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] focus:ring-1 focus:ring-[#05224a] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qısa Təsvir / Alt Şüar *</label>
              <textarea
                rows={3}
                value={formState.contactSubtitle}
                onChange={e => setFormState({ ...formState, contactSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] focus:ring-1 focus:ring-[#05224a] outline-none resize-y"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 max-w-2xl space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Görünmə və Status Tənzimləmələri
            </h4>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-900 block">
                  Əlaqə Səhifəsinin Aktivliyi
                </span>
                <span className="text-xs text-slate-500">
                  Deaktiv edildikdə istifadəçilərə texniki profilaktika bildirişi göstəriləcək.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.contactPageActive}
                onChange={e => setFormState({ ...formState, contactPageActive: e.target.checked })}
                className="w-5 h-5 rounded accent-[#b45309]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-900 block">
                  Əlaqə Məlumat Kartlarının Görünməsi
                </span>
                <span className="text-xs text-slate-500">
                  Telefon, e-poçt, ünvan və iş saatı kartlarını səhifədə göstər/gizlət.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.contactCardsVisible}
                onChange={e => setFormState({ ...formState, contactCardsVisible: e.target.checked })}
                className="w-5 h-5 rounded accent-[#b45309]"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab B: Əlaqə Məlumatları & Xəritə */}
      {activeSubTab === 'info' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Rəsmi Əlaqə Vasitələri
            </h3>
            <p className="text-xs text-slate-500">
              Bu məlumatlar səhifədəki kartlarda, footer hissəsində və rəsmi bildirişlərdə əks olunur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Əlaqə Telefon Nömrəsi</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">call</span>
                <input
                  type="text"
                  value={formState.contactPhone}
                  onChange={e => setFormState({ ...formState, contactPhone: e.target.value })}
                  placeholder="+994 (12) 490 88 00"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rəsmi E-poçt Ünvanı</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
                <input
                  type="email"
                  value={formState.contactEmail}
                  onChange={e => setFormState({ ...formState, contactEmail: e.target.value })}
                  placeholder="contact@monodoxia.academy"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Fiziki Ünvan</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">location_on</span>
                <input
                  type="text"
                  value={formState.contactAddress}
                  onChange={e => setFormState({ ...formState, contactAddress: e.target.value })}
                  placeholder="Nizami küçəsi 142, İntellektual İnkişaf Mərkəzi, Bakı, Azərbaycan"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">İş Günləri və Saatları</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">schedule</span>
                <input
                  type="text"
                  value={formState.contactWorkHours}
                  onChange={e => setFormState({ ...formState, contactWorkHours: e.target.value })}
                  placeholder="Bazar ertəsi – Şənbə: 09:00 – 19:00"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 max-w-3xl space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Xəritə Konfiqurasiyası (Google Maps Embed)
              </h4>
              <p className="text-xs text-slate-500">
                Google Maps-dən alınan `&lt;iframe ...&gt;` kodunu və ya xəritə linkini buraya yapışdırın. Boş buraxsanız, xəritə bloku gizlədiləcək (boş və ya saxta xəritə görünməyəcək).
              </p>
            </div>

            <textarea
              rows={4}
              value={formState.contactMapEmbed}
              onChange={e => setFormState({ ...formState, contactMapEmbed: e.target.value })}
              placeholder="<iframe src='https://www.google.com/maps/embed?...' ...></iframe> və ya link"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-[#05224a] outline-none resize-y"
            />

            {formState.contactMapEmbed && formState.contactMapEmbed.trim() !== '' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-700 mb-2">Xəritənin Ön-Baxışı:</div>
                <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-200 bg-white">
                  {formState.contactMapEmbed.includes('<iframe') ? (
                    <div
                      className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                      dangerouslySetInnerHTML={{ __html: formState.contactMapEmbed }}
                    />
                  ) : (
                    <iframe
                      src={formState.contactMapEmbed}
                      title="Preview"
                      className="w-full h-full border-0"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab C: Sosial Şəbəkələr */}
      {activeSubTab === 'socials' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Sosial Şəbəkə Hesabları
            </h3>
            <p className="text-xs text-slate-500">
              Əlaqə səhifəsində və footer-də ziyarətçilərə təqdim olunan rəsmi sosial media keçidlərini idarə edin.
            </p>
          </div>

          {/* Social List */}
          <div className="space-y-2.5 max-w-3xl">
            {(formState.contactSocials || []).map((soc, idx) => (
              <div
                key={soc.id || idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  soc.active !== false ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="material-symbols-outlined text-[#b45309] text-[20px] p-2 bg-amber-50 rounded-lg">
                    {soc.icon || 'public'}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{soc.name}</span>
                      {soc.active === false && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold">
                          Deaktiv
                        </span>
                      )}
                    </div>
                    <a
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-[#b45309] truncate block transition-colors"
                    >
                      {soc.url}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveSocial(idx, -1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Yuxarı qaldır"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={idx === (formState.contactSocials || []).length - 1}
                    onClick={() => handleMoveSocial(idx, 1)}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="Aşağı endir"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </button>

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleToggleSocial(soc.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      soc.active !== false
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {soc.active !== false ? 'Aktiv' : 'Deaktiv'}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(soc.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                    title="Sil"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Social Form */}
          <div className="pt-4 border-t border-slate-200 max-w-3xl">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Yeni Sosial Şəbəkə Əlavə Et
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Şəbəkə Adı *</label>
                <input
                  type="text"
                  placeholder="Məs: TikTok, YouTube..."
                  value={newSocial.name}
                  onChange={e => setNewSocial({ ...newSocial, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#05224a] outline-none"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Profil URL-i *</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newSocial.url}
                  onChange={e => setNewSocial({ ...newSocial, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#05224a] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">İkon</label>
                <select
                  value={newSocial.icon}
                  onChange={e => setNewSocial({ ...newSocial, icon: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#05224a] outline-none bg-white"
                >
                  <option value="public">Web / Şəbəkə</option>
                  <option value="photo_camera">Instagram</option>
                  <option value="work">LinkedIn</option>
                  <option value="send">Telegram</option>
                  <option value="chat">WhatsApp</option>
                  <option value="video_library">YouTube</option>
                  <option value="smart_display">Video / Media</option>
                  <option value="link">Keçid</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={handleAddSocial}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-sm"
                  title="Əlavə et"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab D: Əlaqə Forması Parametrləri */}
      {activeSubTab === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
              Əlaqə Formasının Sahələri və Bildiriş Mətnləri
            </h3>
            <p className="text-xs text-slate-500">
              Formanın aktivliyini, hansı sahələrin tələb olunduğunu və təyinat e-poçtunu idarə edin.
            </p>
          </div>

          <div className="max-w-3xl space-y-4">
            {/* Form Toggle */}
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-slate-900 block">
                  Əlaqə Formasının Aktivliyi
                </span>
                <span className="text-xs text-slate-500">
                  Deaktiv edildikdə form gizlədilər və yalnız əlaqə kartları göstərilər.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formState.contactFormSettings?.isActive !== false}
                onChange={e => setFormState({
                  ...formState,
                  contactFormSettings: { ...formState.contactFormSettings, isActive: e.target.checked }
                })}
                className="w-5 h-5 rounded accent-[#b45309]"
              />
            </label>

            {/* Target email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mesajların Göndəriləcəyi Təyinat E-poçtu
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">forward_to_inbox</span>
                <input
                  type="email"
                  value={formState.contactFormSettings?.targetEmail || ''}
                  onChange={e => setFormState({
                    ...formState,
                    contactFormSettings: { ...formState.contactFormSettings, targetEmail: e.target.value }
                  })}
                  placeholder="contact@monodoxia.academy"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Serverdə `mail()` konfiqurasiyası mövcud olduqda hər bir müraciət bu ünvana yönləndiriləcək.
              </span>
            </div>

            {/* Field requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Telefon Sahəsi Görünsün</span>
                  <span className="text-[10px] text-slate-500">Formda telefon sahəsi daxil edilsin</span>
                </div>
                <input
                  type="checkbox"
                  checked={formState.contactFormSettings?.showPhone !== false}
                  onChange={e => setFormState({
                    ...formState,
                    contactFormSettings: { ...formState.contactFormSettings, showPhone: e.target.checked }
                  })}
                  className="w-4 h-4 rounded accent-[#b45309]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Telefon Məcburi Olsun</span>
                  <span className="text-[10px] text-slate-500">İstifadəçi nömrə yazmadan göndərə bilməz</span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(formState.contactFormSettings?.requirePhone)}
                  onChange={e => setFormState({
                    ...formState,
                    contactFormSettings: { ...formState.contactFormSettings, requirePhone: e.target.checked }
                  })}
                  className="w-4 h-4 rounded accent-[#b45309]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Mövzu Sahəsi Görünsün</span>
                  <span className="text-[10px] text-slate-500">Müraciət mövzusu daxil edilə bilsin</span>
                </div>
                <input
                  type="checkbox"
                  checked={formState.contactFormSettings?.showSubject !== false}
                  onChange={e => setFormState({
                    ...formState,
                    contactFormSettings: { ...formState.contactFormSettings, showSubject: e.target.checked }
                  })}
                  className="w-4 h-4 rounded accent-[#b45309]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Anti-Spam / Rate Limiting</span>
                  <span className="text-[10px] text-slate-500">Honeypot sahəsi və IP məhdudiyyəti</span>
                </div>
                <input
                  type="checkbox"
                  checked={formState.contactFormSettings?.antiSpamEnabled !== false}
                  onChange={e => setFormState({
                    ...formState,
                    contactFormSettings: { ...formState.contactFormSettings, antiSpamEnabled: e.target.checked }
                  })}
                  className="w-4 h-4 rounded accent-[#b45309]"
                />
              </label>
            </div>

            {/* Custom Messages */}
            <div className="pt-3 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uğurlu Göndəriş Bildirişi Mətni
                </label>
                <input
                  type="text"
                  value={formState.contactFormSettings?.successMessage || ''}
                  onChange={e => setFormState({
                    ...formState,
                    contactFormSettings: { ...formState.contactFormSettings, successMessage: e.target.value }
                  })}
                  placeholder="Mesajınız uğurla qəbul edildi! Ən qısa zamanda sizinlə əlaqə saxlayacağıq."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Xəta Bildirişi Mətni
                </label>
                <input
                  type="text"
                  value={formState.contactFormSettings?.errorMessage || ''}
                  onChange={e => setFormState({
                    ...formState,
                    contactFormSettings: { ...formState.contactFormSettings, errorMessage: e.target.value }
                  })}
                  placeholder="Mesaj göndərilərkən xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#05224a] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-2.5 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Bütün Parametrləri Yadda Saxla</span>
        </button>
      </div>
    </div>
  );
}

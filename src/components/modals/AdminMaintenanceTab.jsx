import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import MaintenanceScreen from '../MaintenanceScreen';

export default function AdminMaintenanceTab() {
  const { platformSettings, updatePlatformSettings, homeContent, updateHomeBlock, showToast } = useApp();
  const { supportedLangs } = useLanguage();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const getInitialValues = () => ({
    maintenanceMode: Boolean(platformSettings?.maintenanceMode),
    contactEmail: platformSettings?.contactEmail || platformSettings?.contact_email || homeContent?.footer?.email || 'contact@monodoxia.academy',
    contactPhone: platformSettings?.contactPhone || platformSettings?.contact_phone || homeContent?.footer?.phone || '+994 (12) 490 88 00',
    maintenanceTitle: platformSettings?.maintenanceTitle || 'Planlaşdırılmış Texniki Təkmilləşdirmə',
    maintenanceDesc: platformSettings?.maintenanceDesc || 'Hörmətli ziyarətçi, Monodoxia Academy platformasında təhsil, analitika və təhlükəsizlik sistemlərini yeniləmək məqsədilə planlaşdırılmış texniki təkmilləşdirmə işləri aparılır. Sistem ən qısa zamanda yenidən tam fəaliyyətini bərpa edəcəkdir.',
    maintenanceNotice: platformSettings?.maintenanceNotice || 'Tezliklə Aktiv',
    maintenanceTranslations: platformSettings?.maintenanceTranslations || {
      az: {
        title: 'Planlaşdırılmış Texniki Təkmilləşdirmə',
        desc: 'Hörmətli ziyarətçi, Monodoxia Academy platformasında təhsil, analitika və təhlükəsizlik sistemlərini yeniləmək məqsədilə planlaşdırılmış texniki təkmilləşdirmə işləri aparılır. Sistem ən qısa zamanda yenidən tam fəaliyyətini bərpa edəcəkdir.',
        notice: 'Tezliklə Aktiv'
      },
      en: {
        title: 'Scheduled System Maintenance',
        desc: 'Dear visitor, scheduled maintenance is currently underway to enhance learning, analytics, and security systems. We will be back online shortly.',
        notice: 'Back Soon'
      },
      tr: {
        title: 'Planlı Bakım ve Güncelleme',
        desc: 'Değerli ziyaretçimiz, Monodoxia Academy platformunda eğitim, analitik ve güvenlik sistemlerini geliştirmek amacıyla teknik bakım çalışmaları yürütülmektedir. Çok yakında yeniden hizmetinizdeyiz.',
        notice: 'Yakında Aktif'
      },
      ru: {
        title: 'Плановое техническое обслуживание',
        desc: 'Уважаемый посетитель, на платформе Monodoxia Academy проводятся плановые технические работы для улучшения систем безопасности и качества. Скоро мы вернемся к работе.',
        notice: 'Скоро открытие'
      }
    }
  });

  const [form, setForm] = useState(getInitialValues);
  const [activeLang, setActiveLang] = useState('az');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if platformSettings changes
  useEffect(() => {
    if (platformSettings) {
      setForm(prev => ({
        ...prev,
        maintenanceMode: Boolean(platformSettings.maintenanceMode),
        contactEmail: platformSettings.contactEmail || platformSettings.contact_email || prev.contactEmail || 'contact@monodoxia.academy',
        contactPhone: platformSettings.contactPhone || platformSettings.contact_phone || prev.contactPhone || '+994 (12) 490 88 00',
        maintenanceTitle: platformSettings.maintenanceTitle || prev.maintenanceTitle,
        maintenanceDesc: platformSettings.maintenanceDesc || prev.maintenanceDesc,
        maintenanceNotice: platformSettings.maintenanceNotice || prev.maintenanceNotice,
        maintenanceTranslations: platformSettings.maintenanceTranslations || prev.maintenanceTranslations
      }));
    }
  }, [platformSettings]);

  const curTrans = form.maintenanceTranslations?.[activeLang] || {};
  const currentTitle = curTrans.title !== undefined ? curTrans.title : (activeLang === 'az' ? form.maintenanceTitle : '');
  const currentDesc = curTrans.desc !== undefined ? curTrans.desc : (activeLang === 'az' ? form.maintenanceDesc : '');
  const currentNotice = curTrans.notice !== undefined ? curTrans.notice : (activeLang === 'az' ? form.maintenanceNotice : '');

  const handleTextChange = (field, value) => {
    const updatedTrans = { ...(form.maintenanceTranslations || {}) };
    updatedTrans[activeLang] = {
      ...(updatedTrans[activeLang] || {}),
      [field]: value
    };

    setForm(prev => ({
      ...prev,
      ...(activeLang === 'az' && field === 'title' ? { maintenanceTitle: value } : {}),
      ...(activeLang === 'az' && field === 'desc' ? { maintenanceDesc: value } : {}),
      ...(activeLang === 'az' && field === 'notice' ? { maintenanceNotice: value } : {}),
      maintenanceTranslations: updatedTrans
    }));
  };

  const handleSave = (e) => {
    e?.preventDefault();
    const cleanEmail = (form.contactEmail || '').trim();
    const cleanPhone = (form.contactPhone || '').trim();

    const azTitle = form.maintenanceTranslations?.az?.title || form.maintenanceTitle;
    const azDesc = form.maintenanceTranslations?.az?.desc || form.maintenanceDesc;
    const azNotice = form.maintenanceTranslations?.az?.notice || form.maintenanceNotice;

    const payload = {
      maintenanceMode: Boolean(form.maintenanceMode),
      contactEmail: cleanEmail,
      contact_email: cleanEmail,
      contactPhone: cleanPhone,
      contact_phone: cleanPhone,
      maintenanceTitle: azTitle,
      maintenanceDesc: azDesc,
      maintenanceNotice: azNotice,
      maintenanceTranslations: form.maintenanceTranslations
    };

    // Save in platformSettings (context + localStorage + server API)
    updatePlatformSettings(payload);

    // Also update footer email & phone in homeContent if available
    try {
      if (typeof updateHomeBlock === 'function' && homeContent?.footer) {
        updateHomeBlock('footer', {
          ...homeContent.footer,
          email: cleanEmail,
          phone: cleanPhone
        });
      }
    } catch (err) {}

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    showToast('Tamir ekranı (Coming Soon) məlumatları uğurla yadda saxlanıldı!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '24px' }}>construction</span>
            <h4 className="admin-section-title" style={{ margin: 0 }}>
              Tamir Ekranı (Coming Soon) İdarəetməsi
            </h4>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: 700,
              background: form.maintenanceMode ? '#fef3c7' : '#f1f5f9',
              color: form.maintenanceMode ? '#b45309' : '#64748b',
              border: form.maintenanceMode ? '1px solid #fde68a' : '1px solid #cbd5e1'
            }}>
              {form.maintenanceMode ? 'Rejim AKTİVDİR' : 'Rejim DEAKTİVDİR'}
            </span>
          </div>
          <p className="admin-section-subtitle" style={{ marginTop: '4px' }}>
            Sayt texniki baxışda olarkən ziyarətçilərə görünən səhifənin əlaqə e-poçtunu, telefon nömrəsini və çoxdilli bildiriş mətnlərini idarə edin.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleSave}
            className="admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
              {savedSuccess ? 'check_circle' : 'save'}
            </span>
            <span>{savedSuccess ? 'Yadda Saxlanıldı!' : 'Dəyişiklikləri Yadda Saxla'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(280px, 0.95fr)', gap: '20px', alignItems: 'start' }}>
        {/* Left Column: Form & Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 1. Status Activation Switch Card */}
          <div
            className="admin-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              background: form.maintenanceMode ? '#fffbeb' : '#ffffff',
              border: form.maintenanceMode ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: form.maintenanceMode ? '#fef3c7' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: form.maintenanceMode ? '#b45309' : '#64748b',
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  {form.maintenanceMode ? 'lock' : 'lock_open'}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Texniki Qulluq Rejimi (Saytın Bağlanması)
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                  {form.maintenanceMode
                    ? 'Aktivdir — Sayt ziyarətçilərə bağlıdır və yalnız Tamir Ekranı görünür (Adminlər saytdan istifadə edə bilir).'
                    : 'Deaktivdir — Sayt açıqdır və ziyarətçilər tam daxil ola bilir.'}
                </div>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={e => {
                  const val = e.target.checked;
                  setForm(prev => ({ ...prev, maintenanceMode: val }));
                  updatePlatformSettings({ 
                    maintenanceMode: val,
                    maintenance_mode: val ? '1' : '0'
                  });
                  if (val) {
                    sessionStorage.removeItem('monodoxia_admin_bypass');
                  }
                  showToast(
                    val 
                      ? 'Texniki qulluq rejimi AKTİVLƏŞDİRİLDİ (Sayt ziyarətçilərə bağlandı)' 
                      : 'Texniki qulluq rejimi SÖNDÜRÜLDÜ (Sayt ziyarətçilərə açıldı)', 
                    val ? 'warning' : 'info'
                  );
                }}
                style={{ accentColor: '#b45309', width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '12px', fontWeight: 800, color: form.maintenanceMode ? '#b45309' : '#64748b' }}>
                {form.maintenanceMode ? 'AKTİV' : 'SÖNDÜRÜLÜB'}
              </span>
            </label>
          </div>

          {/* Explanation Alert for Admin */}
          <div style={{
            background: form.maintenanceMode ? '#fffbeb' : '#f8fafc',
            border: form.maintenanceMode ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: '240px' }}>
              <span className="material-symbols-outlined" style={{ color: form.maintenanceMode ? '#b45309' : '#64748b', fontSize: '20px', marginTop: '1px' }}>
                info
              </span>
              <div style={{ fontSize: '12px', color: form.maintenanceMode ? '#78350f' : '#475569', lineHeight: 1.5 }}>
                <strong>Niyə sizdə görünmür?</strong> Siz sistemə <strong>Admin</strong> olaraq daxil olmusunuz. Adminlər saytı idarə edə bilsin deyə sayt sizə açıq qalır. Ziyarətçilər və ya <strong>Gizli Pəncərədə (Incognito)</strong> açanlar isə yalnız Təmir Ekranını görürlər.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              style={{
                background: '#05224a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>visibility</span>
              <span>Ziyarətçi Kimi Bax</span>
            </button>
          </div>

          {/* 2. Official Contact Support (Mail & Phone) - Highlighted */}
          <div
            className="admin-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '1.5px solid #cbd5e1',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(197,160,89,0.2) 0%, rgba(197,160,89,0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>contact_phone</span>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    Rəsmi Əlaqə Vasitələri (Mail və Telefon)
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                    Tamir ekranında ziyarətçilərə göstəriləcək e-poçt və telefon nömrəsi
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '10px', color: '#059669', background: '#ecfdf5', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                Canlı Sinxron
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>mail</span>
                  Rəsmi Əlaqə E-poçtu
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={e => setForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@monodoxia.academy"
                    className="admin-input"
                    style={{ paddingLeft: '34px', fontWeight: 600 }}
                  />
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>
                    alternate_email
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Ziyarətçilər kliklədikdə birbaşa mail göndərə biləcəklər
                </span>
              </div>

              <div>
                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>phone</span>
                  Rəsmi Əlaqə Telefon Nömrəsi
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={form.contactPhone}
                    onChange={e => setForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+994 (12) 490 88 00"
                    className="admin-input"
                    style={{ paddingLeft: '34px', fontWeight: 600 }}
                  />
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>
                    call
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Mobil istifadəçilər kliklədikdə birbaşa zəng edə biləcəklər
                </span>
              </div>
            </div>
          </div>

          {/* 3. Multi-language Texts Editor */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#b45309' }}>translate</span>
                  Çoxdilli Coming Soon Mətnləri (AZ / EN / TR / RU)
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Ziyarətçi dil dəyişdiricisindən dili seçdikdə ekranda çıxan başlıq, açıqlama və status mətni
                </div>
              </div>
            </div>

            {/* Language Selector Tabs */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { code: 'az', label: '🇦🇿 Azərbaycan (AZ)' },
                { code: 'en', label: '🇬🇧 English (EN)' },
                { code: 'tr', label: '🇹🇷 Türkçe (TR)' },
                { code: 'ru', label: '🇷🇺 Русский (RU)' }
              ].map(l => {
                const isCur = activeLang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setActiveLang(l.code)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isCur ? '1px solid #c5a059' : '1px solid #e2e8f0',
                      background: isCur ? '#fffbeb' : '#ffffff',
                      color: isCur ? '#b45309' : '#64748b',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* Language Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <label className="admin-label" style={{ fontSize: '11px', fontWeight: 600 }}>
                  Ekran Başlığı ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={e => handleTextChange('title', e.target.value)}
                  placeholder="Məs: Planlaşdırılmış Texniki Təkmilləşdirmə"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label" style={{ fontSize: '11px', fontWeight: 600 }}>
                  Açıqlama Mətni ({activeLang.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={currentDesc}
                  onChange={e => handleTextChange('desc', e.target.value)}
                  placeholder="Hörmətli ziyarətçi, saytda təkmilləşdirmə işləri aparılır..."
                  className="admin-input"
                  style={{ resize: 'vertical', minHeight: '75px' }}
                />
              </div>

              <div>
                <label className="admin-label" style={{ fontSize: '11px', fontWeight: 600 }}>
                  Müddət / Status Qeydi ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={currentNotice}
                  onChange={e => handleTextChange('notice', e.target.value)}
                  placeholder="Məs: Tezliklə Aktiv və ya 24 saat ərzində"
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={handleSave}
              className="admin-btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 22px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                {savedSuccess ? 'check_circle' : 'save'}
              </span>
              <span>{savedSuccess ? 'Uğurla Yadda Saxlanıldı!' : 'Dəyişiklikləri Yadda Saxla'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Mini Preview Card */}
        <div style={{ position: 'sticky', top: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#c5a059' }}>preview</span>
              <span>Canlı Ziyarətçi Görünüşü ({activeLang.toUpperCase()})</span>
            </div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Real Vaxt Önizləmə</span>
          </div>

          <div
            style={{
              background: '#fbf9f5',
              border: '1px solid #e8dfcf',
              borderRadius: '16px',
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(5,34,74,0.05)',
              position: 'relative'
            }}
          >
            {/* Top header mini */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e8dfcf', paddingBottom: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#8a6a1f' }}>psychology_alt</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#05224a', letterSpacing: '0.05em' }}>MONODOXIA</span>
              </div>
              <div style={{ display: 'flex', gap: '3px' }}>
                {['az', 'en', 'ru', 'tr'].map(l => (
                  <span
                    key={l}
                    onClick={() => setActiveLang(l)}
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: activeLang === l ? '#05224a' : '#ffffff',
                      color: activeLang === l ? '#ffffff' : '#64748b',
                      border: '1px solid #e2d9c8'
                    }}
                  >
                    {l.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Academic badge */}
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(to bottom, #fbf8f1, #f4ede0)', border: '1px solid rgba(197,160,89,0.4)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#8a6a1f' }}>
                settings
              </span>
            </div>

            {/* Title */}
            <h5 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '17px', fontWeight: 700, color: '#05224a', lineHeight: 1.3, marginBottom: '8px' }}>
              {currentTitle || 'Planlaşdırılmış Texniki Təkmilləşdirmə'}
            </h5>

            {/* Desc */}
            <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
              {currentDesc || 'Açıqlama mətni'}
            </p>

            {/* Status pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '14px', textAlign: 'left' }}>
              <div style={{ padding: '6px 8px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e8dfcf' }}>
                <span style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', display: 'block' }}>Status</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#b45309' }}>Yenilənir</span>
              </div>
              <div style={{ padding: '6px 8px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e8dfcf' }}>
                <span style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', display: 'block' }}>Məlumat</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#059669' }}>100% Qorunur</span>
              </div>
              <div style={{ padding: '6px 8px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e8dfcf' }}>
                <span style={{ fontSize: '8px', textTransform: 'uppercase', color: '#64748b', display: 'block' }}>Müddət</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#8a6a1f' }}>{currentNotice || 'Tezliklə'}</span>
              </div>
            </div>

            {/* Contact info bar with interactive test links */}
            <div style={{ borderTop: '1px solid #e8dfcf', paddingTop: '12px', fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#8a6a1f' }}>mail</span>
                <span>Əlaqə:</span>
                <a
                  href={`mailto:${form.contactEmail}`}
                  style={{ color: '#05224a', fontWeight: 700, textDecoration: 'underline' }}
                  title="E-poçt aç"
                >
                  {form.contactEmail || 'contact@monodoxia.academy'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#8a6a1f' }}>phone</span>
                <a
                  href={`tel:${(form.contactPhone || '').replace(/\s+/g, '')}`}
                  style={{ color: '#05224a', fontWeight: 700 }}
                  title="Zəng et"
                >
                  {form.contactPhone || '+994 (12) 490 88 00'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          background: '#fbf9f5',
          overflowY: 'auto'
        }}>
          <MaintenanceScreen
            onAdminLogin={() => setShowPreviewModal(false)}
            onClosePreview={() => setShowPreviewModal(false)}
          />
        </div>
      )}
    </div>
  );
}

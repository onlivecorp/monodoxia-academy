import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AdminSettingsTab({ setActiveTab }) {
  const { platformSettings = {}, updatePlatformSettings, showToast } = useApp();
  const { supportedLangs = [] } = useLanguage();

  const [settingsForm, setSettingsForm] = useState({
    siteTitle: 'Monodoxia Academy',
    subtitle: 'Fərdi İnkişaf və Psixologiya Mərkəzi',
    currency: 'AZN (₼)',
    defaultLang: 'az',
    contactEmail: 'contact@monodoxia.academy',
    contactPhone: '+994 (12) 490 88 00',
    showSafetyBanner: true,
    safetyText: 'Monodoxia Academy təhsil, fərdi inkişaf və kouçinq platformasıdır. Təqdim edilən proqramlar və materiallar tibbi, psixiatrik və ya kliniki diaqnostika və müalicəni əvəz etmir.',
    allowRegistrations: true,
    ...platformSettings
  });

  useEffect(() => {
    if (platformSettings) {
      setSettingsForm(prev => ({ ...prev, ...platformSettings }));
    }
  }, [platformSettings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePlatformSettings(settingsForm);
    showToast('Platforma parametrləri uğurla yadda saxlanıldı', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 className="admin-section-title">Ümumi Platforma Parametrləri</h4>
        <p className="admin-section-subtitle">
          Platformanın rəsmi başlığı, şüarı, əlaqə vasitələri, standart valyuta və etik təhlükəsizlik bildirişini idarə edin
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '780px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label className="admin-label">Platformanın Rəsmi Başlığı *</label>
            <input
              type="text"
              required
              value={settingsForm.siteTitle}
              onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Alt Şüar / Slogan</label>
            <input
              type="text"
              value={settingsForm.subtitle}
              onChange={e => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <label className="admin-label">Əlaqə E-poçtu</label>
            <input
              type="email"
              value={settingsForm.contactEmail || ''}
              onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
              placeholder="contact@monodoxia.academy"
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Əlaqə Nömrəsi</label>
            <input
              type="text"
              value={settingsForm.contactPhone || ''}
              onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
              placeholder="+994 12 490 88 00"
              className="admin-input"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div>
            <label className="admin-label">Əsas Valyuta</label>
            <input
              type="text"
              value={settingsForm.currency}
              onChange={e => setSettingsForm({ ...settingsForm, currency: e.target.value })}
              className="admin-input"
            />
          </div>
          <div>
            <label className="admin-label">Standart Sistem Dili</label>
            <select
              value={settingsForm.defaultLang}
              onChange={e => setSettingsForm({ ...settingsForm, defaultLang: e.target.value })}
              className="admin-select"
            >
              {(supportedLangs || []).map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Allow Registrations Toggle */}
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Yeni Tələbə Qeydiyyatı Qəbulu</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Deaktiv edildikdə saytda yeni istifadəçi qeydiyyatları müvəqqəti dayandırılır
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settingsForm.allowRegistrations !== false}
              onChange={e => setSettingsForm({ ...settingsForm, allowRegistrations: e.target.checked })}
              style={{ accentColor: '#c5a059', width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '11px', color: settingsForm.allowRegistrations !== false ? '#15803d' : '#dc2626', fontWeight: 700 }}>
              {settingsForm.allowRegistrations !== false ? 'AÇIQ' : 'BAĞLI'}
            </span>
          </label>
        </div>

        {/* Safety Banner */}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>verified_user</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Psixoloji Qeyri-Klinik Etik Bildiriş Paneli</span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(settingsForm.showSafetyBanner)}
                onChange={e => setSettingsForm({ ...settingsForm, showSafetyBanner: e.target.checked })}
                style={{ accentColor: '#c5a059', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '11px', color: settingsForm.showSafetyBanner ? '#15803d' : '#dc2626', fontWeight: 700 }}>
                {settingsForm.showSafetyBanner ? 'AKTİV' : 'DEAKTİV'}
              </span>
            </label>
          </div>
          <label className="admin-label">Bildiriş Mətni</label>
          <textarea
            rows={3}
            value={settingsForm.safetyText}
            onChange={e => setSettingsForm({ ...settingsForm, safetyText: e.target.value })}
            className="admin-input"
            style={{ resize: 'vertical', minHeight: '70px' }}
          />
        </div>

        {/* Quick link to Page Slugs / URLs */}
        {setActiveTab && (
          <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fcfdfa', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(197,160,89,0.12)',
                border: '1px solid rgba(197,160,89,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c5a059'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>link</span>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Səhifələrin Fərdi URL Linkləri (Routinq)</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Hər bir səhifə üçün xüsusi URL linkini (məs: /kurslar, /about, /klub) Səhifələr İdarəetməsi tabından tənzimləyin.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('pages')}
              className="admin-btn-secondary"
              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#c5a059' }}>auto_stories</span>
              <span>Linkləri Ayarla</span>
            </button>
          </div>
        )}

        {/* Quick link to Maintenance Mode */}
        {setActiveTab && (
          <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fdfcf7', border: '1px solid #f1ece1' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Texniki Qulluq Ekranı & Gözləmə Rejimi</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                Saytı qeyri-inzibatçı ziyarətçilər üçün bağlayıb xüsusi "Tezliklə" ekranı aktivləşdirmək üçün:
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('maintenance')}
              className="admin-btn-secondary"
              style={{ fontSize: '11px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>construction</span>
              <span>Rejimi Tənzimlə</span>
            </button>
          </div>
        )}

        <div>
          <button type="submit" className="admin-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>save</span>
            <span>Dəyişiklikləri Yadda Saxla</span>
          </button>
        </div>
      </form>
    </div>
  );
}

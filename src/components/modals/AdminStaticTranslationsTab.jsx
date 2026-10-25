import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';

const CATEGORIES = [
  { id: 'all', label: 'Bütün Mətnlər' },
  { id: 'nav', label: 'Naviqasiya', prefix: 'nav_' },
  { id: 'hero', label: 'Hero Bölməsi', prefix: 'hero_' },
  { id: 'about', label: 'Haqqımızda & Dəyərlər', prefix: ['about_', 'pillar_'] },
  { id: 'areas', label: 'İnkişaf Sahələri', prefix: 'area' },
  { id: 'academy', label: 'Kurslar & Akademiya', prefix: ['academy_', 'filter_', 'course_'] },
  { id: 'club', label: 'Zənginlər Klubu', prefix: 'club_' },
  { id: 'experts', label: 'Ekspertlər & Kouçlar', prefix: ['expert', 'experts_'] },
  { id: 'community', label: 'İcma & Forum', prefix: 'community_' },
  { id: 'events', label: 'Tədbirlər & Vebinarlar', prefix: ['event', 'events_'] },
  { id: 'testimonials', label: 'Rəylər (Testimonials)', prefix: 'testimonials_' },
  { id: 'faq', label: 'FAQ Sualları', prefix: 'faq_' },
  { id: 'newsletter', label: 'Bülleten', prefix: 'newsletter_' },
  { id: 'safety', label: 'Etik & Təhlükəsizlik', prefix: 'safety_' },
];

export default function AdminStaticTranslationsTab() {
  const { rawTranslations, customTranslations, updateStaticTranslation, saveAllStaticTranslations, supportedLangs } = useLanguage();
  const { showToast } = useApp();

  const [activeLang, setActiveLang] = useState('az');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Local working copy for batch editing
  const [localOverrides, setLocalOverrides] = useState(() => customTranslations || {});

  const currentDict = rawTranslations[activeLang] || rawTranslations['az'] || {};
  const currentOverrides = localOverrides[activeLang] || {};

  const allKeys = useMemo(() => {
    const azKeys = Object.keys(rawTranslations['az'] || {});
    const curKeys = Object.keys(currentDict);
    return Array.from(new Set([...azKeys, ...curKeys]));
  }, [rawTranslations, currentDict]);

  const filteredKeys = useMemo(() => {
    return allKeys.filter(key => {
      // Category filter
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find(c => c.id === selectedCategory);
        if (cat) {
          if (Array.isArray(cat.prefix)) {
            const matchesPrefix = cat.prefix.some(p => key.startsWith(p));
            if (!matchesPrefix) return false;
          } else if (cat.prefix) {
            if (!key.startsWith(cat.prefix)) return false;
          }
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const defaultVal = (currentDict[key] || '').toLowerCase();
        const customVal = (currentOverrides[key] || '').toLowerCase();
        const keyMatch = key.toLowerCase().includes(q);
        const textMatch = defaultVal.includes(q) || customVal.includes(q);
        if (!keyMatch && !textMatch) return false;
      }

      return true;
    });
  }, [allKeys, selectedCategory, searchQuery, currentDict, currentOverrides]);

  const handleFieldChange = (key, val) => {
    setLocalOverrides(prev => ({
      ...prev,
      [activeLang]: {
        ...(prev[activeLang] || {}),
        [key]: val
      }
    }));
  };

  const handleResetSingle = (key) => {
    setLocalOverrides(prev => {
      const nextLang = { ...(prev[activeLang] || {}) };
      delete nextLang[key];
      return {
        ...prev,
        [activeLang]: nextLang
      };
    });
    showToast(`"${key}" açarı ilkin variantına qaytarıldı`, 'info');
  };

  const handleSaveAll = () => {
    saveAllStaticTranslations(localOverrides);
    showToast(`Bütün statik tərcümələr uğurla yadda saxlanıldı (${activeLang.toUpperCase()})!`, 'success');
  };

  const handleResetCurrentLang = () => {
    if (window.confirm(`${activeLang.toUpperCase()} dili üzrə bütün fərdi statik dəyişiklikləri sıfırlamaq istəyirsiniz?`)) {
      setLocalOverrides(prev => {
        const next = { ...prev };
        delete next[activeLang];
        saveAllStaticTranslations(next);
        return next;
      });
      showToast(`${activeLang.toUpperCase()} dili ilkin sistem tərcümələrinə qaytarıldı.`, 'info');
    }
  };

  const overrideCount = Object.keys(currentOverrides).filter(k => currentOverrides[k] !== undefined && currentOverrides[k] !== '').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '22px' }}>spellcheck</span>
            Statik Çevrilər (UI Sözlük və Sabit Mətnlər)
          </h4>
          <p className="admin-section-subtitle">
            Saytın naviqasiya, düymə, başlıq və bələdçi kimi bütün sabit interfeys mətnlərini dillər üzrə redaktə edin və fərdiləşdirin.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {overrideCount > 0 && (
            <button
              type="button"
              onClick={handleResetCurrentLang}
              className="admin-btn-secondary"
              style={{ fontSize: '11px', padding: '8px 12px', color: '#dc2626' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>restart_alt</span>
              <span>Dili Sıfırla</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            className="admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>save</span>
            <span>Tərcümələri Yadda Saxla</span>
          </button>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Redaktə Edilən Dil:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
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
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-count-badge" style={{ background: '#f1f5f9', color: '#475569' }}>
            Ümumi: {filteredKeys.length} açar
          </span>
          {overrideCount > 0 && (
            <span className="admin-count-badge" style={{ background: '#dcfce7', color: '#15803d' }}>
              {overrideCount} fərdi dəyişiklik
            </span>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Açar söz və ya mətn üzrə axtarış (məs: nav_academy, Haqqımızda, Daxil ol)..."
            className="admin-input"
            style={{ paddingLeft: '36px', height: '42px', fontSize: '13px' }}
          />
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94a3b8' }}>
            search
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`admin-cms-pill ${isSel ? 'active' : ''}`}
                style={{ fontSize: '11px', padding: '5px 12px' }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Translations List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredKeys.length === 0 ? (
          <div className="admin-card" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#cbd5e1', marginBottom: '8px' }}>search_off</span>
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Axtarışa uyğun statik tərcümə tapılmadı</div>
            <p style={{ fontSize: '11px', marginTop: '4px' }}>Fərqli açar söz yoxlayın və ya kateqoriya filtrini sıfırlayın.</p>
          </div>
        ) : (
          filteredKeys.map(key => {
            const defaultVal = currentDict[key] || rawTranslations['az']?.[key] || '';
            const customVal = currentOverrides[key];
            const hasCustom = customVal !== undefined && customVal !== '';
            const isLong = defaultVal.length > 60 || (hasCustom && customVal.length > 60);

            return (
              <div
                key={key}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  background: hasCustom ? '#fafafa' : '#ffffff',
                  border: hasCustom ? '1px solid #c5a059' : '1px solid #e2e8f0',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                      {key}
                    </code>
                    {hasCustom && (
                      <span style={{ fontSize: '10px', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                        Fərdi Dəyişiklik
                      </span>
                    )}
                  </div>

                  {hasCustom && (
                    <button
                      type="button"
                      onClick={() => handleResetSingle(key)}
                      style={{ fontSize: '11px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="İlkin sistem dəyərinə qaytar"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>undo</span>
                      <span>İlkinə qaytar</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'start' }}>
                  {/* Default / Reference */}
                  <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Orijinal Standart Dəyər
                    </span>
                    <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                      {defaultVal || <em style={{ color: '#94a3b8' }}>Dəyər təyin edilməyib</em>}
                    </div>
                  </div>

                  {/* Custom Editable Input */}
                  <div>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {activeLang.toUpperCase()} Variantı ({hasCustom ? 'Fərdi' : 'Standartdan istifadə olunur'})
                    </span>
                    {isLong ? (
                      <textarea
                        rows={2}
                        value={hasCustom ? customVal : defaultVal}
                        onChange={e => handleFieldChange(key, e.target.value)}
                        className="admin-input"
                        style={{ fontSize: '12px', resize: 'vertical' }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={hasCustom ? customVal : defaultVal}
                        onChange={e => handleFieldChange(key, e.target.value)}
                        className="admin-input"
                        style={{ fontSize: '12px' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Save Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          Dəyişikliklərin ziyarətçilərə görünməsi üçün <strong>"Tərcümələri Yadda Saxla"</strong> düyməsinə klikləyin.
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 20px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>save</span>
          <span>Tərcümələri Yadda Saxla</span>
        </button>
      </div>
    </div>
  );
}

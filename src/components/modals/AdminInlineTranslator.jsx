import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AdminInlineTranslator({
  item,
  fields,
  activeLang,
  setActiveLang,
  onUpdate,
  isOpen,
  setIsOpen
}) {
  const { supportedLangs } = useLanguage();
  if (!item) return null;

  const transLangs = (supportedLangs && supportedLangs.length > 0)
    ? supportedLangs.filter(l => l.enabled !== false)
    : [
        { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
      ];
  const trans = item.translations || {};

  const getLangStatus = (code) => {
    if (!fields || fields.length === 0) return 'missing';
    const filled = fields.filter(f => {
      const v = trans[code]?.[f.key] !== undefined && trans[code]?.[f.key] !== ''
        ? trans[code][f.key]
        : (code === 'az' ? item[f.key] : undefined);
      if (Array.isArray(v)) return v.length > 0;
      return v && String(v).trim() !== '';
    }).length;
    if (filled === 0) return 'missing';
    if (filled < fields.length) return 'partial';
    return 'complete';
  };

  const handleChange = (langCode, fieldKey, value) => {
    const updated = {
      ...trans,
      [langCode]: { ...(trans[langCode] || {}), [fieldKey]: value }
    };
    if (langCode === 'az') {
      onUpdate({ [fieldKey]: value, translations: updated });
    } else {
      onUpdate({ translations: updated });
    }
  };

  return (
    <div style={{ marginTop: '14px', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          fontSize: '12px',
          fontWeight: 600,
          background: isOpen ? '#fffbeb' : '#f8fafc',
          color: isOpen ? '#b45309' : '#475569',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>translate</span>
          <span style={{ fontWeight: 600 }}>Çoxdilli Tərcümə Redaktoru (4 Dil: AZ, EN, TR, RU)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
            {transLangs.map(l => {
              const st = getLangStatus(l.code);
              return (
                <span key={l.code} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '10px', color: '#64748b' }} title={`${l.code.toUpperCase()}: ${st}`}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st === 'complete' ? '#22c55e' : st === 'partial' ? '#eab308' : '#f87171' }} />
                  <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{l.code}</span>
                </span>
              );
            })}
          </span>
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isOpen ? '#b45309' : '#94a3b8' }}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: '14px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
            Hər bir dil üzrə məlumatları ayrıca redaktə edin. Dəyişikliklər avtomatik olaraq müvafiq dil qovluğuna yazılır:
          </p>

          {/* Lang tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {transLangs.map(l => {
              const isActive = activeLang === l.code;
              const st = getLangStatus(l.code);
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setActiveLang(l.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isActive ? '1px solid #d4af37' : '1px solid #e2e8f0',
                    background: isActive ? '#fffbeb' : '#ffffff',
                    color: isActive ? '#b45309' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{l.flag}</span>
                  <span style={{ textTransform: 'uppercase' }}>{l.code}</span>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: st === 'complete' ? '#22c55e' : st === 'partial' ? '#eab308' : '#f87171' }} />
                </button>
              );
            })}
          </div>

          {/* Fields for active lang */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fields.map(f => {
              const rawVal = trans[activeLang]?.[f.key] !== undefined
                ? trans[activeLang][f.key]
                : (activeLang === 'az' ? item[f.key] : '');
              const val = Array.isArray(rawVal) ? rawVal.join('\n') : (rawVal || '');
              return (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="admin-label">
                    {f.label} <span style={{ color: '#c5a059', textTransform: 'uppercase' }}>({activeLang})</span>
                    {f.isArray && <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '6px', fontWeight: 'normal' }}>(hər sətirdə bir maddə)</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select
                      value={val}
                      onChange={e => handleChange(activeLang, f.key, e.target.value)}
                      className="admin-select"
                    >
                      <option value="">-- {f.label} ({activeLang.toUpperCase()}) seçin --</option>
                      {(typeof f.options === 'function' ? f.options(activeLang) : (f.options || [])).map(opt => {
                        const optVal = typeof opt === 'object' ? opt.value : opt;
                        const optLabel = typeof opt === 'object' ? opt.label : opt;
                        return (
                          <option key={optVal} value={optVal}>
                            {optLabel}
                          </option>
                        );
                      })}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={f.rows || (f.isArray ? 3 : 2)}
                      value={val}
                      onChange={e => {
                        const v = f.isArray
                          ? e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                          : e.target.value;
                        handleChange(activeLang, f.key, v);
                      }}
                      className="admin-input"
                      style={{ minHeight: '54px', resize: 'vertical' }}
                      placeholder={f.isArray ? `${f.label} (hər sətirdə bir maddə)...` : `${f.label} (${activeLang.toUpperCase()})...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={e => handleChange(activeLang, f.key, e.target.value)}
                      className="admin-input"
                      placeholder={`${f.label} (${activeLang.toUpperCase()})...`}
                    />
                  )}
                </div>
              );
            })}
            {fields.length === 0 && (
              <p className="text-xs text-outline italic">Bu element üçün tərcümə sahəsi mövcud deyil.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

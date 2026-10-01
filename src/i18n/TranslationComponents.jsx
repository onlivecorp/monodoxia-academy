// Monodoxia Academy - Reusable Translation UI Components
import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

/**
 * LanguageTabs - Tab switcher for editing per-language fields
 */
export function LanguageTabs({ activeLang, onLangChange, statusMap = {}, supportedLanguages }) {
  const { supportedLangs } = useLanguage();
  const langs = supportedLanguages || supportedLangs || [];

  const getStatusIcon = (code) => {
    const s = statusMap[code];
    if (!s) return null;
    if (s.status === 'complete') return (
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block ml-1" title="Tam"></span>
    );
    if (s.status === 'partial') return (
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block ml-1" title="Qismən"></span>
    );
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block ml-1" title="Çatışmır"></span>
    );
  };

  return (
    <div className="flex flex-wrap gap-1 mb-4 border-b border-outline-variant/40 pb-3">
      {langs.filter(l => l.enabled !== false).map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => onLangChange(l.code)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeLang === l.code
              ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span>{l.flag}</span>
          <span className="uppercase tracking-wider">{l.code}</span>
          {getStatusIcon(l.code)}
        </button>
      ))}
    </div>
  );
}

/**
 * TranslationStatus - Compact status indicator for all languages
 */
export function TranslationStatus({ statusMap = {}, supportedLanguages }) {
  const { supportedLangs } = useLanguage();
  const langs = supportedLanguages || supportedLangs || [];

  if (!statusMap || Object.keys(statusMap).length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-surface-container-low rounded border border-outline-variant/40 text-[11px]">
      {langs.filter(l => l.enabled !== false).map(l => {
        const s = statusMap[l.code];
        if (!s) return null;
        return (
          <div key={l.code} className="flex items-center gap-1">
            <span>{l.flag}</span>
            <span className="font-semibold uppercase">{l.code}:</span>
            {s.status === 'complete' ? (
              <span className="text-green-700 font-medium">✓ Tam</span>
            ) : s.status === 'partial' ? (
              <span className="text-yellow-700 font-medium">⚠ {s.completed}/{s.total}</span>
            ) : (
              <span className="text-red-600 font-medium">✗ Yoxdur</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * LocalizedField - Single-language text input for a translatable field
 */
export function LocalizedField({
  label,
  fieldKey,
  lang,
  translations = {},
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  hint = ''
}) {
  const value = (translations[lang] && translations[lang][fieldKey]) || '';

  const handleChange = (e) => {
    onChange(lang, fieldKey, e.target.value);
  };

  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-sm text-on-surface focus:outline-none focus:border-secondary resize-y min-h-[72px]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded text-sm text-on-surface focus:outline-none focus:border-secondary"
        />
      )}
      {hint && <p className="text-[10px] text-outline italic">{hint}</p>}
    </div>
  );
}

/**
 * MultiLangEditor - Full editor for translatable fields across all languages
 * activeLang — language tab to show
 * onLangChange — called when tab switches
 * translations — { az: { title: '', desc: '' }, en: { ... }, ... }
 * onTranslationChange(lang, field, value)
 * fields — array of { key, label, type, placeholder, required }
 * statusMap — from getTranslationStatus()
 */
export function MultiLangEditor({
  activeLang,
  onLangChange,
  translations = {},
  onTranslationChange,
  fields = [],
  statusMap = {},
  supportedLanguages,
  showStatus = true
}) {
  return (
    <div className="space-y-3">
      <LanguageTabs
        activeLang={activeLang}
        onLangChange={onLangChange}
        statusMap={statusMap}
        supportedLanguages={supportedLanguages}
      />
      {showStatus && Object.keys(statusMap).length > 0 && (
        <TranslationStatus statusMap={statusMap} supportedLanguages={supportedLanguages} />
      )}
      <div className="space-y-3 pt-1">
        {fields.map(f => (
          <LocalizedField
            key={f.key}
            label={f.label}
            fieldKey={f.key}
            lang={activeLang}
            translations={translations}
            onChange={onTranslationChange}
            type={f.type || 'text'}
            placeholder={f.placeholder || ''}
            required={f.required || false}
            hint={f.hint || ''}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * LocalizedArrayField - List editor (e.g., features, perks)
 */
export function LocalizedArrayField({
  label,
  fieldKey,
  lang,
  translations = {},
  onChange
}) {
  const arr = (translations[lang] && Array.isArray(translations[lang][fieldKey]))
    ? translations[lang][fieldKey]
    : [];

  const handleItem = (i, val) => {
    const next = [...arr];
    next[i] = val;
    onChange(lang, fieldKey, next);
  };

  const addItem = () => {
    onChange(lang, fieldKey, [...arr, '']);
  };

  const removeItem = (i) => {
    onChange(lang, fieldKey, arr.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{label}</label>
      <div className="space-y-1.5">
        {arr.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={e => handleItem(i, e.target.value)}
              className="flex-1 px-3 py-1.5 bg-surface-container border border-outline-variant rounded text-sm text-on-surface focus:outline-none focus:border-secondary"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-red-400 hover:text-red-600 text-[18px] material-symbols-outlined shrink-0"
            >remove_circle_outline</button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="text-xs text-secondary hover:text-primary flex items-center gap-1 pt-1 font-medium"
      >
        <span className="material-symbols-outlined text-[16px]">add_circle_outline</span>
        <span>Əlavə et</span>
      </button>
    </div>
  );
}

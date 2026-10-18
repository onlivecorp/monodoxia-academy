import React, { useState, useEffect, useContext, createContext } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { getHeroMediaStyles, getAboutMediaStyles, parseVideoUrl } from '../../utils/heroMediaHelper';
import { DEFAULT_PAGE_SLUGS, sanitizeSlug, resolvePageSlug, resolvePageUrl } from '../../utils/pageRouter';

const PagesFieldContext = createContext({
  pageLang: 'az',
  showAllLangs: false,
  langs: [],
  showToast: () => {}
});

function PageField({
  label,
  block,
  setBlock,
  fieldKey,
  value,
  onChange,
  multiline,
  rows = 3,
  isArray = false,
  placeholder,
  helpText
}) {
  const { pageLang, showAllLangs, langs, showToast } = useContext(PagesFieldContext);
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded = showAllLangs || localExpanded;
  const isBlockMode = Boolean(block && fieldKey && setBlock);

  const getLangVal = (langCode) => {
    if (!isBlockMode) {
      return langCode === 'az' ? (value || '') : '';
    }
    const trans = block.translations || {};
    let val;
    if (langCode === 'az') {
      val = trans.az?.[fieldKey] !== undefined
        ? trans.az[fieldKey]
        : (block[fieldKey] !== undefined ? block[fieldKey] : '');
    } else {
      val = trans[langCode]?.[fieldKey] !== undefined ? trans[langCode][fieldKey] : '';
    }
    if (isArray) {
      return Array.isArray(val) ? val.join('\n') : (val || '');
    }
    return val !== undefined && val !== null ? String(val) : '';
  };

  const handleLangChange = (langCode, rawVal) => {
    if (!isBlockMode) {
      if (onChange) onChange(rawVal);
      return;
    }
    const finalVal = isArray ? rawVal.split('\n') : rawVal;

    setBlock(prev => {
      const prevTrans = prev?.translations || {};
      if (langCode === 'az') {
        return {
          ...prev,
          [fieldKey]: finalVal,
          translations: {
            ...prevTrans,
            az: { ...(prevTrans.az || {}), [fieldKey]: finalVal }
          }
        };
      }
      return {
        ...prev,
        translations: {
          ...prevTrans,
          [langCode]: { ...(prevTrans[langCode] || {}), [fieldKey]: finalVal }
        }
      };
    });
  };

  const copyFromAz = (targetLang) => {
    const azVal = getLangVal('az');
    if (azVal) {
      handleLangChange(targetLang, azVal);
      showToast(`AZ mətni ${targetLang.toUpperCase()} sahəsinə kopyalandı`, 'info');
    }
  };

  const azValue = getLangVal('az');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      padding: isExpanded ? '10px 12px' : '0px',
      background: isExpanded ? '#fafaf9' : 'transparent',
      borderRadius: isExpanded ? '8px' : '0px',
      border: isExpanded ? '1px solid #e2e8f0' : 'none',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label className="admin-label" style={{ margin: 0 }}>{label}</label>
          {!isExpanded && (
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '4px',
              background: pageLang === 'az' ? '#f1f5f9' : '#fef3c7',
              color: pageLang === 'az' ? '#475569' : '#b45309',
              textTransform: 'uppercase'
            }}>
              {pageLang}
            </span>
          )}
          {isArray && (
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>(hər sətirdə bir maddə)</span>
          )}
        </div>

        {isBlockMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {langs.map(l => {
                const v = getLangVal(l.code);
                const hasVal = v && String(v).trim() !== '';
                return (
                  <span
                    key={l.code}
                    title={`${l.name} (${l.code.toUpperCase()}): ${hasVal ? 'Doldurulub' : 'Boşdur'}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '10px',
                      color: '#64748b'
                    }}
                  >
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: hasVal ? '#22c55e' : (l.code === 'az' ? '#f87171' : '#cbd5e1')
                    }} />
                    <span style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: 700 }}>{l.code}</span>
                  </span>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setLocalExpanded(!localExpanded)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 7px',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                background: localExpanded ? '#fffbeb' : '#ffffff',
                color: localExpanded ? '#b45309' : '#64748b',
                cursor: 'pointer'
              }}
              title="Bu sahə üçün bütün 4 dili göstər"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                {localExpanded ? 'expand_less' : 'translate'}
              </span>
              <span>{localExpanded ? 'Yığcam' : '🌐 4 Dil'}</span>
            </button>
          </div>
        )}
      </div>

      {helpText && <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{helpText}</p>}

      {isExpanded ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '2px' }}>
          {langs.map(l => {
            const val = getLangVal(l.code);
            const isAz = l.code === 'az';
            return (
              <div key={l.code} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>({l.code.toUpperCase()}{isAz ? ' - Əsas' : ''})</span>
                  </span>
                  {!isAz && azValue && !val && (
                    <button
                      type="button"
                      onClick={() => copyFromAz(l.code)}
                      style={{
                        padding: '1px 6px',
                        fontSize: '10px',
                        color: '#b45309',
                        background: '#fffbeb',
                        border: '1px solid #fef3c7',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🇦🇿 AZ-dən kopyala
                    </button>
                  )}
                </div>
                {multiline || isArray ? (
                  <textarea
                    rows={rows}
                    value={val}
                    onChange={e => handleLangChange(l.code, e.target.value)}
                    className="admin-input"
                    style={{ resize: 'vertical' }}
                    placeholder={placeholder ? `${placeholder} (${l.code.toUpperCase()})` : `${label} (${l.name})...`}
                  />
                ) : (
                  <input
                    type="text"
                    value={val}
                    onChange={e => handleLangChange(l.code, e.target.value)}
                    className="admin-input"
                    placeholder={placeholder ? `${placeholder} (${l.code.toUpperCase()})` : `${label} (${l.name})...`}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {pageLang !== 'az' && isBlockMode && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '6px 10px',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#475569'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>🇦🇿 Orijinal (AZ): </span>
                <span style={{ fontStyle: 'italic', color: azValue ? '#334155' : '#94a3b8' }}>
                  {azValue ? (azValue.length > 130 ? azValue.slice(0, 130) + '...' : azValue) : '(Boşdur)'}
                </span>
              </div>
              {azValue && !getLangVal(pageLang) && (
                <button
                  type="button"
                  onClick={() => copyFromAz(pageLang)}
                  style={{
                    padding: '2px 7px',
                    fontSize: '10px',
                    color: '#b45309',
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Kopyala
                </button>
              )}
            </div>
          )}

          {multiline || isArray ? (
            <textarea
              rows={rows}
              value={getLangVal(pageLang)}
              onChange={e => handleLangChange(pageLang, e.target.value)}
              className="admin-input"
              style={{ resize: 'vertical' }}
              placeholder={placeholder || `${label} (${pageLang.toUpperCase()})...`}
            />
          ) : (
            <input
              type="text"
              value={getLangVal(pageLang)}
              onChange={e => handleLangChange(pageLang, e.target.value)}
              className="admin-input"
              placeholder={placeholder || `${label} (${pageLang.toUpperCase()})...`}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PageImageField({ label, value, onChange }) {
  const { showToast } = useContext(PagesFieldContext);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Şəkil ölçüsü 5MB-dan çox ola bilməz', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(event.target.result);
      showToast('Şəkil uğurla yükləndi!', 'success');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label className="admin-label">{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Şəkil URL daxil edin və ya fayl seçin..."
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="admin-input"
            style={{ flex: 1 }}
          />
          <label className="admin-btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>upload</span>
            <span>Fayl Yüklə</span>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
        </div>
        {value && (
          <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '6px', border: '1px solid #e2e8f0', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', display: 'block' }}>Cari şəkil önizləməsi</span>
              <span style={{ fontSize: '10px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                {value.startsWith('data:') ? 'Lokal yüklənmiş fayl (Base64)' : value}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChange('')}
              className="admin-btn-danger"
              style={{ padding: '4px 8px', fontSize: '11px' }}
            >
              Şəkli Sil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PageUrlInlineBar({
  pageId,
  slugsForm,
  setSlugsForm,
  onSaveSlug,
  onLivePreview,
  showToast
}) {
  const currentVal = slugsForm[pageId] !== undefined ? slugsForm[pageId] : (DEFAULT_PAGE_SLUGS[pageId] || '');
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://monodoxia.academy';
  const effectivePath = pageId === 'home'
    ? (currentVal ? `/${currentVal}` : '/')
    : `/${currentVal || DEFAULT_PAGE_SLUGS[pageId] || pageId}`;
  const effectiveUrl = `${baseUrl}${effectivePath}`;

  const isCustom = currentVal !== (DEFAULT_PAGE_SLUGS[pageId] || '');

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(effectiveUrl);
      if (showToast) showToast(`Link kopyalandı: ${effectiveUrl}`, 'success');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '10px 14px',
      background: 'linear-gradient(135deg, #fffdf8 0%, #fefcf3 100%)',
      border: '1px solid rgba(197, 160, 89, 0.4)',
      borderRadius: '8px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#c5a059' }}>link</span>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Bu Səhifənin URL Linki</span>
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '4px',
              background: isCustom ? '#fef3c7' : '#f1f5f9',
              color: isCustom ? '#b45309' : '#64748b'
            }}>
              {isCustom ? 'XÜSUSİ LİNK' : 'STANDART'}
            </span>
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {effectiveUrl}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
          <span style={{ fontSize: '11px', color: '#64748b', padding: '0 8px', background: '#f8fafc', height: '32px', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
            /
          </span>
          <input
            type="text"
            value={slugsForm[pageId] ?? ''}
            onChange={e => {
              const val = sanitizeSlug(e.target.value);
              setSlugsForm(prev => ({ ...prev, [pageId]: val }));
            }}
            placeholder={DEFAULT_PAGE_SLUGS[pageId] || (pageId === 'home' ? '(ana səhifə /)' : pageId)}
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              border: 'none',
              outline: 'none',
              width: '140px',
              background: 'transparent',
              fontFamily: 'monospace',
              color: '#0f172a',
              fontWeight: 600
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => onSaveSlug(pageId)}
          className="admin-btn-primary"
          style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Bu səhifənin yeni linkini yadda saxla"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>save</span>
          <span>Linki Saxla</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="admin-btn-secondary"
          style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Linki Kopyala"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
          <span>Kopyala</span>
        </button>

        <button
          type="button"
          onClick={() => onLivePreview(pageId)}
          className="admin-btn-secondary"
          style={{ padding: '6px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Bu səhifəni saytda aç"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
          <span>Aç</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminPagesTab() {
  const {
    homeContent = {},
    updateHomeBlock,
    navigateTo,
    setAdminModalOpen,
    pillarsList = [],
    updateAllPillars,
    areasList = [],
    updateAllAreas,
    showToast,
    platformSettings,
    updatePageSlugs,
    getPageSlug,
    getPageUrl
  } = useApp();

  const { supportedLangs = [] } = useLanguage();

  const langs = (supportedLangs && supportedLangs.length > 0) ? supportedLangs : [
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const PAGES_CONFIG = [
    { id: 'akademiya', label: 'Akademiya', icon: 'school', route: 'akademiya', desc: 'Kurs kataloqu, LMS modulları, tədris zəmanəti' },
    { id: 'koucinq', label: 'Kouçinq', icon: 'psychology', route: 'koucinq', desc: 'Ekspert koçlar, fərdi seans rezervasiyası, ICF metodologiyası' },
    { id: 'club', label: 'Coaching Club', icon: 'card_membership', route: 'club', desc: 'Rezidentlik paketləri, imtiyazlar, qapalı icma üzvlüyü' },
    { id: 'tedbirler', label: 'Tədbirlər', icon: 'event', route: 'tedbirler', desc: 'Canlı təqvim, vebinarlar, oflayn görüşlər, spikerlik' },
    { id: 'icma', label: 'İcma', icon: 'forum', route: 'icma', desc: 'İntellektual forum, həftəlik mövzu, icma etikası qaydaları' },
    { id: 'haqqimizda', label: 'Haqqımızda', icon: 'auto_stories', route: 'haqqimizda', desc: 'Akademiyanın məramı, sol media (şəkil/video), 4 dəyər kartı, 8 sahə' },
    { id: 'home', label: 'Ana Səhifə (Hero)', icon: 'home', route: 'home', desc: 'Əsas giriş hero mətni, 3 başlıq, statistika, hero media' },
  ];

  const [selectedPage, setSelectedPage] = useState('akademiya');
  const [pageLang, setPageLang] = useState('az');
  const [showAllLangs, setShowAllLangs] = useState(false);

  // URL Slugs Form state
  const [slugsForm, setSlugsForm] = useState(() => ({
    ...DEFAULT_PAGE_SLUGS,
    ...(platformSettings?.pageSlugs || platformSettings?.page_slugs || {})
  }));
  const [slugsPanelOpen, setSlugsPanelOpen] = useState(false);

  useEffect(() => {
    if (platformSettings?.pageSlugs || platformSettings?.page_slugs) {
      setSlugsForm({
        ...DEFAULT_PAGE_SLUGS,
        ...(platformSettings.pageSlugs || platformSettings.page_slugs)
      });
    }
  }, [platformSettings?.pageSlugs, platformSettings?.page_slugs]);

  const handleSaveAllSlugs = () => {
    if (updatePageSlugs) {
      updatePageSlugs(slugsForm);
    }
  };

  const handleSaveSingleSlug = (pageId) => {
    if (updatePageSlugs) {
      updatePageSlugs(slugsForm);
    }
  };

  const handleResetSlugs = () => {
    setSlugsForm({ ...DEFAULT_PAGE_SLUGS });
    if (updatePageSlugs) {
      updatePageSlugs(DEFAULT_PAGE_SLUGS);
    }
    showToast('Bütün səhifə linkləri standart vəziyyətə qaytarıldı!', 'info');
  };

  // Per-page block states
  const [academyData, setAcademyData] = useState(() => ({ ...(homeContent?.academy || {}) }));
  const [coachesData, setCoachesData] = useState(() => ({ ...(homeContent?.coaches || {}) }));
  const [clubData, setClubData] = useState(() => ({ ...(homeContent?.club || {}) }));
  const [eventsData, setEventsData] = useState(() => ({ ...(homeContent?.events || {}) }));
  const [communityData, setCommunityData] = useState(() => ({ ...(homeContent?.community || {}) }));
  const [aboutData, setAboutData] = useState(() => ({ ...(homeContent?.about || {}) }));
  const [heroData, setHeroData] = useState(() => ({ ...(homeContent?.hero || {}) }));

  useEffect(() => {
    if (homeContent) {
      setAcademyData({ ...(homeContent.academy || {}) });
      setCoachesData({ ...(homeContent.coaches || {}) });
      setClubData({ ...(homeContent.club || {}) });
      setEventsData({ ...(homeContent.events || {}) });
      setCommunityData({ ...(homeContent.community || {}) });
      setAboutData({ ...(homeContent.about || {}) });
      setHeroData({ ...(homeContent.hero || {}) });
    }
  }, [homeContent]);

  const savePage = (key, data) => {
    updateHomeBlock(key, data);
    showToast(`"${PAGES_CONFIG.find(p => p.id === key || (key === 'coaches' && p.id === 'koucinq') || (key === 'about' && p.id === 'haqqimizda'))?.label || key}" səhifəsinin məlumatları yadda saxlandı!`, 'success');
  };

  const handleLivePreview = (route) => {
    navigateTo(route);
    setAdminModalOpen(false);
  };

  return (
    <PagesFieldContext.Provider value={{ pageLang, showAllLangs, langs, showToast }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* TOP CONTROLS & INFO BAR */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#c5a059' }}>auto_stories</span>
                <span>Səhifələr İdarəetməsi (Pages CMS)</span>
              </h4>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0' }}>
                Saytın bütün səhifələrinin mətnləri, başlıqları, təsvirləri və şəkillərini buradan fərdi olaraq redaktə edin.
              </p>
            </div>

            {/* Language Switcher Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {langs.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setPageLang(l.code)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: pageLang === l.code ? 700 : 500,
                      borderRadius: '6px',
                      border: 'none',
                      background: pageLang === l.code ? '#ffffff' : 'transparent',
                      color: pageLang === l.code ? '#0f172a' : '#64748b',
                      boxShadow: pageLang === l.code ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span style={{ textTransform: 'uppercase' }}>{l.code}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAllLangs(!showAllLangs)}
                className={showAllLangs ? 'admin-btn-primary' : 'admin-btn-secondary'}
                style={{ padding: '5px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
                title="Bütün sahələri eyni vaxtda 4 dildə aç"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>translate</span>
                <span>{showAllLangs ? 'Yığcam Dil' : 'Bütün 4 Dil'}</span>
              </button>
            </div>
          </div>

          {/* PAGE SELECTOR TABS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #e2e8f0'
          }}>
            {PAGES_CONFIG.map(page => {
              const isSelected = selectedPage === page.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSelectedPage(page.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid #c5a059' : '1px solid #e2e8f0',
                    background: isSelected ? '#fffdf7' : '#ffffff',
                    color: isSelected ? '#0f172a' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: isSelected ? '#c5a059' : '#94a3b8' }}>
                    {page.icon}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 600, display: 'block', lineHeight: 1.2 }}>
                      {page.label}
                    </span>
                    <span style={{ fontSize: '9px', color: '#c5a059', fontWeight: 600 }}>
                      {page.id === 'home' ? '/' : `/${slugsForm[page.id] || (getPageSlug ? getPageSlug(page.id) : page.route)}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SƏHİFƏ LİNKİ VƏ URL ROUTİNQ İDARƏETMƏSİ PANELİ */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1.5px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(197,160,89,0.12)',
                border: '1px solid rgba(197,160,89,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c5a059'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>link</span>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Səhifə Linkləri və URL Routinq İdarəetməsi
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                  Saytın hər bir səhifəsi üçün xüsusi URL linki (slug) təyin edin. Dəyişikliklər dərhal menyuda və linklərdə tətbiq olunur.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSlugsPanelOpen(!slugsPanelOpen)}
                className="admin-btn-secondary"
                style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {slugsPanelOpen ? 'expand_less' : 'tune'}
                </span>
                <span>{slugsPanelOpen ? 'Paneli Yığ' : 'Bütün Linkləri Tənzimlə'}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAllSlugs}
                className="admin-btn-primary"
                style={{ padding: '5px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>save</span>
                <span>Bütün Linkləri Saxla</span>
              </button>
            </div>
          </div>

          {slugsPanelOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '10px'
              }}>
                {PAGES_CONFIG.map(page => {
                  const currentVal = slugsForm[page.id] !== undefined ? slugsForm[page.id] : (DEFAULT_PAGE_SLUGS[page.id] || '');
                  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://monodoxia.academy';
                  const effectivePath = page.id === 'home'
                    ? (currentVal ? `/${currentVal}` : '/')
                    : `/${currentVal || DEFAULT_PAGE_SLUGS[page.id] || page.id}`;
                  const effectiveUrl = `${baseUrl}${effectivePath}`;
                  const isCustom = currentVal !== (DEFAULT_PAGE_SLUGS[page.id] || '');

                  return (
                    <div
                      key={page.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: '#fafaf9',
                        border: selectedPage === page.id ? '1.5px solid #c5a059' : '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>
                            {page.icon}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                            {page.label}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: isCustom ? '#fef3c7' : '#f1f5f9',
                          color: isCustom ? '#b45309' : '#64748b'
                        }}>
                          {isCustom ? 'XÜSUSİ LİNK' : 'STANDART'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', padding: '0 8px', background: '#f8fafc', height: '30px', display: 'flex', alignItems: 'center', borderRight: '1px solid #e2e8f0', fontWeight: 600 }}>
                          /
                        </span>
                        <input
                          type="text"
                          value={slugsForm[page.id] ?? ''}
                          onChange={e => {
                            const val = sanitizeSlug(e.target.value);
                            setSlugsForm(prev => ({ ...prev, [page.id]: val }));
                          }}
                          placeholder={DEFAULT_PAGE_SLUGS[page.id] || (page.id === 'home' ? '(ana səhifə /)' : page.id)}
                          style={{
                            flex: 1,
                            padding: '4px 8px',
                            fontSize: '11px',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            color: '#0f172a'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px', fontFamily: 'monospace' }} title={effectiveUrl}>
                          {effectivePath}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator?.clipboard?.writeText) {
                                navigator.clipboard.writeText(effectiveUrl);
                                showToast(`Link kopyalandı: ${effectiveUrl}`, 'success');
                              }
                            }}
                            className="admin-btn-secondary"
                            style={{ padding: '2px 6px', fontSize: '10px' }}
                            title="Tam URL linkini kopyala"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>content_copy</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLivePreview(page.id)}
                            className="admin-btn-secondary"
                            style={{ padding: '2px 6px', fontSize: '10px' }}
                            title="Bu səhifəyə keç"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>open_in_new</span>
                          </button>
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => {
                                setSlugsForm(prev => ({ ...prev, [page.id]: DEFAULT_PAGE_SLUGS[page.id] || '' }));
                              }}
                              className="admin-btn-secondary"
                              style={{ padding: '2px 6px', fontSize: '10px', color: '#dc2626' }}
                              title="Standart linkə sıfırla"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>undo</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleResetSlugs}
                  className="admin-btn-secondary"
                  style={{ fontSize: '11px', color: '#dc2626' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restart_alt</span>
                  <span>Bütün Linkləri Standarta Sıfırla</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveAllSlugs}
                  className="admin-btn-primary"
                  style={{ fontSize: '11px', padding: '6px 14px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>save</span>
                  <span>Bütün Dəyişiklikləri Yadda Saxla</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 1. AKADEMİYA SƏHİFƏSİ REDAKTƏ PANELİ */}
        {selectedPage === 'akademiya' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>school</span>
                  <span>Akademiya Səhifəsi (#akademiya)</span>
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Kurslar, kateqoriyalar və akademik tədris zəmanəti mətni</p>
              </div>

              <button
                type="button"
                onClick={() => handleLivePreview('akademiya')}
                className="admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                <span>Saytda Bu Səhifəyə Bax</span>
              </button>
            </div>

            <PageUrlInlineBar
              pageId="akademiya"
              slugsForm={slugsForm}
              setSlugsForm={setSlugsForm}
              onSaveSlug={handleSaveSingleSlug}
              onLivePreview={handleLivePreview}
              showToast={showToast}
            />

            <PageField label="Səhifə Üst Etiketi (Badge)" block={academyData} setBlock={setAcademyData} fieldKey="badge" placeholder="Məs: Akademik Tədris" />
            <PageField label="Səhifə Əsas Başlığı (Title)" block={academyData} setBlock={setAcademyData} fieldKey="title" placeholder="Məs: Kurslar və Sertifikasiya Proqramları" />
            <PageField label="Səhifə Təsviri (Desc)" block={academyData} setBlock={setAcademyData} fieldKey="desc" multiline rows={3} placeholder="Akademiyanın təhsil istiqaməti haqqında geniş izah..." />
            <PageField label="Düymə Mətni (CTA)" block={academyData} setBlock={setAcademyData} fieldKey="ctaText" placeholder="Məs: Kurslara Bax" />

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => savePage('academy', academyData)}
                className="admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                <span>Akademiya Məlumatlarını Yadda Saxla</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. KOUÇİNQ SƏHİFƏSİ REDAKTƏ PANELİ */}
        {selectedPage === 'koucinq' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>psychology</span>
                  <span>Kouçinq Səhifəsi (#koucinq)</span>
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Mentor heyəti, fərdi seans rezervasiyası və metodologiya bölmələri</p>
              </div>

              <button
                type="button"
                onClick={() => handleLivePreview('koucinq')}
                className="admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                <span>Saytda Bu Səhifəyə Bax</span>
              </button>
            </div>

            <PageUrlInlineBar
              pageId="koucinq"
              slugsForm={slugsForm}
              setSlugsForm={setSlugsForm}
              onSaveSlug={handleSaveSingleSlug}
              onLivePreview={handleLivePreview}
              showToast={showToast}
            />

            <PageField label="Səhifə Üst Etiketi (Badge)" block={coachesData} setBlock={setCoachesData} fieldKey="badge" placeholder="Məs: Ekspert Heyəti" />
            <PageField label="Səhifə Əsas Başlığı (Title)" block={coachesData} setBlock={setCoachesData} fieldKey="title" placeholder="Məs: Beynəlxalq Sertifikatlı Mentorlarımız" />
            <PageField label="Səhifə Təsviri (Desc)" block={coachesData} setBlock={setCoachesData} fieldKey="desc" multiline rows={3} placeholder="Mentorların təcrübəsi və kouçinq prosesi haqqında..." />

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => savePage('coaches', coachesData)}
                className="admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                <span>Kouçinq Məlumatlarını Yadda Saxla</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. COACHING CLUB SƏHİFƏSİ REDAKTƏ PANELİ */}
        {selectedPage === 'club' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>card_membership</span>
                    <span>Coaching Club Səhifəsi (#club) — Əsas Başlıq & İmtiyazlar</span>
                  </h5>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Klubun fəlsəfəsi, imtiyaz bəndləri və üzvlük çağırışı</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLivePreview('club')}
                  className="admin-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                  <span>Saytda Bu Səhifəyə Bax</span>
                </button>
              </div>

              <PageUrlInlineBar
                pageId="club"
                slugsForm={slugsForm}
                setSlugsForm={setSlugsForm}
                onSaveSlug={handleSaveSingleSlug}
                onLivePreview={handleLivePreview}
                showToast={showToast}
              />

              <PageField label="Üst Etiket (Badge)" block={clubData} setBlock={setClubData} fieldKey="badge" placeholder="Məs: QAPALI İCMA ÜZVLÜYÜ" />
              <PageField label="Klub Başlığı (Title)" block={clubData} setBlock={setClubData} fieldKey="title" placeholder="Məs: Monodoxia Coaching Club — Həmfikirlərin Seçilmiş Məkanı" />
              <PageField label="Klub Təsviri (Desc)" block={clubData} setBlock={setClubData} fieldKey="desc" multiline rows={3} />
              
              <PageImageField label="Klub Şəkli (Opsional)" value={clubData.image} onChange={v => setClubData(p => ({ ...p, image: v }))} />

              <PageField
                label="Klub İmtiyazları (Perks - hər sətirdə bir bənd)"
                block={clubData}
                setBlock={setClubData}
                fieldKey="perks"
                isArray={true}
                multiline={true}
                rows={4}
                placeholder="Hər sətirdə bir imtiyaz yazın..."
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <PageField label="Müraciət Düyməsi (CTA)" block={clubData} setBlock={setClubData} fieldKey="ctaBtnText" placeholder="Məs: Kluba qoşul" />
                <PageField label="Məhdudiyyət Xəbərdarlığı" block={clubData} setBlock={setClubData} fieldKey="limitedText" placeholder="Məs: Məhdud sayda yer: Aylıq qəbul" />
              </div>
            </div>

            {/* Club Premium Tier Card Editor */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', margin: 0 }}>
                Coaching Club — Rezidentlik Paket Kartı Mətnləri
              </h5>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <PageField label="Kart Üst Etiketi" block={clubData} setBlock={setClubData} fieldKey="tierBadge" placeholder="PREMIUM REZİDENT" />
                <PageField label="Paket Başlığı" block={clubData} setBlock={setClubData} fieldKey="tierTitle" placeholder="Premium Rezident" />
              </div>

              <PageField label="Paket İzahı (Alt başlıq)" block={clubData} setBlock={setClubData} fieldKey="tierSubtitle" placeholder="Aylıq və ya illik daxil olma paketi" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <PageField label="Qiymət (Rəqəm)" block={clubData} setBlock={setClubData} fieldKey="tierPrice" placeholder="95" />
                <PageField label="Dövr (Period)" block={clubData} setBlock={setClubData} fieldKey="tierPeriod" placeholder="/ aylıq" />
                <PageField label="Endirim Təklifi" block={clubData} setBlock={setClubData} fieldKey="tierOffer" placeholder="İllik ödənişdə 2 ay hədiyyə" />
              </div>

              <PageField
                label="Paketə Daxil Olan Xüsusiyyətlər (hər sətirdə bir maddə)"
                block={clubData}
                setBlock={setClubData}
                fieldKey="tierFeatures"
                isArray={true}
                multiline={true}
                rows={5}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => savePage('club', clubData)}
                  className="admin-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                  <span>Coaching Club Məlumatlarını Yadda Saxla</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. TƏDBİRLƏR SƏHİFƏSİ REDAKTƏ PANELİ */}
        {selectedPage === 'tedbirler' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>event</span>
                  <span>Tədbirlər Səhifəsi (#tedbirler)</span>
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Canlı təqvim qrafiki, vebinarlar və emalatxana məlumatları</p>
              </div>

              <button
                type="button"
                onClick={() => handleLivePreview('tedbirler')}
                className="admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                <span>Saytda Bu Səhifəyə Bax</span>
              </button>
            </div>

            <PageUrlInlineBar
              pageId="tedbirler"
              slugsForm={slugsForm}
              setSlugsForm={setSlugsForm}
              onSaveSlug={handleSaveSingleSlug}
              onLivePreview={handleLivePreview}
              showToast={showToast}
            />

            <PageField label="Səhifə Üst Etiketi (Badge)" block={eventsData} setBlock={setEventsData} fieldKey="badge" placeholder="Məs: Canlı Təqvim" />
            <PageField label="Səhifə Əsas Başlığı (Title)" block={eventsData} setBlock={setEventsData} fieldKey="title" placeholder="Məs: Yaxınlaşan Tədbirlər və Masterklaslar" />
            <PageField label="Səhifə Təsviri (Desc)" block={eventsData} setBlock={setEventsData} fieldKey="desc" multiline rows={3} placeholder="Canlı interaktiv vebinarlar..." />
            <PageField label="Təqvim Düyməsi Mətni" block={eventsData} setBlock={setEventsData} fieldKey="calendarBtnText" placeholder="Məs: Bütün Təqvim" />

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => savePage('events', eventsData)}
                className="admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                <span>Tədbirlər Səhifəsini Yadda Saxla</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. İCMA SƏHİFƏSİ REDAKTƏ PANELİ */}
        {selectedPage === 'icma' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>forum</span>
                  <span>İcma Səhifəsi (#icma)</span>
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>İntellektual şəbəkə, gündəlik müzakirələr və dialoq qaydaları</p>
              </div>

              <button
                type="button"
                onClick={() => handleLivePreview('icma')}
                className="admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                <span>Saytda Bu Səhifəyə Bax</span>
              </button>
            </div>

            <PageUrlInlineBar
              pageId="icma"
              slugsForm={slugsForm}
              setSlugsForm={setSlugsForm}
              onSaveSlug={handleSaveSingleSlug}
              onLivePreview={handleLivePreview}
              showToast={showToast}
            />

            <PageField label="Səhifə Üst Etiketi (Badge)" block={communityData} setBlock={setCommunityData} fieldKey="badge" placeholder="Məs: İntellektual Şəbəkə" />
            <PageField label="Səhifə Əsas Başlığı (Title)" block={communityData} setBlock={setCommunityData} fieldKey="title" placeholder="Məs: Düşüncə və Təcrübə Mübadiləsi" />
            <PageField label="Səhifə Təsviri (Desc)" block={communityData} setBlock={setCommunityData} fieldKey="desc" multiline rows={3} placeholder="Akademiyamızın tələbələri üçün gündəlik dialoq sahəsi..." />
            <PageField label="Yeni Mövzu Düymə Mətni" block={communityData} setBlock={setCommunityData} fieldKey="newTopicBtnText" placeholder="Məs: Yeni Mövzu Başlat" />

            <PageField
              label="İcma Xüsusiyyətləri / Bəndləri (hər sətirdə bir maddə)"
              block={communityData}
              setBlock={setCommunityData}
              fieldKey="bullets"
              isArray={true}
              multiline={true}
              rows={3}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => savePage('community', communityData)}
                className="admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                <span>İcma Səhifəsini Yadda Saxla</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. HAQQIMIZDA SƏHİFƏSİ REDAKTƏ PANELİ */}
        {selectedPage === 'haqqimizda' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>auto_stories</span>
                    <span>Haqqımızda Səhifəsi (#haqqimizda) — Məram & Əsas Media</span>
                  </h5>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Akademiyanın fəlsəfəsi, sol media şəkli/videosu və vizual çərçivə stili</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLivePreview('haqqimizda')}
                  className="admin-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                  <span>Saytda Bu Səhifəyə Bax</span>
                </button>
              </div>

              <PageUrlInlineBar
                pageId="haqqimizda"
                slugsForm={slugsForm}
                setSlugsForm={setSlugsForm}
                onSaveSlug={handleSaveSingleSlug}
                onLivePreview={handleLivePreview}
                showToast={showToast}
              />

              <PageField label="Səhifə Üst Etiketi (Badge)" block={aboutData} setBlock={setAboutData} fieldKey="badge" placeholder="Məs: Akademiyanın Məramı" />
              <PageField label="Səhifə Əsas Başlığı (Title)" block={aboutData} setBlock={setAboutData} fieldKey="title" placeholder="Məs: Daxili ahəngdarlıq və şüurlu həyat üçün..." />
              <PageField label="Səhifə Təsviri (Desc)" block={aboutData} setBlock={setAboutData} fieldKey="desc" multiline rows={3} />

              {/* Media Type & URL */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label className="admin-label">Sol Media Növü</label>
                  <select
                    value={aboutData.mediaType || 'image'}
                    onChange={e => setAboutData(p => ({ ...p, mediaType: e.target.value }))}
                    className="admin-select"
                  >
                    <option value="image">Şəkil (Image)</option>
                    <option value="video">Video (YouTube / MP4)</option>
                  </select>
                </div>

                {aboutData.mediaType === 'video' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label className="admin-label">Video URL</label>
                    <input
                      type="text"
                      value={aboutData.videoUrl || ''}
                      onChange={e => setAboutData(p => ({ ...p, videoUrl: e.target.value }))}
                      className="admin-input"
                      placeholder="YouTube linki və ya .mp4 linki..."
                    />
                  </div>
                ) : (
                  <PageImageField
                    label="Əsas Şəkil"
                    value={aboutData.image}
                    onChange={v => setAboutData(p => ({ ...p, image: v }))}
                  />
                )}
              </div>

              {/* Frame Style & Dimensions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label className="admin-label">Frame Stili</label>
                  <select
                    value={aboutData.frameStyle || 'rounded'}
                    onChange={e => setAboutData(p => ({ ...p, frameStyle: e.target.value }))}
                    className="admin-select"
                  >
                    <option value="arch">Tağvari (Arch)</option>
                    <option value="rounded">Yuvarlaq (Rounded)</option>
                    <option value="circle">Dairəvi (Circle)</option>
                    <option value="classic">Klassik Düzbucaqlı</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label className="admin-label">Çərçivə Xətti (Stroke)</label>
                  <select
                    value={String(aboutData.strokeWidth || 1)}
                    onChange={e => setAboutData(p => ({ ...p, strokeWidth: Number(e.target.value) }))}
                    className="admin-select"
                  >
                    <option value="0">0px (Xətsiz)</option>
                    <option value="1">1px (Zərif Qızılı)</option>
                    <option value="2">2px (Orta)</option>
                    <option value="3">3px (Qalın)</option>
                  </select>
                </div>

                <PageField label="Sol Alt Etiket" block={aboutData} setBlock={setAboutData} fieldKey="imageBadgeLeft" placeholder="Məs: Gündəlik Fərqindəlik" />
                <PageField label="Sağ Alt Etiket" block={aboutData} setBlock={setAboutData} fieldKey="imageBadgeRight" placeholder="Məs: 01 / SÜKUT" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => savePage('about', aboutData)}
                  className="admin-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                  <span>Haqqımızda Məlumatlarını Yadda Saxla</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. ANA SƏHİFƏ (HERO) REDAKTƏ PANELİ */}
        {selectedPage === 'home' && (
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>home</span>
                  <span>Ana Səhifə — Giriş Hero Bölməsi (#home)</span>
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Saytın ilk açılış ekranı: 3 başlıq, təsvir, statistik rəqəmlər və hero şəkil/video</p>
              </div>

              <button
                type="button"
                onClick={() => handleLivePreview('home')}
                className="admin-btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                <span>Saytda Ana Səhifəyə Bax</span>
              </button>
            </div>

            <PageUrlInlineBar
              pageId="home"
              slugsForm={slugsForm}
              setSlugsForm={setSlugsForm}
              onSaveSlug={handleSaveSingleSlug}
              onLivePreview={handleLivePreview}
              showToast={showToast}
            />

            <PageField label="Hero Üst Etiketi (Badge)" block={heroData} setBlock={setHeroData} fieldKey="badge" placeholder="FƏRDİ İNKİŞAF VƏ PSİXOLOGİYA MƏRKƏZİ" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <PageField label="1-ci Başlıq Sətri" block={heroData} setBlock={setHeroData} fieldKey="title1" placeholder="Özünü tanı." />
              <PageField label="2-ci Başlıq Sətri (Qızılı/Kursiv)" block={heroData} setBlock={setHeroData} fieldKey="title2" placeholder="Özünü inkişaf etdir." />
              <PageField label="3-cü Başlıq Sətri" block={heroData} setBlock={setHeroData} fieldKey="title3" placeholder="Həyatını dəyiş." />
            </div>

            <PageField label="Hero Geniş Təsviri" block={heroData} setBlock={setHeroData} fieldKey="desc" multiline rows={3} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <PageField label="1-ci CTA Düymə Mətni" block={heroData} setBlock={setHeroData} fieldKey="btnPrimaryText" placeholder="Akademiyanı kəşf et" />
              <PageField label="2-ci CTA Düymə Mətni" block={heroData} setBlock={setHeroData} fieldKey="btnSecondaryText" placeholder="Coaching Club ilə tanış ol" />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <PageField label="1-ci Statistika Rəqəmi" block={heroData} setBlock={setHeroData} fieldKey="stat1Num" placeholder="12,000+" />
                <PageField label="1-ci Statistika İzahı" block={heroData} setBlock={setHeroData} fieldKey="stat1Label" placeholder="Fərdi Tələbə" />
              </div>
              <div>
                <PageField label="2-ci Statistika Rəqəmi" block={heroData} setBlock={setHeroData} fieldKey="stat2Num" placeholder="98%" />
                <PageField label="2-ci Statistika İzahı" block={heroData} setBlock={setHeroData} fieldKey="stat2Label" placeholder="Məmnuniyyət" />
              </div>
              <div>
                <PageField label="3-cü Statistika Rəqəmi" block={heroData} setBlock={setHeroData} fieldKey="stat3Num" placeholder="ICF & PhD" />
                <PageField label="3-cü Statistika İzahı" block={heroData} setBlock={setHeroData} fieldKey="stat3Label" placeholder="Sertifikatlı Kouçlar" />
              </div>
            </div>

            {/* Hero Image / Video */}
            <PageImageField label="Hero Şəkli" value={heroData.image} onChange={v => setHeroData(p => ({ ...p, image: v }))} />
            <PageField label="Hero Şəkil Sitatı" block={heroData} setBlock={setHeroData} fieldKey="quote" placeholder="Daxili səssizlikdə bütün cavablar aşkarlanır." />

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => savePage('hero', heroData)}
                className="admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                <span>Ana Səhifə (Hero) Məlumatlarını Yadda Saxla</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </PagesFieldContext.Provider>
  );
}

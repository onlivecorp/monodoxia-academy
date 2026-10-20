import React, { useState, useEffect, useContext, createContext } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import AdminConfirmModal from './AdminConfirmModal';
import { getHeroMediaStyles, getAboutMediaStyles, parseVideoUrl } from '../../utils/heroMediaHelper';


const CmsFieldContext = createContext({
  cmsLang: 'az',
  cmsShowAllLangs: false,
  langs: [],
  showToast: () => {}
});

  // Reusable Field Component
function Field({
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
  const { cmsLang, cmsShowAllLangs, langs, showToast } = useContext(CmsFieldContext);
    const [localExpanded, setLocalExpanded] = useState(false);
    const isExpanded = cmsShowAllLangs || localExpanded;
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
      const finalVal = isArray
        ? rawVal.split('\n')
        : rawVal;

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
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label className="admin-label" style={{ margin: 0 }}>{label}</label>
            {!isExpanded && (
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '4px',
                background: cmsLang === 'az' ? '#f1f5f9' : '#fef3c7',
                color: cmsLang === 'az' ? '#475569' : '#b45309',
                textTransform: 'uppercase'
              }}>
                {cmsLang}
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

        {/* Inputs */}
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
            {cmsLang !== 'az' && isBlockMode && (
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
                    {azValue ? (azValue.length > 130 ? azValue.slice(0, 130) + '...' : azValue) : '(Hələ doldurulmayıb)'}
                  </span>
                </div>
                {azValue && !getLangVal(cmsLang) && (
                  <button
                    type="button"
                    onClick={() => copyFromAz(cmsLang)}
                    style={{
                      padding: '2px 8px',
                      fontSize: '10px',
                      fontWeight: 600,
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
                value={getLangVal(cmsLang)}
                onChange={e => handleLangChange(cmsLang, e.target.value)}
                className="admin-input"
                style={{ resize: 'vertical' }}
                placeholder={placeholder || `${label} (${cmsLang.toUpperCase()})...`}
              />
            ) : (
              <input
                type="text"
                value={getLangVal(cmsLang)}
                onChange={e => handleLangChange(cmsLang, e.target.value)}
                className="admin-input"
                placeholder={placeholder || `${label} (${cmsLang.toUpperCase()})...`}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  // ImageField helper
function ImageField({ label, value, onChange }) {
  const { showToast } = useContext(CmsFieldContext);
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
              placeholder="URL daxil edin və ya fayl seçin..."
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
                <span style={{ fontSize: '10px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{value.startsWith('data:') ? 'Lokal yüklənmiş fayl (Base64)' : value}</span>
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
  };


export default function AdminCmsTab() {
  const {
    homeContent = {},
    updateHomeBlock,
    clubTiersList = [],
    updateClubTier,
    pillarsList = [],
    addPillar,
    updatePillar,
    deletePillar,
    updateAllPillars,
    areasList = [],
    addArea,
    updateArea,
    deleteArea,
    updateAllAreas,
    testimonialsList = [],
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    faqsList = [],
    addFaq,
    updateFaq,
    deleteFaq,
    coachesList = [],
    addCoach,
    updateCoach,
    deleteCoach,
    usersList = [],
    showToast
  } = useApp();

  const { supportedLangs = [] } = useLanguage();

  const cmsBlocks = [
    { id: 'navbar', label: 'Loqo & Naviqasiya' },
    { id: 'hero', label: 'Ana Səhifə — Hero Bölməsi' },
    { id: 'academy', label: '📄 Akademiya Səhifəsi' },
    { id: 'coaches', label: '📄 Kouçinq Səhifəsi & Mentorlar' },
    { id: 'club', label: '📄 Coaching Club Səhifəsi' },
    { id: 'events', label: '📄 Tədbirlər Səhifəsi' },
    { id: 'community', label: '📄 İcma Səhifəsi' },
    { id: 'about', label: '📄 Haqqımızda (Məram & Sol Media)' },
    { id: 'areas', label: '📄 Haqqımızda (8 Sahə Modulları)' },
    { id: 'testimonials', label: 'Rəylər' },
    { id: 'faq', label: 'Tez-tez soruşulan suallar' },
    { id: 'newsletter', label: 'Bülletenə abunəlik' },
    { id: 'footer', label: 'Footer & Loqo' },
  ];

  const langs = (supportedLangs && supportedLangs.length > 0) ? supportedLangs : [
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const [cmsBlock, setCmsBlock] = useState('navbar');
  const [cmsLang, setCmsLang] = useState('az');
  const [cmsShowAllLangs, setCmsShowAllLangs] = useState(false);

  const defaultClubData = {
    badge: "QAPALI İCMA ÜZVLÜYÜ",
    title: "Monodoxia Coaching Club — Həmfikirlərin Seçilmiş Məkanı",
    desc: "Davamlı inkişaf fərdi bir hadisə deyil, doğru mühitin bəhrəsidir. Coaching Club — dərin suallar verən, səthilikdən uzaq, bir-birinin təkamülünə töhfə verən seçkin şəxslərin qapalı ekosistemidir.",
    perks: [
      "Həftəlik canlı mentorluq və mastermind sessiyaları: Təcrübəli mentorlarla birbaşa dialoq.",
      "Özəl meditasiya və təcrübə arxivi: 100+ saatlıq audio və video bələdçilər.",
      "Qapalı intellektual icma müzakirələri: Konfidensial təhlükəsiz platforma.",
      "Oflayn tədbirlərə və retreat-lərə VIP giriş: Qapalı illik düşərgələr."
    ],
    ctaBtnText: "Kluba qoşul",
    limitedText: "Məhdud sayda yer: Aylıq qəbul",
    tierBadge: "PREMIUM REZİDENT",
    tierTitle: "Premium Rezident",
    tierSubtitle: "Aylıq və ya illik daxil olma paketi",
    tierPrice: "95",
    tierPeriod: "/ aylıq",
    tierOffer: "İllik ödənişdə 2 ay hədiyyə",
    tierFeatures: [
      "Bütün canlı klub tədbirləri və masterklaslar",
      "Telegram VIP məxfi müzakirə otağı",
      "Kurslara 25% fərdi endirim",
      "Aylıq 1 fərdi diaqnostik orientasiya",
      "Tam 100+ saatlıq meditasiya və video arxivi"
    ],
    tierCtaText: "REZİDENT OL",
    translations: {
      az: {
        badge: "QAPALI İCMA ÜZVLÜYÜ",
        title: "Monodoxia Coaching Club — Həmfikirlərin Seçilmiş Məkanı",
        desc: "Davamlı inkişaf fərdi bir hadisə deyil, doğru mühitin bəhrəsidir. Coaching Club — dərin suallar verən, səthilikdən uzaq, bir-birinin təkamülünə töhfə verən seçkin şəxslərin qapalı ekosistemidir.",
        perks: [
          "Həftəlik canlı mentorluq və mastermind sessiyaları: Təcrübəli mentorlarla birbaşa dialoq.",
          "Özəl meditasiya və təcrübə arxivi: 100+ saatlıq audio və video bələdçilər.",
          "Qapalı intellektual icma müzakirələri: Konfidensial təhlükəsiz platforma.",
          "Oflayn tədbirlərə və retreat-lərə VIP giriş: Qapalı illik düşərgələr."
        ],
        ctaBtnText: "Kluba qoşul",
        limitedText: "Məhdud sayda yer: Aylıq qəbul",
        tierBadge: "PREMIUM REZİDENT",
        tierTitle: "Premium Rezident",
        tierSubtitle: "Aylıq və ya illik daxil olma paketi",
        tierPrice: "95",
        tierPeriod: "/ aylıq",
        tierOffer: "İllik ödənişdə 2 ay hədiyyə",
        tierFeatures: [
          "Bütün canlı klub tədbirləri və masterklaslar",
          "Telegram VIP məxfi müzakirə otağı",
          "Kurslara 25% fərdi endirim",
          "Aylıq 1 fərdi diaqnostik orientasiya",
          "Tam 100+ saatlıq meditasiya və video arxivi"
        ],
        tierCtaText: "REZİDENT OL"
      },
      en: {
        badge: "EXCLUSIVE RESIDENCY",
        title: "Monodoxia Coaching Club — Sanctuary for Like Minds",
        desc: "Sustainable development is the fruit of the right ecosystem. Coaching Club is an exclusive sanctuary for individuals who value intellectual depth and mutual evolution.",
        perks: [
          "Weekly live mentoring and mastermind sessions: Direct dialogue with experienced mentors.",
          "Exclusive meditation and practice archive: 100+ hours of audio and video guides.",
          "Private intellectual community discussions: Confidential secure platform.",
          "VIP access to offline events and retreats: Exclusive annual camps."
        ],
        ctaBtnText: "Join the Club",
        limitedText: "Limited availability: Monthly cohorts",
        tierBadge: "PREMIUM RESIDENT",
        tierTitle: "Premium Resident",
        tierSubtitle: "Monthly or annual access plan",
        tierPrice: "95",
        tierPeriod: "/ monthly",
        tierOffer: "2 months free with annual billing",
        tierFeatures: [
          "All live club events and masterclasses",
          "Telegram VIP private discussion group",
          "25% personal discount on courses",
          "1 monthly individual diagnostic orientation",
          "Full 100+ hours meditation and video archive"
        ],
        tierCtaText: "BECOME A RESIDENT"
      },
      tr: {
        badge: "ÖZEL ÜYELİK",
        title: "Monodoxia Coaching Club — Ortak Zihinlerin Buluşma Noktası",
        desc: "Sürdürülebilir gelişim doğru çevrenin eseridir. Coaching Club, derin sorular soran ve birbirinin gelişimine katkı sağlayan seçkin bireylerin kapalı alanıdır.",
        perks: [
          "Haftalık canlı mentorluk ve mastermind oturumları: Deneyimli mentorlarla doğrudan diyalog.",
          "Özel meditasyon ve pratik arşivi: 100+ saatlik sesli ve görüntülü rehberler.",
          "Kapalı entelektüel topluluk tartışmaları: Gizli ve güvenli platform.",
          "Çevrimdışı etkinliklere ve kamplara VIP giriş: Kapalı yıllık kamplar."
        ],
        ctaBtnText: "Kulübe Katıl",
        limitedText: "Kontenjan sınırlı: Aylık kabul",
        tierBadge: "PREMİUM REZİDANS",
        tierTitle: "Premium Üye",
        tierSubtitle: "Aylık veya yıllık erişim paketi",
        tierPrice: "95",
        tierPeriod: "/ aylık",
        tierOffer: "Yıllık ödemede 2 ay hediye",
        tierFeatures: [
          "Tüm canlı kulüp etkinlikleri ve masterclasslar",
          "Telegram VIP gizli tartışma odası",
          "Kurslarda %25 kişisel indirim",
          "Ayda 1 bireysel diagnostik oryantasyon",
          "Tam 100+ saatlik meditasyon ve video arşivi"
        ],
        tierCtaText: "REZİDENT OL"
      },
      ru: {
        badge: "ЗАКРЫТОЕ ЧЛЕНСТВО",
        title: "Monodoxia Coaching Club — Пространство Единомышленников",
        desc: "Устойчивое развитие — результат правильного окружения. Закрытый клуб для глубоких личностей, ориентированных на рост.",
        perks: [
          "Еженедельные живые сессии менторства и мастермайнды: Прямой диалог с опытными наставниками.",
          "Эксклюзивный архив медитаций и практик: 100+ часов аудио- и видеоматериалов.",
          "Закрытые интеллектуальные дискуссии сообщества: Конфиденциальная безопасная платформа.",
          "VIP-доступ к офлайн-мероприятиям и ретритам: Закрытые ежегодные кемпы."
        ],
        ctaBtnText: "Вступить в клуб",
        limitedText: "Ограниченное количество мест: Ежемесячный набор",
        tierBadge: "ПРЕМИУМ РЕЗИДЕНТ",
        tierTitle: "Премиум резидент",
        tierSubtitle: "Ежемесячный или годовой план",
        tierPrice: "95",
        tierPeriod: "/ месяц",
        tierOffer: "При годовой оплате — 2 месяца в подарок",
        tierFeatures: [
          "Все живые клубные мероприятия и мастер-классы",
          "Закрытая VIP группа в Telegram",
          "Персональная скидка 25% на курсы",
          "1 индивидуальная диагностическая ориентация в месяц",
          "Полный архив 100+ часов медитаций и видео"
        ],
        tierCtaText: "СТАТЬ РЕЗИДЕНТОМ"
      }
    }
  };

  const mergeClubWithDefaults = (src) => {
    const raw = src || {};
    return {
      ...defaultClubData,
      ...raw,
      perks: (Array.isArray(raw.perks) && raw.perks.length > 0) ? raw.perks : defaultClubData.perks,
      tierFeatures: (Array.isArray(raw.tierFeatures) && raw.tierFeatures.length > 0) ? raw.tierFeatures : defaultClubData.tierFeatures,
      translations: {
        az: { ...defaultClubData.translations.az, ...(raw.translations?.az || {}) },
        en: { ...defaultClubData.translations.en, ...(raw.translations?.en || {}) },
        tr: { ...defaultClubData.translations.tr, ...(raw.translations?.tr || {}) },
        ru: { ...defaultClubData.translations.ru, ...(raw.translations?.ru || {}) },
      }
    };
  };

  // Content block states
  const [cmsNavbar, setCmsNavbar] = useState(() => ({ ...(homeContent?.navbar || {}) }));
  const [cmsHero, setCmsHero] = useState(() => ({ ...(homeContent?.hero || {}) }));
  const [cmsAbout, setCmsAbout] = useState(() => ({ ...(homeContent?.about || {}) }));
  const [cmsAreas, setCmsAreas] = useState(() => ({ ...(homeContent?.areas || {}) }));
  const [cmsAcademy, setCmsAcademy] = useState(() => ({ ...(homeContent?.academy || {}) }));
  const [cmsClub, setCmsClub] = useState(() => mergeClubWithDefaults(homeContent?.club));
  const [cmsCoaches, setCmsCoaches] = useState(() => ({ ...(homeContent?.coaches || {}) }));
  const [cmsEvents, setCmsEvents] = useState(() => ({ ...(homeContent?.events || {}) }));
  const [cmsCommunity, setCmsCommunity] = useState(() => ({ ...(homeContent?.community || {}) }));
  const [cmsTestimonials, setCmsTestimonials] = useState(() => ({ ...(homeContent?.testimonials || {}) }));
  const [cmsFaq, setCmsFaq] = useState(() => ({ ...(homeContent?.faq || {}) }));
  const [cmsNewsletter, setCmsNewsletter] = useState(() => ({ ...(homeContent?.newsletter || {}) }));
  const [cmsFooter, setCmsFooter] = useState(() => ({ ...(homeContent?.footer || {}) }));

  // Coach add/edit states
  const [editingCoach, setEditingCoach] = useState(null);
  const [newCoachUserId, setNewCoachUserId] = useState('');
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachTitle, setNewCoachTitle] = useState('');
  const [newCoachBio, setNewCoachBio] = useState('');
  const [newCoachImage, setNewCoachImage] = useState('');
  const [newCoachSpecialties, setNewCoachSpecialties] = useState('');

  // Testimonials add & edit states
  const emptyTestimonial = {
    quote: '',
    author: '',
    role: '',
    translations: {
      az: { quote: '', author: '', role: '' },
      en: { quote: '', author: '', role: '' },
      tr: { quote: '', author: '', role: '' },
      ru: { quote: '', author: '', role: '' }
    }
  };
  const [newTestimonial, setNewTestimonial] = useState(emptyTestimonial);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // FAQ add & edit states
  const emptyFaq = {
    question: '',
    answer: '',
    translations: {
      az: { question: '', answer: '' },
      en: { question: '', answer: '' },
      tr: { question: '', answer: '' },
      ru: { question: '', answer: '' }
    }
  };
  const [newFaq, setNewFaq] = useState(emptyFaq);
  const [editingFaq, setEditingFaq] = useState(null);

  // Pillar states & direct fields
  const [cmsPillars, setCmsPillars] = useState(() => {
    if (homeContent?.about?.pillars && Array.isArray(homeContent.about.pillars) && homeContent.about.pillars.length > 0) {
      return homeContent.about.pillars;
    }
    return (pillarsList && pillarsList.length > 0) ? [...pillarsList] : [];
  });

  // Areas states & direct fields
  const [cmsAreasList, setCmsAreasList] = useState(() => {
    if (homeContent?.areas?.items && Array.isArray(homeContent.areas.items) && homeContent.areas.items.length > 0) {
      return homeContent.areas.items;
    }
    return (areasList && areasList.length > 0) ? [...areasList] : [];
  });

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'coach'|'pillar'|'testimonial'|'faq', item }

  useEffect(() => {
    if (homeContent) {
      setCmsNavbar({ ...(homeContent.navbar || {}) });
      setCmsHero({ ...(homeContent.hero || {}) });
      setCmsAbout({ ...(homeContent.about || {}) });
      setCmsAreas({ ...(homeContent.areas || {}) });
      setCmsAcademy({ ...(homeContent.academy || {}) });
      setCmsClub(mergeClubWithDefaults(homeContent.club));
      setCmsCoaches({ ...(homeContent.coaches || {}) });
      setCmsEvents({ ...(homeContent.events || {}) });
      setCmsCommunity({ ...(homeContent.community || {}) });
      setCmsTestimonials({ ...(homeContent.testimonials || {}) });
      setCmsFaq({ ...(homeContent.faq || {}) });
      setCmsNewsletter({ ...(homeContent.newsletter || {}) });
      setCmsFooter({ ...(homeContent.footer || {}) });

      if (homeContent.about?.pillars && Array.isArray(homeContent.about.pillars) && homeContent.about.pillars.length > 0) {
        setCmsPillars(homeContent.about.pillars);
      } else if (pillarsList && pillarsList.length > 0) {
        setCmsPillars(pillarsList);
      }

      if (homeContent.areas?.items && Array.isArray(homeContent.areas.items) && homeContent.areas.items.length > 0) {
        setCmsAreasList(homeContent.areas.items);
      } else if (areasList && areasList.length > 0) {
        setCmsAreasList(areasList);
      }
    }
  }, [homeContent, pillarsList, areasList]);

  const updatePillarAt = (idx, updaterOrVal) => {
    setCmsPillars(prev => {
      const copy = [...prev];
      const cur = copy[idx] || {};
      const next = typeof updaterOrVal === 'function' ? updaterOrVal(cur) : updaterOrVal;
      copy[idx] = next;
      return copy;
    });
  };

  const removePillarAt = (idx) => {
    setCmsPillars(prev => prev.filter((_, i) => i !== idx));
    showToast('Kart siyahıdan silindi', 'info');
  };

  const addNewPillarCard = () => {
    const newIdx = cmsPillars.length + 1;
    const newP = {
      id: 'pillar-' + Date.now(),
      icon: 'psychology',
      title: `Yeni İstiqamət ${newIdx}`,
      desc: 'İstiqamət və dəyər haqqında qısa izah.',
      translations: {
        az: { title: `Yeni İstiqamət ${newIdx}`, desc: 'İstiqamət və dəyər haqqında qısa izah.' },
        en: { title: `New Core Pillar ${newIdx}`, desc: 'Short description about this value pillar.' },
        tr: { title: `Yeni İstikamet ${newIdx}`, desc: 'Bu değer sütunu hakkında kısa açıklama.' },
        ru: { title: `Новое направление ${newIdx}`, desc: 'Краткое описание данного направления.' }
      }
    };
    setCmsPillars(prev => [...prev, newP]);
    showToast('Yeni dəyər kartı sahəsi əlavə edildi', 'success');
  };

  const updateAreaAt = (idx, updaterOrVal) => {
    setCmsAreasList(prev => {
      const copy = [...prev];
      const cur = copy[idx] || {};
      const next = typeof updaterOrVal === 'function' ? updaterOrVal(cur) : updaterOrVal;
      copy[idx] = next;
      return copy;
    });
  };

  const removeAreaAt = (idx) => {
    setCmsAreasList(prev => prev.filter((_, i) => i !== idx));
    showToast('Sahə çıxarıldı', 'info');
  };

  const addNewAreaCard = () => {
    const num = cmsAreasList.length + 1;
    const padNum = String(num).padStart(2, '0');
    const newArea = {
      id: 'area-' + Date.now(),
      number: `${padNum} / SAHƏ`,
      title: `Yeni Sahə ${num}`,
      icon: 'explore',
      desc: 'İnkişaf istiqaməti və tematik modul haqqında ətraflı məlumat.',
      btnText: 'Kəşf et',
      link: '#akademiya',
      translations: {
        az: { number: `${padNum} / SAHƏ`, title: `Yeni Sahə ${num}`, desc: 'İnkişaf istiqaməti və tematik modul haqqında ətraflı məlumat.', btnText: 'Kəşf et' },
        en: { number: `${padNum} / PILLAR`, title: `New Area ${num}`, desc: 'Detailed information about this personal development pillar.', btnText: 'Explore' },
        tr: { number: `${padNum} / ALAN`, title: `Yeni Alan ${num}`, desc: 'Bu gelişim boyutu ve tematik modül hakkında detaylı bilgi.', btnText: 'Keşfet' },
        ru: { number: `${padNum} / СФЕРА`, title: `Новая Сфера ${num}`, desc: 'Подробная информация о данном направлении личностного роста.', btnText: 'Исследовать' }
      }
    };
    setCmsAreasList(prev => [...prev, newArea]);
    showToast('Yeni inkişaf sahəsi əlavə edildi', 'success');
  };

  const saveBlock = (blockKey, data) => {
    updateHomeBlock(blockKey, data);
    showToast('Məzmun yadda saxlandı!', 'success');
  };

  const saveAboutWithPillars = () => {
    const payload = {
      ...cmsAbout,
      pillars: cmsPillars
    };
    saveBlock('about', payload);
    if (updateAllPillars) {
      updateAllPillars(cmsPillars);
    }
    showToast('Akademiyanın Məramı və bütün dəyər kartları yadda saxlandı!', 'success');
  };

  const saveAreasWithItems = () => {
    const payload = {
      ...cmsAreas,
      items: cmsAreasList
    };
    saveBlock('areas', payload);
    if (updateAllAreas) {
      updateAllAreas(cmsAreasList);
    }
    showToast('Fundamental sahələr və bütün modullar yadda saxlandı!', 'success');
  };

  const confirmDeleteAction = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'coach') {
      deleteCoach(itemToDelete.item.id);
      showToast('Koç silindi.', 'info');
    } else if (itemToDelete.type === 'pillar') {
      deletePillar(itemToDelete.item.id);
      showToast('Məram kartı silindi.', 'info');
    } else if (itemToDelete.type === 'testimonial') {
      deleteTestimonial(itemToDelete.item.id);
      showToast('Rəy silindi.', 'info');
    } else if (itemToDelete.type === 'faq') {
      deleteFaq(itemToDelete.item.id);
      showToast('Sual silindi.', 'info');
    }
    setItemToDelete(null);
  };

  return (
    <CmsFieldContext.Provider value={{ cmsLang, cmsShowAllLangs, langs, showToast }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(itemToDelete)}
        title={
          itemToDelete?.type === 'coach'
            ? 'Koçu Sil'
            : itemToDelete?.type === 'testimonial'
            ? 'Rəyi Sil'
            : 'Sualı Sil'
        }
        message="Bu elementi silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        itemName={
          itemToDelete?.type === 'coach'
            ? itemToDelete.item.name
            : itemToDelete?.type === 'testimonial'
            ? itemToDelete.item.author
            : itemToDelete?.item?.question
        }
        confirmText="Bəli, Sil"
        onConfirm={confirmDeleteAction}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">Səhifə Məzmunu İdarəetməsi (CMS)</h4>
          <p className="admin-section-subtitle">Ana səhifənin bütün bloklarındakı mətnləri sistemin bütün dəstəklədiyi dillərdə idarə edin</p>
        </div>
        <span className="admin-count-badge">
          12 Aktiv Blok · Çoxdilli (i18n)
        </span>
      </div>

      {/* Multilingual Control Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '12px 14px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>translate</span>
            <span>Məzmun Redaktə Dili:</span>
          </span>
          {langs.map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => setCmsLang(l.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: cmsLang === l.code ? '1.5px solid #d4af37' : '1px solid #e2e8f0',
                background: cmsLang === l.code ? '#fffbeb' : '#f8fafc',
                color: cmsLang === l.code ? '#b45309' : '#475569',
                transition: 'all 0.15s'
              }}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '4px',
                background: cmsLang === l.code ? '#fef3c7' : '#e2e8f0',
                color: cmsLang === l.code ? '#92400e' : '#64748b'
              }}>
                {l.code.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCmsShowAllLangs(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            border: cmsShowAllLangs ? '1.5px solid #b45309' : '1px solid #cbd5e1',
            background: cmsShowAllLangs ? '#fef3c7' : '#ffffff',
            color: cmsShowAllLangs ? '#92400e' : '#475569'
          }}
          title="Bütün dilləri eyni zamanda göstər və ya tək dil rejiminə keç"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {cmsShowAllLangs ? 'splitscreen' : 'view_agenda'}
          </span>
          <span>{cmsShowAllLangs ? 'Bütün dillər açıqdır' : 'Bütün dilləri eyni vaxtda göstər'}</span>
        </button>
      </div>

      {/* Block Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {cmsBlocks.map(b => (
          <button
            key={b.id}
            type="button"
            onClick={() => setCmsBlock(b.id)}
            className={`admin-cms-pill ${cmsBlock === b.id ? 'active' : ''}`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* NAVBAR */}
      {cmsBlock === 'navbar' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Naviqasiya və Loqo Tənzimləmələri</h5>
          <ImageField
            label="Sayt Loqosu (Header Logo)"
            value={cmsNavbar.logoUrl}
            onChange={v => setCmsNavbar(p => ({ ...p, logoUrl: v }))}
          />
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Qeyd: Əgər fərdi loqo yükləməsəniz, Monodoxia-nın rəsmi SVG simvolu və mətni göstərilir.</p>
          <div>
            <button onClick={() => saveBlock('navbar', cmsNavbar)} className="admin-btn-primary">Yadda Saxla</button>
          </div>
        </div>
      )}

      {/* HERO */}
      {cmsBlock === 'hero' && (() => {
        const heroStyles = getHeroMediaStyles(cmsHero);
        const heroVideo = parseVideoUrl(cmsHero.videoUrl);
        const isVideoMode = cmsHero.mediaType === 'video';

        const framePresets = [
          { id: 'arch', label: 'Klassik Tağ (Arch)', icon: 'architecture', desc: 'Monodoxia imza tağvarisi (160px tağ)' },
          { id: 'rounded', label: 'Modern Yuvarlaq', icon: 'rounded_corner', desc: '24px zərif künclər' },
          { id: 'rectangle', label: 'Düzbucaqlı (Kəskin)', icon: 'crop_square', desc: '0px kəskin künclər' },
          { id: 'pill', label: 'Kapsul / Oval', icon: 'capsule', desc: 'Tam dairəvi kapsul (9999px)' },
          { id: 'circle', label: 'Tam Dairəvi', icon: 'circle', desc: '1:1 nisbətində tam dairə' },
          { id: 'none', label: 'Framesiz (Çərçivəsiz)', icon: 'layers_clear', desc: 'Altlıqsız təmiz media' }
        ];

        const strokeWidthOptions = [
          { val: 0, label: '0px (Yoxdur)' },
          { val: 1, label: '1px (İncə)' },
          { val: 2, label: '2px (Orta)' },
          { val: 3, label: '3px' },
          { val: 4, label: '4px (Qalın)' },
          { val: 6, label: '6px' },
          { val: 8, label: '8px (Ekstra)' }
        ];

        const strokeColorOptions = [
          { val: '#c5a059', label: 'Monodoxia Qızılı' },
          { val: 'rgba(197, 160, 89, 0.4)', label: 'Zərif Şəffaf Qızılı' },
          { val: '#e2e8f0', label: 'Neytral Boz' },
          { val: '#112240', label: 'Tünd Göy' },
          { val: '#ffffff', label: 'Ağ' },
          { val: 'transparent', label: 'Şəffaf' }
        ];

        const radiusOptions = [
          { id: 'arch', label: 'Tağvari (160px tağ)' },
          { id: 'none', label: '0px (Kəskin)' },
          { id: 'sm', label: '8px (Kiçik)' },
          { id: 'md', label: '16px (Orta)' },
          { id: 'lg', label: '24px (Böyük)' },
          { id: 'xl', label: '36px (Geniş)' },
          { id: 'full', label: '9999px (Kapsul)' },
          { id: 'custom', label: 'Xüsusi (Slider)' }
        ];

        const widthOptions = [
          { id: 'sm', label: 'Kompakt (384px)' },
          { id: 'md', label: 'Standart (448px)' },
          { id: 'lg', label: 'Geniş (512px)' },
          { id: 'xl', label: 'Böyük (576px)' },
          { id: 'full', label: '100% (Tam En)' },
          { id: 'custom', label: 'Xüsusi En (px)' }
        ];

        const aspectOptions = [
          { id: '4/5', label: '4:5 (Standart Portret)' },
          { id: '1/1', label: '1:1 (Kvadrat)' },
          { id: '16/9', label: '16:9 (Geniş Ekran / Video)' },
          { id: '3/4', label: '3:4 (Klassik Portret)' },
          { id: 'auto', label: 'Auto (Orijinal Nisbət)' }
        ];

        const handleHeroVideoUpload = (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 50 * 1024 * 1024) {
            showToast('Video fayl ölçüsü 50MB-dan çox ola bilməz', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            setCmsHero(p => ({ ...p, videoUrl: event.target.result, mediaType: 'video' }));
            showToast('Video faylı uğurla yükləndi!', 'success');
          };
          reader.readAsDataURL(file);
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* YUXARI TEZ YADDA SAXLA VƏ MƏLUMAT ZOLAĞI */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #070f1e 0%, #0d1e38 100%)',
              borderRadius: '10px',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(7, 15, 30, 0.15)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '20px' }}>tune</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.3px' }}>Hero Başlıq, Mətn və Düymə Tənzimləmələri</span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#cbd5e1' }}>
                  Ana səhifənin sol Hero blokundakı bütün elementləri (etiket, başlıqlar, fırlanma, təsvir, CTA düymələri) tam fərdiləşdirin
                </p>
              </div>
              <button
                type="button"
                onClick={() => saveBlock('hero', cmsHero)}
                className="admin-btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #c5a059 0%, #e2c275 100%)',
                  color: '#070f1e',
                  fontWeight: 800,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(197, 160, 89, 0.35)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>save</span>
                <span>Dəyişiklikləri Yadda Saxla</span>
              </button>
            </div>

            {/* SOL HERO BLOKU CANLI ÖNİZLƏMƏSİ (REAL-TIME PREVIEW) */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', border: '1.5px solid #e2d9c8', background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingBottom: '8px', borderBottom: '1px solid #f1ece1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '18px' }}>visibility</span>
                  <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Canlı Önizləmə (Sol Hero Bloku)</h5>
                </div>
                <span style={{ fontSize: '11px', color: '#775a19', fontWeight: 600, background: '#fdfbf7', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2d9c8' }}>
                  Dili dəyişdikdə və ya mətn yazdıqda anında yenilənir
                </span>
              </div>

              {/* MİNİ HERO ÖNİZLƏMƏ KARTİ */}
              <div style={{
                background: '#fbf9f5',
                border: '1px solid #e2d9c8',
                borderRadius: '10px',
                padding: '24px 20px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {/* AMBIENT GLOW */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '-30px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />

                {/* 1. PREVIEW BADGE */}
                {cmsHero.showBadge !== false && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 12px',
                      borderRadius: '999px',
                      border: cmsHero.badgeStyle === 'dark' ? '1px solid rgba(197, 160, 89, 0.6)' : cmsHero.badgeStyle === 'gold' ? '1px solid #c5a059' : cmsHero.badgeStyle === 'minimal' ? '1px solid #e2d9c8' : '1px solid rgba(197, 160, 89, 0.4)',
                      background: cmsHero.badgeStyle === 'dark' ? '#070f1e' : cmsHero.badgeStyle === 'gold' ? 'rgba(197, 160, 89, 0.15)' : cmsHero.badgeStyle === 'minimal' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                      color: cmsHero.badgeStyle === 'dark' ? '#f5e6c8' : '#775a19',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}>
                      {cmsHero.showBadgeBeacon !== false && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c5a059', display: 'inline-block' }} />
                      )}
                      <span>
                        {cmsHero.translations?.[cmsLang]?.badge || cmsHero.badge || 'FƏRDİ İNKİŞAF VƏ PSİXOLOGİYA MƏRKƏZİ'}
                      </span>
                      {cmsHero.showBadgeIcon !== false && (
                        <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#c5a059' }}>
                          {cmsHero.badgeIcon || 'sparkles'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. PREVIEW HEADLINE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{
                    fontSize: cmsHero.headlineSize === 'compact' ? '24px' : cmsHero.headlineSize === 'large' ? '32px' : '28px',
                    fontFamily: 'serif',
                    fontWeight: 600,
                    color: '#070f1e',
                    lineHeight: 1.2
                  }}>
                    {cmsHero.translations?.[cmsLang]?.title1 || cmsHero.title1 || 'Özünü tanı.'}
                  </div>
                  <div style={{
                    fontSize: cmsHero.headlineSize === 'compact' ? '24px' : cmsHero.headlineSize === 'large' ? '32px' : '28px',
                    fontFamily: 'serif',
                    fontStyle: cmsHero.title2Italic !== false ? 'italic' : 'normal',
                    fontWeight: cmsHero.title2Italic !== false ? 400 : 600,
                    color: cmsHero.title2Shimmer !== false ? '#c5a059' : (cmsHero.title2Color || '#775a19'),
                    lineHeight: 1.2
                  }}>
                    {cmsHero.translations?.[cmsLang]?.title2 || cmsHero.title2 || 'Özünü inkişaf etdir.'}
                  </div>
                  <div style={{
                    fontSize: cmsHero.headlineSize === 'compact' ? '24px' : cmsHero.headlineSize === 'large' ? '32px' : '28px',
                    fontFamily: 'serif',
                    fontWeight: 600,
                    color: '#070f1e',
                    lineHeight: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>
                      {cmsHero.enableRotatingTitles === true || Boolean(cmsHero.rotatingTitles)
                        ? (String(cmsHero.translations?.[cmsLang]?.rotatingTitles || cmsHero.rotatingTitles || '').split(/\r?\n|,/)[0]?.trim() || cmsHero.translations?.[cmsLang]?.title3 || cmsHero.title3 || 'Şüurlu gələcək qur.')
                        : (cmsHero.translations?.[cmsLang]?.title3 || cmsHero.title3 || 'Şüurlu gələcək qur.')}
                    </span>
                    {(cmsHero.enableRotatingTitles === true || Boolean(cmsHero.rotatingTitles)) && cmsHero.showRotatingSyncIcon !== false && (
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059', background: 'rgba(197, 160, 89, 0.15)', borderRadius: '50%', padding: '3px' }}>
                        sync
                      </span>
                    )}
                  </div>

                  {/* PREVIEW ROTATING INDICATOR */}
                  {(cmsHero.enableRotatingTitles === true || Boolean(cmsHero.rotatingTitles)) && cmsHero.showRotatingIndicator !== false && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '6px' }}>
                      <div style={{ width: '28px', height: '2px', background: 'linear-gradient(to right, #c5a059, transparent)', borderRadius: '2px' }} />
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ width: '18px', height: '5px', borderRadius: '3px', background: '#c5a059' }} />
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#e2d9c8' }} />
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#e2d9c8' }} />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#775a19' }}>
                        {cmsHero.translations?.[cmsLang]?.rotatingBadgeText || cmsHero.rotatingBadgeText || 'DAİMİ İNKİŞAF'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. PREVIEW DESCRIPTION */}
                {cmsHero.showDesc !== false && (
                  <p style={{
                    margin: 0,
                    fontSize: cmsHero.descSize === 'sm' ? '13px' : cmsHero.descSize === 'lg' ? '16px' : '14px',
                    color: '#475569',
                    lineHeight: 1.6,
                    maxWidth: cmsHero.descWidth === '2xl' ? '680px' : cmsHero.descWidth === 'full' ? '100%' : '540px'
                  }}>
                    {cmsHero.translations?.[cmsLang]?.desc || cmsHero.desc || 'Monodoxia Academy — akademik psixoloji tədqiqatları, qədim daxili müdrikliyi və müasir fərdi kouçinq metodologiyasını bir araya gətirən elit inkişaf ekosistemidir.'}
                  </p>
                )}

                {/* 4. PREVIEW CTA BUTTONS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
                  {cmsHero.showBtnPrimary !== false && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: cmsHero.btnPrimaryStyle === 'gold'
                        ? 'linear-gradient(135deg, #c5a059 0%, #d4af37 100%)'
                        : cmsHero.btnPrimaryStyle === 'outline'
                        ? 'transparent'
                        : '#070f1e',
                      color: cmsHero.btnPrimaryStyle === 'gold' ? '#070f1e' : cmsHero.btnPrimaryStyle === 'outline' ? '#070f1e' : '#ffffff',
                      border: cmsHero.btnPrimaryStyle === 'outline' ? '2px solid #070f1e' : '1px solid rgba(197, 160, 89, 0.4)',
                      boxShadow: '0 4px 10px rgba(7, 15, 30, 0.12)'
                    }}>
                      <span>{cmsHero.translations?.[cmsLang]?.btnPrimaryText || cmsHero.btnPrimaryText || 'Akademiyanı kəşf et'}</span>
                      {cmsHero.btnPrimaryShowIcon !== false && (
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: cmsHero.btnPrimaryStyle === 'gold' ? '#070f1e' : '#c5a059' }}>
                          {cmsHero.btnPrimaryIcon || 'north_east'}
                        </span>
                      )}
                    </div>
                  )}

                  {cmsHero.showBtnSecondary !== false && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      background: cmsHero.btnSecondaryStyle === 'light' ? '#f4efe6' : cmsHero.btnSecondaryStyle === 'outline' ? 'transparent' : 'rgba(255, 255, 255, 0.85)',
                      color: '#070f1e',
                      border: cmsHero.btnSecondaryStyle === 'outline' ? '2px solid #c5a059' : '1px solid rgba(197, 160, 89, 0.6)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}>
                      <span>{cmsHero.translations?.[cmsLang]?.btnSecondaryText || cmsHero.btnSecondaryText || 'Coaching Club ilə tanış ol'}</span>
                      {cmsHero.btnSecondaryShowIcon !== false && (
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#775a19' }}>
                          {cmsHero.btnSecondaryIcon || 'arrow_forward'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 1. ÜST ETİKET (TOP BADGE) XÜSUSİYYƏTLƏRİ */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '20px' }}>verified</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>1. Üst Etiket (Top Badge) Xüsusiyyətləri</h5>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cmsHero.showBadge !== false}
                    onChange={e => setCmsHero(p => ({ ...p, showBadge: e.target.checked }))}
                  />
                  <span>Etiketi Saytda Göstər</span>
                </label>
              </div>

              {cmsHero.showBadge !== false && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Field label="Üst Etiket Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="badge" placeholder="FƏRDİ İNKİŞAF VƏ PSİXOLOGİYA MƏRKƏZİ" />

                  {/* BADGE ICON & TOGGLES */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: '#fafaf9', padding: '12px', borderRadius: '8px', border: '1px solid #e7e5e4' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label className="admin-label" style={{ margin: 0 }}>Etiket İkonu (Material Symbol)</label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          className="admin-input"
                          value={cmsHero.badgeIcon || 'sparkles'}
                          onChange={e => setCmsHero(p => ({ ...p, badgeIcon: e.target.value }))}
                          placeholder="sparkles, verified, psychology..."
                          style={{ flex: 1 }}
                        />
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#c5a059' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                            {cmsHero.badgeIcon || 'sparkles'}
                          </span>
                        </span>
                      </div>
                      {/* SÜRƏTLİ İKON SEÇİMLƏRİ */}
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {['sparkles', 'verified', 'psychology', 'star', 'workspace_premium', 'school'].map(ic => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() => setCmsHero(p => ({ ...p, badgeIcon: ic }))}
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              border: (cmsHero.badgeIcon || 'sparkles') === ic ? '1px solid #c5a059' : '1px solid #e2e8f0',
                              background: (cmsHero.badgeIcon || 'sparkles') === ic ? '#fffbeb' : '#ffffff',
                              color: '#475569',
                              cursor: 'pointer'
                            }}
                          >
                            {ic}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* BADGE STİLİ VƏ AÇARLAR */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label className="admin-label" style={{ margin: 0 }}>Etiket Dizayn Stili</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                        {[
                          { id: 'glass', label: 'Ağ Şüşə (Defolt)' },
                          { id: 'gold', label: 'Zərif Qızılı' },
                          { id: 'dark', label: 'Tünd Elit' },
                          { id: 'minimal', label: 'Minimalist' }
                        ].map(st => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setCmsHero(p => ({ ...p, badgeStyle: st.id }))}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: (cmsHero.badgeStyle || 'glass') === st.id ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                              background: (cmsHero.badgeStyle || 'glass') === st.id ? '#fffbeb' : '#ffffff',
                              color: (cmsHero.badgeStyle || 'glass') === st.id ? '#92400e' : '#475569'
                            }}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={cmsHero.showBadgeBeacon !== false}
                            onChange={e => setCmsHero(p => ({ ...p, showBadgeBeacon: e.target.checked }))}
                          />
                          <span>Pulsasiya edən nöqtə</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={cmsHero.showBadgeIcon !== false}
                            onChange={e => setCmsHero(p => ({ ...p, showBadgeIcon: e.target.checked }))}
                          />
                          <span>İkonu göstər</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. BAŞLIQLAR (HEADLINE) VƏ TİPOGRAFİYA XÜSUSİYYƏTLƏRİ */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '20px' }}>format_size</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>2. Əsas Başlıqlar (3 Sətir) və Tipografiya</h5>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Şrift Ölçüsü:</span>
                  {[
                    { id: 'compact', label: 'Yığcam' },
                    { id: 'normal', label: 'Standart (Defolt)' },
                    { id: 'large', label: 'Böyük' }
                  ].map(sz => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setCmsHero(p => ({ ...p, headlineSize: sz.id }))}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: (cmsHero.headlineSize || 'normal') === sz.id ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                        background: (cmsHero.headlineSize || 'normal') === sz.id ? '#fffbeb' : '#ffffff',
                        color: (cmsHero.headlineSize || 'normal') === sz.id ? '#92400e' : '#475569'
                      }}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SƏTİR 1 */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>1-ci Başlıq Sətri</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cmsHero.title1Animation !== false}
                      onChange={e => setCmsHero(p => ({ ...p, title1Animation: e.target.checked }))}
                    />
                    <span>Sözbəsöz Kinetik Açılma Animasiyası</span>
                  </label>
                </div>
                <Field label="Başlıq Sətir 1 Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="title1" placeholder="Özünü tanı." />
              </div>

              {/* SƏTİR 2 (İTALİK VƏ QIZILI ŞİMMER) */}
              <div style={{ background: '#fffdfa', padding: '12px', borderRadius: '8px', border: '1px solid #f1ece1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#775a19' }}>2-ci Başlıq Sətri (Vurğu Sətri)</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#775a19', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.title2Shimmer !== false}
                        onChange={e => setCmsHero(p => ({ ...p, title2Shimmer: e.target.checked }))}
                      />
                      <span>✨ Qızılı Maye Şimmer Effekti</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.title2Italic !== false}
                        onChange={e => setCmsHero(p => ({ ...p, title2Italic: e.target.checked }))}
                      />
                      <span><i>Italic (Kursiv)</i></span>
                    </label>
                  </div>
                </div>
                <Field label="Başlıq Sətir 2 Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="title2" placeholder="Özünü inkişaf etdir." />
              </div>

              {/* SƏTİR 3 (SABİT MƏTN) */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>3-cü Başlıq Sətri (Sabit və ya Əsas Hədəf)</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    {cmsHero.enableRotatingTitles === true || Boolean(cmsHero.rotatingTitles) ? 'Dinamik fırlanan siyahı ilə bərabər işləyir' : 'Sabit 3-cü sətir kimi göstərilir'}
                  </span>
                </div>
                <Field label="Başlıq Sətir 3 Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="title3" placeholder="Şüurlu gələcək qur." />
              </div>
            </div>

            {/* 3. DİNAMİK / FIRLANAN BAŞLIQ VƏ İNDİKATOR ZOLAĞI AYARLARI */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '20px' }}>sync</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>3. Kinetik Fırlanan Başlıq və İndikator Zolağı</h5>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cmsHero.enableRotatingTitles === true || Boolean(cmsHero.rotatingTitles)}
                    onChange={e => setCmsHero(p => ({ ...p, enableRotatingTitles: e.target.checked }))}
                  />
                  <span>Fırlanan Başlıqları Aktiv Et</span>
                </label>
              </div>

              {(cmsHero.enableRotatingTitles === true || Boolean(cmsHero.rotatingTitles)) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    <Field
                      label="Fərdi Fırlanan Başlıqlar (Hər sətirdə 1 ifadə daxil edin)"
                      block={cmsHero}
                      setBlock={setCmsHero}
                      fieldKey="rotatingTitles"
                      multiline
                      rows={4}
                      placeholder="Potensialını kəşf et.&#10;Daxili gücünü tap.&#10;Şüurlu gələcək qur.&#10;Öz zirvənə çat."
                      helpText="Hər 3-4 saniyədən bir başlıqda növbə ilə bu ifadələr kinetik animasiya ilə dəyişəcək."
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Field
                        label="İndikator Alt Mətni"
                        block={cmsHero}
                        setBlock={setCmsHero}
                        fieldKey="rotatingBadgeText"
                        placeholder="DAİMİ İNKİŞAF"
                        helpText="Nöqtələrin sağındakı qızılı etiket mətni"
                      />

                      {/* FIRLANMA İNTERVALI / SÜRƏTİ */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label className="admin-label" style={{ margin: 0 }}>Dəyişmə İntervalı (Sürət)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                          {[
                            { val: 2500, label: '2.5 san' },
                            { val: 3800, label: '3.8 san' },
                            { val: 5000, label: '5.0 san' },
                            { val: 7000, label: '7.0 san' }
                          ].map(it => (
                            <button
                              key={it.val}
                              type="button"
                              onClick={() => setCmsHero(p => ({ ...p, rotationInterval: it.val }))}
                              style={{
                                padding: '5px 4px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: (Number(cmsHero.rotationInterval) || 3800) === it.val ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                                background: (Number(cmsHero.rotationInterval) || 3800) === it.val ? '#fffbeb' : '#ffffff',
                                color: (Number(cmsHero.rotationInterval) || 3800) === it.val ? '#92400e' : '#475569'
                              }}
                            >
                              {it.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* İNDİKATOR GÖRÜNÜŞ TOGGLES */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={cmsHero.showRotatingIndicator !== false}
                            onChange={e => setCmsHero(p => ({ ...p, showRotatingIndicator: e.target.checked }))}
                          />
                          <span>İndikator Zolağını və Nöqtələrini Göstər</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={cmsHero.showRotatingSyncIcon !== false}
                            onChange={e => setCmsHero(p => ({ ...p, showRotatingSyncIcon: e.target.checked }))}
                          />
                          <span>Başlıq yanındakı 'Dəyişdir' (Sync) Düyməsini Göstər</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Fırlanan başlıqlar rejimi deaktivdir. Başlıq 3-cü sətri sabit göstəriləcək.
                </p>
              )}
            </div>

            {/* 4. TƏSVİR (DESCRIPTION) XÜSUSİYYƏTLƏRİ */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '20px' }}>notes</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>4. Hero Əsas Təsvir (Açıqlama Mətni)</h5>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cmsHero.showDesc !== false}
                    onChange={e => setCmsHero(p => ({ ...p, showDesc: e.target.checked }))}
                  />
                  <span>Təsviri Göstər</span>
                </label>
              </div>

              {cmsHero.showDesc !== false && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Field label="Hero Təsviri (Desc)" block={cmsHero} setBlock={setCmsHero} fieldKey="desc" multiline rows={3} placeholder="Monodoxia Academy — akademik psixoloji tədqiqatları..." />

                  {/* ÖLÇÜ VƏ GENİŞLİK NİZAMLAMASI */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Mətn Ölçüsü:</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                        {[
                          { id: 'sm', label: '15px (Kiçik)' },
                          { id: 'normal', label: '17px (Standart)' },
                          { id: 'lg', label: '19px (Geniş)' }
                        ].map(sz => (
                          <button
                            key={sz.id}
                            type="button"
                            onClick={() => setCmsHero(p => ({ ...p, descSize: sz.id }))}
                            style={{
                              padding: '5px 4px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: (cmsHero.descSize || 'normal') === sz.id ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                              background: (cmsHero.descSize || 'normal') === sz.id ? '#fffbeb' : '#ffffff',
                              color: (cmsHero.descSize || 'normal') === sz.id ? '#92400e' : '#475569'
                            }}
                          >
                            {sz.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Maksimum Sətir Genişliyi:</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                        {[
                          { id: 'xl', label: 'max-w-xl (Standart)' },
                          { id: '2xl', label: 'max-w-2xl (Geniş)' },
                          { id: 'full', label: '100% (Tam En)' }
                        ].map(wd => (
                          <button
                            key={wd.id}
                            type="button"
                            onClick={() => setCmsHero(p => ({ ...p, descWidth: wd.id }))}
                            style={{
                              padding: '5px 4px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: (cmsHero.descWidth || 'xl') === wd.id ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                              background: (cmsHero.descWidth || 'xl') === wd.id ? '#fffbeb' : '#ffffff',
                              color: (cmsHero.descWidth || 'xl') === wd.id ? '#92400e' : '#475569'
                            }}
                          >
                            {wd.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. FƏALİYYƏT DÜYMƏLƏRİ (CTA BUTTONS) XÜSUSİYYƏTLƏRİ */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '20px' }}>smart_button</span>
                  <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>5. Çağırış Düymələri (CTA Buttons) Xüsusiyyətləri</h5>
                </div>
                <span className="admin-count-badge">2 Fəaliyyət Düyməsi</span>
              </div>

              {/* ƏSAS DÜYMƏ (1-Cİ DÜYMƏ) */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#070f1e', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#070f1e', display: 'inline-block' }} />
                    Əsas Düymə (1-ci CTA Düyməsi)
                  </span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cmsHero.showBtnPrimary !== false}
                      onChange={e => setCmsHero(p => ({ ...p, showBtnPrimary: e.target.checked }))}
                    />
                    <span>1-ci Düyməni Göstər</span>
                  </label>
                </div>

                {cmsHero.showBtnPrimary !== false && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <Field label="1-ci Düymə Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="btnPrimaryText" placeholder="Akademiyanı kəşf et" />
                      <Field label="Keçid Linki (Səhifə ID və ya URL)" block={cmsHero} setBlock={setCmsHero} fieldKey="btnPrimaryLink" placeholder="/akademiya və ya akademiya" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', paddingTop: '4px' }}>
                      {/* DÜYMƏ STİLİ */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Dizayn Stili:</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                          {[
                            { id: 'dark', label: 'Tünd Göy' },
                            { id: 'gold', label: 'Qızılı Qradiyent' },
                            { id: 'outline', label: 'Haşiyəli' }
                          ].map(bst => (
                            <button
                              key={bst.id}
                              type="button"
                              onClick={() => setCmsHero(p => ({ ...p, btnPrimaryStyle: bst.id }))}
                              style={{
                                padding: '5px 4px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: (cmsHero.btnPrimaryStyle || 'dark') === bst.id ? '1.5px solid #070f1e' : '1px solid #cbd5e1',
                                background: (cmsHero.btnPrimaryStyle || 'dark') === bst.id ? '#070f1e' : '#ffffff',
                                color: (cmsHero.btnPrimaryStyle || 'dark') === bst.id ? '#ffffff' : '#334155'
                              }}
                            >
                              {bst.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* İKON VƏ SEÇİM */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>İkon:</span>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={cmsHero.btnPrimaryShowIcon !== false}
                              onChange={e => setCmsHero(p => ({ ...p, btnPrimaryShowIcon: e.target.checked }))}
                            />
                            <span>İkonu Göstər</span>
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {['north_east', 'arrow_forward', 'rocket_launch', 'school', 'explore', 'star'].map(ic => (
                            <button
                              key={ic}
                              type="button"
                              onClick={() => setCmsHero(p => ({ ...p, btnPrimaryIcon: ic }))}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                border: (cmsHero.btnPrimaryIcon || 'north_east') === ic ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                                background: (cmsHero.btnPrimaryIcon || 'north_east') === ic ? '#fffbeb' : '#ffffff',
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#c5a059' }}>{ic}</span>
                              <span>{ic}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* YENİ TAB CHECKBOX */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#475569', cursor: 'pointer', paddingTop: '2px' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.btnPrimaryNewTab === true}
                        onChange={e => setCmsHero(p => ({ ...p, btnPrimaryNewTab: e.target.checked }))}
                      />
                      <span>Linki yeni tabda (target="_blank") aç</span>
                    </label>
                  </div>
                )}
              </div>

              {/* İKİNCİ DÜYMƏ (2-Cİ DÜYMƏ) */}
              <div style={{ background: '#fffdfa', padding: '14px', borderRadius: '8px', border: '1px solid #f1ece1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#775a19', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c5a059', display: 'inline-block' }} />
                    İkinci Düymə (2-ci CTA Düyməsi)
                  </span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cmsHero.showBtnSecondary !== false}
                      onChange={e => setCmsHero(p => ({ ...p, showBtnSecondary: e.target.checked }))}
                    />
                    <span>2-ci Düyməni Göstər</span>
                  </label>
                </div>

                {cmsHero.showBtnSecondary !== false && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <Field label="2-ci Düymə Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="btnSecondaryText" placeholder="Coaching Club ilə tanış ol" />
                      <Field label="Keçid Linki (Səhifə ID və ya URL)" block={cmsHero} setBlock={setCmsHero} fieldKey="btnSecondaryLink" placeholder="/club və ya club" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', paddingTop: '4px' }}>
                      {/* DÜYMƏ STİLİ */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Dizayn Stili:</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                          {[
                            { id: 'glass', label: 'Ağ Şüşə' },
                            { id: 'outline', label: 'Qızılı Haşiyə' },
                            { id: 'light', label: 'Krem Fon' }
                          ].map(bst => (
                            <button
                              key={bst.id}
                              type="button"
                              onClick={() => setCmsHero(p => ({ ...p, btnSecondaryStyle: bst.id }))}
                              style={{
                                padding: '5px 4px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: (cmsHero.btnSecondaryStyle || 'glass') === bst.id ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                                background: (cmsHero.btnSecondaryStyle || 'glass') === bst.id ? '#fffbeb' : '#ffffff',
                                color: (cmsHero.btnSecondaryStyle || 'glass') === bst.id ? '#92400e' : '#334155'
                              }}
                            >
                              {bst.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* İKON VƏ SEÇİM */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>İkon:</span>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#64748b', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={cmsHero.btnSecondaryShowIcon !== false}
                              onChange={e => setCmsHero(p => ({ ...p, btnSecondaryShowIcon: e.target.checked }))}
                            />
                            <span>İkonu Göstər</span>
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {['arrow_forward', 'groups', 'chat', 'info', 'workspace_premium', 'help'].map(ic => (
                            <button
                              key={ic}
                              type="button"
                              onClick={() => setCmsHero(p => ({ ...p, btnSecondaryIcon: ic }))}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                border: (cmsHero.btnSecondaryIcon || 'arrow_forward') === ic ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                                background: (cmsHero.btnSecondaryIcon || 'arrow_forward') === ic ? '#fffbeb' : '#ffffff',
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#c5a059' }}>{ic}</span>
                              <span>{ic}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* YENİ TAB CHECKBOX */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: '#475569', cursor: 'pointer', paddingTop: '2px' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.btnSecondaryNewTab === true}
                        onChange={e => setCmsHero(p => ({ ...p, btnSecondaryNewTab: e.target.checked }))}
                      />
                      <span>Linki yeni tabda (target="_blank") aç</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* HERO STATİSTİKA ZOLAĞI (STATS STRIP) */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#c5a059', fontSize: '18px' }}>analytics</span>
                    Hero Statistika Zolağı (3 Əsas Göstərici)
                  </h5>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                    Hero bölməsinin aşağısında yerləşən rəqəmsal nailiyyət və etibar göstəriciləri
                  </p>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={cmsHero.showStats !== false}
                    onChange={e => setCmsHero(p => ({ ...p, showStats: e.target.checked }))}
                  />
                  <span>Statistikanı Göstər</span>
                </label>
              </div>

              {cmsHero.showStats !== false && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  {/* STAT 1 */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>1-ci Göstərici</span>
                    <Field label="Rəqəm / Mətn" block={cmsHero} setBlock={setCmsHero} fieldKey="stat1Num" placeholder="12,000+" />
                    <Field label="İzah Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="stat1Label" placeholder="Fərdi Tələbə" />
                  </div>

                  {/* STAT 2 */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#775a19' }}>2-ci Göstərici (Qızılı)</span>
                    <Field label="Rəqəm / Faiz" block={cmsHero} setBlock={setCmsHero} fieldKey="stat2Num" placeholder="98%" />
                    <Field label="İzah Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="stat2Label" placeholder="Məmnuniyyət" />
                  </div>

                  {/* STAT 3 */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>3-cü Göstərici</span>
                    <Field label="Rəqəm / Sertifikat" block={cmsHero} setBlock={setCmsHero} fieldKey="stat3Num" placeholder="ICF & PhD" />
                    <Field label="İzah Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="stat3Label" placeholder="Sertifikatlı Kouçlar" />
                  </div>
                </div>
              )}
            </div>

            {/* HERO SAĞ MEDIA (ŞƏKİL / VİDEO, FRAME, STROKE, RADIUS, ÖLÇÜ) */}
            <div className="admin-card-elevated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1.5px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#c5a059' }}>photo_library</span>
                    Hero Sağ Əsas Media (Şəkil / Video) İdarəetməsi
                  </h5>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
                    Sağ tərəfdəki vizual blokun media formatı, çərçivə stili, stroke ölçüsü, radiusu və ölçülərini tənzimləyin
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: isVideoMode ? '#eff6ff' : '#fef3c7', color: isVideoMode ? '#1d4ed8' : '#92400e', border: isVideoMode ? '1px solid #bfdbfe' : '1px solid #fde68a' }}>
                    {isVideoMode ? '🎥 Video Rejimi' : '🖼️ Şəkil Rejimi'}
                  </span>
                  {heroStyles.isFrameless && (
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                      ✨ Framesiz
                    </span>
                  )}
                </div>
              </div>

              {/* 1. MEDIA NÖVÜ SEÇİMİ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>perm_media</span>
                  Media Növü (Şəkil və ya Video)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setCmsHero(p => ({ ...p, mediaType: 'image' }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: !isVideoMode ? '2px solid #c5a059' : '1px solid #cbd5e1',
                      background: !isVideoMode ? '#fffdf7' : '#ffffff',
                      color: !isVideoMode ? '#92400e' : '#475569',
                      boxShadow: !isVideoMode ? '0 2px 6px rgba(197,160,89,0.18)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>image</span>
                    <span>Şəkil (Image)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCmsHero(p => ({ ...p, mediaType: 'video' }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isVideoMode ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isVideoMode ? '#eff6ff' : '#ffffff',
                      color: isVideoMode ? '#1e40af' : '#475569',
                      boxShadow: isVideoMode ? '0 2px 6px rgba(37,99,235,0.18)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>videocam</span>
                    <span>Video (YouTube / MP4 / Vimeo)</span>
                  </button>
                </div>
              </div>

              {/* MEDIA MƏNBƏYİ: ŞƏKİL VƏ YA VİDEO */}
              {!isVideoMode ? (
                /* ŞƏKİL SAHƏSİ */
                <div style={{ background: '#fdfbf7', padding: '14px', borderRadius: '8px', border: '1px solid #f1ece1' }}>
                  <ImageField
                    label="Hero Sağ Əsas Şəkil URL və ya Fayl"
                    value={cmsHero.image}
                    onChange={v => setCmsHero(p => ({ ...p, image: v }))}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setCmsHero(p => ({ ...p, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6A42fLsKyb7QEyw763LYrM2DhMvrcMod35fdqpYFnlKrGTcsg11v2ljzwkebadfB8h3tfo-a23eJ2C1IgUxOWL0A7cON3aCvZ3irV6bqO5eStKS9edI_Qda-YAOeRR0EMqS_cCqNkoDRtBJgrns8bUxgLQjRFG1ZVUGF2Ob9e9CG4dgb2myU2AJgY2j8uSiSRSDuMt6yq1zuCRYVZhvt2-Eiq7WHllVLEpzNMbm6AuMR7CS-ijR7" }))}
                      className="admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      Klassik Monodoxia Şəkli (Defolt)
                    </button>
                  </div>
                </div>
              ) : (
                /* VİDEO SAHƏSİ */
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="admin-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Video URL və ya Video Fayl Yüklə</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>YouTube, Vimeo və ya birbaşa .mp4/.webm</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=... və ya video.mp4"
                        value={cmsHero.videoUrl || ''}
                        onChange={e => setCmsHero(p => ({ ...p, videoUrl: e.target.value, mediaType: 'video' }))}
                        className="admin-input"
                        style={{ flex: 1 }}
                      />
                      <label className="admin-btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#2563eb' }}>video_file</span>
                        <span>Fayl Yüklə</span>
                        <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" style={{ display: 'none' }} onChange={handleHeroVideoUpload} />
                      </label>
                      {cmsHero.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setCmsHero(p => ({ ...p, videoUrl: '' }))}
                          className="admin-btn-danger"
                          style={{ padding: '6px 10px', fontSize: '11px' }}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TEZ NÜMUNƏ DÜYMƏLƏRİ */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Sürətli sınaq üçün:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCmsHero(p => ({ ...p, videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM', mediaType: 'video' }));
                        showToast('YouTube video linki seçildi', 'info');
                      }}
                      className="admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      ▶️ YouTube Dərs Videosu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCmsHero(p => ({ ...p, videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4', mediaType: 'video' }));
                        showToast('Sakitləşdirici MP4 video seçildi', 'info');
                      }}
                      className="admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      🌊 Sakitləşdirici Dalğalar (MP4)
                    </button>
                  </div>

                  {/* VİDEO POSTER ŞƏKLİ */}
                  <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                    <ImageField
                      label="Video Örtük Şəkli (Poster / Thumbnail - opsional)"
                      value={cmsHero.videoPoster || ''}
                      onChange={v => setCmsHero(p => ({ ...p, videoPoster: v }))}
                    />
                  </div>

                  {/* VİDEO PARAMETRLƏRİ */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', paddingTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.videoAutoplay !== false}
                        onChange={e => setCmsHero(p => ({ ...p, videoAutoplay: e.target.checked }))}
                      />
                      <span>Avtomatik Oxut (Autoplay)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.videoMuted !== false}
                        onChange={e => setCmsHero(p => ({ ...p, videoMuted: e.target.checked }))}
                      />
                      <span>Səssiz (Muted)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.videoLoop !== false}
                        onChange={e => setCmsHero(p => ({ ...p, videoLoop: e.target.checked }))}
                      />
                      <span>Təkrarla (Loop)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsHero.videoControls === true}
                        onChange={e => setCmsHero(p => ({ ...p, videoControls: e.target.checked }))}
                      />
                      <span>Pleyer Düymələri (Controls)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 2. FRAME STİLİ VƏ FRAMESİZ REJİMİ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>filter_frames</span>
                    Frame Stili (Çərçivə Forması)
                  </label>
                  {/* FRAMESİZ TOGGLE SWITCH */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: heroStyles.isFrameless ? '#fef3c7' : '#f1f5f9',
                    border: heroStyles.isFrameless ? '1.5px solid #d4af37' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: heroStyles.isFrameless ? '#92400e' : '#475569'
                  }}>
                    <input
                      type="checkbox"
                      checked={heroStyles.isFrameless}
                      onChange={e => {
                        const val = e.target.checked;
                        setCmsHero(p => ({
                          ...p,
                          isFrameless: val,
                          frameStyle: val ? 'none' : (p.frameStyle === 'none' ? 'arch' : (p.frameStyle || 'arch'))
                        }));
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Framesiz Rejim (Çərçivə lövhəsiz)</span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  {framePresets.map(fp => {
                    const isSelected = (!heroStyles.isFrameless && (cmsHero.frameStyle || 'arch') === fp.id) || (heroStyles.isFrameless && fp.id === 'none');
                    return (
                      <button
                        key={fp.id}
                        type="button"
                        onClick={() => {
                          if (fp.id === 'none') {
                            setCmsHero(p => ({ ...p, isFrameless: true, frameStyle: 'none' }));
                          } else {
                            setCmsHero(p => ({
                              ...p,
                              isFrameless: false,
                              frameStyle: fp.id,
                              borderRadius: fp.id === 'arch' ? 'arch' : (fp.id === 'rectangle' ? 'none' : (fp.id === 'pill' ? 'full' : (fp.id === 'circle' ? 'full' : (p.borderRadius || 'arch'))))
                            }));
                          }
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #c5a059' : '1px solid #e2e8f0',
                          background: isSelected ? '#fffdf7' : '#ffffff',
                          color: isSelected ? '#0f172a' : '#475569',
                          boxShadow: isSelected ? '0 2px 6px rgba(197,160,89,0.15)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12px', color: isSelected ? '#92400e' : '#1e293b' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: isSelected ? '#c5a059' : '#64748b' }}>{fp.icon}</span>
                          <span>{fp.label}</span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>{fp.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. STROKE ÖLÇÜSÜ (QALINLIĞI) VƏ RƏNGİ */}
              <div style={{ background: '#fafaf9', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e7e5e4', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>border_style</span>
                    Stroke Ölçüsü (Qalınlığı): <strong>{cmsHero.strokeWidth !== undefined ? cmsHero.strokeWidth : 1}px</strong>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {strokeWidthOptions.map(sw => (
                      <button
                        key={sw.val}
                        type="button"
                        onClick={() => setCmsHero(p => ({ ...p, strokeWidth: sw.val }))}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: (cmsHero.strokeWidth !== undefined ? cmsHero.strokeWidth : 1) === sw.val ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                          background: (cmsHero.strokeWidth !== undefined ? cmsHero.strokeWidth : 1) === sw.val ? '#fffbeb' : '#ffffff',
                          color: (cmsHero.strokeWidth !== undefined ? cmsHero.strokeWidth : 1) === sw.val ? '#92400e' : '#475569'
                        }}
                      >
                        {sw.val}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* STROKE RƏNGİ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Stroke Rəngi:</span>
                  {strokeColorOptions.map(sc => (
                    <button
                      key={sc.val}
                      type="button"
                      onClick={() => setCmsHero(p => ({ ...p, strokeColor: sc.val }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: (cmsHero.strokeColor || 'rgba(197, 160, 89, 0.4)') === sc.val ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: sc.val === 'transparent' ? '#ffffff' : sc.val, border: '1px solid #94a3b8', display: 'inline-block' }} />
                      <span>{sc.label}</span>
                    </button>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Özəl Rəng:</span>
                    <input
                      type="color"
                      value={cmsHero.strokeColor?.startsWith('#') ? cmsHero.strokeColor : '#c5a059'}
                      onChange={e => setCmsHero(p => ({ ...p, strokeColor: e.target.value }))}
                      style={{ width: '28px', height: '28px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* 4. BORDER RADIUS VƏ ÖLÇÜLƏR (EN & NİSBƏT) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {/* BORDER RADIUS */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>rounded_corner</span>
                      Border Radius (Künc Yuvarlaqlığı)
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>
                      {cmsHero.borderRadius === 'custom' ? `${cmsHero.customBorderRadius || 24}px` : (cmsHero.borderRadius || 'arch')}
                    </span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '6px' }}>
                    {radiusOptions.map(ro => {
                      const isSel = (cmsHero.borderRadius || 'arch') === ro.id;
                      return (
                        <button
                          key={ro.id}
                          type="button"
                          onClick={() => setCmsHero(p => ({ ...p, borderRadius: ro.id }))}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: isSel ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                            background: isSel ? '#fffbeb' : '#ffffff',
                            color: isSel ? '#92400e' : '#475569'
                          }}
                        >
                          {ro.label}
                        </button>
                      );
                    })}
                  </div>
                  {cmsHero.borderRadius === 'custom' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={cmsHero.customBorderRadius !== undefined ? cmsHero.customBorderRadius : 24}
                        onChange={e => setCmsHero(p => ({ ...p, customBorderRadius: Number(e.target.value) }))}
                        style={{ flex: 1, cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '45px', textAlign: 'right' }}>
                        {cmsHero.customBorderRadius !== undefined ? cmsHero.customBorderRadius : 24}px
                      </span>
                    </div>
                  )}
                </div>

                {/* ŞƏKİL / MEDIA ÖLÇÜSÜ */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>aspect_ratio</span>
                      Şəkil / Media Ölçüsü (En & Nisbət)
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>
                      {cmsHero.mediaWidth || 'md'} · {cmsHero.aspectRatio || '4/5'}
                    </span>
                  </label>

                  {/* EN SEÇİMLƏRİ */}
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Maksimal En:</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '4px' }}>
                      {widthOptions.map(wo => {
                        const isSel = (cmsHero.mediaWidth || 'md') === wo.id;
                        return (
                          <button
                            key={wo.id}
                            type="button"
                            onClick={() => setCmsHero(p => ({ ...p, mediaWidth: wo.id }))}
                            style={{
                              padding: '4px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: isSel ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                              background: isSel ? '#fffbeb' : '#ffffff',
                              color: isSel ? '#92400e' : '#475569'
                            }}
                          >
                            {wo.label}
                          </button>
                        );
                      })}
                    </div>
                    {cmsHero.mediaWidth === 'custom' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <input
                          type="range"
                          min="260"
                          max="700"
                          value={cmsHero.customMediaWidth || 448}
                          onChange={e => setCmsHero(p => ({ ...p, customMediaWidth: Number(e.target.value) }))}
                          style={{ flex: 1, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '11px', fontWeight: 700, minWidth: '45px', textAlign: 'right' }}>
                          {cmsHero.customMediaWidth || 448}px
                        </span>
                      </div>
                    )}
                  </div>

                  {/* NİSBƏT SEÇİMLƏRİ */}
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nisbət (Aspect Ratio):</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '4px' }}>
                      {aspectOptions.map(ao => {
                        const isSel = (cmsHero.aspectRatio || '4/5') === ao.id;
                        return (
                          <button
                            key={ao.id}
                            type="button"
                            onClick={() => setCmsHero(p => ({ ...p, aspectRatio: ao.id }))}
                            style={{
                              padding: '4px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: isSel ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                              background: isSel ? '#fffbeb' : '#ffffff',
                              color: isSel ? '#92400e' : '#475569'
                            }}
                          >
                            {ao.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. ŞƏKİL ÜZƏRİNDƏKİ SİTAT (QUOTE) VƏ ARXA PARILTI */}
              <div style={{ background: '#fdfcf7', padding: '12px', borderRadius: '8px', border: '1px solid #f1ece1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cmsHero.showQuote !== false}
                      onChange={e => setCmsHero(p => ({ ...p, showQuote: e.target.checked }))}
                    />
                    <span>Şəkil / Video Üzərində Sitat Qutusunu Göstər</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cmsHero.showGlow !== false}
                      onChange={e => setCmsHero(p => ({ ...p, showGlow: e.target.checked }))}
                    />
                    <span>Arxa Fon Parıltısını (Glow) Aktiv Et</span>
                  </label>
                </div>

                {cmsHero.showQuote !== false && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <Field label="Şəkil Üzərində Sitat" block={cmsHero} setBlock={setCmsHero} fieldKey="quote" />
                    <Field label="Sitat Alt Yazısı" block={cmsHero} setBlock={setCmsHero} fieldKey="quoteSub" />
                  </div>
                )}
              </div>

              {/* MEDIA ÜZƏRİNDƏKİ ÜZƏN STATUS NİŞANI (FLOATING BADGE) */}
              <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px', color: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#f8fafc', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cmsHero.showMediaBadge !== false}
                      onChange={e => setCmsHero(p => ({ ...p, showMediaBadge: e.target.checked }))}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>verified</span>
                      Media Üzərindəki Üzən Status Nişanını Göstər
                    </span>
                  </label>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Şəklin yuxarı sol küncündəki tünd qızılı etiket
                  </span>
                </div>

                {cmsHero.showMediaBadge !== false && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', paddingTop: '4px' }}>
                    <Field label="Nişan Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="mediaBadgeText" placeholder="Beynəlxalq Standart" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Nişan İkonu (Material Icon)</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={cmsHero.mediaBadgeIcon || 'verified'}
                        onChange={e => setCmsHero(p => ({ ...p, mediaBadgeIcon: e.target.value }))}
                        placeholder="verified, stars, workspace_premium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 6. CANLI İNTERAKTİV ÖNİZLƏMƏ (LIVE PREVIEW) */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>visibility</span>
                    Canlı Önizləmə (Real-time Preview)
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Seçilmiş stil: <strong>{heroStyles.frameStyle}</strong> · Stroke: <strong>{heroStyles.strokeWidth}px</strong> · Nisbət: <strong>{heroStyles.aspectRatio}</strong>
                  </span>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '24px 16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '260px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* PREVIEW WRAPPER */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: heroStyles.maxWidth === '100%' ? '360px' : `min(340px, ${heroStyles.maxWidth})`
                  }}>
                    {/* HALO GLOW */}
                    {cmsHero.showGlow !== false && (
                      <div style={{
                        position: 'absolute',
                        inset: '-10px',
                        background: 'rgba(197, 160, 89, 0.15)',
                        borderRadius: '9999px',
                        filter: 'blur(20px)',
                        pointerEvents: 'none'
                      }} />
                    )}

                    {/* OUTER CONTAINER */}
                    <div
                      style={{
                        position: 'relative',
                        boxShadow: '0 14px 28px rgba(0,0,0,0.12)',
                        overflow: 'hidden',
                        borderRadius: heroStyles.outerRadius,
                        border: heroStyles.strokeWidth > 0 ? `${heroStyles.strokeWidth}px solid ${heroStyles.strokeColor}` : 'none',
                        background: heroStyles.isFrameless ? 'transparent' : '#ffffff',
                        padding: heroStyles.isFrameless ? '0px' : '8px'
                      }}
                    >
                      {/* FLOATING BADGE PREVIEW */}
                      {cmsHero.showMediaBadge !== false && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          zIndex: 20,
                          background: 'rgba(7, 15, 30, 0.88)',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(197, 160, 89, 0.5)',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#fff',
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          pointerEvents: 'none'
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#c5a059' }}>
                            {cmsHero.mediaBadgeIcon || 'verified'}
                          </span>
                          <span>{cmsHero.mediaBadgeText || 'Beynəlxalq Standart'}</span>
                        </div>
                      )}

                      {/* INNER MEDIA CONTAINER */}
                      <div
                        style={{
                          borderRadius: heroStyles.innerRadius,
                          overflow: 'hidden',
                          width: '100%',
                          aspectRatio: heroStyles.aspectRatio === 'auto' ? undefined : heroStyles.aspectRatio,
                          background: '#e2e8f0',
                          position: 'relative'
                        }}
                      >
                        {isVideoMode && cmsHero.videoUrl ? (
                          heroVideo.type === 'youtube' || heroVideo.type === 'vimeo' ? (
                            <iframe
                              src={heroVideo.embedUrl}
                              title="Preview Video"
                              style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                          ) : (
                            <video
                              src={heroVideo.rawUrl || cmsHero.videoUrl}
                              poster={cmsHero.videoPoster || cmsHero.image}
                              autoPlay={cmsHero.videoAutoplay !== false}
                              loop={cmsHero.videoLoop !== false}
                              muted={cmsHero.videoMuted !== false}
                              controls={cmsHero.videoControls === true}
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: heroStyles.objectFit }}
                            />
                          )
                        ) : (
                          <img
                            src={
                              cmsHero.image ||
                              "https://lh3.googleusercontent.com/aida-public/AB6AXuBu6A42fLsKyb7QEyw763LYrM2DhMvrcMod35fdqpYFnlKrGTcsg11v2ljzwkebadfB8h3tfo-a23eJ2C1IgUxOWL0A7cON3aCvZ3irV6bqO5eStKS9edI_Qda-YAOeRR0EMqS_cCqNkoDRtBJgrns8bUxgLQjRFG1ZVUGF2Ob9e9CG4dgb2myU2AJgY2j8uSiSRSDuMt6yq1zuCRYVZhvt2-Eiq7WHllVLEpzNMbm6AuMR7CS-ijR7"
                            }
                            alt="Hero Preview"
                            style={{ width: '100%', height: '100%', objectFit: heroStyles.objectFit }}
                          />
                        )}
                      </div>

                      {/* QUOTE OVERLAY PREVIEW */}
                      {cmsHero.showQuote !== false && (
                        <div style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          right: '12px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(6px)',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(197, 160, 89, 0.4)',
                          textAlign: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontStyle: 'italic', fontSize: '11px', color: '#c5a059', fontWeight: 600 }}>
                            "{cmsHero.quote || 'Daxili səssizlikdə bütün cavablar aşkarlanır.'}"
                          </div>
                          <div style={{ fontSize: '8px', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b', marginTop: '2px' }}>
                            {cmsHero.quoteSub || 'Monodoxia Fəlsəfəsi'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* YADDA SAXLA DÜYMƏSİ */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Dəyişikliklər həm veb saytda canlı görünəcək, həm də yadda saxlanılacaq.
                </span>
                <button
                  type="button"
                  onClick={() => saveBlock('hero', cmsHero)}
                  className="admin-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 24px', fontSize: '13px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                  <span>Hero Tənzimləmələrini Yadda Saxla</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* AKADEMİYANIN MƏRAMI (ABOUT) */}
      {cmsBlock === 'about' && (() => {
        const aboutStyles = getAboutMediaStyles(cmsAbout);
        const aboutVideo = parseVideoUrl(cmsAbout.videoUrl);
        const isVideoMode = cmsAbout.mediaType === 'video';

        const framePresets = [
          { id: 'rounded', label: 'Modern Yuvarlaq', icon: 'rounded_corner', desc: '16px zərif künclər (Klassik)' },
          { id: 'arch', label: 'Klassik Tağ (Arch)', icon: 'architecture', desc: 'Monodoxia imza tağvarisi (140px tağ)' },
          { id: 'rectangle', label: 'Düzbucaqlı (Kəskin)', icon: 'crop_square', desc: '0px kəskin künclər' },
          { id: 'pill', label: 'Kapsul / Oval', icon: 'capsule', desc: 'Tam dairəvi kapsul (9999px)' },
          { id: 'circle', label: 'Tam Dairəvi', icon: 'circle', desc: '1:1 nisbətində tam dairə' },
          { id: 'none', label: 'Framesiz (Çərçivəsiz)', icon: 'layers_clear', desc: 'Altlıqsız təmiz media' }
        ];

        const strokeWidthOptions = [
          { val: 0, label: '0px (Yoxdur)' },
          { val: 1, label: '1px (İncə)' },
          { val: 2, label: '2px (Orta)' },
          { val: 3, label: '3px' },
          { val: 4, label: '4px (Qalın)' },
          { val: 6, label: '6px' },
          { val: 8, label: '8px (Ekstra)' }
        ];

        const strokeColorOptions = [
          { val: 'rgba(197, 160, 89, 0.4)', label: 'Zərif Şəffaf Qızılı' },
          { val: '#c5a059', label: 'Monodoxia Qızılı' },
          { val: '#e2e8f0', label: 'Neytral Boz' },
          { val: '#112240', label: 'Tünd Göy' },
          { val: '#ffffff', label: 'Ağ' },
          { val: 'transparent', label: 'Şəffaf' }
        ];

        const radiusOptions = [
          { id: 'none', label: '0px (Kəskin)' },
          { id: 'sm', label: '8px (Kiçik)' },
          { id: 'md', label: '16px (Orta)' },
          { id: 'lg', label: '24px (Böyük)' },
          { id: 'xl', label: '36px (Geniş)' },
          { id: 'full', label: '9999px (Kapsul)' },
          { id: 'arch', label: 'Tağvari (140px)' },
          { id: 'custom', label: 'Xüsusi (Slider)' }
        ];

        const widthOptions = [
          { id: 'sm', label: 'Kompakt (380px)' },
          { id: 'md', label: 'Standart (460px)' },
          { id: 'lg', label: 'Geniş (540px)' },
          { id: 'xl', label: 'Böyük (620px)' },
          { id: 'full', label: '100% (Tam En)' },
          { id: 'custom', label: 'Xüsusi En (px)' }
        ];

        const aspectOptions = [
          { id: '4/3', label: '4:3 (Standart Məram)' },
          { id: '16/9', label: '16:9 (Geniş Ekran / Video)' },
          { id: '1/1', label: '1:1 (Kvadrat)' },
          { id: '4/5', label: '4:5 (Portret)' },
          { id: '3/4', label: '3:4 (Klassik Portret)' },
          { id: 'auto', label: 'Auto (Orijinal Nisbət)' }
        ];

        const handleAboutVideoUpload = (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 50 * 1024 * 1024) {
            showToast('Video fayl ölçüsü 50MB-dan çox ola bilməz', 'error');
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            setCmsAbout(p => ({ ...p, videoUrl: event.target.result, mediaType: 'video' }));
            showToast('Video faylı uğurla yükləndi!', 'success');
          };
          reader.readAsDataURL(file);
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* ƏSAS MƏTNLƏR */}
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Akademiyanın Məramı – Əsas Mətnlər</h5>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Bölmənin üst etiketi, əsas fəlsəfə başlığı və ətraflı izahat mətni</p>
                </div>
                <span className="admin-count-badge">Məram Bölməsi</span>
              </div>
              <Field label="Üst Etiket (Badge)" block={cmsAbout} setBlock={setCmsAbout} fieldKey="badge" />
              <Field label="Əsas Başlıq" block={cmsAbout} setBlock={setCmsAbout} fieldKey="title" />
              <Field label="Mətn (desc)" block={cmsAbout} setBlock={setCmsAbout} fieldKey="desc" multiline rows={4} />
            </div>

            {/* AKADEMİYANIN MƏRAMI SOL MEDIA (ŞƏKİL / VİDEO, FRAME, STROKE, RADIUS, ÖLÇÜ) */}
            <div className="admin-card-elevated" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1.5px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ color: '#c5a059' }}>photo_library</span>
                    Akademiyanın Məramı – Sol Media (Şəkil / Video) İdarəetməsi
                  </h5>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>
                    Sol tərəfdəki vizual blokun media formatı, çərçivə stili, stroke qalınlığı, framesiz rejim, künc radiusu və ölçülərini tənzimləyin
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: isVideoMode ? '#eff6ff' : '#fef3c7', color: isVideoMode ? '#1d4ed8' : '#92400e', border: isVideoMode ? '1px solid #bfdbfe' : '1px solid #fde68a' }}>
                    {isVideoMode ? '🎥 Video Rejimi' : '🖼️ Şəkil Rejimi'}
                  </span>
                  {aboutStyles.isFrameless && (
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                      ✨ Framesiz
                    </span>
                  )}
                </div>
              </div>

              {/* 1. MEDIA NÖVÜ SEÇİMİ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>perm_media</span>
                  Media Növü (Şəkil və ya Video)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setCmsAbout(p => ({ ...p, mediaType: 'image' }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: !isVideoMode ? '2px solid #c5a059' : '1px solid #cbd5e1',
                      background: !isVideoMode ? '#fffdf7' : '#ffffff',
                      color: !isVideoMode ? '#92400e' : '#475569',
                      boxShadow: !isVideoMode ? '0 2px 6px rgba(197,160,89,0.18)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>image</span>
                    <span>Şəkil (Image)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCmsAbout(p => ({ ...p, mediaType: 'video' }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isVideoMode ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isVideoMode ? '#eff6ff' : '#ffffff',
                      color: isVideoMode ? '#1e40af' : '#475569',
                      boxShadow: isVideoMode ? '0 2px 6px rgba(37,99,235,0.18)' : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>videocam</span>
                    <span>Video (YouTube / MP4 / Vimeo)</span>
                  </button>
                </div>
              </div>

              {/* 2. MEDIA MƏNBƏYİ: ŞƏKİL VƏ YA VİDEO */}
              {!isVideoMode ? (
                /* ŞƏKİL SAHƏSİ */
                <div style={{ background: '#fdfbf7', padding: '14px', borderRadius: '8px', border: '1px solid #f1ece1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <ImageField
                    label="Məram Sol Əsas Şəkil URL və ya Fayl"
                    value={cmsAbout.image}
                    onChange={v => setCmsAbout(p => ({ ...p, image: v }))}
                  />
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setCmsAbout(p => ({
                        ...p,
                        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJ9v48nWJzTbw80sDrDtTVhJ3mvXbVUbCeHjTMi_Y-NUPyOTMrFxaSuOPQsSmEsuH1iFUesyI1GA23YGlZQlqzMJLdnrhTp12XLt8NPffBd1uWx8YenygyqGA2zja0D9d-rKVoNVykmJRjh03f9EEtW4IghPWZy_-gBbdmrV1VbwrBwzlJWS1Ixvco8e0IdrYq8AHbaR5Pdystz7aBbXr4cWkfac3BRp_ESWqbNA0K6eg7X2YuuMP"
                      }))}
                      className="admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      Klassik Monodoxia Məram Şəkli (Defolt)
                    </button>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Şəkil Doldurma:</span>
                      <select
                        value={cmsAbout.objectFit || 'cover'}
                        onChange={e => setCmsAbout(p => ({ ...p, objectFit: e.target.value }))}
                        className="admin-input"
                        style={{ padding: '3px 8px', fontSize: '11px', width: 'auto' }}
                      >
                        <option value="cover">Tam Örtük (Cover)</option>
                        <option value="contain">Sığışdır (Contain)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* VİDEO SAHƏSİ */
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="admin-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Video URL və ya Video Fayl Yüklə</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>YouTube, Vimeo və ya birbaşa .mp4/.webm</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=... və ya video.mp4"
                        value={cmsAbout.videoUrl || ''}
                        onChange={e => setCmsAbout(p => ({ ...p, videoUrl: e.target.value, mediaType: 'video' }))}
                        className="admin-input"
                        style={{ flex: 1 }}
                      />
                      <label className="admin-btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#2563eb' }}>video_file</span>
                        <span>Fayl Yüklə</span>
                        <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" style={{ display: 'none' }} onChange={handleAboutVideoUpload} />
                      </label>
                      {cmsAbout.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setCmsAbout(p => ({ ...p, videoUrl: '' }))}
                          className="admin-btn-danger"
                          style={{ padding: '6px 10px', fontSize: '11px' }}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </div>

                  {/* TEZ NÜMUNƏ DÜYMƏLƏRİ */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Sürətli sınaq üçün:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCmsAbout(p => ({ ...p, videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM', mediaType: 'video' }));
                        showToast('YouTube video linki təyin edildi', 'info');
                      }}
                      className="admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      ▶️ YouTube Fərqindəlik Videosu
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCmsAbout(p => ({ ...p, videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4', mediaType: 'video' }));
                        showToast('Sakitləşdirici MP4 video təyin edildi', 'info');
                      }}
                      className="admin-btn-secondary"
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      🌊 Sakitləşdirici Təbiət (MP4)
                    </button>
                  </div>

                  {/* VİDEO POSTER ŞƏKLİ */}
                  <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                    <ImageField
                      label="Video Örtük Şəkli (Poster / Thumbnail - opsional)"
                      value={cmsAbout.videoPoster || ''}
                      onChange={v => setCmsAbout(p => ({ ...p, videoPoster: v }))}
                    />
                  </div>

                  {/* VİDEO PARAMETRLƏRİ */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', paddingTop: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsAbout.videoAutoplay !== false}
                        onChange={e => setCmsAbout(p => ({ ...p, videoAutoplay: e.target.checked }))}
                      />
                      <span>Avtomatik Oxut (Autoplay)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsAbout.videoMuted !== false}
                        onChange={e => setCmsAbout(p => ({ ...p, videoMuted: e.target.checked }))}
                      />
                      <span>Səssiz (Muted)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsAbout.videoLoop !== false}
                        onChange={e => setCmsAbout(p => ({ ...p, videoLoop: e.target.checked }))}
                      />
                      <span>Təkrarla (Loop)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={cmsAbout.videoControls === true}
                        onChange={e => setCmsAbout(p => ({ ...p, videoControls: e.target.checked }))}
                      />
                      <span>Pleyer Düymələri (Controls)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 3. FRAME STİLİ VƏ FRAMESİZ REJİMİ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>filter_frames</span>
                    Frame Stili (Çərçivə Forması)
                  </label>
                  {/* FRAMESİZ TOGGLE SWITCH */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: aboutStyles.isFrameless ? '#fef3c7' : '#f1f5f9',
                    border: aboutStyles.isFrameless ? '1.5px solid #d4af37' : '1px solid #cbd5e1',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: aboutStyles.isFrameless ? '#92400e' : '#475569'
                  }}>
                    <input
                      type="checkbox"
                      checked={aboutStyles.isFrameless}
                      onChange={e => {
                        const val = e.target.checked;
                        setCmsAbout(p => ({
                          ...p,
                          isFrameless: val,
                          frameStyle: val ? 'none' : (p.frameStyle === 'none' ? 'rounded' : (p.frameStyle || 'rounded'))
                        }));
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Framesiz Rejim (Çərçivə lövhəsiz)</span>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                  {framePresets.map(fp => {
                    const isSelected = (!aboutStyles.isFrameless && (cmsAbout.frameStyle || 'rounded') === fp.id) || (aboutStyles.isFrameless && fp.id === 'none');
                    return (
                      <button
                        key={fp.id}
                        type="button"
                        onClick={() => {
                          if (fp.id === 'none') {
                            setCmsAbout(p => ({ ...p, isFrameless: true, frameStyle: 'none' }));
                          } else {
                            setCmsAbout(p => ({
                              ...p,
                              isFrameless: false,
                              frameStyle: fp.id,
                              borderRadius: fp.id === 'arch' ? 'arch' : (fp.id === 'rectangle' ? 'none' : (fp.id === 'pill' ? 'full' : (fp.id === 'circle' ? 'full' : (fp.id === 'rounded' ? 'md' : (p.borderRadius || 'md')))))
                            }));
                          }
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          border: isSelected ? '2px solid #c5a059' : '1px solid #e2e8f0',
                          background: isSelected ? '#fffdf7' : '#ffffff',
                          color: isSelected ? '#0f172a' : '#475569',
                          boxShadow: isSelected ? '0 2px 6px rgba(197,160,89,0.15)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12px', color: isSelected ? '#92400e' : '#1e293b' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: isSelected ? '#c5a059' : '#64748b' }}>{fp.icon}</span>
                          <span>{fp.label}</span>
                        </div>
                        <span style={{ fontSize: '10px', color: '#64748b', marginTop: '3px' }}>{fp.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. STROKE ÖLÇÜSÜ (QALINLIĞI) VƏ RƏNGİ */}
              <div style={{ background: '#fafaf9', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e7e5e4', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>border_style</span>
                    Stroke Ölçüsü (Qalınlığı): <strong>{cmsAbout.strokeWidth !== undefined ? cmsAbout.strokeWidth : 1}px</strong>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {strokeWidthOptions.map(sw => (
                      <button
                        key={sw.val}
                        type="button"
                        onClick={() => setCmsAbout(p => ({ ...p, strokeWidth: sw.val }))}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          border: (cmsAbout.strokeWidth !== undefined ? cmsAbout.strokeWidth : 1) === sw.val ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                          background: (cmsAbout.strokeWidth !== undefined ? cmsAbout.strokeWidth : 1) === sw.val ? '#fffbeb' : '#ffffff',
                          color: (cmsAbout.strokeWidth !== undefined ? cmsAbout.strokeWidth : 1) === sw.val ? '#92400e' : '#475569'
                        }}
                      >
                        {sw.val}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* STROKE RƏNGİ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Stroke Rəngi:</span>
                  {strokeColorOptions.map(sc => (
                    <button
                      key={sc.val}
                      type="button"
                      onClick={() => setCmsAbout(p => ({ ...p, strokeColor: sc.val }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: (cmsAbout.strokeColor || 'rgba(197, 160, 89, 0.4)') === sc.val ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#334155'
                      }}
                    >
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: sc.val === 'transparent' ? '#ffffff' : sc.val, border: '1px solid #94a3b8', display: 'inline-block' }} />
                      <span>{sc.label}</span>
                    </button>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Özəl Rəng:</span>
                    <input
                      type="color"
                      value={cmsAbout.strokeColor?.startsWith('#') ? cmsAbout.strokeColor : '#c5a059'}
                      onChange={e => setCmsAbout(p => ({ ...p, strokeColor: e.target.value }))}
                      style={{ width: '28px', height: '28px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* 5. BORDER RADIUS VƏ ÖLÇÜLƏR (EN & NİSBƏT) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {/* BORDER RADIUS */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>rounded_corner</span>
                      Border Radius (Künc Yuvarlaqlığı)
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>
                      {cmsAbout.borderRadius === 'custom' ? `${cmsAbout.customBorderRadius || 16}px` : (cmsAbout.borderRadius || 'md')}
                    </span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '6px' }}>
                    {radiusOptions.map(ro => {
                      const isSel = (cmsAbout.borderRadius || 'md') === ro.id;
                      return (
                        <button
                          key={ro.id}
                          type="button"
                          onClick={() => setCmsAbout(p => ({ ...p, borderRadius: ro.id }))}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: isSel ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                            background: isSel ? '#fffbeb' : '#ffffff',
                            color: isSel ? '#92400e' : '#475569'
                          }}
                        >
                          {ro.label}
                        </button>
                      );
                    })}
                  </div>
                  {cmsAbout.borderRadius === 'custom' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={cmsAbout.customBorderRadius !== undefined ? cmsAbout.customBorderRadius : 16}
                        onChange={e => setCmsAbout(p => ({ ...p, customBorderRadius: Number(e.target.value) }))}
                        style={{ flex: 1, cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '45px', textAlign: 'right' }}>
                        {cmsAbout.customBorderRadius !== undefined ? cmsAbout.customBorderRadius : 16}px
                      </span>
                    </div>
                  )}
                </div>

                {/* ŞƏKİL / MEDIA ÖLÇÜSÜ (EN & NİSBƏT) */}
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="admin-label" style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>aspect_ratio</span>
                      Şəkil / Media Ölçüsü (En & Nisbət)
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>
                      {cmsAbout.mediaWidth || 'full'} · {cmsAbout.aspectRatio || '4/3'}
                    </span>
                  </label>

                  {/* EN SEÇİMLƏRİ */}
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Maksimal En:</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '4px' }}>
                      {widthOptions.map(wo => {
                        const isSel = (cmsAbout.mediaWidth || 'full') === wo.id;
                        return (
                          <button
                            key={wo.id}
                            type="button"
                            onClick={() => setCmsAbout(p => ({ ...p, mediaWidth: wo.id }))}
                            style={{
                              padding: '4px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: isSel ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                              background: isSel ? '#fffbeb' : '#ffffff',
                              color: isSel ? '#92400e' : '#475569'
                            }}
                          >
                            {wo.label}
                          </button>
                        );
                      })}
                    </div>
                    {cmsAbout.mediaWidth === 'custom' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <input
                          type="range"
                          min="260"
                          max="700"
                          value={cmsAbout.customMediaWidth || 460}
                          onChange={e => setCmsAbout(p => ({ ...p, customMediaWidth: Number(e.target.value) }))}
                          style={{ flex: 1, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '11px', fontWeight: 700, minWidth: '45px', textAlign: 'right' }}>
                          {cmsAbout.customMediaWidth || 460}px
                        </span>
                      </div>
                    )}
                  </div>

                  {/* NİSBƏT SEÇİMLƏRİ */}
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nisbət (Aspect Ratio):</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '4px' }}>
                      {aspectOptions.map(ao => {
                        const isSel = (cmsAbout.aspectRatio || '4/3') === ao.id;
                        return (
                          <button
                            key={ao.id}
                            type="button"
                            onClick={() => setCmsAbout(p => ({ ...p, aspectRatio: ao.id }))}
                            style={{
                              padding: '4px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: isSel ? '1.5px solid #c5a059' : '1px solid #cbd5e1',
                              background: isSel ? '#fffbeb' : '#ffffff',
                              color: isSel ? '#92400e' : '#475569'
                            }}
                          >
                            {ao.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. ŞƏKİL ALT ETİKETLƏRİ (BADGES) */}
              <div style={{ background: '#fdfcf7', padding: '12px', borderRadius: '8px', border: '1px solid #f1ece1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={cmsAbout.showBadges !== false}
                      onChange={e => setCmsAbout(p => ({ ...p, showBadges: e.target.checked }))}
                    />
                    <span>Şəkil / Video Altındakı Məlumat Etiketlərini Göstər</span>
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Sol & Sağ Etiket Mətnləri</span>
                </div>

                {cmsAbout.showBadges !== false && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <Field label="Şəkil Sol Etiketi" block={cmsAbout} setBlock={setCmsAbout} fieldKey="imageBadgeLeft" />
                    <Field label="Şəkil Sağ Etiketi" block={cmsAbout} setBlock={setCmsAbout} fieldKey="imageBadgeRight" />
                  </div>
                )}
              </div>

              {/* 7. CANLI İNTERAKTİV ÖNİZLƏMƏ (LIVE PREVIEW) */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#c5a059' }}>visibility</span>
                    Canlı Önizləmə (Real-time Preview)
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Seçilmiş stil: <strong>{aboutStyles.frameStyle}</strong> · Stroke: <strong>{aboutStyles.strokeWidth}px</strong> · Nisbət: <strong>{aboutStyles.aspectRatio}</strong>
                  </span>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '24px 16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>
                  <div style={{ width: '100%', maxWidth: aboutStyles.maxWidth, margin: '0 auto' }}>
                    <div
                      style={{
                        position: 'relative',
                        borderRadius: aboutStyles.outerRadius,
                        border: aboutStyles.strokeWidth > 0 ? `${aboutStyles.strokeWidth}px solid ${aboutStyles.strokeColor}` : 'none',
                        background: aboutStyles.isFrameless ? 'transparent' : '#ffffff',
                        padding: aboutStyles.isFrameless ? '0px' : '10px',
                        boxShadow: aboutStyles.isFrameless ? 'none' : '0 4px 14px rgba(0,0,0,0.06)',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div
                        style={{
                          borderRadius: aboutStyles.innerRadius,
                          aspectRatio: aboutStyles.aspectRatio === 'auto' ? undefined : aboutStyles.aspectRatio,
                          overflow: 'hidden',
                          background: '#0f172a',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '220px'
                        }}
                      >
                        {isVideoMode && cmsAbout.videoUrl ? (
                          aboutVideo.type === 'youtube' || aboutVideo.type === 'vimeo' ? (
                            <iframe
                              src={aboutVideo.embedUrl}
                              title="About Preview"
                              style={{ width: '100%', height: '100%', border: 0 }}
                            />
                          ) : (
                            <video
                              src={aboutVideo.rawUrl || cmsAbout.videoUrl}
                              poster={cmsAbout.videoPoster || cmsAbout.image}
                              autoPlay={cmsAbout.videoAutoplay !== false}
                              loop={cmsAbout.videoLoop !== false}
                              muted={cmsAbout.videoMuted !== false}
                              controls={cmsAbout.videoControls === true}
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: aboutStyles.objectFit }}
                            />
                          )
                        ) : (
                          <img
                            src={
                              cmsAbout.image ||
                              "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJ9v48nWJzTbw80sDrDtTVhJ3mvXbVUbCeHjTMi_Y-NUPyOTMrFxaSuOPQsSmEsuH1iFUesyI1GA23YGlZQlqzMJLdnrhTp12XLt8NPffBd1uWx8YenygyqGA2zja0D9d-rKVoNVykmJRjh03f9EEtW4IghPWZy_-gBbdmrV1VbwrBwzlJWS1Ixvco8e0IdrYq8AHbaR5Pdystz7aBbXr4cWkfac3BRp_ESWqbNA0K6eg7X2YuuMP"
                            }
                            alt="Məram Önizləmə"
                            style={{ width: '100%', height: '100%', objectFit: aboutStyles.objectFit }}
                          />
                        )}
                      </div>

                      {/* BADGES PREVIEW */}
                      {cmsAbout.showBadges !== false && (cmsAbout.imageBadgeLeft || cmsAbout.imageBadgeRight) && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: aboutStyles.isFrameless ? '10px 4px 4px' : '12px 6px 4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          <span style={{ color: '#c5a059', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            {cmsAbout.imageBadgeLeft || 'Gündəlik Fərqindəlik'}
                          </span>
                          <span style={{ color: '#94a3b8' }}>
                            {cmsAbout.imageBadgeRight || '01 / SÜKUT'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* YADDA SAXLA DÜYMƏSİ */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button
                  type="button"
                  onClick={saveAboutWithPillars}
                  className="admin-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '13px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                  <span>Akademiyanın Məramını Yadda Saxla</span>
                </button>
              </div>
            </div>

          {/* DƏYƏR KARTLARI (PİLLARS) – BİRBAŞA REDAKTƏ SAHƏLƏRİ */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Akademiyanın Məramı – Dəyər Kartları ({cmsPillars.length} Kart)
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Ana səhifədə şəklin sağında görünən 4 əsas dəyər kartının məlumatları (birbaşa redaktə edilə bilən sahələr)
                </p>
              </div>
              <button
                type="button"
                onClick={addNewPillarCard}
                className="admin-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>add</span>
                <span>Yeni Kart Əlavə Et</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {cmsPillars.map((p, idx) => (
                <div
                  key={p.id || idx}
                  style={{
                    padding: '14px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#b45309',
                        background: '#fef3c7',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Kart #{idx + 1}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        {p.title || `Kart ${idx + 1}`}
                      </span>
                    </div>
                    {cmsPillars.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePillarAt(idx)}
                        className="admin-btn-danger"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        title="Bu kartı sil"
                      >
                        Sil
                      </button>
                    )}
                  </div>

                  {/* İkon Sahəsi */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>İkon (Material Symbols)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#b45309', background: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        {p.icon || 'psychology'}
                      </span>
                      <input
                        type="text"
                        value={p.icon || ''}
                        onChange={e => updatePillarAt(idx, prev => ({ ...prev, icon: e.target.value }))}
                        className="admin-input"
                        placeholder="Məs: psychology, supervisor_account, spa, shield..."
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Başlıq Sahəsi */}
                  <Field
                    label="Kart Başlığı"
                    block={p}
                    setBlock={updater => updatePillarAt(idx, updater)}
                    fieldKey="title"
                  />

                  {/* İzah Sahəsi */}
                  <Field
                    label="Kart İzahı (Mətn)"
                    block={p}
                    setBlock={updater => updatePillarAt(idx, updater)}
                    fieldKey="desc"
                    multiline
                    rows={3}
                  />
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '8px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={saveAboutWithPillars}
                className="admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                <span>Bütün Bölməni və Kartları Yadda Saxla</span>
              </button>
            </div>
          </div>
        </div>
      );
    })()}

      {/* FUNDAMENTAL SAHƏLƏR (AREAS) */}
      {cmsBlock === 'areas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Bölmə Başlıq və Təsviri */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Fundamental Sahələr – Başlıq və Giriş Mətni</h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Ana səhifədəki 8 inkişaf istiqamətinin üst başlığı və təsviri</p>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>Ana Səhifə</span>
            </div>
            <Field label="Üst Etiket (Badge)" block={cmsAreas} setBlock={setCmsAreas} fieldKey="badge" />
            <Field label="Əsas Başlıq" block={cmsAreas} setBlock={setCmsAreas} fieldKey="title" />
            <Field label="Giriş Təsviri (desc)" block={cmsAreas} setBlock={setCmsAreas} fieldKey="desc" multiline rows={3} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <Field label="Ümumi Düymə Mətni" block={cmsAreas} setBlock={setCmsAreas} fieldKey="btnText" placeholder="Məs: Kəşf et" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label className="admin-label" style={{ margin: 0 }}>Ümumi Keçid Linki</label>
                <input
                  type="text"
                  value={cmsAreas.link || ''}
                  onChange={e => setCmsAreas(p => ({ ...p, link: e.target.value }))}
                  className="admin-input"
                  placeholder="Məs: #akademiya və ya /courses"
                />
              </div>
            </div>
            <div>
              <button onClick={saveAreasWithItems} className="admin-btn-primary">Yadda Saxla</button>
            </div>
          </div>

          {/* SAHƏLƏR (AREAS GRID) – BİRBAŞA REDAKTƏ SAHƏLƏRİ */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Fundamental Sahələr – İnkişaf İstiqamətləri ({cmsAreasList.length} Sahə)
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Ana səhifədə qrid şəklində göstərilən bütün inkişaf sahələrini birbaşa redaktə edin və ya yenilərini əlavə edin
                </p>
              </div>
              <button
                type="button"
                onClick={addNewAreaCard}
                className="admin-btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>add</span>
                <span>Yeni Sahə Əlavə Et</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {cmsAreasList.map((a, idx) => (
                <div
                  key={a.id || idx}
                  style={{
                    padding: '14px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#b45309',
                        background: '#fef3c7',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Sahə #{idx + 1}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        {a.title || `Sahə ${idx + 1}`}
                      </span>
                    </div>
                    {cmsAreasList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAreaAt(idx)}
                        className="admin-btn-danger"
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        title="Bu sahəni sil"
                      >
                        Sil
                      </button>
                    )}
                  </div>

                  {/* Nömrə / Kod Sahəsi (Məs: 01 / DƏRİNLİK) */}
                  <Field
                    label="Nömrə / Kod (Məs: 01 / DƏRİNLİK)"
                    block={a}
                    setBlock={updater => updateAreaAt(idx, updater)}
                    fieldKey="number"
                  />

                  {/* İkon Sahəsi */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="admin-label" style={{ margin: 0 }}>İkon (Material Symbols)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#b45309', background: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        {a.icon || 'explore'}
                      </span>
                      <input
                        type="text"
                        value={a.icon || ''}
                        onChange={e => updateAreaAt(idx, prev => ({ ...prev, icon: e.target.value }))}
                        className="admin-input"
                        placeholder="Məs: psychology, trending_up, self_improvement, nest_eco_leaf, fingerprint..."
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Sahə Adı (Başlıq) */}
                  <Field
                    label="Sahə Adı (Başlıq)"
                    block={a}
                    setBlock={updater => updateAreaAt(idx, updater)}
                    fieldKey="title"
                  />

                  {/* Sahə İzahı (Təsvir) */}
                  <Field
                    label="Sahə İzahı (Təsvir)"
                    block={a}
                    setBlock={updater => updateAreaAt(idx, updater)}
                    fieldKey="desc"
                    multiline
                    rows={3}
                  />

                  {/* Düymə Mətni və Linki */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                    <Field
                      label="Düymə Mətni (fərdi)"
                      block={a}
                      setBlock={updater => updateAreaAt(idx, updater)}
                      fieldKey="btnText"
                      placeholder="Məs: Kəşf et (boşdursa ümumi)"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <label className="admin-label" style={{ margin: 0 }}>Keçid Linki (fərdi)</label>
                      <input
                        type="text"
                        value={a.link || ''}
                        onChange={e => updateAreaAt(idx, prev => ({ ...prev, link: e.target.value }))}
                        className="admin-input"
                        placeholder="Məs: #akademiya, /courses"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '8px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={saveAreasWithItems}
                className="admin-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
                <span>Bütün Sahələri və Giriş Mətnini Yadda Saxla</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACADEMY */}
      {cmsBlock === 'academy' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Akademiya Bölməsi</h5>
          <Field label="Üst Etiket" block={cmsAcademy} setBlock={setCmsAcademy} fieldKey="badge" />
          <Field label="Başlıq" block={cmsAcademy} setBlock={setCmsAcademy} fieldKey="title" />
          <Field label="Təsvir (desc)" block={cmsAcademy} setBlock={setCmsAcademy} fieldKey="desc" multiline />
          <Field label="Düymə Mətni" block={cmsAcademy} setBlock={setCmsAcademy} fieldKey="ctaText" />
          <div>
            <button onClick={() => saveBlock('academy', cmsAcademy)} className="admin-btn-primary">Yadda Saxla</button>
          </div>
        </div>
      )}

      {/* CLUB */}
      {cmsBlock === 'club' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Left section: General info & perks */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Klub — Əsas Məlumatlar və Üstünlüklər (Sol Hissə)</h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Bölmənin başlığı, təsviri, sol sütundakı imtiyaz bəndləri və müraciət düyməsi</p>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#b45309' }}>Sol Blok</span>
            </div>

            <Field label="Üst Etiket (Badge)" block={cmsClub} setBlock={setCmsClub} fieldKey="badge" />
            <Field label="Bölmə Başlığı (Title)" block={cmsClub} setBlock={setCmsClub} fieldKey="title" />
            <Field label="Bölmə Təsviri (Desc)" block={cmsClub} setBlock={setCmsClub} fieldKey="desc" multiline rows={3} />
            
            <ImageField label="Klub Şəkli (opsional)" value={cmsClub.image} onChange={v => setCmsClub(p => ({ ...p, image: v }))} />

            {/* Perks list */}
            <Field
              label="Klub İmtiyazları və Dəyərləri (Perks - Bəndlər)"
              block={cmsClub}
              setBlock={setCmsClub}
              fieldKey="perks"
              isArray={true}
              multiline={true}
              rows={5}
              placeholder="Hər sətirdə bir imtiyaz qeyd edin..."
              helpText="Sol sütunda 'verified' ikonu ilə göstərilən üstünlüklər. Hər sətirdə 1 bənd yazın."
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <Field label="Əsas Düymə Mətni (CTA)" block={cmsClub} setBlock={setCmsClub} fieldKey="ctaBtnText" placeholder="Məs: Kluba qoşul" />
              <Field label="Məhdudiyyət Xəbərdarlığı" block={cmsClub} setBlock={setCmsClub} fieldKey="limitedText" placeholder="Məs: Məhdud sayda yer: Aylıq qəbul" />
            </div>
          </div>

          {/* Right section: Membership Tier Card */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Klub — Rezidentlik / Paket Kartı (Sağ Hissə)</h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Sağ tərəfdəki ağ kart: etiket, paket adı, alt başlıq, qiymət, daxil olan xüsusiyyətlər və düymə</p>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#ecfdf5', color: '#047857' }}>Sağ Kart</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <Field label="Kart Üst Etiketi (Badge)" block={cmsClub} setBlock={setCmsClub} fieldKey="tierBadge" placeholder="Məs: PREMIUM REZİDENT" />
              <Field label="Paket Adı / Başlığı" block={cmsClub} setBlock={setCmsClub} fieldKey="tierTitle" placeholder="Məs: Premium Rezident" />
            </div>

            <Field label="Paket İzahı (Alt Başlıq)" block={cmsClub} setBlock={setCmsClub} fieldKey="tierSubtitle" placeholder="Məs: Aylıq və ya illik daxil olma paketi" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <Field label="Məbləğ / Qiymət (Rəqəm)" block={cmsClub} setBlock={setCmsClub} fieldKey="tierPrice" placeholder="Məs: 95" />
              <Field label="Ödəniş Dövrü (Period)" block={cmsClub} setBlock={setCmsClub} fieldKey="tierPeriod" placeholder="Məs: / aylıq" />
              <Field label="Xüsusi Təklif / Endirim Qeydi" block={cmsClub} setBlock={setCmsClub} fieldKey="tierOffer" placeholder="Məs: İllik ödənişdə 2 ay hədiyyə" />
            </div>

            {/* Tier features list */}
            <Field
              label="Paketə Daxil Olan Xüsusiyyətlər (Features - Bəndlər)"
              block={cmsClub}
              setBlock={setCmsClub}
              fieldKey="tierFeatures"
              isArray={true}
              multiline={true}
              rows={6}
              placeholder="Hər sətirdə bir xüsusiyyət qeyd edin..."
              helpText="Sağ kartda 'check_circle' ikonu ilə göstərilən maddələr. Hər sətirdə 1 maddə yazın."
            />

            <Field label="Kart Düymə Mətni (CTA)" block={cmsClub} setBlock={setCmsClub} fieldKey="tierCtaText" placeholder="Məs: REZİDENT OL" />
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                saveBlock('club', cmsClub);
                const premTier = clubTiersList.find(t => t.id === 'premium');
                if (premTier && updateClubTier) {
                  updateClubTier(premTier.id, {
                    name: cmsClub.tierTitle || premTier.name,
                    price: cmsClub.tierPrice || premTier.price,
                    period: cmsClub.tierPeriod || premTier.period,
                    features: (Array.isArray(cmsClub.tierFeatures) && cmsClub.tierFeatures.length > 0) ? cmsClub.tierFeatures : premTier.features,
                    translations: {
                      ...(premTier.translations || {}),
                      az: {
                        ...(premTier.translations?.az || {}),
                        name: cmsClub.translations?.az?.tierTitle || cmsClub.tierTitle || premTier.name,
                        period: cmsClub.translations?.az?.tierPeriod || cmsClub.tierPeriod || premTier.period,
                        features: cmsClub.translations?.az?.tierFeatures || cmsClub.tierFeatures || premTier.features
                      },
                      en: {
                        ...(premTier.translations?.en || {}),
                        name: cmsClub.translations?.en?.tierTitle || premTier.translations?.en?.name || premTier.name,
                        period: cmsClub.translations?.en?.tierPeriod || premTier.translations?.en?.period || premTier.period,
                        features: cmsClub.translations?.en?.tierFeatures || premTier.translations?.en?.features || premTier.features
                      },
                      tr: {
                        ...(premTier.translations?.tr || {}),
                        name: cmsClub.translations?.tr?.tierTitle || premTier.translations?.tr?.name || premTier.name,
                        period: cmsClub.translations?.tr?.tierPeriod || premTier.translations?.tr?.period || premTier.period,
                        features: cmsClub.translations?.tr?.tierFeatures || premTier.translations?.tr?.features || premTier.features
                      },
                      ru: {
                        ...(premTier.translations?.ru || {}),
                        name: cmsClub.translations?.ru?.tierTitle || premTier.translations?.ru?.name || premTier.name,
                        period: cmsClub.translations?.ru?.tierPeriod || premTier.translations?.ru?.period || premTier.period,
                        features: cmsClub.translations?.ru?.tierFeatures || premTier.translations?.ru?.features || premTier.features
                      }
                    }
                  });
                }
              }}
              className="admin-btn-primary"
            >
              Klub Məzmununu Yadda Saxla
            </button>
          </div>
        </div>
      )}

      {/* COACHES */}
      {cmsBlock === 'coaches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Koçlar Bölməsi – Başlıq</h5>
            <Field label="Üst Etiket" block={cmsCoaches} setBlock={setCmsCoaches} fieldKey="badge" />
            <Field label="Başlıq" block={cmsCoaches} setBlock={setCmsCoaches} fieldKey="title" />
            <Field label="Təsvir" block={cmsCoaches} setBlock={setCmsCoaches} fieldKey="desc" multiline />
            <div>
              <button onClick={() => saveBlock('coaches', cmsCoaches)} className="admin-btn-primary">Yadda Saxla</button>
            </div>
          </div>

          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Mövcud Koçlar və Ekspertlər</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {coachesList.map(c => (
                <div key={c.id} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  {editingCoach?.id === c.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>Koçu Redaktə Et</span>
                        <button onClick={() => setEditingCoach(null)} className="admin-btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>Ləğv et</button>
                      </div>
                      <Field label="Ad Soyad" block={editingCoach} setBlock={setEditingCoach} fieldKey="name" />
                      <Field label="Vəzifə / Başlıq" block={editingCoach} setBlock={setEditingCoach} fieldKey="title" />
                      <Field label="Bio" block={editingCoach} setBlock={setEditingCoach} fieldKey="bio" multiline />
                      <ImageField label="Profil Şəkli" value={editingCoach.image} onChange={v => setEditingCoach(p => ({ ...p, image: v }))} />
                      <Field label="İxtisaslar (vergüllə)" block={editingCoach} setBlock={setEditingCoach} fieldKey="specialties" />
                      <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                        <button
                          onClick={() => {
                            updateCoach(c.id, editingCoach);
                            setEditingCoach(null);
                            showToast('Koç məlumatları yeniləndi!', 'success');
                          }}
                          className="admin-btn-primary"
                        >
                          Saxla
                        </button>
                        <button
                          onClick={() => setEditingCoach(null)}
                          className="admin-btn-secondary"
                        >
                          Bağla
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <img
                          src={c.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={c.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0', flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{c.title}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => setEditingCoach({ ...c })}
                          className="admin-btn-edit"
                        >
                          Redaktə Et
                        </button>
                        <button
                          onClick={() => setItemToDelete({ type: 'coach', item: c })}
                          className="admin-btn-danger"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Coach */}
            <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Yeni Ekspert / Koç Təyin Et</h5>
              <div>
                <label className="admin-label">Qeydiyyatlı Üzvlər Arasından Seçin</label>
                <select
                  value={newCoachUserId}
                  onChange={(e) => {
                    const uId = e.target.value;
                    setNewCoachUserId(uId);
                    const foundUser = usersList.find(u => u.id === uId);
                    if (foundUser) {
                      setNewCoachName(foundUser.name);
                      setNewCoachTitle(foundUser.role === 'Kouç' ? 'Sertifikatlı Kouç' : 'Kouç & Ekspert');
                      setNewCoachBio(`${foundUser.name} — Monodoxia Academy fərdi inkişaf və kouçinq ekspertidir.`);
                      setNewCoachSpecialties('Fərdi İnkişaf, Şüurlu Fərqindəlik');
                    }
                  }}
                  className="admin-select"
                >
                  <option value="">-- Qeydiyyatlı Üzv Seçin (və ya aşağıda birbaşa daxil edin) --</option>
                  {usersList.map(u => {
                    const isAlreadyCoach = coachesList.some(c => c.userId === u.id || c.name === u.name);
                    return (
                      <option key={u.id} value={u.id} disabled={isAlreadyCoach}>
                        {u.name} ({u.email}) — Rol: {u.role} {isAlreadyCoach ? '✓ (Artıq Ekspertdir)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <Field label="Ad Soyad" value={newCoachName} onChange={setNewCoachName} />
              <Field label="Vəzifə / Başlıq" value={newCoachTitle} onChange={setNewCoachTitle} />
              <Field label="Bio" value={newCoachBio} onChange={setNewCoachBio} multiline />
              <ImageField label="Profil Şəkli" value={newCoachImage} onChange={setNewCoachImage} />
              <Field label="İxtisaslar (vergüllə)" value={newCoachSpecialties} onChange={setNewCoachSpecialties} />
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newCoachName.trim()) {
                      showToast('Zəhmət olmasa koçun adını qeyd edin', 'warning');
                      return;
                    }
                    addCoach({
                      userId: newCoachUserId || null,
                      name: newCoachName.trim(),
                      title: newCoachTitle || 'Kouç & Ekspert',
                      bio: newCoachBio || `${newCoachName} — Monodoxia Academy ekspertidir.`,
                      image: newCoachImage,
                      specialties: newCoachSpecialties.split(',').map(s => s.trim()).filter(Boolean)
                    });
                    setNewCoachUserId('');
                    setNewCoachName('');
                    setNewCoachTitle('');
                    setNewCoachBio('');
                    setNewCoachImage('');
                    setNewCoachSpecialties('');
                    showToast('Yeni koç uğurla əlavə edildi!', 'success');
                  }}
                  className="admin-btn-primary"
                >
                  Ekspert Təyin Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVENTS / TƏDBİRLƏR SƏHİFƏSİ */}
      {cmsBlock === 'events' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Tədbirlər Səhifəsi — Məzmun və Təqvim</h5>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>Tədbirlər səhifəsinin başlığı, üst etiketi və təqvim düyməsi mətni</p>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#fef3c7', color: '#b45309' }}>📄 Tədbirlər Səhifəsi</span>
          </div>

          <Field label="Üst Etiket (Badge)" block={cmsEvents} setBlock={setCmsEvents} fieldKey="badge" placeholder="Məs: Canlı Təqvim" />
          <Field label="Səhifə Başlığı (Title)" block={cmsEvents} setBlock={setCmsEvents} fieldKey="title" placeholder="Məs: Yaxınlaşan Tədbirlər və Masterklaslar" />
          <Field label="Təsvir (Desc)" block={cmsEvents} setBlock={setCmsEvents} fieldKey="desc" multiline rows={3} placeholder="Məs: Canlı interaktiv vebinarlar..." />
          <Field label="Təqvim Düyməsi Mətni" block={cmsEvents} setBlock={setCmsEvents} fieldKey="calendarBtnText" placeholder="Məs: Bütün Təqvim" />

          <div style={{ paddingTop: '4px' }}>
            <button onClick={() => saveBlock('events', cmsEvents)} className="admin-btn-primary">
              Tədbirlər Məzmununu Yadda Saxla
            </button>
          </div>
        </div>
      )}

      {/* COMMUNITY */}
      {cmsBlock === 'community' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>İcma Bölməsi</h5>
          <Field label="Üst Etiket" block={cmsCommunity} setBlock={setCmsCommunity} fieldKey="badge" />
          <Field label="Başlıq" block={cmsCommunity} setBlock={setCmsCommunity} fieldKey="title" />
          <Field label="Təsvir" block={cmsCommunity} setBlock={setCmsCommunity} fieldKey="desc" multiline />
          <Field label="Düymə Mətni" block={cmsCommunity} setBlock={setCmsCommunity} fieldKey="newTopicBtnText" />
          <Field
            label="Xüsusiyyət Siyahısı"
            block={cmsCommunity}
            setBlock={setCmsCommunity}
            fieldKey="bullets"
            multiline
            isArray={true}
            rows={4}
          />
          <div>
            <button onClick={() => saveBlock('community', cmsCommunity)} className="admin-btn-primary">Yadda Saxla</button>
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {cmsBlock === 'testimonials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Rəylər – Başlıq</h5>
            <Field label="Üst Etiket" block={cmsTestimonials} setBlock={setCmsTestimonials} fieldKey="badge" />
            <Field label="Başlıq" block={cmsTestimonials} setBlock={setCmsTestimonials} fieldKey="title" />
            <div>
              <button onClick={() => saveBlock('testimonials', cmsTestimonials)} className="admin-btn-primary">Yadda Saxla</button>
            </div>
          </div>

          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Mövcud Rəylər ({testimonialsList.length})</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {testimonialsList.map(item => (
                <div key={item.id} style={{ padding: '12px', background: '#f8fafc', border: editingTestimonial?.id === item.id ? '1px solid #c5a059' : '1px solid #e2e8f0', borderRadius: '8px' }}>
                  {editingTestimonial?.id === item.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>Rəyi Redaktə Et: {item.author}</span>
                        <button type="button" onClick={() => setEditingTestimonial(null)} className="admin-btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>Ləğv et</button>
                      </div>
                      <Field label="Sitat (quote) *" block={editingTestimonial} setBlock={setEditingTestimonial} fieldKey="quote" multiline />
                      <Field label="Ad Soyad (author) *" block={editingTestimonial} setBlock={setEditingTestimonial} fieldKey="author" />
                      <Field label="Vəzifə / Tələbə statusu (role)" block={editingTestimonial} setBlock={setEditingTestimonial} fieldKey="role" />
                      <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const quoteVal = editingTestimonial.quote || editingTestimonial.translations?.az?.quote || '';
                            const authorVal = editingTestimonial.author || editingTestimonial.translations?.az?.author || '';
                            if (!quoteVal.trim() || !authorVal.trim()) {
                              showToast('Zəhmət olmasa sitat və müəllif sahələrini doldurun', 'warning');
                              return;
                            }
                            const roleVal = editingTestimonial.role || editingTestimonial.translations?.az?.role || 'Tələbə';
                            const updatedItem = {
                              ...editingTestimonial,
                              quote: quoteVal.trim(),
                              author: authorVal.trim(),
                              role: roleVal.trim(),
                              translations: {
                                ...(editingTestimonial.translations || {}),
                                az: {
                                  ...(editingTestimonial.translations?.az || {}),
                                  quote: quoteVal.trim(),
                                  author: authorVal.trim(),
                                  role: roleVal.trim()
                                }
                              }
                            };
                            updateTestimonial(item.id, updatedItem);
                            setEditingTestimonial(null);
                            showToast('Rəy məlumatları və tərcümələri yeniləndi!', 'success');
                          }}
                          className="admin-btn-primary"
                        >
                          Saxla
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTestimonial(null)}
                          className="admin-btn-secondary"
                        >
                          Bağla
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.author}</span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>({item.role})</span>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
                            {langs.map(l => {
                              const hasTrans = l.code === 'az' ? Boolean(item.quote) : Boolean(item.translations?.[l.code]?.quote);
                              return (
                                <span
                                  key={l.code}
                                  title={`${l.name} (${l.code.toUpperCase()}): ${hasTrans ? 'Tərcümə mövcuddur' : 'Tərcümə edilməyib'}`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    background: hasTrans ? '#dcfce7' : '#f1f5f9',
                                    color: hasTrans ? '#15803d' : '#94a3b8'
                                  }}
                                >
                                  {l.code.toUpperCase()}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                          "{item.quote}"
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTestimonial({
                              ...item,
                              translations: {
                                az: {
                                  quote: item.translations?.az?.quote || item.quote || '',
                                  author: item.translations?.az?.author || item.author || '',
                                  role: item.translations?.az?.role || item.role || ''
                                },
                                en: {
                                  quote: item.translations?.en?.quote || '',
                                  author: item.translations?.en?.author || '',
                                  role: item.translations?.en?.role || ''
                                },
                                tr: {
                                  quote: item.translations?.tr?.quote || '',
                                  author: item.translations?.tr?.author || '',
                                  role: item.translations?.tr?.role || ''
                                },
                                ru: {
                                  quote: item.translations?.ru?.quote || '',
                                  author: item.translations?.ru?.author || '',
                                  role: item.translations?.ru?.role || ''
                                },
                                ...(item.translations || {})
                              }
                            });
                          }}
                          className="admin-btn-edit"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Redaktə Et
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete({ type: 'testimonial', item })}
                          className="admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Yeni Rəy Əlavə Et</h5>
                <span style={{ fontSize: '11px', color: '#64748b' }}>🌐 4 Dil düyməsi ilə digər dilləri daxil edə bilərsiniz</span>
              </div>
              <Field label="Sitat (quote) *" block={newTestimonial} setBlock={setNewTestimonial} fieldKey="quote" multiline />
              <Field label="Ad Soyad (author) *" block={newTestimonial} setBlock={setNewTestimonial} fieldKey="author" />
              <Field label="Vəzifə / Tələbə statusu (role)" block={newTestimonial} setBlock={setNewTestimonial} fieldKey="role" />
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const quoteVal = newTestimonial.quote || newTestimonial.translations?.az?.quote || '';
                    const authorVal = newTestimonial.author || newTestimonial.translations?.az?.author || '';
                    if (!quoteVal.trim() || !authorVal.trim()) {
                      showToast('Zəhmət olmasa sitat və müəllif sahələrini doldurun', 'warning');
                      return;
                    }
                    const roleVal = newTestimonial.role || newTestimonial.translations?.az?.role || 'Tələbə';
                    addTestimonial({
                      quote: quoteVal.trim(),
                      author: authorVal.trim(),
                      role: roleVal.trim(),
                      translations: {
                        az: {
                          quote: quoteVal.trim(),
                          author: authorVal.trim(),
                          role: roleVal.trim(),
                          ...(newTestimonial.translations?.az || {})
                        },
                        en: newTestimonial.translations?.en || {},
                        tr: newTestimonial.translations?.tr || {},
                        ru: newTestimonial.translations?.ru || {}
                      }
                    });
                    setNewTestimonial(emptyTestimonial);
                    showToast('Yeni rəy və tərcümələri əlavə edildi!', 'success');
                  }}
                  className="admin-btn-primary"
                >
                  Rəy Əlavə Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {cmsBlock === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>FAQ – Başlıq</h5>
            <Field label="Üst Etiket" block={cmsFaq} setBlock={setCmsFaq} fieldKey="badge" />
            <Field label="Başlıq" block={cmsFaq} setBlock={setCmsFaq} fieldKey="title" />
            <div>
              <button onClick={() => saveBlock('faq', cmsFaq)} className="admin-btn-primary">Yadda Saxla</button>
            </div>
          </div>

          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Mövcud Suallar ({faqsList.length})</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqsList.map(item => (
                <div key={item.id} style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  {editingFaq && editingFaq.id === item.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>Sualı Redaktə Et</span>
                        <button type="button" onClick={() => setEditingFaq(null)} className="admin-btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>Ləğv et</button>
                      </div>
                      <Field label="Sual *" block={editingFaq} setBlock={setEditingFaq} fieldKey="question" />
                      <Field label="Cavab *" block={editingFaq} setBlock={setEditingFaq} fieldKey="answer" multiline />
                      <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const qVal = editingFaq.question || editingFaq.translations?.az?.question || '';
                            const aVal = editingFaq.answer || editingFaq.translations?.az?.answer || '';
                            if (!qVal.trim() || !aVal.trim()) {
                              showToast('Zəhmət olmasa sual və cavab sahələrini doldurun', 'warning');
                              return;
                            }
                            const updatedItem = {
                              ...editingFaq,
                              question: qVal.trim(),
                              answer: aVal.trim(),
                              translations: {
                                ...(editingFaq.translations || {}),
                                az: {
                                  ...(editingFaq.translations?.az || {}),
                                  question: qVal.trim(),
                                  answer: aVal.trim()
                                }
                              }
                            };
                            updateFaq(item.id, updatedItem);
                            setEditingFaq(null);
                            showToast('Sual məlumatları və tərcümələri yeniləndi!', 'success');
                          }}
                          className="admin-btn-primary"
                        >
                          Saxla
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFaq(null)}
                          className="admin-btn-secondary"
                        >
                          Bağla
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.question}</span>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
                            {langs.map(l => {
                              const hasTrans = l.code === 'az' ? Boolean(item.question) : Boolean(item.translations?.[l.code]?.question);
                              return (
                                <span
                                  key={l.code}
                                  title={`${l.name} (${l.code.toUpperCase()}): ${hasTrans ? 'Tərcümə mövcuddur' : 'Tərcümə edilməyib'}`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    background: hasTrans ? '#dcfce7' : '#f1f5f9',
                                    color: hasTrans ? '#15803d' : '#94a3b8'
                                  }}
                                >
                                  {l.code.toUpperCase()}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                          {item.answer}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFaq({
                              ...item,
                              translations: {
                                az: {
                                  question: item.translations?.az?.question || item.question || '',
                                  answer: item.translations?.az?.answer || item.answer || ''
                                },
                                en: {
                                  question: item.translations?.en?.question || '',
                                  answer: item.translations?.en?.answer || ''
                                },
                                tr: {
                                  question: item.translations?.tr?.question || '',
                                  answer: item.translations?.tr?.answer || ''
                                },
                                ru: {
                                  question: item.translations?.ru?.question || '',
                                  answer: item.translations?.ru?.answer || ''
                                },
                                ...(item.translations || {})
                              }
                            });
                          }}
                          className="admin-btn-edit"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Redaktə Et
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemToDelete({ type: 'faq', item })}
                          className="admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '11px' }}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Yeni Sual Əlavə Et</h5>
                <span style={{ fontSize: '11px', color: '#64748b' }}>🌐 4 Dil düyməsi ilə digər dilləri daxil edə bilərsiniz</span>
              </div>
              <Field label="Sual *" block={newFaq} setBlock={setNewFaq} fieldKey="question" />
              <Field label="Cavab *" block={newFaq} setBlock={setNewFaq} fieldKey="answer" multiline />
              <div>
                <button
                  type="button"
                  onClick={() => {
                    const qVal = newFaq.question || newFaq.translations?.az?.question || '';
                    const aVal = newFaq.answer || newFaq.translations?.az?.answer || '';
                    if (!qVal.trim() || !aVal.trim()) {
                      showToast('Zəhmət olmasa sual və cavab sahələrini doldurun', 'warning');
                      return;
                    }
                    addFaq({
                      question: qVal.trim(),
                      answer: aVal.trim(),
                      translations: {
                        az: {
                          question: qVal.trim(),
                          answer: aVal.trim(),
                          ...(newFaq.translations?.az || {})
                        },
                        en: newFaq.translations?.en || {},
                        tr: newFaq.translations?.tr || {},
                        ru: newFaq.translations?.ru || {}
                      }
                    });
                    setNewFaq(emptyFaq);
                    showToast('Yeni sual və tərcümələri əlavə edildi!', 'success');
                  }}
                  className="admin-btn-primary"
                >
                  Sual Əlavə Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEWSLETTER */}
      {cmsBlock === 'newsletter' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Bülletenə Abunəlik Bölməsi</h5>
          <Field label="Üst Etiket" block={cmsNewsletter} setBlock={setCmsNewsletter} fieldKey="badge" />
          <Field label="Başlıq" block={cmsNewsletter} setBlock={setCmsNewsletter} fieldKey="title" />
          <Field label="Təsvir" block={cmsNewsletter} setBlock={setCmsNewsletter} fieldKey="desc" multiline />
          <Field label="Placeholder (email)" block={cmsNewsletter} setBlock={setCmsNewsletter} fieldKey="placeholder" />
          <Field label="Düymə Mətni" block={cmsNewsletter} setBlock={setCmsNewsletter} fieldKey="btnText" />
          <Field label="Disclaimer mətni" block={cmsNewsletter} setBlock={setCmsNewsletter} fieldKey="disclaimer" />
          <div>
            <button onClick={() => saveBlock('newsletter', cmsNewsletter)} className="admin-btn-primary">Yadda Saxla</button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      {cmsBlock === 'footer' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Footer Bölməsi</h5>
          <ImageField label="Footer Loqo Şəkli" value={cmsFooter.logoUrl} onChange={v => setCmsFooter(p => ({ ...p, logoUrl: v }))} />
          <Field label="Təsvir (desc)" block={cmsFooter} setBlock={setCmsFooter} fieldKey="desc" multiline />
          <Field label="Ünvan" block={cmsFooter} setBlock={setCmsFooter} fieldKey="address" />
          <Field label="E-poçt" block={cmsFooter} setBlock={setCmsFooter} fieldKey="email" />
          <Field label="Telefon" block={cmsFooter} setBlock={setCmsFooter} fieldKey="phone" />
          <Field label="Copyright mətni" block={cmsFooter} setBlock={setCmsFooter} fieldKey="copyright" />
          <div>
            <button onClick={() => saveBlock('footer', cmsFooter)} className="admin-btn-primary">Yadda Saxla</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(itemToDelete)}
        title={
          itemToDelete?.type === 'coach'
            ? 'Koçu Silmək İstəyirsiniz?'
            : itemToDelete?.type === 'pillar'
            ? 'Məram Kartını Silmək İstəyirsiniz?'
            : itemToDelete?.type === 'testimonial'
            ? 'Rəyi Silmək İstəyirsiniz?'
            : 'Sualı Silmək İstəyirsiniz?'
        }
        message="Bu elementi silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarılmır."
        itemName={
          itemToDelete?.item?.name ||
          itemToDelete?.item?.title ||
          itemToDelete?.item?.author ||
          itemToDelete?.item?.question ||
          ''
        }
        onConfirm={confirmDeleteAction}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
    </CmsFieldContext.Provider>
  );
}

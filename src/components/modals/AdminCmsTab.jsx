import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import AdminConfirmModal from './AdminConfirmModal';

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
    { id: 'hero', label: 'Hero Bölməsi' },
    { id: 'about', label: 'Akademiyanın Məramı' },
    { id: 'areas', label: 'Fundamental Sahələr' },
    { id: 'academy', label: 'Akademiya' },
    { id: 'club', label: 'Klub' },
    { id: 'coaches', label: 'Koçlar' },
    { id: 'community', label: 'İcma' },
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

  // FAQ add states
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

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

  // Reusable Field Component
  const Field = ({
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
  }) => {
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
  const ImageField = ({ label, value, onChange }) => {
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

  return (
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
      {cmsBlock === 'hero' && (
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>Hero Bölməsi</h5>
          <Field label="Üst Etiket" block={cmsHero} setBlock={setCmsHero} fieldKey="badge" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Field label="Başlıq Sətir 1" block={cmsHero} setBlock={setCmsHero} fieldKey="title1" />
            <Field label="Başlıq Sətir 2 (İtalik)" block={cmsHero} setBlock={setCmsHero} fieldKey="title2" />
            <Field label="Başlıq Sətir 3" block={cmsHero} setBlock={setCmsHero} fieldKey="title3" />
          </div>
          <Field label="Təsvir (desc)" block={cmsHero} setBlock={setCmsHero} fieldKey="desc" multiline />
          <ImageField
            label="Hero Sağ Əsas Şəkil"
            value={cmsHero.image}
            onChange={v => setCmsHero(p => ({ ...p, image: v }))}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Field label="Şəkil Üzərində Sitat" block={cmsHero} setBlock={setCmsHero} fieldKey="quote" />
            <Field label="Sitat Alt Yazısı" block={cmsHero} setBlock={setCmsHero} fieldKey="quoteSub" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Field label="Əsas Düymə Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="btnPrimaryText" />
            <Field label="Əsas Düymə Linki" block={cmsHero} setBlock={setCmsHero} fieldKey="btnPrimaryLink" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Field label="İkinci Düymə Mətni" block={cmsHero} setBlock={setCmsHero} fieldKey="btnSecondaryText" />
            <Field label="İkinci Düymə Linki" block={cmsHero} setBlock={setCmsHero} fieldKey="btnSecondaryLink" />
          </div>
          <div>
            <button onClick={() => saveBlock('hero', cmsHero)} className="admin-btn-primary">Yadda Saxla</button>
          </div>
        </div>
      )}

      {/* AKADEMİYANIN MƏRAMI (ABOUT) */}
      {cmsBlock === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Əsas Mətn və Şəkil */}
          <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Akademiyanın Məramı – Əsas Mətn və Şəkil</h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Ana səhifənin sol tərəfindəki şəkil və mərkəzi başlıq mətnləri</p>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>Ana Səhifə</span>
            </div>
            <Field label="Üst Etiket (Badge)" block={cmsAbout} setBlock={setCmsAbout} fieldKey="badge" />
            <Field label="Əsas Başlıq" block={cmsAbout} setBlock={setCmsAbout} fieldKey="title" />
            <Field label="Mətn (desc)" block={cmsAbout} setBlock={setCmsAbout} fieldKey="desc" multiline rows={4} />
            <ImageField
              label="Haqqımızda / Məram Şəkli"
              value={cmsAbout.image}
              onChange={v => setCmsAbout(p => ({ ...p, image: v }))}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <Field label="Şəkil Sol Etiketi" block={cmsAbout} setBlock={setCmsAbout} fieldKey="imageBadgeLeft" />
              <Field label="Şəkil Sağ Etiketi" block={cmsAbout} setBlock={setCmsAbout} fieldKey="imageBadgeRight" />
            </div>
            <div>
              <button onClick={saveAboutWithPillars} className="admin-btn-primary">Yadda Saxla</button>
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
      )}

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
                <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', gap: '10px' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{item.question}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>{item.answer}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setItemToDelete({ type: 'faq', item })}
                    className="admin-btn-danger"
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Yeni Sual Əlavə Et</h5>
              <Field label="Sual *" value={newFaqQuestion} onChange={setNewFaqQuestion} />
              <Field label="Cavab *" value={newFaqAnswer} onChange={setNewFaqAnswer} multiline />
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
                      showToast('Zəhmət olmasa sual və cavab sahələrini doldurun', 'warning');
                      return;
                    }
                    addFaq({ question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() });
                    setNewFaqQuestion('');
                    setNewFaqAnswer('');
                    showToast('Sual əlavə edildi!', 'success');
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
  );
}

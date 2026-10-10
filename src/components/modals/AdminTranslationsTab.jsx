import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { MultiLangEditor, LocalizedArrayField } from '../../i18n/TranslationComponents';
import { getTranslationStatus, copyFromDefaultLanguage } from '../../i18n/localize';

export default function AdminTranslationsTab() {
  const {
    usersList = [],
    updateUser,
    coursesList = [],
    updateCourse,
    clubTiersList = [],
    updateClubTier,
    eventsList = [],
    updateEvent,
    coachesList = [],
    updateCoach,
    testimonialsList = [],
    updateTestimonial,
    faqsList = [],
    updateFaq,
    areasList = [],
    updateArea,
    communityTopics = [],
    updateTopic,
    rolesList = [],
    updateRole,
    showToast
  } = useApp();

  const { defaultLang, supportedLangs = [], setSupportedLangs } = useLanguage();

  const [transEntity, setTransEntity] = useState('courses');
  const [transSelectedId, setTransSelectedId] = useState(null);
  const [transActiveLang, setTransActiveLang] = useState('en');
  const [searchFilter, setSearchFilter] = useState('');

  const entities = [
    { id: 'roles', label: 'Rollar & Səlahiyyətlər (RBAC)', count: rolesList.length },
    { id: 'club', label: 'Coaching Club Tiers', count: clubTiersList.length },
    { id: 'users', label: 'İstifadəçilər & Profillər', count: usersList.length },
    { id: 'courses', label: 'Kurslar & LMS', count: coursesList.length },
    { id: 'events', label: 'Tədbirlər & Vebinarlar', count: eventsList.length },
    { id: 'coaches', label: 'Mentorlar & Kouçlar', count: coachesList.length },
    { id: 'testimonials', label: 'Rəylər (Testimonials)', count: testimonialsList.length },
    { id: 'faqs', label: 'FAQ Sualları', count: faqsList.length },
    { id: 'areas', label: 'İnkişaf Sahələri (8)', count: areasList.length },
    { id: 'community', label: 'İcma Mövzuları', count: communityTopics.length }
  ];

  // Entity field configurations
  const entityFieldConfigs = {
    roles: [
      { key: 'name', label: 'Rolun Adı', required: true },
      { key: 'description', label: 'Rolun Təsviri & Məqsədi', type: 'textarea' }
    ],
    users: [
      { key: 'name', label: 'Ad və Soyad', required: true },
      { key: 'role', label: 'Rol & Səlahiyyət' },
      { key: 'tier', label: 'Abunəlik Paketi' },
      { key: 'notes', label: 'Admin Qeydləri', type: 'textarea' }
    ],
    courses: [
      { key: 'title', label: 'Kursun Adı', required: true },
      { key: 'description', label: 'Təsvir', type: 'textarea' },
      { key: 'price', label: 'Qiymət' },
      { key: 'badge', label: 'Etiket / Nişan (Badge)' },
      { key: 'status', label: 'Status Mətni' }
    ],
    club: [
      { key: 'name', label: 'Tarifin Adı', required: true },
      { key: 'price', label: 'Qiymət (mətn / valyuta)' },
      { key: 'period', label: 'Müddət (Məs: / aylıq)' },
      { key: 'features', label: 'İmtiyazlar (sətirbəsətir)', type: 'textarea', isArray: true }
    ],
    events: [
      { key: 'title', label: 'Tədbir Başlığı', required: true },
      { key: 'desc', label: 'Tədbir Təsviri', type: 'textarea' },
      { key: 'speaker', label: 'Spiker' },
      { key: 'datetime', label: 'Tarix və Saat' },
      { key: 'typeBadge', label: 'Növ Nişanı (Məs: CANLI VEBİNAR)' }
    ],
    coaches: [
      { key: 'title', label: 'Kouç Vəzifəsi / Titul', required: true },
      { key: 'bio', label: 'Haqqında (Bio)', type: 'textarea' }
    ],
    testimonials: [
      { key: 'quote', label: 'Rəy Mətni', type: 'textarea', required: true },
      { key: 'role', label: 'Müəllifin Peşəsi / Rolu' }
    ],
    faqs: [
      { key: 'question', label: 'Sual', required: true },
      { key: 'answer', label: 'Cavab', type: 'textarea', required: true }
    ],
    areas: [
      { key: 'number', label: 'Nömrə / Kod (Məs: 01 / SAHƏ)' },
      { key: 'title', label: 'Sahə Adı', required: true },
      { key: 'desc', label: 'İzah / Təsvir', type: 'textarea' }
    ],
    community: [
      { key: 'badge', label: 'Mövzu Kateqoriyası' },
      { key: 'title', label: 'Başlıq', required: true },
      { key: 'snippet', label: 'Qısa Mətn', type: 'textarea' },
      { key: 'author', label: 'Müəllif' }
    ]
  };

  // Get active entity items
  let currentItems = [];
  if (transEntity === 'roles') currentItems = rolesList;
  else if (transEntity === 'users') currentItems = usersList;
  else if (transEntity === 'courses') currentItems = coursesList;
  else if (transEntity === 'club') currentItems = clubTiersList;
  else if (transEntity === 'events') currentItems = eventsList;
  else if (transEntity === 'coaches') currentItems = coachesList;
  else if (transEntity === 'testimonials') currentItems = testimonialsList;
  else if (transEntity === 'faqs') currentItems = faqsList;
  else if (transEntity === 'areas') currentItems = areasList;
  else if (transEntity === 'community') currentItems = communityTopics;

  const filteredItems = useMemo(() => {
    if (!searchFilter.trim()) return currentItems;
    const q = searchFilter.toLowerCase();
    return currentItems.filter(item => {
      const title = item.title || item.name || item.question || item.author || item.id || '';
      return String(title).toLowerCase().includes(q);
    });
  }, [currentItems, searchFilter]);

  const selectedItem = currentItems.find(i => i.id === transSelectedId) || filteredItems[0] || null;
  const fields = entityFieldConfigs[transEntity] || [];
  const transObj = selectedItem?.translations || {};

  const handleTransFieldChange = (langCode, fieldKey, value) => {
    if (!selectedItem) return;
    const updatedTranslations = {
      ...transObj,
      [langCode]: {
        ...(transObj[langCode] || {}),
        [fieldKey]: value
      }
    };

    if (transEntity === 'roles') updateRole(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'users') updateUser(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'courses') updateCourse(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'club') updateClubTier(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'events') updateEvent(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'coaches') updateCoach(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'testimonials') updateTestimonial(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'faqs') updateFaq(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'areas') updateArea(selectedItem.id, { translations: updatedTranslations });
    else if (transEntity === 'community') updateTopic(selectedItem.id, { translations: updatedTranslations });
  };

  const handleCopyFromDefault = () => {
    if (!selectedItem) return;
    const copied = copyFromDefaultLanguage(selectedItem, fields.map(f => f.key), transActiveLang, defaultLang);
    if (transEntity === 'roles') updateRole(selectedItem.id, { translations: copied });
    else if (transEntity === 'users') updateUser(selectedItem.id, { translations: copied });
    else if (transEntity === 'courses') updateCourse(selectedItem.id, { translations: copied });
    else if (transEntity === 'club') updateClubTier(selectedItem.id, { translations: copied });
    else if (transEntity === 'events') updateEvent(selectedItem.id, { translations: copied });
    else if (transEntity === 'coaches') updateCoach(selectedItem.id, { translations: copied });
    else if (transEntity === 'testimonials') updateTestimonial(selectedItem.id, { translations: copied });
    else if (transEntity === 'faqs') updateFaq(selectedItem.id, { translations: copied });
    else if (transEntity === 'areas') updateArea(selectedItem.id, { translations: copied });
    else if (transEntity === 'community') updateTopic(selectedItem.id, { translations: copied });
    showToast(`AZ mətnləri ${transActiveLang.toUpperCase()} dilinə nüsxələndi!`, 'success');
  };

  const statusMap = selectedItem ? getTranslationStatus(selectedItem, fields.map(f => f.key), supportedLangs) : {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <h4 className="admin-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#b45309' }}>translate</span>
            <span>Dinamik Məzmun Çevriləri (Kurslar, Tədbirlər, Klub və s.)</span>
          </h4>
          <p className="admin-section-subtitle">
            Dinamik kursları, tədbirləri, kouçları, tarifləri və rəyləri AZ, EN, TR, RU dillərinə tərcümə edin
          </p>
        </div>

        {/* Language management badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {(supportedLangs || []).map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                const updated = supportedLangs.map(lang => 
                  lang.code === l.code ? { ...lang, active: !lang.active } : lang
                );
                setSupportedLangs(updated);
                showToast(`${l.name} (${l.code.toUpperCase()}) statusu dəyişdirildi`, 'info');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: l.active ? '1px solid #d4af37' : '1px solid #cbd5e1',
                background: l.active ? '#fffbeb' : '#ffffff',
                color: l.active ? '#b45309' : '#64748b',
                transition: 'all 0.15s ease'
              }}
              title={l.active ? 'Klikləyin: Deaktiv et' : 'Klikləyin: Aktiv et'}
            >
              <span>{l.flag}</span>
              <span style={{ textTransform: 'uppercase' }}>{l.code}</span>
              <span style={{ fontSize: '10px', color: l.active ? '#15803d' : '#dc2626' }}>{l.active ? '✓' : '✗'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Entity Selector Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {entities.map(e => (
          <button
            key={e.id}
            type="button"
            onClick={() => {
              setTransEntity(e.id);
              setTransSelectedId(null);
              setSearchFilter('');
            }}
            className={`admin-cms-pill ${transEntity === e.id ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{e.label}</span>
            <span style={{
              fontSize: '9px',
              padding: '1px 6px',
              borderRadius: '10px',
              background: transEntity === e.id ? 'rgba(180,83,9,0.15)' : '#f1f5f9',
              color: transEntity === e.id ? '#b45309' : '#64748b'
            }}>
              {e.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Translation Work Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '20px' }}>
        {/* Items List (Left Column) */}
        <div className="admin-card" style={{ padding: '12px', maxHeight: '600px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>
              Element Seçin ({filteredItems.length})
            </span>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Element axtar..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="admin-input"
              style={{ padding: '6px 10px', fontSize: '11px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
            {filteredItems.map(item => {
              const isSelected = selectedItem && selectedItem.id === item.id;
              const itemTitle = item.title || item.name || item.question || item.author || item.id;
              const itemStatus = getTranslationStatus(item, fields.map(f => f.key), supportedLangs);

              return (
                <div
                  key={item.id}
                  onClick={() => setTransSelectedId(item.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isSelected ? '1px solid #c5a059' : '1px solid #e2e8f0',
                    background: isSelected ? '#fffbeb' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#0f172a' : '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {itemTitle}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
                    {(supportedLangs || []).filter(l => l.active).map(l => {
                      const st = itemStatus[l.code]?.status || 'missing';
                      const color = st === 'complete' ? '#22c55e' : (st === 'partial' ? '#eab308' : '#f87171');
                      return (
                        <span key={l.code} style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b' }} title={`${l.code.toUpperCase()}: ${st}`}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
                          <span style={{ textTransform: 'uppercase', fontSize: '9px' }}>{l.code}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Translation Form (Right Column) */}
        <div className="admin-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '320px' }}>
          {selectedItem ? (
            <>
              {/* Item Title and Quick Copy Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#b45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {transEntity.toUpperCase()} • ID: {selectedItem.id}
                  </span>
                  <h5 style={{ fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#0f172a', margin: '2px 0 0 0' }}>
                    {selectedItem.title || selectedItem.name || selectedItem.question || selectedItem.author || selectedItem.id}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={handleCopyFromDefault}
                  className="admin-btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Əsas dil (AZ) mətnlərini seçilmiş dilə köçür"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>content_copy</span>
                  <span>AZ-dan köçür ({transActiveLang.toUpperCase()})</span>
                </button>
              </div>

              {/* MultiLangEditor component */}
              <MultiLangEditor
                activeLang={transActiveLang}
                onLangChange={setTransActiveLang}
                fields={fields}
                translations={transObj}
                onTranslationChange={handleTransFieldChange}
                statusMap={statusMap}
                supportedLanguages={supportedLangs}
              />

              {/* Club features array special handling */}
              {transEntity === 'club' && (
                <div style={{ paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <LocalizedArrayField
                    label="Tarif İmtiyazları (Features List)"
                    fieldKey="features"
                    lang={transActiveLang}
                    translations={transObj}
                    onChange={handleTransFieldChange}
                  />
                </div>
              )}

              {/* Coaches specialties array special handling */}
              {transEntity === 'coaches' && (
                <div style={{ paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <LocalizedArrayField
                    label="İxtisas Sahələri (Specialties)"
                    fieldKey="specialties"
                    lang={transActiveLang}
                    translations={transObj}
                    onChange={handleTransFieldChange}
                  />
                </div>
              )}

              <div style={{ paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                <span>Dəyişikliklər avtomatik yadda saxlanılır və real vaxtda tətbiq olunur.</span>
                <span style={{ color: '#15803d', fontWeight: 600 }}>✓ Avto-sinxron aktivdir</span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b', fontSize: '13px' }}>
              Tərcümə etmək üçün soldakı siyahıdan bir element seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

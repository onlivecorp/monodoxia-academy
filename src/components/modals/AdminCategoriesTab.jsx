import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AdminCategoriesTab() {
  const {
    categoriesList = [],
    addCategory,
    updateCategory,
    deleteCategory,
    coursesList = [],
    eventsList = [],
    communityTopics = [],
    showToast
  } = useApp();

  const { supportedLangs = [] } = useLanguage();

  // Normalize supported languages safely whether string or object
  const langList = (supportedLangs && supportedLangs.length > 0 ? supportedLangs : ['az', 'en', 'tr', 'ru']).map(l => {
    if (typeof l === 'string') {
      return { code: l, name: l.toUpperCase(), flag: '' };
    }
    return {
      code: l.code || 'az',
      name: l.name || (l.code || 'az').toUpperCase(),
      flag: l.flag || ''
    };
  });

  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCatLangTab, setNewCatLangTab] = useState('az');
  const [editCatLangTab, setEditCatLangTab] = useState('az');

  const emptyCatForm = {
    key: '',
    name: '',
    type: 'course',
    icon: 'category',
    translations: {
      az: { name: '', desc: '' },
      en: { name: '', desc: '' },
      tr: { name: '', desc: '' },
      ru: { name: '', desc: '' }
    }
  };

  const [newCategoryForm, setNewCategoryForm] = useState(emptyCatForm);

  const getUsageCount = (cat) => {
    if (!cat) return 0;
    const courseCount = (coursesList || []).filter(c => c.category === cat.key).length;
    const eventCount = (eventsList || []).filter(e => e.typeBadge === cat.key || e.category === cat.key).length;
    const topicCount = (communityTopics || []).filter(t => t.badge === cat.name || t.category === cat.key).length;
    return courseCount + eventCount + topicCount;
  };

  const safeCategories = Array.isArray(categoriesList) ? categoriesList : [];

  const filteredCategories = safeCategories.filter(cat => {
    const matchesType = filterType === 'all' || cat.type === filterType || cat.type === 'all';
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesType;
    const nameMatch = (cat.name || '').toLowerCase().includes(q);
    const keyMatch = (cat.key || '').toLowerCase().includes(q);
    const transMatch = Object.values(cat.translations || {}).some(
      t => (t?.name || '').toLowerCase().includes(q) || (t?.desc || '').toLowerCase().includes(q)
    );
    return matchesType && (nameMatch || keyMatch || transMatch);
  });

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCategoryForm.name.trim()) {
      if (showToast) showToast('Zəhmət olmasa kateqoriya adını daxil edin', 'error');
      return;
    }
    const rawKey = newCategoryForm.key || newCategoryForm.name;
    const finalKey = rawKey.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');

    const translations = {
      az: {
        name: newCategoryForm.translations?.az?.name || newCategoryForm.name,
        desc: newCategoryForm.translations?.az?.desc || ''
      },
      en: {
        name: newCategoryForm.translations?.en?.name || '',
        desc: newCategoryForm.translations?.en?.desc || ''
      },
      tr: {
        name: newCategoryForm.translations?.tr?.name || '',
        desc: newCategoryForm.translations?.tr?.desc || ''
      },
      ru: {
        name: newCategoryForm.translations?.ru?.name || '',
        desc: newCategoryForm.translations?.ru?.desc || ''
      }
    };

    if (addCategory) {
      addCategory({
        ...newCategoryForm,
        key: finalKey,
        translations
      });
    }

    setNewCategoryForm(emptyCatForm);
    setNewCategoryOpen(false);
  };

  const handleSaveEditCategory = (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      if (showToast) showToast('Kateqoriya adı boş ola bilməz', 'error');
      return;
    }

    const translations = {
      ...editingCategory.translations,
      az: {
        name: editingCategory.translations?.az?.name || editingCategory.name,
        desc: editingCategory.translations?.az?.desc || ''
      }
    };

    if (updateCategory) {
      updateCategory(editingCategory.id, {
        ...editingCategory,
        translations
      });
    }

    setEditingCategory(null);
  };

  const handleDeleteCategory = (cat) => {
    const usage = getUsageCount(cat);
    if (usage > 0) {
      if (!window.confirm(`Bu kateqoriya hazırda ${usage} aktiv elementdə istifadə olunur. Yenə də silmək istəyirsiniz?`)) {
        return;
      }
    } else {
      if (!window.confirm(`"${cat.name}" kateqoriyasını silmək istədiyinizdən əminsiniz?`)) {
        return;
      }
    }
    if (deleteCategory) {
      deleteCategory(cat.id);
    }
  };

  const typeLabels = {
    all: 'Ümumi',
    course: 'Kurslar & Təlimlər',
    event: 'Tədbirlər & Vebinarlar',
    community: 'İcma & Forum'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#b45309' }}>category</span>
            <h4 className="admin-section-title" style={{ margin: 0 }}>Mərkəzləşdirilmiş Kateqoriyalar & Taksonomiya</h4>
          </div>
          <p className="admin-section-subtitle" style={{ marginTop: '4px' }}>
            Kurs, tədbir və icma kateqoriyalarını bir yerdən idarə edin. Çoxdilli tərcümələr avtomatik tətbiq olunur, təkrar manual daxiletmə tələb edilmir.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setNewCategoryOpen(!newCategoryOpen)}
            className="admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {newCategoryOpen ? 'close' : 'add'}
            </span>
            <span>{newCategoryOpen ? 'Formu Bağla' : 'Yeni Kateqoriya Əlavə Et'}</span>
          </button>
        </div>
      </div>

      {/* Info Notice */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(197, 160, 89, 0.08)',
        border: '1px solid rgba(197, 160, 89, 0.25)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '22px', flexShrink: 0 }}>
          auto_awesome
        </span>
        <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
          <strong>Avtomatik Tərcümə İnteqrasiyası:</strong> Burada təyin etdiyiniz kateqoriya adları və tərcümələri (AZ, EN, TR, RU) istifadəçi saytın dilini dəyişdikdə kurs və tədbir kartlarında birbaşa avtomatik əks olunur. Kurs redaktə edərkən kateqoriyanı hər dil üçün təkrar-təkrar yazmağa ehtiyac yoxdur.
        </div>
      </div>

      {/* NEW CATEGORY FORM PANEL */}
      {newCategoryOpen && (
        <form onSubmit={handleCreateCategory} className="admin-edit-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(197,160,89,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>add_circle</span>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Yeni Kateqoriya Yarat
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setNewCategoryOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Kateqoriya Adı (Əsas / AZ) *</label>
              <input
                type="text"
                required
                placeholder="Məs: Şüuraltı və Hipnoz"
                value={newCategoryForm.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoKey = val.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
                  setNewCategoryForm({
                    ...newCategoryForm,
                    name: val,
                    key: newCategoryForm.key || autoKey,
                    translations: {
                      ...newCategoryForm.translations,
                      az: { ...newCategoryForm.translations.az, name: val }
                    }
                  });
                }}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Sistem Açarı (Slug / ID) *</label>
              <input
                type="text"
                required
                placeholder="hypnosis-mindset"
                value={newCategoryForm.key}
                onChange={(e) => setNewCategoryForm({ ...newCategoryForm, key: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                className="admin-input"
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label className="admin-label">Hədəf Bölmə (Tip)</label>
              <select
                value={newCategoryForm.type}
                onChange={(e) => setNewCategoryForm({ ...newCategoryForm, type: e.target.value })}
                className="admin-select"
              >
                <option value="course">Kurslar & Təlimlər</option>
                <option value="event">Tədbirlər & Vebinarlar</option>
                <option value="community">İcma & Forum</option>
                <option value="all">Bütün Bölmələr (Universal)</option>
              </select>
            </div>

            <div>
              <label className="admin-label">İkon (Material Icon)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="psychology, school, forest"
                  value={newCategoryForm.icon}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, icon: e.target.value })}
                  className="admin-input"
                />
                <div style={{
                  width: '38px',
                  height: '38px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>
                    {newCategoryForm.icon || 'category'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Multilingual Tabs */}
          <div style={{ marginTop: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#fafafa' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Çoxdilli Tərcümələr (AZ · EN · TR · RU)
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {langList.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setNewCatLangTab(lang.code)}
                    style={{
                      padding: '3px 9px',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: '1px solid',
                      cursor: 'pointer',
                      borderColor: newCatLangTab === lang.code ? '#b45309' : '#cbd5e1',
                      background: newCatLangTab === lang.code ? '#b45309' : '#ffffff',
                      color: newCatLangTab === lang.code ? '#ffffff' : '#475569'
                    }}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="admin-label">
                  [{newCatLangTab.toUpperCase()}] Kateqoriya Adı
                </label>
                <input
                  type="text"
                  placeholder={`Adı (${newCatLangTab.toUpperCase()})`}
                  value={newCategoryForm.translations?.[newCatLangTab]?.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategoryForm({
                      ...newCategoryForm,
                      translations: {
                        ...newCategoryForm.translations,
                        [newCatLangTab]: {
                          ...newCategoryForm.translations?.[newCatLangTab],
                          name: val
                        }
                      }
                    });
                  }}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">
                  [{newCatLangTab.toUpperCase()}] Təsvir / Qısa İzah
                </label>
                <input
                  type="text"
                  placeholder={`Qısa izah (${newCatLangTab.toUpperCase()})`}
                  value={newCategoryForm.translations?.[newCatLangTab]?.desc || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewCategoryForm({
                      ...newCategoryForm,
                      translations: {
                        ...newCategoryForm.translations,
                        [newCatLangTab]: {
                          ...newCategoryForm.translations?.[newCatLangTab],
                          desc: val
                        }
                      }
                    });
                  }}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
            <button type="submit" className="admin-btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
              <span>Kateqoriyanı Yarat və Yadda Saxla</span>
            </button>
            <button
              type="button"
              onClick={() => setNewCategoryOpen(false)}
              className="admin-btn-secondary"
            >
              Ləğv Et
            </button>
          </div>
        </form>
      )}

      {/* EDIT CATEGORY MODAL / PANEL */}
      {editingCategory && (
        <form onSubmit={handleSaveEditCategory} className="admin-edit-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#fefce8', borderColor: '#fef08a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(197,160,89,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>edit</span>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Kateqoriyanı Redaktə Et: <span style={{ color: '#b45309' }}>"{editingCategory.name}"</span>
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Əsas Ad (AZ) *</label>
              <input
                type="text"
                required
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label className="admin-label">Sistem Açarı (Slug)</label>
              <input
                type="text"
                required
                value={editingCategory.key}
                onChange={(e) => setEditingCategory({ ...editingCategory, key: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                className="admin-input"
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <div>
              <label className="admin-label">Hədəf Bölmə</label>
              <select
                value={editingCategory.type}
                onChange={(e) => setEditingCategory({ ...editingCategory, type: e.target.value })}
                className="admin-select"
              >
                <option value="course">Kurslar & Təlimlər</option>
                <option value="event">Tədbirlər & Vebinarlar</option>
                <option value="community">İcma & Forum</option>
                <option value="all">Bütün Bölmələr</option>
              </select>
            </div>

            <div>
              <label className="admin-label">İkon</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="text"
                  value={editingCategory.icon}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="admin-input"
                />
                <div style={{
                  width: '38px',
                  height: '38px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>
                    {editingCategory.icon || 'category'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Multilingual Tabs */}
          <div style={{ marginTop: '8px', border: '1px solid #fef08a', borderRadius: '8px', padding: '12px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Tərcümələr: [{editCatLangTab.toUpperCase()}]
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {langList.map(lang => {
                  const hasName = Boolean(editingCategory.translations?.[lang.code]?.name);
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setEditCatLangTab(lang.code)}
                      style={{
                        padding: '3px 9px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: '1px solid',
                        cursor: 'pointer',
                        borderColor: editCatLangTab === lang.code ? '#b45309' : '#cbd5e1',
                        background: editCatLangTab === lang.code ? '#b45309' : (hasName ? '#dcfce7' : '#ffffff'),
                        color: editCatLangTab === lang.code ? '#ffffff' : (hasName ? '#15803d' : '#475569')
                      }}
                    >
                      {lang.code.toUpperCase()} {hasName ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="admin-label">
                  [{editCatLangTab.toUpperCase()}] Kateqoriya Adı
                </label>
                <input
                  type="text"
                  placeholder={`Adı (${editCatLangTab.toUpperCase()})`}
                  value={editingCategory.translations?.[editCatLangTab]?.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingCategory({
                      ...editingCategory,
                      translations: {
                        ...editingCategory.translations,
                        [editCatLangTab]: {
                          ...editingCategory.translations?.[editCatLangTab],
                          name: val
                        }
                      }
                    });
                  }}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">
                  [{editCatLangTab.toUpperCase()}] Təsvir / Açıqlama
                </label>
                <input
                  type="text"
                  placeholder={`Qısa izah (${editCatLangTab.toUpperCase()})`}
                  value={editingCategory.translations?.[editCatLangTab]?.desc || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingCategory({
                      ...editingCategory,
                      translations: {
                        ...editingCategory.translations,
                        [editCatLangTab]: {
                          ...editingCategory.translations?.[editCatLangTab],
                          desc: val
                        }
                      }
                    });
                  }}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
            <button type="submit" className="admin-btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
              <span>Dəyişiklikləri Yadda Saxla</span>
            </button>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="admin-btn-secondary"
            >
              Ləğv Et
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Bütün (${safeCategories.length})` },
            { id: 'course', label: `Kurslar (${safeCategories.filter(c => c.type === 'course' || c.type === 'all').length})` },
            { id: 'event', label: `Tədbirlər (${safeCategories.filter(c => c.type === 'event' || c.type === 'all').length})` },
            { id: 'community', label: `İcma (${safeCategories.filter(c => c.type === 'community' || c.type === 'all').length})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: filterType === f.id ? '#b45309' : '#cbd5e1',
                background: filterType === f.id ? '#b45309' : '#ffffff',
                color: filterType === f.id ? '#ffffff' : '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Kateqoriya axtar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          />
        </div>
      </div>

      {/* Categories Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {filteredCategories.map(cat => {
          const usage = getUsageCount(cat);
          return (
            <div
              key={cat.id}
              className="admin-card"
              style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                border: editingCategory?.id === cat.id ? '2px solid #b45309' : '1px solid #e2e8f0',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Top Row: Icon + Type badge + Usage */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(197, 160, 89, 0.12)',
                      border: '1px solid rgba(197, 160, 89, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>
                        {cat.icon || 'category'}
                      </span>
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                        {cat.name}
                      </h5>
                      <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                        key: {cat.key}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: cat.type === 'course' ? '#dbeafe' : (cat.type === 'event' ? '#fef3c7' : '#f3e8ff'),
                    color: cat.type === 'course' ? '#1e40af' : (cat.type === 'event' ? '#92400e' : '#6b21a8')
                  }}>
                    {typeLabels[cat.type] || cat.type}
                  </span>
                </div>

                {/* Multilingual Readiness Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {langList.map(lang => {
                    const transName = cat.translations?.[lang.code]?.name;
                    const hasTrans = Boolean(transName);
                    return (
                      <span
                        key={lang.code}
                        title={hasTrans ? `${lang.name}: ${transName}` : `${lang.name} tərcüməsi yoxdur`}
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: hasTrans ? '#dcfce7' : '#f1f5f9',
                          color: hasTrans ? '#15803d' : '#94a3b8',
                          border: `1px solid ${hasTrans ? '#bbf7d0' : '#e2e8f0'}`
                        }}
                      >
                        {lang.code.toUpperCase()} {hasTrans ? '✓' : '—'}
                      </span>
                    );
                  })}
                </div>

                {/* Translation Name Previews */}
                <div style={{
                  fontSize: '11px',
                  color: '#475569',
                  background: '#f8fafc',
                  padding: '8px',
                  borderRadius: '6px',
                  marginTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  <div><strong>EN:</strong> {cat.translations?.en?.name || <em style={{ color: '#94a3b8' }}>tərcüməsiz</em>}</div>
                  <div><strong>TR:</strong> {cat.translations?.tr?.name || <em style={{ color: '#94a3b8' }}>tərcüməsiz</em>}</div>
                  <div><strong>RU:</strong> {cat.translations?.ru?.name || <em style={{ color: '#94a3b8' }}>tərcüməsiz</em>}</div>
                </div>
              </div>

              {/* Bottom Row: Usage & Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {usage > 0 ? (
                    <strong style={{ color: '#15803d' }}>{usage} elementdə aktiv</strong>
                  ) : (
                    <span>İstifadə edilmir</span>
                  )}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setNewCategoryOpen(false);
                    }}
                    style={{
                      padding: '4px 10px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                    <span>Düzəliş</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    style={{
                      padding: '4px 8px',
                      background: '#fee2e2',
                      border: '1px solid #fca5a5',
                      borderRadius: '5px',
                      fontSize: '11px',
                      color: '#b91c1c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Kateqoriyanı Sil"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          background: '#f8fafc',
          borderRadius: '8px',
          border: '1px dashed #cbd5e1',
          color: '#64748b'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#94a3b8' }}>search_off</span>
          <p style={{ marginTop: '8px', fontSize: '13px' }}>Axtarışa uyğun kateqoriya tapılmadı</p>
        </div>
      )}
    </div>
  );
}

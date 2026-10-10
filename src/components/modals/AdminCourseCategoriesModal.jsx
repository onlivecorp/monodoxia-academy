import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import AdminPopupModal from './AdminPopupModal';

const POPULAR_ICONS = [
  'psychology', 'school', 'workspace_premium', 'lightbulb',
  'auto_stories', 'spa', 'groups', 'stars', 'menu_book', 'self_improvement'
];

export default function AdminCourseCategoriesModal({ isOpen, onClose, onSelectCategory }) {
  const {
    categoriesList = [],
    addCategory,
    updateCategory,
    deleteCategory,
    coursesList = [],
    showToast
  } = useApp();

  const { supportedLangs = [] } = useLanguage();

  const langList = (supportedLangs && supportedLangs.length > 0 ? supportedLangs : ['az', 'en', 'tr', 'ru']).map(l => {
    if (typeof l === 'string') return { code: l, name: l.toUpperCase() };
    return { code: l.code || 'az', name: l.name || (l.code || 'az').toUpperCase() };
  });

  const [activeView, setActiveView] = useState('list'); // 'list' | 'create' | 'edit'
  const [activeLangTab, setActiveLangTab] = useState('az');
  const [searchQuery, setSearchQuery] = useState('');

  const emptyCategory = {
    key: '',
    name: '',
    type: 'course',
    icon: 'psychology',
    translations: {
      az: { name: '', desc: '' },
      en: { name: '', desc: '' },
      tr: { name: '', desc: '' },
      ru: { name: '', desc: '' }
    }
  };

  const [formData, setFormData] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);

  // Filter only course categories
  const courseCategories = (categoriesList || []).filter(c => c.type === 'course' || c.type === 'all');

  const filteredCategories = courseCategories.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = (c.name || '').toLowerCase().includes(q);
    const keyMatch = (c.key || '').toLowerCase().includes(q);
    const transMatch = Object.values(c.translations || {}).some(
      t => (t?.name || '').toLowerCase().includes(q)
    );
    return nameMatch || keyMatch || transMatch;
  });

  const handleNameChange = (val) => {
    const slug = val
      .toLowerCase()
      .replace(/ə/g, 'e')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    setFormData(prev => ({
      ...prev,
      name: val,
      key: editingId ? prev.key : slug,
      translations: {
        ...prev.translations,
        az: { ...prev.translations?.az, name: val }
      }
    }));
  };

  const handleStartCreate = () => {
    setFormData(emptyCategory);
    setEditingId(null);
    setActiveLangTab('az');
    setActiveView('create');
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({
      key: cat.key || '',
      name: cat.name || '',
      type: 'course',
      icon: cat.icon || 'psychology',
      translations: {
        az: { name: cat.translations?.az?.name || cat.name || '', desc: cat.translations?.az?.desc || '' },
        en: { name: cat.translations?.en?.name || '', desc: cat.translations?.en?.desc || '' },
        tr: { name: cat.translations?.tr?.name || '', desc: cat.translations?.tr?.desc || '' },
        ru: { name: cat.translations?.ru?.name || '', desc: cat.translations?.ru?.desc || '' }
      }
    });
    setActiveLangTab('az');
    setActiveView('edit');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Zəhmət olmasa kateqoriya adını daxil edin', 'warning');
      return;
    }

    const rawKey = formData.key || formData.name;
    const finalKey = rawKey.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');

    const catPayload = {
      key: finalKey,
      name: formData.name.trim(),
      type: 'course',
      icon: formData.icon || 'psychology',
      translations: {
        az: { name: formData.translations?.az?.name || formData.name, desc: formData.translations?.az?.desc || '' },
        en: { name: formData.translations?.en?.name || '', desc: formData.translations?.en?.desc || '' },
        tr: { name: formData.translations?.tr?.name || '', desc: formData.translations?.tr?.desc || '' },
        ru: { name: formData.translations?.ru?.name || '', desc: formData.translations?.ru?.desc || '' }
      }
    };

    if (editingId) {
      updateCategory(editingId, catPayload);
      showToast('Kateqoriya və tərcümələri yeniləndi', 'success');
      if (onSelectCategory) {
        onSelectCategory(finalKey);
      }
      setActiveView('list');
    } else {
      addCategory(catPayload);
      showToast(`Yeni kurs kateqoriyası yaradıldı: ${formData.name}`, 'success');
      if (onSelectCategory) {
        onSelectCategory(finalKey);
      }
      setActiveView('list');
    }
  };

  const handleDelete = (cat) => {
    const usage = coursesList.filter(c => c.category === cat.key).length;
    if (usage > 0) {
      if (!window.confirm(`Bu kateqoriya hazırda ${usage} kursda istifadə olunur. Yenə də silmək istəyirsiniz?`)) {
        return;
      }
    } else {
      if (!window.confirm(`"${cat.name}" kateqoriyasını silmək istədiyinizə əminsiniz?`)) {
        return;
      }
    }
    deleteCategory(cat.id);
  };

  return (
    <AdminPopupModal
      isOpen={isOpen}
      title="Kurs Kateqoriyaları və Tərcümələri"
      icon="category"
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '320px' }}>
        {/* Sub-navigation tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className={activeView === 'list' ? 'admin-btn-primary' : 'admin-btn-secondary'}
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>list</span>
              <span>Kateqoriyalar Siyahısı ({courseCategories.length})</span>
            </button>
            <button
              type="button"
              onClick={handleStartCreate}
              className={activeView === 'create' ? 'admin-btn-primary' : 'admin-btn-secondary'}
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add_circle</span>
              <span>+ Yeni Kateqoriya</span>
            </button>
          </div>
          {activeView === 'list' && (
            <input
              type="text"
              placeholder="Kateqoriya axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
              style={{ width: '180px', fontSize: '11px', padding: '4px 8px' }}
            />
          )}
        </div>

        {/* View: Create / Edit Form */}
        {(activeView === 'create' || activeView === 'edit') && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                {activeView === 'create' ? 'Yeni Kurs Kateqoriyası Yarat' : `Kateqoriyanı Redaktə Et: "${formData.name}"`}
              </h5>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="admin-btn-secondary"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                ← Siyahıya qayıt
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="admin-label">Kateqoriya Adı (Əsas / AZ) *</label>
                <input
                  type="text"
                  required
                  placeholder="Məs: Psixologiya, Liderlik"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Açar Söz (Slug / Key) *</label>
                <input
                  type="text"
                  required
                  placeholder="psixologiya"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                  className="admin-input"
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="admin-label">Kateqoriya İkonu</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {POPULAR_ICONS.map(ico => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: ico })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: formData.icon === ico ? '2px solid #b45309' : '1px solid #cbd5e1',
                      background: formData.icon === ico ? '#fffbeb' : '#ffffff',
                      color: formData.icon === ico ? '#b45309' : '#64748b',
                      cursor: 'pointer'
                    }}
                    title={ico}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{ico}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Translation Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#c5a059' }}>translate</span>
                  Çoxdilli Tərcümələr (i18n)
                </span>
                {/* Language pills */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {langList.map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setActiveLangTab(l.code)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        background: activeLangTab === l.code ? '#b45309' : '#e2e8f0',
                        color: activeLangTab === l.code ? '#ffffff' : '#475569'
                      }}
                    >
                      {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <label className="admin-label" style={{ fontSize: '11px' }}>
                    Ad ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formData.translations?.[activeLangTab]?.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          [activeLangTab]: { ...prev.translations?.[activeLangTab], name: val }
                        }
                      }));
                    }}
                    placeholder={`Kateqoriyanın ${activeLangTab.toUpperCase()} dilində adı`}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="admin-label" style={{ fontSize: '11px' }}>
                    Qısa Təsvir ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={formData.translations?.[activeLangTab]?.desc || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          [activeLangTab]: { ...prev.translations?.[activeLangTab], desc: val }
                        }
                      }));
                    }}
                    placeholder={`Təsvir (${activeLangTab.toUpperCase()})`}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className="admin-btn-secondary"
              >
                Ləğv Et
              </button>
              <button type="submit" className="admin-btn-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                <span>{editingId ? 'Yenilə və Tətbiq Et' : 'Kateqoriyanı Yarat'}</span>
              </button>
            </div>
          </form>
        )}

        {/* View: Categories List */}
        {activeView === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
            {filteredCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '12px' }}>
                Uyğun kateqoriya tapılmadı
              </div>
            ) : (
              filteredCategories.map(cat => {
                const count = coursesList.filter(c => c.category === cat.key).length;
                return (
                  <div
                    key={cat.id || cat.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>
                        {cat.icon || 'category'}
                      </span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>{cat.name}</strong>
                          <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                            {cat.key}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                          <span>{count} kurs</span>
                          <span>•</span>
                          <span>Tərcümələr:</span>
                          {['en', 'tr', 'ru'].map(l => (
                            <span
                              key={l}
                              style={{
                                color: cat.translations?.[l]?.name ? '#16a34a' : '#cbd5e1',
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}
                            >
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {onSelectCategory && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCategory(cat.key);
                            onClose();
                          }}
                          className="admin-btn-secondary"
                          style={{ fontSize: '11px', padding: '4px 8px', color: '#b45309', borderColor: '#fed7aa' }}
                          title="Bu kateqoriyanı kurs üçün seç"
                        >
                          Seç
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="admin-btn-edit"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                        title="Redaktə et"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="admin-btn-danger"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                        title="Sil"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </AdminPopupModal>
  );
}

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminInlineTranslator from './AdminInlineTranslator';
import AdminConfirmModal from './AdminConfirmModal';
import AdminPopupModal from './AdminPopupModal';

export default function AdminClubTab() {
  const {
    clubTiersList = [],
    addClubTier,
    updateClubTier,
    deleteClubTier,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Tier State
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState('65');
  const [newTierPeriod, setNewTierPeriod] = useState('/ aylıq');
  const [newTierFeatures, setNewTierFeatures] = useState('');
  const [newTierPopular, setNewTierPopular] = useState(false);
  const [newTierTranslations, setNewTierTranslations] = useState({});
  const [newTierTransOpen, setNewTierTransOpen] = useState(false);
  const [newTierTransLang, setNewTierTransLang] = useState('en');

  // Edit Tier State
  const [editingTier, setEditingTier] = useState(null);
  const [editTierTransLang, setEditTierTransLang] = useState('en');
  const [editTierTransOpen, setEditTierTransOpen] = useState(false);

  // Delete Confirmation State
  const [tierToDelete, setTierToDelete] = useState(null);

  const filteredTiers = useMemo(() => {
    return clubTiersList.filter(t => {
      const matchName = (t.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchFeatures = Array.isArray(t.features) && t.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchName || matchFeatures;
    });
  }, [clubTiersList, searchTerm]);

  const handleCreateClubTier = (e) => {
    e.preventDefault();
    if (!newTierName.trim() || !newTierPrice.trim()) {
      showToast('Zəhmət olmasa paketin adını və məbləğini qeyd edin', 'warning');
      return;
    }
    addClubTier({
      name: newTierName.trim(),
      price: newTierPrice.trim(),
      period: newTierPeriod,
      popular: newTierPopular,
      features: newTierFeatures,
      translations: newTierTranslations
    });
    setNewTierName('');
    setNewTierPrice('65');
    setNewTierFeatures('');
    setNewTierPopular(false);
    setNewTierTranslations({});
    setNewTierTransOpen(false);
    setShowAddForm(false);
  };

  const handleSaveEditClubTier = (e) => {
    e.preventDefault();
    if (!editingTier) return;
    updateClubTier(editingTier.id, {
      name: editingTier.name,
      price: editingTier.price,
      period: editingTier.period,
      popular: Boolean(editingTier.popular),
      features: typeof editingTier.features === 'string'
        ? editingTier.features.split('\n').map(s => s.trim()).filter(Boolean)
        : editingTier.features,
      translations: editingTier.translations || {}
    });
    setEditingTier(null);
  };

  const confirmDelete = () => {
    if (tierToDelete) {
      deleteClubTier(tierToDelete.id);
      setTierToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(tierToDelete)}
        title="Abunəlik Paketini Sil"
        message="Bu paketi silmək istədiyinizə əminsiniz? Bu paketə qoşulmuş istifadəçilərin qeydləri qorunacaq."
        itemName={tierToDelete ? tierToDelete.name : ''}
        confirmText="Bəli, Paketi Sil"
        onConfirm={confirmDelete}
        onCancel={() => setTierToDelete(null)}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">Coaching Club Abunəlik Paketləri</h4>
          <p className="admin-section-subtitle">Rezidentlik paketlərini yaradın, qiymətləri, ödəniş dövrünü və imtiyazları tənzimləyin</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="admin-count-badge">Cəmi: {clubTiersList.length} paket</span>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="admin-btn-primary"
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
            <span>Yeni Paket</span>
          </button>
        </div>
      </div>

      {/* Edit Tier Popup Modal */}
      <AdminPopupModal
        isOpen={Boolean(editingTier)}
        title={editingTier ? `Paketi Redaktə Et: "${editingTier.name}"` : 'Paketi Redaktə Et'}
        icon="card_membership"
        onClose={() => setEditingTier(null)}
      >
        {editingTier && (
          <form onSubmit={handleSaveEditClubTier} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Paket Adı *</label>
                <input
                  type="text"
                  required
                  value={editingTier.name}
                  onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Məbləğ (₼) *</label>
                <input
                  type="text"
                  required
                  value={editingTier.price}
                  onChange={(e) => setEditingTier({ ...editingTier, price: e.target.value })}
                  className="admin-input"
                  style={{ fontWeight: 700, color: '#c5a059', fontFamily: "'Playfair Display',serif" }}
                />
              </div>
              <div>
                <label className="admin-label">Ödəniş Dövrü</label>
                <select
                  value={editingTier.period}
                  onChange={(e) => setEditingTier({ ...editingTier, period: e.target.value })}
                  className="admin-select"
                >
                  <option value="/ aylıq">/ aylıq</option>
                  <option value="Ömürlük">Ömürlük (Birbaşa)</option>
                  <option value="/ rüblük">/ rüblük (3 aylıq)</option>
                  <option value="/ illik">/ illik</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="editTierPopular"
                checked={Boolean(editingTier.popular)}
                onChange={(e) => setEditingTier({ ...editingTier, popular: e.target.checked })}
                style={{ cursor: 'pointer', accentColor: '#c5a059', width: '16px', height: '16px' }}
              />
              <label htmlFor="editTierPopular" style={{ fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                Populyar Paket kimi qeyd et (Landing səhifəsində xüsusi vurğulanır)
              </label>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="admin-label">Daxil Olan İmtiyazlar və Özəlliklər</label>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Hər sətirdə bir özəllik</span>
              </div>
              <textarea
                rows="4"
                required
                value={Array.isArray(editingTier.features) ? editingTier.features.join('\n') : editingTier.features}
                onChange={(e) => setEditingTier({ ...editingTier, features: e.target.value })}
                placeholder="Bütün canlı klub tədbirləri&#10;VIP məxfi müzakirə otağı&#10;Kurslara 25% endirim"
                className="admin-input"
                style={{ fontFamily: 'monospace', fontSize: '11px', lineHeight: '1.6' }}
              />
            </div>

            {/* Inline Translations Panel - Club Tiers */}
            <AdminInlineTranslator
              item={editingTier}
              fields={[
                { key: 'name', label: 'Paketin Adı' },
                { key: 'price', label: 'Qiymət (mətn / valyuta)' },
                { key: 'period', label: 'Ödəniş Dövrü (mətn)' },
                { key: 'features', label: 'İmtiyazlar (sətirbəsətir)', type: 'textarea', isArray: true }
              ]}
              activeLang={editTierTransLang}
              setActiveLang={setEditTierTransLang}
              onUpdate={(updates) => setEditingTier({ ...editingTier, ...updates })}
              isOpen={editTierTransOpen}
              setIsOpen={setEditTierTransOpen}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="admin-btn-secondary"
              >
                Ləğv Et
              </button>
              <button type="submit" className="admin-btn-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                <span>Dəyişiklikləri Yadda Saxla</span>
              </button>
            </div>
          </form>
        )}
      </AdminPopupModal>

      {/* Add Tier Popup Modal */}
      <AdminPopupModal
        isOpen={showAddForm}
        title="Yeni Abunəlik Paketi Əlavə Et"
        icon="add_circle"
        onClose={() => setShowAddForm(false)}
      >
        <form onSubmit={handleCreateClubTier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Paket Adı *</label>
              <input
                type="text"
                required
                placeholder="məsələn: Mastermind Rezident"
                value={newTierName}
                onChange={(e) => setNewTierName(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Məbləğ (₼) *</label>
              <input
                type="text"
                required
                placeholder="məsələn: 65"
                value={newTierPrice}
                onChange={(e) => setNewTierPrice(e.target.value)}
                className="admin-input"
                style={{ fontWeight: 700, color: '#c5a059' }}
              />
            </div>
            <div>
              <label className="admin-label">Ödəniş Dövrü</label>
              <select
                value={newTierPeriod}
                onChange={(e) => setNewTierPeriod(e.target.value)}
                className="admin-select"
              >
                <option value="/ aylıq">/ aylıq</option>
                <option value="Ömürlük">Ömürlük (Birbaşa)</option>
                <option value="/ rüblük">/ rüblük (3 aylıq)</option>
                <option value="/ illik">/ illik</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="newTierPopular"
              checked={newTierPopular}
              onChange={(e) => setNewTierPopular(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#c5a059', width: '16px', height: '16px' }}
            />
            <label htmlFor="newTierPopular" style={{ fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              Populyar Paket kimi qeyd et
            </label>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label className="admin-label">Daxil Olan İmtiyazlar (Özəlliklər) *</label>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Hər sətirdə bir imtiyaz</span>
            </div>
            <textarea
              rows="3"
              required
              value={newTierFeatures}
              onChange={(e) => setNewTierFeatures(e.target.value)}
              placeholder="Coaching Club eksklüziv platforması&#10;Həftəlik praktiki meditasiyalar&#10;Bütün kurslara 15% endirim"
              className="admin-input"
              style={{ fontFamily: 'monospace', fontSize: '11px' }}
            />
          </div>

          {/* Inline Translations Panel - New Club Tier */}
          <AdminInlineTranslator
            item={{
              name: newTierName,
              price: newTierPrice,
              period: newTierPeriod,
              features: newTierFeatures,
              translations: newTierTranslations
            }}
            fields={[
              { key: 'name', label: 'Paketin Adı' },
              { key: 'price', label: 'Qiymət (mətn / valyuta)' },
              { key: 'period', label: 'Ödəniş Dövrü (mətn)' },
              { key: 'features', label: 'İmtiyazlar (sətirbəsətir)', type: 'textarea', isArray: true }
            ]}
            activeLang={newTierTransLang}
            setActiveLang={setNewTierTransLang}
            onUpdate={(updates) => {
              if (updates.translations) {
                setNewTierTranslations(updates.translations);
              }
            }}
            isOpen={newTierTransOpen}
            setIsOpen={setNewTierTransOpen}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="admin-btn-secondary"
            >
              Ləğv Et
            </button>
            <button type="submit" className="admin-btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              <span>Paketi Yarat və Dərc Et</span>
            </button>
          </div>
        </form>
      </AdminPopupModal>

      {/* Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>search</span>
          <input
            type="text"
            placeholder="Paket adı və ya imtiyaz ilə axtar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="admin-input"
            style={{ paddingLeft: '34px' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Club Tiers Grid */}
      {filteredTiers.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '8px' }}>card_membership</span>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>Paket tapılmadı</h5>
          <p style={{ fontSize: '12px', margin: 0 }}>Axtarış sorğusunu dəyişin və ya yeni abunəlik paketi əlavə edin.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredTiers.map(t => (
            <div
              key={t.id}
              className={t.popular ? "admin-card-elevated" : "admin-card"}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', position: 'relative' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
                  <h5 style={{ fontSize: '16px', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#0f172a', margin: 0 }}>
                    {t.name}
                  </h5>
                  {t.popular && (
                    <span className="admin-badge-gold">POPULAR</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', padding: '10px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#b45309' }}>₼ {t.price}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{t.period}</span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>Daxil olan imtiyazlar:</span>
                  <ul style={{ marginTop: '8px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#334155' }}>
                    {t.features && t.features.map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '15px', flexShrink: 0, marginTop: '2px' }}>check_circle</span>
                        <span style={{ lineHeight: 1.4 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setEditingTier({
                    ...t,
                    features: Array.isArray(t.features) ? t.features.join('\n') : t.features
                  })}
                  className="admin-btn-edit"
                  title="Paketi redaktə et"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                  <span>Redaktə</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTierToDelete(t)}
                  className="admin-btn-danger"
                  title="Paketi sil"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                  <span>Sil</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

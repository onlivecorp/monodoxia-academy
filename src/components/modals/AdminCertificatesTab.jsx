/**
 * AdminCertificatesTab.jsx
 * 
 * Admin paneli sertifikat yönetim sekmesi.
 * - Sertifika oluşturma formu + canlı önizleme
 * - Liste + arama/filtre/sıralama/sayfalama
 * - İmza/mühür kütüphanesi
 * - Şablon varsayılan ayarları
 * - Toplu işlemler
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import CertificateTemplate from '../../certificates/CertificateTemplate';

const CERT_W = 1491;
const CERT_H = 1055;
const PREVIEW_SCALE = 0.38;
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

/* ── Helper: generate unique publicId ── */
function genPublicId() {
  return 'cert-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

/* ── Helper: format number ── */
function formatCertNumber(n) {
  return 'MA-' + String(n).padStart(6, '0');
}

/* ── Date picker today value ── */
function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
}

/* ── Default certificate fields ── */
const DEFAULT_FIELDS = {
  headerTitle:    'CERTIFICATE',
  headerSub:      'OF COMPLETION',
  thisCertifies:  'THIS CERTIFIES THAT',
  recipientName:  '',
  descLine1:      'Monodoxia Academy tərəfindən təşkil edilən',
  courseName:     '',
  descLine2:      'təlimi başa vurmuşdur.',
  durationLabel:  'TƏLİMİN MÜDDƏTİ / SAAT',
  durationValue:  '',
  dateLabel:      'VERİLMƏ TARİXİ',
  dateValue:      '',
  verifyLabel:    'SERTİFİKATIN TƏSDİQLƏNMƏSİ',
  sig1Name:       'TURXAN TƏHMƏZOV',
  sig1Title:      'Founder & Director',
  sig1Image:      '',
  sig2Name:       'SƏDAQƏT RZAYEVA',
  sig2Title:      'Təlimçi',
  sig2Image:      '',
  sealImage:      '',
};

/* ── File uploader component ── */
function AssetUploader({ label, value, onChange, existingAssets = [], onSelectExisting }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      alert('Yalnız PNG, JPG, WebP və SVG faylları qəbul edilir.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('Fayl ölçüsü 3MB-dan çox ola bilməz.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>{label}</label>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => !value && inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? '#b8903f' : '#e2e8f0'}`,
          borderRadius: 12, padding: 12,
          background: drag ? '#fffbeb' : '#faf9f6',
          cursor: value ? 'default' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: 12, minHeight: 72
        }}
      >
        {value ? (
          <>
            <img src={value} alt="preview" style={{ height: 56, maxWidth: 120, objectFit: 'contain', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', padding: 4 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#64748b' }}>Yüklənib</div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onChange(''); }}
                style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}
              >Sil</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', flex: 1 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#cbd5e1', display: 'block' }}>upload</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>PNG yüklə və ya sürükle-bırak</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden onChange={e => handleFile(e.target.files?.[0])} />
      </div>
      {/* Kütüphaneden seç */}
      {existingAssets.length > 0 && (
        <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {existingAssets.map((a, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectExisting?.(a.url)}
              title={a.label || 'Seç'}
              style={{
                background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: 4, cursor: 'pointer',
                outline: value === a.url ? '2px solid #b8903f' : 'none'
              }}
            >
              <img src={a.url} alt="" style={{ height: 32, maxWidth: 60, objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Field Input ── */
function FieldInput({ label, name, value, onChange, type = 'text', rows }) {
  const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: 8,
    border: '1.5px solid #e2e8f0', fontSize: 12,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    color: '#0f172a', background: '#fff', outline: 'none',
    transition: 'border-color 0.15s', boxSizing: 'border-box'
  };

  return (
    <div>
      <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>{label}</label>
      {rows ? (
        <textarea
          name={name} value={value} rows={rows}
          onChange={e => onChange(name, e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={e => e.target.style.borderColor = '#b8903f'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      ) : (
        <input
          type={type} name={name} value={value}
          onChange={e => onChange(name, e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#b8903f'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      )}
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const map = {
    'Yayında': { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7', icon: 'check_circle' },
    'Qaralama': { bg: '#fef9c3', color: '#854d0e', border: '#fde047', icon: 'draft' },
    'İptal Edilmiş': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', icon: 'block' },
  };
  const s = map[status] || map['Qaralama'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{s.icon}</span>
      {status}
    </span>
  );
}

export default function AdminCertificatesTab() {
  const {
    certificatesList = [],
    addCertificate,
    updateCertificate,
    deleteCertificate,
    revokeCertificate,
    usersList = [],
    certCounter,
    certSettings,
    updateCertSettings,
    assetLibrary = [],
    addAsset,
    setCertViewModalOpen,
    setActiveCertView,
    showToast,
    currentUser
  } = useApp();

  const [view, setView] = useState('list'); // list | create | edit | settings
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [fields, setFields] = useState({ ...DEFAULT_FIELDS });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [status, setStatus] = useState('Qaralama');
  const [revokeReason, setRevokeReason] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // List state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const PER_PAGE = 10;

  // Settings form
  const [settingsForm, setSettingsForm] = useState(() => certSettings || { ...DEFAULT_FIELDS });

  // Saving state
  const [saving, setSaving] = useState(false);
  const [revokeModal, setRevokeModal] = useState(null); // certId

  // Reset form
  const resetForm = useCallback(() => {
    const defaults = certSettings || DEFAULT_FIELDS;
    setFields({ ...defaults, recipientName: '', courseName: '', dateValue: todayStr(), durationValue: '' });
    setSelectedUserId('');
    setStatus('Qaralama');
    setFormErrors({});
    setEditingId(null);
  }, [certSettings]);

  useEffect(() => {
    if (view === 'create') resetForm();
  }, [view, resetForm]);

  const handleFieldChange = (name, value) => {
    setFields(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFields(prev => { const f = { ...prev }; return f; });
  };

  // User selection
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    if (!userId) return;
    const user = usersList.find(u => String(u.id) === String(userId));
    if (user) {
      setFields(prev => ({ ...prev, recipientName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() }));
    }
  };

  // Validate
  const validate = () => {
    const errs = {};
    if (!fields.recipientName?.trim()) errs.recipientName = 'Alıcı adı mütləqdir';
    if (!fields.courseName?.trim()) errs.courseName = 'Kurs/Təlim adı mütləqdir';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit (create)
  const handleCreate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const newCert = {
        id: 'cert-' + Date.now(),
        publicId: genPublicId(),
        number: formatCertNumber((certCounter || 0) + 1),
        userId: selectedUserId || null,
        userName: fields.recipientName,
        status: status,
        fields: { ...fields },
        version: 1,
        issuedAt: fields.dateValue || todayStr(),
        createdBy: currentUser?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addCertificate(newCert);
      showToast(`Sertifikat yaradıldı: ${newCert.number}`, 'success');
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  // Submit (edit)
  const handleUpdate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      updateCertificate(editingId, {
        fields: { ...fields },
        userName: fields.recipientName,
        userId: selectedUserId || null,
        status: status,
        updatedAt: new Date().toISOString(),
        version: (certificatesList.find(c => c.id === editingId)?.version || 1) + 1,
      });
      showToast('Sertifikat yeniləndi', 'success');
      setView('list');
    } finally {
      setSaving(false);
    }
  };

  // Open edit
  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setFields({ ...DEFAULT_FIELDS, ...(cert.fields || {}) });
    setSelectedUserId(cert.userId || '');
    setStatus(cert.status || 'Qaralama');
    setView('edit');
  };

  // Publish
  const handlePublish = (cert) => {
    updateCertificate(cert.id, { status: 'Yayında', updatedAt: new Date().toISOString() });
    showToast(`${cert.number} yayına çıxarıldı`, 'success');
  };

  // Revoke
  const handleRevoke = (cert) => {
    setRevokeModal(cert.id);
    setRevokeReason('');
  };

  const confirmRevoke = () => {
    if (!revokeModal) return;
    revokeCertificate(revokeModal, revokeReason);
    showToast('Sertifikat ləğv edildi', 'info');
    setRevokeModal(null);
  };

  // Delete
  const handleDelete = (cert) => {
    if (!window.confirm(`"${cert.number}" sertifikatını silmək istəyirsinizmi?`)) return;
    deleteCertificate(cert.id);
    showToast('Sertifikat silindi', 'info');
  };

  // View
  const handleView = (cert) => {
    setActiveCertView(cert);
    setCertViewModalOpen(true);
  };

  // Copy link
  const handleCopyLink = (cert) => {
    const url = `${window.location.origin}/#/certificates/verify/${cert.publicId}`;
    navigator.clipboard.writeText(url).then(() => showToast('Link kopyalandı!', 'success'));
  };

  // Asset upload
  const handleAssetUpload = (type, dataUrl) => {
    if (!dataUrl) return;
    const asset = { id: 'ast-' + Date.now(), type, url: dataUrl, label: type === 'signature' ? 'İmza' : 'Mühür', addedAt: new Date().toISOString() };
    addAsset(asset);
  };

  // Filtered + sorted list
  const filteredList = useMemo(() => {
    let list = [...certificatesList];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        (c.number || '').toLowerCase().includes(q) ||
        (c.userName || '').toLowerCase().includes(q) ||
        (c.fields?.courseName || '').toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') list = list.filter(c => c.status === filterStatus);
    list.sort((a, b) => {
      let av = a[sortBy] || '';
      let bv = b[sortBy] || '';
      if (sortDir === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return list;
  }, [certificatesList, search, filterStatus, sortBy, sortDir]);

  const paged = filteredList.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filteredList.length / PER_PAGE);

  // Bulk actions
  const handleSelectAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(c => c.id)));
  };

  const handleBulkPublish = () => {
    selected.forEach(id => {
      updateCertificate(id, { status: 'Yayında', updatedAt: new Date().toISOString() });
    });
    showToast(`${selected.size} sertifikat yayına çıxarıldı`, 'success');
    setSelected(new Set());
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`${selected.size} sertifikat silinsin?`)) return;
    selected.forEach(id => deleteCertificate(id));
    showToast(`${selected.size} sertifikat silindi`, 'info');
    setSelected(new Set());
  };

  // Settings save
  const handleSaveSettings = () => {
    updateCertSettings(settingsForm);
    showToast('Şablon ayarları saxlanıldı', 'success');
  };

  const verifyUrl = (cert) => cert?.publicId ? `${window.location.origin}/#/certificates/verify/${cert.publicId}` : '';

  // ── Render ──
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#b45309' }}>workspace_premium</span>
            Sertifikat İdarəetməsi
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
            {certificatesList.length} sertifikat · {certificatesList.filter(c => c.status === 'Yayında').length} yayında
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setView('settings')}
            style={{
              padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
              background: view === 'settings' ? '#fff7ed' : '#f8fafc',
              border: `1px solid ${view === 'settings' ? '#fed7aa' : '#e2e8f0'}`,
              color: view === 'settings' ? '#c2410c' : '#334155', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>settings</span>
            Şablon Ayarları
          </button>
          <button
            onClick={() => setView('create')}
            style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
              background: 'linear-gradient(135deg, #b45309, #d4af37)',
              color: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(180,83,9,0.25)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
            Yeni Sertifikat
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          VIEW: LIST
      ══════════════════════════════════════ */}
      {view === 'list' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Axtar: №, ad, kurs..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                padding: '8px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
                fontSize: 12, flex: 1, minWidth: 200, fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: '#faf9f6', color: '#0f172a', outline: 'none'
              }}
            />
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 12, background: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <option value="all">Bütün Statuslar</option>
              <option value="Qaralama">Qaralama</option>
              <option value="Yayında">Yayında</option>
              <option value="İptal Edilmiş">İptal Edilmiş</option>
            </select>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={e => { const [s, d] = e.target.value.split('-'); setSortBy(s); setSortDir(d); }}
              style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 12, background: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <option value="createdAt-desc">Yaradılma (Yeni)</option>
              <option value="createdAt-asc">Yaradılma (Köhnə)</option>
              <option value="number-asc">№ Artan</option>
              <option value="number-desc">№ Azalan</option>
            </select>
          </div>

          {/* Bulk actions */}
          {selected.size > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
              background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, marginBottom: 12
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>{selected.size} seçildi</span>
              <button onClick={handleBulkPublish} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', cursor: 'pointer', fontWeight: 700 }}>
                Yayına Çıxar
              </button>
              <button onClick={handleBulkDelete} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', cursor: 'pointer', fontWeight: 700 }}>
                Sil
              </button>
              <button onClick={() => setSelected(new Set())} style={{ fontSize: 11, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Ləğv et</button>
            </div>
          )}

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left', width: 36 }}>
                      <input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={handleSelectAll} />
                    </th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>№</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Alıcı</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kurs / Təlim</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Tarix</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Əməliyyat</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>workspace_premium</span>
                        {search || filterStatus !== 'all' ? 'Nəticə tapılmadı' : 'Hələ sertifikat yaradılmayıb'}
                      </td>
                    </tr>
                  ) : paged.map((cert, i) => (
                    <tr key={cert.id} style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: selected.has(cert.id) ? '#fffbeb' : i % 2 === 0 ? '#fff' : '#fafbfc',
                      transition: 'background 0.1s'
                    }}>
                      <td style={{ padding: '10px 12px' }}>
                        <input
                          type="checkbox"
                          checked={selected.has(cert.id)}
                          onChange={e => {
                            setSelected(prev => {
                              const n = new Set(prev);
                              e.target.checked ? n.add(cert.id) : n.delete(cert.id);
                              return n;
                            });
                          }}
                        />
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#334155', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{cert.number}</td>
                      <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: 600 }}>{cert.userName || cert.fields?.recipientName || '—'}</td>
                      <td style={{ padding: '10px 12px', color: '#334155', maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cert.fields?.courseName || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>{cert.fields?.dateValue || cert.issuedAt || '—'}</td>
                      <td style={{ padding: '10px 12px' }}><StatusBadge status={cert.status || 'Qaralama'} /></td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          {/* View */}
                          <button onClick={() => handleView(cert)} title="Bax" style={actionBtnStyle('#f8fafc')}>
                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>visibility</span>
                          </button>
                          {/* Edit (only drafts or re-edit published → new version) */}
                          <button onClick={() => handleEdit(cert)} title="Redaktə Et" style={actionBtnStyle('#f8fafc')}>
                            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                          </button>
                          {/* Publish */}
                          {cert.status !== 'Yayında' && cert.status !== 'İptal Edilmiş' && (
                            <button onClick={() => handlePublish(cert)} title="Yayına Çıxar" style={actionBtnStyle('#d1fae5')}>
                              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#065f46' }}>publish</span>
                            </button>
                          )}
                          {/* Revoke */}
                          {cert.status === 'Yayında' && (
                            <button onClick={() => handleRevoke(cert)} title="Ləğv Et" style={actionBtnStyle('#fee2e2')}>
                              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#991b1b' }}>block</span>
                            </button>
                          )}
                          {/* Copy link */}
                          {cert.publicId && (
                            <button onClick={() => handleCopyLink(cert)} title="Linki Kopyala" style={actionBtnStyle('#f8fafc')}>
                              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>link</span>
                            </button>
                          )}
                          {/* Delete */}
                          <button onClick={() => handleDelete(cert)} title="Sil" style={actionBtnStyle('#fee2e2')}>
                            <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#dc2626' }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  {filteredList.length} nəticə · {page}/{totalPages} səhifə
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page > 1)}>{'‹'}</button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return p <= totalPages ? (
                      <button key={p} onClick={() => setPage(p)} style={pageBtn(true, p === page)}>{p}</button>
                    ) : null;
                  })}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page < totalPages)}>{'›'}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          VIEW: CREATE / EDIT
      ══════════════════════════════════════ */}
      {(view === 'create' || view === 'edit') && (
        <div>
          {/* Back */}
          <button onClick={() => { setView('list'); resetForm(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, marginBottom: 20 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Siyahıya Qayıt
          </button>

          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 20px', fontFamily: "'Playfair Display', serif" }}>
            {view === 'create' ? 'Yeni Sertifikat Yarat' : 'Sertifikatı Redaktə Et'}
            {editingId && (() => { const c = certificatesList.find(x => x.id === editingId); return c ? ` — ${c.number}` : ''; })()}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gap: 24, alignItems: 'start' }}>
            {/* LEFT: Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* User selection */}
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 12 }}>Alıcı Seçimi</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                      Qeydiyyatlı İstifadəçi
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={e => handleUserSelect(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#faf9f6' }}
                    >
                      <option value="">Kənar / Manuel daxil et</option>
                      {usersList.map(u => (
                        <option key={u.id} value={u.id}>{u.name || `${u.firstName} ${u.lastName}`} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Main Fields */}
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 14 }}>Sertifikat Məzmunu</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FieldInput label="Başlıq (CERTIFICATE)" name="headerTitle" value={fields.headerTitle} onChange={handleFieldChange} />
                  <FieldInput label="Alt Başlıq (OF COMPLETION)" name="headerSub" value={fields.headerSub} onChange={handleFieldChange} />
                  <div style={{ gridColumn: '1/-1' }}>
                    <FieldInput label="THIS CERTIFIES THAT Mətni" name="thisCertifies" value={fields.thisCertifies} onChange={handleFieldChange} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <FieldInput
                      label={`Alıcı Adı Soyadı${formErrors.recipientName ? ' *' : ''}`}
                      name="recipientName" value={fields.recipientName} onChange={handleFieldChange}
                    />
                    {formErrors.recipientName && <span style={{ fontSize: 10, color: '#dc2626' }}>{formErrors.recipientName}</span>}
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <FieldInput label="Açıqlama — Sətir 1" name="descLine1" value={fields.descLine1} onChange={handleFieldChange} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <FieldInput
                      label={`Kurs / Təlim Adı${formErrors.courseName ? ' *' : ''}`}
                      name="courseName" value={fields.courseName} onChange={handleFieldChange}
                    />
                    {formErrors.courseName && <span style={{ fontSize: 10, color: '#dc2626' }}>{formErrors.courseName}</span>}
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <FieldInput label="Açıqlama — Sətir 2" name="descLine2" value={fields.descLine2} onChange={handleFieldChange} />
                  </div>
                  <FieldInput label="Müddət Dəyəri (məs: 24 saat)" name="durationValue" value={fields.durationValue} onChange={handleFieldChange} />
                  <FieldInput label="Tarix (DD.MM.YYYY)" name="dateValue" value={fields.dateValue} onChange={handleFieldChange} />
                </div>
              </div>

              {/* Bottom Labels */}
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 14 }}>Alt Etiketlər</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <FieldInput label="Müddət Etiketi" name="durationLabel" value={fields.durationLabel} onChange={handleFieldChange} />
                  <FieldInput label="Tarix Etiketi" name="dateLabel" value={fields.dateLabel} onChange={handleFieldChange} />
                  <div style={{ gridColumn: '1/-1' }}>
                    <FieldInput label="QR Doğrulama Etiketi" name="verifyLabel" value={fields.verifyLabel} onChange={handleFieldChange} />
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 14 }}>İmzalar və Mühür</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {/* Sig 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <FieldInput label="İmza 1 — Ad Soyad" name="sig1Name" value={fields.sig1Name} onChange={handleFieldChange} />
                    <FieldInput label="İmza 1 — Vəzifə" name="sig1Title" value={fields.sig1Title} onChange={handleFieldChange} />
                    <AssetUploader
                      label="İmza 1 PNG"
                      value={fields.sig1Image}
                      onChange={url => { handleFieldChange('sig1Image', url); if (url) handleAssetUpload('signature', url); }}
                      existingAssets={assetLibrary.filter(a => a.type === 'signature')}
                      onSelectExisting={url => handleFieldChange('sig1Image', url)}
                    />
                  </div>
                  {/* Sig 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <FieldInput label="İmza 2 — Ad Soyad" name="sig2Name" value={fields.sig2Name} onChange={handleFieldChange} />
                    <FieldInput label="İmza 2 — Vəzifə" name="sig2Title" value={fields.sig2Title} onChange={handleFieldChange} />
                    <AssetUploader
                      label="İmza 2 PNG"
                      value={fields.sig2Image}
                      onChange={url => { handleFieldChange('sig2Image', url); if (url) handleAssetUpload('signature', url); }}
                      existingAssets={assetLibrary.filter(a => a.type === 'signature')}
                      onSelectExisting={url => handleFieldChange('sig2Image', url)}
                    />
                  </div>
                  {/* Seal */}
                  <div style={{ gridColumn: '1/-1' }}>
                    <AssetUploader
                      label="Mühür PNG"
                      value={fields.sealImage}
                      onChange={url => { handleFieldChange('sealImage', url); if (url) handleAssetUpload('seal', url); }}
                      existingAssets={assetLibrary.filter(a => a.type === 'seal')}
                      onSelectExisting={url => handleFieldChange('sealImage', url)}
                    />
                  </div>
                </div>
              </div>

              {/* Status + Actions */}
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Status:</span>
                  {['Qaralama', 'Yayında'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      style={{
                        padding: '4px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        ...(status === s
                          ? { background: s === 'Yayında' ? '#d1fae5' : '#fef9c3', color: s === 'Yayında' ? '#065f46' : '#854d0e', border: `1.5px solid ${s === 'Yayında' ? '#6ee7b7' : '#fde047'}` }
                          : { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' })
                      }}
                    >{s}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { setView('list'); resetForm(); }}
                    style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}
                  >Ləğv Et</button>
                  <button
                    onClick={view === 'create' ? handleCreate : handleUpdate}
                    disabled={saving}
                    style={{
                      padding: '8px 22px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      background: saving ? '#e2e8f0' : 'linear-gradient(135deg, #b45309, #d4af37)',
                      color: saving ? '#94a3b8' : '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    {saving ? (
                      <><div style={{ width: 14, height: 14, border: '2px solid #94a3b8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Saxlanır...</>
                    ) : (
                      <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>{view === 'create' ? 'Yarat' : 'Yadda Saxla'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Live Preview */}
            <div style={{ position: 'sticky', top: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8', marginBottom: 10, textAlign: 'center' }}>
                Canlı Önizləmə
              </div>
              <div style={{
                background: '#1e293b', borderRadius: 16, padding: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '1491 / 1055',
                  overflow: 'hidden',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                  <CertificateTemplate
                    data={fields}
                    verifyUrl="https://monodoxia.academy/certificates/verify/preview"
                  />
                </div>
                <div style={{ marginTop: 10, fontSize: 10, color: '#64748b', textAlign: 'center' }}>
                  A4 Yatay · 1491×1055px (Orijinal Vektor)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          VIEW: SETTINGS
      ══════════════════════════════════════ */}
      {view === 'settings' && (
        <div style={{ maxWidth: 700 }}>
          <button onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 12, marginBottom: 20 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Geri
          </button>

          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', fontFamily: "'Playfair Display', serif" }}>Şablon Varsayılan Ayarları</h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>
            Yeni sertifikatlarda bu dəyərlər varsayılan olaraq gəlir.
          </p>

          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries({
              headerTitle: 'Başlıq',
              headerSub: 'Alt Başlıq',
              thisCertifies: 'THIS CERTIFIES THAT',
              descLine1: 'Açıqlama Sətri 1',
              descLine2: 'Açıqlama Sətri 2',
              durationLabel: 'Müddət Etiketi',
              dateLabel: 'Tarix Etiketi',
              verifyLabel: 'Doğrulama Etiketi',
              sig1Name: 'İmza 1 — Ad',
              sig1Title: 'İmza 1 — Vəzifə',
              sig2Name: 'İmza 2 — Ad',
              sig2Title: 'İmza 2 — Vəzifə',
            }).map(([k, label]) => (
              <div key={k}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>{label}</label>
                <input
                  type="text"
                  value={settingsForm[k] || ''}
                  onChange={e => setSettingsForm(prev => ({ ...prev, [k]: e.target.value }))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#faf9f6', boxSizing: 'border-box', color: '#0f172a', outline: 'none' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => setView('list')} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}>Ləğv Et</button>
            <button
              onClick={handleSaveSettings}
              style={{ padding: '8px 22px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #b45309, #d4af37)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
              Saxla
            </button>
          </div>
        </div>
      )}

      {/* ── Revoke Modal ── */}
      {revokeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 440, width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Sertifikatı Ləğv Et</h4>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Bu əməliyyat geri alına bilər (statusu yenidən dəyişə bilərsiniz). İstəyə bağlı olaraq ləğvetmə səbəbi qeyd edin.</p>
            <textarea
              rows={3}
              placeholder="Ləğvetmə səbəbi (istəyə bağlı)..."
              value={revokeReason}
              onChange={e => setRevokeReason(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => setRevokeModal(null)} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}>Ləğv Et</button>
              <button onClick={confirmRevoke} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer' }}>Ləğv Et (Onaylayın)</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Tiny helpers ──
const actionBtnStyle = (bg) => ({
  width: 28, height: 28, borderRadius: 7, border: '1px solid #e2e8f0',
  background: bg, cursor: 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', transition: 'all 0.1s'
});

const pageBtn = (active, current = false) => ({
  width: 28, height: 28, borderRadius: 7, fontSize: 12, fontWeight: current ? 800 : 500,
  background: current ? '#0f172a' : '#f8fafc',
  color: current ? '#fff' : active ? '#334155' : '#cbd5e1',
  border: `1px solid ${current ? '#0f172a' : '#e2e8f0'}`,
  cursor: active ? 'pointer' : 'not-allowed'
});

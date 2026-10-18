import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminInlineTranslator from './AdminInlineTranslator';
import AdminConfirmModal from './AdminConfirmModal';
import AdminPopupModal from './AdminPopupModal';

const ITEMS_PER_PAGE = 8;

const AZ_MONTHS = [
  'YANVAR', 'FEVRAL', 'MART', 'APREL', 'MAY', 'İYUN',
  'İYUL', 'AVQUST', 'SENTYABR', 'OKTYABR', 'NOYABR', 'DEKABR'
];

function parseToDateTimeLocal(str) {
  if (!str) return '';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str)) {
    return str.substring(0, 16);
  }
  const monthMap = {
    'yanvar': 0, 'fevral': 1, 'mart': 2, 'aprel': 3, 'may': 4, 'iyun': 5,
    'iyul': 6, 'avqust': 7, 'sentyabr': 8, 'oktyabr': 9, 'oktabr': 9, 'noyabr': 10, 'dekabr': 11
  };
  const match = String(str).match(/(\d{1,2})\s+([A-Za-zƏəİiIıÖöÜüÇçŞşĞğ]+)(?:,?\s*(\d{4}))?,?\s*(\d{1,2}):(\d{2})/i);
  if (match) {
    const day = parseInt(match[1], 10);
    const mStr = match[2].toLowerCase().replace(/i̇/g, 'i');
    const month = monthMap[mStr] !== undefined ? monthMap[mStr] : 10;
    const year = match[3] ? parseInt(match[3], 10) : new Date().getFullYear();
    const hours = parseInt(match[4], 10);
    const mins = parseInt(match[5], 10);
    const pad = n => String(n).padStart(2, '0');
    return `${year}-${pad(month + 1)}-${pad(day)}T${pad(hours)}:${pad(mins)}`;
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return '';
}

function formatEventDateTime(datetimeLocalStr) {
  if (!datetimeLocalStr) return '';
  const d = new Date(datetimeLocalStr);
  if (isNaN(d.getTime())) return datetimeLocalStr;
  const day = d.getDate();
  const month = AZ_MONTHS[d.getMonth()] || 'YANVAR';
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month}, ${hours}:${mins}`;
}

export default function AdminEventsTab() {
  const {
    eventsList = [],
    usersList = [],
    coachesList = [],
    coursesList = [],
    addEvent,
    updateEvent,
    deleteEvent,
    showToast
  } = useApp();

  // Search, Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  // Users & Coaches Options for Speaker Selection
  const speakerOptions = useMemo(() => {
    const list = [];
    const seen = new Set();

    // 1. Users from usersList (coaches first, then others)
    const coaches = (usersList || []).filter(u => u.role === 'Kouç' || u.role === 'Spiker');
    const others = (usersList || []).filter(u => u.role !== 'Kouç' && u.role !== 'Spiker');

    [...coaches, ...others].forEach(u => {
      const name = (u.name || `${u.firstName || ''} ${u.lastName || ''}`).trim();
      if (name && !seen.has(name)) {
        seen.add(name);
        list.push({
          id: u.id || name,
          name,
          role: u.role || 'İstifadəçi',
          email: u.email || ''
        });
      }
    });

    // 2. Coaches from coachesList
    (coachesList || []).forEach(c => {
      const name = (c.name || '').trim();
      if (name && !seen.has(name)) {
        seen.add(name);
        list.push({
          id: c.id || name,
          name,
          role: c.title || 'Kouç',
          email: c.email || ''
        });
      }
    });

    // 3. Fallback: instructors from existing courses
    (coursesList || []).forEach(c => {
      const name = (c.instructor || '').trim();
      if (name && !seen.has(name)) {
        seen.add(name);
        list.push({
          id: `inst-${name}`,
          name,
          role: 'Kouç',
          email: ''
        });
      }
    });

    // 4. Fallback: speakers from existing events
    (eventsList || []).forEach(e => {
      const name = (e.speaker || '').trim();
      if (name && !seen.has(name)) {
        seen.add(name);
        list.push({
          id: `speaker-${name}`,
          name,
          role: 'Spiker',
          email: ''
        });
      }
    });

    return list;
  }, [usersList, coachesList, coursesList, eventsList]);

  // Add Event State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSpeaker, setNewEventSpeaker] = useState('Dr. Leyla Əliyeva');
  const [newEventRawDate, setNewEventRawDate] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState('100');
  const [newEventTypeBadge, setNewEventTypeBadge] = useState('VEBİNAR');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventImage, setNewEventImage] = useState('');
  const [newEventIsFree, setNewEventIsFree] = useState(true);
  const [newEventPrice, setNewEventPrice] = useState('');
  const [newEventStatus, setNewEventStatus] = useState('Aktiv');
  const [newEventTranslations, setNewEventTranslations] = useState({});
  const [newEventTransOpen, setNewEventTransOpen] = useState(false);
  const [newEventTransLang, setNewEventTransLang] = useState('en');

  // Edit Event State
  const [editingEvent, setEditingEvent] = useState(null);
  const [editEventRawDate, setEditEventRawDate] = useState('');
  const [editEventTransLang, setEditEventTransLang] = useState('en');
  const [editEventTransOpen, setEditEventTransOpen] = useState(false);

  // Delete Confirmation State
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleFileToDataUrl = async (file, callback) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Yalnız şəkil faylı seçə bilərsiniz', 'warning');
      return;
    }
    // Try server-side direct upload first to get clean lightweight URL
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('api.php?action=upload_image', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.url) {
          callback(data.url);
          showToast('Şəkil uğurla yükləndi!', 'success');
          return;
        }
      }
    } catch (err) {
      console.warn('Direct upload to api.php failed, falling back to local canvas compression', err);
    }

    // Local client-side canvas compression fallback
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          callback(compressed);
          showToast('Şəkil hazırlandı!', 'success');
        } catch (err) {
          callback(dataUrl);
        }
      };
      img.onerror = () => callback(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return (eventsList || []).filter(e => {
      if (!e) return false;
      const titleStr = typeof e.title === 'string' ? e.title : (e.title?.az || '');
      const speakerStr = typeof e.speaker === 'string' ? e.speaker : '';
      const descStr = typeof e.desc === 'string' ? e.desc : (e.desc?.az || '');
      const datetimeStr = typeof e.datetime === 'string' ? e.datetime : '';
      const matchSearch = titleStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          speakerStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          descStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          datetimeStr.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = typeFilter === 'all' || e.typeBadge === typeFilter;
      return matchSearch && matchType;
    });
  }, [eventsList, searchTerm, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  const handleOpenEdit = (eventItem) => {
    const rawPrice = eventItem.price ? String(eventItem.price).trim() : '';
    const isFree = !rawPrice || ['pulsuz', 'ödənişsiz', '0', '0 ₼', '0 azn'].includes(rawPrice.toLowerCase());
    setEditingEvent({
      ...eventItem,
      image: eventItem.image || '',
      isFree: isFree,
      price: isFree ? '' : rawPrice,
      status: eventItem.status || 'Aktiv'
    });
    const raw = eventItem.rawDatetime || parseToDateTimeLocal(eventItem.datetime) || '';
    setEditEventRawDate(raw);
  };

  const handleNewEventDateChange = (val) => {
    setNewEventRawDate(val);
    setNewEventDate(formatEventDateTime(val));
  };

  const handleEditEventDateChange = (val) => {
    setEditEventRawDate(val);
    const formatted = formatEventDateTime(val);
    setEditingEvent(prev => ({
      ...prev,
      datetime: formatted,
      rawDatetime: val
    }));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) {
      showToast('Zəhmət olmasa tədbirin başlığını və tarixini qeyd edin', 'warning');
      return;
    }
    const finalPrice = newEventIsFree ? 'Pulsuz' : (newEventPrice.trim() || 'Pulsuz');
    addEvent({
      title: newEventTitle.trim(),
      speaker: newEventSpeaker || 'Dr. Leyla Əliyeva',
      datetime: newEventDate.trim(),
      rawDatetime: newEventRawDate,
      capacity: Number(newEventCapacity) || 100,
      registered: 0,
      typeBadge: newEventTypeBadge,
      desc: newEventDesc || 'İnteraktiv masterklas və praktiki sessiya.',
      image: newEventImage.trim(),
      price: finalPrice,
      status: newEventStatus || 'Aktiv',
      translations: {
        ...(newEventTranslations || {}),
        az: {
          ...(newEventTranslations?.az || {}),
          title: newEventTitle.trim(),
          desc: newEventDesc || 'İnteraktiv masterklas və praktiki sessiya.',
          typeBadge: newEventTypeBadge
        }
      }
    });
    setNewEventTitle('');
    setNewEventRawDate('');
    setNewEventDate('');
    setNewEventDesc('');
    setNewEventImage('');
    setNewEventIsFree(true);
    setNewEventPrice('');
    setNewEventStatus('Aktiv');
    setNewEventTranslations({});
    setNewEventTransOpen(false);
    setShowAddForm(false);
  };

  const handleSaveEditEvent = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    const finalPrice = editingEvent.isFree ? 'Pulsuz' : (editingEvent.price?.trim() || 'Pulsuz');
    updateEvent(editingEvent.id, {
      title: editingEvent.title,
      speaker: editingEvent.speaker,
      datetime: editingEvent.datetime,
      rawDatetime: editEventRawDate,
      capacity: Number(editingEvent.capacity) || 100,
      registered: editingEvent.registered !== undefined ? Number(editingEvent.registered) : 0,
      typeBadge: editingEvent.typeBadge,
      desc: editingEvent.desc,
      image: (editingEvent.image || '').trim(),
      price: finalPrice,
      status: editingEvent.status || 'Aktiv',
      translations: {
        ...(editingEvent.translations || {}),
        az: {
          ...(editingEvent.translations?.az || {}),
          title: editingEvent.title,
          desc: editingEvent.desc,
          typeBadge: editingEvent.typeBadge
        }
      }
    });
    setEditingEvent(null);
    setEditEventRawDate('');
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(eventToDelete)}
        title="Tədbiri Sil"
        message="Bu tədbiri və ona aid bütün qeydləri silmək istədiyinizə əminsiniz?"
        itemName={eventToDelete ? eventToDelete.title : ''}
        confirmText="Bəli, Tədbiri Sil"
        onConfirm={confirmDelete}
        onCancel={() => setEventToDelete(null)}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">Tədbirlər və Masterklaslar</h4>
          <p className="admin-section-subtitle">Canlı vebinarları, seminarları və interaktiv sessiyaları yaradın və redaktə edin</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="admin-count-badge">Cəmi: {eventsList.length} tədbir</span>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="admin-btn-primary"
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
            <span>Yeni Tədbir</span>
          </button>
        </div>
      </div>

      {/* Edit Event Popup Modal */}
      <AdminPopupModal
        isOpen={Boolean(editingEvent)}
        title={editingEvent ? `Tədbiri Redaktə Et: "${editingEvent.title}"` : 'Tədbiri Redaktə Et'}
        icon="edit_calendar"
        onClose={() => { setEditingEvent(null); setEditEventRawDate(''); }}
      >
        {editingEvent && (
          <form onSubmit={handleSaveEditEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="admin-label">Tədbir Başlığı *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Format / Növ</label>
                <select
                  value={editingEvent.typeBadge}
                  onChange={(e) => setEditingEvent({ ...editingEvent, typeBadge: e.target.value })}
                  className="admin-select"
                >
                  <option value="VEBİNAR">VEBİNAR</option>
                  <option value="CANLI VEBİNAR">CANLI VEBİNAR</option>
                  <option value="MASTERKLAS">MASTERKLAS</option>
                  <option value="CANLI SESSİYA">CANLI SESSİYA</option>
                  <option value="SEMİNAR">SEMİNAR</option>
                  <option value="OFLAYN SEMİNAR">OFLAYN SEMİNAR</option>
                  <option value="MEDİTASİYA">MEDİTASİYA</option>
                  <option value="MEDİTASİYA GECƏSİ">MEDİTASİYA GECƏSİ</option>
                  {editingEvent.typeBadge && !['VEBİNAR', 'CANLI VEBİNAR', 'MASTERKLAS', 'CANLI SESSİYA', 'SEMİNAR', 'OFLAYN SEMİNAR', 'MEDİTASİYA', 'MEDİTASİYA GECƏSİ'].includes(editingEvent.typeBadge) && (
                    <option value={editingEvent.typeBadge}>{editingEvent.typeBadge}</option>
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Tarix və Saat *</label>
                <input
                  type="datetime-local"
                  required
                  value={editEventRawDate || parseToDateTimeLocal(editingEvent.datetime) || ''}
                  onChange={(e) => handleEditEventDateChange(e.target.value)}
                  className="admin-input"
                />
                {editingEvent.datetime && (
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}>
                    ✓ Format: {editingEvent.datetime}
                  </span>
                )}
              </div>
              <div>
                <label className="admin-label">Spiker / Aparıcı</label>
                <select
                  value={editingEvent.speaker || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, speaker: e.target.value })}
                  className="admin-select"
                >
                  <option value="">-- İstifadəçi / Spiker Seçin --</option>
                  {editingEvent.speaker && !speakerOptions.some(u => u.name === editingEvent.speaker) && (
                    <option value={editingEvent.speaker}>
                      {editingEvent.speaker} (Mövcud)
                    </option>
                  )}
                  {speakerOptions.map(u => (
                    <option key={u.id} value={u.name}>
                      {u.name} {u.role ? `(${u.role})` : ''} {u.email ? `— ${u.email}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Maksimum Yer (Limit)</label>
                <input
                  type="number"
                  value={editingEvent.capacity}
                  onChange={(e) => setEditingEvent({ ...editingEvent, capacity: Number(e.target.value) })}
                  className="admin-input"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Qısa Təsvir</label>
              <textarea
                rows="2"
                value={editingEvent.desc || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, desc: e.target.value })}
                className="admin-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Image upload & URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="admin-label">Tədbir Şəkli (URL və ya Şəkil Yüklə)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="https://... və ya fayl seçin"
                  value={editingEvent.image || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                  className="admin-input"
                  style={{ flex: 1 }}
                />
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload_file</span>
                  <span>Şəkil Seç</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileToDataUrl(e.target.files[0], (dataUrl) => {
                          setEditingEvent(prev => ({ ...prev, image: dataUrl }));
                        });
                      }
                    }}
                  />
                </label>
              </div>
              {editingEvent.image && (
                <div style={{ marginTop: '4px' }}>
                  <div style={{ position: 'relative', width: '130px', height: '76px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                    <img
                      src={editingEvent.image}
                      alt="Tədbir"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextElementSibling) {
                          e.target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        display: 'none',
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#fef2f2',
                        color: '#b91c1c',
                        fontSize: '10px',
                        fontWeight: 600,
                        textAlign: 'center',
                        padding: '4px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#ef4444' }}>broken_image</span>
                      <span>Format xətası</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, image: '' })}
                      title="Şəkli sil"
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  {editingEvent.image.startsWith('data:') && editingEvent.image.length <= 500 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '6px 10px', borderRadius: '6px', marginTop: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>warning</span>
                      <span>Köhnə şəkil bazada natamam saxlanılıb. Zəhmət olmasa <strong>Şəkil Seç</strong> düyməsi ilə yenidən yükləyin.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Ödəniş Növü</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingEvent({ ...editingEvent, isFree: true, price: '' })}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: editingEvent.isFree ? '1px solid #10b981' : '1px solid #cbd5e1',
                      background: editingEvent.isFree ? '#ecfdf5' : '#ffffff',
                      color: editingEvent.isFree ? '#047857' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>money_off</span>
                    <span>Ödənişsiz (Pulsuz)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingEvent({ ...editingEvent, isFree: false })}
                    style={{
                      flex: 1,
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: !editingEvent.isFree ? '1px solid #b45309' : '1px solid #cbd5e1',
                      background: !editingEvent.isFree ? '#fffbeb' : '#ffffff',
                      color: !editingEvent.isFree ? '#b45309' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>payments</span>
                    <span>Ödənişli</span>
                  </button>
                </div>
              </div>

              {!editingEvent.isFree && (
                <div>
                  <label className="admin-label">Məbləğ / Qiymət (AZN) *</label>
                  <input
                    type="text"
                    required={!editingEvent.isFree}
                    placeholder="məs: 25 AZN və ya 50 ₼"
                    value={editingEvent.price || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })}
                    className="admin-input"
                  />
                </div>
              )}

              <div>
                <label className="admin-label">Tədbir Statusu</label>
                <select
                  value={editingEvent.status || 'Aktiv'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                  className="admin-select"
                >
                  <option value="Aktiv">Aktiv (Qeydiyyat Açıqdır)</option>
                  <option value="Gözlənilir">Gözlənilir (Planlaşdırılır)</option>
                  <option value="Tamamlandı">Tamamlandı (Başa Çatdı)</option>
                  <option value="Bağlıdır">Bağlıdır (Qeydiyyat Dayandırılıb)</option>
                </select>
              </div>
            </div>

            {/* Inline Translations Panel - Events */}
            <AdminInlineTranslator
              item={editingEvent}
              fields={[
                { key: 'title', label: 'Tədbir Başlığı' },
                { key: 'desc', label: 'Qısa Təsvir', type: 'textarea' },
                { key: 'typeBadge', label: 'Format / Növ Nişanı' }
              ]}
              activeLang={editEventTransLang}
              setActiveLang={setEditEventTransLang}
              onUpdate={(updates) => setEditingEvent({ ...editingEvent, ...updates })}
              isOpen={editEventTransOpen}
              setIsOpen={setEditEventTransOpen}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => { setEditingEvent(null); setEditEventRawDate(''); }}
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

      {/* Add Event Popup Modal */}
      <AdminPopupModal
        isOpen={showAddForm}
        title="Yeni Tədbir Əlavə Et"
        icon="add_circle"
        onClose={() => setShowAddForm(false)}
      >
        <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Tədbir Başlığı *</label>
              <input
                type="text"
                required
                placeholder="məsələn: Sükut və Daxili Güc Masterklası"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Format / Növ</label>
              <select
                value={newEventTypeBadge}
                onChange={(e) => setNewEventTypeBadge(e.target.value)}
                className="admin-select"
              >
                <option value="VEBİNAR">VEBİNAR</option>
                <option value="CANLI VEBİNAR">CANLI VEBİNAR</option>
                <option value="MASTERKLAS">MASTERKLAS</option>
                <option value="CANLI SESSİYA">CANLI SESSİYA</option>
                <option value="SEMİNAR">SEMİNAR</option>
                <option value="OFLAYN SEMİNAR">OFLAYN SEMİNAR</option>
                <option value="MEDİTASİYA">MEDİTASİYA</option>
                <option value="MEDİTASİYA GECƏSİ">MEDİTASİYA GECƏSİ</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Tarix və Saat *</label>
              <input
                type="datetime-local"
                required
                value={newEventRawDate}
                onChange={(e) => handleNewEventDateChange(e.target.value)}
                className="admin-input"
              />
              {newEventDate && (
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600, display: 'inline-block', marginTop: '4px' }}>
                  ✓ Format: {newEventDate}
                </span>
              )}
            </div>
            <div>
              <label className="admin-label">Spiker / Aparıcı</label>
              <select
                value={newEventSpeaker}
                onChange={(e) => setNewEventSpeaker(e.target.value)}
                className="admin-select"
              >
                <option value="">-- İstifadəçi / Spiker Seçin --</option>
                {newEventSpeaker && !speakerOptions.some(u => u.name === newEventSpeaker) && (
                  <option value={newEventSpeaker}>{newEventSpeaker}</option>
                )}
                {speakerOptions.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} {u.role ? `(${u.role})` : ''} {u.email ? `— ${u.email}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Maksimum İştirakçı Limiti</label>
              <input
                type="number"
                value={newEventCapacity}
                onChange={(e) => setNewEventCapacity(e.target.value)}
                className="admin-input"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Qısa Təsvir</label>
            <textarea
              rows="2"
              value={newEventDesc}
              onChange={(e) => setNewEventDesc(e.target.value)}
              placeholder="Tədbirin mövzusu, hədəf auditoriyası və praktiki detallar..."
              className="admin-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Image upload & URL for New Event */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label className="admin-label">Tədbir Şəkli (URL və ya Şəkil Yüklə)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="https://... və ya fayl seçin"
                value={newEventImage}
                onChange={(e) => setNewEventImage(e.target.value)}
                className="admin-input"
                style={{ flex: 1 }}
              />
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '6px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                fontSize: '11px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload_file</span>
                <span>Şəkil Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileToDataUrl(e.target.files[0], (dataUrl) => {
                        setNewEventImage(dataUrl);
                      });
                    }
                  }}
                />
              </label>
            </div>
            {newEventImage && (
              <div style={{ marginTop: '4px' }}>
                <div style={{ position: 'relative', width: '130px', height: '76px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                  <img
                    src={newEventImage}
                    alt="Yeni tədbir"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextElementSibling) {
                        e.target.nextElementSibling.style.display = 'flex';
                      }
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      display: 'none',
                      width: '100%',
                      height: '100%',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fef2f2',
                      color: '#b91c1c',
                      fontSize: '10px',
                      fontWeight: 600,
                      textAlign: 'center',
                      padding: '4px'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#ef4444' }}>broken_image</span>
                    <span>Format xətası</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewEventImage('')}
                    title="Şəkli sil"
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price & Status for New Event */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Ödəniş Növü</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setNewEventIsFree(true); setNewEventPrice(''); }}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: newEventIsFree ? '1px solid #10b981' : '1px solid #cbd5e1',
                    background: newEventIsFree ? '#ecfdf5' : '#ffffff',
                    color: newEventIsFree ? '#047857' : '#64748b',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>money_off</span>
                  <span>Ödənişsiz (Pulsuz)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewEventIsFree(false)}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: !newEventIsFree ? '1px solid #b45309' : '1px solid #cbd5e1',
                    background: !newEventIsFree ? '#fffbeb' : '#ffffff',
                    color: !newEventIsFree ? '#b45309' : '#64748b',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>payments</span>
                  <span>Ödənişli</span>
                </button>
              </div>
            </div>

            {!newEventIsFree && (
              <div>
                <label className="admin-label">Məbləğ / Qiymət (AZN) *</label>
                <input
                  type="text"
                  required={!newEventIsFree}
                  placeholder="məs: 25 AZN və ya 50 ₼"
                  value={newEventPrice}
                  onChange={(e) => setNewEventPrice(e.target.value)}
                  className="admin-input"
                />
              </div>
            )}

            <div>
              <label className="admin-label">Tədbir Statusu</label>
              <select
                value={newEventStatus}
                onChange={(e) => setNewEventStatus(e.target.value)}
                className="admin-select"
              >
                <option value="Aktiv">Aktiv (Qeydiyyat Açıqdır)</option>
                <option value="Gözlənilir">Gözlənilir (Planlaşdırılır)</option>
                <option value="Tamamlandı">Tamamlandı (Başa Çatdı)</option>
                <option value="Bağlıdır">Bağlıdır (Qeydiyyat Dayandırılıb)</option>
              </select>
            </div>
          </div>

          {/* Inline Translations Panel - New Event */}
          <AdminInlineTranslator
            item={{
              title: newEventTitle,
              desc: newEventDesc,
              typeBadge: newEventTypeBadge,
              translations: newEventTranslations
            }}
            fields={[
              { key: 'title', label: 'Tədbir Başlığı' },
              { key: 'desc', label: 'Qısa Təsvir', type: 'textarea' },
              { key: 'typeBadge', label: 'Format / Növ Nişanı' }
            ]}
            activeLang={newEventTransLang}
            setActiveLang={setNewEventTransLang}
            onUpdate={(updates) => {
              if (updates.translations) {
                setNewEventTranslations(updates.translations);
              }
            }}
            isOpen={newEventTransOpen}
            setIsOpen={setNewEventTransOpen}
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
              <span>Tədbiri Təqvimə Əlavə Et</span>
            </button>
          </div>
        </form>
      </AdminPopupModal>

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>search</span>
          <input
            type="text"
            placeholder="Tədbir başlığı və ya spiker ilə axtar..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="admin-input"
            style={{ paddingLeft: '34px' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="admin-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '11px' }}
          >
            <option value="all">Bütün Formatlar</option>
            <option value="VEBİNAR">Vebinar</option>
            <option value="MASTERKLAS">Masterklas</option>
            <option value="CANLI SESSİYA">Canlı Sessiya</option>
            <option value="SEMİNAR">Seminar</option>
            <option value="MEDİTASİYA">Meditasiya</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '8px' }}>event_busy</span>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>Uyğun tədbir tapılmadı</h5>
          <p style={{ fontSize: '12px', margin: 0 }}>Axtarış sorğusunu dəyişin və ya yeni tədbir əlavə edin.</p>
          {(searchTerm || typeFilter !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setTypeFilter('all'); }}
              className="admin-btn-secondary"
              style={{ marginTop: '12px', fontSize: '11px' }}
            >
              Filtrləri Sıfırla
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paginatedEvents.map(e => {
            const isFree = !e.price || ['pulsuz', 'ödənişsiz', '0', '0 ₼', '0 azn'].includes(String(e.price).trim().toLowerCase());
            const statusColor = e.status === 'Tamamlandı'
              ? { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' }
              : e.status === 'Gözlənilir'
              ? { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' }
              : e.status === 'Bağlıdır'
              ? { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' }
              : { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' };

            return (
              <div key={e.id} className="admin-list-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
                  {/* Thumbnail */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {e.image ? (
                      <img src={e.image} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#94a3b8' }}>
                        event
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className="admin-badge-gold">{e.typeBadge}</span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: statusColor.bg,
                        color: statusColor.text,
                        border: `1px solid ${statusColor.border}`
                      }}>
                        {e.status || 'Aktiv'}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: isFree ? '#ecfdf5' : '#fffbeb',
                        color: isFree ? '#047857' : '#b45309',
                        border: isFree ? '1px solid #a7f3d0' : '1px solid #fde68a'
                      }}>
                        {isFree ? 'Ödənişsiz' : e.price}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{e.datetime}</span>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}>
                        {e.registered || 0} / {e.capacity} İştirakçı
                      </span>
                    </div>
                    <h5 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#0f172a', margin: '0 0 4px 0' }}>
                      "{e.title}"
                    </h5>
                    {e.desc && <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: '0 0 8px 0', maxWidth: '700px' }}>{e.desc}</p>}
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Aparıcı / Spiker: <strong style={{ color: '#0f172a' }}>{e.speaker}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(e)}
                    className="admin-btn-edit"
                    title="Tədbiri redaktə et"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                    <span>Redaktə</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventToDelete(e)}
                    className="admin-btn-danger"
                    title="Sil"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Səhifə {currentPage} / {totalPages} (Cəmi: {filteredEvents.length} tədbir)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="admin-btn-secondary"
              style={{ padding: '5px 10px', fontSize: '11px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Əvvəlki
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '4px 9px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: currentPage === page ? 700 : 500,
                  cursor: 'pointer',
                  border: currentPage === page ? '1px solid #fde68a' : '1px solid #e2e8f0',
                  background: currentPage === page ? '#fffbeb' : '#ffffff',
                  color: currentPage === page ? '#b45309' : '#64748b'
                }}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="admin-btn-secondary"
              style={{ padding: '5px 10px', fontSize: '11px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Növbəti →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminInlineTranslator from './AdminInlineTranslator';
import AdminConfirmModal from './AdminConfirmModal';

const ITEMS_PER_PAGE = 8;

export default function AdminEventsTab() {
  const {
    eventsList = [],
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

  // Add Event State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSpeaker, setNewEventSpeaker] = useState('Dr. Leyla Əliyeva');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState('100');
  const [newEventTypeBadge, setNewEventTypeBadge] = useState('VEBİNAR');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventTranslations, setNewEventTranslations] = useState({});
  const [newEventTransOpen, setNewEventTransOpen] = useState(false);
  const [newEventTransLang, setNewEventTransLang] = useState('en');

  // Edit Event State
  const [editingEvent, setEditingEvent] = useState(null);
  const [editEventTransLang, setEditEventTransLang] = useState('en');
  const [editEventTransOpen, setEditEventTransOpen] = useState(false);

  // Delete Confirmation State
  const [eventToDelete, setEventToDelete] = useState(null);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter(e => {
      const matchSearch = (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.speaker || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.datetime || '').toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) {
      showToast('Zəhmət olmasa tədbirin başlığını və tarixini qeyd edin', 'warning');
      return;
    }
    addEvent({
      title: newEventTitle.trim(),
      speaker: newEventSpeaker,
      datetime: newEventDate.trim(),
      capacity: newEventCapacity,
      typeBadge: newEventTypeBadge,
      desc: newEventDesc || 'İnteraktiv masterklas və praktiki sessiya.',
      translations: newEventTranslations
    });
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
    setNewEventTranslations({});
    setNewEventTransOpen(false);
    setShowAddForm(false);
  };

  const handleSaveEditEvent = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    updateEvent(editingEvent.id, {
      title: editingEvent.title,
      speaker: editingEvent.speaker,
      datetime: editingEvent.datetime,
      capacity: Number(editingEvent.capacity) || 100,
      registered: Number(editingEvent.registered) || 0,
      typeBadge: editingEvent.typeBadge,
      desc: editingEvent.desc,
      translations: editingEvent.translations || {}
    });
    setEditingEvent(null);
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
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-btn-primary"
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {showAddForm ? 'close' : 'add_circle'}
            </span>
            <span>{showAddForm ? 'Bağla' : 'Yeni Tədbir'}</span>
          </button>
        </div>
      </div>

      {/* Edit Event Panel */}
      {editingEvent && (
        <form onSubmit={handleSaveEditEvent} className="admin-edit-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid rgba(197,160,89,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>edit_calendar</span>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Tədbiri Redaktə Et: <span style={{ color: '#b45309' }}>"{editingEvent.title}"</span>
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setEditingEvent(null)}
              className="admin-btn-secondary"
              style={{ padding: '4px 10px', fontSize: '11px' }}
            >
              Ləğv Et ✕
            </button>
          </div>

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
                <option value="MASTERKLAS">MASTERKLAS</option>
                <option value="CANLI SESSİYA">CANLI SESSİYA</option>
                <option value="SEMİNAR">SEMİNAR</option>
                <option value="MEDİTASİYA">MEDİTASİYA</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Tarix və Saat *</label>
              <input
                type="text"
                required
                value={editingEvent.datetime}
                onChange={(e) => setEditingEvent({ ...editingEvent, datetime: e.target.value })}
                placeholder="məsələn: 18 DEKABR, 20:00"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Spiker / Aparıcı</label>
              <input
                type="text"
                value={editingEvent.speaker}
                onChange={(e) => setEditingEvent({ ...editingEvent, speaker: e.target.value })}
                className="admin-input"
              />
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Qeydiyyatlı Sayı</label>
              <input
                type="number"
                value={editingEvent.registered || 0}
                onChange={(e) => setEditingEvent({ ...editingEvent, registered: Number(e.target.value) })}
                className="admin-input"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Qısa Təsvir</label>
              <input
                type="text"
                value={editingEvent.desc || ''}
                onChange={(e) => setEditingEvent({ ...editingEvent, desc: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          {/* Inline Translations Panel - Events */}
          <AdminInlineTranslator
            item={editingEvent}
            fields={[
              { key: 'title', label: 'Tədbir Başlığı' },
              { key: 'desc', label: 'Qısa Təsvir', type: 'textarea' },
              { key: 'speaker', label: 'Spiker' },
              { key: 'datetime', label: 'Tarix və Saat' },
              { key: 'typeBadge', label: 'Format / Növ Nişanı' }
            ]}
            activeLang={editEventTransLang}
            setActiveLang={setEditEventTransLang}
            onUpdate={(updates) => setEditingEvent({ ...editingEvent, ...updates })}
            isOpen={editEventTransOpen}
            setIsOpen={setEditEventTransOpen}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
            <button type="submit" className="admin-btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
              <span>Dəyişiklikləri Yadda Saxla</span>
            </button>
            <button
              type="button"
              onClick={() => setEditingEvent(null)}
              className="admin-btn-secondary"
            >
              Ləğv Et
            </button>
          </div>
        </form>
      )}

      {/* Add Event Form (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleCreateEvent} className="admin-card animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '14px', border: '1px solid #c5a059' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#c5a059', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
              <span>Yeni Tədbir Əlavə Et</span>
            </h5>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>

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
                <option value="MASTERKLAS">MASTERKLAS</option>
                <option value="CANLI SESSİYA">CANLI SESSİYA</option>
                <option value="SEMİNAR">SEMİNAR</option>
                <option value="MEDİTASİYA">MEDİTASİYA</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Tarix və Saat *</label>
              <input
                type="text"
                required
                placeholder="18 DEKABR, 20:00"
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Spiker</label>
              <input
                type="text"
                value={newEventSpeaker}
                onChange={(e) => setNewEventSpeaker(e.target.value)}
                className="admin-input"
              />
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

          {/* Inline Translations Panel - New Event */}
          <AdminInlineTranslator
            item={{
              title: newEventTitle,
              desc: newEventDesc,
              speaker: newEventSpeaker,
              datetime: newEventDate,
              typeBadge: newEventTypeBadge,
              translations: newEventTranslations
            }}
            fields={[
              { key: 'title', label: 'Tədbir Başlığı' },
              { key: 'desc', label: 'Qısa Təsvir', type: 'textarea' },
              { key: 'speaker', label: 'Spiker' },
              { key: 'datetime', label: 'Tarix və Saat' },
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
            <button type="submit" className="admin-btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              <span>Tədbiri Təqvimə Əlavə Et</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="admin-btn-secondary"
            >
              Ləğv Et
            </button>
          </div>
        </form>
      )}

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
          {paginatedEvents.map(e => (
            <div key={e.id} className="admin-list-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span className="admin-badge-gold">{e.typeBadge}</span>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setEditingEvent(e)}
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
          ))}
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

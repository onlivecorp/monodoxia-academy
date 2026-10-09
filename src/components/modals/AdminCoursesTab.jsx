import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminInlineTranslator from './AdminInlineTranslator';
import AdminConfirmModal from './AdminConfirmModal';
import AdminPopupModal from './AdminPopupModal';

const ITEMS_PER_PAGE = 8;

export default function AdminCoursesTab() {
  const {
    coursesList = [],
    addCourse,
    updateCourse,
    deleteCourse,
    categoriesList = [],
    showToast
  } = useApp();

  // Search, Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Course State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('Dr. Leyla Əliyeva');
  const [newCoursePrice, setNewCoursePrice] = useState('₼ 450');
  const [newCourseCategory, setNewCourseCategory] = useState('psychology');
  const [newCourseDuration, setNewCourseDuration] = useState('8 Həftə');
  const [newCourseBadge, setNewCourseBadge] = useState('AKREDİTASİYALI');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseTranslations, setNewCourseTranslations] = useState({});
  const [newCourseTransOpen, setNewCourseTransOpen] = useState(false);
  const [newCourseTransLang, setNewCourseTransLang] = useState('en');

  // Edit Course State
  const [editingCourse, setEditingCourse] = useState(null);
  const [editCourseTransLang, setEditCourseTransLang] = useState('en');
  const [editCourseTransOpen, setEditCourseTransOpen] = useState(false);

  // Delete Confirmation State
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return coursesList.filter(c => {
      const matchSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.instructor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [coursesList, searchTerm, categoryFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      showToast('Zəhmət olmasa kursun başlığını daxil edin', 'warning');
      return;
    }
    addCourse({
      title: newCourseTitle.trim(),
      instructor: newCourseInstructor,
      price: newCoursePrice,
      category: newCourseCategory,
      duration: newCourseDuration,
      badge: newCourseBadge,
      description: newCourseDesc || 'Praktiki dərslər, keyslər və beynəlxalq standartlara uyğun tədris planı.',
      translations: newCourseTranslations
    });
    setNewCourseTitle('');
    setNewCourseDesc('');
    setNewCourseTranslations({});
    setNewCourseTransOpen(false);
    setShowAddForm(false);
  };

  const handleSaveEditCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse.id, {
      title: editingCourse.title,
      instructor: editingCourse.instructor,
      price: editingCourse.price,
      category: editingCourse.category,
      duration: editingCourse.duration,
      badge: editingCourse.badge,
      status: editingCourse.status,
      occupancy: Number(editingCourse.occupancy) || 0,
      description: editingCourse.description,
      translations: editingCourse.translations || {}
    });
    setEditingCourse(null);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setCourseToDelete(null);
    }
  };

  const courseCategories = (categoriesList || []).filter(c => c.type === 'course' || c.type === 'all');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(courseToDelete)}
        title="Kursu Sil"
        message="Bu kursu və ona aid məlumatları silmək istədiyinizə əminsiniz?"
        itemName={courseToDelete ? courseToDelete.title : ''}
        confirmText="Bəli, Kursu Sil"
        onConfirm={confirmDelete}
        onCancel={() => setCourseToDelete(null)}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">Akademiya və Kursların İdarəedilməsi</h4>
          <p className="admin-section-subtitle">Yeni kurslar yaradın, redaktə edin, qiymətləri, müəllimləri və tədris planını tənzimləyin</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="admin-count-badge">Cəmi: {coursesList.length} kurs</span>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-btn-primary"
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
            <span>Yeni Kurs</span>
          </button>
        </div>
      </div>

      {/* Edit Course Popup Modal */}
      <AdminPopupModal
        isOpen={Boolean(editingCourse)}
        title={editingCourse ? `Kursu Redaktə Et: "${editingCourse.title}"` : 'Kursu Redaktə Et'}
        icon="edit_note"
        onClose={() => setEditingCourse(null)}
      >
        {editingCourse && (
          <form onSubmit={handleSaveEditCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="admin-label">Kursun Başlığı *</label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Qiymət *</label>
                <input
                  type="text"
                  required
                  value={editingCourse.price}
                  onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                  className="admin-input"
                  style={{ fontWeight: 700, color: '#c5a059', fontFamily: "'Playfair Display',serif" }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Kateqoriya (Mərkəzləşdirilmiş)</label>
                <select
                  value={editingCourse.category}
                  onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                  className="admin-select"
                >
                  {courseCategories.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.name} ({cat.key})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Aparıcı Kouç</label>
                <input
                  type="text"
                  value={editingCourse.instructor}
                  onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Müddət</label>
                <input
                  type="text"
                  value={editingCourse.duration}
                  onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Nişan (Badge)</label>
                <input
                  type="text"
                  value={editingCourse.badge}
                  onChange={(e) => setEditingCourse({ ...editingCourse, badge: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Status</label>
                <select
                  value={editingCourse.status}
                  onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                  className="admin-select"
                >
                  <option value="Qrup qəbulu aktivdir">Qrup qəbulu aktivdir</option>
                  <option value="Tezliklə">Tezliklə</option>
                  <option value="Tam Dolub">Tam Dolub</option>
                  <option value="Bağlanıb">Bağlanıb</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Doluluq Faizi (0-100%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingCourse.occupancy ?? 0}
                  onChange={(e) => setEditingCourse({ ...editingCourse, occupancy: Number(e.target.value) })}
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Təsvir</label>
              <textarea
                rows="3"
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                className="admin-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Inline Translations Panel - Course */}
            <AdminInlineTranslator
              item={editingCourse}
              fields={[
                { key: 'title', label: 'Kurs Başlığı' },
                { key: 'description', label: 'Təsvir', type: 'textarea', rows: 3 },
                { key: 'instructor', label: 'Aparıcı Kouç' },
                { key: 'duration', label: 'Müddət' },
                { key: 'badge', label: 'Nişan (Badge)' },
                { key: 'status', label: 'Status' }
              ]}
              activeLang={editCourseTransLang}
              setActiveLang={setEditCourseTransLang}
              onUpdate={(updates) => setEditingCourse({ ...editingCourse, ...updates })}
              isOpen={editCourseTransOpen}
              setIsOpen={setEditCourseTransOpen}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
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

      {/* Add Course Popup Modal */}
      <AdminPopupModal
        isOpen={showAddForm}
        title="Yeni Kurs Əlavə Et"
        icon="add_circle"
        onClose={() => setShowAddForm(false)}
      >
        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Kursun Başlığı *</label>
              <input
                type="text"
                required
                placeholder="Məs: Emosional Zəka və Stress İdarəetməsi"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Qiymət *</label>
              <input
                type="text"
                required
                value={newCoursePrice}
                onChange={(e) => setNewCoursePrice(e.target.value)}
                className="admin-input"
                style={{ fontWeight: 700, color: '#c5a059', fontFamily: "'Playfair Display',serif" }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Kateqoriya (Mərkəzləşdirilmiş)</label>
              <select
                value={newCourseCategory}
                onChange={(e) => setNewCourseCategory(e.target.value)}
                className="admin-select"
              >
                {courseCategories.map(cat => (
                  <option key={cat.key} value={cat.key}>
                    {cat.name} ({cat.key})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Aparıcı Kouç</label>
              <input
                type="text"
                value={newCourseInstructor}
                onChange={(e) => setNewCourseInstructor(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Müddət</label>
              <input
                type="text"
                value={newCourseDuration}
                onChange={(e) => setNewCourseDuration(e.target.value)}
                placeholder="8 Həftə"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Nişan (Badge)</label>
              <input
                type="text"
                value={newCourseBadge}
                onChange={(e) => setNewCourseBadge(e.target.value)}
                placeholder="AKREDİTASİYALI"
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="admin-label">Təsvir</label>
            <textarea
              rows="2"
              value={newCourseDesc}
              onChange={(e) => setNewCourseDesc(e.target.value)}
              placeholder="Kursun məqsədi və qazanılacaq nəticələr..."
              className="admin-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Inline Translations Panel - New Course */}
          <AdminInlineTranslator
            item={{
              title: newCourseTitle,
              description: newCourseDesc,
              instructor: newCourseInstructor,
              duration: newCourseDuration,
              category: newCourseCategory,
              price: newCoursePrice,
              badge: newCourseBadge,
              status: 'Qrup qəbulu aktivdir',
              translations: newCourseTranslations
            }}
            fields={[
              { key: 'title', label: 'Kurs Başlığı' },
              { key: 'description', label: 'Təsvir', type: 'textarea', rows: 3 },
              { key: 'instructor', label: 'Aparıcı Kouç' },
              { key: 'duration', label: 'Müddət' },
              { key: 'badge', label: 'Nişan (Badge)' }
            ]}
            activeLang={newCourseTransLang}
            setActiveLang={setNewCourseTransLang}
            onUpdate={(updates) => {
              if (updates.translations) {
                setNewCourseTranslations(updates.translations);
              }
            }}
            isOpen={newCourseTransOpen}
            setIsOpen={setNewCourseTransOpen}
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
              <span>Kursu Əlavə Et</span>
            </button>
          </div>
        </form>
      </AdminPopupModal>

      {/* Filter & Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>search</span>
          <input
            type="text"
            placeholder="Kurs adı və ya kouç ilə axtar..."
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="admin-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '11px' }}
          >
            <option value="all">Bütün Kateqoriyalar</option>
            {courseCategories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="admin-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '11px' }}
          >
            <option value="all">Bütün Statuslar</option>
            <option value="Qrup qəbulu aktivdir">Qrup qəbulu aktivdir</option>
            <option value="Tezliklə">Tezliklə</option>
            <option value="Tam Dolub">Tam Dolub</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '8px' }}>school</span>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>Uyğun kurs tapılmadı</h5>
          <p style={{ fontSize: '12px', margin: 0 }}>Axtarış sorğusunu dəyişin və ya yeni kurs əlavə edin.</p>
          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setStatusFilter('all'); }}
              className="admin-btn-secondary"
              style={{ marginTop: '12px', fontSize: '11px' }}
            >
              Filtrləri Sıfırla
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paginatedCourses.map(c => (
            <div key={c.id} className="admin-list-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span className="admin-badge-gold">{c.badge || 'KURS'}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{c.duration}</span>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                    {c.status}
                  </span>
                </div>
                <h5 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#0f172a', margin: '0 0 4px 0' }}>
                  {c.title}
                </h5>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: '0 0 10px 0', maxWidth: '700px' }}>
                  {c.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#64748b', flexWrap: 'wrap' }}>
                  <span>Kouç: <strong style={{ color: '#0f172a' }}>{c.instructor}</strong></span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Doluluq: <strong style={{ color: '#b45309' }}>{c.occupancy || 0}%</strong>
                    <span style={{ display: 'inline-block', width: '48px', height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${Math.min(c.occupancy || 0, 100)}%`, background: 'linear-gradient(90deg,#b45309,#d4af37)', borderRadius: '10px' }} />
                    </span>
                  </span>
                  <span>•</span>
                  <span>Qiymət: <strong style={{ color: '#b45309', fontFamily: "'Playfair Display',serif", fontSize: '13px' }}>{c.price}</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setEditingCourse(c)}
                  className="admin-btn-edit"
                  title="Kursu redaktə et"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                  <span>Redaktə</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourseToDelete(c)}
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
            Səhifə {currentPage} / {totalPages} (Cəmi: {filteredCourses.length} kurs)
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

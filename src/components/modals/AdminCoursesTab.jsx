import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminInlineTranslator from './AdminInlineTranslator';
import AdminConfirmModal from './AdminConfirmModal';
import AdminPopupModal from './AdminPopupModal';
import AdminCourseCategoriesModal from './AdminCourseCategoriesModal';
import { formatCourseDeadline, generateDeadlineTranslations, calculateOccupancy } from '../../utils/courseHelpers';

const ITEMS_PER_PAGE = 8;

export default function AdminCoursesTab() {
  const {
    coursesList = [],
    addCourse,
    updateCourse,
    deleteCourse,
    categoriesList = [],
    applicationsList = [],
    usersList = [],
    coachesList = [],
    showToast
  } = useApp();

  // Search, Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  // Category Manager Modal State
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [categoryModalTarget, setCategoryModalTarget] = useState(null); // 'edit' | 'create' | null

  // Add Course State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('₼ 450');
  const [newCourseCategory, setNewCourseCategory] = useState('psychology');
  const [newCourseDeadline, setNewCourseDeadline] = useState('');
  const [newCourseDuration, setNewCourseDuration] = useState('8 Həftə');
  const [newCourseMaxParticipants, setNewCourseMaxParticipants] = useState(30);
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

  // Users & Coaches Options for Instructor Selection
  const userOptions = useMemo(() => {
    const list = [];
    const seen = new Set();

    // 1. Users from usersList (coaches first, then others)
    const coaches = (usersList || []).filter(u => u.role === 'Kouç');
    const others = (usersList || []).filter(u => u.role !== 'Kouç');

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

    return list;
  }, [usersList, coachesList, coursesList]);

  // Helper: Count active applications for a given course
  const getCourseApplicationsCount = (course) => {
    if (!course) return 0;
    return (applicationsList || []).filter(a =>
      (a.targetId === course.id || a.targetTitle === course.title) &&
      !a.archived &&
      a.status !== 'İmtina'
    ).length;
  };

  // Helper: Get effective total applicants (initial baseline + real-time applications)
  const getCourseEffectiveApplicants = (course) => {
    if (!course) return 0;
    const realApps = getCourseApplicationsCount(course);
    const maxP = course.maxParticipants || 30;
    const baseline = course.initialParticipants !== undefined
      ? course.initialParticipants
      : (course.occupancy ? Math.round(((course.occupancy || 0) * maxP) / 100) : 0);
    return baseline + realApps;
  };

  // Helper: Compute real-time occupancy percentage
  const getCourseComputedOccupancy = (course) => {
    if (!course) return 0;
    const maxP = Math.max(1, course.maxParticipants || 30);
    const totalApps = getCourseEffectiveApplicants(course);
    return Math.min(100, Math.round((totalApps / maxP) * 100));
  };

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

  // Handle deadline change for New Course
  const handleNewCourseDeadlineChange = (val) => {
    setNewCourseDeadline(val);
    if (val) {
      const azDuration = formatCourseDeadline(val, 'az');
      setNewCourseDuration(azDuration);
      const autoTrans = generateDeadlineTranslations(val);
      setNewCourseTranslations(prev => ({
        ...prev,
        az: { ...(prev.az || {}), duration: autoTrans.az.duration },
        en: { ...(prev.en || {}), duration: autoTrans.en.duration },
        tr: { ...(prev.tr || {}), duration: autoTrans.tr.duration },
        ru: { ...(prev.ru || {}), duration: autoTrans.ru.duration }
      }));
    }
  };

  // Handle deadline change for Editing Course
  const handleEditCourseDeadlineChange = (val) => {
    if (!editingCourse) return;
    const azDuration = val ? formatCourseDeadline(val, 'az') : editingCourse.duration;
    const autoTrans = val ? generateDeadlineTranslations(val) : {};
    
    setEditingCourse(prev => {
      const curTrans = prev.translations || {};
      return {
        ...prev,
        deadline: val,
        duration: azDuration,
        translations: {
          ...curTrans,
          az: { ...(curTrans.az || {}), duration: autoTrans.az?.duration || curTrans.az?.duration || azDuration },
          en: { ...(curTrans.en || {}), duration: autoTrans.en?.duration || curTrans.en?.duration },
          tr: { ...(curTrans.tr || {}), duration: autoTrans.tr?.duration || curTrans.tr?.duration },
          ru: { ...(curTrans.ru || {}), duration: autoTrans.ru?.duration || curTrans.ru?.duration }
        }
      };
    });
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) {
      showToast('Zəhmət olmasa kursun başlığını daxil edin', 'warning');
      return;
    }

    const maxP = Math.max(1, Number(newCourseMaxParticipants) || 30);
    const durationText = newCourseDeadline ? formatCourseDeadline(newCourseDeadline, 'az') : newCourseDuration;
    const autoTrans = newCourseDeadline ? generateDeadlineTranslations(newCourseDeadline) : {};

    const mergedTranslations = {
      ...newCourseTranslations,
      az: {
        ...(newCourseTranslations.az || {}),
        title: newCourseTitle.trim(),
        description: newCourseDesc || 'Praktiki dərslər, keyslər və beynəlxalq standartlara uyğun tədris planı.',
        badge: newCourseBadge,
        status: 'Qrup qəbulu aktivdir',
        duration: autoTrans.az?.duration || durationText
      },
      en: { ...(newCourseTranslations.en || {}), duration: autoTrans.en?.duration || newCourseTranslations.en?.duration },
      tr: { ...(newCourseTranslations.tr || {}), duration: autoTrans.tr?.duration || newCourseTranslations.tr?.duration },
      ru: { ...(newCourseTranslations.ru || {}), duration: autoTrans.ru?.duration || newCourseTranslations.ru?.duration }
    };

    addCourse({
      title: newCourseTitle.trim(),
      instructor: newCourseInstructor,
      price: newCoursePrice,
      category: newCourseCategory,
      deadline: newCourseDeadline || null,
      duration: durationText,
      maxParticipants: maxP,
      initialParticipants: 0,
      occupancy: 0,
      badge: newCourseBadge,
      status: 'Qrup qəbulu aktivdir',
      description: newCourseDesc || 'Praktiki dərslər, keyslər və beynəlxalq standartlara uyğun tədris planı.',
      translations: mergedTranslations
    });

    setNewCourseTitle('');
    setNewCourseDesc('');
    setNewCourseDeadline('');
    setNewCourseTranslations({});
    setNewCourseTransOpen(false);
    setShowAddForm(false);
  };

  const handleSaveEditCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;

    const computedOcc = getCourseComputedOccupancy(editingCourse);

    updateCourse(editingCourse.id, {
      title: editingCourse.title,
      instructor: editingCourse.instructor,
      price: editingCourse.price,
      category: editingCourse.category,
      deadline: editingCourse.deadline || null,
      duration: editingCourse.duration,
      maxParticipants: Math.max(1, Number(editingCourse.maxParticipants) || 30),
      initialParticipants: editingCourse.initialParticipants,
      occupancy: computedOcc,
      badge: editingCourse.badge,
      status: editingCourse.status,
      description: editingCourse.description,
      translations: {
        ...(editingCourse.translations || {}),
        az: {
          ...(editingCourse.translations?.az || {}),
          title: editingCourse.title,
          description: editingCourse.description,
          badge: editingCourse.badge,
          status: editingCourse.status,
          duration: editingCourse.duration
        }
      }
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
      {/* Category Manager Modal */}
      <AdminCourseCategoriesModal
        isOpen={categoriesModalOpen}
        onClose={() => {
          setCategoriesModalOpen(false);
          setCategoryModalTarget(null);
        }}
        onSelectCategory={(selectedCatKey) => {
          if (categoryModalTarget === 'edit' && editingCourse) {
            setEditingCourse(prev => ({ ...prev, category: selectedCatKey }));
          } else if (categoryModalTarget === 'create') {
            setNewCourseCategory(selectedCatKey);
          }
          setCategoriesModalOpen(false);
          setCategoryModalTarget(null);
        }}
      />

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
          <button
            type="button"
            onClick={() => {
              setCategoryModalTarget(null);
              setCategoriesModalOpen(true);
            }}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '7px 12px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>category</span>
            <span>Kateqoriyaları İdarə Et</span>
          </button>
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
        {editingCourse && (() => {
          const courseAppsCount = getCourseApplicationsCount(editingCourse);
          const totalApps = getCourseEffectiveApplicants(editingCourse);
          const maxP = Math.max(1, Number(editingCourse.maxParticipants) || 30);
          const computedOcc = Math.min(100, Math.round((totalApps / maxP) * 100));

          return (
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
                {/* Centralized Category with quick modal trigger */}
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
                  <select
                    value={editingCourse.instructor || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                    className="admin-select"
                  >
                    <option value="">-- İstifadəçi / Kouç Seçin --</option>
                    {editingCourse.instructor && !userOptions.some(u => u.name === editingCourse.instructor) && (
                      <option value={editingCourse.instructor}>
                        {editingCourse.instructor} (Mövcud)
                      </option>
                    )}
                    {userOptions.map(u => (
                      <option key={u.id} value={u.name}>
                        {u.name} {u.role ? `(${u.role})` : ''} {u.email ? `— ${u.email}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Müddət / Son Tarix via DateTime picker */}
                <div>
                  <label className="admin-label">Son Tarix & Saat (Müddət Formatı) *</label>
                  <input
                    type="datetime-local"
                    value={editingCourse.deadline || ''}
                    onChange={(e) => handleEditCourseDeadlineChange(e.target.value)}
                    className="admin-input"
                  />
                  {editingCourse.deadline ? (
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: 600 }}>
                        {formatCourseDeadline(editingCourse.deadline, 'az')}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '9px', background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px' }}>
                          ✓ AZ: {formatCourseDeadline(editingCourse.deadline, 'az')}
                        </span>
                        <span style={{ fontSize: '9px', background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px' }}>
                          ✓ EN: {formatCourseDeadline(editingCourse.deadline, 'en')}
                        </span>
                        <span style={{ fontSize: '9px', background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px' }}>
                          ✓ TR: {formatCourseDeadline(editingCourse.deadline, 'tr')}
                        </span>
                        <span style={{ fontSize: '9px', background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px' }}>
                          ✓ RU: {formatCourseDeadline(editingCourse.deadline, 'ru')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                      Cari müddət: <strong>{editingCourse.duration}</strong>
                    </div>
                  )}
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

              {/* Status and Automatic Occupancy based on Max Participants & Applications */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
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
                  <label className="admin-label">Maksimum İştirakçı Tutumu (Yer Sayı) *</label>
                  <input
                    type="number"
                    min="1"
                    value={editingCourse.maxParticipants || 30}
                    onChange={(e) => setEditingCourse({
                      ...editingCourse,
                      maxParticipants: Math.max(1, parseInt(e.target.value) || 1)
                    })}
                    className="admin-input"
                  />
                </div>

                {/* Automatic Occupancy Readout Card */}
                <div style={{
                  gridColumn: 'span 2',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>analytics</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        Avtomatik Doluluq Hesabatı (Manual Deyil)
                      </span>
                    </div>
                    <strong style={{ fontSize: '13px', color: computedOcc >= 100 ? '#ef4444' : '#b45309' }}>
                      %{computedOcc} Doluluq ({totalApps} / {maxP} nəfər)
                    </strong>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, computedOcc)}%`,
                      background: computedOcc >= 100 ? '#ef4444' : 'linear-gradient(90deg, #b45309, #d4af37)',
                      borderRadius: '10px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>Sistemdəki aktiv müraciətlər: <strong>{courseAppsCount} nəfər</strong></span>
                    <span>Qalan boş yer: <strong>{Math.max(0, maxP - totalApps)} nəfər</strong></span>
                  </div>
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
          );
        })()}
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
              <select
                value={newCourseInstructor}
                onChange={(e) => setNewCourseInstructor(e.target.value)}
                className="admin-select"
              >
                <option value="">-- İstifadəçi / Kouç Seçin --</option>
                {userOptions.map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name} {u.role ? `(${u.role})` : ''} {u.email ? `— ${u.email}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Son Qeydiyyat Tarixi & Saatı (Müddət)</label>
              <input
                type="datetime-local"
                value={newCourseDeadline}
                onChange={(e) => handleNewCourseDeadlineChange(e.target.value)}
                className="admin-input"
              />
              {newCourseDeadline && (
                <div style={{ fontSize: '10px', color: '#059669', marginTop: '4px' }}>
                  ✓ Tərcümələr avtomatik generasiya olundu: {formatCourseDeadline(newCourseDeadline, 'az')}
                </div>
              )}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Maksimum İştirakçı Tutumu *</label>
              <input
                type="number"
                min="1"
                value={newCourseMaxParticipants}
                onChange={(e) => setNewCourseMaxParticipants(Math.max(1, parseInt(e.target.value) || 1))}
                className="admin-input"
              />
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                Doluluq faizi daxil olan müraciətlərə görə avtomatik hesablanacaq.
              </span>
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
              duration: newCourseDeadline ? formatCourseDeadline(newCourseDeadline, 'az') : newCourseDuration,
              category: newCourseCategory,
              price: newCoursePrice,
              badge: newCourseBadge,
              status: 'Qrup qəbulu aktivdir',
              translations: newCourseTranslations
            }}
            fields={[
              { key: 'title', label: 'Kurs Başlığı' },
              { key: 'description', label: 'Təsvir', type: 'textarea', rows: 3 },
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px', maxWidth: '380px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>search</span>
          <input
            type="text"
            placeholder="Kurs adı və ya kouç ilə axtar..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="admin-input"
            style={{ paddingLeft: '34px', width: '100%' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
            </button>
          )}
        </div>

        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="admin-select"
          style={{ width: 'auto', minWidth: '170px', flexShrink: 0 }}
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
          style={{ width: 'auto', minWidth: '150px', flexShrink: 0 }}
        >
          <option value="all">Bütün Statuslar</option>
          <option value="Qrup qəbulu aktivdir">Qrup qəbulu aktivdir</option>
          <option value="Tezliklə">Tezliklə</option>
          <option value="Tam Dolub">Tam Dolub</option>
        </select>
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
          {paginatedCourses.map(c => {
            const courseApps = getCourseApplicationsCount(c);
            const totalApps = getCourseEffectiveApplicants(c);
            const maxP = c.maxParticipants || 30;
            const occupancy = getCourseComputedOccupancy(c);

            return (
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
                      Doluluq: <strong style={{ color: occupancy >= 100 ? '#ef4444' : '#b45309' }}>%{occupancy}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '10px' }}>({totalApps}/{maxP})</span>
                      <span style={{ display: 'inline-block', width: '48px', height: '5px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                        <span style={{
                          display: 'block',
                          height: '100%',
                          width: `${Math.min(occupancy, 100)}%`,
                          background: occupancy >= 100 ? '#ef4444' : 'linear-gradient(90deg,#b45309,#d4af37)',
                          borderRadius: '10px'
                        }} />
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
            );
          })}
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
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: currentPage === page ? '1px solid #b45309' : '1px solid #cbd5e1',
                  background: currentPage === page ? '#b45309' : '#ffffff',
                  color: currentPage === page ? '#ffffff' : '#475569',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
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

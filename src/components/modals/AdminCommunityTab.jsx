import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import AdminInlineTranslator from './AdminInlineTranslator';
import AdminConfirmModal from './AdminConfirmModal';
import AdminPopupModal from './AdminPopupModal';
import RichTextEditor from '../RichTextEditor';

const ITEMS_PER_PAGE = 8;

export default function AdminCommunityTab() {
  const {
    communityTopics = [],
    addTopic,
    updateTopic,
    deleteTopic,
    pinTopic,
    setWeeklyTopic,
    homeContent,
    categoriesList = [],
    showToast
  } = useApp();

  const weeklyTopicId = homeContent?.community?.weeklyTopicId;

  // Search, Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Topic State
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('İcma Müzakirəsi');
  const [newTopicAuthor, setNewTopicAuthor] = useState('Monodoxia Komandası');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCoverImage, setNewTopicCoverImage] = useState('');
  const [newTopicReadTime, setNewTopicReadTime] = useState('4 dəq');
  const [newTopicStatus, setNewTopicStatus] = useState('published');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [newTopicTranslations, setNewTopicTranslations] = useState({});
  const [newTopicTransOpen, setNewTopicTransOpen] = useState(false);
  const [newTopicTransLang, setNewTopicTransLang] = useState('en');

  // Edit Topic State
  const [editingTopic, setEditingTopic] = useState(null);
  const [editTopicTransLang, setEditTopicTransLang] = useState('en');
  const [editTopicTransOpen, setEditTopicTransOpen] = useState(false);

  // Delete Confirmation State
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const communityCategories = (categoriesList || []).filter(c => c.type === 'community' || c.type === 'all');

  const filteredTopics = useMemo(() => {
    return communityTopics.filter(t => {
      const matchSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.snippet || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.badge || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || t.badge === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [communityTopics, searchTerm, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE) || 1;
  const paginatedTopics = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTopics.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTopics, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleCreateTopic = async (e) => {
    e?.preventDefault();
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      showToast('Zəhmət olmasa məqalə başlığını və məzmununu daxil edin', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      await addTopic(
        newTopicTitle.trim(),
        newTopicContent.trim(),
        newTopicCategory,
        newTopicAuthor,
        newTopicTranslations,
        {
          coverImage: newTopicCoverImage.trim(),
          readTime: newTopicReadTime.trim() || '4 dəq',
          status: newTopicStatus,
          category: newTopicCategory
        }
      );
      setNewTopicTitle('');
      setNewTopicContent('');
      setNewTopicCoverImage('');
      setNewTopicReadTime('4 dəq');
      setNewTopicStatus('published');
      setNewTopicTranslations({});
      setNewTopicTransOpen(false);
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEditTopic = async (e) => {
    e?.preventDefault();
    if (!editingTopic || isSubmitting) return;
    const bodyContent = editingTopic.content || editingTopic.snippet || '';
    const cleanSnippet = bodyContent
      ? bodyContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220)
      : (editingTopic.snippet || '');

    setIsSubmitting(true);
    try {
      await updateTopic(editingTopic.id, {
        title: editingTopic.title,
        badge: editingTopic.badge,
        category: editingTopic.category || editingTopic.badge,
        author: editingTopic.author,
        content: bodyContent,
        snippet: cleanSnippet,
        desc: cleanSnippet,
        coverImage: editingTopic.coverImage || editingTopic.cover_image || '',
        readTime: editingTopic.readTime || editingTopic.read_time || '4 dəq',
        status: editingTopic.status || 'published',
        translations: editingTopic.translations || {}
      });
      setEditingTopic(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (topicToDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await deleteTopic(topicToDelete.id);
      } finally {
        setIsDeleting(false);
        setTopicToDelete(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(topicToDelete)}
        title="İcma Mövzusunu Sil"
        message="Bu mövzunu və ona aid bütün müzakirəni silmək istədiyinizə əminsiniz?"
        itemName={topicToDelete ? topicToDelete.title : ''}
        confirmText={isDeleting ? 'Silinir...' : 'Bəli, Mövzunu Sil'}
        onConfirm={confirmDelete}
        onCancel={() => !isDeleting && setTopicToDelete(null)}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">İcma Forumu və Məzmun Moderasiyası</h4>
          <p className="admin-section-subtitle">Yeni icma müzakirələri yaradın, mövcud mövzuları redaktə edin, sabitləyin və ya həftənin mövzusu təyin edin</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="admin-count-badge">Cəmi: {communityTopics.length} mövzu</span>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="admin-btn-primary"
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_circle</span>
            <span>Yeni Mövzu</span>
          </button>
        </div>
      </div>

      {/* Weekly Topic Quick Setter Card */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #071326 0%, #0d213f 100%)',
        border: '1px solid rgba(197, 160, 89, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(7, 19, 38, 0.25)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '260px', flex: 1 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(197, 160, 89, 0.2)',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            color: '#e5c57d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>star</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#e5c57d', fontWeight: 800 }}>
                Həftənin Mövzusu Təyini
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
              {(() => {
                const cur = communityTopics.find(t => t.id === weeklyTopicId || t.isWeekly || t.badge?.includes('Həftənin Mövzusu'));
                return cur ? `Seçilmiş: "${cur.title}"` : 'Hazırda xüsusi mövzu seçilməyib (default mövzu aktivdir)';
              })()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={(() => {
              const cur = communityTopics.find(t => t.id === weeklyTopicId || t.isWeekly || t.badge?.includes('Həftənin Mövzusu'));
              return cur ? cur.id : '';
            })()}
            onChange={(e) => {
              const targetId = e.target.value;
              if (targetId) setWeeklyTopic(targetId);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(197, 160, 89, 0.4)',
              color: '#ffffff',
              outline: 'none',
              maxWidth: '320px',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ color: '#071326' }}>-- Həftənin Mövzusunu Seçin --</option>
            {communityTopics.map(t => (
              <option key={t.id} value={t.id} style={{ color: '#071326' }}>
                {t.title.length > 50 ? t.title.slice(0, 50) + '...' : t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Edit Topic Popup Modal */}
      <AdminPopupModal
        isOpen={Boolean(editingTopic)}
        title={editingTopic ? `İcma / Blog Məqaləsini Redaktə Et: "${editingTopic.title}"` : 'Məqaləni Redaktə Et'}
        icon="edit_document"
        onClose={() => setEditingTopic(null)}
      >
        {editingTopic && (
          <form onSubmit={handleSaveEditTopic} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="admin-label">Məqalə Başlığı *</label>
                <input
                  type="text"
                  required
                  value={editingTopic.title}
                  onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Bölmə / Kateqoriya</label>
                <select
                  value={editingTopic.badge || editingTopic.category}
                  onChange={(e) => setEditingTopic({ ...editingTopic, badge: e.target.value, category: e.target.value })}
                  className="admin-select"
                >
                  {communityCategories.map(cat => (
                    <option key={cat.key} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="İcma Müzakirəsi">İcma Müzakirəsi</option>
                  <option value="Sual-Cavab">Sual-Cavab</option>
                  <option value="Təcrübə Bölüşümü">Təcrübə Bölüşümü</option>
                  <option value="Rəsmi Elan">Rəsmi Elan</option>
                  <option value="Kitab Klubu">Kitab Klubu</option>
                  <option value="📌 Sabitlənmiş Müzakirə">📌 Sabitlənmiş Müzakirə</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Müəllif</label>
                <input
                  type="text"
                  value={editingTopic.author || ''}
                  onChange={(e) => setEditingTopic({ ...editingTopic, author: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Mütaliə Müddəti</label>
                <input
                  type="text"
                  placeholder="məsələn: 5 dəq"
                  value={editingTopic.readTime || editingTopic.read_time || '4 dəq'}
                  onChange={(e) => setEditingTopic({ ...editingTopic, readTime: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Status</label>
                <select
                  value={editingTopic.status || 'published'}
                  onChange={(e) => setEditingTopic({ ...editingTopic, status: e.target.value })}
                  className="admin-select"
                >
                  <option value="published">Nəşr Edilib (Aktiv)</option>
                  <option value="draft">Qaralama (Gizli)</option>
                </select>
              </div>
            </div>

            {/* Cover Image Input + Upload */}
            <div>
              <label className="admin-label">Qapaq Şəkli (Cover Image)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="https://... və ya fayl yükləyin"
                  value={editingTopic.coverImage || editingTopic.cover_image || ''}
                  onChange={(e) => setEditingTopic({ ...editingTopic, coverImage: e.target.value })}
                  className="admin-input"
                  style={{ flex: 1 }}
                />
                <label className="admin-btn-secondary" style={{ cursor: 'pointer', fontSize: '11px', padding: '8px 12px', whiteSpace: 'nowrap' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload</span>
                  <span>Şəkil Yüklə</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('image', file);
                      try {
                        const res = await fetch('/api.php?action=upload_image&prefix=blog_cover', {
                          method: 'POST',
                          body: formData,
                          credentials: 'include'
                        });
                        const data = await res.json().catch(() => null);
                        if (data && data.url) {
                          setEditingTopic({ ...editingTopic, coverImage: data.url });
                          showToast('Qapaq şəkli bazada saxlanıldı!', 'success');
                        }
                      } catch (err) {}
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="admin-label">Məqalə Məzmunu (Rich Text Redaktor) *</label>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <RichTextEditor
                  value={editingTopic.content || editingTopic.snippet || ''}
                  onChange={(val) => setEditingTopic({ ...editingTopic, content: val, snippet: val })}
                  placeholder="Məqalə mətni, başlıqlar, şəkillər və ya video əlavə edin..."
                />
              </div>
            </div>

            {/* Inline Translations Panel - Community */}
            <AdminInlineTranslator
              item={editingTopic}
              fields={[
                { key: 'title', label: 'Mövzu Başlığı' },
                { key: 'snippet', label: 'Məzmun', type: 'textarea' },
                { key: 'badge', label: 'Bölmə / Nişan' },
                { key: 'author', label: 'Müəllif' }
              ]}
              activeLang={editTopicTransLang}
              setActiveLang={setEditTopicTransLang}
              onUpdate={(updates) => setEditingTopic({ ...editingTopic, ...updates })}
              isOpen={editTopicTransOpen}
              setIsOpen={setEditTopicTransOpen}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() => setEditingTopic(null)}
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

      {/* Add Topic Popup Modal */}
      <AdminPopupModal
        isOpen={showAddForm}
        title="Yeni İcma / Blog Məqaləsi Əlavə Et"
        icon="add_circle"
        onClose={() => setShowAddForm(false)}
      >
        <form onSubmit={handleCreateTopic} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="admin-label">Məqalə Başlığı *</label>
              <input
                type="text"
                required
                placeholder="məsələn: Daxili tarazlıq və emosional intellektin formalaşması"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Bölmə / Kateqoriya</label>
              <select
                value={newTopicCategory}
                onChange={(e) => setNewTopicCategory(e.target.value)}
                className="admin-select"
              >
                {communityCategories.map(cat => (
                  <option key={cat.key} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="İcma Müzakirəsi">İcma Müzakirəsi</option>
                <option value="Sual-Cavab">Sual-Cavab</option>
                <option value="Təcrübə Bölüşümü">Təcrübə Bölüşümü</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Müəllif</label>
              <input
                type="text"
                value={newTopicAuthor}
                onChange={(e) => setNewTopicAuthor(e.target.value)}
                placeholder="Monodoxia Komandası"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Mütaliə Müddəti</label>
              <input
                type="text"
                value={newTopicReadTime}
                onChange={(e) => setNewTopicReadTime(e.target.value)}
                placeholder="məs: 4 dəq"
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select
                value={newTopicStatus}
                onChange={(e) => setNewTopicStatus(e.target.value)}
                className="admin-select"
              >
                <option value="published">Nəşr Et (Aktiv)</option>
                <option value="draft">Qaralama Kimi Saxla</option>
              </select>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="admin-label">Qapaq Şəkli (Cover Image URL)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="https://... şəkil linki və ya fayl yükləyin"
                value={newTopicCoverImage}
                onChange={(e) => setNewTopicCoverImage(e.target.value)}
                className="admin-input"
                style={{ flex: 1 }}
              />
              <label className="admin-btn-secondary" style={{ cursor: 'pointer', fontSize: '11px', padding: '8px 12px', whiteSpace: 'nowrap' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>upload</span>
                <span>{isUploadingCover ? 'Yüklənir...' : 'Şəkil Yüklə'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingCover}
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploadingCover(true);
                    const formData = new FormData();
                    formData.append('image', file);
                    try {
                      const res = await fetch('/api.php?action=upload_image&prefix=blog_cover', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                      });
                      const data = await res.json().catch(() => null);
                      if (data && data.url) {
                        setNewTopicCoverImage(data.url);
                        showToast('Qapaq şəkli uğurla yükləndi!', 'success');
                      }
                    } catch (err) {}
                    finally {
                      setIsUploadingCover(false);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="admin-label">Məzmun (Rich Text Redaktor) *</label>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <RichTextEditor
                value={newTopicContent}
                onChange={setNewTopicContent}
                placeholder="Məqalə mətni, başlıqlar, şəkillər və ya video əlavə edin..."
              />
            </div>
          </div>

          {/* Inline Translations Panel - New Topic */}
          <AdminInlineTranslator
            item={{
              title: newTopicTitle,
              snippet: newTopicContent,
              badge: newTopicCategory,
              author: newTopicAuthor,
              translations: newTopicTranslations
            }}
            fields={[
              { key: 'title', label: 'Mövzu Başlığı' },
              { key: 'snippet', label: 'Məzmun', type: 'textarea' },
              { key: 'badge', label: 'Bölmə / Nişan' },
              { key: 'author', label: 'Müəllif' }
            ]}
            activeLang={newTopicTransLang}
            setActiveLang={setNewTopicTransLang}
            onUpdate={(updates) => {
              if (updates.translations) {
                setNewTopicTranslations(updates.translations);
              }
            }}
            isOpen={newTopicTransOpen}
            setIsOpen={setNewTopicTransOpen}
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
              <span>Mövzunu İcmada Dərc Et</span>
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
            placeholder="Mövzu başlığı, müəllif və ya məzmun ilə axtar..."
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
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="admin-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '11px' }}
          >
            <option value="all">Bütün Bölmələr</option>
            {communityCategories.map(cat => (
              <option key={cat.key} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Community Topics List */}
      {filteredTopics.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '48px 20px', textAlign: 'center', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '8px' }}>forum</span>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>Mövzu tapılmadı</h5>
          <p style={{ fontSize: '12px', margin: 0 }}>Axtarış sorğusunu dəyişin və ya yeni icma mövzusu yaradın.</p>
          {(searchTerm || categoryFilter !== 'all') && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
              className="admin-btn-secondary"
              style={{ marginTop: '12px', fontSize: '11px' }}
            >
              Filtrləri Sıfırla
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paginatedTopics.map(t => (
            <div key={t.id} className="admin-list-item" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span className="admin-badge-gold">{t.badge}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>• {t.time || 'Yeni'}</span>
                </div>
                <h5 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Playfair Display',serif", color: '#0f172a', margin: '0 0 4px 0' }}>
                  "{t.title}"
                </h5>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: '0 0 8px 0', maxWidth: '700px' }}>{t.snippet}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#64748b' }}>
                  <span>Müəllif: <strong style={{ color: '#0f172a' }}>{t.author}</strong></span>
                  <span>•</span>
                  <span>Bəyənmələr: <strong style={{ color: '#b45309' }}>{t.likes || 0}</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setEditingTopic(t)}
                  className="admin-btn-edit"
                  title="Mövzunu redaktə et"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                  <span>Redaktə</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWeeklyTopic(t.id)}
                  className="admin-btn-secondary"
                  style={{
                    padding: '7px 11px',
                    fontSize: '11px',
                    color: (t.id === weeklyTopicId || t.isWeekly || t.badge?.includes('Həftənin Mövzusu')) ? '#071326' : '#775a19',
                    backgroundColor: (t.id === weeklyTopicId || t.isWeekly || t.badge?.includes('Həftənin Mövzusu')) ? '#fef3c7' : 'transparent',
                    borderColor: '#c5a059',
                    fontWeight: 700
                  }}
                  title="Həftənin Mövzusu Təyin Et / Ləğv Et"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                    {(t.id === weeklyTopicId || t.isWeekly || t.badge?.includes('Həftənin Mövzusu')) ? 'star' : 'star_outline'}
                  </span>
                  <span>{(t.id === weeklyTopicId || t.isWeekly || t.badge?.includes('Həftənin Mövzusu')) ? 'Həftənin Mövzusu' : 'Həftənin Et'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => pinTopic(t.id)}
                  className="admin-btn-secondary"
                  style={{ padding: '7px 11px', fontSize: '11px', color: '#c5a059' }}
                  title="Sabitlə və ya Sabitlənməni Qaldır"
                >
                  {t.pinned || t.badge?.includes('Sabitlənmiş') ? '📌 Sabitləndi' : '📌 Sabitlə'}
                </button>
                <button
                  type="button"
                  onClick={() => setTopicToDelete(t)}
                  className="admin-btn-danger"
                  title="Sil"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
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
            Səhifə {currentPage} / {totalPages} (Cəmi: {filteredTopics.length} mövzu)
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

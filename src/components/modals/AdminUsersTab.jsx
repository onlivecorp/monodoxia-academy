import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminInlineTranslator from './AdminInlineTranslator';
import AdminConfirmModal from './AdminConfirmModal';
import AdminPopupModal from './AdminPopupModal';

const ITEMS_PER_PAGE = 10;

export default function AdminUsersTab() {
  const {
    usersList = [],
    updateUser,
    addUser,
    deleteUser,
    coachesList = [],
    addCoach,
    showToast
  } = useApp();

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Add User Form States
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Tələbə');
  const [newUserTier, setNewUserTier] = useState('Free');
  const [newUserTranslations, setNewUserTranslations] = useState({});
  const [newUserTransOpen, setNewUserTransOpen] = useState(false);
  const [newUserTransLang, setNewUserTransLang] = useState('en');
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [userTransLang, setUserTransLang] = useState('en');
  const [userTransOpen, setUserTransOpen] = useState(false);

  // Delete Confirmation State
  const [userToDelete, setUserToDelete] = useState(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchSearch = (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.phone || '').toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [usersList, userSearch, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Zəhmət olmasa ad və email sahələrini doldurun', 'warning');
      return;
    }
    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      tier: newUserTier,
      status: 'Aktiv',
      translations: newUserTranslations
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('Tələbə');
    setNewUserTier('Free');
    setNewUserTranslations({});
    setNewUserTransOpen(false);
    setShowAddForm(false);
    showToast(`İstifadəçi uğurla əlavə edildi`, 'success');
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone || '',
      role: editingUser.role,
      tier: editingUser.tier,
      status: editingUser.status || 'Aktiv',
      notes: editingUser.notes || '',
      translations: editingUser.translations || {}
    });
    setEditingUser(null);
    showToast('İstifadəçi məlumatları yeniləndi', 'success');
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      showToast(`${userToDelete.name} hesabı silindi`, 'info');
      setUserToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(userToDelete)}
        title="İstifadəçini Sil"
        message="Bu istifadəçi hesabını silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        itemName={userToDelete ? `${userToDelete.name} (${userToDelete.email})` : ''}
        confirmText="Bəli, Hesabı Sil"
        onConfirm={confirmDelete}
        onCancel={() => setUserToDelete(null)}
      />

      {/* Edit User Popup Modal */}
      <AdminPopupModal
        isOpen={Boolean(editingUser)}
        title={editingUser ? `İstifadəçini Redaktə Et: "${editingUser.name}"` : 'İstifadəçini Redaktə Et'}
        icon="manage_accounts"
        onClose={() => setEditingUser(null)}
      >
        {editingUser && (
          <form onSubmit={handleSaveEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Ad və Soyad *</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Elektron Poçt (Email) *</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Əlaqə Nömrəsi (Telefon)</label>
                <input
                  type="text"
                  placeholder="+994 50 123 45 67"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label className="admin-label">Rol & Səlahiyyət</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="admin-select"
                >
                  <option>Tələbə</option>
                  <option>Kouç</option>
                  <option>Moderator</option>
                  <option>Admin</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Abunəlik Paketi (Tier)</label>
                <select
                  value={editingUser.tier}
                  onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value })}
                  className="admin-select"
                >
                  <option>Free</option>
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>VIP</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Hesab Statusu</label>
                <select
                  value={editingUser.status || 'Aktiv'}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  className="admin-select"
                >
                  <option value="Aktiv">Aktiv</option>
                  <option value="Bloklanıb">Bloklanıb</option>
                  <option value="Gözləmədə">Gözləmədə</option>
                </select>
              </div>
            </div>

            <div>
              <label className="admin-label">Admin Qeydləri</label>
              <input
                type="text"
                placeholder="Xüsusi tələbə qeydi, korporativ müqavilə nömrəsi..."
                value={editingUser.notes || ''}
                onChange={(e) => setEditingUser({ ...editingUser, notes: e.target.value })}
                className="admin-input"
              />
            </div>

            {/* Inline Translations Panel - User */}
            <AdminInlineTranslator
              item={editingUser}
              fields={[
                { key: 'name', label: 'Ad və Soyad' },
                { key: 'role', label: 'Rol & Səlahiyyət' },
                { key: 'tier', label: 'Abunəlik Paketi' },
                { key: 'notes', label: 'Admin Qeydləri', type: 'textarea' }
              ]}
              activeLang={userTransLang}
              setActiveLang={setUserTransLang}
              onUpdate={(updates) => setEditingUser({ ...editingUser, ...updates })}
              isOpen={userTransOpen}
              setIsOpen={setUserTransOpen}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
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

      {/* Add User Popup Modal */}
      <AdminPopupModal
        isOpen={showAddForm}
        title="Yeni İstifadəçi Əlavə Et"
        icon="person_add"
        onClose={() => setShowAddForm(false)}
      >
        <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Ad Soyad *</label>
              <input
                type="text"
                required
                placeholder="Məs: Cəmil Əliyev"
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Elektron Poçt *</label>
              <input
                type="email"
                required
                placeholder="cemil@example.com"
                value={newUserEmail}
                onChange={e => setNewUserEmail(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Rol</label>
              <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="admin-select">
                <option>Tələbə</option>
                <option>Kouç</option>
                <option>Moderator</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Abunəlik Paketi (Tier)</label>
              <select value={newUserTier} onChange={e => setNewUserTier(e.target.value)} className="admin-select">
                <option>Free</option>
                <option>Basic</option>
                <option>Premium</option>
                <option>VIP</option>
              </select>
            </div>
          </div>

          {/* Inline Translations Panel - New User */}
          <AdminInlineTranslator
            item={{
              name: newUserName,
              role: newUserRole,
              tier: newUserTier,
              translations: newUserTranslations
            }}
            fields={[
              { key: 'name', label: 'Ad və Soyad' },
              { key: 'role', label: 'Rol & Səlahiyyət' },
              { key: 'tier', label: 'Abunəlik Paketi' }
            ]}
            activeLang={newUserTransLang}
            setActiveLang={setNewUserTransLang}
            onUpdate={(updates) => {
              if (updates.translations) {
                setNewUserTranslations(updates.translations);
              }
            }}
            isOpen={newUserTransOpen}
            setIsOpen={setNewUserTransOpen}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="admin-btn-secondary"
            >
              Ləğv Et
            </button>
            <button type="submit" className="admin-btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person_add</span>
              <span>İstifadəçini Əlavə Et</span>
            </button>
          </div>
        </form>
      </AdminPopupModal>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">İstifadəçilər & RBAC İdarəetməsi</h4>
          <p className="admin-section-subtitle">Platforma üzvlərini, rolları, giriş icazələrini və abunəlik paketlərini idarə edin</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="admin-count-badge">{filteredUsers.length} / {usersList.length} istifadəçi</span>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="admin-btn-primary"
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person_add</span>
            <span>Yeni İstifadəçi</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>search</span>
          <input
            type="text"
            placeholder="Ad, email və ya telefon ilə axtar..."
            value={userSearch}
            onChange={e => {
              setUserSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="admin-input"
            style={{ paddingLeft: '34px' }}
          />
          {userSearch && (
            <button
              type="button"
              onClick={() => { setUserSearch(''); setCurrentPage(1); }}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Tələbə', 'Kouç', 'Moderator', 'Admin'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => { setRoleFilter(r); setCurrentPage(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: roleFilter === r ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: roleFilter === r ? '1px solid #fde68a' : '1px solid #cbd5e1',
                background: roleFilter === r ? '#fffbeb' : '#ffffff',
                color: roleFilter === r ? '#b45309' : '#64748b'
              }}
            >
              {r === 'All' ? 'Hamısı' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '8px' }}>person_off</span>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>Uyğun istifadəçi tapılmadı</h5>
            <p style={{ fontSize: '12px', margin: 0 }}>Axtarış sorğusunu dəyişin və ya filtri sıfırlayın.</p>
            {(userSearch || roleFilter !== 'All') && (
              <button
                type="button"
                onClick={() => { setUserSearch(''); setRoleFilter('All'); }}
                className="admin-btn-secondary"
                style={{ marginTop: '12px', fontSize: '11px' }}
              >
                Filtrləri Sıfırla
              </button>
            )}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>İstifadəçi</th>
                <th>Rol</th>
                <th>Paket</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(197,160,89,0.2),rgba(197,160,89,0.08))', border: '1px solid rgba(197,160,89,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#b45309', flexShrink: 0 }}>
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '12px' }}>{u.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={e => updateUser(u.id, { role: e.target.value })}
                      className="admin-select"
                      style={{ width: 'auto', padding: '5px 8px', fontSize: '11px' }}
                    >
                      <option>Tələbə</option>
                      <option>Kouç</option>
                      <option>Moderator</option>
                      <option>Admin</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={u.tier}
                      onChange={e => updateUser(u.id, { tier: e.target.value })}
                      className="admin-select"
                      style={{ width: 'auto', padding: '5px 8px', fontSize: '11px' }}
                    >
                      <option>Free</option>
                      <option>Basic</option>
                      <option>Premium</option>
                      <option>VIP</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => updateUser(u.id, { status: u.status === 'Aktiv' ? 'Bloklanıb' : 'Aktiv' })}
                      className={u.status === 'Aktiv' ? 'admin-badge-green' : 'admin-badge-red'}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Statusu dəyişmək üçün klikləyin"
                    >
                      {u.status || 'Aktiv'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {coachesList.some(c => c.userId === u.id || c.name === u.name) ? (
                        <span className="admin-badge-gold" style={{ padding: '4px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>verified</span>
                          <span>Ekspert</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            addCoach({
                              userId: u.id,
                              name: u.name,
                              title: u.role === 'Kouç' ? 'Sertifikatlı Kouç' : 'Kouç & Ekspert',
                              experience: '5+ il təcrübə',
                              bio: `${u.name} — Monodoxia Academy fərdi inkişaf və kouçinq ekspertidir.`,
                              specialties: ['Fərdi İnkişaf', 'Psixologiya'],
                              availableSlots: ['Sabah 15:00', 'Cümə 18:00']
                            });
                            updateUser(u.id, { role: 'Kouç' });
                            showToast(`${u.name} Ekspert Heyətinə təyin edildi!`, 'success');
                          }}
                          className="admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Ekspert Heyətinə Təyin Et"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#b45309' }}>psychology</span>
                          <span>Ekspert Təyin Et</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEditingUser(u)}
                        className="admin-btn-edit"
                        style={{ padding: '5px 10px' }}
                        title="İstifadəçini redaktə et"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit</span>
                        <span>Redaktə</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserToDelete(u)}
                        className="admin-btn-danger"
                        style={{ padding: '5px 8px' }}
                        title="İstifadəçini sil"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Səhifə {currentPage} / {totalPages} (Cəmi: {filteredUsers.length} istifadəçi)
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

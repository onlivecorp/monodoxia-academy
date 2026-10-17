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
    showToast,
    rolesList = [],
    hasPermission,
    currentUser,
    applicationsList = [],
    bookings = []
  } = useApp();

  // Search & Filter
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Add User Form States
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState('Tələbə');
  const [newUserTier, setNewUserTier] = useState('Free');
  const [newUserTranslations, setNewUserTranslations] = useState({});
  const [newUserTransOpen, setNewUserTransOpen] = useState(false);
  const [newUserTransLang, setNewUserTransLang] = useState('en');
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit User State & Profile Management Tab
  const [editingUser, setEditingUser] = useState(null);
  const [userModalTab, setUserModalTab] = useState('info');
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
    const pwd = (newUserPassword || '').trim();
    if (pwd && pwd.length < 6) {
      showToast('Şifrə ən azı 6 simvoldan ibarət olmalıdır', 'warning');
      return;
    }
    const finalPassword = pwd || '123456';
    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: finalPassword,
      role: newUserRole,
      tier: newUserTier,
      status: 'Aktiv',
      translations: newUserTranslations
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('Tələbə');
    setNewUserTier('Free');
    setNewUserTranslations({});
    setNewUserTransOpen(false);
    setShowAddForm(false);
    showToast(`İstifadəçi uğurla əlavə edildi (İlkin şifrə: ${finalPassword})`, 'success');
  };

  const handleUserAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Şəkil ölçüsü 5MB-dan çox ola bilməz', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setEditingUser(p => ({ ...p, avatar: event.target.result, image: event.target.result }));
      showToast('Profil şəkli seçildi', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const updates = {
      name: editingUser.name?.trim(),
      email: editingUser.email?.trim(),
      phone: editingUser.phone?.trim() || '',
      avatar: editingUser.avatar || editingUser.image || '',
      image: editingUser.avatar || editingUser.image || '',
      country: editingUser.country?.trim() || 'Azərbaycan',
      city: editingUser.city?.trim() || 'Bakı',
      bio: editingUser.bio?.trim() || '',
      linkedin: editingUser.linkedin?.trim() || '',
      instagram: editingUser.instagram?.trim() || '',
      role: editingUser.role,
      tier: editingUser.tier,
      status: editingUser.status || 'Aktiv',
      notes: editingUser.notes?.trim() || '',
      translations: editingUser.translations || {}
    };
    if (editingUser.newPassword?.trim()) {
      updates.password = editingUser.newPassword.trim();
    }
    updateUser(editingUser.id, updates);
    setEditingUser(null);
    showToast(`${updates.name} profili uğurla yeniləndi!`, 'success');
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

      {/* Complete User Profile Management Popup Modal */}
      <AdminPopupModal
        isOpen={Boolean(editingUser)}
        title={editingUser ? `İstifadəçi Profil İdarəetməsi: "${editingUser.name}"` : 'Profil İdarəetməsi'}
        icon="manage_accounts"
        onClose={() => setEditingUser(null)}
      >
        {editingUser && (() => {
          const userApps = (applicationsList || []).filter(a => a.userId === editingUser.id || a.userEmail === editingUser.email);
          const userBookings = (bookings || []).filter(b => b.userId === editingUser.id || b.userName === editingUser.name);

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* User Header Summary Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap'
              }}>
                <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #c5a059', background: '#ffffff', flexShrink: 0 }}>
                  {editingUser.avatar || editingUser.image ? (
                    <img src={editingUser.avatar || editingUser.image} alt={editingUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', color: '#b45309', background: '#fffbeb' }}>
                      {editingUser.name ? editingUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <label style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: '#ffffff'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  title="Şəkli dəyiş"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>photo_camera</span>
                    <input type="file" accept="image/*" onChange={handleUserAvatarFile} style={{ display: 'none' }} />
                  </label>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{editingUser.name}</h4>
                    <span className="admin-badge-gold" style={{ fontSize: '10px' }}>{editingUser.tier || 'Free'}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#f1f5f9', color: '#334155' }}>
                      {editingUser.role}
                    </span>
                    <span className={editingUser.status === 'Aktiv' ? 'admin-badge-green' : 'admin-badge-red'} style={{ fontSize: '10px' }}>
                      {editingUser.status || 'Aktiv'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{editingUser.email}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                    İstifadəçi ID: <strong>#{editingUser.id}</strong> {editingUser.joinedDate && `• Qeydiyyat: ${editingUser.joinedDate}`}
                  </div>
                </div>
              </div>

              {/* Profile Management Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '2px', overflowX: 'auto' }}>
                <button
                  type="button"
                  onClick={() => setUserModalTab('info')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    borderBottom: userModalTab === 'info' ? '2.5px solid #c5a059' : '2.5px solid transparent',
                    background: 'transparent',
                    color: userModalTab === 'info' ? '#b45309' : '#64748b',
                    fontWeight: userModalTab === 'info' ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person</span>
                  <span>Profil & Əlaqə</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserModalTab('role')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    borderBottom: userModalTab === 'role' ? '2.5px solid #c5a059' : '2.5px solid transparent',
                    background: 'transparent',
                    color: userModalTab === 'role' ? '#b45309' : '#64748b',
                    fontWeight: userModalTab === 'role' ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>admin_panel_settings</span>
                  <span>Rol, Paket & Şifrə</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserModalTab('apps')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    borderBottom: userModalTab === 'apps' ? '2.5px solid #c5a059' : '2.5px solid transparent',
                    background: 'transparent',
                    color: userModalTab === 'apps' ? '#b45309' : '#64748b',
                    fontWeight: userModalTab === 'apps' ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>assignment</span>
                  <span>Müraciətlər ({userApps.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserModalTab('bookings')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    borderBottom: userModalTab === 'bookings' ? '2.5px solid #c5a059' : '2.5px solid transparent',
                    background: 'transparent',
                    color: userModalTab === 'bookings' ? '#b45309' : '#64748b',
                    fontWeight: userModalTab === 'bookings' ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span>
                  <span>Rezervasiyalar ({userBookings.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserModalTab('notes')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    borderBottom: userModalTab === 'notes' ? '2.5px solid #c5a059' : '2.5px solid transparent',
                    background: 'transparent',
                    color: userModalTab === 'notes' ? '#b45309' : '#64748b',
                    fontWeight: userModalTab === 'notes' ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>translate</span>
                  <span>Qeydlər & Tərcümə</span>
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSaveEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* TAB: INFO */}
                {userModalTab === 'info' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div>
                        <label className="admin-label">Ad və Soyad *</label>
                        <input
                          type="text"
                          required
                          value={editingUser.name || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Elektron Poçt (Email) *</label>
                        <input
                          type="email"
                          required
                          value={editingUser.email || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Əlaqə Nömrəsi (Telefon / WhatsApp)</label>
                        <input
                          type="text"
                          placeholder="+994 50 123 45 67"
                          value={editingUser.phone || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div>
                        <label className="admin-label">Ölkə</label>
                        <input
                          type="text"
                          value={editingUser.country || 'Azərbaycan'}
                          onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Şəhər</label>
                        <input
                          type="text"
                          value={editingUser.city || 'Bakı'}
                          onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Profil Şəkli (URL və ya Fayl Yüklə)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="https://... şəkil linki"
                          value={editingUser.avatar || editingUser.image || ''}
                          onChange={e => setEditingUser({ ...editingUser, avatar: e.target.value, image: e.target.value })}
                          className="admin-input"
                          style={{ flex: 1 }}
                        />
                        <label className="admin-btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>upload</span>
                          <span>Fayl Yüklə</span>
                          <input type="file" accept="image/*" onChange={handleUserAvatarFile} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Haqqında / Bio</label>
                      <textarea
                        rows={3}
                        placeholder="İstifadəçi haqqında qısa təsvir..."
                        value={editingUser.bio || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                        className="admin-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      <div>
                        <label className="admin-label">LinkedIn Profili</label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/..."
                          value={editingUser.linkedin || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, linkedin: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Instagram Profili</label>
                        <input
                          type="text"
                          placeholder="https://instagram.com/..."
                          value={editingUser.instagram || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, instagram: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: ROLE & SECURITY */}
                {userModalTab === 'role' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      <div>
                        <label className="admin-label">Rol & Səlahiyyət</label>
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="admin-select"
                        >
                          {rolesList.map(r => (
                            <option key={r.id} value={r.code}>{r.name} ({r.code})</option>
                          ))}
                        </select>
                        {(() => {
                          const selRole = rolesList.find(r => r.code === editingUser.role);
                          if (!selRole) return null;
                          const isSuper = selRole.permissions?.includes('*');
                          return (
                            <div style={{ marginTop: '6px', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '11px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: selRole.color || '#b45309', fontWeight: 600 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>shield</span>
                                <span>{selRole.name}: {isSuper ? 'Bütün İcazələr' : `${selRole.permissions?.length || 0} icazə`}</span>
                              </div>
                              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                                {selRole.description || 'Xüsusi təsvir yoxdur.'}
                              </div>
                            </div>
                          );
                        })()}
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

                    {/* Password reset for user by admin */}
                    <div style={{ background: '#fafaf9', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e7e5e4' }}>
                      <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>key</span>
                        <span>Şifrəni Sıfırla / Yeni Şifrə Təyin Et</span>
                      </label>
                      <input
                        type="text"
                        placeholder="İstifadəçi üçün yeni şifrə daxil edin (boş buraxsanız dəyişməyəcək)"
                        value={editingUser.newPassword || ''}
                        onChange={e => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                        className="admin-input"
                      />
                      <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                        İnzibatçı olaraq bu istifadəçi üçün birbaşa yeni giriş şifrəsi təyin edə bilərsiniz.
                      </span>
                    </div>

                    {/* Appoint as Coach / Expert action if applicable */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fffdf7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>Ekspert & Kouç Heyəti Statusu</div>
                        <div style={{ fontSize: '11px', color: '#78350f' }}>
                          {coachesList.some(c => c.userId === editingUser.id || c.name === editingUser.name)
                            ? 'Bu istifadəçi artıq Monodoxia Ekspert heyətində aktivdir.'
                            : 'Bu istifadəçini Kouçinq və Mentorluq heyətinə əlavə edin.'}
                        </div>
                      </div>
                      {!coachesList.some(c => c.userId === editingUser.id || c.name === editingUser.name) && (
                        <button
                          type="button"
                          onClick={() => {
                            addCoach({
                              userId: editingUser.id,
                              name: editingUser.name,
                              title: editingUser.role === 'Kouç' ? 'Sertifikatlı Kouç' : 'Kouç & Ekspert',
                              experience: '5+ il təcrübə',
                              bio: `${editingUser.name} — Monodoxia Academy fərdi inkişaf və kouçinq ekspertidir.`,
                              specialties: ['Fərdi İnkişaf', 'Psixologiya'],
                              availableSlots: ['Sabah 15:00', 'Cümə 18:00']
                            });
                            setEditingUser({ ...editingUser, role: 'Kouç' });
                            showToast(`${editingUser.name} Ekspert Heyətinə təyin edildi!`, 'success');
                          }}
                          className="admin-btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>psychology</span>
                          <span>Ekspert Heyətinə Əlavə Et</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: APPLICATIONS */}
                {userModalTab === 'apps' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                      Bu istifadəçiyə aid müraciətlər ({userApps.length})
                    </div>
                    {userApps.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                        Bu istifadəçi hələ heç bir kurs və ya tədbirə müraciət etməyib.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                        {userApps.map(a => (
                          <div key={a.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{a.targetTitle}</div>
                              <div style={{ color: '#64748b', fontSize: '10px' }}>#{a.id} • {a.appliedAt} • {a.price || 'Pulsuz'}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ padding: '2px 6px', borderRadius: '4px', fontWeight: 700, background: '#f1f5f9' }}>{a.status}</span>
                              <span style={{ padding: '2px 6px', borderRadius: '4px', fontWeight: 600, background: a.paymentStatus === 'Ödənilib' ? '#dcfce7' : '#fef3c7', color: a.paymentStatus === 'Ödənilib' ? '#166534' : '#92400e' }}>
                                {a.paymentStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: BOOKINGS */}
                {userModalTab === 'bookings' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                      Kouçinq və Mentorluq Rezervasiyaları ({userBookings.length})
                    </div>
                    {userBookings.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                        Bu istifadəçiyə aid heç bir kouçinq rezervasiyası tapılmadı.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {userBookings.map(b => (
                          <div key={b.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{b.coachName}</div>
                              <div style={{ color: '#64748b', fontSize: '10px' }}>Tarix: {b.date} • {b.time}</div>
                            </div>
                            <span style={{ padding: '2px 6px', borderRadius: '4px', fontWeight: 700, background: '#dcfce7', color: '#166534' }}>
                              Təsdiqləndi
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: NOTES & TRANSLATIONS */}
                {userModalTab === 'notes' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label className="admin-label">Admin Qeydləri</label>
                      <textarea
                        rows={3}
                        placeholder="Xüsusi tələbə qeydi, korporativ müqavilə nömrəsi, daxili qeydlər..."
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
                        { key: 'notes', label: 'Admin Qeydləri', type: 'textarea' },
                        { key: 'bio', label: 'Bio / Haqqında', type: 'textarea' }
                      ]}
                      activeLang={userTransLang}
                      setActiveLang={setUserTransLang}
                      onUpdate={(updates) => setEditingUser({ ...editingUser, ...updates })}
                      isOpen={userTransOpen}
                      setIsOpen={setUserTransOpen}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="admin-btn-secondary"
                  >
                    Ləğv Et
                  </button>
                  <button type="submit" className="admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                    <span>İstifadəçi Profilini Yadda Saxla</span>
                  </button>
                </div>
              </form>
            </div>
          );
        })()}
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
                {rolesList.map(r => (
                  <option key={r.id} value={r.code}>{r.name} ({r.code})</option>
                ))}
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
            <div>
              <label className="admin-label">Giriş Şifrəsi</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="İlkin şifrə (məs: 123456)"
                  value={newUserPassword}
                  onChange={e => setNewUserPassword(e.target.value)}
                  className="admin-input"
                  style={{ paddingRight: '36px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                Boş saxlanılarsa, avtomatik "123456" şifrəsi təyin olunacaq.
              </span>
            </div>
          </div>

          {/* Inline Translations Panel - New User */}
          <AdminInlineTranslator
            item={{
              name: newUserName,
              translations: newUserTranslations
            }}
            fields={[
              { key: 'name', label: 'Ad və Soyad' }
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
          {(hasPermission?.('users.create') || currentUser?.role === 'Admin') && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="admin-btn-primary"
              style={{ fontSize: '11px', padding: '7px 14px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person_add</span>
              <span>Yeni İstifadəçi</span>
            </button>
          )}
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
          {['All', ...rolesList.map(r => r.code)].map(r => (
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
              {r === 'All' ? 'Hamısı' : (rolesList.find(role => role.code === r)?.name || r)}
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
                    <div
                      onClick={() => { setEditingUser(u); setUserModalTab('info'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                      title="Profil idarəetməsini açmaq üçün klikləyin"
                    >
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(197,160,89,0.4)', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#b45309', flexShrink: 0 }}>
                        {u.avatar || u.image ? (
                          <img src={u.avatar || u.image} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          u.name ? u.name.charAt(0).toUpperCase() : 'U'
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>{u.name}</span>
                          <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#94a3b8' }}>open_in_new</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      disabled={!hasPermission?.('users.assign_role') && currentUser?.role !== 'Admin'}
                      onChange={e => updateUser(u.id, { role: e.target.value })}
                      className="admin-select"
                      style={{ width: 'auto', padding: '5px 8px', fontSize: '11px' }}
                    >
                      {rolesList.map(r => (
                        <option key={r.id} value={r.code}>{r.name}</option>
                      ))}
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
                      {(hasPermission?.('users.edit') || currentUser?.role === 'Admin') && (
                        <button
                          type="button"
                          onClick={() => { setEditingUser(u); setUserModalTab('info'); }}
                          className="admin-btn-secondary"
                          style={{ padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#0f172a' }}
                          title="İstifadəçinin profil idarəetmə ekranını aç"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>manage_accounts</span>
                          <span>Profil İdarəetməsi</span>
                        </button>
                      )}
                      {(hasPermission?.('users.delete') || currentUser?.role === 'Admin') && (
                        <button
                          type="button"
                          onClick={() => setUserToDelete(u)}
                          className="admin-btn-danger"
                          style={{ padding: '5px 8px' }}
                          title="İstifadəçini sil"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                        </button>
                      )}
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

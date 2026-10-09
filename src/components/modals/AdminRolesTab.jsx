import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import AdminPopupModal from './AdminPopupModal';
import AdminConfirmModal from './AdminConfirmModal';

const PRESET_COLORS = [
  { label: 'Qızılı', value: '#b45309', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  { label: 'Mavi', value: '#2563eb', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  { label: 'Zümrüd', value: '#059669', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { label: 'Bənövşəyi', value: '#7c3aed', badge: 'bg-purple-100 text-purple-800 border-purple-300' },
  { label: 'Kəhrəba', value: '#d97706', badge: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { label: 'Tünd Boz', value: '#475569', badge: 'bg-slate-100 text-slate-800 border-slate-300' },
  { label: 'Qırmızı', value: '#dc2626', badge: 'bg-red-100 text-red-800 border-red-300' }
];

export default function AdminRolesTab() {
  const {
    rolesList = [],
    permissionModules = [],
    allPermissions = [],
    addRole,
    updateRole,
    deleteRole,
    toggleRoleActive,
    duplicateRole,
    usersList = [],
    showToast
  } = useApp();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'active', 'inactive', 'system', 'custom'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [matrixOpen, setMatrixOpen] = useState(false);

  // Form States (for Create & Edit)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    color: '#b45309',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    isActive: true,
    permissions: []
  });
  const [permSearch, setPermSearch] = useState('');

  // Count assigned users for each role
  const getAssignedUsersCount = (roleCode) => {
    return usersList.filter(u => u.role === roleCode || (Array.isArray(u.roles) && u.roles.includes(roleCode))).length;
  };

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return rolesList.filter(role => {
      const matchSearch = (role.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (role.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (role.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (filterType === 'active') return role.isActive !== false;
      if (filterType === 'inactive') return role.isActive === false;
      if (filterType === 'system') return Boolean(role.isSystem);
      if (filterType === 'custom') return !role.isSystem;
      return true;
    });
  }, [rolesList, searchQuery, filterType]);

  // Statistics
  const totalRolesCount = rolesList.length;
  const activeRolesCount = rolesList.filter(r => r.isActive !== false).length;
  const systemRolesCount = rolesList.filter(r => r.isSystem).length;
  const customRolesCount = totalRolesCount - systemRolesCount;

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      color: '#b45309',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      isActive: true,
      permissions: []
    });
    setPermSearch('');
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name || '',
      code: role.code || '',
      description: role.description || '',
      color: role.color || '#b45309',
      badgeClass: role.badgeClass || 'bg-amber-100 text-amber-800 border-amber-300',
      isActive: role.isActive !== false,
      permissions: Array.isArray(role.permissions) ? [...role.permissions] : (role.permissions?.includes('*') ? ['*'] : [])
    });
    setPermSearch('');
  };

  // Form Permissions Management
  const isSuperAdminEditing = editingRole?.isSystem && editingRole?.code === 'Admin';

  const togglePermission = (permId) => {
    if (isSuperAdminEditing) return; // Super admin always has all
    setFormData(prev => {
      const perms = prev.permissions.includes('*') ? [...allPermissions] : [...prev.permissions];
      const index = perms.indexOf(permId);
      if (index > -1) {
        perms.splice(index, 1);
      } else {
        perms.push(permId);
      }
      return { ...prev, permissions: perms };
    });
  };

  const selectAllPermissions = () => {
    if (isSuperAdminEditing) return;
    setFormData(prev => ({ ...prev, permissions: [...allPermissions] }));
  };

  const deselectAllPermissions = () => {
    if (isSuperAdminEditing) return;
    setFormData(prev => ({ ...prev, permissions: [] }));
  };

  const selectModulePermissions = (module) => {
    if (isSuperAdminEditing) return;
    const modPermIds = module.permissions.map(p => p.id);
    setFormData(prev => {
      const current = prev.permissions.includes('*') ? [...allPermissions] : [...prev.permissions];
      const set = new Set(current);
      modPermIds.forEach(id => set.add(id));
      return { ...prev, permissions: Array.from(set) };
    });
  };

  const deselectModulePermissions = (module) => {
    if (isSuperAdminEditing) return;
    const modPermIds = module.permissions.map(p => p.id);
    setFormData(prev => {
      const current = prev.permissions.includes('*') ? [...allPermissions] : [...prev.permissions];
      const updated = current.filter(id => !modPermIds.includes(id));
      return { ...prev, permissions: updated };
    });
  };

  // Submit Create
  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Zəhmət olmasa rol adını daxil edin', 'warning');
      return;
    }
    const code = (formData.code.trim() || formData.name.trim());
    if (rolesList.some(r => r.code.toLowerCase() === code.toLowerCase())) {
      showToast(`"${code}" kodlu rol artıq mövcuddur. Fərqli ad və ya kod daxil edin.`, 'warning');
      return;
    }

    addRole({
      name: formData.name.trim(),
      code: code,
      description: formData.description.trim(),
      color: formData.color,
      badgeClass: formData.badgeClass,
      isActive: formData.isActive,
      permissions: formData.permissions
    });

    setIsCreateOpen(false);
  };

  // Submit Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingRole) return;
    if (!formData.name.trim()) {
      showToast('Rol adı boş ola bilməz', 'warning');
      return;
    }

    updateRole(editingRole.id, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      badgeClass: formData.badgeClass,
      isActive: isSuperAdminEditing ? true : formData.isActive,
      permissions: isSuperAdminEditing ? ['*'] : formData.permissions
    });

    setEditingRole(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (roleToDelete) {
      deleteRole(roleToDelete.id);
      setRoleToDelete(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(roleToDelete)}
        title="Rolu Sil"
        message="Bu rolu silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        itemName={roleToDelete ? `${roleToDelete.name} (${roleToDelete.code})` : ''}
        confirmText="Bəli, Rolu Sil"
        onConfirm={handleConfirmDelete}
        onCancel={() => setRoleToDelete(null)}
      />

      {/* Permissions Matrix Modal */}
      <AdminPopupModal
        isOpen={matrixOpen}
        title="İcazələr & Səlahiyyətlər Matrisi (Audit View)"
        icon="grid_view"
        onClose={() => setMatrixOpen(false)}
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
            Aşağıdakı cədvəldə hər bir rolun sistem modulları üzrə bütün granular icazələri xülasə olunmuşdur.
          </p>
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table className="admin-table" style={{ fontSize: '11px' }}>
              <thead>
                <tr>
                  <th style={{ width: '280px', position: 'sticky', left: 0, background: '#f8fafc', zIndex: 1 }}>Modul & İcazə</th>
                  {rolesList.map(r => (
                    <th key={r.id} style={{ textAlign: 'center', minWidth: '110px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color || '#b45309' }}></span>
                        <span>{r.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionModules.map(mod => (
                  <React.Fragment key={mod.id}>
                    <tr style={{ background: '#f1f5f9' }}>
                      <td colSpan={rolesList.length + 1} style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>{mod.icon}</span>
                          <span>{mod.name}</span>
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 400 }}>({mod.permissions.length} icazə)</span>
                        </div>
                      </td>
                    </tr>
                    {mod.permissions.map(perm => (
                      <tr key={perm.id}>
                        <td style={{ paddingLeft: '28px', position: 'sticky', left: 0, background: '#ffffff', zIndex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{perm.name}</div>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>{perm.id}</div>
                        </td>
                        {rolesList.map(r => {
                          const hasIt = r.permissions?.includes('*') || r.permissions?.includes(perm.id);
                          return (
                            <td key={r.id} style={{ textAlign: 'center' }}>
                              {hasIt ? (
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#16a34a' }}>check_circle</span>
                              ) : (
                                <span style={{ color: '#cbd5e1', fontSize: '16px' }}>—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AdminPopupModal>

      {/* Create / Edit Role Modal */}
      <AdminPopupModal
        isOpen={isCreateOpen || Boolean(editingRole)}
        title={editingRole ? `Rolu Redaktə Et: "${editingRole.name}"` : 'Yeni Rol Yarat'}
        icon={editingRole ? 'edit' : 'shield_person'}
        onClose={() => { setIsCreateOpen(false); setEditingRole(null); }}
      >
        <form onSubmit={editingRole ? handleSaveEdit : handleSaveCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isSuperAdminEditing && (
            <div style={{ padding: '10px 14px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '12px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shield</span>
              <span><strong>Super Admin</strong> əsas sistem roludur. Bu rol avtomatik olaraq bütün modullara tam hüquqlara sahibdir və məhdudlaşdırıla bilməz.</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label className="admin-label">Rolun Adı *</label>
              <input
                type="text"
                required
                placeholder="Məs: Tədris Koordinatoru"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">Sistem Kodu (İdentifikator) *</label>
              <input
                type="text"
                required
                disabled={Boolean(editingRole)}
                placeholder="Məs: Koordinator"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="admin-input"
                style={{ background: editingRole ? '#f1f5f9' : '#ffffff' }}
              />
            </div>
            <div>
              <label className="admin-label">Vizual Rəng</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                {PRESET_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c.value, badgeClass: c.badge })}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: c.value,
                      border: formData.color === c.value ? '2px solid #0f172a' : '2px solid transparent',
                      cursor: 'pointer',
                      transform: formData.color === c.value ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="admin-label">Təsviri & Məqsədi</label>
            <textarea
              rows={2}
              placeholder="Rolun hansı vəzifələri icra etdiyini və məsuliyyətini qeyd edin..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="admin-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {!isSuperAdminEditing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <input
                type="checkbox"
                id="role-active-check"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="role-active-check" style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                Bu rol aktivdir (İstifadəçilərə təyin edilə bilər və icazələr qüvvədədir)
              </label>
            </div>
          )}

          {/* Granular Permission Selector */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>tune</span>
                  <span>Modul İcazələrinin Təyini</span>
                </h5>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0' }}>
                  Rola aid olan əməliyyat hüquqlarını seçin
                </p>
              </div>

              {!isSuperAdminEditing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#b45309', background: '#fffbeb', border: '1px solid #fde68a', padding: '3px 8px', borderRadius: '6px' }}>
                    {formData.permissions.includes('*') ? allPermissions.length : formData.permissions.length} / {allPermissions.length} seçilib
                  </span>
                  <button
                    type="button"
                    onClick={selectAllPermissions}
                    className="admin-btn-secondary"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    Hamısını Seç
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllPermissions}
                    className="admin-btn-secondary"
                    style={{ fontSize: '10px', padding: '4px 8px' }}
                  >
                    Təmizlə
                  </button>
                </div>
              )}
            </div>

            {/* Permission search filter */}
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="İcazələr arasında axtar..."
                value={permSearch}
                onChange={e => setPermSearch(e.target.value)}
                className="admin-input"
                style={{ fontSize: '11px', padding: '6px 10px' }}
              />
            </div>

            {/* Modules Accordion / List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '42vh', overflowY: 'auto', paddingRight: '4px' }}>
              {permissionModules.map(mod => {
                const filteredModPerms = mod.permissions.filter(p =>
                  p.name.toLowerCase().includes(permSearch.toLowerCase()) ||
                  p.description.toLowerCase().includes(permSearch.toLowerCase()) ||
                  p.id.toLowerCase().includes(permSearch.toLowerCase())
                );
                if (permSearch && filteredModPerms.length === 0) return null;

                const selectedInMod = mod.permissions.filter(p => formData.permissions.includes('*') || formData.permissions.includes(p.id)).length;
                const isAllModSelected = selectedInMod === mod.permissions.length;

                return (
                  <div key={mod.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: selectedInMod > 0 ? '#fffdfa' : '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>{mod.icon}</span>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{mod.name}</span>
                          <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '6px' }}>({mod.description})</span>
                        </div>
                      </div>

                      {!isSuperAdminEditing && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 600, color: selectedInMod > 0 ? '#b45309' : '#94a3b8' }}>
                            {selectedInMod}/{mod.permissions.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => isAllModSelected ? deselectModulePermissions(mod) : selectModulePermissions(mod)}
                            style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              cursor: 'pointer',
                              color: '#475569'
                            }}
                          >
                            {isAllModSelected ? 'Təmizlə' : 'Hamısını seç'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                      {filteredModPerms.map(p => {
                        const checked = isSuperAdminEditing || formData.permissions.includes('*') || formData.permissions.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              border: checked ? '1px solid #fde68a' : '1px solid #e2e8f0',
                              background: checked ? '#fffbeb' : '#ffffff',
                              cursor: isSuperAdminEditing ? 'default' : 'pointer',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            <input
                              type="checkbox"
                              disabled={isSuperAdminEditing}
                              checked={checked}
                              onChange={() => togglePermission(p.id)}
                              style={{ marginTop: '2px', cursor: isSuperAdminEditing ? 'default' : 'pointer' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                              <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.3, marginTop: '1px' }}>{p.description}</div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>{p.id}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => { setIsCreateOpen(false); setEditingRole(null); }}
              className="admin-btn-secondary"
            >
              Ləğv Et
            </button>
            <button type="submit" className="admin-btn-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
              <span>{editingRole ? 'Dəyişiklikləri Yadda Saxla' : 'Rolu Yarat'}</span>
            </button>
          </div>
        </form>
      </AdminPopupModal>

      {/* SECTION HEADER & ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">Rollar və İcazələr (RBAC)</h4>
          <p className="admin-section-subtitle">
            Sistem rollarını tənzimləyin, granular icazələr təyin edin və istifadəçilərə səlahiyyətlər bağlayın
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setMatrixOpen(true)}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '7px 12px' }}
            title="İcazələr matrisi cədvəlinə bax"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#b45309' }}>grid_view</span>
            <span>İcazələr Matrisi</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="admin-btn-primary"
            style={{ fontSize: '11px', padding: '7px 14px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_moderator</span>
            <span>Yeni Rol Yarat</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Ümumi Rollar</div>
          <div className="admin-stat-value">{totalRolesCount}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Platformada qeydiyyatlı</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Aktiv Rollar</div>
          <div className="admin-stat-value" style={{ color: '#15803d' }}>{activeRolesCount}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>İstifadəyə hazır</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Sistem / Fərdi</div>
          <div className="admin-stat-value" style={{ color: '#b45309' }}>{systemRolesCount} / {customRolesCount}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Kritik və fərdi rollar</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Sistem İcazələri</div>
          <div className="admin-stat-value">{allPermissions.length}</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{permissionModules.length} modul üzrə granular</div>
        </div>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '360px' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#94a3b8' }}>search</span>
          <input
            type="text"
            placeholder="Rol adı, kod və ya təsvir ilə axtar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="admin-input"
            style={{ paddingLeft: '34px' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Hamısı' },
            { id: 'active', label: 'Aktiv' },
            { id: 'inactive', label: 'Deaktiv' },
            { id: 'system', label: 'Sistem' },
            { id: 'custom', label: 'Fərdi' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: filterType === f.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                border: filterType === f.id ? '1px solid #fde68a' : '1px solid #cbd5e1',
                background: filterType === f.id ? '#fffbeb' : '#ffffff',
                color: filterType === f.id ? '#b45309' : '#64748b'
              }}
            >
              {f.label}
            </button>
          ))}

          {/* View mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', marginLeft: '6px' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                background: viewMode === 'grid' ? '#f1f5f9' : '#ffffff',
                color: viewMode === 'grid' ? '#0f172a' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Kart rejimi"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>grid_view</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 10px',
                background: viewMode === 'table' ? '#f1f5f9' : '#ffffff',
                color: viewMode === 'table' ? '#0f172a' : '#94a3b8',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Cədvəl rejimi"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* ROLES LIST DISPLAY */}
      {filteredRoles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '8px' }}>shield_with_heart</span>
          <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>Uyğun rol tapılmadı</h5>
          <p style={{ fontSize: '12px', margin: 0 }}>Axtarış sorğusunu dəyişin və ya filtri sıfırlayın.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {filteredRoles.map(role => {
            const assignedCount = getAssignedUsersCount(role.code);
            const isSuper = role.permissions?.includes('*') || (role.isSystem && role.code === 'Admin');
            const permCount = isSuper ? allPermissions.length : (role.permissions?.length || 0);

            return (
              <div
                key={role.id}
                className="admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderTop: `3px solid ${role.color || '#b45309'}`,
                  position: 'relative'
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: role.color || '#b45309' }}></span>
                      <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{role.name}</h5>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
                      Kod: {role.code}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {role.isSystem ? (
                      <span className="admin-badge-gold" style={{ fontSize: '9px', padding: '2px 6px' }}>SİSTEM</span>
                    ) : (
                      <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', background: '#f1f5f9', color: '#475569', borderRadius: '4px', border: '1px solid #cbd5e1' }}>FƏRDİ</span>
                    )}

                    <button
                      type="button"
                      disabled={role.isSystem && role.code === 'Admin'}
                      onClick={() => toggleRoleActive(role.id)}
                      className={role.isActive !== false ? 'admin-badge-green' : 'admin-badge-red'}
                      style={{ cursor: (role.isSystem && role.code === 'Admin') ? 'default' : 'pointer', border: 'none' }}
                      title="Statusu dəyişmək üçün klikləyin"
                    >
                      {role.isActive !== false ? 'Aktiv' : 'Deaktiv'}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '11px', color: '#475569', margin: 0, minHeight: '32px', lineHeight: 1.4 }}>
                  {role.description || 'Xüsusi təsvir qeyd edilməyib.'}
                </p>

                {/* Permissions Snapshot */}
                <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', fontWeight: 700 }}>
                      İcazə Əhatəsi
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: isSuper ? '#b45309' : '#0f172a' }}>
                      {isSuper ? 'Tam Hüquqlar (Root)' : `${permCount} / ${allPermissions.length}`}
                    </span>
                  </div>

                  {isSuper ? (
                    <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified_user</span>
                      <span>Bütün sistem modullarına məhdudiyyətsiz giriş</span>
                    </div>
                  ) : permCount === 0 ? (
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Təyin edilmiş admin icazəsi yoxdur (Yalnız ictimai giriş)
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {permissionModules.filter(m => m.permissions.some(p => role.permissions?.includes(p.id))).slice(0, 5).map(m => (
                        <span
                          key={m.id}
                          style={{
                            fontSize: '9px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            color: '#334155',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '11px', color: '#b45309' }}>{m.icon}</span>
                          <span>{m.name}</span>
                        </span>
                      ))}
                      {permissionModules.filter(m => m.permissions.some(p => role.permissions?.includes(p.id))).length > 5 && (
                        <span style={{ fontSize: '9px', color: '#64748b', padding: '2px 4px' }}>
                          +{permissionModules.filter(m => m.permissions.some(p => role.permissions?.includes(p.id))).length - 5} modul
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metadata & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#64748b' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#94a3b8' }}>group</span>
                    <span><strong>{assignedCount}</strong> istifadəçi</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => duplicateRole(role.id)}
                      className="admin-btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '10px' }}
                      title="Rolu dublikat et (klonla)"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(role)}
                      className="admin-btn-edit"
                      style={{ padding: '4px 8px', fontSize: '10px' }}
                      title="Rolu və icazələri redaktə et"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                      <span>Redaktə</span>
                    </button>
                    <button
                      type="button"
                      disabled={role.isSystem || ['Admin', 'Tələbə', 'Kouç', 'Moderator'].includes(role.code)}
                      onClick={() => setRoleToDelete(role)}
                      className="admin-btn-danger"
                      style={{
                        padding: '4px 8px',
                        fontSize: '10px',
                        opacity: (role.isSystem || ['Admin', 'Tələbə', 'Kouç', 'Moderator'].includes(role.code)) ? 0.4 : 1,
                        cursor: (role.isSystem || ['Admin', 'Tələbə', 'Kouç', 'Moderator'].includes(role.code)) ? 'not-allowed' : 'pointer'
                      }}
                      title={role.isSystem ? 'Sistem rolu silinə bilməz' : 'Rolu sil'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rol</th>
                <th>Sistem Kodu</th>
                <th>Status</th>
                <th>Təyin Edilmiş İstifadəçilər</th>
                <th>İcazə Sayı</th>
                <th style={{ textAlign: 'right' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => {
                const assignedCount = getAssignedUsersCount(role.code);
                const isSuper = role.permissions?.includes('*') || (role.isSystem && role.code === 'Admin');
                const permCount = isSuper ? allPermissions.length : (role.permissions?.length || 0);

                return (
                  <tr key={role.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: role.color || '#b45309', flexShrink: 0 }}></span>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '12px' }}>{role.name}</div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>{role.description ? role.description.substring(0, 50) + '...' : '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#0f172a' }}>
                        {role.code}
                      </code>
                    </td>
                    <td>
                      <button
                        type="button"
                        disabled={role.isSystem && role.code === 'Admin'}
                        onClick={() => toggleRoleActive(role.id)}
                        className={role.isActive !== false ? 'admin-badge-green' : 'admin-badge-red'}
                        style={{ cursor: (role.isSystem && role.code === 'Admin') ? 'default' : 'pointer', border: 'none' }}
                      >
                        {role.isActive !== false ? 'Aktiv' : 'Deaktiv'}
                      </button>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                        {assignedCount} nəfər
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: isSuper ? '#b45309' : '#0f172a' }}>
                        {isSuper ? 'Tam (Root)' : `${permCount} / ${allPermissions.length}`}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => duplicateRole(role.id)}
                          className="admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '10px' }}
                          title="Klonla"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(role)}
                          className="admin-btn-edit"
                          style={{ padding: '4px 8px', fontSize: '10px' }}
                          title="Redaktə et"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                          <span>Redaktə</span>
                        </button>
                        <button
                          type="button"
                          disabled={role.isSystem || ['Admin', 'Tələbə', 'Kouç', 'Moderator'].includes(role.code)}
                          onClick={() => setRoleToDelete(role)}
                          className="admin-btn-danger"
                          style={{
                            padding: '4px 8px',
                            fontSize: '10px',
                            opacity: (role.isSystem || ['Admin', 'Tələbə', 'Kouç', 'Moderator'].includes(role.code)) ? 0.4 : 1,
                            cursor: (role.isSystem || ['Admin', 'Tələbə', 'Kouç', 'Moderator'].includes(role.code)) ? 'not-allowed' : 'pointer'
                          }}
                          title={role.isSystem ? 'Sistem rolu silinə bilməz' : 'Sil'}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  APPLICATION_STATUSES,
  PAYMENT_STATUSES,
  ATTENDANCE_STATUSES,
  TARGET_TYPE_MAP
} from '../../data/applicationData';

export default function AdminRegistrationsTab() {
  const {
    applicationsList,
    updateApplicationStatus,
    deleteApplication,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterAttendance, setFilterAttendance] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, name_asc, status_asc

  // Edit Registration Modal State
  const [editingReg, setEditingReg] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    paymentStatus: '',
    attendanceStatus: '',
    adminNote: ''
  });

  // Active records (non-archived)
  const activeRegistrations = applicationsList.filter(a => !a.archived);

  // Filtered & Sorted Registrations
  const filteredRegs = activeRegistrations.filter(r => {
    if (filterType !== 'all' && r.targetType !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterPayment !== 'all' && r.paymentStatus !== filterPayment) return false;
    if (filterAttendance !== 'all' && r.attendanceStatus !== filterAttendance) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = (r.userName || '').toLowerCase().includes(q);
      const matchEmail = (r.userEmail || '').toLowerCase().includes(q);
      const matchPhone = (r.userPhone || '').toLowerCase().includes(q);
      const matchTarget = (r.targetTitle || '').toLowerCase().includes(q);
      const matchId = (r.id || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchTarget && !matchId) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'date_desc') return (b.appliedAt || '').localeCompare(a.appliedAt || '');
    if (sortBy === 'date_asc') return (a.appliedAt || '').localeCompare(b.appliedAt || '');
    if (sortBy === 'name_asc') return (a.userName || '').localeCompare(b.userName || '');
    if (sortBy === 'status_asc') return (a.status || '').localeCompare(b.status || '');
    return 0;
  });

  // Metrics
  const totalCount = activeRegistrations.length;
  const paidCount = activeRegistrations.filter(r => r.paymentStatus === 'Ödənilib').length;
  const attendedCount = activeRegistrations.filter(r => r.attendanceStatus === 'İştirak etdi').length;
  const approvedCount = activeRegistrations.filter(r => r.status === 'Təsdiqləndi').length;

  // Export to CSV
  const exportCSV = () => {
    if (filteredRegs.length === 0) {
      showToast('Export üçün məlumat tapılmadı', 'warning');
      return;
    }

    const headers = ['Müraciət ID', 'İstifadəçi Adı', 'Email', 'Telefon', 'Məzmun Növü', 'Məzmun Başlığı', 'Məbləğ', 'Qeydiyyat Tarixi', 'Müraciət Statusu', 'Ödəniş Statusu', 'İştirak Statusu', 'Admin Qeydi'];
    const rows = filteredRegs.map(r => [
      r.id,
      `"${(r.userName || '').replace(/"/g, '""')}"`,
      `"${(r.userEmail || '').replace(/"/g, '""')}"`,
      `"${(r.userPhone || '').replace(/"/g, '""')}"`,
      r.targetType,
      `"${(r.targetTitle || '').replace(/"/g, '""')}"`,
      `"${(r.price || '0').replace(/"/g, '""')}"`,
      r.appliedAt,
      r.status,
      r.paymentStatus,
      r.attendanceStatus,
      `"${(r.adminNote || '').replace(/"/g, '""')}"`
    ]);

    // UTF-8 BOM for Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Monodoxia_Qeydiyyatlar_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('CSV faylı uğurla endirildi', 'success');
  };

  // Export to JSON
  const exportJSON = () => {
    if (filteredRegs.length === 0) {
      showToast('Export üçün məlumat tapılmadı', 'warning');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRegs, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `Monodoxia_Qeydiyyatlar_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    showToast('JSON faylı uğurla endirildi', 'success');
  };

  const openEditModal = (reg) => {
    setEditingReg(reg);
    setEditForm({
      status: reg.status,
      paymentStatus: reg.paymentStatus || 'Tələb olunmur',
      attendanceStatus: reg.attendanceStatus || 'Gözlənilir',
      adminNote: reg.adminNote || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingReg) return;

    updateApplicationStatus(
      editingReg.id,
      editForm.status,
      editForm.adminNote.trim(),
      editForm.paymentStatus,
      editForm.attendanceStatus
    );
    setEditingReg(null);
    showToast(`Qeydiyyat yeniləndi: #${editingReg.id}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[26px]">how_to_reg</span>
            <h2 className="text-xl font-bold font-serif text-primary">Mərkəzi Qeydiyyatlar Sistemi</h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            İstifadəçi → Müraciət etdiyi məzmun → Qeydiyyat tarixi → Status → Ödəniş → İştirak
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-lg bg-surface-bright border border-outline-variant hover:border-secondary text-primary font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Excel uyğun CSV faylı endir"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">table_view</span>
            <span>CSV Export</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3.5 py-2 rounded-lg bg-surface-bright border border-outline-variant hover:border-secondary text-primary font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="JSON formatında tam bazanı endir"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-600">data_object</span>
            <span>JSON Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Toplam Qeydiyyat</span>
          <div className="text-xl font-bold font-serif text-primary mt-1">{totalCount}</div>
          <span className="text-[10px] text-on-surface-variant">Bütün istifadəçilər</span>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">Təsdiqlənmiş</span>
          <div className="text-xl font-bold font-serif text-emerald-700 dark:text-emerald-300 mt-1">{approvedCount}</div>
          <span className="text-[10px] text-emerald-600/80">Aktiv statusda</span>
        </div>

        <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 block">Ödənilmiş</span>
          <div className="text-xl font-bold font-serif text-teal-700 dark:text-teal-300 mt-1">{paidCount}</div>
          <span className="text-[10px] text-teal-600/80">Tam ödənişli</span>
        </div>

        <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block">İştirak Edənlər</span>
          <div className="text-xl font-bold font-serif text-indigo-700 dark:text-indigo-300 mt-1">{attendedCount}</div>
          <span className="text-[10px] text-indigo-600/80">Canlı və ya online</span>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="p-4 rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İstifadəçi adı, email, telefon və ya proqram üzrə axtarış..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Sort By */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
            >
              <option value="date_desc">Tarix: Ən yeni əvvəlcə</option>
              <option value="date_asc">Tarix: Ən köhnə əvvəlcə</option>
              <option value="name_asc">İstifadəçi Adı (A-Z)</option>
              <option value="status_asc">Statusa görə</option>
            </select>
          </div>
        </div>

        {/* 4-way Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-outline-variant/20 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-outline mb-1">Kateqoriya</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-outline-variant bg-surface-bright text-xs"
            >
              <option value="all">Hamısı</option>
              <option value="course">Kurslar</option>
              <option value="club">Klublar</option>
              <option value="event">Tədbirlər</option>
              <option value="webinar">Vebinarlar</option>
              <option value="community">İcma / Forum</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-outline mb-1">Müraciət Statusu</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-outline-variant bg-surface-bright text-xs"
            >
              <option value="all">Hamısı</option>
              {APPLICATION_STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-outline mb-1">Ödəniş Statusu</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-outline-variant bg-surface-bright text-xs"
            >
              <option value="all">Hamısı</option>
              {PAYMENT_STATUSES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-outline mb-1">İştirak Statusu</label>
            <select
              value={filterAttendance}
              onChange={(e) => setFilterAttendance(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-outline-variant bg-surface-bright text-xs"
            >
              <option value="all">Hamısı</option>
              {ATTENDANCE_STATUSES.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Central Unified Registrations Table */}
      <div className="rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container/20 text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">İstifadəçi</th>
                <th className="py-3 px-4">Müraciət Etdiyi Məzmun</th>
                <th className="py-3 px-4">Qeydiyyat Tarixi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Ödəniş Statusu</th>
                <th className="py-3 px-4">İştirak Statusu</th>
                <th className="py-3 px-4 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredRegs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-outline">
                    <span className="material-symbols-outlined text-[36px] block mb-2">person_search</span>
                    Filtrlərə uyğun heç bir qeydiyyat qeydi tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredRegs.map(reg => {
                  const statusObj = APPLICATION_STATUSES.find(s => s.id === reg.status) || {
                    badgeClass: 'bg-slate-100 text-slate-800'
                  };
                  const typeObj = TARGET_TYPE_MAP[reg.targetType] || {
                    label: 'Proqram',
                    icon: 'assignment',
                    color: 'text-primary'
                  };

                  return (
                    <tr key={reg.id} className="hover:bg-surface-container/20 transition-colors">
                      {/* User Column */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-primary text-xs">{reg.userName}</div>
                        <div className="text-[11px] text-outline">{reg.userEmail}</div>
                        {reg.userPhone && (
                          <div className="text-[10px] text-secondary">{reg.userPhone}</div>
                        )}
                      </td>

                      {/* Content Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`p-1 rounded bg-surface-container ${typeObj.color} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-[13px]">{typeObj.icon}</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                            {typeObj.label}
                          </span>
                        </div>
                        <span className="font-semibold text-primary block line-clamp-1 max-w-[200px]" title={reg.targetTitle}>
                          {reg.targetTitle}
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-on-surface-variant">
                        {reg.appliedAt}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${statusObj.badgeClass}`}>
                          {reg.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${
                          reg.paymentStatus === 'Ödənilib'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : (reg.paymentStatus === 'Gözlənilir' ? 'text-amber-700 dark:text-amber-400' : 'text-on-surface-variant')
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {reg.paymentStatus === 'Ödənilib' ? 'check_circle' : (reg.paymentStatus === 'Gözlənilir' ? 'hourglass_top' : 'remove')}
                          </span>
                          <span>{reg.paymentStatus}</span>
                        </span>
                        {reg.price && reg.price !== '0' && (
                          <span className="block text-[10px] text-outline mt-0.5">({reg.price})</span>
                        )}
                      </td>

                      {/* Attendance Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${
                          reg.attendanceStatus === 'İştirak etdi'
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : (reg.attendanceStatus === 'İştirak etmədi' ? 'text-rose-700 dark:text-rose-400' : 'text-on-surface-variant')
                        }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {reg.attendanceStatus === 'İştirak etdi' ? 'done_all' : (reg.attendanceStatus === 'İştirak etmədi' ? 'cancel' : 'pending')}
                          </span>
                          <span>{reg.attendanceStatus}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(reg)}
                            className="px-2.5 py-1 rounded bg-surface-container text-primary hover:bg-surface-container-high font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            title="Status və qeydləri dəyiş"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                            <span>Redaktə</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Bu qeydiyyatı arxivləşdirmək istədiyinizdən əminsiniz? (${reg.id})`)) {
                                deleteApplication(reg.id);
                              }
                            }}
                            className="p-1 rounded text-outline hover:text-rose-600 transition-colors"
                            title="Arxivləşdir / Sil"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Registration Quick Modal */}
      {editingReg && (
        <div className="fixed inset-0 z-[60] modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface-bright rounded-xl border border-outline-variant shadow-2xl max-w-md w-full my-auto overflow-hidden animate-fadeIn relative">
            <div className="p-4 border-b border-outline-variant/40 bg-surface-container/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Qeydiyyat Redaktəsi</span>
                <h3 className="font-bold text-sm text-primary">#{editingReg.id} - {editingReg.userName}</h3>
              </div>
              <button onClick={() => setEditingReg(null)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 space-y-3 text-xs">
              <div className="p-2.5 rounded bg-surface-container/30 border border-outline-variant/30 text-xs">
                <strong>Məzmun:</strong> {editingReg.targetTitle} ({editingReg.targetType.toUpperCase()})
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Müraciət Statusu</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:border-secondary"
                >
                  {APPLICATION_STATUSES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Ödəniş Statusu</label>
                <select
                  value={editForm.paymentStatus}
                  onChange={(e) => setEditForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:border-secondary"
                >
                  {PAYMENT_STATUSES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">İştirak Statusu</label>
                <select
                  value={editForm.attendanceStatus}
                  onChange={(e) => setEditForm(prev => ({ ...prev, attendanceStatus: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:border-secondary"
                >
                  {ATTENDANCE_STATUSES.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Administrator Qeydi</label>
                <textarea
                  rows={2}
                  value={editForm.adminNote}
                  onChange={(e) => setEditForm(prev => ({ ...prev, adminNote: e.target.value }))}
                  placeholder="İstifadəçiyə görünəcək bildiriş və ya daxili qeyd..."
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingReg(null)}
                  className="px-3 py-1.5 rounded text-outline hover:text-primary"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary text-surface-bright hover:bg-[#112240] font-semibold"
                >
                  Dəyişiklikləri Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

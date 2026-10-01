import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APPLICATION_STATUSES, TARGET_TYPE_MAP, PAYMENT_STATUSES, ATTENDANCE_STATUSES } from '../../data/applicationData';

export default function AdminApplicationsTab() {
  const {
    applicationsList,
    updateApplicationStatus,
    deleteApplication,
    formFieldsList,
    addFormField,
    updateFormField,
    deleteFormField,
    usersList,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('list'); // 'list' | 'fields'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [paymentInput, setPaymentInput] = useState('');
  const [attendanceInput, setAttendanceInput] = useState('');

  // Form Field Builder State
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldForm, setFieldForm] = useState({
    targetType: 'all',
    label: '',
    fieldType: 'text',
    optionsText: '',
    placeholder: '',
    isRequired: false
  });

  // Filtered applications
  const filteredApps = applicationsList.filter(app => {
    if (app.archived) return false;

    if (filterType !== 'all' && app.targetType !== filterType) {
      return false;
    }
    if (filterStatus !== 'all' && app.status !== filterStatus) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = (app.userName || '').toLowerCase().includes(q);
      const matchEmail = (app.userEmail || '').toLowerCase().includes(q);
      const matchTitle = (app.targetTitle || '').toLowerCase().includes(q);
      const matchId = (app.id || '').toLowerCase().includes(q);
      const matchPhone = (app.userPhone || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchTitle && !matchId && !matchPhone) return false;
    }
    return true;
  });

  // Metrics
  const nonArchived = applicationsList.filter(a => !a.archived);
  const totalCount = nonArchived.length;
  const newCount = nonArchived.filter(a => a.status === 'Yeni').length;
  const reviewCount = nonArchived.filter(a => a.status === 'Baxılır').length;
  const approvedCount = nonArchived.filter(a => a.status === 'Təsdiqləndi').length;
  const waitlistCount = nonArchived.filter(a => a.status === 'Gözləmədə').length;
  const rejectedCount = nonArchived.filter(a => ['Rədd edildi', 'Ləğv edildi'].includes(a.status)).length;

  const openAppDetails = (app) => {
    setSelectedApp(app);
    setAdminNoteInput(app.adminNote || '');
    setStatusInput(app.status);
    setPaymentInput(app.paymentStatus || 'Tələb olunmur');
    setAttendanceInput(app.attendanceStatus || 'Gözlənilir');
  };

  const handleSaveAppDetails = () => {
    if (!selectedApp) return;
    updateApplicationStatus(
      selectedApp.id,
      statusInput,
      adminNoteInput.trim(),
      paymentInput,
      attendanceInput
    );
    setSelectedApp(prev => ({
      ...prev,
      status: statusInput,
      adminNote: adminNoteInput.trim(),
      paymentStatus: paymentInput,
      attendanceStatus: attendanceInput
    }));
    showToast(`Müraciət məlumatları yeniləndi (#${selectedApp.id})`, 'success');
  };

  const handleSaveField = (e) => {
    e.preventDefault();
    if (!fieldForm.label.trim()) {
      showToast('Sahənin adı boş ola bilməz', 'error');
      return;
    }

    const options = fieldForm.fieldType === 'select'
      ? fieldForm.optionsText.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (editingField) {
      updateFormField(editingField.id, {
        targetType: fieldForm.targetType,
        label: fieldForm.label.trim(),
        fieldType: fieldForm.fieldType,
        options,
        placeholder: fieldForm.placeholder.trim(),
        isRequired: fieldForm.isRequired
      });
    } else {
      addFormField({
        targetType: fieldForm.targetType,
        label: fieldForm.label.trim(),
        fieldType: fieldForm.fieldType,
        options,
        placeholder: fieldForm.placeholder.trim(),
        isRequired: fieldForm.isRequired
      });
    }

    setShowAddFieldModal(false);
    setEditingField(null);
    setFieldForm({
      targetType: 'all',
      label: '',
      fieldType: 'text',
      optionsText: '',
      placeholder: '',
      isRequired: false
    });
  };

  const openEditField = (f) => {
    setEditingField(f);
    setFieldForm({
      targetType: f.targetType || 'all',
      label: f.label || '',
      fieldType: f.fieldType || 'text',
      optionsText: (f.options || []).join(', '),
      placeholder: f.placeholder || '',
      isRequired: Boolean(f.isRequired)
    });
    setShowAddFieldModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[26px]">assignment</span>
            <h2 className="text-xl font-bold font-serif text-primary">Müraciətlər və Qeydiyyatlar</h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Kurslar, Klublar, Tədbirlər, Vebinarlar və İcma müraciətlərinin dinamik idarə edilməsi
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container/40 p-1 rounded-lg border border-outline-variant/40 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'list'
                ? 'bg-surface-bright text-primary shadow-sm border border-outline-variant/40'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">list_alt</span>
            <span>Müraciətlər Siyahısı ({filteredApps.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('fields')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'fields'
                ? 'bg-surface-bright text-primary shadow-sm border border-outline-variant/40'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">dynamic_form</span>
            <span>Dinamik Form Sahələri ({formFieldsList.length})</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">Cəmi Müraciət</span>
          <div className="text-xl font-bold font-serif text-primary mt-1">{totalCount}</div>
          <span className="text-[10px] text-on-surface-variant">Bütün məzmunlar</span>
        </div>

        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">Yeni</span>
          <div className="text-xl font-bold font-serif text-blue-700 dark:text-blue-300 mt-1">{newCount}</div>
          <span className="text-[10px] text-blue-600/80">Baxılmalıdır</span>
        </div>

        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">Baxılır</span>
          <div className="text-xl font-bold font-serif text-amber-700 dark:text-amber-300 mt-1">{reviewCount}</div>
          <span className="text-[10px] text-amber-600/80">İcrada olan</span>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">Təsdiqləndi</span>
          <div className="text-xl font-bold font-serif text-emerald-700 dark:text-emerald-300 mt-1">{approvedCount}</div>
          <span className="text-[10px] text-emerald-600/80">Qəbul edilmiş</span>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 block">Gözləmədə</span>
          <div className="text-xl font-bold font-serif text-purple-700 dark:text-purple-300 mt-1">{waitlistCount}</div>
          <span className="text-[10px] text-purple-600/80">Ehtiyat siyahı</span>
        </div>

        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 block">Rədd / Ləğv</span>
          <div className="text-xl font-bold font-serif text-rose-700 dark:text-rose-300 mt-1">{rejectedCount}</div>
          <span className="text-[10px] text-rose-600/80">Arxivləşdirilə bilər</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: APPLICATIONS LIST */}
      {/* ======================================================== */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm flex flex-col md:flex-row items-center gap-3">
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

            {/* Target Type Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-44 px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
              >
                <option value="all">Bütün Kateqoriyalar</option>
                <option value="course">Akademiya Kursları</option>
                <option value="club">Coaching Club</option>
                <option value="event">Tədbirlər</option>
                <option value="webinar">Vebinarlar</option>
                <option value="community">İcma və Forumlar</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-40 px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
              >
                <option value="all">Bütün Statuslar</option>
                {APPLICATION_STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/40 bg-surface-container/20 text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3 px-4">Müraciət ID & Tarix</th>
                    <th className="py-3 px-4">İstifadəçi</th>
                    <th className="py-3 px-4">Proqram / Məzmun</th>
                    <th className="py-3 px-4">Məbləğ</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Ödəniş / İştirak</th>
                    <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-outline">
                        <span className="material-symbols-outlined text-[36px] block mb-2">search_off</span>
                        Axtarış parametrlərinə uyğun müraciət tapılmadı.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map(app => {
                      const statusObj = APPLICATION_STATUSES.find(s => s.id === app.status) || {
                        badgeClass: 'bg-slate-100 text-slate-800'
                      };
                      const typeObj = TARGET_TYPE_MAP[app.targetType] || {
                        label: 'Proqram',
                        icon: 'assignment',
                        color: 'text-primary'
                      };

                      return (
                        <tr key={app.id} className="hover:bg-surface-container/20 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium">
                            <span className="text-primary font-bold block">#{app.id}</span>
                            <span className="text-[10px] text-outline">{app.appliedAt}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-primary">{app.userName}</div>
                            <div className="text-[11px] text-outline">{app.userEmail}</div>
                            {app.userPhone && (
                              <div className="text-[10px] text-secondary flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[12px]">phone</span>
                                <span>{app.userPhone}</span>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`p-1 rounded bg-surface-container ${typeObj.color} flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-[14px]">{typeObj.icon}</span>
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                                {typeObj.label}
                              </span>
                            </div>
                            <span className="font-medium text-primary line-clamp-1 max-w-[220px]" title={app.targetTitle}>
                              {app.targetTitle}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-primary">
                            {app.price || 'Pulsuz'}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${statusObj.badgeClass}`}>
                              {app.status}
                            </span>
                            {app.adminNote && (
                              <span className="material-symbols-outlined text-[14px] text-secondary ml-1 inline-block align-middle" title={`Qeyd: ${app.adminNote}`}>
                                comment
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-[11px]">
                            <div className="leading-tight">
                              <span className="text-outline">Ödəniş: </span>
                              <span className={`font-semibold ${app.paymentStatus === 'Ödənilib' ? 'text-emerald-600' : 'text-primary'}`}>
                                {app.paymentStatus}
                              </span>
                            </div>
                            <div className="leading-tight mt-1">
                              <span className="text-outline">İştirak: </span>
                              <span className={`font-semibold ${app.attendanceStatus === 'İştirak etdi' ? 'text-emerald-600' : 'text-primary'}`}>
                                {app.attendanceStatus}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Approve button */}
                              {app.status !== 'Təsdiqləndi' && (
                                <button
                                  onClick={() => updateApplicationStatus(app.id, 'Təsdiqləndi', 'Admin paneldən təsdiqləndi.')}
                                  title="Təsdiqlə"
                                  className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center justify-center transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check</span>
                                </button>
                              )}

                              {/* Quick Reject button */}
                              {app.status !== 'Rədd edildi' && (
                                <button
                                  onClick={() => updateApplicationStatus(app.id, 'Rədd edildi', 'Meyarlara uyğun hesab edilmədi.')}
                                  title="Rədd et"
                                  className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 flex items-center justify-center transition-colors"
                                >
                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                              )}

                              {/* Details button */}
                              <button
                                onClick={() => openAppDetails(app)}
                                title="Tam Detallar və Redaktə"
                                className="w-7 h-7 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high flex items-center justify-center transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Müraciəti (${app.id}) arxivləşdirmək istədiyinizdən əminsiniz?`)) {
                                    deleteApplication(app.id);
                                  }
                                }}
                                title="Arxivləşdir / Sil"
                                className="w-7 h-7 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
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
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: DYNAMIC FORM FIELDS BUILDER */}
      {/* ======================================================== */}
      {activeSubTab === 'fields' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-primary">Müraciət Form Sahələrinin İdarə Edilməsi</h3>
              <p className="text-xs text-on-surface-variant">
                Kurslar, klublar, vebinarlar və tədbirlər üçün xüsusi form sahələri yaradın və tənzimləyin.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingField(null);
                setFieldForm({
                  targetType: 'all',
                  label: '',
                  fieldType: 'text',
                  optionsText: '',
                  placeholder: '',
                  isRequired: false
                });
                setShowAddFieldModal(true);
              }}
              className="px-4 py-2 rounded-lg bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Yeni Sahə Əlavə Et</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {formFieldsList.map(field => {
              const typeMeta = TARGET_TYPE_MAP[field.targetType] || { label: 'Bütün Müraciətlər', icon: 'all_inclusive' };

              return (
                <div key={field.id} className="p-4 rounded-xl border border-outline-variant/40 bg-surface-bright shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">{typeMeta.icon}</span>
                        {field.targetType === 'all' ? 'Bütün Proqramlar' : typeMeta.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${field.isRequired ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'}`}>
                        {field.isRequired ? 'Məcburi' : 'Könüllü'}
                      </span>
                    </div>

                    <h4 className="font-semibold text-primary text-sm mb-1">{field.label}</h4>
                    <div className="text-[11px] text-outline mb-2">
                      Növ: <strong className="text-on-surface-variant uppercase">{field.fieldType}</strong>
                    </div>

                    {field.placeholder && (
                      <div className="text-[11px] text-outline italic mb-2">
                        Placeholder: "{field.placeholder}"
                      </div>
                    )}

                    {field.options && field.options.length > 0 && (
                      <div className="text-[10px] text-on-surface-variant bg-surface-container/30 p-2 rounded border border-outline-variant/30 mb-2">
                        <strong>Variantlar:</strong> {field.options.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs mt-3">
                    <span className="text-[10px] text-outline">Sıra: #{field.sortOrder || 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditField(field)}
                        className="text-secondary hover:underline font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Redaktə
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${field.label}" sahəsini silmək istəyirsiniz?`)) {
                            deleteFormField(field.id);
                          }
                        }}
                        className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* APPLICATION DETAILS MODAL / DRAWER */}
      {/* ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-[60] modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface-bright rounded-xl border border-outline-variant shadow-2xl max-w-2xl w-full my-auto overflow-hidden animate-fadeIn relative flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-outline-variant/40 bg-surface-container/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                  Müraciət İdarəetmə Paneli
                </span>
                <h3 className="font-headline-sm text-lg font-serif text-primary">
                  Müraciət #{selectedApp.id}
                </h3>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Applicant & Target Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-container/20 border border-outline-variant/40">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1">
                    İstifadəçi Məlumatları
                  </span>
                  <div className="font-bold text-primary text-sm">{selectedApp.userName}</div>
                  <div className="text-on-surface-variant">{selectedApp.userEmail}</div>
                  <div className="text-secondary mt-1 font-semibold">{selectedApp.userPhone || 'Telefon qeyd edilməyib'}</div>
                  <div className="text-[10px] text-outline mt-1">İstifadəçi ID: {selectedApp.userId}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline block mb-1">
                    Proqram Məlumatları
                  </span>
                  <div className="font-bold text-primary text-sm">{selectedApp.targetTitle}</div>
                  <div className="text-on-surface-variant">Kateqoriya: <strong className="uppercase">{selectedApp.targetType}</strong></div>
                  <div className="text-on-surface-variant">Məbləğ: <strong>{selectedApp.price || 'Pulsuz'}</strong></div>
                  <div className="text-[10px] text-outline mt-1">Müraciət Tarixi: {selectedApp.appliedAt}</div>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="p-3.5 rounded-xl border border-secondary/20 bg-secondary/5 space-y-3">
                <span className="font-bold text-secondary text-xs uppercase tracking-wider block">
                  Statusların Tənzimlənməsi
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-primary mb-1">Müraciət Statusu</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:border-secondary"
                    >
                      {APPLICATION_STATUSES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-primary mb-1">Ödəniş Statusu</label>
                    <select
                      value={paymentInput}
                      onChange={(e) => setPaymentInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:border-secondary"
                    >
                      {PAYMENT_STATUSES.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-primary mb-1">İştirak Statusu</label>
                    <select
                      value={attendanceInput}
                      onChange={(e) => setAttendanceInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:border-secondary"
                    >
                      {ATTENDANCE_STATUSES.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Admin Note */}
                <div>
                  <label className="block text-[11px] font-bold text-primary mb-1">
                    Administrator Qeydi (Tələbəyə bildirişlə çatdırılır)
                  </label>
                  <textarea
                    rows={2}
                    value={adminNoteInput}
                    onChange={(e) => setAdminNoteInput(e.target.value)}
                    placeholder="Məsələn: Ödəniş qəbzi təsdiqləndi. Telegram qrup linki göndərildi..."
                    className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Dynamic Form Responses */}
              <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-bright space-y-2">
                <span className="font-bold text-primary text-xs uppercase tracking-wider block border-b border-outline-variant/20 pb-1.5">
                  Tələbənin Göndərdiyi Form Məlumatları
                </span>

                {selectedApp.userNote && (
                  <div className="p-2.5 rounded bg-surface-container/30 border border-outline-variant/30 mb-2">
                    <strong className="text-secondary block text-[11px]">Müraciətçinin İlkin Qeydi:</strong>
                    <p className="text-primary mt-0.5">{selectedApp.userNote}</p>
                  </div>
                )}

                {Object.keys(selectedApp.formResponses || {}).length === 0 ? (
                  <span className="text-outline italic">Xüsusi form cavabı qeydə alınmayıb.</span>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(selectedApp.formResponses || {}).map(([fKey, fVal]) => {
                      const matchedField = formFieldsList.find(f => f.id === fKey);
                      const fTitle = matchedField ? matchedField.label : fKey;

                      return (
                        <div key={fKey} className="p-2.5 rounded border border-outline-variant/20 bg-surface-bright">
                          <span className="font-semibold text-on-surface-variant block text-[11px]">
                            {fTitle}:
                          </span>
                          <span className="text-primary font-medium mt-0.5 block break-words">
                            {String(fVal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-outline-variant/40 bg-surface-container/20 flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm('Bu müraciəti arxivləşdirmək istəyirsiniz?')) {
                    deleteApplication(selectedApp.id);
                    setSelectedApp(null);
                  }
                }}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
                Arxivləşdir / Sil
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-3.5 py-2 rounded text-xs text-outline hover:text-primary"
                >
                  Bağla
                </button>
                <button
                  onClick={handleSaveAppDetails}
                  className="px-5 py-2 rounded bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Dəyişiklikləri Saxla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT DYNAMIC FIELD MODAL */}
      {/* ======================================================== */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-[60] modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-surface-bright rounded-xl border border-outline-variant shadow-2xl max-w-md w-full my-auto overflow-hidden animate-fadeIn relative">
            <div className="p-4 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container/20">
              <h3 className="font-bold text-sm text-primary">
                {editingField ? 'Sahəni Redaktə Et' : 'Yeni Form Sahəsi Əlavə Et'}
              </h3>
              <button onClick={() => setShowAddFieldModal(false)} className="text-outline hover:text-primary">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveField} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Məzmun Kateqoriyası</label>
                <select
                  value={fieldForm.targetType}
                  onChange={(e) => setFieldForm(prev => ({ ...prev, targetType: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                >
                  <option value="all">Bütün Müraciətlər (Hamısı)</option>
                  <option value="course">Yalnız Kurslar</option>
                  <option value="club">Yalnız Coaching Club</option>
                  <option value="event">Yalnız Tədbirlər</option>
                  <option value="webinar">Yalnız Vebinarlar</option>
                  <option value="community">Yalnız İcma və Forum</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Sahənin Adı (Label) *</label>
                <input
                  type="text"
                  value={fieldForm.label}
                  onChange={(e) => setFieldForm(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Məsələn: Təcrübəniz, WhatsApp Nömrəsi, CV Linki..."
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Sahənin Növü (Input Type)</label>
                <select
                  value={fieldForm.fieldType}
                  onChange={(e) => setFieldForm(prev => ({ ...prev, fieldType: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                >
                  <option value="text">Qısa Mətn (Text)</option>
                  <option value="textarea">Çoxsətirli Mətn (Textarea)</option>
                  <option value="select">Seçim Siyahısı (Dropdown Select)</option>
                  <option value="number">Rəqəm (Number)</option>
                  <option value="checkbox">Bəli/Xeyr (Checkbox)</option>
                </select>
              </div>

              {fieldForm.fieldType === 'select' && (
                <div>
                  <label className="block font-bold text-primary mb-1">
                    Variantlar (Vergüllə ayırın)
                  </label>
                  <input
                    type="text"
                    value={fieldForm.optionsText}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, optionsText: e.target.value }))}
                    placeholder="Məsələn: Başlanğıc, Orta, İrəli"
                    className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-primary mb-1">Köməkçi Mətn (Placeholder)</label>
                <input
                  type="text"
                  value={fieldForm.placeholder}
                  onChange={(e) => setFieldForm(prev => ({ ...prev, placeholder: e.target.value }))}
                  placeholder="İstifadəçiyə görünəcək ipucu mətn..."
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={fieldForm.isRequired}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, isRequired: e.target.checked }))}
                    className="rounded text-secondary"
                  />
                  <span className="font-semibold text-primary">Bu sahə mütləq doldurulmalıdır (Required)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="px-3 py-1.5 rounded text-outline hover:text-primary"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary text-surface-bright hover:bg-[#112240] font-semibold"
                >
                  Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

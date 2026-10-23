import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import AdminConfirmModal from './AdminConfirmModal';

export default function AdminContactMessagesTab() {
  const {
    fetchContactMessages,
    updateContactMessage,
    deleteContactMessage,
    unreadContactMessagesCount,
    showToast
  } = useApp();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState({
    all: 0,
    unread: 0,
    yeni: 0,
    oxundu: 0,
    cavablandirildi: 0,
    arxiv: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Selected Message for Detail Modal
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const params = {
      page,
      limit,
      search: searchTerm.trim(),
      status: statusFilter !== 'all' ? statusFilter : ''
    };
    if (unreadOnly) {
      params.is_read = '0';
    }

    const res = await fetchContactMessages(params);
    if (res?.status === 'success') {
      setMessages(res.messages || []);
      setTotalCount(res.total || 0);
      if (res.counts) {
        setCounts(res.counts);
      }
    }
    setLoading(false);
  }, [fetchContactMessages, page, limit, searchTerm, statusFilter, unreadOnly]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleRead = async (msg, e) => {
    if (e) e.stopPropagation();
    const newIsRead = msg.is_read ? 0 : 1;
    const newStatus = newIsRead === 1 && msg.status === 'Yeni' ? 'Oxundu' : msg.status;

    const ok = await updateContactMessage(msg.id, {
      is_read: newIsRead,
      status: newStatus
    });

    if (ok) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: newIsRead, status: newStatus } : m));
      if (selectedMsg && selectedMsg.id === msg.id) {
        setSelectedMsg(prev => ({ ...prev, is_read: newIsRead, status: newStatus }));
      }
    }
  };

  const handleStatusChange = async (msgId, newStatus) => {
    const isRead = newStatus !== 'Yeni' ? 1 : 0;
    const ok = await updateContactMessage(msgId, {
      status: newStatus,
      is_read: isRead
    });

    if (ok) {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: newStatus, is_read: isRead } : m));
      if (selectedMsg && selectedMsg.id === msgId) {
        setSelectedMsg(prev => ({ ...prev, status: newStatus, is_read: isRead }));
      }
    }
  };

  const handleOpenDetail = (msg) => {
    setSelectedMsg(msg);
    setAdminNoteInput(msg.admin_notes || '');

    // Auto mark as read if currently unread
    if (!msg.is_read) {
      handleToggleRead(msg);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedMsg) return;
    setIsSavingNote(true);
    const ok = await updateContactMessage(selectedMsg.id, {
      admin_notes: adminNoteInput.trim()
    });
    setIsSavingNote(false);
    if (ok) {
      setMessages(prev => prev.map(m => m.id === selectedMsg.id ? { ...m, admin_notes: adminNoteInput.trim() } : m));
      setSelectedMsg(prev => ({ ...prev, admin_notes: adminNoteInput.trim() }));
      showToast('Qeyd yadda saxlanıldı', 'success');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    const ok = await deleteContactMessage(deleteTarget.id);
    if (ok) {
      setMessages(prev => prev.filter(m => m.id !== deleteTarget.id));
      if (selectedMsg && selectedMsg.id === deleteTarget.id) {
        setSelectedMsg(null);
      }
      setTotalCount(prev => Math.max(0, prev - 1));
    }
    setDeleteTarget(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Yeni':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Oxundu':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cavablandırıldı':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Arxiv':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#b45309]">inbox</span>
            <span>Gələn Əlaqə Mesajları</span>
            {counts.unread > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#2563eb] text-white">
                {counts.unread} yeni
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vebsaytın əlaqə forması vasitəsilə daxil olan müraciətləri izləyin, statuslarını idarə edin və cavablandırın.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>Yenilə</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Cəmi Mesajlar</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{counts.all}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-amber-700">Oxunmamış</span>
            <span className="material-symbols-outlined text-[18px] text-amber-500">mark_email_unread</span>
          </div>
          <div className="text-2xl font-black text-amber-700">{counts.unread}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-emerald-700">Cavablandırılmış</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-500">reply</span>
          </div>
          <div className="text-2xl font-black text-emerald-700">{counts.cavablandirildi}</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold text-slate-600">Arxivləşdirilmiş</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">archive</span>
          </div>
          <div className="text-2xl font-black text-slate-700">{counts.arxiv}</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Göndərənin adı, e-poçt, mövzu və ya mətndə axtar..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#05224a] outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="Yeni">Yeni</option>
              <option value="Oxundu">Oxundu</option>
              <option value="Cavablandırıldı">Cavablandırıldı</option>
              <option value="Arxiv">Arxiv</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setUnreadOnly(!unreadOnly);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                unreadOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {unreadOnly ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span>Yalnız Oxunmamışlar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-[#b45309] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Mesajlar yüklənir...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 px-4">
            <span className="material-symbols-outlined text-[40px] text-slate-300 mb-2">inbox</span>
            <p className="text-sm font-semibold text-slate-700">Heç bir əlaqə mesajı tapılmadı</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all' || unreadOnly
                ? 'Seçilmiş filterlərə uyğun nəticə yoxdur. Zəhmət olmasa axtarış parametrlərini sıfırlayın.'
                : 'Vebsayt vasitəsilə göndərilən bütün müraciətlər burada toplanacaqdır.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-8 text-center">Status</th>
                  <th className="py-3 px-4">Göndərən</th>
                  <th className="py-3 px-4">Mövzu və Məzmun</th>
                  <th className="py-3 px-4 whitespace-nowrap">Tarix</th>
                  <th className="py-3 px-4 text-center">Rejim</th>
                  <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenDetail(msg)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                      !msg.is_read ? 'bg-amber-50/40 font-medium' : ''
                    }`}
                  >
                    {/* Read indicator */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => handleToggleRead(msg, e)}
                        className="cursor-pointer"
                        title={msg.is_read ? 'Oxunmamış kimi işarələ' : 'Oxunmuş kimi işarələ'}
                      >
                        <span className={`material-symbols-outlined text-[18px] ${
                          msg.is_read ? 'text-slate-300 hover:text-slate-500' : 'text-amber-500 fill-current'
                        }`}>
                          {msg.is_read ? 'drafts' : 'mark_email_unread'}
                        </span>
                      </button>
                    </td>

                    {/* Sender */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-[#b45309] transition-colors">
                        {msg.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{msg.email}</div>
                      {msg.phone && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">phone</span>
                          <span>{msg.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Subject and Message snippet */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-semibold text-slate-800 truncate mb-0.5">
                        {msg.subject || 'Mövzusuz'}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {msg.message}
                      </div>
                      {msg.admin_notes && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <span className="material-symbols-outlined text-[11px]">sticky_note_2</span>
                          <span className="truncate max-w-[200px]">Qeyd: {msg.admin_notes}</span>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      <div>{msg.created_at ? msg.created_at.split(' ')[0] : ''}</div>
                      <div className="text-[10px] text-slate-400">
                        {msg.created_at ? msg.created_at.split(' ')[1]?.substring(0, 5) : ''}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={msg.status}
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-full border cursor-pointer outline-none ${getStatusBadge(msg.status)}`}
                      >
                        <option value="Yeni">Yeni</option>
                        <option value="Oxundu">Oxundu</option>
                        <option value="Cavablandırıldı">Cavablandırıldı</option>
                        <option value="Arxiv">Arxiv</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(msg)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#05224a] hover:bg-slate-100 cursor-pointer"
                          title="Ətraflı bax"
                        >
                          <span className="material-symbols-outlined text-[17px]">visibility</span>
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=${encodeURIComponent('RE: ' + (msg.subject || 'Müraciətinizə cavab'))}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 cursor-pointer"
                          title="E-poçtla cavab ver"
                        >
                          <span className="material-symbols-outlined text-[17px]">reply</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(msg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Sil"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {totalCount > limit && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              Cəmi <strong>{totalCount}</strong> mesaj (Səhifə {page} / {Math.ceil(totalCount / limit)})
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                className="px-2.5 py-1 rounded border border-slate-300 bg-white disabled:opacity-40 cursor-pointer hover:bg-slate-50 font-semibold"
              >
                Əvvəlki
              </button>
              <button
                type="button"
                disabled={page >= Math.ceil(totalCount / limit)}
                onClick={() => setPage(prev => prev + 1)}
                className="px-2.5 py-1 rounded border border-slate-300 bg-white disabled:opacity-40 cursor-pointer hover:bg-slate-50 font-semibold"
              >
                Növbəti
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-7 border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedMsg.status)}`}>
                    {selectedMsg.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedMsg.created_at}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 truncate">
                  {selectedMsg.subject || 'Mövzusuz'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 overflow-y-auto space-y-5 flex-1 pr-1">
              {/* Sender Info Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Göndərən</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedMsg.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">E-poçt</span>
                  <a href={`mailto:${selectedMsg.email}`} className="font-semibold text-[#05224a] hover:underline">
                    {selectedMsg.email}
                  </a>
                </div>
                {selectedMsg.phone && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Telefon</span>
                    <a href={`tel:${selectedMsg.phone}`} className="font-semibold text-slate-800 hover:underline">
                      {selectedMsg.phone}
                    </a>
                  </div>
                )}
                {selectedMsg.ip_address && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">IP Ünvan</span>
                    <span className="font-mono text-slate-600">{selectedMsg.ip_address}</span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Mesajın Məzmunu:
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Admin Note Section */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Daxili Admin Qeydi
                </span>
                <p className="text-[11px] text-slate-400 mb-2">
                  Bu qeydi yalnız administratorlar görür (istifadəçiyə görünmür).
                </p>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={adminNoteInput}
                    onChange={e => setAdminNoteInput(e.target.value)}
                    placeholder="Məs: 'Telefonla əlaqə saxlanıldı, təlim paketimiz göndərildi'..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#05224a] outline-none resize-none"
                  />
                  <button
                    type="button"
                    disabled={isSavingNote}
                    onClick={handleSaveNote}
                    className="px-4 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer self-stretch"
                  >
                    {isSavingNote ? '...' : 'Yadda Saxla'}
                  </button>
                </div>
              </div>

              {/* Status Switcher inside modal */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Müraciət Statusunu Dəyiş:</span>
                <div className="flex gap-1.5">
                  {['Yeni', 'Oxundu', 'Cavablandırıldı', 'Arxiv'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedMsg.id, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedMsg.status === st
                          ? 'bg-[#05224a] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedMsg)}
                className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Mesajı Sil</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMsg.email}?subject=${encodeURIComponent('RE: ' + (selectedMsg.subject || 'Müraciətinizə cavab'))}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">reply</span>
                  <span>E-poçtla Cavab Ver</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMsg(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Bağla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Mesajı Silməyə Əminsiniz?"
        message="Bu əlaqə mesajı sistemdən birdəfəlik silinəcək və geri qaytarılması mümkün olmayacaqdır."
        itemName={deleteTarget ? `${deleteTarget.name}: ${deleteTarget.subject || 'Mesaj'}` : ''}
        confirmText="Bəli, Sil"
        cancelText="Ləğv Et"
        isDanger={true}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

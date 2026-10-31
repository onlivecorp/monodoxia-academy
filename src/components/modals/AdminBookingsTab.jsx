import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminBookingsTab() {
  const {
    bookings = [],
    updateBookingStatus,
    refreshBookings,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCoach, setFilterCoach] = useState('all');
  const [approvalEndTimes, setApprovalEndTimes] = useState({});

  // Extract unique coach names
  const coachNames = Array.from(new Set(bookings.map(b => b.coachName || b.coach_name).filter(Boolean)));

  const filteredBookings = (bookings || []).filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (filterCoach !== 'all') {
      const cName = b.coachName || b.coach_name;
      if (cName !== filterCoach) return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchClient = (b.userName || b.user_name || '').toLowerCase().includes(q);
      const matchPhone = (b.userPhone || b.user_phone || '').toLowerCase().includes(q);
      const matchEmail = (b.userEmail || b.user_email || '').toLowerCase().includes(q);
      const matchCoach = (b.coachName || b.coach_name || '').toLowerCase().includes(q);
      const matchId = (b.id || '').toLowerCase().includes(q);
      if (!matchClient && !matchPhone && !matchEmail && !matchCoach && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-amber-600">calendar_month</span>
            Fərdi Kouçinq və Mentorluq Rezervasiyaları
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Saytdan gələn qonaq və qeydiyyatlı istifadəçi seans müraciətləri ({filteredBookings.length} / {bookings.length})
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (refreshBookings) refreshBookings();
            showToast('Rezervasiyalar yenilənir...', 'info');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer shadow-2xs"
          title="Serverdən ən son rezervasiyaları yüklə"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Yenilə</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Müştəri adı, telefon, kouç..."
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Bütün Statuslar</option>
            <option value="Gözləyir">Gözləyir</option>
            <option value="Təsdiqləndi">Təsdiqləndi</option>
            <option value="Ləğv edildi">Ləğv edildi</option>
          </select>
        </div>

        <div>
          <select
            value={filterCoach}
            onChange={e => setFilterCoach(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Bütün Kouçlar</option>
            {coachNames.map(cn => (
              <option key={cn} value={cn}>{cn}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
          <span className="material-symbols-outlined text-4xl block text-slate-300 mb-2">event_busy</span>
          Bu filtr üzrə heç bir seans rezervasiyası tapılmadı.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                b.status === 'Təsdiqləndi' ? 'border-emerald-200 hover:border-emerald-300' :
                b.status === 'Ləğv edildi' ? 'border-rose-200 opacity-70' :
                'border-amber-200 hover:border-amber-400'
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    {b.userName || b.user_name || 'Qonaq'}
                  </span>
                  {b.isGuest ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Qonaq
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                      Hesablı İstifadəçi
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status === 'Təsdiqləndi' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    b.status === 'Ləğv edildi' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                    'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                  }`}>
                    {b.status || 'Gözləyir'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">#{b.id}</span>
                </div>

                <div className="text-xs text-slate-700 flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-amber-600">psychology</span>
                    Kouç: <strong>{b.coachName || b.coach_name || 'Təyin edilməyib'}</strong>
                  </span>
                  <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {b.slot || `${b.selectedDate || ''} ${b.startTime || ''}-${b.endTime || ''}`}
                  </span>
                  <span className="text-slate-500">• {b.format}</span>
                </div>

                {/* Contact info */}
                <div className="text-[11px] text-slate-600 flex items-center gap-3 flex-wrap pt-0.5">
                  {(b.userPhone || b.user_phone) && (
                    <a
                      href={`tel:${b.userPhone || b.user_phone}`}
                      className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">phone</span>
                      {b.userPhone || b.user_phone}
                    </a>
                  )}
                  {(b.userEmail || b.user_email) && (
                    <span className="text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">mail</span>
                      {b.userEmail || b.user_email}
                    </span>
                  )}
                  {(b.userAddress || b.user_address) && (
                    <span className="text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                      {b.userAddress || b.user_address}
                    </span>
                  )}
                  {b.notes && (
                    <span className="text-slate-500 italic block w-full mt-1">
                      Qeyd: "{b.notes}"
                    </span>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                {b.status !== 'Təsdiqləndi' && (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="time"
                      value={approvalEndTimes[b.id] || b.endTime || (b.startTime ? (() => { const [h,m] = (b.startTime||'00:00').split(':').map(Number); return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`; })() : '15:00')}
                      onChange={e => setApprovalEndTimes(prev => ({ ...prev, [b.id]: e.target.value }))}
                      className="px-2 py-1 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      title="Bitiş saatını təyin edin"
                    />
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(b.id, 'Təsdiqləndi', { endTime: approvalEndTimes[b.id] || b.endTime || (b.startTime ? (() => { const [h,m] = (b.startTime||'00:00').split(':').map(Number); return `${String(h+1).padStart(2,'0')}:${String(m).padStart(2,'0')}`; })() : '') })}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer transition-colors"
                      title="Qəbul et və təsdiqlə"
                    >
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      <span>Qəbul Et</span>
                    </button>
                  </div>
                )}
                {b.status !== 'Ləğv edildi' && (
                  <button
                    type="button"
                    onClick={() => updateBookingStatus(b.id, 'Ləğv edildi')}
                    className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                    title="Ləğv et"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                    <span>Ləğv Et</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


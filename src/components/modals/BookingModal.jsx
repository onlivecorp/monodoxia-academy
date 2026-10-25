import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function BookingModal() {
  const { bookingModalOpen, setBookingModalOpen, activeCoach, confirmBooking, currentUser, usersList = [], bookings = [], bookingPreselectedSlot, setBookingPreselectedSlot } = useApp();
  const [slot, setSlot] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customDate, setCustomDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [customStartTime, setCustomStartTime] = useState('15:00');
  const [customEndTime, setCustomEndTime] = useState('16:00');
  const [type, setType] = useState('Online (Təhlükəsiz Video Otaq)');
  const [notes, setNotes] = useState('');

  // Sync preselected slot when modal opens
  useEffect(() => {
    if (bookingModalOpen) {
      setSlot(bookingPreselectedSlot || '');
      setUseCustomTime(false);
    }
  }, [bookingModalOpen, bookingPreselectedSlot]);

  // Confirmed bookings for this coach from database
  const confirmedCoachBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchCoach = (b.coachId && b.coachId === activeCoach.id) ||
                         (b.coachName && activeCoach.name && b.coachName.toLowerCase().trim() === activeCoach.name.toLowerCase().trim());
      return matchCoach && b.status === 'Təsdiqləndi';
    });
  }, [bookings, activeCoach]);

  // Coach's booked slots from profile
  const coachBookedSlots = useMemo(() => {
    return Array.isArray(activeCoach?.bookedSlots) ? activeCoach.bookedSlots : [];
  }, [activeCoach]);

  // Combine and normalize all schedule slots
  const allSlots = useMemo(() => {
    const list = [];
    if (Array.isArray(activeCoach?.scheduleSlots) && activeCoach.scheduleSlots.length > 0) {
      activeCoach.scheduleSlots.forEach(s => {
        const lbl = s.label || `${s.date || ''} ${s.startTime || ''}-${s.endTime || ''}`.trim();
        if (lbl === 'Sabah 15:00' || lbl === 'Cümə 18:00') return;
        list.push({
          id: s.id || lbl,
          label: lbl,
          isBooked: Boolean(s.isBooked),
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          note: s.note
        });
      });
    }

    if (Array.isArray(activeCoach?.availableSlots)) {
      activeCoach.availableSlots.forEach((s, idx) => {
        const text = typeof s === 'string' ? s : (s.label || s.slot || '');
        if (text === 'Sabah 15:00' || text === 'Cümə 18:00') return;
        if (text && !list.some(item => item.label === text)) {
          // Check if marked in coachBookedSlots or confirmedCoachBookings
          const isMarkedBooked = coachBookedSlots.some(bs => (typeof bs === 'string' && bs === text) || (bs.slot && bs.slot === text)) ||
                                 confirmedCoachBookings.some(cb => cb.slot === text);
          list.push({
            id: 'avail-' + idx,
            label: text,
            isBooked: isMarkedBooked
          });
        }
      });
    }

    return list;
  }, [activeCoach, coachBookedSlots, confirmedCoachBookings]);

  // First available (non-booked) slot
  const firstAvailable = allSlots.find(s => !s.isBooked)?.label || '';
  const currentSlot = slot || firstAvailable || (allSlots[0]?.label || 'Fərdi razılaşma ilə');

  // Check if selected slot or custom time is booked
  const isSelectedSlotBooked = useMemo(() => {
    if (useCustomTime) {
      const formattedDate = customDate.split('-').reverse().join('.');
      const customLabel = `${formattedDate} ${customStartTime} - ${customEndTime}`.trim();
      return allSlots.some(s => s.isBooked && (s.label.includes(customLabel) || (s.date === customDate && s.startTime === customStartTime))) ||
             confirmedCoachBookings.some(cb => cb.slot?.includes(customLabel));
    }
    const found = allSlots.find(s => s.label === currentSlot);
    return found ? found.isBooked : false;
  }, [useCustomTime, customDate, customStartTime, customEndTime, currentSlot, allSlots, confirmedCoachBookings]);

  if (!bookingModalOpen || !activeCoach) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSelectedSlotBooked) return;

    let finalSlotText = currentSlot;
    if (useCustomTime) {
      const formattedDate = customDate.split('-').reverse().join('.');
      finalSlotText = `${formattedDate} ${customStartTime} - ${customEndTime}`;
    }

    confirmBooking({
      coachId: activeCoach.id,
      coachName: activeCoach.name,
      slot: finalSlotText,
      selectedDate: useCustomTime ? customDate : '',
      startTime: useCustomTime ? customStartTime : '',
      endTime: useCustomTime ? customEndTime : '',
      type,
      notes,
      userName: currentUser?.name || 'Qonaq İstifadəçi',
      userEmail: currentUser?.email || '',
      userPhone: currentUser?.phone || '',
      status: 'Gözləyir'
    });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/50">
      <div className="bg-[#fcfbf9] rounded-3xl border border-amber-900/15 shadow-2xl max-w-lg w-full p-6 relative overflow-hidden animate-fadeIn">
        <button
          onClick={() => setBookingModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-200">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-500/30 shrink-0 bg-amber-50 flex items-center justify-center shadow-xs">
            {(() => {
              let coachImg = activeCoach.image || activeCoach.avatar;
              if (!coachImg) {
                const matchedUser = (usersList || []).find(u => 
                  (activeCoach.userId && String(u.id) === String(activeCoach.userId)) || 
                  (activeCoach.name && u.name && u.name.toLowerCase().trim() === activeCoach.name.toLowerCase().trim())
                ) || (currentUser && ((activeCoach.userId && String(currentUser.id) === String(activeCoach.userId)) || (activeCoach.name && currentUser.name && activeCoach.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim())) ? currentUser : null);
                coachImg = matchedUser?.avatar || matchedUser?.image || '';
              }
              if (!coachImg) {
                try {
                  const imgStore = JSON.parse(localStorage.getItem('monodoxia_coach_images') || '{}');
                  if (imgStore[activeCoach.id]) coachImg = imgStore[activeCoach.id];
                } catch (e) {}
              }
              return coachImg ? (
                <img
                  src={coachImg}
                  alt={activeCoach.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
                  {activeCoach.name?.[0] || 'K'}
                </div>
              );
            })()}
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 tracking-wider uppercase border border-amber-300">
              Kouçinq & Seans Rezervasiyası
            </span>
            <h4 className="font-serif text-lg text-slate-900 font-bold mt-0.5">{activeCoach.name}</h4>
            <span className="text-xs text-slate-500">{activeCoach.title}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Slot Selection Method Toggle */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setUseCustomTime(false)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !useCustomTime ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">schedule</span>
              <span>Cədvəldən Seç</span>
            </button>
            <button
              type="button"
              onClick={() => setUseCustomTime(true)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                useCustomTime ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">calendar_month</span>
              <span>Təqvimdən Saat Təyin Et</span>
            </button>
          </div>

          {!useCustomTime ? (
            /* Choose from coach's configured slots */
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">event_seat</span>
                  Mövcud və Rezerv Edilə Bilən Saatlar
                </label>
                <span className="text-[11px] text-slate-400">
                  {allSlots.filter(s => !s.isBooked).length} boş saat
                </span>
              </div>

              {allSlots.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {allSlots.map((s, idx) => {
                    const isSelected = currentSlot === s.label;
                    const isBooked = s.isBooked;

                    return (
                      <label
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isBooked
                            ? 'bg-rose-50/60 border-rose-200 text-slate-400 cursor-not-allowed opacity-75'
                            : isSelected
                            ? 'bg-amber-50/80 border-amber-500 text-slate-900 font-semibold ring-1 ring-amber-500'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="radio"
                            name="slotOption"
                            disabled={isBooked}
                            checked={isSelected && !isBooked}
                            onChange={() => setSlot(s.label)}
                            className="text-amber-600 focus:ring-amber-500 shrink-0"
                          />
                          <span className="truncate">{s.label}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          isBooked
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {isBooked ? '🔴 Dolu / Rezerv olunub' : '🟢 Sərbəst / Boş'}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0">info</span>
                  <span>Bu kouç üçün hazırda təyin edilmiş saat yoxdur. "Təqvimdən Saat Təyin Et" bölməsindən istədiyiniz vaxtı təklif edə bilərsiniz.</span>
                </div>
              )}
            </div>
          ) : (
            /* Custom calendar date and hour range */
            <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-amber-700">calendar_today</span>
                  Tarix Seçin
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Başlama Saatı
                  </label>
                  <input
                    type="time"
                    value={customStartTime}
                    onChange={e => setCustomStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bitmə Saatı
                  </label>
                  <input
                    type="time"
                    value={customEndTime}
                    onChange={e => setCustomEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {isSelectedSlotBooked && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 animate-fadeIn">
                  <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">error</span>
                  <span>Bu saat aralığı artıq ekspert tərəfindən rezerv olunub (doludur). Zəhmət olmasa digər vaxt seçin.</span>
                </div>
              )}
            </div>
          )}

          {/* Session Format */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-amber-600">videocam</span>
              Sessiya Formatı
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="Online (Təhlükəsiz Video Otaq)">Onlayn (Təhlükəsiz Video Otaq - Zoom/Google Meet/WebRTC)</option>
              <option value="Offline (Bakı Mərkəzi Ofis)">Oflayn (Bakı Mərkəzi Ofis - Nizami küç. 142)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-amber-600">chat</span>
              Fokus Sahəniz və ya Qeydlər
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sessiyada müzakirə etmək istədiyiniz mövzu haqqında qısa qeyd..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSelectedSlotBooked}
            className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isSelectedSlotBooked
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-600/25'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              {isSelectedSlotBooked ? 'block' : 'check_circle'}
            </span>
            <span>
              {isSelectedSlotBooked ? 'Bu Saat Doludur (Digərini Seçin)' : 'Sessiyanı Təsdiqlə və Rezerv Et'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

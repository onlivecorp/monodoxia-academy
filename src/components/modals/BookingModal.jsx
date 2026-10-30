import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { COACHES } from '../../data/mockData';

// Generate time slots for a day in 30-min increments
function generateTimeSlots(startHour = 8, endHour = 21, stepMin = 30) {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

// Format date to "DD.MM.YYYY"
function formatDateAz(dateStr) {
  if (!dateStr) return '';
  return dateStr.split('-').reverse().join('.');
}

// Check if time overlaps with a booked/blocked interval
function timesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

export default function BookingModal() {
  const {
    bookingModalOpen,
    setBookingModalOpen,
    activeCoach,
    confirmBooking,
    currentUser,
    usersList = [],
    bookings = [],
    timeBlocks = [],
    bookingPreselectedSlot,
    setBookingPreselectedSlot,
    setAuthModalOpen,
    setAuthModalTab
  } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().slice(0, 5); // HH:MM

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedStart, setSelectedStart] = useState('');
  const [selectedEnd, setSelectedEnd] = useState('');
  const [type, setType] = useState('Online (Təhlükəsiz Video Otaq)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // null | 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  // Non-authenticated user choice: 'guest_form' | 'login_register'
  const [authChoice, setAuthChoice] = useState('guest_form');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');

  // Mini-calendar state
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth()); // 0-indexed

  // Reset when modal opens
  useEffect(() => {
    if (bookingModalOpen) {
      setSelectedDate(today);
      setSelectedStart('');
      setSelectedEnd('');
      setNotes('');
      setIsSubmitting(false);
      setSubmitResult(null);
      setSubmitMessage('');
      setAuthChoice('guest_form');
      setGuestFirstName('');
      setGuestLastName('');
      setGuestPhone('');
      setGuestAddress('');
      const now = new Date();
      setCalendarYear(now.getFullYear());
      setCalendarMonth(now.getMonth());

      // If preselected slot exists, try to parse it
      if (bookingPreselectedSlot) {
        const match = bookingPreselectedSlot.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (match) {
          const [, d, mo, y, start, end] = match;
          const dateVal = `${y}-${mo}-${d}`;
          setSelectedDate(dateVal);
          setSelectedStart(start);
          setSelectedEnd(end);
        }
      }
    }
  }, [bookingModalOpen, bookingPreselectedSlot]);

  // Confirmed bookings for this coach
  const confirmedBookings = useMemo(() => {
    if (!activeCoach || !Array.isArray(bookings)) return [];
    return bookings.filter(b => {
      const matchCoach = (b.coachId && b.coachId === activeCoach.id) ||
        (b.coachName && activeCoach.name && b.coachName.toLowerCase().trim() === activeCoach.name.toLowerCase().trim());
      return matchCoach && b.status === 'Təsdiqləndi';
    });
  }, [bookings, activeCoach]);

  // Manual blocks for this coach
  const coachBlocks = useMemo(() => {
    if (!activeCoach || !Array.isArray(timeBlocks)) return [];
    return timeBlocks.filter(tb => tb.coachId === activeCoach.id);
  }, [timeBlocks, activeCoach]);

  // Coach schedule slots (from profile)
  const scheduleSlots = useMemo(() => {
    if (!activeCoach) return [];
    return (Array.isArray(activeCoach.scheduleSlots) ? activeCoach.scheduleSlots : [])
      .filter(s => {
        const lbl = typeof s === 'string' ? s : s?.label;
        return lbl !== 'Sabah 15:00' && lbl !== 'Cümə 18:00';
      });
  }, [activeCoach]);

  // Get status of a specific time slot for selected date
  const getSlotStatus = useCallback((slotTime) => {
    const slotEndDefault = (() => {
      const [h, m] = slotTime.split(':').map(Number);
      const newM = m + 30;
      const newH = h + Math.floor(newM / 60);
      return `${String(newH).padStart(2, '0')}:${String(newM % 60).padStart(2, '0')}`;
    })();

    // Past time?
    if (selectedDate === today && slotTime <= nowTime) return 'past';

    // Manual block?
    const isBlocked = coachBlocks.some(tb => {
      if (tb.date !== selectedDate) return false;
      return timesOverlap(slotTime, slotEndDefault, tb.startTime, tb.endTime);
    });
    if (isBlocked) return 'blocked';

    // Confirmed booking?
    const isBooked = confirmedBookings.some(b => {
      if (b.selectedDate !== selectedDate) return false;
      if (!b.startTime) return false;
      const bEnd = b.endTime || slotEndDefault;
      return timesOverlap(slotTime, slotEndDefault, b.startTime, bEnd);
    });
    if (isBooked) return 'booked';

    // Coach's manually marked slots in schedule
    const isMarked = scheduleSlots.some(s => {
      if (typeof s === 'string') return false;
      if (!s.isBooked) return false;
      if (s.date !== selectedDate) return false;
      if (!s.startTime) return false;
      const sEnd = s.endTime || slotEndDefault;
      return timesOverlap(slotTime, slotEndDefault, s.startTime, sEnd);
    });
    if (isMarked) return 'booked';

    return 'available';
  }, [selectedDate, today, nowTime, coachBlocks, confirmedBookings, scheduleSlots]);

  // Check if selected time range is valid and available
  const conflictError = useMemo(() => {
    if (!selectedStart || !selectedEnd) return null;
    if (selectedStart >= selectedEnd) return 'Bitmə saatı başlama saatından sonra olmalıdır.';
    if (selectedDate === today && selectedStart <= nowTime) return 'Keçmiş vaxt üçün rezervasiya etmək mümkün deyil.';
    if (selectedDate < today) return 'Keçmiş tarix üçün rezervasiya etmək mümkün deyil.';

    // Block conflict
    const blockHit = coachBlocks.find(tb => {
      if (tb.date !== selectedDate) return false;
      return timesOverlap(selectedStart, selectedEnd, tb.startTime, tb.endTime);
    });
    if (blockHit) return `Bu vaxt aralığı ekspert tərəfindən bloklanıb${blockHit.reason ? ': ' + blockHit.reason : ''}.`;

    // Booking conflict
    const bookingHit = confirmedBookings.find(b => {
      if (b.selectedDate !== selectedDate || !b.startTime) return false;
      const bEnd = b.endTime || selectedEnd;
      return timesOverlap(selectedStart, selectedEnd, b.startTime, bEnd);
    });
    if (bookingHit) return 'Bu vaxt aralığı artıq başqa bir rezervasiya tərəfindən tutulub.';

    return null;
  }, [selectedStart, selectedEnd, selectedDate, today, nowTime, coachBlocks, confirmedBookings]);

  // Available slots list for selected date (from coach schedule, if any defined slots for this date)
  const availableSlotsForDate = useMemo(() => {
    if (!activeCoach) return [];
    // Check if coach has explicit slots for this date
    const dateSlots = scheduleSlots.filter(s => {
      if (typeof s === 'string') return false;
      return s.date === selectedDate;
    });
    if (dateSlots.length > 0) return dateSlots;
    // Otherwise generate standard 30-min slots
    return generateTimeSlots(8, 21, 30).map(t => ({ id: t, startTime: t, label: t }));
  }, [activeCoach, scheduleSlots, selectedDate]);

  // Calendar helpers
  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y, m) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1; // Monday-first
  };

  const dayNames = ['B.e', 'Ç.a', 'Çər', 'C.a', 'Cüm', 'Şnb', 'Baz'];
  const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

  // Check if a calendar day has any available slots (not all blocked)
  const getDayMeta = useCallback((y, m, d) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (dateStr < today) return 'past';

    // Has confirmed booking on this day?
    const hasBooking = confirmedBookings.some(b => b.selectedDate === dateStr);
    // Has manual block on this day?
    const hasBlock = coachBlocks.some(tb => tb.date === dateStr);

    if (hasBooking || hasBlock) return 'partial'; // some slots taken
    return 'free';
  }, [today, confirmedBookings, coachBlocks]);

  if (!bookingModalOpen || !activeCoach) return null;

  // Coach image
  let coachImg = activeCoach.image || activeCoach.avatar;
  if (coachImg && (coachImg.includes('googleusercontent.com') || coachImg.startsWith('/uploads/'))) coachImg = '';
  if (!coachImg) {
    try {
      const imgStore = JSON.parse(localStorage.getItem('monodoxia_coach_images') || '{}');
      if (imgStore[activeCoach.id] && !imgStore[activeCoach.id].includes('googleusercontent.com') && !imgStore[activeCoach.id].startsWith('/uploads/')) coachImg = imgStore[activeCoach.id];
    } catch (e) {}
  }
  if (!coachImg) {
    const seed = COACHES.find(sc => sc.id === activeCoach.id || (sc.name && activeCoach.name && sc.name.toLowerCase().trim() === activeCoach.name.toLowerCase().trim()));
    if (seed?.image) coachImg = seed.image;
  }
  if (!coachImg) {
    coachImg = activeCoach.id === 'coach-farid' ? '/images/coaches/coach-farid.jpg' : (activeCoach.id === 'coach-nargiz' ? '/images/coaches/coach-nargiz.jpg' : '/images/coaches/coach-sedaqet.jpg');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (conflictError || !selectedStart || !selectedEnd) return;

    if (!currentUser) {
      if (authChoice === 'login_register') {
        setAuthModalTab('login');
        setAuthModalOpen(true);
        return;
      }
      if (!guestFirstName.trim() || !guestLastName.trim() || !guestPhone.trim() || !guestAddress.trim()) {
        setSubmitResult('error');
        setSubmitMessage('Zəhmət olmasa müraciət üçün Ad, Soyad, Telefon (WhatsApp) və Ünvan xanalarını tam doldurun.');
        return;
      }
    }

    setIsSubmitting(true);
    const formattedDate = formatDateAz(selectedDate);
    const slotText = `${formattedDate} ${selectedStart} - ${selectedEnd}`;

    const clientName = currentUser
      ? (currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'İstifadəçi')
      : `${guestFirstName.trim()} ${guestLastName.trim()}`;

    const clientPhone = currentUser ? (currentUser.phone || '') : guestPhone.trim();
    const clientAddress = currentUser ? (currentUser.address || '') : guestAddress.trim();

    const result = confirmBooking({
      coachId: activeCoach.id,
      coachName: activeCoach.name,
      slot: slotText,
      selectedDate,
      startTime: selectedStart,
      endTime: selectedEnd,
      type,
      notes,
      userName: clientName,
      userEmail: currentUser?.email || '',
      userPhone: clientPhone,
      userAddress: clientAddress,
      isGuest: !currentUser,
      status: 'Gözləyir'
    });

    setIsSubmitting(false);
    if (result === false) {
      setSubmitResult('error');
      setSubmitMessage('Rezervasiya zamanı xəta baş verdi. Vaxt intervalı artıq tutulmuş ola bilər.');
    } else {
      setSubmitResult('success');
      setSubmitMessage(`Rezervasiya müraciətiniz qeydə alındı! Ekspert tezliklə sizinlə əlaqə saxlayacaq.\n\nMüştəri: ${clientName}\nTel (WhatsApp): ${clientPhone || 'Qeyd edilməyib'}${clientAddress ? '\nÜnvan: ' + clientAddress : ''}\nTarix: ${formattedDate}\nSaat: ${selectedStart} – ${selectedEnd}\nFormat: ${type}`);
    }
  };

  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else setCalendarMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else setCalendarMonth(m => m + 1);
  };

  const totalDays = daysInMonth(calendarYear, calendarMonth);
  const firstDay = firstDayOfMonth(calendarYear, calendarMonth);
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let i = 1; i <= totalDays; i++) calDays.push(i);

  // Success screen
  if (submitResult === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div 
          className="fixed inset-0 bg-[#070f1e]/80 backdrop-blur-md" 
          onClick={() => { setBookingModalOpen(false); setSubmitResult(null); }} 
        />
        <div className="relative bg-[#fcfbf9] rounded-3xl border border-amber-900/15 shadow-2xl max-w-md w-full p-6 sm:p-8 z-10 animate-scaleUp text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">Müraciət Göndərildi!</h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mb-5">{submitMessage}</p>
          <button
            type="button"
            onClick={() => { setBookingModalOpen(false); setSubmitResult(null); }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold tracking-wider shadow-md cursor-pointer"
          >
            Bağla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#070f1e]/80 backdrop-blur-md transition-opacity" 
        onClick={() => setBookingModalOpen(false)} 
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative bg-[#fcfbf9] border border-amber-900/15 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden z-10 animate-scaleUp my-auto text-[#071326]"
      >
        {/* Top Gold Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19] shrink-0" />

        {/* Fixed Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-[#fcfbf9] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-500/30 shrink-0 bg-amber-50 flex items-center justify-center shadow-xs">
              {coachImg ? (
                <img
                  src={coachImg}
                  alt={activeCoach.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/coaches/coach-sedaqet.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] font-serif font-bold text-lg flex items-center justify-center">
                  {activeCoach.name?.[0] || 'K'}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-900 tracking-wider uppercase border border-amber-300">
                Kouçinq Rezervasiyası
              </span>
              <h4 id="booking-modal-title" className="font-serif text-base text-slate-900 font-bold truncate leading-tight mt-0.5">
                {activeCoach.name}
              </h4>
              <span className="text-[11px] text-slate-500 truncate block leading-tight">{activeCoach.title}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBookingModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Bağla"
          >
            <span className="material-symbols-outlined text-[19px]">close</span>
          </button>
        </div>

        {/* Form with scrollable body + fixed footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* MINI CALENDAR */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              {/* Calendar header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                  aria-label="Əvvəlki ay"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {monthNames[calendarMonth]} {calendarYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                  aria-label="Növbəti ay"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                {dayNames.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1.5 uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 p-1.5 gap-1">
                {calDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} />;
                  const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isPast = dateStr < today;
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;
                  const meta = getDayMeta(calendarYear, calendarMonth, day);

                  return (
                    <button
                      type="button"
                      key={day}
                      disabled={isPast}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedStart('');
                        setSelectedEnd('');
                      }}
                      className={`
                        relative h-8 sm:h-9 flex flex-col items-center justify-center rounded-lg text-xs font-semibold transition-all cursor-pointer
                        ${isPast ? 'text-slate-300 cursor-not-allowed bg-transparent' : ''}
                        ${isSelected ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400' : ''}
                        ${!isPast && !isSelected ? 'hover:bg-amber-50 hover:text-amber-800 text-slate-700' : ''}
                        ${isToday && !isSelected ? 'ring-1 ring-amber-400 text-amber-700 font-bold' : ''}
                      `}
                      aria-label={`${day} ${monthNames[calendarMonth]}`}
                    >
                      <span>{day}</span>
                      {!isPast && (
                        <span className={`w-1 h-1 rounded-full -mt-0.5 ${
                          meta === 'partial' ? 'bg-amber-400' :
                          meta === 'free' ? 'bg-emerald-400' : ''
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="px-3.5 py-1.5 border-t border-slate-100 flex items-center gap-3.5 text-[10px] text-slate-500 flex-wrap bg-slate-50/30">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/> Boş gün</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"/> Qismən dolu</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"/> Keçmiş</span>
              </div>
            </div>

            {/* Selected date display */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-amber-50/80 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-600">calendar_today</span>
                <span className="text-xs font-bold text-amber-900">
                  Seçilmiş tarix: {formatDateAz(selectedDate)}
                </span>
              </div>
              <span className="text-[10px] text-amber-700 font-medium">Aşağıdan saat seçin</span>
            </div>

            {/* Time slots */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">schedule</span>
                  Başlama Saatı Seçin
                </label>
                <div className="flex items-center gap-2.5 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-200 inline-block border border-emerald-400"/> Boş</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-100 inline-block border border-rose-300"/> Rezerv</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-purple-100 inline-block border border-purple-300"/> Blok</span>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-1 bg-slate-50/50 rounded-xl border border-slate-100">
                {generateTimeSlots(8, 21, 30).map(slotTime => {
                  const status = getSlotStatus(slotTime);
                  const isSelected = selectedStart === slotTime;
                  const isUnavailable = status === 'past' || status === 'booked' || status === 'blocked';

                  return (
                    <button
                      type="button"
                      key={slotTime}
                      disabled={isUnavailable}
                      onClick={() => {
                        if (isUnavailable) return;
                        setSelectedStart(slotTime);
                        const [h, m] = slotTime.split(':').map(Number);
                        const newH = h + 1;
                        if (newH < 21) {
                          setSelectedEnd(`${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                        } else {
                          setSelectedEnd('');
                        }
                      }}
                      className={`
                        py-1.5 rounded-lg text-[11px] font-semibold text-center transition-all
                        ${status === 'past' ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed' : ''}
                        ${status === 'booked' ? 'bg-rose-50 text-rose-300 border border-rose-200 cursor-not-allowed' : ''}
                        ${status === 'blocked' ? 'bg-purple-50 text-purple-300 border border-purple-200 cursor-not-allowed' : ''}
                        ${status === 'available' && !isSelected ? 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer shadow-2xs' : ''}
                        ${isSelected ? 'bg-amber-600 text-white border border-amber-500 ring-2 ring-amber-400 shadow-sm' : ''}
                      `}
                      title={
                        status === 'past' ? 'Keçmiş vaxt' :
                        status === 'booked' ? 'Rezervasiya edilib' :
                        status === 'blocked' ? 'Bloklanmış vaxt' :
                        'Seçmək üçün klikləyin'
                      }
                    >
                      {slotTime}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* End time selector */}
            {selectedStart && (
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5 animate-fadeIn">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-600">timer</span>
                  <span className="text-xs font-bold text-amber-900">
                    Başlama saatı: <strong>{selectedStart}</strong> — Seansın Bitmə Saatı:
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {generateTimeSlots(8, 22, 30)
                    .filter(t => t > selectedStart)
                    .slice(0, 12)
                    .map(endTime => {
                      const isSelectedEnd = selectedEnd === endTime;
                      const dur = (() => {
                        const [sh, sm] = selectedStart.split(':').map(Number);
                        const [eh, em] = endTime.split(':').map(Number);
                        const mins = (eh * 60 + em) - (sh * 60 + sm);
                        return mins >= 60 ? `${Math.floor(mins/60)}s${mins%60 ? ' ' + mins%60 + 'dq' : ''}` : `${mins}dq`;
                      })();
                      return (
                        <button
                          type="button"
                          key={endTime}
                          onClick={() => setSelectedEnd(endTime)}
                          className={`py-1.5 rounded-lg text-[10px] font-semibold text-center transition-all cursor-pointer ${
                            isSelectedEnd
                              ? 'bg-amber-600 text-white border border-amber-500 ring-2 ring-amber-400 shadow-sm'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400 hover:bg-amber-50'
                          }`}
                        >
                          <div>{endTime}</div>
                          <div className="text-[9px] opacity-75">{dur}</div>
                        </button>
                      );
                    })
                  }
                </div>

                {/* Conflict error */}
                {conflictError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 animate-fadeIn">
                    <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">error</span>
                    <span>{conflictError}</span>
                  </div>
                )}

                {/* Selected interval summary */}
                {selectedStart && selectedEnd && !conflictError && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0">event_available</span>
                    <span>
                      Seçilmiş interval: <strong>{formatDateAz(selectedDate)} · {selectedStart} – {selectedEnd}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* İSTİFADƏÇİ STATUSU VƏ YA QONAQ SEÇİMİ */}
            {currentUser ? (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">verified_user</span>
                  <div>
                    <span className="font-bold text-emerald-950 block">
                      Daxil olmusunuz: {currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()}
                    </span>
                    <span className="text-[11px] text-emerald-700">{currentUser.email || currentUser.phone || ''}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                  Hesabla Giriş
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px] text-amber-600">how_to_reg</span>
                    Rezervasiya Üçün Seçim Edin
                  </label>
                  <span className="text-[10px] text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                    Giriş edilməyib
                  </span>
                </div>

                {/* 2 Seçim Düyməsi: a və b */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthChoice('login_register')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                      authChoice === 'login_register'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-400/40'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] shrink-0 ${authChoice === 'login_register' ? 'text-white' : 'text-amber-600'}`}>
                      account_circle
                    </span>
                    <div>
                      <span className="text-xs font-bold block">a) Sayta Giriş / Qeydiyyat</span>
                      <span className={`text-[10px] block leading-tight ${authChoice === 'login_register' ? 'text-amber-100' : 'text-slate-500'}`}>
                        Hesabınıza daxil olaraq və ya qeydiyyatdan keçərək seansı izləyin
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthChoice('guest_form')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 ${
                      authChoice === 'guest_form'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-400/40'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] shrink-0 ${authChoice === 'guest_form' ? 'text-white' : 'text-amber-600'}`}>
                      assignment
                    </span>
                    <div>
                      <span className="text-xs font-bold block">b) Formu Doldurub Müraciət Göndər</span>
                      <span className={`text-[10px] block leading-tight ${authChoice === 'guest_form' ? 'text-amber-100' : 'text-slate-500'}`}>
                        Qeydiyyatsız birbaşa əlaqə məlumatlarını yazaraq göndərin
                      </span>
                    </div>
                  </button>
                </div>

                {/* a) Seçimi: Sayta Giriş və Qeydiyyat Kartı */}
                {authChoice === 'login_register' && (
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-center space-y-2.5 animate-fadeIn">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Monodoxia Academy hesabınıza daxil olun və ya yeni hesab yaradaraq rezervasiyalarınızı şəxsi kabinetdə izləyin:
                    </p>
                    <div className="flex gap-2 justify-center pt-0.5">
                      <button
                        type="button"
                        onClick={() => { setAuthModalTab('login'); setAuthModalOpen(true); }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">login</span>
                        Daxil Ol
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAuthModalTab('register'); setAuthModalOpen(true); }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-300 cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        Qeydiyyatdan Keç
                      </button>
                    </div>
                  </div>
                )}

                {/* b) Seçimi: Form Sahələri (Ad, Soyad, Telefon / WhatsApp, Ünvan) */}
                {authChoice === 'guest_form' && (
                  <div className="space-y-2.5 pt-1 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Ad <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={guestFirstName}
                          onChange={(e) => setGuestFirstName(e.target.value)}
                          placeholder="Adınız"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Soyad <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={guestLastName}
                          onChange={(e) => setGuestLastName(e.target.value)}
                          placeholder="Soyadınız"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                          <span>Telefon (WhatsApp)</span> <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+994 50 123 45 67"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Ünvan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={guestAddress}
                          onChange={(e) => setGuestAddress(e.target.value)}
                          placeholder="Şəhər, rayon, küçə ünvanınız"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
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
              />
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="px-5 py-3 border-t border-slate-200 bg-[#fcfbf9] shrink-0 space-y-2">
            {submitResult === 'error' && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">error</span>
                <span>{submitMessage}</span>
              </div>
            )}

            {(() => {
              const guestFormIncomplete = !currentUser && authChoice === 'guest_form' && (!guestFirstName.trim() || !guestLastName.trim() || !guestPhone.trim() || !guestAddress.trim());
              const isDisabled = !selectedStart || !selectedEnd || !!conflictError || isSubmitting || guestFormIncomplete;

              return (
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isDisabled
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-600/25'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[17px] animate-spin">autorenew</span>
                      <span>Göndərilir...</span>
                    </>
                  ) : !selectedStart ? (
                    <>
                      <span className="material-symbols-outlined text-[17px]">schedule</span>
                      <span>Başlama Saatı Seçin</span>
                    </>
                  ) : !selectedEnd ? (
                    <>
                      <span className="material-symbols-outlined text-[17px]">timer</span>
                      <span>Bitmə Saatı Seçin</span>
                    </>
                  ) : conflictError ? (
                    <>
                      <span className="material-symbols-outlined text-[17px]">block</span>
                      <span>Bu Vaxt Əlçatmaz</span>
                    </>
                  ) : !currentUser && authChoice === 'login_register' ? (
                    <>
                      <span className="material-symbols-outlined text-[17px]">login</span>
                      <span>Sayta Giriş / Qeydiyyat</span>
                    </>
                  ) : guestFormIncomplete ? (
                    <>
                      <span className="material-symbols-outlined text-[17px]">edit</span>
                      <span>Formu Doldurun (Ad, Soyad, Tel, Ünvan)</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[17px]">check_circle</span>
                      <span>Sessiyanı Təsdiqlə və Rezerv Et</span>
                    </>
                  )}
                </button>
              );
            })()}
          </div>
        </form>
      </div>
    </div>
  );
}

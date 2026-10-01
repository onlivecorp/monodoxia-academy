import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function BookingModal() {
  const { bookingModalOpen, setBookingModalOpen, activeCoach, confirmBooking } = useApp();
  const [slot, setSlot] = useState('');
  const [type, setType] = useState('Online (Təhlükəsiz Video Otaq)');
  const [notes, setNotes] = useState('');

  if (!bookingModalOpen || !activeCoach) return null;

  const slots = Array.isArray(activeCoach.availableSlots) && activeCoach.availableSlots.length > 0
    ? activeCoach.availableSlots
    : ['Sabah 15:00', 'Cümə 18:00'];
  const currentSlot = slot || slots[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    confirmBooking({
      coachName: activeCoach.name,
      slot: currentSlot,
      type,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-surface-bright rounded-lg border border-outline-variant shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setBookingModalOpen(false)}
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={activeCoach.image}
            alt={activeCoach.name}
            className="w-12 h-12 rounded-full object-cover border border-secondary"
          />
          <div>
            <h4 className="font-headline-sm text-sm text-primary font-serif">{activeCoach.name}</h4>
            <span className="text-[11px] text-secondary">{activeCoach.title}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Mövcud Saat Dilimi</label>
            <select
              value={currentSlot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary"
            >
              {activeCoach.availableSlots.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Sessiya Formatı</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary"
            >
              <option value="Online (Təhlükəsiz Video Otaq)">Onlayn (Təhlükəsiz Video Otaq - Zoom/Meet/WebRTC)</option>
              <option value="Offline (Bakı Mərkəzi Ofis)">Oflayn (Bakı Mərkəzi Ofis - Nizami küç. 142)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Fokus Sahəniz və ya Qeydlər</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sessiyada toxunmaq istədiyiniz əsas məqamlar..."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-2.5 bg-primary-container text-on-primary hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors"
          >
            Sessiyanı Təsdiqlə və Rezerv Et
          </button>
        </form>
      </div>
    </div>
  );
}

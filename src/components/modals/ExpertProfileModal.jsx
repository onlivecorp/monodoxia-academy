import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../../i18n/localize';
import { useApp } from '../../context/AppContext';

export default function ExpertProfileModal({ coach, isOpen, onClose }) {
  const { currentLang, defaultLang } = useLanguage();
  const { openBooking } = useApp();

  if (!isOpen || !coach) return null;

  const coachTitle = getLocalized(coach, 'title', currentLang, defaultLang) || coach.title || 'Kouç & Ekspert';
  const coachBio = getLocalized(coach, 'bio', currentLang, defaultLang) || coach.bio || '';
  const coachExp = getLocalized(coach, 'experience', currentLang, defaultLang) || coach.experience || '';
  const rawSpecialties = getLocalizedArray(coach, 'specialties', currentLang, defaultLang);
  const specialties = rawSpecialties.length > 0
    ? rawSpecialties
    : (Array.isArray(coach.specialties) ? coach.specialties : (coach.specialties || '').split(',').map(s => s.trim()).filter(Boolean));

  const availableSlots = Array.isArray(coach.availableSlots)
    ? coach.availableSlots
    : (Array.isArray(coach.available_slots) ? coach.available_slots : []);

  const handleBook = () => {
    onClose();
    if (openBooking) {
      openBooking(coach.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#070f1e]/75 backdrop-blur-md transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="expert-profile-title"
        className="relative bg-white border border-[#c5a059]/40 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-scaleUp text-[#071326] my-8"
      >
        {/* Top Gold Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#071326] flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Bağla"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Header with Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-[#e2e8f0]">
            <div className="relative shrink-0">
              {coach.avatar || coach.image ? (
                <img
                  src={coach.avatar || coach.image}
                  alt={coach.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#c5a059]/40 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] font-serif font-bold text-3xl flex items-center justify-center border-2 border-[#c5a059]/40 shadow-md">
                  {(coach.name || 'E')[0]}
                </div>
              )}
              <span 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center" 
                title="Aktiv Qəbul"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="text-center sm:text-left min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#775a19] text-[11px] font-bold uppercase tracking-wider">
                  Ekspert Kouç
                </span>
                {coachExp && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#64748b] font-medium">
                    <span className="material-symbols-outlined text-[14px] text-[#c5a059]">verified</span>
                    <span>{coachExp} təcrübə</span>
                  </span>
                )}
              </div>

              <h2 id="expert-profile-title" className="font-serif text-2xl sm:text-3xl font-medium text-[#071326] mt-2 mb-1">
                {coach.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#775a19] font-semibold tracking-wide">
                {coachTitle}
              </p>

              {/* Rating & Reviews */}
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-[#475569]">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span>{coach.rating || '5.0'}</span>
                </div>
                <span>•</span>
                <span>{coach.reviewsCount || coach.reviews_count || 18}+ müsbət rəy</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">ICF Sertifikatlı</span>
              </div>
            </div>
          </div>

          {/* Full Bio */}
          <div className="py-6 border-b border-[#e2e8f0]">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#775a19] mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Haqqında & Metodologiya</span>
            </h3>
            <p className="text-sm text-[#334155] leading-relaxed font-light whitespace-pre-line">
              {coachBio}
            </p>
          </div>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="py-5 border-b border-[#e2e8f0]">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#775a19] mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>İxtisaslaşdığı Sahələr</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {specialties.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#faf8f5] text-[#1e293b] border border-[#c5a059]/20 text-xs font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Session Details & Available Slots */}
          <div className="py-5 border-b border-[#e2e8f0] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e2e8f0]">
              <div className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-1">
                Seans Müddəti
              </div>
              <div className="text-sm font-bold text-[#071326] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#775a19]">timer</span>
                <span>{coach.sessionDuration || coach.session_duration || '60 dəqiqə'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e2e8f0]">
              <div className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-1">
                İnteraktiv Format
              </div>
              <div className="text-sm font-bold text-[#071326] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#775a19]">videocam</span>
                <span>Onlayn (Təhlükəsiz Video Otaq)</span>
              </div>
            </div>
          </div>

          {availableSlots.length > 0 && (
            <div className="py-5">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#775a19] mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Yaxın Tarixlər üçün Mövcud Saatlar</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">event_available</span>
                    <span>{slot}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              Bağla
            </button>

            <button
              type="button"
              onClick={handleBook}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] text-xs font-bold tracking-wider uppercase shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#e5c57d]">calendar_today</span>
              <span>Fərdi Kouçinq Rezervasiya Et</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function UserProfilePreviewModal({ user, isOpen, onClose }) {
  if (!isOpen || !user) return null;

  const role = user.role || 'Tələbə';
  const tier = user.tier || 'Basic';
  const joinedDate = user.joinedDate || user.joined_date || '';

  const getRoleBadgeClass = (r) => {
    switch (r) {
      case 'Admin':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Kouç':
      case 'Kouç & Ekspert':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Moderator':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getTierBadgeClass = (t) => {
    switch ((t || '').toLowerCase()) {
      case 'vip':
        return 'bg-gradient-to-r from-amber-500/20 to-[#c5a059]/30 text-amber-900 border-amber-400 font-bold';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#070f1e]/75 backdrop-blur-md transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-profile-title"
        className="relative bg-white border border-[#c5a059]/40 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 animate-scaleUp text-[#071326]"
      >
        <div className="h-2 w-full bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#071326] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Bağla"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="p-6 text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#c5a059]/40 shadow-sm overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] text-2xl font-serif font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user.name || 'U')[0]
            )}
          </div>

          <h3 id="user-profile-title" className="font-serif text-xl font-medium text-[#071326] mb-1">
            {user.name}
          </h3>

          <div className="flex items-center justify-center gap-2 mb-5 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getRoleBadgeClass(role)}`}>
              {role}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTierBadgeClass(tier)}`}>
              {tier} Üzv
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e2e8f0] text-left space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#775a19]">calendar_month</span>
                <span>Üzvlük Tarixi:</span>
              </span>
              <span className="font-semibold text-[#071326]">{joinedDate || '2025'}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#775a19]">verified</span>
                <span>Hesab Statusu:</span>
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Aktiv Tələbə</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#775a19]">shield</span>
                <span>Məlumat Təhlükəsizliyi:</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500">Qorunur (Konfidensial)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
}

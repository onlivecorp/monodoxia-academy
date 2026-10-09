import React, { useEffect } from 'react';

export default function AdminPopupModal({
  isOpen,
  title,
  icon = 'edit_note',
  onClose,
  maxWidth = 'max-w-3xl',
  children
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className={`bg-white rounded-xl shadow-2xl ${maxWidth} w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 transform transition-all my-auto`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
              <span className="material-symbols-outlined text-[19px]">{icon}</span>
            </div>
            <h4 className="text-[14px] font-bold text-slate-900 font-serif m-0 tracking-tight">
              {title}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 border border-slate-200 hover:border-red-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Bağla (ESC)"
          >
            <span className="material-symbols-outlined text-[17px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 md:p-6 overflow-y-auto admin-scroll flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

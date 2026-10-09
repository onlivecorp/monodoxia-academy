import React from 'react';

export default function AdminConfirmModal({
  isOpen,
  title = 'Silinməni Təsdiq Edin',
  message = 'Bu əməliyyatı geri qaytarmaq mümkün deyil. Silmək istədiyinizə əminsiniz?',
  itemName = '',
  confirmText = 'Bəli, Sil',
  cancelText = 'Ləğv Et',
  onConfirm,
  onCancel,
  isDanger = true
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 flex flex-col gap-4 transform transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-full ${isDanger ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'} shrink-0`}>
            <span className="material-symbols-outlined text-[24px]">
              {isDanger ? 'warning' : 'help'}
            </span>
          </div>
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 font-serif">
              {title}
            </h4>
            <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
              {message}
            </p>
            {itemName && (
              <div className="mt-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-800 break-words">
                "{itemName}"
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[12px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-[12px] font-bold text-white rounded-lg transition-all shadow-sm cursor-pointer flex items-center gap-1.5 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDanger ? 'delete' : 'check'}
            </span>
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

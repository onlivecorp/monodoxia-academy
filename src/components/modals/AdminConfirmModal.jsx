import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AdminConfirmModal({
  isOpen,
  title,
  message,
  itemName = '',
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDanger = true
}) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const resolvedTitle = title || t('common_confirm_delete_title');
  const resolvedMessage = message || t('common_confirm_delete_msg');
  const resolvedConfirmText = confirmText || t('common_yes_delete');
  const resolvedCancelText = cancelText || t('common_cancel');

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
              {resolvedTitle}
            </h4>
            <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
              {resolvedMessage}
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
            {resolvedCancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-[12px] font-semibold text-white rounded-lg shadow-sm transition-colors cursor-pointer ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

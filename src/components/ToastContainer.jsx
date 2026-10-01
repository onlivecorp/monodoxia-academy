import React from 'react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded shadow-lg text-sm font-medium flex items-center gap-3 transition-all duration-300 border ${
            t.type === 'success'
              ? 'bg-surface-bright text-primary border-secondary'
              : t.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-primary-container text-surface-bright border-secondary/40'
          }`}
        >
          <span className="material-symbols-outlined text-secondary text-[20px]">
            {t.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

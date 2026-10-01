import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useApp } from '../context/AppContext';

export default function SafetyBanner() {
  const { t } = useLanguage();
  const { safetyAck, acknowledgeSafety, platformSettings } = useApp();

  if (safetyAck || !platformSettings.showSafetyBanner) return null;

  return (
    <div className="bg-primary-container text-surface-bright py-2.5 px-4 border-b border-secondary/30 text-xs relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
          <span>{platformSettings.safetyText || t('safety_disclaimer_text')}</span>
        </div>
        <button
          onClick={acknowledgeSafety}
          className="whitespace-nowrap px-3 py-1 rounded bg-secondary/20 hover:bg-secondary text-surface-bright border border-secondary/40 text-[11px] transition-colors"
        >
          {t('safety_acknowledge')}
        </button>
      </div>
    </div>
  );
}

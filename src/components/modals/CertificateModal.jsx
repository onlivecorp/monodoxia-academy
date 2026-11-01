import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function CertificateModal() {
  const { certificateModalOpen, setCertificateModalOpen, activeCertificate } = useApp();
  const { t } = useLanguage();

  if (!certificateModalOpen || !activeCertificate) return null;

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-surface-bright rounded-lg border-2 border-secondary shadow-2xl max-w-xl w-full p-8 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-secondary/10 blur-xl"></div>
        <button
          onClick={() => setCertificateModalOpen(false)}
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer"
          aria-label={t('common_close')}
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <img src="/logo.png" alt="Monodoxia Academy" className="h-14 w-auto mx-auto object-contain mb-2" />
        <div className="font-label-sm text-secondary tracking-widest uppercase">MONODOXIA ACADEMY</div>
        <h3 className="font-display-lg text-2xl font-serif text-primary mt-1 mb-4">
          {t('cert_modal_title')}
        </h3>

        <p className="text-xs text-on-surface-variant">{t('cert_modal_certifies')}</p>
        <div className="font-headline-md text-xl font-serif text-secondary my-2">
          {activeCertificate.studentName}
        </div>
        <p className="text-xs text-on-surface-variant">{t('cert_modal_completed')}</p>
        <div className="font-headline-sm text-base text-primary font-medium mt-2 mb-4">
          {activeCertificate.courseTitle}
        </div>

        <div className="pt-4 border-t border-outline-variant/40 grid grid-cols-2 text-xs text-left gap-4 mt-6">
          <div>
            <span className="text-outline block text-[10px]">{t('cert_modal_instructor')}</span>
            <strong className="text-primary">{activeCertificate.instructor}</strong>
          </div>
          <div className="text-right">
            <span className="text-outline block text-[10px]">{t('cert_modal_date')}</span>
            <span className="text-primary font-medium">{activeCertificate.date}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-outline">
          <span>{t('cert_credential_id')}: <strong className="text-secondary font-mono">{activeCertificate.id}</strong></span>
          <span className="text-secondary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">qr_code_2</span> {t('cert_modal_verified')}
          </span>
        </div>
      </div>
    </div>
  );
}

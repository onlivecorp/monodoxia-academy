import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { TARGET_TYPE_MAP, APPLICATION_STATUSES } from '../../data/applicationData';

export default function ApplicationModal() {
  const { lang } = useLanguage();
  const {
    applicationModalOpen,
    setApplicationModalOpen,
    activeApplicationTarget,
    currentUser,
    setAuthModalOpen,
    setAuthModalTab,
    applicationsList,
    formFieldsList,
    submitApplication,
    setProfileModalOpen,
    setActiveProfileTab
  } = useApp();

  const [formResponses, setFormResponses] = useState({});
  const [userPhone, setUserPhone] = useState('');
  const [userNote, setUserNote] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Check duplicate
  const existingApp = (currentUser && activeApplicationTarget)
    ? applicationsList.find(a =>
        a.userId === currentUser.id &&
        a.targetId === activeApplicationTarget.id &&
        !['Rədd edildi', 'Ləğv edildi'].includes(a.status) &&
        !a.archived
      )
    : null;

  // Relevant dynamic fields
  const relevantFields = useMemo(() => {
    if (!activeApplicationTarget) return [];
    return formFieldsList
      .filter(f => (f.isActive !== false && f.is_active !== 0) &&
        (f.targetType === 'all' || f.target_type === 'all' || f.targetType === activeApplicationTarget.type || f.target_type === activeApplicationTarget.type))
      .sort((a, b) => (a.sortOrder || a.sort_order || 0) - (b.sortOrder || b.sort_order || 0));
  }, [formFieldsList, activeApplicationTarget]);

  const hasPhoneField = useMemo(() => {
    return relevantFields.some(f => f.id === 'fld_phone' || f.fieldType === 'tel');
  }, [relevantFields]);

  useEffect(() => {
    if (activeApplicationTarget && currentUser) {
      const defaultPhone = currentUser.phone || '+994 ';
      setUserPhone(defaultPhone);
      setUserNote('');
      setValidationErrors({});
      // Set defaults for select fields
      const initialResp = {};
      relevantFields.forEach(f => {
        const trans = f.translations?.[lang] || {};
        const opts = (trans.options && trans.options.length > 0) ? trans.options : (f.options || []);
        if (f.fieldType === 'select' && opts.length > 0) {
          initialResp[f.id] = opts[0];
        } else if (f.id === 'fld_phone' || f.fieldType === 'tel') {
          initialResp[f.id] = defaultPhone;
        } else {
          initialResp[f.id] = '';
        }
      });
      setFormResponses(initialResp);
    }
  }, [activeApplicationTarget, currentUser, relevantFields, lang]);

  if (!applicationModalOpen || !activeApplicationTarget) return null;

  const targetMeta = TARGET_TYPE_MAP[activeApplicationTarget.type] || {
    label: 'Proqram',
    icon: 'assignment',
    color: 'text-primary'
  };

  const statusMeta = existingApp
    ? APPLICATION_STATUSES.find(s => s.id === existingApp.status) || { badgeClass: 'bg-amber-100 text-amber-800' }
    : null;

  const handleFieldChange = (fieldId, val) => {
    setFormResponses(prev => ({ ...prev, [fieldId]: val }));
    if (fieldId === 'fld_phone') {
      setUserPhone(val);
    }
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => ({ ...prev, [fieldId]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      setValidationErrors(prev => ({ ...prev, agreed: 'Davam etmək üçün qaydaları qəbul etməlisiniz.' }));
      return;
    }

    const errors = {};
    const finalPhone = (hasPhoneField ? (formResponses['fld_phone'] || userPhone) : userPhone).trim();

    if (!hasPhoneField && (!finalPhone || finalPhone === '+994')) {
      errors.phone = 'Əlaqə nömrəsi qeyd olunmalıdır.';
    }

    relevantFields.forEach(f => {
      if (f.isRequired) {
        const val = formResponses[f.id];
        if (!val || !String(val).trim() || (f.fieldType === 'tel' && String(val).trim() === '+994')) {
          const trans = f.translations?.[lang] || {};
          const fLabel = trans.label || f.label;
          errors[f.id] = `${fLabel} mütləq doldurulmalıdır.`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const result = submitApplication({
        targetType: activeApplicationTarget.type,
        targetId: activeApplicationTarget.id,
        targetTitle: activeApplicationTarget.title,
        price: activeApplicationTarget.price,
        userPhone: finalPhone || currentUser.phone || '',
        userNote: userNote.trim(),
        formResponses: formResponses
      });
      setSubmitting(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-surface-bright rounded-xl border border-outline-variant shadow-2xl max-w-xl w-full my-auto overflow-hidden animate-fadeIn relative flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-outline-variant/40 bg-surface-container/20 flex items-start justify-between relative shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container ${targetMeta.color}`}>
                <span className="material-symbols-outlined text-[15px]">{targetMeta.icon}</span>
                {targetMeta.label} Müraciəti
              </span>
              {activeApplicationTarget.price && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                  {activeApplicationTarget.price}
                </span>
              )}
            </div>
            <h3 className="font-headline-sm text-lg sm:text-xl font-serif text-primary leading-snug">
              {activeApplicationTarget.title}
            </h3>
            {(activeApplicationTarget.speaker || activeApplicationTarget.duration) && (
              <p className="text-xs text-on-surface-variant mt-1">
                {activeApplicationTarget.speaker ? `Ekspert: ${activeApplicationTarget.speaker}` : ''}
                {activeApplicationTarget.speaker && activeApplicationTarget.duration ? ' • ' : ''}
                {activeApplicationTarget.duration || ''}
              </p>
            )}
          </div>
          <button
            onClick={() => setApplicationModalOpen(false)}
            className="text-outline hover:text-primary transition-colors p-1 -mr-2 -mt-2 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-sm">
          {!currentUser ? (
            /* Guest Warning State */
            <div className="text-center py-6 px-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 border border-amber-300 mx-auto flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[28px]">lock</span>
              </div>
              <h4 className="font-headline-sm text-base text-primary font-medium mb-1">
                Yalnız Qeydiyyatlı Üzvlər Üçün
              </h4>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-6">
                Platformadakı kurslar, klublar, tədbirlər və müzakirələr üçün müraciətlər yalnız şəxsi hesaba sahib istifadəçilər tərəfindən həyata keçirilir.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setApplicationModalOpen(false);
                    setAuthModalTab('login');
                    setAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Daxil Ol
                </button>
                <button
                  onClick={() => {
                    setApplicationModalOpen(false);
                    setAuthModalTab('register');
                    setAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded border border-secondary text-secondary hover:bg-secondary/10 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Hesab Yarat (Qeydiyyat)
                </button>
              </div>
            </div>
          ) : existingApp ? (
            /* Existing Application Banner */
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-800 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-[24px] mt-0.5">check_circle</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Müraciətiniz Mövcuddur (#{existingApp.id})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${statusMeta?.badgeClass}`}>
                        {existingApp.status}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
                      Siz artıq <strong>{existingApp.targetTitle}</strong> üçün müraciət göndərmisiniz. Təkrar göndərmə tələb olunmur.
                    </p>
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800 text-[11px] space-y-1 text-on-surface-variant">
                      <div><strong>Tarix:</strong> {existingApp.appliedAt}</div>
                      <div><strong>Ödəniş Statusu:</strong> {existingApp.paymentStatus}</div>
                      <div><strong>İştirak Statusu:</strong> {existingApp.attendanceStatus}</div>
                      {existingApp.adminNote && (
                        <div className="p-2 rounded bg-surface-bright/70 border border-emerald-200/50 text-xs text-primary mt-2">
                          <strong>Admin Qeydi:</strong> {existingApp.adminNote}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setApplicationModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-outline hover:text-primary transition-colors"
                >
                  Pəncərəni bağla
                </button>
                <button
                  onClick={() => {
                    setApplicationModalOpen(false);
                    setActiveProfileTab('applications');
                    setProfileModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Müraciətlərim Bölməsinə Keç</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile autofill reminder */}
              <div className="bg-surface-container/30 border border-outline-variant/40 rounded-lg p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                  <span className="text-on-surface-variant">
                    Müraciətçi: <strong className="text-primary">{currentUser.firstName} {currentUser.lastName}</strong> ({currentUser.email})
                  </span>
                </div>
                <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider bg-secondary/10 px-2 py-0.5 rounded">
                  Profil məlumatları
                </span>
              </div>

              {/* Contact Phone (Fallback if not configured in dynamic fields) */}
              {!hasPhoneField && (
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Əlaqə Nömrəsi (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+994 50 123 45 67"
                    className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                  />
                  {validationErrors.phone && (
                    <span className="text-[11px] text-red-500 mt-1 block">{validationErrors.phone}</span>
                  )}
                </div>
              )}

              {/* Dynamic Custom Fields */}
              {relevantFields.map(field => {
                const isRequired = field.isRequired;
                const err = validationErrors[field.id];
                const trans = field.translations?.[lang] || {};
                const label = trans.label || field.label;
                const placeholder = trans.placeholder !== undefined && trans.placeholder !== ''
                  ? trans.placeholder
                  : (field.placeholder || '');
                const options = (trans.options && trans.options.length > 0)
                  ? trans.options
                  : (field.options || []);

                if (field.fieldType === 'select') {
                  return (
                    <div key={field.id}>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        {label} {isRequired && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        value={formResponses[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      >
                        {options.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {err && <span className="text-[11px] text-red-500 mt-1 block">{err}</span>}
                    </div>
                  );
                }

                if (field.fieldType === 'textarea') {
                  return (
                    <div key={field.id}>
                      <label className="block text-xs font-semibold text-primary mb-1">
                        {label} {isRequired && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        rows={2}
                        value={formResponses[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                      />
                      {err && <span className="text-[11px] text-red-500 mt-1 block">{err}</span>}
                    </div>
                  );
                }

                const inputType = field.fieldType === 'number'
                  ? 'number'
                  : (field.fieldType === 'tel' || field.id === 'fld_phone'
                      ? 'tel'
                      : (field.fieldType === 'url' ? 'url' : 'text'));

                return (
                  <div key={field.id}>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      {label} {isRequired && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={inputType}
                      value={formResponses[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                    />
                    {err && <span className="text-[11px] text-red-500 mt-1 block">{err}</span>}
                  </div>
                );
              })}

              {/* Optional User Note */}
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Əlavə Qeyd və ya Mentor üçün Sual (Könüllü)
                </label>
                <textarea
                  rows={2}
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="Spesifik bir istəyiniz və ya sualınız varsa qeyd edə bilərsiniz..."
                  className="w-full px-3 py-2 rounded border border-outline-variant bg-surface-bright text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Agreement */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer text-xs text-on-surface-variant select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (e.target.checked) {
                        setValidationErrors(prev => ({ ...prev, agreed: null }));
                      }
                    }}
                    className="mt-0.5 rounded text-secondary focus:ring-0"
                  />
                  <span>
                    Göstərilən məlumatların doğruluğunu təsdiqləyirəm və Monodoxia Akademiyanın daxili etik qaydaları ilə razıyam.
                  </span>
                </label>
                {validationErrors.agreed && (
                  <span className="text-[11px] text-red-500 mt-1 block">{validationErrors.agreed}</span>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApplicationModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-outline hover:text-primary transition-colors"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded bg-primary text-surface-bright hover:bg-[#112240] text-xs font-semibold tracking-wider transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>{submitting ? 'Göndərilir...' : 'Müraciəti Təsdiqlə və Göndər'}</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

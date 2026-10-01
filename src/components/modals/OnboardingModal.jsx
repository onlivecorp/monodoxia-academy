import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ONBOARDING_QUESTIONS } from '../../data/mockData';

export default function OnboardingModal() {
  const { onboardingOpen, setOnboardingOpen, showToast, currentUser, updateCurrentUser } = useApp();
  const [selected, setSelected] = useState([]);

  if (!onboardingOpen) return null;

  const toggleOption = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (currentUser && updateCurrentUser) {
      updateCurrentUser({ focusAreas: selected });
    }
    setOnboardingOpen(false);
    showToast('Fərdi inkişaf istiqamətləriniz qeyd edildi. Tövsiyələriniz hazırdır!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-surface-bright rounded-lg border border-secondary/40 shadow-2xl max-w-2xl w-full p-6 md:p-8 relative">
        <div className="text-center max-w-md mx-auto mb-6">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block mb-1"></span>
          <h3 className="font-headline-md text-primary font-serif">Fərdi İnkişaf Xəritəniz</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Hansı sahələrə daha çox fokuslanmaq istərdiniz? Bu seçimlər sizə özəl tövsiyələr və proqramlar tərtib etmək üçün istifadə olunacaq.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto p-1">
          {ONBOARDING_QUESTIONS.map(q => (
            <label
              key={q.id}
              className={`cursor-pointer p-4 rounded border transition-all flex items-start gap-3 bg-surface-container-lowest ${
                selected.includes(q.id) ? 'border-secondary bg-secondary/5' : 'border-outline-variant/60 hover:border-secondary'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(q.id)}
                onChange={() => toggleOption(q.id)}
                className="mt-1 rounded text-secondary focus:ring-secondary focus:ring-offset-0 border-outline"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">{q.icon}</span>
                  <span className="font-semibold text-sm text-primary">{q.text}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{q.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-outline-variant/40">
          <button
            onClick={() => setOnboardingOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-outline hover:text-primary"
          >
            Sonra seçərəm
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded bg-primary-container text-on-primary hover:bg-[#112240] text-xs font-semibold tracking-wider transition-colors"
          >
            Xəritəmi Yadda Saxla
          </button>
        </div>
      </div>
    </div>
  );
}

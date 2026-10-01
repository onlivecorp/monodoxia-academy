import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalized } from '../../i18n/localize';
import { useApp } from '../../context/AppContext';

export default function PlayerModal() {
  const { currentLang, defaultLang } = useLanguage();
  const {
    playerModalOpen,
    setPlayerModalOpen,
    activeCourse,
    activeLesson,
    setActiveLesson,
    progress,
    toggleLessonDone
  } = useApp();

  if (!playerModalOpen || !activeCourse || !activeLesson) return null;

  const courseProg = progress[activeCourse.id] || { completedLessons: [], percent: 0 };
  const isLessonCompleted = courseProg.completedLessons.includes(activeLesson.id);

  const courseTitle = getLocalized(activeCourse, 'title', currentLang, defaultLang);
  const lessonTitle = getLocalized(activeLesson, 'title', currentLang, defaultLang);

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-2 md:p-6">
      <div className="bg-surface-bright rounded-lg border border-outline-variant shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/*  */}
        <div className="h-16 border-b border-outline-variant/60 px-6 flex items-center justify-between bg-surface-container-lowest">
          <div>
            <h4 className="font-headline-sm text-sm md:text-base font-serif text-primary truncate max-w-md">
              {courseTitle}
            </h4>
            <span className="text-[11px] text-outline">
              Kouç: <strong className="text-secondary font-medium">{activeCourse.instructor}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-secondary font-semibold">
                {courseProg.percent}% tamamlandı
              </span>
              <div className="w-24 bg-surface-container h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-300"
                  style={{ width: `${courseProg.percent}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => setPlayerModalOpen(false)}
              className="text-outline hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        </div>

        {/*  */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/*  */}
          <div className="lg:col-span-8 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest bg-secondary/10 text-secondary uppercase">
                  {activeLesson.type}
                </span>
                <span className="text-xs text-outline">Modul Məzmunu</span>
              </div>
              <h3 className="font-headline-sm text-primary font-serif mb-4">
                {lessonTitle}
              </h3>

              {activeLesson.type === 'video' ? (
                <div className="aspect-video bg-black rounded overflow-hidden relative shadow-lg mb-4">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/inpok4MKVLM?autoplay=0"
                    title="Monodoxia Lesson"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="p-6 bg-surface-container-low rounded border border-outline-variant space-y-4 mb-4">
                  <h4 className="font-headline-sm text-primary font-serif">Məşğələ Təlimatı və Təcrübə</h4>
                  <p className="font-body-md text-on-surface-variant leading-relaxed">
                    Bu dərsdə qeyd olunan nəfəs və daxili dialoq auditini yerinə yetirərkən sakit bir mühit seçin. Özünüzə qarşı mühakiməsiz, müşahidəçi mövqeyindən yanaşın.
                  </p>
                  <div className="p-4 bg-surface-bright rounded border-l-4 border-secondary text-xs text-secondary italic">
                    "Fərqindəlik qorxuların üzərindəki qaranlığı yox edən ilk işıqdır."
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-outline-variant/40 flex items-center justify-between mt-6">
              <span className="text-xs text-on-surface-variant">Tərəqqini qeydə almaq üçün dərsi tamamlayın:</span>
              <button
                onClick={() => toggleLessonDone(activeCourse.id, activeLesson.id)}
                className="px-5 py-2.5 rounded bg-primary-container text-on-primary hover:bg-[#112240] text-xs font-semibold tracking-wider flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isLessonCompleted ? 'verified' : 'check'}
                </span>
                <span>{isLessonCompleted ? 'Tamamlandı' : 'Dərsi tamamla'}</span>
              </button>
            </div>
          </div>

          {/*  */}
          <div className="lg:col-span-4 bg-surface-container-low border-l border-outline-variant/60 p-5 overflow-y-auto">
            <h4 className="font-headline-sm text-xs tracking-wider uppercase text-primary font-serif mb-4 pb-2 border-b border-outline-variant/40">
              Kursun Tədris Planı
            </h4>
            <div className="space-y-4">
              {activeCourse.modules.map((m, mIdx) => {
                const modTitle = getLocalized(m, 'title', currentLang, defaultLang);
                return (
                  <div key={m.id} className="mb-4">
                    <h5 className="text-xs font-semibold tracking-wider text-secondary uppercase mb-2">
                      Modul {mIdx + 1}: {modTitle}
                    </h5>
                    <div className="space-y-1">
                      {m.lessons.map(l => {
                        const isCompleted = courseProg.completedLessons.includes(l.id);
                        const isActive = activeLesson.id === l.id;
                        const lTitle = getLocalized(l, 'title', currentLang, defaultLang);
                        return (
                          <div
                            key={l.id}
                            onClick={() => setActiveLesson(l)}
                            className={`p-2.5 rounded cursor-pointer text-xs flex items-center justify-between transition-colors ${
                              isActive
                                ? 'bg-primary-container text-surface-bright'
                                : 'hover:bg-surface-container text-on-surface'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`material-symbols-outlined text-[16px] ${isCompleted ? 'text-secondary' : 'text-outline'}`}>
                                {isCompleted ? 'check_circle' : (l.type === 'video' ? 'play_arrow' : (l.type === 'audio' ? 'headphones' : 'assignment'))}
                              </span>
                              <span>{lTitle}</span>
                            </div>
                            <span className="text-[10px] text-outline">{l.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

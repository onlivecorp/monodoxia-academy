import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalized } from '../i18n/localize';
import { useApp } from '../context/AppContext';
import PageHero from '../components/PageHero';

export default function AcademyPage() {
  const { t, currentLang, defaultLang } = useLanguage();
  const {
    progress,
    openPlayer,
    coursesList,
    homeContent,
    openApplication,
    currentUser,
    applicationsList,
    categoriesList,
    getCategoryLabel,
    navigateTo
  } = useApp();

  const academy = homeContent?.academy || {};
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const courseCategories = (categoriesList || []).filter(c => c.type === 'course' || c.type === 'all');

  const filteredCourses = coursesList.filter(c => {
    const matchesFilter = filter === 'all' || c.category === filter;
    const title = getLocalized(c, 'title', currentLang, defaultLang) || '';
    const desc = getLocalized(c, 'description', currentLang, defaultLang) || '';
    const instructor = c.instructor || '';
    const matchesSearch = !searchQuery.trim() ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        badge={getLocalized(academy, 'badge', currentLang, defaultLang) || 'Akademik Tədris'}
        title={getLocalized(academy, 'title', currentLang, defaultLang) || 'Kurslar və Sertifikasiya Proqramları'}
        description={getLocalized(academy, 'desc', currentLang, defaultLang) || 'Akademik psixologiya, nevrobiologiya və fərdi inkişaf metodologiyaları əsasında hazırlanmış lisenziyalı proqramlar.'}
        breadcrumbs={[{ label: 'Akademiya' }]}
        adminCmsBlock="academy"
      >
        {/* Quick Academy Badges */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-outline-variant/40 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
            <span>Beynəlxalq QR Sertifikat</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">psychology</span>
            <span>ICF & PhD Mentorlar</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant" />
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">laptop_chromebook</span>
            <span>Ömürlük Giriş və LMS Arxiv</span>
          </div>
        </div>
      </PageHero>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-outline-variant/50">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">search</span>
              <input
                type="text"
                placeholder="Kurs və ya kouç axtar..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded bg-surface border border-outline-variant focus:border-secondary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: t('filter_all') || 'Bütün Kurslar' },
                ...courseCategories.map(cat => ({
                  id: cat.key,
                  label: getCategoryLabel(cat.key, currentLang)
                }))
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    filter === tab.id
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6 text-xs text-on-surface-variant">
            <span>Tapılan kurslar: <strong className="text-primary font-semibold">{filteredCourses.length}</strong></span>
            {filter !== 'all' && (
              <button onClick={() => setFilter('all')} className="text-secondary hover:underline cursor-pointer">
                Filteri sıfırla
              </button>
            )}
          </div>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-12 text-center max-w-md mx-auto shadow-sm">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">school</span>
              <h3 className="font-serif text-lg font-bold text-primary mb-1">
                {coursesList.length === 0 ? 'Hal-hazırda aktiv kurs mövcud deyil' : 'Axtarışa uyğun kurs tapılmadı'}
              </h3>
              <p className="text-xs text-on-surface-variant mb-4">
                {coursesList.length === 0 ? 'Yeni proqramlar və qeydiyyat tarixləri tezliklə elan olunacaqdır.' : 'Axtarış sözünü dəyişdirin və ya bütün kurslar bölməsinə keçin.'}
              </p>
              {coursesList.length > 0 && (
                <button
                  onClick={() => { setFilter('all'); setSearchQuery(''); }}
                  className="px-4 py-2 rounded bg-secondary text-on-secondary text-xs font-semibold"
                >
                  Bütün Kursları Göstər
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredCourses.map(c => {
                const prog = progress[c.id] ? progress[c.id].percent : 0;
                const courseTitle = getLocalized(c, 'title', currentLang, defaultLang);
                const courseDesc = getLocalized(c, 'description', currentLang, defaultLang);
                const courseBadge = getLocalized(c, 'badge', currentLang, defaultLang);
                const courseStatus = getLocalized(c, 'status', currentLang, defaultLang);
                const courseDuration = getLocalized(c, 'duration', currentLang, defaultLang) || c.duration;

                const userApp = currentUser
                  ? applicationsList.find(a => a.userId === currentUser.id && a.targetId === c.id && !a.archived)
                  : null;

                return (
                  <div
                    key={c.id}
                    className={`bg-surface-container-lowest rounded-xl ${
                      c.featured ? 'border-t-4 border-t-secondary ring-1 ring-secondary/20' : ''
                    } border border-outline-variant/60 p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-1 rounded ${c.badgeClass || 'bg-secondary/10 text-secondary'} font-label-sm text-[11px] font-bold tracking-wider uppercase`}>
                            {courseBadge}
                          </span>
                          {c.category && (
                            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium tracking-wide">
                              {getCategoryLabel(c.category, currentLang)}
                            </span>
                          )}
                        </div>
                        <span className="font-label-sm text-xs text-outline">{courseDuration}</span>
                      </div>

                      {/* Course Title */}
                      <h3 className="font-headline-md text-xl md:text-2xl text-primary font-serif mb-3 leading-snug">
                        {courseTitle}
                      </h3>

                      {/* Description */}
                      <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
                        {courseDesc}
                      </p>

                      {/* Syllabus Module Pills */}
                      {c.modules && c.modules.length > 0 && (
                        <div className="mb-6 p-3 rounded bg-surface-container-low border border-outline-variant/40">
                          <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-semibold mb-2">
                            <span>Tədris Proqramı:</span>
                            <span className="text-secondary">{c.modules.length} Modul</span>
                          </div>
                          <div className="flex flex-col gap-1 text-xs text-on-surface">
                            {c.modules.slice(0, 2).map((m, mIdx) => (
                              <div key={m.id || mIdx} className="flex items-center gap-1.5 text-on-surface-variant truncate">
                                <span className="material-symbols-outlined text-[14px] text-secondary">check</span>
                                <span className="truncate">{getLocalized(m, 'title', currentLang, defaultLang)}</span>
                              </div>
                            ))}
                            {c.modules.length > 2 && (
                              <span className="text-[10px] text-outline italic">+ daha {c.modules.length - 2} modul</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Info & Action Buttons */}
                    <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant">
                          Aparıcı Kouç: <strong className="text-primary font-semibold">{c.instructor}</strong>
                        </span>
                        <span className="text-secondary font-bold">{c.price || 'Ödənişli'}</span>
                      </div>

                      {/* Progress Bar if started */}
                      {prog > 0 && (
                        <div>
                          <div className="flex justify-between text-[11px] text-outline mb-1">
                            <span>Tərəqqiniz</span>
                            <span>{prog}%</span>
                          </div>
                          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full rounded-full transition-all duration-300" style={{ width: `${prog}%` }} />
                          </div>
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => openPlayer(c)}
                          className="flex-1 py-2.5 px-4 rounded bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">play_circle</span>
                          <span>{prog > 0 ? 'Davam et' : 'Dərslərə Bax'}</span>
                        </button>

                        {userApp ? (
                          <button
                            onClick={() => openApplication(c, 'course')}
                            className="py-2.5 px-3 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            <span>{userApp.status}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => openApplication(c, 'course')}
                            className="py-2.5 px-4 rounded border border-secondary text-secondary font-label-md text-xs font-semibold hover:bg-secondary/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                            <span>Qeydiyyatdan Keç</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Educational Guarantee Section */}
          <div className="mt-16 bg-surface-container-low border border-outline-variant/60 rounded-2xl p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-primary mb-1">Rəsmi QR Sertifikat</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    İmtahanı uğurla başa vuran məzunlarımıza qlobal səviyyədə onlayn təsdiqlənən rəsmi QR kodlu sertifikat verilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">co_present</span>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-primary mb-1">Fərdi Mentor Əlaqəsi</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Hər bir kurs çərçivəsində tələbələrə ev tapşırıqlarının auditində fərdi mentor rəyi və istiqamətləndirmə təmin edilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">all_inclusive</span>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-primary mb-1">Daimi Material Girişi</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Kursu bitirdikdən sonra da bütün video dərslər, audio meditasiyalar və iş dəftərləri şəxsi kabinetinizdə qalır.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

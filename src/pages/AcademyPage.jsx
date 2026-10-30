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

  const safeCourses = Array.isArray(coursesList) ? coursesList : [];
  const safeApplications = Array.isArray(applicationsList) ? applicationsList : [];
  const safeProgress = progress && typeof progress === 'object' ? progress : {};

  const filteredCourses = safeCourses.filter(c => {
    if (!c) return false;
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
    <div className="min-h-screen bg-[#faf8f5] text-[#071326]">
      {/* Editorial Luxury Page Hero */}
      <PageHero
        badge={getLocalized(academy, 'badge', currentLang, defaultLang) || 'Akademik Tədris'}
        title={getLocalized(academy, 'title', currentLang, defaultLang) || 'Kurslar və Sertifikasiya Proqramları'}
        description={getLocalized(academy, 'desc', currentLang, defaultLang) || 'Akademik psixologiya, nevrobiologiya və fərdi inkişaf metodologiyaları əsasında hazırlanmış lisenziyalı proqramlar.'}
        breadcrumbs={[{ label: 'Akademiya' }]}
        adminCmsBlock="academy"
      >
        {/* Quick Academy Badges */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#c5a059]/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {academy.heroBadge1Icon || 'verified'}
            </span>
            <span className="font-medium">{getLocalized(academy, 'heroBadge1Text', currentLang, defaultLang) || 'Beynəlxalq QR Sertifikat'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {academy.heroBadge2Icon || 'psychology'}
            </span>
            <span className="font-medium">{getLocalized(academy, 'heroBadge2Text', currentLang, defaultLang) || 'ICF & PhD Mentorlar'}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-[#c5a059]/30 text-xs text-[#071326] shadow-sm">
            <span className="material-symbols-outlined text-[#775a19] text-[18px]">
              {academy.heroBadge3Icon || 'laptop_chromebook'}
            </span>
            <span className="font-medium">{getLocalized(academy, 'heroBadge3Text', currentLang, defaultLang) || 'Ömürlük Giriş və LMS Arxiv'}</span>
          </div>
        </div>
      </PageHero>

      {/* Main Content Area */}
      <section className="py-14 sm:py-20 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-[#c5a059]/6 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Search & Filter Toolbar */}
          <div className="bg-white/80 backdrop-blur-md border border-[#c5a059]/25 rounded-2xl p-4 sm:p-5 shadow-[0_10px_30px_-10px_rgba(7,19,38,0.05)] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">

            {/* Search Input */}
            <div className="relative flex-1 max-w-full md:max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#775a19]">search</span>
              <input
                type="text"
                placeholder={getLocalized(academy, 'searchPlaceholder', currentLang, defaultLang) || 'Kurs və ya kouç axtar...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-[#faf8f5] border border-[#c5a059]/30 focus:border-[#775a19] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20 outline-none transition-all placeholder-[#94a3b8] text-[#071326]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#071326] transition-colors p-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Category Select Dropdown (Select Box) */}
            <div className="relative w-full md:w-80 shrink-0">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-[#775a19] pointer-events-none">
                filter_list
              </span>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#faf8f5] border border-[#c5a059]/30 focus:border-[#775a19] focus:bg-white focus:ring-2 focus:ring-[#c5a059]/20 outline-none transition-all text-[#071326] font-medium appearance-none cursor-pointer shadow-2xs hover:border-[#c5a059]/60"
              >
                <option value="all">
                  {t('filter_all') || 'Bütün Proqramlar'}
                </option>
                {courseCategories.map(cat => (
                  <option key={cat.key} value={cat.key}>
                    {getCategoryLabel(cat.key, currentLang)}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#775a19] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-8 px-1 text-xs text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#775a19]">school</span>
              <span>Tapılan proqramlar: <strong className="text-[#071326] font-semibold text-sm">{filteredCourses.length}</strong></span>
            </span>
            {(filter !== 'all' || searchQuery) && (
              <button
                onClick={() => { setFilter('all'); setSearchQuery(''); }}
                className="text-[#775a19] hover:text-[#071326] font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>{getLocalized(academy, 'resetFilterBtnText', currentLang, defaultLang) || 'Filteri sıfırla'}</span>
              </button>
            )}
          </div>

          {/* Course Grid */}
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#c5a059]/30 p-12 sm:p-16 text-center max-w-lg mx-auto shadow-[0_15px_40px_-15px_rgba(7,19,38,0.07)]">
              <div className="w-16 h-16 rounded-2xl bg-[#c5a059]/15 text-[#775a19] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">school</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#071326] mb-2">
                {coursesList.length === 0
                  ? (getLocalized(academy, 'emptyTitle', currentLang, defaultLang) || 'Hal-hazırda aktiv kurs mövcud deyil')
                  : (getLocalized(academy, 'notFoundTitle', currentLang, defaultLang) || 'Axtarışa uyğun kurs tapılmadı')}
              </h3>
              <p className="text-sm text-[#64748b] mb-6 max-w-sm mx-auto leading-relaxed">
                {coursesList.length === 0
                  ? (getLocalized(academy, 'emptyDesc', currentLang, defaultLang) || 'Yeni proqramlar və qeydiyyat tarixləri tezliklə elan olunacaqdır.')
                  : (getLocalized(academy, 'notFoundDesc', currentLang, defaultLang) || 'Axtarış sözünü dəyişdirin və ya bütün kurslar bölməsinə keçin.')}
              </p>
              {coursesList.length > 0 && (
                <button
                  onClick={() => { setFilter('all'); setSearchQuery(''); }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] text-xs font-semibold tracking-wider uppercase shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {getLocalized(academy, 'showAllBtnText', currentLang, defaultLang) || 'Bütün Kursları Göstər'}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredCourses.map(c => {
                const prog = safeProgress[c.id] ? safeProgress[c.id].percent : 0;
                const courseTitle = getLocalized(c, 'title', currentLang, defaultLang);
                const courseDesc = getLocalized(c, 'description', currentLang, defaultLang);
                const courseBadge = getLocalized(c, 'badge', currentLang, defaultLang);
                const courseDuration = getLocalized(c, 'duration', currentLang, defaultLang) || c.duration;
                const courseCategory = getCategoryLabel ? getCategoryLabel(c.category, currentLang) : (c.category || '');

                const userApp = currentUser
                  ? safeApplications.find(a => a && a.userId === currentUser.id && a.targetId === c.id && !a.archived)
                  : null;

                return (
                  <div
                    key={c.id}
                    className="group relative bg-white rounded-3xl border border-[#c5a059]/25 hover:border-[#c5a059]/60 shadow-[0_8px_30px_-8px_rgba(7,19,38,0.06)] hover:shadow-[0_20px_45px_-12px_rgba(7,19,38,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Top Gold Gradient Stripe on Featured or Hover */}
                    <div className={`h-1.5 w-full bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19] ${c.featured ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`} />

                    <div className="p-7 sm:p-9">
                      {/* Top Badges & Duration */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="flex items-center gap-2 flex-wrap">
                          {courseBadge && (
                            <span className="px-3 py-1 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/35 text-[#775a19] text-[11px] font-bold tracking-wider uppercase">
                              {courseBadge}
                            </span>
                          )}
                          {courseCategory && (
                            <span className="px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-[11px] font-medium tracking-wide">
                              {courseCategory}
                            </span>
                          )}
                          {c.featured && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">star</span>
                              <span>Seçilmiş</span>
                            </span>
                          )}
                        </div>

                        {courseDuration && (
                          <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-medium shrink-0">
                            <span className="material-symbols-outlined text-[16px] text-[#775a19]">schedule</span>
                            <span>{courseDuration}</span>
                          </div>
                        )}
                      </div>

                      {/* Course Title */}
                      <h3 className="font-serif text-2xl sm:text-[1.65rem] text-[#071326] group-hover:text-[#775a19] transition-colors leading-[1.3] mb-3 font-medium">
                        {courseTitle}
                      </h3>

                      {/* Description */}
                      {courseDesc && (
                        <p className="text-sm text-[#475569] leading-relaxed mb-6 font-light line-clamp-3">
                          {courseDesc}
                        </p>
                      )}

                      {/* Syllabus Module Pills */}
                      {c.modules && c.modules.length > 0 && (
                        <div className="mb-6 p-4 rounded-2xl bg-[#faf8f5] border border-[#c5a059]/20">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#071326] mb-2.5">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[15px] text-[#775a19]">menu_book</span>
                              <span>Tədris Proqramı</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#775a19] text-[11px]">
                              {c.modules.length} Modul
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            {c.modules.slice(0, 2).map((m, mIdx) => (
                              <div key={m.id || mIdx} className="flex items-center gap-2 text-xs text-[#475569] truncate">
                                <span className="material-symbols-outlined text-[14px] text-[#775a19] shrink-0">check_circle</span>
                                <span className="truncate">{getLocalized(m, 'title', currentLang, defaultLang)}</span>
                              </div>
                            ))}
                            {c.modules.length > 2 && (
                              <div className="text-[11px] text-[#775a19] italic pt-0.5">
                                + daha {c.modules.length - 2} modul və praktiki tapşırıqlar
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Info & CTAs */}
                    <div className="p-7 sm:p-9 pt-0">
                      {/* Coach & Price Row */}
                      {(c.instructor || c.price) && (
                        <div className="flex items-center justify-between gap-4 py-4 border-t border-[#e2e8f0] mb-4">
                          {c.instructor ? (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] font-serif font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
                                {c.instructor[0]}
                              </div>
                              <div>
                                <div className="text-xs text-[#64748b]">Aparıcı Kouç</div>
                                <div className="text-sm font-semibold text-[#071326] leading-tight">{c.instructor}</div>
                                {c.instructorRole && (
                                  <div className="text-[11px] text-[#775a19] font-medium">{c.instructorRole}</div>
                                )}
                              </div>
                            </div>
                          ) : <div />}

                          {c.price ? (
                            <div className="text-right">
                              <div className="text-xs text-[#64748b]">İnvestisiya</div>
                              <div className="text-xl sm:text-2xl font-serif font-bold text-[#071326]">
                                {c.price}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Progress Bar if started */}
                      {prog > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-[#64748b] mb-1.5">
                            <span>Tədris Tərəqqisi</span>
                            <span className="font-semibold text-[#775a19]">{prog}%</span>
                          </div>
                          <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#c5a059] to-[#775a19] h-full rounded-full transition-all duration-500"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* CTA Buttons */}
                      <div className="flex items-center gap-3 pt-1">
                        {userApp ? (
                          <button
                            onClick={() => openApplication(c, 'course')}
                            className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                            <span>{userApp.status}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => openApplication(c, 'course')}
                            className="w-full py-3 px-5 rounded-xl border border-[#c5a059] bg-[#c5a059]/10 text-[#775a19] hover:bg-[#c5a059] hover:text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                          >
                            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                            <span>Qeydiyyat</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Educational Guarantee Banner */}
          <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#071326] via-[#0a1b36] to-[#040e1c] border border-[#c5a059]/30 p-8 sm:p-12 shadow-[0_25px_60px_-15px_rgba(7,19,38,0.3)] relative overflow-hidden text-white">
            {/* Background Ambient Glows */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">

              {/* Guarantee 1 */}
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e5c57d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {academy.guarantee1Icon || 'verified'}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-white mb-1.5">
                    {getLocalized(academy, 'guarantee1Title', currentLang, defaultLang) || 'Rəsmi QR Sertifikat'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-light">
                    {getLocalized(academy, 'guarantee1Desc', currentLang, defaultLang) || 'İmtahanı uğurla başa vuran məzunlarımıza qlobal səviyyədə onlayn təsdiqlənən rəsmi QR kodlu sertifikat verilir.'}
                  </p>
                </div>
              </div>

              {/* Guarantee 2 */}
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e5c57d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {academy.guarantee2Icon || 'co_present'}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-white mb-1.5">
                    {getLocalized(academy, 'guarantee2Title', currentLang, defaultLang) || 'Fərdi Mentor Əlaqəsi'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-light">
                    {getLocalized(academy, 'guarantee2Desc', currentLang, defaultLang) || 'Hər bir kurs çərçivəsində tələbələrə ev tapşırıqlarının auditində fərdi mentor rəyi və istiqamətləndirmə təmin edilir.'}
                  </p>
                </div>
              </div>

              {/* Guarantee 3 */}
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e5c57d] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {academy.guarantee3Icon || 'all_inclusive'}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-lg font-medium text-white mb-1.5">
                    {getLocalized(academy, 'guarantee3Title', currentLang, defaultLang) || 'Daimi Material Girişi'}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed font-light">
                    {getLocalized(academy, 'guarantee3Desc', currentLang, defaultLang) || 'Kursu bitirdikdən sonra da bütün video dərslər, audio meditasiyalar və iş dəftərləri şəxsi kabinetinizdə qalır.'}
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


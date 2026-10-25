import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalized, getLocalizedArray } from '../../i18n/localize';
import { useApp } from '../../context/AppContext';

export default function ExpertProfileModal({ coach, isOpen, onClose }) {
  const { currentLang, defaultLang } = useLanguage();
  const {
    openBooking,
    currentUser,
    usersList = [],
    coachesList,
    certificatesList,
    coachReviews,
    addCoachReview,
    addCoachCertificate,
    deleteCoachCertificate,
    updateCoach,
    setActiveCertView,
    setCertViewModalOpen,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'certificates' | 'reviews'

  // Expert profile edit state (for self or admin)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editSpecialties, setEditSpecialties] = useState('');
  const [modalSchedule, setModalSchedule] = useState([]);
  const [modalSlotDate, setModalSlotDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [modalSlotStart, setModalSlotStart] = useState('14:00');
  const [modalSlotEnd, setModalSlotEnd] = useState('15:00');
  const [modalSlotStatus, setModalSlotStatus] = useState('Dolu');
  const [modalSlotNote, setModalSlotNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Review form state
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Custom certificate form state (for coach or admin)
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState(new Date().getFullYear().toString());
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certCredentialUrl, setCertCredentialUrl] = useState('');

  if (!isOpen || !coach) return null;

  // Real-time coach reference from coachesList
  const liveCoach = coachesList.find(c => c.id === coach.id) || coach;

  const matchedUser = (usersList || []).find(u => 
    (liveCoach.userId && String(u.id) === String(liveCoach.userId)) ||
    (liveCoach.name && u.name && u.name.toLowerCase().trim() === liveCoach.name.toLowerCase().trim()) ||
    (liveCoach.email && u.email && u.email.toLowerCase().trim() === liveCoach.email.toLowerCase().trim())
  ) || (currentUser && (
    (liveCoach.userId && String(currentUser.id) === String(liveCoach.userId)) ||
    (liveCoach.name && currentUser.name && liveCoach.name.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
  ) ? currentUser : null);

  let coachDisplayImage = liveCoach.image || liveCoach.avatar || matchedUser?.avatar || matchedUser?.image || '';
  if (!coachDisplayImage) {
    try {
      const imgStore = JSON.parse(localStorage.getItem('monodoxia_coach_images') || '{}');
      if (imgStore[liveCoach.id]) coachDisplayImage = imgStore[liveCoach.id];
    } catch (e) {}
  }

  const coachTitle = getLocalized(liveCoach, 'title', currentLang, defaultLang) || liveCoach.title || 'Kouç & Ekspert';
  const coachBio = getLocalized(liveCoach, 'bio', currentLang, defaultLang) || liveCoach.bio || '';
  const coachExp = getLocalized(liveCoach, 'experience', currentLang, defaultLang) || liveCoach.experience || '';
  const rawSpecialties = getLocalizedArray(liveCoach, 'specialties', currentLang, defaultLang);
  const specialties = rawSpecialties.length > 0
    ? rawSpecialties
    : (Array.isArray(liveCoach.specialties) ? liveCoach.specialties : (liveCoach.specialties || '').split(',').map(s => s.trim()).filter(Boolean));

  const availableSlots = (Array.isArray(liveCoach.availableSlots)
    ? liveCoach.availableSlots
    : (Array.isArray(liveCoach.available_slots) ? liveCoach.available_slots : [])
  ).filter(s => s !== 'Sabah 15:00' && s !== 'Cümə 18:00');

  const scheduleSlots = (Array.isArray(liveCoach.scheduleSlots) ? liveCoach.scheduleSlots : []).filter(s => {
    const lbl = typeof s === 'string' ? s : s?.label;
    return lbl !== 'Sabah 15:00' && lbl !== 'Cümə 18:00';
  });

  // Filter reviews for this coach
  const expertReviews = (coachReviews || []).filter(r => r.coachId === liveCoach.id);
  const totalReviewsCount = expertReviews.length || liveCoach.reviewsCount || liveCoach.reviews_count || 0;
  const currentRating = expertReviews.length > 0
    ? (expertReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / expertReviews.length).toFixed(1)
    : (liveCoach.rating || '5.0');

  // Certificates: Admin Issued (from certificatesList)
  const adminIssuedCerts = (certificatesList || []).filter(c => {
    if (c.status === 'Silindi') return false;
    const matchUserId = liveCoach.userId && String(c.userId) === String(liveCoach.userId);
    const matchName = c.userName && liveCoach.name && c.userName.toLowerCase().trim() === liveCoach.name.toLowerCase().trim();
    const matchField = c.fields?.recipientName && liveCoach.name && c.fields.recipientName.toLowerCase().trim() === liveCoach.name.toLowerCase().trim();
    return matchUserId || matchName || matchField;
  });

  // Certificates: Self-added by coach
  const customCerts = Array.isArray(liveCoach.customCertificates) ? liveCoach.customCertificates : [];

  // Check if current logged-in user is this expert or an Admin
  const isExpertSelf = currentUser && (
    (liveCoach.userId && String(currentUser.id) === String(liveCoach.userId)) ||
    (currentUser.email && liveCoach.email && currentUser.email.toLowerCase() === liveCoach.email.toLowerCase()) ||
    (currentUser.name && liveCoach.name && currentUser.name.toLowerCase().trim() === liveCoach.name.toLowerCase().trim()) ||
    currentUser.role === 'Admin'
  );

  const handleBook = () => {
    onClose();
    if (openBooking) {
      openBooking(liveCoach.id);
    }
  };

  const handleStartEdit = () => {
    setEditBio(liveCoach.bio || liveCoach.experience || '');
    setEditImage(coachDisplayImage || '');
    const currentSpecs = Array.isArray(liveCoach.specialties)
      ? liveCoach.specialties.join(', ')
      : (liveCoach.specialties || '');
    setEditSpecialties(currentSpecs);

    const sched = Array.isArray(liveCoach.scheduleSlots) && liveCoach.scheduleSlots.length > 0
      ? liveCoach.scheduleSlots
      : (Array.isArray(availableSlots)
          ? availableSlots.map((s, idx) => ({
              id: 'mslot-' + idx,
              label: typeof s === 'string' ? s : (s.label || s.slot || 'Saat'),
              date: '',
              startTime: '',
              endTime: '',
              isBooked: false,
              note: ''
            }))
          : []);
    setModalSchedule(sched);
    setIsEditingProfile(true);
  };

  const handleAddModalScheduleSlot = (e) => {
    e?.preventDefault();
    if (!modalSlotStart || !modalSlotEnd) return;
    const formattedDate = modalSlotDate ? modalSlotDate.split('-').reverse().join('.') : '';
    const label = `${formattedDate ? formattedDate + ' ' : ''}${modalSlotStart} - ${modalSlotEnd}`.trim();
    const newEntry = {
      id: 'slot-' + Date.now(),
      date: modalSlotDate,
      startTime: modalSlotStart,
      endTime: modalSlotEnd,
      label,
      isBooked: modalSlotStatus === 'Dolu',
      note: modalSlotNote.trim()
    };
    setModalSchedule(prev => [...prev, newEntry]);
    setModalSlotNote('');
  };

  const handleToggleModalSlot = (slotId) => {
    setModalSchedule(prev => prev.map(s => (s.id === slotId ? { ...s, isBooked: !s.isBooked } : s)));
  };

  const handleRemoveModalSlot = (slotId) => {
    setModalSchedule(prev => prev.filter(s => s.id !== slotId));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const specsArr = editSpecialties
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const availList = modalSchedule.filter(s => !s.isBooked).map(s => s.label);
    const bookedList = modalSchedule.filter(s => s.isBooked).map(s => ({
      id: s.id,
      slot: s.label,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      note: s.note,
      isBooked: true
    }));

    if (updateCoach) {
      updateCoach(liveCoach.id, {
        bio: editBio.trim(),
        experience: editBio.trim(),
        specialties: specsArr,
        image: editImage || coachDisplayImage || '',
        scheduleSlots: modalSchedule,
        bookedSlots: bookedList,
        availableSlots: availList.length > 0 ? availList : availableSlots
      });
    }
    setSaveSuccess(true);
    setIsEditingProfile(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      addCoachReview(liveCoach.id, {
        rating: userRating,
        comment: reviewComment.trim(),
        userName: reviewerName.trim() || currentUser?.name || 'İstifadəçi'
      });
      setReviewComment('');
      setReviewerName('');
      setUserRating(5);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddCustomCert = (e) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;
    addCoachCertificate(liveCoach.id, {
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      issueDate: certYear.trim(),
      credentialId: certCredentialId.trim(),
      credentialUrl: certCredentialUrl.trim()
    });
    setCertTitle('');
    setCertIssuer('');
    setCertYear(new Date().getFullYear().toString());
    setCertCredentialId('');
    setCertCredentialUrl('');
    setShowAddCertModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#070f1e]/80 backdrop-blur-md transition-opacity animate-fadeIn" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="expert-profile-title"
        className="relative bg-white border border-[#c5a059]/40 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 animate-scaleUp text-[#071326] my-6"
      >
        {/* Top Gold Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#c5a059] via-[#e5c57d] to-[#775a19]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#071326] flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Bağla"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Header with Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-[#e2e8f0]">
            <div className="relative shrink-0">
              {coachDisplayImage ? (
                <img
                  src={coachDisplayImage}
                  alt={liveCoach.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-[#c5a059]/40 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] font-serif font-bold text-3xl flex items-center justify-center border-2 border-[#c5a059]/40 shadow-md">
                  {(liveCoach.name || 'E')[0]}
                </div>
              )}
              <span 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center" 
                title="Aktiv Qəbul"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div className="text-center sm:text-left min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[#775a19] text-[11px] font-bold uppercase tracking-wider">
                  Ekspert Kouç
                </span>
                {coachExp && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#64748b] font-medium">
                    <span className="material-symbols-outlined text-[14px] text-[#c5a059]">verified</span>
                    <span>{coachExp} təcrübə</span>
                  </span>
                )}
              </div>

              <h2 id="expert-profile-title" className="font-serif text-2xl sm:text-3xl font-medium text-[#071326] mt-2 mb-1">
                {liveCoach.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#775a19] font-semibold tracking-wide">
                {coachTitle}
              </p>

              {/* Rating & Reviews overview */}
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-[#475569] flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 hover:bg-amber-100 border border-amber-200/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="text-sm">{currentRating}</span>
                  <span className="text-slate-500 font-normal">({totalReviewsCount} rəy)</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('certificates')}
                  className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">workspace_premium</span>
                  <span>{adminIssuedCerts.length + customCerts.length} Sertifikat</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#e2e8f0] pt-4 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#071326] text-[#e5c57d] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Profil & Haqqında</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-[#071326] text-[#e5c57d] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span>Sertifikatlar</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#c5a059]/20 text-[#775a19]">
                {adminIssuedCerts.length + customCerts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#071326] text-[#e5c57d] shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">star</span>
              <span>Ulduzlar & Rəylər</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {totalReviewsCount}
              </span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 pt-5">
              {/* Alert & Action Header for Expert / Admin */}
              {saveSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Məlumatlarınız uğurla yadda saxlanıldı!
                </div>
              )}

              {isExpertSelf && !isEditingProfile && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#775a19] border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    <span>Məlumatları Redaktə Et</span>
                  </button>
                </div>
              )}

              {isEditingProfile ? (
                /* EDIT FORM FOR EXPERT */
                <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                    <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <span className="material-symbols-outlined text-[17px]">edit_note</span>
                      Profil Məlumatlarını Redaktə Et
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      Ləğv et
                    </button>
                  </div>

                  {/* 0. Profil Şəkli */}
                  <div className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-2">
                    <label className="block text-xs font-bold text-[#775a19] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                      Profil Şəkli
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl border-2 border-amber-500/40 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                        {editImage ? (
                          <img src={editImage} alt="Önizləmə" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">Şəkil yoxdur</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <input
                          type="text"
                          value={editImage}
                          onChange={e => setEditImage(e.target.value)}
                          placeholder="https://... şəkil linki"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs">
                            <span className="material-symbols-outlined text-[14px]">upload</span>
                            <span>Fayl Yüklə</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 10 * 1024 * 1024) {
                                  if (showToast) showToast('Şəkil 10MB-dan böyük ola bilməz', 'error');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = ev => {
                                  const img = new window.Image();
                                  img.onload = () => {
                                    const MAX = 400;
                                    const scale = Math.min(MAX / img.width, MAX / img.height, 1);
                                    const w = Math.round(img.width * scale);
                                    const h = Math.round(img.height * scale);
                                    const canvas = document.createElement('canvas');
                                    canvas.width = w;
                                    canvas.height = h;
                                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                                    const compressed = canvas.toDataURL('image/jpeg', 0.75);
                                    setEditImage(compressed);
                                    if (showToast) showToast('Şəkil hazırlandı!', 'success');
                                  };
                                  img.src = ev.target.result;
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          {editImage && (
                            <button
                              type="button"
                              onClick={() => setEditImage('')}
                              className="text-[11px] text-rose-500 hover:text-rose-700 underline cursor-pointer"
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1. Bio / Metodologiya */}
                  <div>
                    <label className="block text-xs font-bold text-[#775a19] mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">psychology</span>
                      Metodologiya və Təcrübə (Haqqında)
                    </label>
                    <textarea
                      rows={4}
                      value={editBio}
                      onChange={e => setEditBio(e.target.value)}
                      placeholder="Metodologiyanız, yanaşmanız və təcrübəniz haqqında yazın..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                    />
                  </div>

                  {/* 2. Specialties */}
                  <div>
                    <label className="block text-xs font-bold text-[#775a19] mb-1 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px]">category</span>
                      İxtisaslaşdığı Sahələr (Vergüllə ayırın)
                    </label>
                    <input
                      type="text"
                      value={editSpecialties}
                      onChange={e => setEditSpecialties(e.target.value)}
                      placeholder="Məs: Fərdi İnkişaf, Psixologiya, Liderlik"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                    {editSpecialties && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {editSpecialties.split(',').map(s => s.trim()).filter(Boolean).map((sp, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-medium">
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Schedule & Available/Booked Slots */}
                  <div className="space-y-3 pt-2 border-t border-amber-200/60">
                    <label className="block text-xs font-bold text-[#775a19] flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      Təqvim: Dolu / Rezerv Olunmuş və Mövcud Saatlar
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Tarix və saat aralığı (neçədən-neçəyə) seçərək Dolu və ya Mövcud kimi qeyd edin. Dolu olanlar saytda seçilə bilməz.
                    </p>

                    <div className="p-3.5 rounded-2xl bg-white border border-amber-200 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Tarix</label>
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={modalSlotDate}
                            onChange={e => setModalSlotDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Başlama Saatı</label>
                          <input
                            type="time"
                            value={modalSlotStart}
                            onChange={e => setModalSlotStart(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Bitmə Saatı</label>
                          <input
                            type="time"
                            value={modalSlotEnd}
                            onChange={e => setModalSlotEnd(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Vəziyyət</label>
                          <select
                            value={modalSlotStatus}
                            onChange={e => setModalSlotStatus(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                          >
                            <option value="Dolu">🔴 Dolu / Rezerv</option>
                            <option value="Mövcud">🟢 Mövcud / Boş</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={modalSlotNote}
                          onChange={e => setModalSlotNote(e.target.value)}
                          placeholder="Qeyd (istəyə bağlı)..."
                          className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddModalScheduleSlot}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-[15px]">add</span>
                          Əlavə et
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 max-h-40 overflow-y-auto">
                        {modalSchedule.map(s => (
                          <span
                            key={s.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              s.isBooked
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <span>{s.label}</span>
                            <span className="text-[10px] opacity-75 font-normal">
                              ({s.isBooked ? 'Dolu' : 'Boş'})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleModalSlot(s.id)}
                              className="text-[10px] underline ml-1 hover:text-amber-900 cursor-pointer"
                              title="Vəziyyəti dəyiş"
                            >
                              Dəyiş
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveModalSlot(s.id)}
                              className="text-slate-400 hover:text-red-600 ml-0.5 cursor-pointer"
                              title="Sil"
                            >
                              <span className="material-symbols-outlined text-[13px]">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-amber-200/60">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-200/50 rounded-xl cursor-pointer"
                    >
                      Ləğv et
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[15px]">save</span>
                      Yadda Saxla
                    </button>
                  </div>
                </form>
              ) : (
                /* READ-ONLY VIEW */
                <>
                  {/* Full Bio */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider font-bold text-[#775a19] mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">psychology</span>
                      <span>Metodologiya və Təcrübə</span>
                    </h3>
                    <p className="text-sm text-[#334155] leading-relaxed font-light whitespace-pre-line">
                      {coachBio || 'Hələlik metodologiya məlumatı daxil edilməyib.'}
                    </p>
                  </div>

                  {/* Specialties */}
                  {specialties.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-bold text-[#775a19] mb-2.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">category</span>
                        <span>İxtisaslaşdığı Sahələr</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {specialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-[#faf8f5] text-[#1e293b] border border-[#c5a059]/20 text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e2e8f0]">
                      <div className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-1">
                        Seans Müddəti
                      </div>
                      <div className="text-sm font-bold text-[#071326] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-[#775a19]">timer</span>
                        <span>{liveCoach.sessionDuration || liveCoach.session_duration || '60 dəqiqə'}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e2e8f0]">
                      <div className="text-[11px] text-[#64748b] uppercase tracking-wider font-semibold mb-1">
                        İnteraktiv Format
                      </div>
                      <div className="text-sm font-bold text-[#071326] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-[#775a19]">videocam</span>
                        <span>Onlayn (Təhlükəsiz Video Otaq)</span>
                      </div>
                    </div>
                  </div>

                  {/* Available / Scheduled Slots Display */}
                  {(scheduleSlots.length > 0 || availableSlots.length > 0) && (
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-bold text-[#775a19] mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>Yaxın Tarixlər üçün Saat Cədvəli</span>
                        </span>
                        <span className="text-[10px] font-normal text-slate-400 normal-case">
                          🟢 Boş = rezerv edə bilərsiniz • 🔴 Dolu = tutulub
                        </span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {scheduleSlots.length > 0 ? (
                          scheduleSlots.map(s => (
                            s.isBooked ? (
                              <span
                                key={s.id}
                                title="Bu saat artıq rezerv olunub"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold bg-rose-50 text-rose-400 border-rose-200 opacity-70 cursor-not-allowed select-none"
                              >
                                <span className="material-symbols-outlined text-[14px]">event_busy</span>
                                <span>{s.label}</span>
                                <span className="text-[10px] font-bold px-1.5 rounded bg-rose-200/60 text-rose-900">Dolu</span>
                              </span>
                            ) : (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => { onClose(); openBooking(liveCoach.id, s.label); }}
                                title="Bu saat üçün rezervasiya et"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[14px]">event_available</span>
                                <span>{s.label}</span>
                                <span className="text-[10px] font-bold px-1.5 rounded bg-emerald-200/60 text-emerald-900">Rezerv Et</span>
                              </button>
                            )
                          ))
                        ) : (
                          availableSlots.map((slot, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => { onClose(); openBooking(liveCoach.id, slot); }}
                              title="Bu saat üçün rezervasiya et"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">event_available</span>
                              <span>{slot}</span>
                              <span className="text-[10px] font-bold px-1.5 rounded bg-emerald-200/60 text-emerald-900">Rezerv Et</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 2: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-6 pt-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#071326] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#c5a059]">verified</span>
                    <span>Sertifikatlar və Lisenziyalar</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Admin tərəfindən verilən rəsmi və ekspertin şəxsi peşəkar sertifikatları
                  </p>
                </div>

                {isExpertSelf && (
                  <button
                    type="button"
                    onClick={() => setShowAddCertModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] hover:text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Sertifikat Əlavə Et</span>
                  </button>
                )}
              </div>

              {/* Add Custom Certificate Modal/Form */}
              {showAddCertModal && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">add_task</span>
                      <span>Yeni Sertifikat Əlavə Et</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddCertModal(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Bağla
                    </button>
                  </div>
                  <form onSubmit={handleAddCustomCert} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Sertifikatın Adı *
                        </label>
                        <input
                          type="text"
                          required
                          value={certTitle}
                          onChange={(e) => setCertTitle(e.target.value)}
                          placeholder="Məs: ICF PCC / Somatik Təlim Sertifikatı"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Verən Təşkilat / İnstitut *
                        </label>
                        <input
                          type="text"
                          required
                          value={certIssuer}
                          onChange={(e) => setCertIssuer(e.target.value)}
                          placeholder="Məs: International Coaching Federation"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059] bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          İl / Tarix
                        </label>
                        <input
                          type="text"
                          value={certYear}
                          onChange={(e) => setCertYear(e.target.value)}
                          placeholder="Məs: 2023"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Sertifikat Nömrəsi (ID)
                        </label>
                        <input
                          type="text"
                          value={certCredentialId}
                          onChange={(e) => setCertCredentialId(e.target.value)}
                          placeholder="Məs: ICF-992144"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Yoxlama Linki (URL)
                        </label>
                        <input
                          type="url"
                          value={certCredentialUrl}
                          onChange={(e) => setCertCredentialUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059] bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddCertModal(false)}
                        className="px-3 py-1.5 text-xs rounded-lg text-slate-600 hover:bg-slate-200/60"
                      >
                        Ləğv et
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs rounded-lg bg-[#c5a059] hover:bg-[#b08d47] text-white font-bold shadow"
                      >
                        Yadda Saxla
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Section A: Admin-Issued Certificates */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[18px] text-[#c5a059]">verified_user</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#071326]">
                    Monodoxia Rəsmi Sertifikatları ({adminIssuedCerts.length})
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Akademiya Tərəfindən Təsdiqlənmiş
                  </span>
                </div>

                {adminIssuedCerts.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                    Hələlik bu ekspert üçün akademiya daxili verilmiş rəsmi sertifikat yoxdur.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {adminIssuedCerts.map(cert => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-2xl bg-gradient-to-r from-[#faf8f5] to-white border border-[#c5a059]/40 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#071326] to-[#0c2242] flex items-center justify-center shrink-0 shadow">
                          <span className="material-symbols-outlined text-[24px] text-[#e5c57d]">workspace_premium</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-bold text-[#c5a059]">{cert.number}</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              ✓ Doğrulanmış
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {cert.fields?.dateValue || cert.issuedAt}
                            </span>
                          </div>
                          <h5 className="font-serif text-sm font-bold text-[#071326] mt-1">
                            {cert.fields?.courseName || 'Monodoxia Sertifikatı'}
                          </h5>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Verildi: <span className="font-semibold text-slate-800">{cert.userName || cert.fields?.recipientName}</span>
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5 self-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (setActiveCertView && setCertViewModalOpen) {
                                setActiveCertView(cert);
                                setCertViewModalOpen(true);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#071326] hover:bg-[#0c2242] text-[#e5c57d] text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>Bax</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section B: Expert Custom / Professional Certificates */}
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[18px] text-[#775a19]">school</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#071326]">
                    Beynəlxalq və Peşəkar Sertifikatlar ({customCerts.length})
                  </h4>
                </div>

                {customCerts.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                    Ekspert tərəfindən əlavə edilmiş digər sertifikat tapılmadı.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customCerts.map(cert => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#c5a059]/40 transition-colors relative group"
                      >
                        {isExpertSelf && (
                          <button
                            type="button"
                            onClick={() => deleteCoachCertificate(liveCoach.id, cert.id)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                            title="Sertifikatı sil"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 text-[#775a19] text-[11px] font-bold uppercase tracking-wider mb-1">
                            <span className="material-symbols-outlined text-[15px]">badge</span>
                            <span>{cert.issuer}</span>
                          </div>
                          <h5 className="font-serif text-sm font-bold text-[#071326] leading-snug">
                            {cert.title}
                          </h5>
                          {cert.credentialId && (
                            <p className="text-[11px] text-slate-500 font-mono mt-1">
                              ID: {cert.credentialId}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
                          <span>{cert.issueDate ? `${cert.issueDate} ili` : 'Təsdiqlənmiş'}</span>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#c5a059] hover:text-[#775a19] font-semibold flex items-center gap-0.5"
                            >
                              <span>Doğrula</span>
                              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS & RATINGS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 pt-5">
              {/* Rating Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#faf8f5] to-white border border-[#c5a059]/30 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#071326] to-[#0c2242] flex flex-col items-center justify-center text-[#e5c57d] shadow-md shrink-0">
                    <span className="text-2xl font-serif font-bold leading-none">{currentRating}</span>
                    <span className="text-[10px] text-amber-200 mt-0.5">/ 5.0</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="material-symbols-outlined text-[20px]">
                          {star <= Math.round(Number(currentRating)) ? 'star' : 'star_border'}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      Ümumi <strong className="text-slate-900">{totalReviewsCount}</strong> istifadəçi rəyi əsasında
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                    <span>100% Müsbət Təcrübə</span>
                  </span>
                </div>
              </div>

              {/* Review Submission Form */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#071326] mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">rate_review</span>
                  <span>Ekspertə Ulduz Ver və Rəy Yaz</span>
                </h4>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  {/* Star rating selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Qiymətləndirməniz:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(s)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                          aria-label={`${s} ulduz`}
                        >
                          <span
                            className={`material-symbols-outlined text-[28px] ${
                              s <= (hoverRating || userRating) ? 'text-amber-500' : 'text-slate-300'
                            }`}
                          >
                            star
                          </span>
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-600 ml-2">
                        {userRating === 5 ? 'Əla (5/5)' : userRating === 4 ? 'Çox Yaxşı (4/5)' : userRating === 3 ? 'Yaxşı (3/5)' : `${userRating} Ulduz`}
                      </span>
                    </div>
                  </div>

                  {!currentUser && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Adınız və Soyadınız
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Məs: Aysel Məmmədova"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Rəyiniz və Təəssüratınız *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Ekspertlə seans təcrübəniz, əldə etdiyiniz nəticələr və tövsiyələriniz barədə yazın..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059] resize-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingReview || !reviewComment.trim()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] text-xs font-bold tracking-wider uppercase shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#e5c57d]">send</span>
                      <span>Rəyi Paylaş</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  İstifadəçi Rəyləri ({expertReviews.length})
                </h4>

                {expertReviews.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#faf8f5] border border-slate-200 text-center">
                    <span className="material-symbols-outlined text-[36px] text-amber-300">chat</span>
                    <p className="text-xs text-slate-500 mt-2">
                      İlk rəy yazan siz olun! Yuxarıdakı form vasitəsilə təəssüratlarınızı bölüşün.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expertReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-[#071326] font-bold text-xs flex items-center justify-center">
                              {(rev.userName || 'İ')[0]}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#071326] flex items-center gap-1.5">
                                <span>{rev.userName}</span>
                                {rev.userRole && (
                                  <span className="text-[10px] font-semibold text-[#775a19] bg-[#c5a059]/15 px-1.5 py-0.2 rounded">
                                    {rev.userRole}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('az-AZ') : 'Yaxın zamanda'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <span key={st} className="material-symbols-outlined text-[16px]">
                                {st <= rev.rating ? 'star' : 'star_border'}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-[#334155] leading-relaxed pl-10">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-6 mt-6 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              Bağla
            </button>

            <button
              type="button"
              onClick={handleBook}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-white hover:text-[#e5c57d] text-xs font-bold tracking-wider uppercase shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#e5c57d]">calendar_today</span>
              <span>Fərdi Kouçinq Rezervasiya Et</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

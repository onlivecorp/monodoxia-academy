import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { MultiLangEditor, LanguageTabs, TranslationStatus, LocalizedField, LocalizedArrayField } from '../../i18n/TranslationComponents';
import { getTranslationStatus, copyFromDefaultLanguage } from '../../i18n/localize';
import AdminApplicationsTab from './AdminApplicationsTab';
import AdminRegistrationsTab from './AdminRegistrationsTab';
import AdminCategoriesTab from './AdminCategoriesTab';

export default function AdminModal() {
  const {
    currentUser,
    adminModalOpen,
    setAdminModalOpen,
    applicationsList,
    categoriesList,
    getCategoryLabel,
    usersList,
    updateUser,
    addUser,
    deleteUser,
    coursesList,
    addCourse,
    updateCourse,
    deleteCourse,
    clubTiersList,
    updateClubTier,
    addClubTier,
    deleteClubTier,
    eventsList,
    addEvent,
    updateEvent,
    deleteEvent,
    communityTopics,
    addTopic,
    updateTopic,
    deleteTopic,
    pinTopic,
    platformSettings,
    updatePlatformSettings,
    sqlConfig,
    updateSqlConfig,
    testSqlConnection,
    migrateDatabaseTables,
    showToast,
    // CMS
    homeContent,
    updateHomeBlock,
    testimonialsList,
    addTestimonial,
    deleteTestimonial,
    faqsList,
    addFaq,
    deleteFaq,
    coachesList,
    addCoach,
    updateCoach,
    deleteCoach,
    updateTestimonial,
    areasList,
    updateArea,
    updateFaq
  } = useApp();

  const { lang: currentLang, defaultLang, supportedLangs, setSupportedLangs } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview');

  // Translation Management Tab States
  const [transEntity, setTransEntity] = useState('courses');
  const [transSelectedId, setTransSelectedId] = useState(null);
  const [transActiveLang, setTransActiveLang] = useState('en');

  // Inline per-module translation active lang state
  const [userTransLang, setUserTransLang] = useState('en');
  const [courseTransLang, setCourseTransLang] = useState('en');
  const [clubTransLang, setClubTransLang] = useState('en');
  const [eventTransLang, setEventTransLang] = useState('en');
  const [communityTransLang, setCommunityTransLang] = useState('en');
  // Collapsed state for inline translation panels
  const [userTransOpen, setUserTransOpen] = useState(false);
  const [courseTransOpen, setCourseTransOpen] = useState(false);
  const [clubTransOpen, setClubTransOpen] = useState(false);
  const [eventTransOpen, setEventTransOpen] = useState(false);
  const [communityTransOpen, setCommunityTransOpen] = useState(false);

  // SQL Database state
  const [dbForm, setDbForm] = useState(sqlConfig);
  const [showPassword, setShowPassword] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Form states for modals/sub-actions
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Tələbə');
  const [newUserTier, setNewUserTier] = useState('Free');
  const [newUserTranslations, setNewUserTranslations] = useState({});
  const [newUserTransOpen, setNewUserTransOpen] = useState(false);
  const [newUserTransLang, setNewUserTransLang] = useState('en');
  const [editingUser, setEditingUser] = useState(null);

  // Course Add/Edit State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseInstructor, setNewCourseInstructor] = useState('Dr. Leyla Əliyeva');
  const [newCoursePrice, setNewCoursePrice] = useState('₼ 450');
  const [newCourseCategory, setNewCourseCategory] = useState('psychology');
  const [newCourseDuration, setNewCourseDuration] = useState('8 Həftə');
  const [newCourseBadge, setNewCourseBadge] = useState('AKREDİTASİYALI');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseTranslations, setNewCourseTranslations] = useState({});
  const [newCourseTransOpen, setNewCourseTransOpen] = useState(false);
  const [newCourseTransLang, setNewCourseTransLang] = useState('en');
  const [editingCourse, setEditingCourse] = useState(null);

  // Event Add/Edit State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSpeaker, setNewEventSpeaker] = useState('Dr. Leyla Əliyeva');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventCapacity, setNewEventCapacity] = useState('100');
  const [newEventTypeBadge, setNewEventTypeBadge] = useState('VEBİNAR');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventTranslations, setNewEventTranslations] = useState({});
  const [newEventTransOpen, setNewEventTransOpen] = useState(false);
  const [newEventTransLang, setNewEventTransLang] = useState('en');
  const [editingEvent, setEditingEvent] = useState(null);

  // Community Topic Add/Edit State
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('İcma Müzakirəsi');
  const [newTopicAuthor, setNewTopicAuthor] = useState('Monodoxia Komandası');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicTranslations, setNewTopicTranslations] = useState({});
  const [newTopicTransOpen, setNewTopicTransOpen] = useState(false);
  const [newTopicTransLang, setNewTopicTransLang] = useState('en');
  const [editingTopic, setEditingTopic] = useState(null);

  // Club Tier Add/Edit State
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState('65');
  const [newTierPeriod, setNewTierPeriod] = useState('/ aylıq');
  const [newTierPopular, setNewTierPopular] = useState(false);
  const [newTierFeatures, setNewTierFeatures] = useState('');
  const [newTierTranslations, setNewTierTranslations] = useState({});
  const [newTierTransOpen, setNewTierTransOpen] = useState(false);
  const [newTierTransLang, setNewTierTransLang] = useState('en');
  const [editingTier, setEditingTier] = useState(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState(platformSettings);
  const [maintTransLang, setMaintTransLang] = useState('az');

  useEffect(() => {
    setSettingsForm(platformSettings);
  }, [platformSettings]);

  // CMS State – block editors
  const [cmsBlock, setCmsBlock] = useState('navbar');
  const [cmsNavbar, setCmsNavbar] = useState(() => ({ ...(homeContent?.navbar || {}) }));
  const [cmsHero, setCmsHero] = useState(() => ({ ...(homeContent?.hero || {}) }));
  const [cmsAbout, setCmsAbout] = useState(() => ({ ...(homeContent?.about || {}) }));
  const [cmsAreas, setCmsAreas] = useState(() => ({ ...(homeContent?.areas || {}) }));
  const [cmsAcademy, setCmsAcademy] = useState(() => ({ ...(homeContent?.academy || {}) }));
  const [cmsClub, setCmsClub] = useState(() => ({ ...(homeContent?.club || {}) }));
  const [cmsCoaches, setCmsCoaches] = useState(() => ({ ...(homeContent?.coaches || {}) }));
  const [cmsCommunity, setCmsCommunity] = useState(() => ({ ...(homeContent?.community || {}) }));
  const [cmsTestimonials, setCmsTestimonials] = useState(() => ({ ...(homeContent?.testimonials || {}) }));
  const [cmsFaq, setCmsFaq] = useState(() => ({ ...(homeContent?.faq || {}) }));
  const [cmsNewsletter, setCmsNewsletter] = useState(() => ({ ...(homeContent?.newsletter || {}) }));
  const [cmsFooter, setCmsFooter] = useState(() => ({ ...(homeContent?.footer || {}) }));
  const [editingCoach, setEditingCoach] = useState(null);
  // CMS new testimonial / faq / coach forms
  const [newTestimonialQuote, setNewTestimonialQuote] = useState('');
  const [newTestimonialAuthor, setNewTestimonialAuthor] = useState('');
  const [newTestimonialRole, setNewTestimonialRole] = useState('');
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newCoachUserId, setNewCoachUserId] = useState('');
  const [newCoachName, setNewCoachName] = useState('');
  const [newCoachTitle, setNewCoachTitle] = useState('');
  const [newCoachBio, setNewCoachBio] = useState('');
  const [newCoachImage, setNewCoachImage] = useState('');
  const [newCoachSpecialties, setNewCoachSpecialties] = useState('');

  if (!adminModalOpen) return null;

  // ─── Inline Translator Component (defined per render for closure access) ───
  // activeLangs: enabled supported langs (excluding default AZ which is the main form)
  const transLangs = (supportedLangs || []).filter(l => l.code !== 'az' && l.enabled !== false);

  function InlineTranslator({ item, fields, activeLang, setActiveLang, onUpdate, isOpen, setIsOpen }) {
    if (!item) return null;
    const trans = item.translations || {};
    const getLangStatus = (code) => {
      if (!fields || fields.length === 0) return 'missing';
      const filled = fields.filter(f => {
        const v = trans[code]?.[f.key];
        if (Array.isArray(v)) return v.length > 0;
        return v && String(v).trim() !== '';
      }).length;
      if (filled === 0) return 'missing';
      if (filled < fields.length) return 'partial';
      return 'complete';
    };
    const statusColor = { complete: 'bg-green-500', partial: 'bg-yellow-500', missing: 'bg-red-400' };
    const handleChange = (langCode, fieldKey, value) => {
      const updated = {
        ...(trans),
        [langCode]: { ...(trans[langCode] || {}), [fieldKey]: value }
      };
      onUpdate({ translations: updated });
    };
    return (
      <div style={{marginTop:'14px',border:'1px solid #e2e8f0',borderRadius:'10px',overflow:'hidden',background:'#ffffff',boxShadow:'0 1px 3px rgba(0,0,0,0.02)'}}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width:'100%',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            padding:'10px 14px',
            fontSize:'12px',
            fontWeight:600,
            background:isOpen?'#fffbeb':'#f8fafc',
            color:isOpen?'#b45309':'#475569',
            border:'none',
            cursor:'pointer',
            transition:'all 0.2s ease'
          }}
        >
          <span style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span className="material-symbols-outlined" style={{fontSize:'16px',color:'#c5a059'}}>translate</span>
            <span style={{fontWeight:600}}>Çoxdilli Tərcümə Redaktoru (i18n)</span>
            <span style={{display:'flex',alignItems:'center',gap:'6px',marginLeft:'8px'}}>
              {transLangs.map(l => {
                const st = getLangStatus(l.code);
                return (
                  <span key={l.code} style={{display:'flex',alignItems:'center',gap:'3px',fontSize:'10px',color:'#64748b'}} title={`${l.code.toUpperCase()}: ${st}`}>
                    <span style={{width:'6px',height:'6px',borderRadius:'50%',background:st==='complete'?'#22c55e':st==='partial'?'#eab308':'#f87171'}} />
                    <span style={{textTransform:'uppercase',fontWeight:700}}>{l.code}</span>
                  </span>
                );
              })}
            </span>
          </span>
          <span className="material-symbols-outlined" style={{fontSize:'18px',color:isOpen?'#b45309':'#94a3b8'}}>{isOpen ? 'expand_less' : 'expand_more'}</span>
        </button>
        {isOpen && (
          <div style={{padding:'14px',background:'#f8fafc',borderTop:'1px solid #e2e8f0',display:'flex',flexDirection:'column',gap:'12px'}}>
            <p style={{fontSize:'11px',color:'#64748b',margin:0}}>
              Azərbaycan dili (AZ) əsas dildir. Aşağıda digər dillər üçün tərcümə variantlarını daxil edin:
            </p>
            {/* Lang tabs */}
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
              {transLangs.map(l => {
                const isActive = activeLang === l.code;
                const st = getLangStatus(l.code);
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setActiveLang(l.code)}
                    style={{
                      display:'flex',
                      alignItems:'center',
                      gap:'6px',
                      padding:'5px 10px',
                      borderRadius:'6px',
                      fontSize:'11px',
                      fontWeight:600,
                      cursor:'pointer',
                      border:isActive?'1px solid #d4af37':'1px solid #e2e8f0',
                      background:isActive?'#fffbeb':'#ffffff',
                      color:isActive?'#b45309':'#64748b',
                      transition:'all 0.15s ease'
                    }}
                  >
                    <span>{l.flag}</span>
                    <span style={{textTransform:'uppercase'}}>{l.code}</span>
                    <span style={{width:'5px',height:'5px',borderRadius:'50%',background:st==='complete'?'#22c55e':st==='partial'?'#eab308':'#f87171'}} />
                  </button>
                );
              })}
            </div>
            {/* Fields for active lang */}
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {fields.map(f => {
                const rawVal = trans[activeLang]?.[f.key];
                const val = Array.isArray(rawVal) ? rawVal.join('\n') : (rawVal || '');
                return (
                  <div key={f.key} style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                    <label className="admin-label">
                      {f.label} <span style={{color:'#c5a059',textTransform:'uppercase'}}>({activeLang})</span>
                      {f.isArray && <span style={{fontSize:'10px',color:'#94a3b8',marginLeft:'6px',fontWeight:'normal'}}>(hər sətirdə bir maddə)</span>}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        rows={f.rows || (f.isArray ? 3 : 2)}
                        value={val}
                        onChange={e => {
                          const v = f.isArray
                            ? e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                            : e.target.value;
                          handleChange(activeLang, f.key, v);
                        }}
                        className="admin-input"
                        style={{minHeight:'54px',resize:'vertical'}}
                        placeholder={f.isArray ? `${f.label} (hər sətirdə bir maddə)...` : `${f.label} (${activeLang.toUpperCase()})...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={e => handleChange(activeLang, f.key, e.target.value)}
                        className="admin-input"
                        placeholder={`${f.label} (${activeLang.toUpperCase()})...`}
                      />
                    )}
                  </div>
                );
              })}
              {fields.length === 0 && (
                <p className="text-xs text-outline italic">Bu element üçün tərcümə sahəsi mövcud deyil.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      tier: newUserTier,
      translations: newUserTranslations
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserTranslations({});
    setNewUserTransOpen(false);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      tier: editingUser.tier,
      status: editingUser.status || 'Aktiv',
      phone: editingUser.phone || '',
      notes: editingUser.notes || '',
      translations: editingUser.translations || {}
    });
    setEditingUser(null);
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCoursePrice) return;
    addCourse({
      title: newCourseTitle,
      instructor: newCourseInstructor,
      price: newCoursePrice,
      category: newCourseCategory,
      duration: newCourseDuration,
      badge: newCourseBadge,
      description: newCourseDesc || 'Yeni akademik fərdi inkişaf proqramı.',
      translations: newCourseTranslations
    });
    setNewCourseTitle('');
    setNewCourseDesc('');
    setNewCourseTranslations({});
    setNewCourseTransOpen(false);
  };

  const handleSaveEditCourse = (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse.id, {
      title: editingCourse.title,
      instructor: editingCourse.instructor,
      price: editingCourse.price,
      category: editingCourse.category,
      duration: editingCourse.duration,
      badge: editingCourse.badge,
      status: editingCourse.status,
      occupancy: Number(editingCourse.occupancy) || 0,
      description: editingCourse.description,
      translations: editingCourse.translations || {}
    });
    setEditingCourse(null);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;
    addEvent({
      title: newEventTitle,
      speaker: newEventSpeaker,
      datetime: newEventDate,
      capacity: newEventCapacity,
      typeBadge: newEventTypeBadge,
      desc: newEventDesc || 'İnteraktiv masterklas və praktiki sessiya.',
      translations: newEventTranslations
    });
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventDesc('');
    setNewEventTranslations({});
    setNewEventTransOpen(false);
  };

  const handleSaveEditEvent = (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    updateEvent(editingEvent.id, {
      title: editingEvent.title,
      speaker: editingEvent.speaker,
      datetime: editingEvent.datetime,
      capacity: Number(editingEvent.capacity) || 100,
      registered: Number(editingEvent.registered) || 0,
      typeBadge: editingEvent.typeBadge,
      desc: editingEvent.desc,
      translations: editingEvent.translations || {}
    });
    setEditingEvent(null);
  };

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle || !newTopicContent) return;
    addTopic(newTopicTitle, newTopicContent, newTopicCategory, newTopicAuthor, newTopicTranslations);
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicTranslations({});
    setNewTopicTransOpen(false);
  };

  const handleSaveEditTopic = (e) => {
    e.preventDefault();
    if (!editingTopic) return;
    updateTopic(editingTopic.id, {
      title: editingTopic.title,
      badge: editingTopic.badge,
      author: editingTopic.author,
      snippet: editingTopic.snippet,
      translations: editingTopic.translations || {}
    });
    setEditingTopic(null);
  };

  const handleCreateClubTier = (e) => {
    e.preventDefault();
    if (!newTierName || !newTierPrice) return;
    addClubTier({
      name: newTierName,
      price: newTierPrice,
      period: newTierPeriod,
      popular: newTierPopular,
      features: newTierFeatures,
      translations: newTierTranslations
    });
    setNewTierName('');
    setNewTierPrice('65');
    setNewTierFeatures('');
    setNewTierPopular(false);
    setNewTierTranslations({});
    setNewTierTransOpen(false);
  };

  const handleSaveEditClubTier = (e) => {
    e.preventDefault();
    if (!editingTier) return;
    updateClubTier(editingTier.id, {
      name: editingTier.name,
      price: editingTier.price,
      period: editingTier.period,
      popular: Boolean(editingTier.popular),
      features: typeof editingTier.features === 'string'
        ? editingTier.features.split('\n').map(s => s.trim()).filter(Boolean)
        : editingTier.features,
      translations: editingTier.translations || {}
    });
    setEditingTier(null);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updatePlatformSettings(settingsForm);
  };

  if (!adminModalOpen || currentUser?.role !== 'Admin') return null;

  return (
    <div className="fixed inset-0 z-50 admin-backdrop w-screen h-screen overflow-hidden">
      <div className="admin-shell w-full h-full flex flex-col overflow-hidden">

        {/* TOP BAR */}
        <div className="admin-topbar h-[58px] px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div style={{background:'linear-gradient(135deg,rgba(197,160,89,0.18) 0%,rgba(197,160,89,0.06) 100%)',border:'1px solid rgba(197,160,89,0.3)',borderRadius:'8px',width:'34px',height:'34px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span className="material-symbols-outlined" style={{fontSize:'18px',color:'#b45309'}}>admin_panel_settings</span>
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <h3 style={{fontFamily:'"Playfair Display",Georgia,serif',fontSize:'14px',fontWeight:700,color:'#0f172a',letterSpacing:'-0.01em'}}>
                  Monodoxia Core Management Studio
                </h3>
                <span style={{padding:'1px 7px',background:'linear-gradient(135deg,#b45309,#d4af37)',color:'#ffffff',fontSize:'9px',fontWeight:800,borderRadius:'4px',letterSpacing:'0.08em'}}>PRO</span>
              </div>
              <p style={{fontSize:'11px',color:'#64748b',marginTop:'1px',letterSpacing:'0.01em'}}>Platforma · LMS · Abunəliklər · SQL · i18n</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'4px 10px',background:'#dcfce7',border:'1px solid #bbf7d0',borderRadius:'100px'}}>
              <div className="admin-live-dot" />
              <span style={{fontSize:'10px',color:'#15803d',fontWeight:700}}>SİSTEM AKTİV</span>
            </div>
            <button
              onClick={() => setAdminModalOpen(false)}
              style={{width:'32px',height:'32px',borderRadius:'8px',background:'#f1f5f9',border:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='#fee2e2';e.currentTarget.style.borderColor='#fca5a5';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#f1f5f9';e.currentTarget.style.borderColor='#e2e8f0';}}
            >
              <span className="material-symbols-outlined" style={{fontSize:'18px',color:'#64748b'}}>close</span>
            </button>
          </div>
        </div>

        {/* BODY (SIDEBAR + MAIN VIEW) */}
        <div className="flex-1 flex overflow-hidden">

          {/* SIDEBAR */}
          <aside className="admin-sidebar admin-scroll w-[220px] p-3 flex flex-col gap-0.5 overflow-y-auto shrink-0">
            {/* Category header */}
            <div style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',fontWeight:700,padding:'8px 12px 4px'}}>
              Analitika
            </div>
            {[
              { id: 'overview', icon: 'dashboard', label: 'İcmal & Statistika' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`admin-nav-item ${activeTab===tab.id?'active':''}` }>
                <span className="material-symbols-outlined" style={{fontSize:'17px',flexShrink:0,color:activeTab===tab.id?'#b45309':'#64748b'}}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            <div style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',fontWeight:700,padding:'12px 12px 4px'}}>
              İdarəetmə
            </div>
            {[
              { id: 'applications', icon: 'assignment', label: 'Müraciətlər' },
              { id: 'registrations', icon: 'how_to_reg', label: 'Qeydiyyatlar' },
              { id: 'users', icon: 'group', label: 'İstifadəçilər & RBAC' },
              { id: 'courses', icon: 'school', label: 'Kurslar & LMS' },
              { id: 'categories', icon: 'category', label: 'Kateqoriyalar' },
              { id: 'club', icon: 'card_membership', label: 'Club Tiers' },
              { id: 'events', icon: 'event', label: 'Tədbirlər' },
              { id: 'community', icon: 'forum', label: 'İcma & Forum' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`admin-nav-item ${activeTab===tab.id?'active':''}` }>
                <span className="material-symbols-outlined" style={{fontSize:'17px',flexShrink:0,color:activeTab===tab.id?'#b45309':'#64748b'}}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            <div style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',fontWeight:700,padding:'12px 12px 4px'}}>
              Sistem
            </div>
            {[
              { id: 'database', icon: 'database', label: 'SQL Bazası' },
              { id: 'content', icon: 'edit_document', label: 'Məzmun (CMS)' },
              { id: 'translations', icon: 'translate', label: 'i18n & Dillər' },
              { id: 'settings', icon: 'settings', label: 'Parametrlər' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`admin-nav-item ${activeTab===tab.id?'active':''}` }>
                <span className="material-symbols-outlined" style={{fontSize:'17px',flexShrink:0,color:activeTab===tab.id?'#b45309':'#64748b'}}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
            {/* Sidebar footer */}
            <div style={{marginTop:'auto',padding:'12px',borderTop:'1px solid #e2e8f0'}}>
              <div style={{fontSize:'11px',color:'#94a3b8',textAlign:'center'}}>v2.0 · Monodoxia Platform</div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="admin-content admin-scroll flex-1 p-6 overflow-y-auto">
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                  <div>
                    <h4 className="admin-section-title">Sistem İcmalı</h4>
                    <p className="admin-section-subtitle">Real vaxt: tələbə aktivliyi, gəlir və məzmun statistikası</p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 12px',background:'#ffffff',border:'1px solid #e2e8f0',borderRadius:'8px',boxShadow:'0 1px 2px rgba(0,0,0,0.03)'}}>
                    <div className="admin-live-dot" />
                    <span style={{fontSize:'11px',color:'#15803d',fontWeight:700}}>Canlı Yeniləmə</span>
                  </div>
                </div>

                {/* Pending Applications Alert */}
                {(() => {
                  const pendingCount = (applicationsList || []).filter(a => a.status === 'Yeni' && !a.archived).length;
                  if (pendingCount === 0) return null;
                  return (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'10px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <span className="material-symbols-outlined" style={{fontSize:'22px',color:'#2563eb'}}>mark_email_unread</span>
                        <div>
                          <strong style={{fontSize:'13px',color:'#1e40af'}}>Gözləyən {pendingCount} yeni müraciət var!</strong>
                          <p style={{fontSize:'11px',color:'#3b82f6',margin:0}}>Kurslar, klublar və ya tədbirlər üçün daxil olmuş yeni müraciətlər administrator təsdiqi gözləyir.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('applications')}
                        style={{padding:'6px 14px',background:'#2563eb',color:'#ffffff',borderRadius:'6px',fontSize:'12px',fontWeight:600,border:'none',cursor:'pointer'}}
                      >
                        Müraciətləri Yoxla
                      </button>
                    </div>
                  );
                })()}

                {/* KPI Cards */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px'}}>
                  {[
                    {label:'Müraciətlər',value:(applicationsList||[]).filter(a=>!a.archived).length,trend:`${(applicationsList||[]).filter(a=>a.status==='Yeni'&&!a.archived).length} yeni daxil olan`,trendColor:'#2563eb',icon:'assignment'},
                    {label:'İstifadəçilər',value:usersList.length,trend:`${usersList.filter(u=>u.status==='Aktiv').length} aktiv hesab`,trendColor:'#15803d',icon:'group'},
                    {label:'Klub Rezidentləri',value:usersList.filter(u=>u.tier&&u.tier!=='Free'&&u.tier!=='Basic').length,trend:'Aktiv rezidentlik',trendColor:'#b45309',icon:'card_membership'},
                    {label:'Ümumi Gəlir',value:`₼ ${(() => {
                      const sum = (applicationsList||[]).reduce((acc, app) => {
                        if (app.payment_status === 'Ödənilib' && app.price) {
                          const num = parseFloat(String(app.price).replace(/[^0-9.]/g, '')) || 0;
                          return acc + num;
                        }
                        return acc;
                      }, 0);
                      return sum.toLocaleString();
                    })()}`,trend:`${(applicationsList||[]).filter(a=>a.payment_status==='Ödənilib').length} təsdiqlənmiş ödəniş`,trendColor:'#b45309',icon:'payments'},
                    {label:'Aktiv Kurslar',value:coursesList.length,trend:`${coursesList.reduce((acc, c) => acc + (c.modules ? c.modules.length : 0), 0)} modul`,trendColor:'#64748b',icon:'school'},
                  ].map((kpi,i) => (
                    <div key={i} className="admin-stat-card">
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span className="admin-stat-label">{kpi.label}</span>
                        <span className="material-symbols-outlined" style={{fontSize:'20px',color:'#b45309'}}>{kpi.icon}</span>
                      </div>
                      <div className="admin-stat-value">{kpi.value}</div>
                      <div style={{fontSize:'11px',color:kpi.trendColor,fontWeight:600,marginTop:'6px'}}>{kpi.trend}</div>
                    </div>
                  ))}
                </div>

                {/* Status + Activity */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                  <div className="admin-card">
                    <div style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,color:'#64748b',marginBottom:'14px'}}>Sistem Statusu</div>
                    {[
                      {label:'Etik Qeyri-Klinik Bildiriş',value:platformSettings.showSafetyBanner?'AKTİV':'DEAKTİV',ok:platformSettings.showSafetyBanner},
                      {label:'Yeni Qeydiyyat Qəbulu',value:'AÇIQ',ok:true},
                      {label:'Texniki Qulluq Rejimi',value:platformSettings.maintenanceMode?'AKTİV':'SÖNDÜRÜLÜB',ok:!platformSettings.maintenanceMode},
                    ].map((row,i) => (
                      <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom: i<2 ? '1px solid #f1f5f9' : 'none'}}>
                        <span style={{fontSize:'12px',color:'#334155'}}>{row.label}</span>
                        <span className={row.ok?'admin-badge-green':'admin-badge-red'}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="admin-card">
                    <div style={{fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,color:'#64748b',marginBottom:'14px'}}>Son Əməliyyatlar</div>
                    {(() => {
                      const logs = [];
                      (applicationsList || []).slice(0, 4).forEach(app => {
                        logs.push({
                          text: `${app.user_name || 'İstifadəçi'}: ${app.target_title} (${app.status})`,
                          time: app.applied_at ? String(app.applied_at).slice(0, 16) : 'Yeni'
                        });
                      });
                      if (logs.length === 0) {
                        logs.push(
                          { text: 'Sistem aktivdir və real müraciətlər üçün hazırdır', time: 'İndi' },
                          { text: 'Məlumat bazası təmizləndi və sinxronlaşdırıldı', time: 'İndi' }
                        );
                      }
                      return logs.map((item,i) => (
                        <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',borderBottom: i < logs.length - 1 ? '1px solid #f1f5f9' : 'none',gap:'12px'}}>
                          <span style={{fontSize:'12px',color:'#334155',flex:1}}>{item.text}</span>
                          <span style={{fontSize:'11px',color:'#64748b',flexShrink:0,fontFamily:'monospace'}}>{item.time}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === 'applications' && <AdminApplicationsTab />}

            {/* REGISTRATIONS TAB */}
            {activeTab === 'registrations' && <AdminRegistrationsTab />}

            {/* 2. USERS & RBAC TAB */}
            {activeTab === 'users' && (
              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                  <div>
                    <h4 className="admin-section-title">İstifadəçilər & RBAC</h4>
                    <p className="admin-section-subtitle">Platforma istifadəçilərini, rolları və giriş icazələrini idarə edin</p>
                  </div>
                  <span className="admin-count-badge">{usersList.length} istifadəçi</span>
                </div>

                {/* Edit User Panel (Active when editingUser !== null) */}
                {editingUser && (
                  <form onSubmit={handleSaveEditUser} className="admin-edit-panel" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:'10px',borderBottom:'1px solid rgba(197,160,89,0.2)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span className="material-symbols-outlined" style={{color:'#b45309',fontSize:'20px'}}>manage_accounts</span>
                        <h5 style={{fontSize:'13px',fontWeight:700,color:'#0f172a',textTransform:'uppercase',letterSpacing:'0.06em',margin:0}}>
                          İstifadəçini Redaktə Et: <span style={{color:'#b45309'}}>"{editingUser.name}"</span>
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="admin-btn-secondary"
                        style={{padding:'4px 10px',fontSize:'11px'}}
                      >
                        Ləğv Et ✕
                      </button>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                      <div>
                        <label className="admin-label">Ad və Soyad</label>
                        <input
                          type="text"
                          required
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Elektron Poçt (Email)</label>
                        <input
                          type="email"
                          required
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Əlaqə Nömrəsi (Telefon)</label>
                        <input
                          type="text"
                          placeholder="+994 50 123 45 67"
                          value={editingUser.phone || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'12px'}}>
                      <div>
                        <label className="admin-label">Rol & Səlahiyyət</label>
                        <select
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                          className="admin-select"
                        >
                          <option>Tələbə</option>
                          <option>Kouç</option>
                          <option>Moderator</option>
                          <option>Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="admin-label">Abunəlik Paketi (Tier)</label>
                        <select
                          value={editingUser.tier}
                          onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value })}
                          className="admin-select"
                        >
                          <option>Free</option>
                          <option>Basic</option>
                          <option>Premium</option>
                          <option>VIP</option>
                        </select>
                      </div>
                      <div>
                        <label className="admin-label">Hesab Statusu</label>
                        <select
                          value={editingUser.status || 'Aktiv'}
                          onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                          className="admin-select"
                        >
                          <option value="Aktiv">Aktiv</option>
                          <option value="Bloklanıb">Bloklanıb</option>
                          <option value="Gözləmədə">Gözləmədə</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Admin Qeydləri</label>
                      <input
                        type="text"
                        placeholder="Xüsusi tələbə qeydi, korporativ müqavilə nömrəsi..."
                        value={editingUser.notes || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, notes: e.target.value })}
                        className="admin-input"
                      />
                    </div>

                    {/* Inline Translations Panel - User */}
                    <InlineTranslator
                      item={editingUser}
                      fields={[
                        { key: 'name', label: 'Ad və Soyad' },
                        { key: 'role', label: 'Rol & Səlahiyyət' },
                        { key: 'tier', label: 'Abunəlik Paketi' },
                        { key: 'notes', label: 'Admin Qeydləri', type: 'textarea' }
                      ]}
                      activeLang={userTransLang}
                      setActiveLang={setUserTransLang}
                      onUpdate={(updates) => setEditingUser({ ...editingUser, ...updates })}
                      isOpen={userTransOpen}
                      setIsOpen={setUserTransOpen}
                    />

                    <div style={{display:'flex',alignItems:'center',gap:'10px',paddingTop:'4px'}}>
                      <button type="submit" className="admin-btn-primary">
                        <span className="material-symbols-outlined" style={{fontSize:'16px'}}>check</span>
                        <span>Dəyişiklikləri Yadda Saxla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="admin-btn-secondary"
                      >
                        Ləğv Et
                      </button>
                    </div>
                  </form>
                )}

                {/* Add User Form */}
                <form onSubmit={handleCreateUser} className="admin-card" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <h5 style={{fontSize:'12px',fontWeight:700,color:'#c5a059',textTransform:'uppercase',letterSpacing:'0.08em',display:'flex',alignItems:'center',gap:'8px',margin:0}}>
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>person_add</span>
                    <span>Yeni İstifadəçi Əlavə Et</span>
                  </h5>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'12px'}}>
                    <div>
                      <label className="admin-label">Ad Soyad</label>
                      <input type="text" required placeholder="Samir Babayev" value={newUserName} onChange={e=>setNewUserName(e.target.value)} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Elektron Poçt</label>
                      <input type="email" required placeholder="samir@example.com" value={newUserEmail} onChange={e=>setNewUserEmail(e.target.value)} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Rol</label>
                      <select value={newUserRole} onChange={e=>setNewUserRole(e.target.value)} className="admin-select">
                        <option>Tələbə</option><option>Kouç</option><option>Moderator</option><option>Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">Abunəlik Paketi (Tier)</label>
                      <select value={newUserTier} onChange={e=>setNewUserTier(e.target.value)} className="admin-select">
                        <option>Free</option><option>Basic</option><option>Premium</option><option>VIP</option>
                      </select>
                    </div>
                  </div>

                  {/* Inline Translations Panel - New User */}
                  <InlineTranslator
                    item={{
                      name: newUserName,
                      role: newUserRole,
                      tier: newUserTier,
                      translations: newUserTranslations
                    }}
                    fields={[
                      { key: 'name', label: 'Ad və Soyad' },
                      { key: 'role', label: 'Rol & Səlahiyyət' },
                      { key: 'tier', label: 'Abunəlik Paketi' }
                    ]}
                    activeLang={newUserTransLang}
                    setActiveLang={setNewUserTransLang}
                    onUpdate={(updates) => {
                      if (updates.translations) {
                        setNewUserTranslations(updates.translations);
                      }
                    }}
                    isOpen={newUserTransOpen}
                    setIsOpen={setNewUserTransOpen}
                  />

                  <div>
                    <button type="submit" className="admin-btn-primary">
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>person_add</span>
                      <span>İstifadəçini Əlavə Et</span>
                    </button>
                  </div>
                </form>

                {/* Search & Filter */}
                <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
                  <div style={{position:'relative',flex:1,maxWidth:'300px'}}>
                    <span className="material-symbols-outlined" style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',fontSize:'16px',color:'#94a3b8'}}>search</span>
                    <input type="text" placeholder="Ad və ya email ilə axtar..." value={userSearch} onChange={e=>setUserSearch(e.target.value)} className="admin-input" style={{paddingLeft:'34px'}} />
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    {['All','Tələbə','Kouç','Moderator','Admin'].map(r=>(
                      <button key={r} onClick={()=>setRoleFilter(r)} style={{padding:'6px 14px',borderRadius:'100px',fontSize:'11px',fontWeight:roleFilter===r?700:500,cursor:'pointer',transition:'all 0.15s ease',border:roleFilter===r?'1px solid #fde68a':'1px solid #cbd5e1',background:roleFilter===r?'#fffbeb':'#ffffff',color:roleFilter===r?'#b45309':'#64748b'}}>
                        {r==='All'?'Hamısı':r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Users Table */}
                <div style={{background:'#ffffff',border:'1px solid #e2e8f0',borderRadius:'10px',overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.03)'}}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>İstifadəçi</th><th>Rol</th><th>Paket</th><th>Status</th><th style={{textAlign:'right'}}>Əməliyyatlar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u=>(
                        <tr key={u.id}>
                          <td>
                            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                              <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,rgba(197,160,89,0.2),rgba(197,160,89,0.08))',border:'1px solid rgba(197,160,89,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#b45309',flexShrink:0}}>
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{fontWeight:600,color:'#0f172a',fontSize:'12px'}}>{u.name}</div>
                                <div style={{fontSize:'11px',color:'#64748b'}}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <select value={u.role} onChange={e=>updateUser(u.id,{role:e.target.value})} className="admin-select" style={{width:'auto',padding:'5px 8px',fontSize:'11px'}}>
                              <option>Tələbə</option><option>Kouç</option><option>Moderator</option><option>Admin</option>
                            </select>
                          </td>
                          <td>
                            <select value={u.tier} onChange={e=>updateUser(u.id,{tier:e.target.value})} className="admin-select" style={{width:'auto',padding:'5px 8px',fontSize:'11px'}}>
                              <option>Free</option><option>Basic</option><option>Premium</option><option>VIP</option>
                            </select>
                          </td>
                          <td>
                            <button onClick={()=>updateUser(u.id,{status:u.status==='Aktiv'?'Bloklanıb':'Aktiv'})} className={u.status==='Aktiv'?'admin-badge-green':'admin-badge-red'} style={{cursor:'pointer',border:'none'}}>{u.status}</button>
                          </td>
                          <td style={{textAlign:'right'}}>
                            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',justifyContent:'flex-end'}}>
                              {coachesList.some(c => c.userId === u.id || c.name === u.name) ? (
                                <span className="admin-badge-gold" style={{padding:'4px 8px',fontSize:'10px',display:'inline-flex',alignItems:'center',gap:'3px'}}>
                                  <span className="material-symbols-outlined" style={{fontSize:'13px'}}>verified</span>
                                  <span>Ekspert</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    addCoach({
                                      userId: u.id,
                                      name: u.name,
                                      title: u.role === 'Kouç' ? 'Sertifikatlı Kouç' : 'Kouç & Ekspert',
                                      experience: '5+ il təcrübə',
                                      bio: `${u.name} — Monodoxia Academy fərdi inkişaf və kouçinq ekspertidir.`,
                                      specialties: ['Fərdi İnkişaf', 'Psixologiya'],
                                      availableSlots: ['Sabah 15:00', 'Cümə 18:00']
                                    });
                                    updateUser(u.id, { role: 'Kouç' });
                                    showToast(`${u.name} Ekspert Heyətinə təyin edildi!`, 'success');
                                  }}
                                  className="admin-btn-secondary"
                                  style={{padding:'4px 8px',fontSize:'11px',display:'inline-flex',alignItems:'center',gap:'4px'}}
                                  title="Ekspert Heyətinə Təyin Et"
                                >
                                  <span className="material-symbols-outlined" style={{fontSize:'14px',color:'#b45309'}}>psychology</span>
                                  <span>Ekspert Təyin Et</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={()=>setEditingUser(u)}
                                className="admin-btn-edit"
                                style={{padding:'5px 10px'}}
                                title="İstifadəçini redaktə et"
                              >
                                <span className="material-symbols-outlined" style={{fontSize:'15px'}}>edit</span>
                                <span>Redaktə</span>
                              </button>
                              <button
                                type="button"
                                onClick={()=>deleteUser(u.id)}
                                className="admin-btn-danger"
                                style={{padding:'5px 8px'}}
                                title="İstifadəçini sil"
                              >
                                <span className="material-symbols-outlined" style={{fontSize:'15px'}}>delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. COURSES & LMS CMS TAB */}
            {activeTab === 'courses' && (
              <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                  <div>
                    <h4 className="admin-section-title">Akademiya və Kursların İdarəedilməsi</h4>
                    <p className="admin-section-subtitle">Yeni kurslar yaradın, redaktə edin, qiymətləri, müəllimləri və tədris planını tənzimləyin</p>
                  </div>
                  <span className="admin-count-badge">
                    Cəmi Kurslar: {coursesList.length}
                  </span>
                </div>

                {/* Edit Course Panel (Active when editingCourse !== null) */}
                {editingCourse && (
                  <form onSubmit={handleSaveEditCourse} className="admin-edit-panel" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:'10px',borderBottom:'1px solid rgba(197,160,89,0.2)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span className="material-symbols-outlined" style={{color:'#b45309',fontSize:'20px'}}>edit_note</span>
                        <h5 style={{fontSize:'13px',fontWeight:700,color:'#0f172a',textTransform:'uppercase',letterSpacing:'0.06em',margin:0}}>
                          Kursu Redaktə Et: <span style={{color:'#b45309'}}>"{editingCourse.title}"</span>
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingCourse(null)}
                        className="admin-btn-secondary"
                        style={{padding:'4px 10px',fontSize:'11px'}}
                      >
                        Ləğv Et ✕
                      </button>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                      <div style={{gridColumn:'span 2'}}>
                        <label className="admin-label">Kursun Başlığı</label>
                        <input
                          type="text"
                          required
                          value={editingCourse.title}
                          onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Qiymət</label>
                        <input
                          type="text"
                          required
                          value={editingCourse.price}
                          onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                          className="admin-input"
                          style={{fontWeight:700,color:'#c5a059',fontFamily:"'Playfair Display',serif"}}
                        />
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'12px'}}>
                      <div>
                        <label className="admin-label">Kateqoriya (Mərkəzləşdirilmiş)</label>
                        <select
                          value={editingCourse.category}
                          onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                          className="admin-select"
                        >
                          {(categoriesList || []).filter(c => c.type === 'course' || c.type === 'all').map(cat => (
                            <option key={cat.key} value={cat.key}>
                              {cat.name} ({cat.key})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="admin-label">Aparıcı Kouç</label>
                        <input
                          type="text"
                          value={editingCourse.instructor}
                          onChange={(e) => setEditingCourse({ ...editingCourse, instructor: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Müddət</label>
                        <input
                          type="text"
                          value={editingCourse.duration}
                          onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Nişan (Badge)</label>
                        <input
                          type="text"
                          value={editingCourse.badge}
                          onChange={(e) => setEditingCourse({ ...editingCourse, badge: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                      <div>
                        <label className="admin-label">Status</label>
                        <select
                          value={editingCourse.status}
                          onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                          className="admin-select"
                        >
                          <option value="Qrup qəbulu aktivdir">Qrup qəbulu aktivdir</option>
                          <option value="Tezliklə başlayır">Tezliklə başlayır</option>
                          <option value="Dərslər davam edir">Dərslər davam edir</option>
                          <option value="Tamamlandı">Tamamlandı</option>
                        </select>
                      </div>
                      <div>
                        <label className="admin-label">Doluluq Faizi (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingCourse.occupancy}
                          onChange={(e) => setEditingCourse({ ...editingCourse, occupancy: Number(e.target.value) })}
                          className="admin-input"
                          style={{fontFamily:'monospace'}}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Təsvir</label>
                      <textarea
                        rows="2"
                        value={editingCourse.description}
                        onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                        className="admin-input"
                        style={{resize:'vertical'}}
                      />
                    </div>

                    {/* Inline Translations Panel - Courses */}
                    <InlineTranslator
                      item={editingCourse}
                      fields={[
                        { key: 'title', label: 'Kursun Adı' },
                        { key: 'description', label: 'Təsvir', type: 'textarea' },
                        { key: 'instructor', label: 'Aparıcı Kouç' },
                        { key: 'duration', label: 'Müddət' },
                        { key: 'price', label: 'Qiymət' },
                        { key: 'badge', label: 'Nişan (Badge)' },
                        { key: 'status', label: 'Status Mətni' }
                      ]}
                      activeLang={courseTransLang}
                      setActiveLang={setCourseTransLang}
                      onUpdate={(updates) => setEditingCourse({ ...editingCourse, ...updates })}
                      isOpen={courseTransOpen}
                      setIsOpen={setCourseTransOpen}
                    />

                    <div style={{display:'flex',alignItems:'center',gap:'10px',paddingTop:'6px'}}>
                      <button type="submit" className="admin-btn-primary">
                        <span className="material-symbols-outlined" style={{fontSize:'16px'}}>check</span>
                        <span>Dəyişiklikləri Yadda Saxla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCourse(null)}
                        className="admin-btn-secondary"
                      >
                        Ləğv Et
                      </button>
                    </div>
                  </form>
                )}

                {/* Add Course Form */}
                <form onSubmit={handleCreateCourse} className="admin-card" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <h5 style={{fontSize:'12px',fontWeight:700,color:'#c5a059',textTransform:'uppercase',letterSpacing:'0.08em',display:'flex',alignItems:'center',gap:'8px',margin:0}}>
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_circle</span>
                    <span>Yeni Kurs Əlavə Et</span>
                  </h5>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                    <div style={{gridColumn:'span 2'}}>
                      <label className="admin-label">Kursun Başlığı</label>
                      <input
                        type="text"
                        required
                        placeholder="məsələn: Daxili Uşaqla Şəfa Təcrübəsi"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Qiymət</label>
                      <input
                        type="text"
                        required
                        placeholder="₼ 390"
                        value={newCoursePrice}
                        onChange={(e) => setNewCoursePrice(e.target.value)}
                        className="admin-input"
                        style={{fontWeight:700,color:'#c5a059'}}
                      />
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'12px'}}>
                    <div>
                      <label className="admin-label">Kateqoriya (Mərkəzləşdirilmiş)</label>
                      <select
                        value={newCourseCategory}
                        onChange={(e) => setNewCourseCategory(e.target.value)}
                        className="admin-select"
                      >
                        {(categoriesList || []).filter(c => c.type === 'course' || c.type === 'all').map(cat => (
                          <option key={cat.key} value={cat.key}>
                            {cat.name} ({cat.key})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">Aparıcı Kouç</label>
                      <input
                        type="text"
                        value={newCourseInstructor}
                        onChange={(e) => setNewCourseInstructor(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Müddət</label>
                      <input
                        type="text"
                        value={newCourseDuration}
                        onChange={(e) => setNewCourseDuration(e.target.value)}
                        placeholder="8 Həftə"
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Nişan (Badge)</label>
                      <input
                        type="text"
                        value={newCourseBadge}
                        onChange={(e) => setNewCourseBadge(e.target.value)}
                        placeholder="AKREDİTASİYALI"
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Təsvir</label>
                    <textarea
                      rows="2"
                      value={newCourseDesc}
                      onChange={(e) => setNewCourseDesc(e.target.value)}
                      placeholder="Kursun məqsədi və qazanılacaq nəticələr..."
                      className="admin-input"
                      style={{resize:'vertical'}}
                    />
                  </div>

                  {/* Inline Translations Panel - New Course */}
                  <InlineTranslator
                    item={{
                      title: newCourseTitle,
                      description: newCourseDesc,
                      instructor: newCourseInstructor,
                      duration: newCourseDuration,
                      category: newCourseCategory,
                      price: newCoursePrice,
                      badge: newCourseBadge,
                      status: 'Qrup qəbulu aktivdir',
                      translations: newCourseTranslations
                    }}
                    fields={[
                      { key: 'title', label: 'Kursun Adı' },
                      { key: 'description', label: 'Təsvir', type: 'textarea' },
                      { key: 'instructor', label: 'Aparıcı Kouç' },
                      { key: 'duration', label: 'Müddət' },
                      { key: 'price', label: 'Qiymət' },
                      { key: 'badge', label: 'Nişan (Badge)' },
                      { key: 'status', label: 'Status Mətni' }
                    ]}
                    activeLang={newCourseTransLang}
                    setActiveLang={setNewCourseTransLang}
                    onUpdate={(updates) => {
                      if (updates.translations) {
                        setNewCourseTranslations(updates.translations);
                      }
                    }}
                    isOpen={newCourseTransOpen}
                    setIsOpen={setNewCourseTransOpen}
                  />

                  <div>
                    <button type="submit" className="admin-btn-primary">
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>add</span>
                      <span>Kursu Dərc Et</span>
                    </button>
                  </div>
                </form>

                {/* Course List Cards */}
                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {coursesList.map(c => (
                    <div key={c.id} className="admin-list-item" style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
                      <div style={{flex:1,minWidth:'280px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px',flexWrap:'wrap'}}>
                          <span className="admin-badge-gold">{c.badge}</span>
                          <span style={{fontSize:'11px',color:'#64748b'}}>{c.duration}</span>
                          <span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'4px',background:'#f1f5f9',color:'#475569',border:'1px solid #e2e8f0'}}>
                            {c.status}
                          </span>
                        </div>
                        <h5 style={{fontSize:'15px',fontWeight:700,fontFamily:"'Playfair Display',serif",color:'#0f172a',margin:'0 0 4px 0'}}>
                          {c.title}
                        </h5>
                        <p style={{fontSize:'12px',color:'#64748b',lineHeight:1.5,margin:'0 0 10px 0',maxWidth:'700px'}}>
                          {c.description}
                        </p>
                        <div style={{display:'flex',alignItems:'center',gap:'16px',fontSize:'11px',color:'#64748b',flexWrap:'wrap'}}>
                          <span>Kouç: <strong style={{color:'#0f172a'}}>{c.instructor}</strong></span>
                          <span>•</span>
                          <span style={{display:'flex',alignItems:'center',gap:'6px'}}>
                            Doluluq: <strong style={{color:'#b45309'}}>{c.occupancy}%</strong>
                            <span style={{display:'inline-block',width:'48px',height:'5px',background:'#e2e8f0',borderRadius:'10px',overflow:'hidden'}}>
                              <span style={{display:'block',height:'100%',width:`${c.occupancy}%`,background:'linear-gradient(90deg,#b45309,#d4af37)',borderRadius:'10px'}} />
                            </span>
                          </span>
                          <span>•</span>
                          <span>Qiymət: <strong style={{color:'#b45309',fontFamily:"'Playfair Display',serif",fontSize:'13px'}}>{c.price}</strong></span>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
                        <button
                          onClick={() => setEditingCourse(c)}
                          className="admin-btn-edit"
                          title="Kursu redaktə et"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>edit</span>
                          <span>Redaktə</span>
                        </button>
                        <button
                          onClick={() => deleteCourse(c.id)}
                          className="admin-btn-danger"
                          title="Sil"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>delete</span>
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORIES & TAXONOMY TAB */}
            {activeTab === 'categories' && <AdminCategoriesTab />}

            {/* 4. CLUB TIERS TAB */}
            {activeTab === 'club' && (
              <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                  <div>
                    <h4 className="admin-section-title">Coaching Club Abunəlik Paketləri</h4>
                    <p className="admin-section-subtitle">Rezidentlik paketlərini yaradın, qiymətləri, ödəniş dövrünü və imtiyazları tənzimləyin</p>
                  </div>
                  <span className="admin-count-badge">
                    Cəmi Paketlər: {clubTiersList.length}
                  </span>
                </div>

                {/* Edit Tier Panel (Active when editingTier !== null) */}
                {editingTier && (
                  <form onSubmit={handleSaveEditClubTier} className="admin-edit-panel" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:'10px',borderBottom:'1px solid rgba(197,160,89,0.2)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span className="material-symbols-outlined" style={{color:'#b45309',fontSize:'20px'}}>card_membership</span>
                        <h5 style={{fontSize:'13px',fontWeight:700,color:'#0f172a',textTransform:'uppercase',letterSpacing:'0.06em',margin:0}}>
                          Paketi Redaktə Et: <span style={{color:'#b45309'}}>"{editingTier.name}"</span>
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingTier(null)}
                        className="admin-btn-secondary"
                        style={{padding:'4px 10px',fontSize:'11px'}}
                      >
                        Ləğv Et ✕
                      </button>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'12px'}}>
                      <div>
                        <label className="admin-label">Paket Adı</label>
                        <input
                          type="text"
                          required
                          value={editingTier.name}
                          onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Məbləğ (₼)</label>
                        <input
                          type="text"
                          required
                          value={editingTier.price}
                          onChange={(e) => setEditingTier({ ...editingTier, price: e.target.value })}
                          className="admin-input"
                          style={{fontWeight:700,color:'#c5a059',fontFamily:"'Playfair Display',serif"}}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Ödəniş Dövrü</label>
                        <select
                          value={editingTier.period}
                          onChange={(e) => setEditingTier({ ...editingTier, period: e.target.value })}
                          className="admin-select"
                        >
                          <option value="/ aylıq">/ aylıq</option>
                          <option value="Ömürlük">Ömürlük (Birbaşa)</option>
                          <option value="/ rüblük">/ rüblük (3 aylıq)</option>
                          <option value="/ illik">/ illik</option>
                        </select>
                      </div>
                    </div>

                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <input
                        type="checkbox"
                        id="editTierPopular"
                        checked={Boolean(editingTier.popular)}
                        onChange={(e) => setEditingTier({ ...editingTier, popular: e.target.checked })}
                        style={{cursor:'pointer',accentColor:'#c5a059',width:'16px',height:'16px'}}
                      />
                      <label htmlFor="editTierPopular" style={{fontSize:'12px',fontWeight:600,color:'#334155',cursor:'pointer'}}>
                        Populyar Paket kimi qeyd et (Landing səhifəsində xüsusi vurğulanır)
                      </label>
                    </div>

                    <div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px'}}>
                        <label className="admin-label">Daxil Olan İmtiyazlar və Özəlliklər</label>
                        <span style={{fontSize:'10px',color:'#506686'}}>Hər sətirdə bir özəllik</span>
                      </div>
                      <textarea
                        rows="4"
                        required
                        value={Array.isArray(editingTier.features) ? editingTier.features.join('\n') : editingTier.features}
                        onChange={(e) => setEditingTier({ ...editingTier, features: e.target.value })}
                        placeholder="Bütün canlı klub tədbirləri&#10;VIP məxfi müzakirə otağı&#10;Kurslara 25% endirim"
                        className="admin-input"
                        style={{fontFamily:'monospace',fontSize:'11px',lineHeight:'1.6'}}
                      />
                    </div>

                    {/* Inline Translations Panel - Club Tiers */}
                    <InlineTranslator
                      item={editingTier}
                      fields={[
                        { key: 'name', label: 'Paketin Adı' },
                        { key: 'price', label: 'Qiymət (mətn / valyuta)' },
                        { key: 'period', label: 'Ödəniş Dövrü (mətn)' },
                        { key: 'features', label: 'İmtiyazlar (sətirbəsətir)', type: 'textarea', isArray: true }
                      ]}
                      activeLang={clubTransLang}
                      setActiveLang={setClubTransLang}
                      onUpdate={(updates) => setEditingTier({ ...editingTier, ...updates })}
                      isOpen={clubTransOpen}
                      setIsOpen={setClubTransOpen}
                    />

                    <div style={{display:'flex',alignItems:'center',gap:'10px',paddingTop:'6px'}}>
                      <button type="submit" className="admin-btn-primary">
                        <span className="material-symbols-outlined" style={{fontSize:'16px'}}>check</span>
                        <span>Dəyişiklikləri Yadda Saxla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTier(null)}
                        className="admin-btn-secondary"
                      >
                        Ləğv Et
                      </button>
                    </div>
                  </form>
                )}

                {/* Add Tier Form */}
                <form onSubmit={handleCreateClubTier} className="admin-card" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <h5 style={{fontSize:'12px',fontWeight:700,color:'#c5a059',textTransform:'uppercase',letterSpacing:'0.08em',display:'flex',alignItems:'center',gap:'8px',margin:0}}>
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_circle</span>
                    <span>Yeni Abunəlik Paketi Əlavə Et</span>
                  </h5>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'12px'}}>
                    <div>
                      <label className="admin-label">Paket Adı</label>
                      <input
                        type="text"
                        required
                        placeholder="məsələn: Mastermind Rezident"
                        value={newTierName}
                        onChange={(e) => setNewTierName(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Məbləğ (₼)</label>
                      <input
                        type="text"
                        required
                        placeholder="məsələn: 65"
                        value={newTierPrice}
                        onChange={(e) => setNewTierPrice(e.target.value)}
                        className="admin-input"
                        style={{fontWeight:700,color:'#c5a059'}}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Ödəniş Dövrü</label>
                      <select
                        value={newTierPeriod}
                        onChange={(e) => setNewTierPeriod(e.target.value)}
                        className="admin-select"
                      >
                        <option value="/ aylıq">/ aylıq</option>
                        <option value="Ömürlük">Ömürlük (Birbaşa)</option>
                        <option value="/ rüblük">/ rüblük (3 aylıq)</option>
                        <option value="/ illik">/ illik</option>
                      </select>
                    </div>
                  </div>

                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    <input
                      type="checkbox"
                      id="newTierPopular"
                      checked={newTierPopular}
                      onChange={(e) => setNewTierPopular(e.target.checked)}
                      style={{cursor:'pointer',accentColor:'#c5a059',width:'16px',height:'16px'}}
                    />
                    <label htmlFor="newTierPopular" style={{fontSize:'12px',fontWeight:600,color:'#334155',cursor:'pointer'}}>
                      Populyar Paket kimi qeyd et
                    </label>
                  </div>

                  <div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px'}}>
                      <label className="admin-label">Daxil Olan İmtiyazlar (Özəlliklər)</label>
                      <span style={{fontSize:'10px',color:'#64748b'}}>Hər sətirdə bir imtiyaz</span>
                    </div>
                    <textarea
                      rows="3"
                      required
                      value={newTierFeatures}
                      onChange={(e) => setNewTierFeatures(e.target.value)}
                      placeholder="Coaching Club eksklüziv platforması&#10;Həftəlik praktiki meditasiyalar&#10;Bütün kurslara 15% endirim"
                      className="admin-input"
                      style={{fontFamily:'monospace',fontSize:'11px'}}
                    />
                  </div>

                  {/* Inline Translations Panel - New Club Tier */}
                  <InlineTranslator
                    item={{
                      name: newTierName,
                      price: newTierPrice,
                      period: newTierPeriod,
                      features: newTierFeatures,
                      translations: newTierTranslations
                    }}
                    fields={[
                      { key: 'name', label: 'Paketin Adı' },
                      { key: 'price', label: 'Qiymət (mətn / valyuta)' },
                      { key: 'period', label: 'Ödəniş Dövrü (mətn)' },
                      { key: 'features', label: 'İmtiyazlar (sətirbəsətir)', type: 'textarea', isArray: true }
                    ]}
                    activeLang={newTierTransLang}
                    setActiveLang={setNewTierTransLang}
                    onUpdate={(updates) => {
                      if (updates.translations) {
                        setNewTierTranslations(updates.translations);
                      }
                    }}
                    isOpen={newTierTransOpen}
                    setIsOpen={setNewTierTransOpen}
                  />

                  <div>
                    <button type="submit" className="admin-btn-primary">
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>add</span>
                      <span>Paketi Yarat və Dərc Et</span>
                    </button>
                  </div>
                </form>

                {/* Club Tiers Grid */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'16px'}}>
                  {clubTiersList.map(t => (
                    <div
                      key={t.id}
                      className={t.popular ? "admin-card-elevated" : "admin-card"}
                      style={{display:'flex',flexDirection:'column',justifyContent:'space-between',gap:'14px',position:'relative'}}
                    >
                      <div>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',marginBottom:'10px'}}>
                          <h5 style={{fontSize:'16px',fontWeight:700,fontFamily:"'Playfair Display',serif",color:'#0f172a',margin:0}}>
                            {t.name}
                          </h5>
                          {t.popular && (
                            <span className="admin-badge-gold">POPULAR</span>
                          )}
                        </div>

                        <div style={{display:'flex',alignItems:'baseline',gap:'8px',padding:'10px 0',borderTop:'1px solid #e2e8f0',borderBottom:'1px solid #e2e8f0',marginBottom:'12px'}}>
                          <span style={{fontSize:'22px',fontWeight:700,fontFamily:"'Playfair Display',serif",color:'#b45309'}}>₼ {t.price}</span>
                          <span style={{fontSize:'12px',color:'#64748b'}}>{t.period}</span>
                        </div>

                        <div>
                          <span style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#64748b',fontWeight:700}}>Daxil olan imtiyazlar:</span>
                          <ul style={{marginTop:'8px',padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:'6px',fontSize:'12px',color:'#334155'}}>
                            {t.features && t.features.map((f, i) => (
                              <li key={i} style={{display:'flex',alignItems:'flex-start',gap:'8px'}}>
                                <span className="material-symbols-outlined" style={{color:'#b45309',fontSize:'15px',flexShrink:0,marginTop:'2px'}}>check_circle</span>
                                <span style={{lineHeight:1.4}}>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'8px',paddingTop:'10px',borderTop:'1px solid #e2e8f0'}}>
                        <button
                          type="button"
                          onClick={() => setEditingTier({
                            ...t,
                            features: Array.isArray(t.features) ? t.features.join('\n') : t.features
                          })}
                          className="admin-btn-edit"
                          title="Paketi redaktə et"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>edit</span>
                          <span>Redaktə</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteClubTier(t.id)}
                          className="admin-btn-danger"
                          title="Paketi sil"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>delete</span>
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. EVENTS TAB */}
            {activeTab === 'events' && (
              <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                  <div>
                    <h4 className="admin-section-title">Tədbirlər və Masterklaslar</h4>
                    <p className="admin-section-subtitle">Canlı vebinarları, seminarları və interaktiv sessiyaları yaradın və redaktə edin</p>
                  </div>
                  <span className="admin-count-badge">
                    Cəmi Tədbirlər: {eventsList.length}
                  </span>
                </div>

                {/* Edit Event Panel (Active when editingEvent !== null) */}
                {editingEvent && (
                  <form onSubmit={handleSaveEditEvent} className="admin-edit-panel" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:'10px',borderBottom:'1px solid rgba(197,160,89,0.2)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span className="material-symbols-outlined" style={{color:'#b45309',fontSize:'20px'}}>edit_calendar</span>
                        <h5 style={{fontSize:'13px',fontWeight:700,color:'#0f172a',textTransform:'uppercase',letterSpacing:'0.06em',margin:0}}>
                          Tədbiri Redaktə Et: <span style={{color:'#b45309'}}>"{editingEvent.title}"</span>
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(null)}
                        className="admin-btn-secondary"
                        style={{padding:'4px 10px',fontSize:'11px'}}
                      >
                        Ləğv Et ✕
                      </button>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                      <div style={{gridColumn:'span 2'}}>
                        <label className="admin-label">Tədbir Başlığı</label>
                        <input
                          type="text"
                          required
                          value={editingEvent.title}
                          onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Format / Növ</label>
                        <select
                          value={editingEvent.typeBadge}
                          onChange={(e) => setEditingEvent({ ...editingEvent, typeBadge: e.target.value })}
                          className="admin-select"
                        >
                          <option value="VEBİNAR">VEBİNAR</option>
                          <option value="MASTERKLAS">MASTERKLAS</option>
                          <option value="CANLI SESSİYA">CANLI SESSİYA</option>
                          <option value="SEMİNAR">SEMİNAR</option>
                          <option value="MEDİTASİYA">MEDİTASİYA</option>
                        </select>
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'12px'}}>
                      <div style={{gridColumn:'span 2'}}>
                        <label className="admin-label">Tarix və Saat</label>
                        <input
                          type="text"
                          required
                          value={editingEvent.datetime}
                          onChange={(e) => setEditingEvent({ ...editingEvent, datetime: e.target.value })}
                          placeholder="məsələn: 18 DEKABR, 20:00"
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Spiker / Aparıcı</label>
                        <input
                          type="text"
                          value={editingEvent.speaker}
                          onChange={(e) => setEditingEvent({ ...editingEvent, speaker: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Maksimum Yer (Limit)</label>
                        <input
                          type="number"
                          value={editingEvent.capacity}
                          onChange={(e) => setEditingEvent({ ...editingEvent, capacity: Number(e.target.value) })}
                          className="admin-input"
                          style={{fontFamily:'monospace'}}
                        />
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'12px'}}>
                      <div>
                        <label className="admin-label">Qeydiyyatlı Sayı</label>
                        <input
                          type="number"
                          value={editingEvent.registered || 0}
                          onChange={(e) => setEditingEvent({ ...editingEvent, registered: Number(e.target.value) })}
                          className="admin-input"
                          style={{fontFamily:'monospace'}}
                        />
                      </div>
                      <div style={{gridColumn:'span 2'}}>
                        <label className="admin-label">Qısa Təsvir</label>
                        <input
                          type="text"
                          value={editingEvent.desc || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, desc: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    {/* Inline Translations Panel - Events */}
                    <InlineTranslator
                      item={editingEvent}
                      fields={[
                        { key: 'title', label: 'Tədbir Başlığı' },
                        { key: 'desc', label: 'Qısa Təsvir', type: 'textarea' },
                        { key: 'speaker', label: 'Spiker' },
                        { key: 'datetime', label: 'Tarix və Saat' },
                        { key: 'typeBadge', label: 'Format / Növ Nişanı' }
                      ]}
                      activeLang={eventTransLang}
                      setActiveLang={setEventTransLang}
                      onUpdate={(updates) => setEditingEvent({ ...editingEvent, ...updates })}
                      isOpen={eventTransOpen}
                      setIsOpen={setEventTransOpen}
                    />

                    <div style={{display:'flex',alignItems:'center',gap:'10px',paddingTop:'6px'}}>
                      <button type="submit" className="admin-btn-primary">
                        <span className="material-symbols-outlined" style={{fontSize:'16px'}}>check</span>
                        <span>Dəyişiklikləri Yadda Saxla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(null)}
                        className="admin-btn-secondary"
                      >
                        Ləğv Et
                      </button>
                    </div>
                  </form>
                )}

                {/* Add Event Form */}
                <form onSubmit={handleCreateEvent} className="admin-card" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <h5 style={{fontSize:'12px',fontWeight:700,color:'#c5a059',textTransform:'uppercase',letterSpacing:'0.08em',display:'flex',alignItems:'center',gap:'8px',margin:0}}>
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_circle</span>
                    <span>Yeni Tədbir Əlavə Et</span>
                  </h5>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                    <div style={{gridColumn:'span 2'}}>
                      <label className="admin-label">Tədbir Başlığı</label>
                      <input
                        type="text"
                        required
                        placeholder="məsələn: Sükut və Daxili Güc Masterklası"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Format / Növ</label>
                      <select
                        value={newEventTypeBadge}
                        onChange={(e) => setNewEventTypeBadge(e.target.value)}
                        className="admin-select"
                      >
                        <option value="VEBİNAR">VEBİNAR</option>
                        <option value="MASTERKLAS">MASTERKLAS</option>
                        <option value="CANLI SESSİYA">CANLI SESSİYA</option>
                        <option value="SEMİNAR">SEMİNAR</option>
                        <option value="MEDİTASİYA">MEDİTASİYA</option>
                      </select>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'12px'}}>
                    <div>
                      <label className="admin-label">Tarix və Saat</label>
                      <input
                        type="text"
                        required
                        placeholder="18 DEKABR, 20:00"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Spiker</label>
                      <input
                        type="text"
                        value={newEventSpeaker}
                        onChange={(e) => setNewEventSpeaker(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Maksimum İştirakçı Limiti</label>
                      <input
                        type="number"
                        value={newEventCapacity}
                        onChange={(e) => setNewEventCapacity(e.target.value)}
                        className="admin-input"
                        style={{fontFamily:'monospace'}}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Qısa Təsvir</label>
                    <textarea
                      rows="2"
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      placeholder="Tədbirin mövzusu, hədəf auditoriyası və praktiki detallar..."
                      className="admin-input"
                      style={{resize:'vertical'}}
                    />
                  </div>

                  {/* Inline Translations Panel - New Event */}
                  <InlineTranslator
                    item={{
                      title: newEventTitle,
                      desc: newEventDesc,
                      speaker: newEventSpeaker,
                      datetime: newEventDate,
                      typeBadge: newEventTypeBadge,
                      translations: newEventTranslations
                    }}
                    fields={[
                      { key: 'title', label: 'Tədbir Başlığı' },
                      { key: 'desc', label: 'Qısa Təsvir', type: 'textarea' },
                      { key: 'speaker', label: 'Spiker' },
                      { key: 'datetime', label: 'Tarix və Saat' },
                      { key: 'typeBadge', label: 'Format / Növ Nişanı' }
                    ]}
                    activeLang={newEventTransLang}
                    setActiveLang={setNewEventTransLang}
                    onUpdate={(updates) => {
                      if (updates.translations) {
                        setNewEventTranslations(updates.translations);
                      }
                    }}
                    isOpen={newEventTransOpen}
                    setIsOpen={setNewEventTransOpen}
                  />

                  <div>
                    <button type="submit" className="admin-btn-primary">
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>add</span>
                      <span>Tədbiri Təqvimə Əlavə Et</span>
                    </button>
                  </div>
                </form>

                {/* Events List */}
                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {eventsList.map(e => (
                    <div key={e.id} className="admin-list-item" style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
                      <div style={{flex:1,minWidth:'280px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px',flexWrap:'wrap'}}>
                          <span className="admin-badge-gold">{e.typeBadge}</span>
                          <span style={{fontSize:'11px',color:'#64748b'}}>{e.datetime}</span>
                          <span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'4px',background:'#f1f5f9',color:'#475569',border:'1px solid #e2e8f0',fontFamily:'monospace'}}>
                            {e.registered || 0} / {e.capacity} İştirakçı
                          </span>
                        </div>
                        <h5 style={{fontSize:'15px',fontWeight:700,fontFamily:"'Playfair Display',serif",color:'#0f172a',margin:'0 0 4px 0'}}>
                          "{e.title}"
                        </h5>
                        {e.desc && <p style={{fontSize:'12px',color:'#64748b',lineHeight:1.5,margin:'0 0 8px 0',maxWidth:'700px'}}>{e.desc}</p>}
                        <div style={{fontSize:'11px',color:'#64748b'}}>
                          Aparıcı / Spiker: <strong style={{color:'#0f172a'}}>{e.speaker}</strong>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
                        <button
                          onClick={() => setEditingEvent(e)}
                          className="admin-btn-edit"
                          title="Tədbiri redaktə et"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>edit</span>
                          <span>Redaktə</span>
                        </button>
                        <button
                          onClick={() => deleteEvent(e.id)}
                          className="admin-btn-danger"
                          title="Sil"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>delete</span>
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. COMMUNITY & MODERATION TAB */}
            {activeTab === 'community' && (
              <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                  <div>
                    <h4 className="admin-section-title">İcma Forumu və Məzmun Moderasiyası</h4>
                    <p className="admin-section-subtitle">Yeni icma müzakirələri yaradın, mövcud mövzuları redaktə edin, sabitləyin və ya silin</p>
                  </div>
                  <span className="admin-count-badge">
                    Cəmi Mövzular: {communityTopics.length}
                  </span>
                </div>

                {/* Edit Topic Panel (Active when editingTopic !== null) */}
                {editingTopic && (
                  <form onSubmit={handleSaveEditTopic} className="admin-edit-panel" style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:'10px',borderBottom:'1px solid rgba(197,160,89,0.2)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span className="material-symbols-outlined" style={{color:'#b45309',fontSize:'20px'}}>edit_document</span>
                        <h5 style={{fontSize:'13px',fontWeight:700,color:'#0f172a',textTransform:'uppercase',letterSpacing:'0.06em',margin:0}}>
                          İcma Mövzusunu Redaktə Et: <span style={{color:'#b45309'}}>"{editingTopic.title}"</span>
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingTopic(null)}
                        className="admin-btn-secondary"
                        style={{padding:'4px 10px',fontSize:'11px'}}
                      >
                        Ləğv Et ✕
                      </button>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                      <div style={{gridColumn:'span 2'}}>
                        <label className="admin-label">Mövzu Başlığı</label>
                        <input
                          type="text"
                          required
                          value={editingTopic.title}
                          onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Bölmə / Nişan</label>
                        <select
                          value={editingTopic.badge}
                          onChange={(e) => setEditingTopic({ ...editingTopic, badge: e.target.value })}
                          className="admin-select"
                        >
                          <option value="İcma Müzakirəsi">İcma Müzakirəsi</option>
                          <option value="Sual-Cavab">Sual-Cavab</option>
                          <option value="Təcrübə Bölüşümü">Təcrübə Bölüşümü</option>
                          <option value="Rəsmi Elan">Rəsmi Elan</option>
                          <option value="Kitab Klubu">Kitab Klubu</option>
                          <option value="📌 Sabitlənmiş Müzakirə">📌 Sabitlənmiş Müzakirə</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Müəllif</label>
                      <input
                        type="text"
                        value={editingTopic.author}
                        onChange={(e) => setEditingTopic({ ...editingTopic, author: e.target.value })}
                        className="admin-input"
                      />
                    </div>

                    <div>
                      <label className="admin-label">Mövzu Mətni / Məzmun</label>
                      <textarea
                        rows="3"
                        required
                        value={editingTopic.snippet}
                        onChange={(e) => setEditingTopic({ ...editingTopic, snippet: e.target.value })}
                        className="admin-input"
                        style={{resize:'vertical'}}
                      />
                    </div>

                    {/* Inline Translations Panel - Community */}
                    <InlineTranslator
                      item={editingTopic}
                      fields={[
                        { key: 'title', label: 'Mövzu Başlığı' },
                        { key: 'snippet', label: 'Məzmun', type: 'textarea' },
                        { key: 'badge', label: 'Bölmə / Nişan' },
                        { key: 'author', label: 'Müəllif' }
                      ]}
                      activeLang={communityTransLang}
                      setActiveLang={setCommunityTransLang}
                      onUpdate={(updates) => setEditingTopic({ ...editingTopic, ...updates })}
                      isOpen={communityTransOpen}
                      setIsOpen={setCommunityTransOpen}
                    />

                    <div style={{display:'flex',alignItems:'center',gap:'10px',paddingTop:'6px'}}>
                      <button type="submit" className="admin-btn-primary">
                        <span className="material-symbols-outlined" style={{fontSize:'16px'}}>check</span>
                        <span>Dəyişiklikləri Yadda Saxla</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTopic(null)}
                        className="admin-btn-secondary"
                      >
                        Ləğv Et
                      </button>
                    </div>
                  </form>
                )}

                {/* Add Topic Form */}
                <form onSubmit={handleCreateTopic} className="admin-card" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                  <h5 style={{fontSize:'12px',fontWeight:700,color:'#c5a059',textTransform:'uppercase',letterSpacing:'0.08em',display:'flex',alignItems:'center',gap:'8px',margin:0}}>
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>add_circle</span>
                    <span>Yeni İcma Mövzusu Əlavə Et</span>
                  </h5>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px'}}>
                    <div style={{gridColumn:'span 2'}}>
                      <label className="admin-label">Mövzu Başlığı</label>
                      <input
                        type="text"
                        required
                        placeholder="məsələn: Həyəcan və narahatlığı dəf etməkdə ən faydalı metodunuz nədir?"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Bölmə / Kateqoriya</label>
                      <select
                        value={newTopicCategory}
                        onChange={(e) => setNewTopicCategory(e.target.value)}
                        className="admin-select"
                      >
                        {(categoriesList || []).filter(c => c.type === 'community' || c.type === 'all').map(cat => (
                          <option key={cat.key} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Müəllif</label>
                    <input
                      type="text"
                      value={newTopicAuthor}
                      onChange={(e) => setNewTopicAuthor(e.target.value)}
                      placeholder="Monodoxia Komandası"
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Məzmun</label>
                    <textarea
                      rows="2"
                      required
                      value={newTopicContent}
                      onChange={(e) => setNewTopicContent(e.target.value)}
                      placeholder="Müzakirəyə başlamaq üçün sualınızı və ya fikrinizi təfərrüatlı qeyd edin..."
                      className="admin-input"
                      style={{resize:'vertical'}}
                    />
                  </div>

                  {/* Inline Translations Panel - New Topic */}
                  <InlineTranslator
                    item={{
                      title: newTopicTitle,
                      snippet: newTopicContent,
                      badge: newTopicCategory,
                      author: newTopicAuthor,
                      translations: newTopicTranslations
                    }}
                    fields={[
                      { key: 'title', label: 'Mövzu Başlığı' },
                      { key: 'snippet', label: 'Məzmun', type: 'textarea' },
                      { key: 'badge', label: 'Bölmə / Nişan' },
                      { key: 'author', label: 'Müəllif' }
                    ]}
                    activeLang={newTopicTransLang}
                    setActiveLang={setNewTopicTransLang}
                    onUpdate={(updates) => {
                      if (updates.translations) {
                        setNewTopicTranslations(updates.translations);
                      }
                    }}
                    isOpen={newTopicTransOpen}
                    setIsOpen={setNewTopicTransOpen}
                  />

                  <div>
                    <button type="submit" className="admin-btn-primary">
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>add</span>
                      <span>Mövzunu İcmada Dərc Et</span>
                    </button>
                  </div>
                </form>

                {/* Community Topics List */}
                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {communityTopics.map(t => (
                    <div key={t.id} className="admin-list-item" style={{display:'flex',flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
                      <div style={{flex:1,minWidth:'280px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px',flexWrap:'wrap'}}>
                          <span className="admin-badge-gold">{t.badge}</span>
                          <span style={{fontSize:'11px',color:'#64748b'}}>• {t.time}</span>
                        </div>
                        <h5 style={{fontSize:'15px',fontWeight:700,fontFamily:"'Playfair Display',serif",color:'#0f172a',margin:'0 0 4px 0'}}>
                          "{t.title}"
                        </h5>
                        <p style={{fontSize:'12px',color:'#64748b',lineHeight:1.5,margin:'0 0 8px 0',maxWidth:'700px'}}>{t.snippet}</p>
                        <div style={{display:'flex',alignItems:'center',gap:'12px',fontSize:'11px',color:'#64748b'}}>
                          <span>Müəllif: <strong style={{color:'#0f172a'}}>{t.author}</strong></span>
                          <span>•</span>
                          <span>Bəyənmələr: <strong style={{color:'#b45309'}}>{t.likes}</strong></span>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
                        <button
                          onClick={() => setEditingTopic(t)}
                          className="admin-btn-edit"
                          title="Mövzunu redaktə et"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>edit</span>
                          <span>Redaktə</span>
                        </button>
                        <button
                          onClick={() => pinTopic(t.id)}
                          className="admin-btn-secondary"
                          style={{padding:'7px 11px',fontSize:'11px',color:'#c5a059'}}
                          title="Sabitlə"
                        >
                          📌 Sabitlə
                        </button>
                        <button
                          onClick={() => deleteTopic(t.id)}
                          className="admin-btn-danger"
                          title="Sil"
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'15px'}}>delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6.5. DATABASE TAB (HOSTING SQL CONNECTION) */}
            {activeTab === 'database' && (
              <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                  <div>
                    <h4 className="admin-section-title">Hosting SQL Verilənlər Bazası Əlaqəsi</h4>
                    <p className="admin-section-subtitle">
                      cPanel, DirectAdmin, Plesk, VPS və ya bulud hostingdə (AWS RDS / Supabase / DigitalOcean) yaradılmış SQL bazasının bağlantı parametrlərini tənzimləyin
                    </p>
                  </div>
                  <span className="admin-count-badge">
                    MySQL 8.0+ Enterprise
                  </span>
                </div>

                {/* Connection Health Status Banner */}
                <div className="admin-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                    <div className="admin-live-dot" style={{width:'10px',height:'10px'}} />
                    <div>
                      <div style={{fontSize:'13px',fontWeight:700,color:'#0f172a',display:'flex',alignItems:'center',gap:'8px'}}>
                        <span>Status: <strong style={{color:'#15803d'}}>{sqlConfig.status}</strong></span>
                        <span className="admin-badge-gold">
                          {dbForm.engine.split(' ')[0]} 8.0+
                        </span>
                      </div>
                      <div style={{fontSize:'11px',color:'#64748b',marginTop:'2px'}}>
                        Server: <strong style={{color:'#0f172a',fontFamily:'monospace'}}>{dbForm.host}:{dbForm.port}</strong> • Baza: <strong style={{color:'#0f172a',fontFamily:'monospace'}}>{dbForm.database}</strong> • Son yoxlama: {sqlConfig.lastTested}
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    <button
                      type="button"
                      onClick={() => testSqlConnection()}
                      className="admin-btn-secondary"
                      style={{display:'flex',alignItems:'center',gap:'6px'}}
                    >
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>sync</span>
                      <span>Bağlantını Sına (Ping)</span>
                    </button>
                    <button
                      type="button"
                      disabled={isMigrating}
                      onClick={async () => {
                        setIsMigrating(true);
                        await migrateDatabaseTables();
                        setIsMigrating(false);
                      }}
                      className="admin-btn-primary"
                      style={{display:'flex',alignItems:'center',gap:'6px',opacity:isMigrating?0.7:1}}
                    >
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>database</span>
                      <span>{isMigrating ? 'Miqrasiya edilir...' : 'Cədvəlləri Miqrasiya Et'}</span>
                    </button>
                  </div>
                </div>

                {/* Configuration Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateSqlConfig(dbForm);
                  }}
                  style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'780px'}}
                >
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:'14px'}}>
                    <div>
                      <label className="admin-label">Verilənlər Bazası Mühərriki (RDBMS)</label>
                      <select
                        value={dbForm.engine}
                        onChange={(e) => setDbForm({ ...dbForm, engine: e.target.value })}
                        className="admin-select"
                      >
                        <option value="MySQL / MariaDB (cPanel / DirectAdmin / Plesk)">MySQL / MariaDB (Standart cPanel / Plesk)</option>
                        <option value="PostgreSQL (Supabase / AWS RDS / Neon)">PostgreSQL (Supabase / AWS RDS)</option>
                        <option value="Microsoft SQL Server (MSSQL)">Microsoft SQL Server (MSSQL)</option>
                        <option value="SQLite 3 (Lokal Embedded)">SQLite 3 (Lokal fayl)</option>
                      </select>
                    </div>

                    <div>
                      <label className="admin-label">Cədvəl Prefiksi (Table Prefix)</label>
                      <input
                        type="text"
                        value={dbForm.tablePrefix}
                        onChange={(e) => setDbForm({ ...dbForm, tablePrefix: e.target.value })}
                        placeholder="mdx_"
                        className="admin-input"
                        style={{fontFamily:'monospace'}}
                      />
                    </div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'14px'}}>
                    <div style={{gridColumn:'span 2'}}>
                      <label className="admin-label">SQL Server Host / IP Ünvanı</label>
                      <input
                        type="text"
                        required
                        value={dbForm.host}
                        onChange={(e) => setDbForm({ ...dbForm, host: e.target.value })}
                        placeholder="localhost və ya sql.hosting.com"
                        className="admin-input"
                        style={{fontFamily:'monospace'}}
                      />
                      <span style={{fontSize:'10px',color:'#506686',marginTop:'4px',display:'block'}}>
                        Əksər hostinglərdə: <code style={{color:'#c5a059'}}>localhost</code> və ya <code style={{color:'#c5a059'}}>127.0.0.1</code>
                      </span>
                    </div>

                    <div>
                      <label className="admin-label">Port</label>
                      <input
                        type="text"
                        required
                        value={dbForm.port}
                        onChange={(e) => setDbForm({ ...dbForm, port: e.target.value })}
                        placeholder="3306"
                        className="admin-input"
                        style={{fontFamily:'monospace'}}
                      />
                    </div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:'14px'}}>
                    <div>
                      <label className="admin-label">Verilənlər Bazasının Adı (Database Name)</label>
                      <input
                        type="text"
                        required
                        value={dbForm.database}
                        onChange={(e) => setDbForm({ ...dbForm, database: e.target.value })}
                        placeholder="monodoxi_academy_db"
                        className="admin-input"
                        style={{fontFamily:'monospace'}}
                      />
                    </div>

                    <div>
                      <label className="admin-label">İstifadəçi Adı (DB Username)</label>
                      <input
                        type="text"
                        required
                        value={dbForm.username}
                        onChange={(e) => setDbForm({ ...dbForm, username: e.target.value })}
                        placeholder="monodoxi_user"
                        className="admin-input"
                        style={{fontFamily:'monospace'}}
                      />
                    </div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:'14px'}}>
                    <div>
                      <label className="admin-label">Baza İstifadəçi Şifrəsi (Password)</label>
                      <div style={{position:'relative'}}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={dbForm.password}
                          onChange={(e) => setDbForm({ ...dbForm, password: e.target.value })}
                          placeholder="DB Şifrəsi"
                          className="admin-input"
                          style={{paddingRight:'36px',fontFamily:'monospace'}}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#506686',cursor:'pointer'}}
                        >
                          <span className="material-symbols-outlined" style={{fontSize:'16px'}}>
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Şrift Kodlaşdırması (Charset / Collation)</label>
                      <select
                        value={dbForm.charset}
                        onChange={(e) => setDbForm({ ...dbForm, charset: e.target.value })}
                        className="admin-select"
                      >
                        <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci (Tövsiyə olunan, tam UTF-8)</option>
                        <option value="utf8mb4_general_ci">utf8mb4_general_ci</option>
                        <option value="utf8_general_ci">utf8_general_ci</option>
                      </select>
                    </div>
                  </div>

                  {/* Advanced Settings: SSL & Pool */}
                  <div className="admin-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
                    <div>
                      <div style={{fontSize:'12px',fontWeight:600,color:'#0f172a'}}>Təhlükəsiz SSL / TLS Şifrələməsi</div>
                      <div style={{fontSize:'11px',color:'#64748b',marginTop:'2px'}}>Uzaq serverlər və bulud bazaları (AWS / DigitalOcean / Supabase) üçün tövsiyə edilir</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={dbForm.ssl}
                      onChange={(e) => setDbForm({ ...dbForm, ssl: e.target.checked })}
                      style={{accentColor:'#c5a059',width:'16px',height:'16px',cursor:'pointer'}}
                    />
                  </div>

                  {/* Connection String Preview */}
                  <div className="admin-code-block">
                    <span style={{color:'#b45309',fontWeight:700,userSelect:'none'}}>.env / DATABASE_URL: </span>
                    <span>
                      mysql://{dbForm.username || 'user'}:{dbForm.password ? '••••••••' : ''}@{dbForm.host || 'localhost'}:{dbForm.port || '3306'}/{dbForm.database || 'db'}?ssl={dbForm.ssl ? 'true' : 'false'}&charset={dbForm.charset}
                    </span>
                  </div>

                  <div style={{display:'flex',alignItems:'center',gap:'12px',paddingTop:'4px'}}>
                    <button type="submit" className="admin-btn-primary">
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>save</span>
                      <span>SQL Konfiqurasiyasını Yadda Saxla</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const dateStr = new Date().toISOString().split('T')[0];
                        let sql = `-- Monodoxia Academy Database Backup (${dateStr})\n-- Server: ${dbForm.host} | DB: ${dbForm.database}\n\nSET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSTART TRANSACTION;\n\n`;
                        usersList.forEach(u => {
                          sql += `INSERT INTO mdx_users (id, name, email, role, tier, status, joined_date) VALUES ('${u.id}', '${(u.name || '').replace(/'/g, "''")}', '${u.email}', '${u.role || 'Tələbə'}', '${u.tier || 'Free'}', '${u.status || 'Aktiv'}', '${u.joinedDate || dateStr}') ON DUPLICATE KEY UPDATE name=VALUES(name);\n`;
                        });
                        coursesList.forEach(c => {
                          sql += `INSERT INTO mdx_courses (id, category, badge, duration, title, description, instructor, instructor_role, status, occupancy, price) VALUES ('${c.id}', '${c.category}', '${(c.badge||'').replace(/'/g, "''")}', '${c.duration}', '${(c.title||'').replace(/'/g, "''")}', '${(c.description||'').replace(/'/g, "''")}', '${(c.instructor||'').replace(/'/g, "''")}', '${(c.instructorRole||'').replace(/'/g, "''")}', '${c.status}', ${c.occupancy||0}, '${c.price}') ON DUPLICATE KEY UPDATE title=VALUES(title);\n`;
                        });
                        (applicationsList || []).forEach(a => {
                          sql += `INSERT INTO mdx_applications (id, user_id, user_name, user_email, user_phone, target_type, target_id, target_title, status, payment_status, attendance_status, price, applied_at) VALUES ('${a.id}', '${a.userId}', '${(a.userName||'').replace(/'/g, "''")}', '${a.userEmail}', '${a.userPhone||''}', '${a.targetType}', '${a.targetId}', '${(a.targetTitle||'').replace(/'/g, "''")}', '${a.status}', '${a.paymentStatus}', '${a.attendanceStatus}', '${a.price}', '${a.appliedAt||dateStr}') ON DUPLICATE KEY UPDATE status=VALUES(status);\n`;
                        });
                        sql += `\nCOMMIT;\n`;
                        const blob = new Blob([sql], { type: 'application/sql;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `monodoxia_backup_${dateStr}.sql`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast('SQL Backup faylı uğurla endirildi (monodoxia_backup.sql)', 'success');
                      }}
                      className="admin-btn-secondary"
                    >
                      <span className="material-symbols-outlined" style={{fontSize:'16px'}}>download</span>
                      <span>SQL Backup İxrac Et</span>
                    </button>
                  </div>
                </form>

                {/* Database Tables Overview */}
                <div style={{paddingTop:'16px',borderTop:'1px solid #e2e8f0',display:'flex',flexDirection:'column',gap:'12px'}}>
                  <h5 style={{fontSize:'13px',fontWeight:700,color:'#b45309',textTransform:'uppercase',letterSpacing:'0.06em',margin:0}}>
                    Aktiv SQL Cədvəllər Sxemi (InnoDB Engine)
                  </h5>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:'10px'}}>
                    {[
                      { name: `${dbForm.tablePrefix}users`, count: `${usersList.length} sətir`, desc: 'Tələbələr, rollar, icazələr' },
                      { name: `${dbForm.tablePrefix}courses`, count: `${coursesList.length} sətir`, desc: 'Akademiya kursları, qiymətlər' },
                      { name: `${dbForm.tablePrefix}applications`, count: `${(applicationsList || []).length} sətir`, desc: 'Kurs və tədbir müraciətləri' },
                      { name: `${dbForm.tablePrefix}form_fields`, count: `${(formFieldsList || []).length} sətir`, desc: 'Dinamik müraciət sahələri' },
                      { name: `${dbForm.tablePrefix}notifications`, count: `${(userNotifications || []).length} sətir`, desc: 'Sistem bildirişləri' },
                      { name: `${dbForm.tablePrefix}club_tiers`, count: `${clubTiersList.length} sətir`, desc: 'Rezidentlik paketləri' },
                      { name: `${dbForm.tablePrefix}events`, count: `${eventsList.length} sətir`, desc: 'Vebinarlar və qeydiyyatlar' },
                      { name: `${dbForm.tablePrefix}community_posts`, count: `${communityTopics.length} sətir`, desc: 'İcma mövzuları və şərhlər' },
                    ].map(table => (
                      <div key={table.name} className="admin-card" style={{padding:'10px 12px'}}>
                        <div style={{fontFamily:'monospace',fontWeight:700,color:'#0f172a',display:'flex',alignItems:'center',gap:'6px',fontSize:'11px'}}>
                          <span className="material-symbols-outlined" style={{color:'#b45309',fontSize:'14px'}}>table_rows</span>
                          <span>{table.name}</span>
                        </div>
                        <div style={{fontSize:'10px',color:'#b45309',fontWeight:700,marginTop:'4px'}}>{table.count}</div>
                        <div style={{fontSize:'10px',color:'#64748b',marginTop:'2px'}}>{table.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                <div>
                  <h4 className="admin-section-title">Qlobal Platforma Parametrləri</h4>
                  <p className="admin-section-subtitle">Platforma adı, etik bildiriş, valyuta və texniki qulluq rejimini idarə edin</p>
                </div>

                <form onSubmit={handleSaveSettings} style={{display:'flex',flexDirection:'column',gap:'16px',maxWidth:'680px'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                    <div>
                      <label className="admin-label">Platformanın Rəsmi Başlığı</label>
                      <input type="text" value={settingsForm.siteTitle} onChange={e=>setSettingsForm({...settingsForm,siteTitle:e.target.value})} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Alt Şüar / Slogan</label>
                      <input type="text" value={settingsForm.subtitle} onChange={e=>setSettingsForm({...settingsForm,subtitle:e.target.value})} className="admin-input" />
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
                    <div>
                      <label className="admin-label">Əsas Valyuta</label>
                      <input type="text" value={settingsForm.currency} onChange={e=>setSettingsForm({...settingsForm,currency:e.target.value})} className="admin-input" />
                    </div>
                    <div>
                      <label className="admin-label">Standart Dil</label>
                      <select value={settingsForm.defaultLang} onChange={e=>setSettingsForm({...settingsForm,defaultLang:e.target.value})} className="admin-select">
                        {(supportedLangs||[]).map(l=>(<option key={l.code} value={l.code}>{l.flag} {l.name} ({l.code.toUpperCase()})</option>))}
                      </select>
                    </div>
                  </div>

                  {/* Safety Banner */}
                  <div className="admin-card">
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span className="material-symbols-outlined" style={{fontSize:'18px',color:'#b45309'}}>verified_user</span>
                        <span style={{fontSize:'12px',fontWeight:600,color:'#0f172a'}}>Psixoloji Qeyri-Klinik Etik Bildiriş Paneli</span>
                      </div>
                      <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
                        <input type="checkbox" checked={settingsForm.showSafetyBanner} onChange={e=>setSettingsForm({...settingsForm,showSafetyBanner:e.target.checked})} style={{accentColor:'#c5a059',width:'14px',height:'14px'}} />
                        <span style={{fontSize:'11px',color:settingsForm.showSafetyBanner?'#15803d':'#dc2626',fontWeight:700}}>{settingsForm.showSafetyBanner?'AKTİV':'DEAKTİV'}</span>
                      </label>
                    </div>
                    <label className="admin-label">Bildiriş Mətni</label>
                    <textarea rows={3} value={settingsForm.safetyText} onChange={e=>setSettingsForm({...settingsForm,safetyText:e.target.value})} className="admin-input" style={{resize:'vertical',minHeight:'70px'}} />
                  </div>

                  {/* Maintenance Mode */}
                  <div className="admin-card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
                    <div>
                      <div style={{fontSize:'12px',fontWeight:600,color:'#0f172a'}}>Texniki Qulluq Rejimi</div>
                      <div style={{fontSize:'11px',color:'#64748b',marginTop:'2px'}}>Aktiv edildikdə ziyarətçilərə texniki yenilənmə bildirişi göstərilir</div>
                    </div>
                    <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',flexShrink:0}}>
                      <input type="checkbox" checked={settingsForm.maintenanceMode} onChange={e=>setSettingsForm({...settingsForm,maintenanceMode:e.target.checked})} style={{accentColor:'#c5a059',width:'16px',height:'16px'}} />
                      <span style={{fontSize:'11px',color:settingsForm.maintenanceMode?'#b45309':'#64748b',fontWeight:700}}>{settingsForm.maintenanceMode?'AKTİV':'SÖNDÜRÜLÜB'}</span>
                    </label>
                  </div>

                  {/* Maintenance Mode Screen Content & Translations */}
                  <div className="admin-card" style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e2e8f0',paddingBottom:'10px'}}>
                      <div>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#0f172a',display:'flex',alignItems:'center',gap:'6px'}}>
                          <span className="material-symbols-outlined" style={{fontSize:'16px',color:'#b45309'}}>edit_note</span>
                          Texniki Qulluq Ekranı Mətnləri və Tərcümələri
                        </div>
                        <div style={{fontSize:'11px',color:'#64748b',marginTop:'2px'}}>
                          Texniki qulluq zamanı ziyarətçilərə görünəcək başlıq, açıqlama və status mətnlərini dillər üzrə redaktə edin
                        </div>
                      </div>
                    </div>

                    {/* Language Selector Tabs */}
                    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                      {[
                        { code: 'az', label: '🇦🇿 Azərbaycan (AZ)' },
                        { code: 'en', label: '🇬🇧 English (EN)' },
                        { code: 'ru', label: '🇷🇺 Русский (RU)' },
                        { code: 'tr', label: '🇹🇷 Türkçe (TR)' }
                      ].map(l => {
                        const isCur = maintTransLang === l.code;
                        return (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => setMaintTransLang(l.code)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: isCur ? '1px solid #c5a059' : '1px solid #e2e8f0',
                              background: isCur ? '#fffbeb' : '#ffffff',
                              color: isCur ? '#b45309' : '#64748b',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {l.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Current Lang Input Fields */}
                    <div style={{display:'flex',flexDirection:'column',gap:'12px',background:'#f8fafc',padding:'14px',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                      <div>
                        <label className="admin-label" style={{fontSize:'11px',fontWeight:600}}>
                          Ekran Başlığı ({maintTransLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={
                            maintTransLang === 'az'
                              ? (settingsForm.maintenanceTranslations?.az?.title || settingsForm.maintenanceTitle || '')
                              : (settingsForm.maintenanceTranslations?.[maintTransLang]?.title || '')
                          }
                          onChange={e => {
                            const val = e.target.value;
                            const curTrans = { ...(settingsForm.maintenanceTranslations || {}) };
                            curTrans[maintTransLang] = { ...(curTrans[maintTransLang] || {}), title: val };
                            setSettingsForm({
                              ...settingsForm,
                              ...(maintTransLang === 'az' ? { maintenanceTitle: val } : {}),
                              maintenanceTranslations: curTrans
                            });
                          }}
                          className="admin-input"
                          placeholder="Məs: Planlaşdırılmış Texniki Təkmilləşdirmə"
                        />
                      </div>

                      <div>
                        <label className="admin-label" style={{fontSize:'11px',fontWeight:600}}>
                          Açıqlama Mətni ({maintTransLang.toUpperCase()})
                        </label>
                        <textarea
                          rows={3}
                          value={
                            maintTransLang === 'az'
                              ? (settingsForm.maintenanceTranslations?.az?.desc || settingsForm.maintenanceDesc || '')
                              : (settingsForm.maintenanceTranslations?.[maintTransLang]?.desc || '')
                          }
                          onChange={e => {
                            const val = e.target.value;
                            const curTrans = { ...(settingsForm.maintenanceTranslations || {}) };
                            curTrans[maintTransLang] = { ...(curTrans[maintTransLang] || {}), desc: val };
                            setSettingsForm({
                              ...settingsForm,
                              ...(maintTransLang === 'az' ? { maintenanceDesc: val } : {}),
                              maintenanceTranslations: curTrans
                            });
                          }}
                          className="admin-input"
                          style={{resize:'vertical',minHeight:'75px'}}
                          placeholder="Ziyarətçilərə göstəriləcək ətraflı məlumat..."
                        />
                      </div>

                      <div>
                        <label className="admin-label" style={{fontSize:'11px',fontWeight:600}}>
                          Müddət / Status Qeydi ({maintTransLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={
                            maintTransLang === 'az'
                              ? (settingsForm.maintenanceTranslations?.az?.notice || settingsForm.maintenanceNotice || '')
                              : (settingsForm.maintenanceTranslations?.[maintTransLang]?.notice || '')
                          }
                          onChange={e => {
                            const val = e.target.value;
                            const curTrans = { ...(settingsForm.maintenanceTranslations || {}) };
                            curTrans[maintTransLang] = { ...(curTrans[maintTransLang] || {}), notice: val };
                            setSettingsForm({
                              ...settingsForm,
                              ...(maintTransLang === 'az' ? { maintenanceNotice: val } : {}),
                              maintenanceTranslations: curTrans
                            });
                          }}
                          className="admin-input"
                          placeholder="Məs: Tezliklə Aktiv"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <button type="submit" className="admin-btn-primary">
                      <span className="material-symbols-outlined" style={{fontSize:'15px'}}>save</span>
                      Dəyişiklikləri Yadda Saxla
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* CMS TAB */}
            {activeTab === 'content' && (() => {
              const cmsBlocks = [
                { id: 'navbar', label: 'Loqo & Naviqasiya' },
                { id: 'hero', label: 'Hero Bölməsi' },
                { id: 'about', label: 'Haqqımızda' },
                { id: 'areas', label: 'Sahələr' },
                { id: 'academy', label: 'Akademiya' },
                { id: 'club', label: 'Klub' },
                { id: 'coaches', label: 'Koçlar' },
                { id: 'community', label: 'İcma' },
                { id: 'testimonials', label: 'Rəylər' },
                { id: 'faq', label: 'Tez-tez soruşulan suallar' },
                { id: 'newsletter', label: 'Bülletenə abunəlik' },
                { id: 'footer', label: 'Footer & Loqo' },
              ];

              const Field = ({ label, value, onChange, multiline }) => (
                <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                  <label className="admin-label">{label}</label>
                  {multiline
                    ? <textarea rows="3" value={value || ''} onChange={e => onChange(e.target.value)}
                        className="admin-input" style={{resize:'vertical'}} />
                    : <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
                        className="admin-input" />
                  }
                </div>
              );

              const ImageField = ({ label, value, onChange }) => {
                const handleFileChange = (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    showToast('Şəkil ölçüsü 5MB-dan çox ola bilməz', 'error');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onChange(event.target.result);
                    showToast('Şəkil uğurla yükləndi!', 'success');
                  };
                  reader.readAsDataURL(file);
                };

                return (
                  <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                    <label className="admin-label">{label}</label>
                    <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                      <div style={{display:'flex',gap:'8px'}}>
                        <input
                          type="text"
                          placeholder="URL daxil edin və ya fayl seçin..."
                          value={value || ''}
                          onChange={e => onChange(e.target.value)}
                          className="admin-input"
                          style={{flex:1}}
                        />
                        <label className="admin-btn-secondary" style={{cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',flexShrink:0}}>
                          <span className="material-symbols-outlined" style={{fontSize:'16px',color:'#c5a059'}}>upload</span>
                          <span>Fayl Yüklə</span>
                          <input type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange} />
                        </label>
                      </div>
                      {value && (
                        <div className="admin-card" style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 12px'}}>
                          <div style={{width:'48px',height:'48px',borderRadius:'6px',border:'1px solid #e2e8f0',overflow:'hidden',background:'#f1f5f9',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                            <img src={value} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <span style={{fontSize:'11px',fontWeight:600,color:'#0f172a',display:'block'}}>Cari şəkil önizləməsi</span>
                            <span style={{fontSize:'10px',color:'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'block'}}>{value.startsWith('data:') ? 'Lokal yüklənmiş fayl (Base64)' : value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onChange('')}
                            className="admin-btn-danger"
                            style={{padding:'4px 8px',fontSize:'11px'}}
                          >
                            Şəkli Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              };

              const saveBlock = (blockKey, data) => {
                updateHomeBlock(blockKey, data);
                showToast('Məzmun yadda saxlandı!', 'success');
              };

              return (
                <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
                    <div>
                      <h4 className="admin-section-title">Səhifə Məzmunu İdarəetməsi (CMS)</h4>
                      <p className="admin-section-subtitle">Ana səhifənin bütün bloklarındakı yazı, şəkil və məzmunları birbaşa idarə edin</p>
                    </div>
                    <span className="admin-count-badge">
                      12 Aktiv Blok
                    </span>
                  </div>

                  {/* Block Switcher */}
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {cmsBlocks.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setCmsBlock(b.id)}
                        className={`admin-cms-pill ${cmsBlock === b.id ? 'active' : ''}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>

                  {/* NAVBAR & LOGO */}
                  {cmsBlock === 'navbar' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Naviqasiya və Loqo Tənzimləmələri</h5>
                      <ImageField
                        label="Sayt Loqosu (Header Logo)"
                        value={cmsNavbar.logoUrl}
                        onChange={v => setCmsNavbar(p => ({ ...p, logoUrl: v }))}
                      />
                      <p className="text-[11px] text-on-surface-variant">Qeyd: Əgər fərdi loqo yükləməsəniz, Monodoxia-nın rəsmi SVG simvolu və mətni göstərilir.</p>
                      <button onClick={() => saveBlock('navbar', cmsNavbar)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* HERO */}
                  {cmsBlock === 'hero' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Hero Bölməsi</h5>
                      <Field label="Üst Etiket" value={cmsHero.badge} onChange={v => setCmsHero(p => ({ ...p, badge: v }))} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Field label="Başlıq Sətir 1" value={cmsHero.title1} onChange={v => setCmsHero(p => ({ ...p, title1: v }))} />
                        <Field label="Başlıq Sətir 2 (İtalik)" value={cmsHero.title2} onChange={v => setCmsHero(p => ({ ...p, title2: v }))} />
                        <Field label="Başlıq Sətir 3" value={cmsHero.title3} onChange={v => setCmsHero(p => ({ ...p, title3: v }))} />
                      </div>
                      <Field label="Təsvir (desc)" value={cmsHero.desc} onChange={v => setCmsHero(p => ({ ...p, desc: v }))} multiline />
                      <ImageField
                        label="Hero Sağ Əsas Şəkil"
                        value={cmsHero.image}
                        onChange={v => setCmsHero(p => ({ ...p, image: v }))}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Şəkil Üzərində Sitat" value={cmsHero.quote} onChange={v => setCmsHero(p => ({ ...p, quote: v }))} />
                        <Field label="Sitat Alt Yazısı" value={cmsHero.quoteSub} onChange={v => setCmsHero(p => ({ ...p, quoteSub: v }))} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Əsas Düymə Mətni" value={cmsHero.btnPrimaryText} onChange={v => setCmsHero(p => ({ ...p, btnPrimaryText: v }))} />
                        <Field label="Əsas Düymə Linki" value={cmsHero.btnPrimaryLink} onChange={v => setCmsHero(p => ({ ...p, btnPrimaryLink: v }))} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="İkinci Düymə Mətni" value={cmsHero.btnSecondaryText} onChange={v => setCmsHero(p => ({ ...p, btnSecondaryText: v }))} />
                        <Field label="İkinci Düymə Linki" value={cmsHero.btnSecondaryLink} onChange={v => setCmsHero(p => ({ ...p, btnSecondaryLink: v }))} />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <Field label="Stat 1 (12,000+)" value={cmsHero.stat1Num} onChange={v => setCmsHero(p => ({ ...p, stat1Num: v }))} />
                        <Field label="Stat 1 Etiketi" value={cmsHero.stat1Label} onChange={v => setCmsHero(p => ({ ...p, stat1Label: v }))} />
                        <Field label="Stat 2 (98%)" value={cmsHero.stat2Num} onChange={v => setCmsHero(p => ({ ...p, stat2Num: v }))} />
                        <Field label="Stat 2 Etiketi" value={cmsHero.stat2Label} onChange={v => setCmsHero(p => ({ ...p, stat2Label: v }))} />
                        <Field label="Stat 3 (ICF & PhD)" value={cmsHero.stat3Num} onChange={v => setCmsHero(p => ({ ...p, stat3Num: v }))} />
                        <Field label="Stat 3 Etiketi" value={cmsHero.stat3Label} onChange={v => setCmsHero(p => ({ ...p, stat3Label: v }))} />
                      </div>
                      <button onClick={() => saveBlock('hero', cmsHero)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* ABOUT */}
                  {cmsBlock === 'about' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Haqqımızda Bölməsi</h5>
                      <Field label="Üst Etiket" value={cmsAbout.badge} onChange={v => setCmsAbout(p => ({ ...p, badge: v }))} />
                      <Field label="Başlıq" value={cmsAbout.title} onChange={v => setCmsAbout(p => ({ ...p, title: v }))} />
                      <Field label="Mətn (desc)" value={cmsAbout.desc} onChange={v => setCmsAbout(p => ({ ...p, desc: v }))} multiline />
                      <ImageField
                        label="Haqqımızda Şəkli"
                        value={cmsAbout.image}
                        onChange={v => setCmsAbout(p => ({ ...p, image: v }))}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Şəkil Sol Etiketi" value={cmsAbout.imageBadgeLeft} onChange={v => setCmsAbout(p => ({ ...p, imageBadgeLeft: v }))} />
                        <Field label="Şəkil Sağ Etiketi" value={cmsAbout.imageBadgeRight} onChange={v => setCmsAbout(p => ({ ...p, imageBadgeRight: v }))} />
                      </div>
                      <button onClick={() => saveBlock('about', cmsAbout)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* AREAS */}
                  {cmsBlock === 'areas' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Sahələr Bölməsi</h5>
                      <Field label="Üst Etiket" value={cmsAreas.badge} onChange={v => setCmsAreas(p => ({ ...p, badge: v }))} />
                      <Field label="Başlıq" value={cmsAreas.title} onChange={v => setCmsAreas(p => ({ ...p, title: v }))} />
                      <Field label="Təsvir (desc)" value={cmsAreas.desc} onChange={v => setCmsAreas(p => ({ ...p, desc: v }))} multiline />
                      <button onClick={() => saveBlock('areas', cmsAreas)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* ACADEMY */}
                  {cmsBlock === 'academy' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Akademiya Bölməsi</h5>
                      <Field label="Üst Etiket" value={cmsAcademy.badge} onChange={v => setCmsAcademy(p => ({ ...p, badge: v }))} />
                      <Field label="Başlıq" value={cmsAcademy.title} onChange={v => setCmsAcademy(p => ({ ...p, title: v }))} />
                      <Field label="Təsvir (desc)" value={cmsAcademy.desc} onChange={v => setCmsAcademy(p => ({ ...p, desc: v }))} multiline />
                      <Field label="Düymə Mətni" value={cmsAcademy.ctaText} onChange={v => setCmsAcademy(p => ({ ...p, ctaText: v }))} />
                      <button onClick={() => saveBlock('academy', cmsAcademy)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* CLUB */}
                  {cmsBlock === 'club' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Klub Bölməsi</h5>
                      <Field label="Üst Etiket" value={cmsClub.badge} onChange={v => setCmsClub(p => ({ ...p, badge: v }))} />
                      <Field label="Başlıq" value={cmsClub.title} onChange={v => setCmsClub(p => ({ ...p, title: v }))} />
                      <Field label="Təsvir (desc)" value={cmsClub.desc} onChange={v => setCmsClub(p => ({ ...p, desc: v }))} multiline />
                      <ImageField label="Klub Şəkli (opsional)" value={cmsClub.image} onChange={v => setCmsClub(p => ({ ...p, image: v }))} />
                      <Field label="Düymə Mətni" value={cmsClub.ctaBtnText} onChange={v => setCmsClub(p => ({ ...p, ctaBtnText: v }))} />
                      <Field label="Məhdudiyyət Xəbərdarlığı" value={cmsClub.limitedText} onChange={v => setCmsClub(p => ({ ...p, limitedText: v }))} />
                      <button onClick={() => saveBlock('club', cmsClub)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* COACHES SECTION HEADER */}
                  {cmsBlock === 'coaches' && (
                    <div className="space-y-4">
                      <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                        <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Koçlar Bölməsi – Başlıq</h5>
                        <Field label="Üst Etiket" value={cmsCoaches.badge} onChange={v => setCmsCoaches(p => ({ ...p, badge: v }))} />
                        <Field label="Başlıq" value={cmsCoaches.title} onChange={v => setCmsCoaches(p => ({ ...p, title: v }))} />
                        <Field label="Təsvir" value={cmsCoaches.desc} onChange={v => setCmsCoaches(p => ({ ...p, desc: v }))} multiline />
                        <button onClick={() => saveBlock('coaches', cmsCoaches)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                      </div>

                      <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                        <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Mövcud Koçlar və Şəkilləri</h5>
                        <div className="space-y-3">
                          {coachesList.map(c => (
                            <div key={c.id} className="p-3 bg-surface-container/30 border border-outline-variant/40 rounded-lg space-y-3">
                              {editingCoach?.id === c.id ? (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                                    <span className="text-xs font-semibold text-secondary">Koçu Redaktə Et</span>
                                    <button onClick={() => setEditingCoach(null)} className="text-xs text-outline hover:text-primary">Ləğv et</button>
                                  </div>
                                  <Field label="Ad Soyad" value={editingCoach.name} onChange={v => setEditingCoach(p => ({ ...p, name: v }))} />
                                  <Field label="Vəzifə / Başlıq" value={editingCoach.title} onChange={v => setEditingCoach(p => ({ ...p, title: v }))} />
                                  <Field label="Bio" value={editingCoach.bio} onChange={v => setEditingCoach(p => ({ ...p, bio: v }))} multiline />
                                  <ImageField label="Profil Şəkli" value={editingCoach.image} onChange={v => setEditingCoach(p => ({ ...p, image: v }))} />
                                  <Field label="İxtisaslar (vergüllə)" value={Array.isArray(editingCoach.specialties) ? editingCoach.specialties.join(', ') : (editingCoach.specialties || '')} onChange={v => setEditingCoach(p => ({ ...p, specialties: v }))} />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        updateCoach(c.id, editingCoach);
                                        setEditingCoach(null);
                                        showToast('Koç məlumatları yeniləndi!', 'success');
                                      }}
                                      className="px-4 py-1.5 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors"
                                    >
                                      Saxla
                                    </button>
                                    <button
                                      onClick={() => setEditingCoach(null)}
                                      className="px-4 py-1.5 border border-outline-variant rounded text-xs text-on-surface hover:bg-surface-container"
                                    >
                                      Bağla
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <img
                                      src={c.image || 'https://via.placeholder.com/100'}
                                      alt={c.name}
                                      className="w-10 h-10 rounded-full object-cover border border-outline-variant shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <div className="text-xs font-semibold text-primary truncate">{c.name}</div>
                                      <div className="text-[11px] text-outline truncate">{c.title}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={() => setEditingCoach({ ...c })}
                                      className="px-2.5 py-1 text-[11px] font-medium bg-surface-container border border-outline-variant hover:border-secondary text-primary rounded transition-colors"
                                    >
                                      Redaktə Et
                                    </button>
                                    <button
                                      onClick={() => { deleteCoach(c.id); showToast('Koç silindi.', 'info'); }}
                                      className="text-error text-[11px] hover:underline px-1"
                                    >
                                      Sil
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-outline-variant/40 space-y-3">
                          <h5 className="text-xs font-semibold text-primary">Yeni Ekspert / Koç Təyin Et</h5>
                          <div className="space-y-1">
                            <label className="block text-[11px] text-outline uppercase tracking-widest font-semibold">
                              Qeydiyyatlı Üzvlər Arasından Təyin Et (Tövsiyə Olunur)
                            </label>
                            <select
                              value={newCoachUserId}
                              onChange={(e) => {
                                const uId = e.target.value;
                                setNewCoachUserId(uId);
                                const foundUser = usersList.find(u => u.id === uId);
                                if (foundUser) {
                                  setNewCoachName(foundUser.name);
                                  setNewCoachTitle(foundUser.role === 'Kouç' ? 'Sertifikatlı Kouç' : 'Kouç & Ekspert');
                                  setNewCoachBio(`${foundUser.name} — Monodoxia Academy fərdi inkişaf və kouçinq ekspertidir.`);
                                  setNewCoachSpecialties('Fərdi İnkişaf, Şüurlu Fərqindəlik');
                                }
                              }}
                              className="w-full px-3 py-2 bg-surface-container-lowest border border-secondary/50 rounded text-xs text-primary focus:border-secondary"
                            >
                              <option value="">-- Qeydiyyatlı Üzv Seçin (və ya aşağıda birbaşa daxil edin) --</option>
                              {usersList.map(u => {
                                const isAlreadyCoach = coachesList.some(c => c.userId === u.id || c.name === u.name);
                                return (
                                  <option key={u.id} value={u.id} disabled={isAlreadyCoach}>
                                    {u.name} ({u.email}) — Rol: {u.role} {isAlreadyCoach ? '✓ (Artıq Ekspertdir)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          <Field label="Ad Soyad" value={newCoachName} onChange={setNewCoachName} />
                          <Field label="Vəzifə / Başlıq" value={newCoachTitle} onChange={setNewCoachTitle} />
                          <Field label="Bio" value={newCoachBio} onChange={setNewCoachBio} multiline />
                          <ImageField label="Profil Şəkli" value={newCoachImage} onChange={setNewCoachImage} />
                          <Field label="İxtisaslar (vergüllə)" value={newCoachSpecialties} onChange={setNewCoachSpecialties} />
                          <button onClick={() => {
                            if (!newCoachName) return;
                            addCoach({
                              userId: newCoachUserId || null,
                              name: newCoachName,
                              title: newCoachTitle,
                              bio: newCoachBio,
                              image: newCoachImage,
                              specialties: newCoachSpecialties.split(',').map(s => s.trim()).filter(Boolean)
                            });
                            setNewCoachUserId('');
                            setNewCoachName('');
                            setNewCoachTitle('');
                            setNewCoachBio('');
                            setNewCoachImage('');
                            setNewCoachSpecialties('');
                          }} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Ekspert Təyin Et</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COMMUNITY */}
                  {cmsBlock === 'community' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">İcma Bölməsi</h5>
                      <Field label="Üst Etiket" value={cmsCommunity.badge} onChange={v => setCmsCommunity(p => ({ ...p, badge: v }))} />
                      <Field label="Başlıq" value={cmsCommunity.title} onChange={v => setCmsCommunity(p => ({ ...p, title: v }))} />
                      <Field label="Təsvir" value={cmsCommunity.desc} onChange={v => setCmsCommunity(p => ({ ...p, desc: v }))} multiline />
                      <Field label="Düymə Mətni" value={cmsCommunity.newTopicBtnText} onChange={v => setCmsCommunity(p => ({ ...p, newTopicBtnText: v }))} />
                      <div className="space-y-1">
                        <label className="block text-[11px] text-outline uppercase tracking-widest font-semibold">Xüsusiyyət Siyahısı (hər sətirdə bir)</label>
                        <textarea rows="4"
                          value={(cmsCommunity.bullets || []).join('\n')}
                          onChange={e => setCmsCommunity(p => ({ ...p, bullets: e.target.value.split('\n') }))}
                          className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary resize-y" />
                      </div>
                      <button onClick={() => saveBlock('community', cmsCommunity)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* TESTIMONIALS */}
                  {cmsBlock === 'testimonials' && (
                    <div className="space-y-4">
                      <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                        <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Rəylər – Başlıq</h5>
                        <Field label="Üst Etiket" value={cmsTestimonials.badge} onChange={v => setCmsTestimonials(p => ({ ...p, badge: v }))} />
                        <Field label="Başlıq" value={cmsTestimonials.title} onChange={v => setCmsTestimonials(p => ({ ...p, title: v }))} />
                        <button onClick={() => saveBlock('testimonials', cmsTestimonials)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                      </div>
                      <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                        <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Mövcud Rəylər</h5>
                        {testimonialsList.map(item => (
                          <div key={item.id} className="flex items-start justify-between py-2 border-b border-outline-variant/30 last:border-0 gap-2">
                            <div>
                              <div className="text-xs font-semibold text-primary">{item.author}</div>
                              <div className="text-[11px] text-outline truncate max-w-xs">{item.quote}</div>
                            </div>
                            <button onClick={() => { deleteTestimonial(item.id); showToast('Rəy silindi.', 'info'); }}
                              className="text-error text-[11px] hover:underline shrink-0">Sil</button>
                          </div>
                        ))}
                        <h5 className="text-xs font-semibold text-primary pt-2">Yeni Rəy Əlavə Et</h5>
                        <Field label="Sitat (quote)" value={newTestimonialQuote} onChange={setNewTestimonialQuote} multiline />
                        <Field label="Ad Soyad (author)" value={newTestimonialAuthor} onChange={setNewTestimonialAuthor} />
                        <Field label="Vəzifə (role)" value={newTestimonialRole} onChange={setNewTestimonialRole} />
                        <button onClick={() => {
                          if (!newTestimonialQuote || !newTestimonialAuthor) return;
                          addTestimonial({ quote: newTestimonialQuote, author: newTestimonialAuthor, role: newTestimonialRole });
                          setNewTestimonialQuote(''); setNewTestimonialAuthor(''); setNewTestimonialRole('');
                          showToast('Rəy əlavə edildi!', 'success');
                        }} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Rəy Əlavə Et</button>
                      </div>
                    </div>
                  )}

                  {/* FAQ */}
                  {cmsBlock === 'faq' && (
                    <div className="space-y-4">
                      <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                        <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">FAQ – Başlıq</h5>
                        <Field label="Üst Etiket" value={cmsFaq.badge} onChange={v => setCmsFaq(p => ({ ...p, badge: v }))} />
                        <Field label="Başlıq" value={cmsFaq.title} onChange={v => setCmsFaq(p => ({ ...p, title: v }))} />
                        <button onClick={() => saveBlock('faq', cmsFaq)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                      </div>
                      <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                        <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Mövcud Suallar</h5>
                        {faqsList.map(item => (
                          <div key={item.id} className="flex items-start justify-between py-2 border-b border-outline-variant/30 last:border-0 gap-2">
                            <div className="text-xs font-semibold text-primary truncate max-w-xs">{item.question}</div>
                            <button onClick={() => { deleteFaq(item.id); showToast('Sual silindi.', 'info'); }}
                              className="text-error text-[11px] hover:underline shrink-0">Sil</button>
                          </div>
                        ))}
                        <h5 className="text-xs font-semibold text-primary pt-2">Yeni Sual Əlavə Et</h5>
                        <Field label="Sual" value={newFaqQuestion} onChange={setNewFaqQuestion} />
                        <Field label="Cavab" value={newFaqAnswer} onChange={setNewFaqAnswer} multiline />
                        <button onClick={() => {
                          if (!newFaqQuestion || !newFaqAnswer) return;
                          addFaq({ question: newFaqQuestion, answer: newFaqAnswer });
                          setNewFaqQuestion(''); setNewFaqAnswer('');
                          showToast('Sual əlavə edildi!', 'success');
                        }} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Sual Əlavə Et</button>
                      </div>
                    </div>
                  )}

                  {/* NEWSLETTER */}
                  {cmsBlock === 'newsletter' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Bülletenə Abunəlik Bölməsi</h5>
                      <Field label="Üst Etiket" value={cmsNewsletter.badge} onChange={v => setCmsNewsletter(p => ({ ...p, badge: v }))} />
                      <Field label="Başlıq" value={cmsNewsletter.title} onChange={v => setCmsNewsletter(p => ({ ...p, title: v }))} />
                      <Field label="Təsvir" value={cmsNewsletter.desc} onChange={v => setCmsNewsletter(p => ({ ...p, desc: v }))} multiline />
                      <Field label="Placeholder (email)" value={cmsNewsletter.placeholder} onChange={v => setCmsNewsletter(p => ({ ...p, placeholder: v }))} />
                      <Field label="Düymə Mətni" value={cmsNewsletter.btnText} onChange={v => setCmsNewsletter(p => ({ ...p, btnText: v }))} />
                      <Field label="Disclaimer mətni" value={cmsNewsletter.disclaimer} onChange={v => setCmsNewsletter(p => ({ ...p, disclaimer: v }))} />
                      <button onClick={() => saveBlock('newsletter', cmsNewsletter)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}

                  {/* FOOTER */}
                  {cmsBlock === 'footer' && (
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 space-y-4">
                      <h5 className="text-sm font-semibold text-primary border-b border-outline-variant/40 pb-2">Footer Bölməsi</h5>
                      <ImageField label="Footer Loqo Şəkli" value={cmsFooter.logoUrl} onChange={v => setCmsFooter(p => ({ ...p, logoUrl: v }))} />
                      <Field label="Təsvir (desc)" value={cmsFooter.desc} onChange={v => setCmsFooter(p => ({ ...p, desc: v }))} multiline />
                      <Field label="Ünvan" value={cmsFooter.address} onChange={v => setCmsFooter(p => ({ ...p, address: v }))} />
                      <Field label="E-poçt" value={cmsFooter.email} onChange={v => setCmsFooter(p => ({ ...p, email: v }))} />
                      <Field label="Telefon" value={cmsFooter.phone} onChange={v => setCmsFooter(p => ({ ...p, phone: v }))} />
                      <Field label="Copyright mətni" value={cmsFooter.copyright} onChange={v => setCmsFooter(p => ({ ...p, copyright: v }))} />
                      <button onClick={() => saveBlock('footer', cmsFooter)} className="px-5 py-2 bg-primary-container text-surface-bright hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors">Yadda Saxla</button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 10. TRANSLATIONS & MULTILINGUAL TAB */}
            {activeTab === 'translations' && (() => {
              const entities = [
                { id: 'users', label: 'İstifadəçilər & RBAC', count: usersList.length },
                { id: 'courses', label: 'Kurslar & LMS', count: coursesList.length },
                { id: 'club', label: 'Coaching Club Tiers', count: clubTiersList.length },
                { id: 'events', label: 'Tədbirlər & Vebinarlar', count: eventsList.length },
                { id: 'coaches', label: 'Mentorlar & Kouçlar', count: coachesList.length },
                { id: 'testimonials', label: 'Rəylər (Testimonials)', count: testimonialsList.length },
                { id: 'faqs', label: 'FAQ Sualları', count: faqsList.length },
                { id: 'areas', label: 'İnkişaf Sahələri (8)', count: areasList.length },
                { id: 'community', label: 'İcma Mövzuları', count: communityTopics.length }
              ];

              // Entity field configurations
              const entityFieldConfigs = {
                users: [
                  { key: 'name', label: 'Ad və Soyad', required: true },
                  { key: 'role', label: 'Rol & Səlahiyyət' },
                  { key: 'tier', label: 'Abunəlik Paketi' },
                  { key: 'notes', label: 'Admin Qeydləri', type: 'textarea' }
                ],
                courses: [
                  { key: 'title', label: 'Kursun Adı', required: true },
                  { key: 'description', label: 'Təsvir', type: 'textarea' },
                  { key: 'instructor', label: 'Aparıcı Kouç' },
                  { key: 'duration', label: 'Müddət' },
                  { key: 'price', label: 'Qiymət' },
                  { key: 'badge', label: 'Etiket / Nişan (Badge)' },
                  { key: 'status', label: 'Status Mətni' }
                ],
                club: [
                  { key: 'name', label: 'Tarifin Adı', required: true },
                  { key: 'price', label: 'Qiymət (mətn / valyuta)' },
                  { key: 'period', label: 'Müddət (Məs: / aylıq)' },
                  { key: 'features', label: 'İmtiyazlar (sətirbəsətir)', type: 'textarea', isArray: true }
                ],
                events: [
                  { key: 'title', label: 'Tədbir Başlığı', required: true },
                  { key: 'desc', label: 'Tədbir Təsviri', type: 'textarea' },
                  { key: 'speaker', label: 'Spiker' },
                  { key: 'datetime', label: 'Tarix və Saat' },
                  { key: 'typeBadge', label: 'Növ Nişanı (Məs: CANLI VEBİNAR)' }
                ],
                coaches: [
                  { key: 'title', label: 'Kouç Vəzifəsi / Titul', required: true },
                  { key: 'bio', label: 'Haqqında (Bio)', type: 'textarea' }
                ],
                testimonials: [
                  { key: 'quote', label: 'Rəy Mətni', type: 'textarea', required: true },
                  { key: 'role', label: 'Müəllifin Peşəsi / Rolu' }
                ],
                faqs: [
                  { key: 'question', label: 'Sual', required: true },
                  { key: 'answer', label: 'Cavab', type: 'textarea', required: true }
                ],
                areas: [
                  { key: 'number', label: 'Nömrə / Kod (Məs: 01 / SAHƏ)' },
                  { key: 'title', label: 'Sahə Adı', required: true },
                  { key: 'desc', label: 'İzah / Təsvir', type: 'textarea' }
                ],
                community: [
                  { key: 'badge', label: 'Mövzu Kateqoriyası' },
                  { key: 'title', label: 'Başlıq', required: true },
                  { key: 'snippet', label: 'Qısa Mətn', type: 'textarea' },
                  { key: 'author', label: 'Müəllif' }
                ]
              };

              // Get active entity items
              let currentItems = [];
              if (transEntity === 'users') currentItems = usersList;
              else if (transEntity === 'courses') currentItems = coursesList;
              else if (transEntity === 'club') currentItems = clubTiersList;
              else if (transEntity === 'events') currentItems = eventsList;
              else if (transEntity === 'coaches') currentItems = coachesList;
              else if (transEntity === 'testimonials') currentItems = testimonialsList;
              else if (transEntity === 'faqs') currentItems = faqsList;
              else if (transEntity === 'areas') currentItems = areasList;
              else if (transEntity === 'community') currentItems = communityTopics;

              const selectedItem = currentItems.find(i => i.id === transSelectedId) || currentItems[0] || null;
              const fields = entityFieldConfigs[transEntity] || [];
              const transObj = selectedItem?.translations || {};

              // Update a translated field
              const handleTransFieldChange = (langCode, fieldKey, value) => {
                if (!selectedItem) return;
                const updatedTranslations = {
                  ...transObj,
                  [langCode]: {
                    ...(transObj[langCode] || {}),
                    [fieldKey]: value
                  }
                };

                // Persist to context
                if (transEntity === 'users') updateUser(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'courses') updateCourse(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'club') updateClubTier(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'events') updateEvent(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'coaches') updateCoach(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'testimonials') updateTestimonial(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'faqs') updateFaq(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'areas') updateArea(selectedItem.id, { translations: updatedTranslations });
                else if (transEntity === 'community') updateTopic(selectedItem.id, { translations: updatedTranslations });
              };

              // Copy all fields from default language (AZ) into selected target language
              const handleCopyFromDefault = () => {
                if (!selectedItem) return;
                const copied = copyFromDefaultLanguage(selectedItem, fields.map(f => f.key), transActiveLang, defaultLang);
                if (transEntity === 'users') updateUser(selectedItem.id, { translations: copied });
                else if (transEntity === 'courses') updateCourse(selectedItem.id, { translations: copied });
                else if (transEntity === 'club') updateClubTier(selectedItem.id, { translations: copied });
                else if (transEntity === 'events') updateEvent(selectedItem.id, { translations: copied });
                else if (transEntity === 'coaches') updateCoach(selectedItem.id, { translations: copied });
                else if (transEntity === 'testimonials') updateTestimonial(selectedItem.id, { translations: copied });
                else if (transEntity === 'faqs') updateFaq(selectedItem.id, { translations: copied });
                else if (transEntity === 'areas') updateArea(selectedItem.id, { translations: copied });
                else if (transEntity === 'community') updateTopic(selectedItem.id, { translations: copied });
                showToast(`AZ mətnləri ${transActiveLang.toUpperCase()} dilinə nüsxələndi!`, 'success');
              };

              // Translation status map for selected item
              const statusMap = selectedItem ? getTranslationStatus(selectedItem, fields.map(f => f.key), supportedLangs) : {};

              return (
                <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
                  {/* Top Header */}
                  <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:'12px',paddingBottom:'16px',borderBottom:'1px solid #e2e8f0'}}>
                    <div>
                      <h4 className="admin-section-title" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span className="material-symbols-outlined" style={{color:'#b45309'}}>translate</span>
                        <span>Mərkəzi Tərcümə və Çoxdilli İdarəetmə (i18n)</span>
                      </h4>
                      <p className="admin-section-subtitle">Bütün dinamik kursları, tədbirləri, kouçları, tarifləri və rəyləri AZ, EN, TR, RU dillərinə tərcümə edin</p>
                    </div>

                    {/* Language management badges */}
                    <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
                      {(supportedLangs || []).map(l => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            const updated = supportedLangs.map(lang => 
                              lang.code === l.code ? { ...lang, active: !lang.active } : lang
                            );
                            setSupportedLangs(updated);
                            showToast(`${l.name} (${l.code.toUpperCase()}) statusu dəyişdirildi`, 'info');
                          }}
                          style={{
                            display:'flex',
                            alignItems:'center',
                            gap:'6px',
                            padding:'5px 10px',
                            borderRadius:'6px',
                            fontSize:'11px',
                            fontWeight:600,
                            cursor:'pointer',
                            border:l.active?'1px solid #d4af37':'1px solid #cbd5e1',
                            background:l.active?'#fffbeb':'#ffffff',
                            color:l.active?'#b45309':'#64748b',
                            transition:'all 0.15s ease'
                          }}
                          title={l.active ? 'Klikləyin: Deaktiv et' : 'Klikləyin: Aktiv et'}
                        >
                          <span>{l.flag}</span>
                          <span style={{textTransform:'uppercase'}}>{l.code}</span>
                          <span style={{fontSize:'10px',color:l.active?'#15803d':'#dc2626'}}>{l.active ? '✓' : '✗'}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Entity Selector Tabs */}
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {entities.map(e => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => {
                          setTransEntity(e.id);
                          setTransSelectedId(null);
                        }}
                        className={`admin-cms-pill ${transEntity === e.id ? 'active' : ''}`}
                        style={{display:'flex',alignItems:'center',gap:'6px'}}
                      >
                        <span>{e.label}</span>
                        <span style={{
                          fontSize:'9px',
                          padding:'1px 6px',
                          borderRadius:'10px',
                          background:transEntity === e.id ? 'rgba(180,83,9,0.15)' : '#f1f5f9',
                          color:transEntity === e.id ? '#b45309' : '#64748b'
                        }}>
                          {e.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Main Translation Work Area: Item Picker + MultiLang Editor */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'20px'}}>
                    {/* Items List (Left Sidebar) */}
                    <div className="admin-card" style={{padding:'12px',maxHeight:'550px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px'}}>
                      <div style={{fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.08em',color:'#64748b',fontWeight:700,padding:'4px 8px'}}>
                        Siyahıdan Element Seçin
                      </div>
                      {currentItems.map(item => {
                        const isSelected = (selectedItem && selectedItem.id === item.id);
                        const itemTitle = item.title || item.name || item.question || item.author || item.id;
                        const itemStatus = getTranslationStatus(item, fields.map(f => f.key), supportedLangs);
                        
                        return (
                          <div
                            key={item.id}
                            onClick={() => setTransSelectedId(item.id)}
                            style={{
                              padding:'10px 12px',
                              borderRadius:'8px',
                              cursor:'pointer',
                              transition:'all 0.15s ease',
                              border:isSelected?'1px solid #c5a059':'1px solid #e2e8f0',
                              background:isSelected?'#fffbeb':'#ffffff',
                              display:'flex',
                              flexDirection:'column',
                              gap:'4px'
                            }}
                          >
                            <div style={{fontSize:'12px',fontWeight:600,color:isSelected?'#0f172a':'#334155',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                              {itemTitle}
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'10px'}}>
                              {(supportedLangs || []).filter(l => l.active).map(l => {
                                const st = itemStatus[l.code]?.status || 'missing';
                                const color = st === 'complete' ? '#22c55e' : (st === 'partial' ? '#eab308' : '#f87171');
                                return (
                                  <span key={l.code} style={{display:'flex',alignItems:'center',gap:'3px',color:'#64748b'}} title={`${l.code.toUpperCase()}: ${st}`}>
                                    <span style={{width:'5px',height:'5px',borderRadius:'50%',background:color}} />
                                    <span style={{textTransform:'uppercase',fontSize:'9px'}}>{l.code}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Translation Form (Right Area) */}
                    <div className="admin-card" style={{padding:'20px',display:'flex',flexDirection:'column',gap:'16px',minWidth:'320px'}}>
                      {selectedItem ? (
                        <>
                          {/* Item Title and Quick Copy Bar */}
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px',paddingBottom:'12px',borderBottom:'1px solid #e2e8f0'}}>
                            <div>
                              <span style={{fontSize:'10px',color:'#b45309',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em'}}>
                                {transEntity.toUpperCase()} • ID: {selectedItem.id}
                              </span>
                              <h5 style={{fontSize:'16px',fontWeight:700,fontFamily:"'Playfair Display',serif",color:'#0f172a',margin:'2px 0 0 0'}}>
                                {selectedItem.title || selectedItem.name || selectedItem.question || selectedItem.author || selectedItem.id}
                              </h5>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyFromDefault}
                              className="admin-btn-secondary"
                              style={{display:'flex',alignItems:'center',gap:'6px'}}
                              title="Əsas dil (AZ) mətnlərini seçilmiş dilə köçür"
                            >
                              <span className="material-symbols-outlined" style={{fontSize:'15px',color:'#b45309'}}>content_copy</span>
                              <span>AZ-dan köçür ({transActiveLang.toUpperCase()})</span>
                            </button>
                          </div>

                          {/* MultiLangEditor component */}
                          <MultiLangEditor
                            activeLang={transActiveLang}
                            onLangChange={setTransActiveLang}
                            fields={fields}
                            translations={transObj}
                            onTranslationChange={handleTransFieldChange}
                            statusMap={statusMap}
                            supportedLanguages={supportedLangs}
                          />

                          {/* Club features array special handling */}
                          {transEntity === 'club' && (
                            <div style={{paddingTop:'8px',borderTop:'1px solid #e2e8f0'}}>
                              <LocalizedArrayField
                                label="Tarif İmtiyazları (Features List)"
                                fieldKey="features"
                                lang={transActiveLang}
                                translations={transObj}
                                onChange={handleTransFieldChange}
                              />
                            </div>
                          )}

                          {/* Coaches specialties array special handling */}
                          {transEntity === 'coaches' && (
                            <div style={{paddingTop:'8px',borderTop:'1px solid #e2e8f0'}}>
                              <LocalizedArrayField
                                label="İxtisas Sahələri (Specialties)"
                                fieldKey="specialties"
                                lang={transActiveLang}
                                translations={transObj}
                                onChange={handleTransFieldChange}
                              />
                            </div>
                          )}

                          <div style={{paddingTop:'12px',borderTop:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:'11px',color:'#64748b'}}>
                            <span>Dəyişikliklər avtomatik yadda saxlanılır və real vaxtda tətbiq olunur.</span>
                            <span style={{color:'#15803d',fontWeight:600}}>✓ Avto-sinxron aktivdir</span>
                          </div>
                        </>
                      ) : (
                        <div style={{textAlign:'center',padding:'48px 0',color:'#64748b',fontSize:'13px'}}>
                          Tərcümə etmək üçün soldakı siyahıdan bir element seçin.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

          </main>
        </div>
      </div>
    </div>
  );
}

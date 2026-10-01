// Core Ecosystem Mock Data & Initial State for Monodoxia Academy

window.MONODOXIA_DATA = {
  // 8 Core Focus Areas
  areas: [
    {
      id: "psychology",
      number: "01 / DƏRİNLİK",
      title: "Psixologiya",
      icon: "psychology_alt",
      desc: "İnsanın daxili strukturu, qorxular, travmalar və şüuraltı mexanizmlərin elmi analizi."
    },
    {
      id: "personal-growth",
      number: "02 / İRƏLİLƏYİŞ",
      title: "Şəxsi İnkişaf",
      icon: "trending_up",
      desc: "Məqsədyönlülük, intizam, vərdişlərin transformasiyası və potensialın tam realizasiyası."
    },
    {
      id: "spiritual",
      number: "03 / MƏNƏVİYYAT",
      title: "Spiritual Coaching",
      icon: "self_improvement",
      desc: "Həyatın ali məqsədi, ekzistensial suallar və daxili mənəvi güclə təmas."
    },
    {
      id: "mindfulness",
      number: "04 / FƏRQİNDƏLİK",
      title: "Mindfulness",
      icon: "nest_eco_leaf",
      desc: "İndiki zamanda yaşamaq bacarığı, avtopilotdan çıxış və təmkinli baxış."
    },
    {
      id: "meditation",
      number: "05 / SÜKUT",
      title: "Meditasiya",
      icon: "lens_blur",
      desc: "Nəfəs texnikaları, bədən skanı və beynin neyron harmoniyasını bərpa edən praktika."
    },
    {
      id: "relationships",
      number: "06 / ƏLAQƏ",
      title: "Münasibətlər",
      icon: "diversity_1",
      desc: "Partnyor, ailə və cəmiyyətlə sağlam sərhədlər, güvən və dərin emosional bağ."
    },
    {
      id: "eq",
      number: "07 / EQ",
      title: "Emosional İntellekt",
      icon: "favorite_border",
      desc: "Emosiyaları tanımaq, adlandırmaq və idarə edərək müdrik qərarlar vermək sənəti."
    },
    {
      id: "identity",
      number: "08 / İDENTİKLİK",
      title: "Özünü Tanıma",
      icon: "fingerprint",
      desc: "Maskalardan azad olaraq həqiqi dəyərlərini, istedadlarını və autentik kimliyini tapmaq."
    }
  ],

  // Coaching Academy Courses
  courses: [
    {
      id: "course-1",
      category: "psychology",
      badge: "SERTİFİKATLI KURS",
      badgeClass: "bg-secondary/10 text-secondary",
      duration: "12 Həftə | 36 Dərs",
      title: "Özünü Tanıma və Şüur Mühəndisliyi",
      description: "Şüuraltı inanc sistemlərinin yenidən proqramlaşdırılması, qorxuların aradan qaldırılması və ali mənliklə sinxronlaşma.",
      instructor: "Dr. Leyla Əliyeva",
      instructorRole: "PhD Psixologiya | ICF PCC",
      status: "Qrup qəbulu aktivdir",
      occupancy: 78,
      price: "₼ 640",
      featured: true,
      modules: [
        {
          id: "m1",
          title: "Modul 1: Daxili Xəritə və Şüuraltı Dinamikalar",
          lessons: [
            { id: "l1-1", title: "1.1 Şüur, fərqindəlik və eqo mexanizmləri", duration: "24 dəq", type: "video", completed: true, videoUrl: "https://www.youtube.com/embed/inpok4MKVLM" },
            { id: "l1-2", title: "1.2 Uşaqlıq travmaları və arxetiplər", duration: "32 dəq", type: "video", completed: true, videoUrl: "https://www.youtube.com/embed/inpok4MKVLM" },
            { id: "l1-3", title: "1.3 Daxili dialoqun auditi (Praktika)", duration: "18 dəq", type: "exercise", completed: false }
          ]
        },
        {
          id: "m2",
          title: "Modul 2: Emosional Blokların Azad Olunması",
          lessons: [
            { id: "l2-1", title: "2.1 Qorxu və günahkarlıq hissi ilə iş", duration: "28 dəq", type: "video", completed: false, videoUrl: "https://www.youtube.com/embed/inpok4MKVLM" },
            { id: "l2-2", title: "2.2 Somatik gərginliyin azad edilməsi", duration: "15 dəq", type: "audio", completed: false },
            { id: "l2-3", title: "2.3 Fərdi Dəyərlər və Şüur İmtahanı", duration: "20 dəq", type: "quiz", completed: false }
          ]
        }
      ]
    },
    {
      id: "course-2",
      category: "eq",
      badge: "TRANSFORMATİV",
      badgeClass: "bg-secondary/10 text-secondary",
      duration: "8 Həftə | 24 Dərs",
      title: "Emosional İntellekt və Daxili Azadlıq",
      description: "Emosiyaların nevroloji təməli, aqressiya və narahatlığın enerjiyə çevrilməsi, yüksək EQ liderlik bacarıqları.",
      instructor: "Fərid Məmmədov",
      instructorRole: "ICF MCC Kouç | EQ Master",
      status: "ICF Akkreditasiyalı",
      occupancy: 92,
      price: "₼ 480",
      featured: false,
      modules: [
        {
          id: "m2-1",
          title: "Modul 1: Nevrobiologiya və Affektiv Tənzimləmə",
          lessons: [
            { id: "l2-1-1", title: "1.1 Amigdala həyəcanı və neyro-cavablar", duration: "30 dəq", type: "video", completed: false, videoUrl: "https://www.youtube.com/embed/inpok4MKVLM" },
            { id: "l2-1-2", title: "1.2 Təzyiq altında təmkinli qalma texnikası", duration: "22 dəq", type: "audio", completed: false }
          ]
        }
      ]
    },
    {
      id: "course-3",
      category: "coaching",
      badge: "DƏRİN İLİŞKİLƏR",
      badgeClass: "bg-secondary/10 text-secondary",
      duration: "6 Həftə | 18 Dərs",
      title: "Münasibətlərdə Sağlam Sərhədlər",
      description: "Asılılıqdan azadlıq, 'Yox' demək sənəti, zəhərli dinamikaların təyini və autentik yaxınlıq yaratma təlimi.",
      instructor: "Nərgiz Qasımova",
      instructorRole: "Münasibət Kouçu | Somatik Təlimçi",
      status: "Praktiki Təlim",
      occupancy: 65,
      price: "₼ 390",
      featured: false,
      modules: [
        {
          id: "m3-1",
          title: "Modul 1: Qarşılıqlı Asılılıq və Sərhəd Arxitekturası",
          lessons: [
            { id: "l3-1-1", title: "1.1 Şəxsi sərhədlərin xəritələnməsi", duration: "25 dəq", type: "video", completed: false, videoUrl: "https://www.youtube.com/embed/inpok4MKVLM" }
          ]
        }
      ]
    },
    {
      id: "course-4",
      category: "meditation",
      badge: "PRAKTİKUM",
      badgeClass: "bg-secondary/10 text-secondary",
      duration: "4 Həftə | 16 Dərs",
      title: "Mindfulness və Dərin Fərqindəlik",
      description: "Günlük stressin neyrobioloji idarəsi, somatik bədən praktikalari və zehni sükunət laboratoriyası.",
      instructor: "Dr. Leyla Əliyeva",
      instructorRole: "PhD Psixologiya | ICF PCC",
      status: "Canlı Meditasiyalar",
      occupancy: 84,
      price: "₼ 290",
      featured: false,
      modules: [
        {
          id: "m4-1",
          title: "Modul 1: Nəfəs və Zehni Dayanma",
          lessons: [
            { id: "l4-1-1", title: "1.1 Vipassana və müasir sinir sistemi harmoniyası", duration: "20 dəq", type: "audio", completed: false }
          ]
        }
      ]
    }
  ],

  // Coaching Club Membership Tiers
  clubTiers: [
    {
      id: "free",
      name: "Giriş (Free)",
      price: "₼ 0",
      period: "Ömürlük",
      features: [
        "Açıq bloq yazılarına və ictimai müzakirələrə giriş",
        "Aylıq ümumi vebinarlara dinləyici qismində qatılmaq",
        "Bülleten və psixoloji bələdçi bildirişləri"
      ],
      cta: "Qeydiyyat",
      current: false
    },
    {
      id: "basic",
      name: "Basic Rezident",
      price: "₼ 45",
      period: "/ aylıq",
      features: [
        "Coaching Club standart müzakirə platforması",
        "20+ saatlıq səsli meditasiya kitabxanası",
        "Kurslara 10% daimi tələbə endirimi",
        "Ayda 1 canlı sual-cavab sessiyası"
      ],
      cta: "Seç",
      current: false
    },
    {
      id: "premium",
      name: "Premium Rezident",
      price: "₼ 95",
      period: "/ aylıq",
      popular: true,
      features: [
        "Bütün canlı klub tədbirləri və masterklaslar",
        "Telegram VIP məxfi müzakirə otağı",
        "Kurslara 25% fərdi endirim",
        "Aylıq 1 fərdi diaqnostik orientasiya",
        "Tam 100+ saatlıq meditasiya və video arxivi"
      ],
      cta: "Rezident ol",
      current: true
    },
    {
      id: "vip",
      name: "VIP Salon",
      price: "₼ 250",
      period: "/ aylıq",
      features: [
        "Bütün Premium imtiyazlar daxil",
        "Hər ay 2 fərdi ICF kouçinq sessiyası (Dr. Leyla və ya Fərid bəy)",
        "Oflayn illik retreat və düşərgələrə prioritet pulsuz giriş",
        "Şəxsi inkişaf mentoru və 24/7 dəstək xətti"
      ],
      cta: "Müraciət et",
      current: false
    }
  ],

  // Faculty Coaches
  coaches: [
    {
      id: "coach-leyla",
      name: "Dr. Leyla Əliyeva",
      title: "PhD Psixologiya | ICF PCC",
      experience: "14+ il tədqiqat və klinik təcrübə",
      bio: "Koqnitiv fərqindəlik və şüuraltı travmalar üzrə baş ekspert. Harvard və Bakı Dövlət Universitetinin tədqiqat layihələrinin məzunu.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn9ZjfxW-PL-o_xZ9Me83EiOB9x_aaIbuIEYtOce00950-vB-hL99E3BUxNBeJriyWWNWGGDlnTJRCJGRwkjlEPSCAIQYPacFkDcUc0Gx7SG3u_LdP-yJ9ZvAxESWMhqm8PQ0_Jjk2lpNGCZW3k-pFcnjQ873cYwWNg72N95sYxMH-w5fpXfjJZfJo1LZC2K5AStfFo8Xfl-GQ968CVb_yfDTaqIDcMiTxISBiZMVtj4d_vRd_K_L3",
      specialties: ["Travma terapiyası", "Şüuraltı inanc dəyişimi", "Mindfulness"],
      availableSlots: ["Sabah 11:00", "Sabah 15:30", "Cümə 18:00"]
    },
    {
      id: "coach-farid",
      name: "Fərid Məmmədov",
      title: "ICF MCC Kouç | EQ Master",
      experience: "11+ il beynəlxalq ekzekyutiv kouçinq",
      bio: "Top menecerlər və sahibkarlar üçün ekzekyutiv kouçinq, böhran idarəçiliyi və emosional liderlik üzrə baş məsləhətçi.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdkVIgrGvOaJjxAlQWP_tOgF6MLIc1W_hVcrzQBsdy3Nmj3_bg1aNTtm-J7ngXIQHCb_HUk8Wgmb1fcNip_lsrL-Gmar-UetvxkeR45_vSt4q1wmYr827ItSKFD3KvdecV_H8wq93ilFYULT8I6h79AaRYC4hHvZXNqnITSxTBQyhdlEbyKM6jmxqnqbhzDwzEMCBH3hkOs9Ek7d1JxL4eWrgGao9MIfgwjA76wbSTi5zJlsf9FF_w",
      specialties: ["EQ Liderlik", "Karyera sıçrayışı", "Stres menecmenti"],
      availableSlots: ["Bazar ertəsi 14:00", "Çərşənbə 16:30", "Şənbə 12:00"]
    },
    {
      id: "coach-nargiz",
      name: "Nərgiz Qasımova",
      title: "Münasibət Kouçu | Somatik Təlimçi",
      experience: "9+ il təcrübə",
      bio: "Cütlüklər və fərdlər üçün münasibət dinamikası, psixosomatika və affektiv tənzimləmə üzrə mütəxəssis.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApho0mk-jt09_EKWhr9Kr-rV4ni1mNVZ9NMTTJnSr7Io_rS9AF4YMxdvwdvNBSQ5niLnit1PKeNozwDdDlqiBGbJTz1MOiuOo8yyY1b3AbDK33_Lc-ZOXlb5WzmwRuSsfZWSPYV7fmbNuRtSts2hYeTZFmwlHsu99rLvjRaczoStwMfhP4xbjxoLfdcfKKedG3I9Wsc86Mw84ULdwPbgpzWaz6dnC5ZnLFz2n5VuHMa6K1rX1itB96",
      specialties: ["Münasibətlər", "Bədən-zihin harmoniyası", "Özünü bağışlama"],
      availableSlots: ["Sabah 17:00", "Cümə axşamı 19:00", "Şənbə 15:00"]
    }
  ],

  // Community Forum Topics
  communityTopics: [
    {
      id: "topic-1",
      badge: "Günün Müzakirəsi",
      badgeClass: "text-secondary font-semibold",
      time: "42 şərh • 18 dəq əvvəl",
      title: "Qüsursuzluq tələsi: Niyə mükəmməllik axtarışı bizi daxili sülhdən məhrum edir?",
      snippet: "Moderatör: Dr. Leyla Əliyeva. Tələbələr perfeksionizmin arxasında gizlənən uğursuzluq qorxusunu müzakirə edir.",
      author: "Dr. Leyla Əliyeva",
      likes: 64,
      repliesCount: 42
    },
    {
      id: "topic-2",
      badge: "Təcrübə Paylaşımı",
      badgeClass: "text-secondary font-semibold",
      time: "67 şərh • 2 saat əvvəl",
      title: "Səhər 20 dəqiqəlik sükut təcrübəsi: Bir ay ərzində qavrayış necə dəyişdi?",
      snippet: "İcma üzvü Elmir Həsənli özünün 30 günlük meditasiya və gündəlik tutma qeydlərini bölüşür.",
      author: "Elmir Həsənli",
      likes: 88,
      repliesCount: 67
    },
    {
      id: "topic-3",
      badge: "Kitab Klubu",
      badgeClass: "text-secondary font-semibold",
      time: "89 şərh • Dünən",
      title: "Viktor Frankl - Həyatın mənasını axtararkən: Ekzistensial dözümlülük dərsləri",
      snippet: "Aylıq birgə mütaliə çərçivəsində loqoterapiya prinsiplərinin müasir çağırışlara tətbiqi.",
      author: "Nərgiz Qasımova",
      likes: 124,
      repliesCount: 89
    }
  ],

  // Upcoming Events
  events: [
    {
      id: "event-1",
      typeBadge: "CANLI VEBİNAR",
      badgeClass: "bg-secondary/10 text-secondary",
      datetime: "15 NOYABR, 20:00",
      title: "Şüuraltı Proqramlar: Keçmişin Təsiri və Azadlıq",
      desc: "İnteraktiv sual-cavab formatında keçmiş qorxuların aradan qaldırılması texnikaları.",
      speaker: "Dr. Leyla Əliyeva",
      capacity: 250,
      registered: 214,
      isOnline: true
    },
    {
      id: "event-2",
      typeBadge: "OFLAYN SEMİNAR",
      badgeClass: "bg-primary-container text-surface-bright",
      datetime: "22 NOYABR, 18:30",
      title: "Böhranda Dayanıqlıq: Liderlik və Zehni Güc",
      desc: "Bakı mərkəzində elit networking və psixoloji resursların bərpası sessiyası.",
      speaker: "Fərid Məmmədov",
      capacity: 50,
      registered: 46,
      isOnline: false
    },
    {
      id: "event-3",
      typeBadge: "MEDİTASİYA GECƏSİ",
      badgeClass: "bg-secondary/10 text-secondary",
      datetime: "30 NOYABR, 21:00",
      title: "Dolunay və Sükunət: Somatik Təmizlənmə",
      desc: "Dərin nəfəs və səs terapiyası ilə bədəndəki gərginliyin azad edilməsi praktikası.",
      speaker: "Nərgiz Qasımova",
      capacity: 100,
      registered: 82,
      isOnline: true
    }
  ],

  // Onboarding Assessment Questions (9 Focus Points)
  onboardingQuestions: [
    { id: "stress", text: "Stres və Həyəcan İdarəsi", icon: "spa", desc: "Zehni gərginliyi azaltmaq və sakitlik tapmaq" },
    { id: "self_awareness", text: "Özünü Tanıma və Dərin Fərqindəlik", icon: "fingerprint", desc: "Əsl kimliyini və daxili motivasiyanı anlamaq" },
    { id: "relationships", text: "Münasibətlər və Sağlam Sərhədlər", icon: "diversity_1", desc: "Ailə, partnyor və sosial əlaqələri harmoniyaya gətirmək" },
    { id: "career", text: "Karyera və Məqsədyönlülük", icon: "trending_up", desc: "Potensialı iş həyatında yüksək nəticəyə çevirmək" },
    { id: "personal_growth", text: "Şəxsi İnkişaf və İntizam", icon: "psychology_alt", desc: "Davamlı vərdişlər və daxili nizam formalaşdırmaq" },
    { id: "spirituality", text: "Mənəvi İnkişaf və Ekzistensial Dərinlik", icon: "self_improvement", desc: "Həyatın mənasını və mənəvi daxili sülhü kəşf etmək" },
    { id: "meditation", text: "Meditasiya və Nəfəs Praktikaları", icon: "lens_blur", desc: "Bədən və zehni gündəlik sükutla bərpa etmək" },
    { id: "eq", text: "Emosional İntellekt", icon: "favorite_border", desc: "Emosiyaları idarə edərək müdrik qərarlar vermək" },
    { id: "life_coaching", text: "Həyat Kouçinqi və Transformasiya", icon: "supervisor_account", desc: "Sertifikatlı kouçla sistemli fərdi inkişaf planı" }
  ]
};

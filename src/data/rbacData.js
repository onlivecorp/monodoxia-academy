/**
 * Monodoxia Academy - Role-Based Access Control (RBAC) System
 * Granular Permissions Taxonomy & Built-in System Roles
 */

export const PERMISSION_MODULES = [
  {
    id: 'dashboard',
    name: 'İcmal & Analitika',
    icon: 'dashboard',
    description: 'Sistem statistikası, əsas göstəricilər və qrafiklər',
    permissions: [
      { id: 'dashboard.view', name: 'İcmala baxış', description: 'Statistika və əsas analitika panellərini görmək hüququ' },
      { id: 'dashboard.export', name: 'Hesabatı ixrac etmə', description: 'İcmal statistikalarını CSV və ya PDF formatında yükləmək' }
    ]
  },
  {
    id: 'applications',
    name: 'Müraciətlər',
    icon: 'assignment',
    description: 'Kurs, vebinar və üzvlük müraciətlərinin idarə edilməsi',
    permissions: [
      { id: 'applications.view', name: 'Müraciətlərə baxış', description: 'Bütün daxil olan müraciətləri və təfərrüatları görmək' },
      { id: 'applications.approve', name: 'Təsdiqləmə & Qəbul', description: 'Müraciətləri təsdiqləmək və statusunu dəyişmək' },
      { id: 'applications.reject', name: 'İmtina & Ləğv', description: 'Müraciətləri rədd etmək və ya ləğv etmək' },
      { id: 'applications.delete', name: 'Silmə & Arxiv', description: 'Müraciətləri arxivləşdirmək və ya tam silmək' },
      { id: 'applications.export', name: 'İxrac etmə', description: 'Müraciətlər siyahısını ixrac etmək' }
    ]
  },
  {
    id: 'registrations',
    name: 'Qeydiyyatlar & Formalar',
    icon: 'how_to_reg',
    description: 'Dinamik qeydiyyat forması sahələri və sorğu cavabları',
    permissions: [
      { id: 'registrations.view', name: 'Qeydiyyatlara baxış', description: 'Qeydiyyat siyahılarını və formalarını görmək' },
      { id: 'registrations.manage_fields', name: 'Form sahələrini idarə etmə', description: 'Dinamik form sahələri əlavə etmək, redaktə etmək və silmək' },
      { id: 'registrations.export', name: 'İxrac etmə', description: 'Qeydiyyat məlumatlarını ixrac etmək' }
    ]
  },
  {
    id: 'users',
    name: 'İstifadəçilər & Üzvlər',
    icon: 'group',
    description: 'İstifadəçi hesabları, profillər və statuslar',
    permissions: [
      { id: 'users.view', name: 'İstifadəçilərə baxış', description: 'Bütün istifadəçi siyahısını və detallarını görmək' },
      { id: 'users.create', name: 'İstifadəçi yaratma', description: 'Sistemdə yeni istifadəçi qeydiyyatdan keçirmək' },
      { id: 'users.edit', name: 'İstifadəçini redaktə etmə', description: 'İstifadəçi məlumatlarını və abunəlik paketini dəyişmək' },
      { id: 'users.delete', name: 'İstifadəçini silmə/bloklama', description: 'İstifadəçi hesabını silmək və ya bloklamaq' },
      { id: 'users.assign_role', name: 'Rol təyin etmə', description: 'İstifadəçilərə sistem rolları və səlahiyyətlər bağlamaq' }
    ]
  },
  {
    id: 'roles',
    name: 'Rollar & İcazələr (RBAC)',
    icon: 'shield_person',
    description: 'Rolların yaradılması, icazələrin təyini və təhlükəsizlik matrisi',
    permissions: [
      { id: 'roles.view', name: 'Rollara baxış', description: 'Sistem rollarını və icazələr matrisini görmək' },
      { id: 'roles.create', name: 'Yeni rol yaratma', description: 'Yeni istifadəçi rolu və səlahiyyət profili formalaşdırmaq' },
      { id: 'roles.edit', name: 'Rolu redaktə etmə', description: 'Rola icazələr əlavə etmək, adını və statusunu dəyişmək' },
      { id: 'roles.delete', name: 'Rolu silmə', description: 'Fərdi yaradılmış rolları sistemdən silmək' },
      { id: 'roles.assign', name: 'Rolu istifadəçilərə bağlama', description: 'İstifadəçilərə rolu təyin etmək' }
    ]
  },
  {
    id: 'courses',
    name: 'Kurslar & LMS',
    icon: 'school',
    description: 'Tədris proqramları, modullar, dərslər və təlimçilər',
    permissions: [
      { id: 'courses.view', name: 'Kurslara baxış', description: 'Kurs siyahısını və tədris planını görmək' },
      { id: 'courses.create', name: 'Yeni kurs əlavə etmə', description: 'Platformaya yeni təlim proqramı daxil etmək' },
      { id: 'courses.edit', name: 'Kursu redaktə etmə', description: 'Kursun qiymətini, dərslərini və təsvirini dəyişmək' },
      { id: 'courses.delete', name: 'Kursu silmə', description: 'Kursu sistemdən silmək' },
      { id: 'courses.publish', name: 'Statusu idarə etmə', description: 'Qrup qəbulunu aktivləşdirmək və ya bağlamaq' }
    ]
  },
  {
    id: 'categories',
    name: 'Kateqoriyalar',
    icon: 'category',
    description: 'Tədris sahələri və taksonomiya strukturu',
    permissions: [
      { id: 'categories.view', name: 'Kateqoriyalara baxış', description: 'Mövcud kateqoriyaları görmək' },
      { id: 'categories.create', name: 'Kateqoriya əlavə etmə', description: 'Yeni sahə və ya kateqoriya yaratmaq' },
      { id: 'categories.edit', name: 'Kateqoriyanı redaktə etmə', description: 'Kateqoriyanın adını və tənzimləmələrini dəyişmək' },
      { id: 'categories.delete', name: 'Kateqoriyanı silmə', description: 'Kateqoriyanı silmək' }
    ]
  },
  {
    id: 'club',
    name: 'Club Tiers & Abunəliklər',
    icon: 'card_membership',
    description: 'Rezidentlik səviyyələri və imtiyaz paketləri',
    permissions: [
      { id: 'club.view', name: 'Abunəliklərə baxış', description: 'Klub səviyyələrini və qiymətlərini görmək' },
      { id: 'club.create', name: 'Yeni paket əlavə etmə', description: 'Yeni klub paketi yaratmaq' },
      { id: 'club.edit', name: 'Paketi redaktə etmə', description: 'Xüsusiyyətləri, qiymətləri və statusu dəyişmək' },
      { id: 'club.delete', name: 'Paketi silmə', description: 'Klub paketini silmək' }
    ]
  },
  {
    id: 'events',
    name: 'Tədbirlər & Vebinarlar',
    icon: 'event',
    description: 'Canlı sessiyalar, vorkşoplar və tədbir cədvəli',
    permissions: [
      { id: 'events.view', name: 'Tədbirlərə baxış', description: 'Tədbirlər cədvəlini və qeydiyyatları görmək' },
      { id: 'events.create', name: 'Yeni tədbir yaratma', description: 'Yeni vorkşop və ya vebinar əlavə etmək' },
      { id: 'events.edit', name: 'Tədbiri redaktə etmə', description: 'Tarixi, məkanı, spikeri və tutumu yeniləmək' },
      { id: 'events.delete', name: 'Tədbiri silmə', description: 'Tədbiri sistemdən silmək' }
    ]
  },
  {
    id: 'community',
    name: 'İcma & Forum',
    icon: 'forum',
    description: 'Rezident müzakirələri, postlar və şərhlər',
    permissions: [
      { id: 'community.view', name: 'Foruma baxış', description: 'İcma müzakirələrinə baxmaq' },
      { id: 'community.create', name: 'Mövzu yaratma', description: 'İcmada rəsmi mövzu açmaq' },
      { id: 'community.edit', name: 'Mövzunu redaktə/sabitləmə', description: 'Mövzunu redaktə etmək və ya başlığa sabitləmək' },
      { id: 'community.delete', name: 'Mövzunu silmə', description: 'Qaydaları pozan müzakirəni silmək' }
    ]
  },
  {
    id: 'translations',
    name: 'Tərcümələr (i18n)',
    icon: 'translate',
    description: 'Dinamik və statik çoxdilli məzmun lüğətləri',
    permissions: [
      { id: 'translations.view', name: 'Tərcümələrə baxış', description: 'Bütün dil paketlərinə və mətnlərinə baxmaq' },
      { id: 'translations.edit', name: 'Tərcümələri redaktə etmə', description: 'Mətnləri tərcümə etmək və bazada yeniləmək' },
      { id: 'translations.export', name: 'Tərcümələri ixrac etmə', description: 'Dil fayllarını JSON formatında yükləmək' }
    ]
  },
  {
    id: 'maintenance',
    name: 'Texniki Qulluq Ekranı',
    icon: 'construction',
    description: 'Saytın texniki fasilə və yenilənmə rejimi',
    permissions: [
      { id: 'maintenance.view', name: 'Texniki rejimə baxış', description: 'Texniki qulluq parametrlərini görmək' },
      { id: 'maintenance.toggle', name: 'Rejimi aktiv/deaktiv etmə', description: 'Saytı texniki rejimə keçirmək və ya açmaq' },
      { id: 'maintenance.edit', name: 'Mətnləri redaktə etmə', description: 'Texniki ekranın başlıq, təsvir və dillərini dəyişmək' }
    ]
  },
  {
    id: 'content',
    name: 'Məzmun (CMS)',
    icon: 'edit_document',
    description: 'Ana səhifə blokları, şüarlar və bəyanatlar',
    permissions: [
      { id: 'content.view', name: 'Məzmuna baxış', description: 'CMS bloklarını və səhifə mətnlərini görmək' },
      { id: 'content.edit', name: 'Məzmunu redaktə etmə', description: 'Ana səhifə və fəlsəfə bloklarını yeniləmək' }
    ]
  },
  {
    id: 'database',
    name: 'SQL Bazası',
    icon: 'database',
    description: 'MySQL cədvəlləri, replikasiya və konfiqurasiya',
    permissions: [
      { id: 'database.view', name: 'Bazaya baxış', description: 'SQL konfiqurasiyasını və cədvəl statuslarını görmək' },
      { id: 'database.query', name: 'Sorğu icra etmə', description: 'Baza sorğuları icra etmək və sinxronlaşdırmaq' },
      { id: 'database.backup', name: 'Nüsxə çıxarma (Backup)', description: 'SQL verilənlər bazası nüsxəsini ixrac etmək' }
    ]
  },
  {
    id: 'settings',
    name: 'Sistem Parametrləri',
    icon: 'settings',
    description: 'Ümumi sayt parametrləri, əlaqə və təhlükəsizlik',
    permissions: [
      { id: 'settings.view', name: 'Parametrlərə baxış', description: 'Ümumi konfiqurasiyaya baxmaq' },
      { id: 'settings.edit', name: 'Parametrləri dəyişmə', description: 'Sayt adı, valyuta, əlaqə və bildirişləri redaktə etmək' }
    ]
  }
];

// Flat list of all system permission IDs
export const ALL_PERMISSION_KEYS = PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.id));

export const INITIAL_ROLES = [
  {
    id: 'role-admin',
    name: 'Super Admin',
    code: 'Admin',
    description: 'Bütün sistem modullarına, maliyyə, istifadəçi, verilənlər bazası və təhlükəsizlik tənzimləmələrinə tam məhdudiyyətsiz giriş hüququ.',
    isSystem: true,
    isActive: true,
    color: '#b45309',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    permissions: ['*'], // '*' means full root access to all modules
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: 'role-moderator',
    name: 'Moderator',
    code: 'Moderator',
    description: 'Müraciətlərə, qeydiyyatlara, istifadəçilərə və icma müzakirələrinə operativ nəzarət və moderasiya hüququ.',
    isSystem: true,
    isActive: true,
    color: '#2563eb',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    permissions: [
      'dashboard.view',
      'applications.view',
      'applications.approve',
      'applications.reject',
      'applications.export',
      'registrations.view',
      'registrations.export',
      'users.view',
      'users.edit',
      'community.view',
      'community.create',
      'community.edit',
      'community.delete',
      'events.view'
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: 'role-coach',
    name: 'Kouç & Ekspert',
    code: 'Kouç',
    description: 'Kurslar, dərslər, tədbirlər və icma sessiyalarını idarə etmək üçün tədris heyəti hüququ.',
    isSystem: true,
    isActive: true,
    color: '#059669',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    permissions: [
      'dashboard.view',
      'courses.view',
      'courses.create',
      'courses.edit',
      'courses.publish',
      'events.view',
      'events.create',
      'events.edit',
      'community.view',
      'community.create',
      'categories.view'
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  },
  {
    id: 'role-editor',
    name: 'Məzmun Redaktoru',
    code: 'Məzmun Redaktoru',
    description: 'CMS məzmunları, tərcümələr, kateqoriyalar və bloq/forum idarəetmə hüququ.',
    isSystem: false,
    isActive: true,
    color: '#7c3aed',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    permissions: [
      'dashboard.view',
      'content.view',
      'content.edit',
      'translations.view',
      'translations.edit',
      'categories.view',
      'categories.create',
      'categories.edit',
      'community.view',
      'community.edit'
    ],
    createdAt: '2025-02-15',
    updatedAt: '2025-02-15'
  },
  {
    id: 'role-student',
    name: 'Tələbə (İstifadəçi)',
    code: 'Tələbə',
    description: 'Platformanın standart tələbə və üzv hesabı. Yalnız öz dərslərinə və ictimai imkanlara giriş.',
    isSystem: true,
    isActive: true,
    color: '#64748b',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    permissions: [],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  }
];

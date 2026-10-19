// Monodoxia Academy - Clean State (Only Admin Panel Content)

export const AREAS = [];

export const COURSES = [];

export const COACHES = [];

export const COMMUNITY_TOPICS = [];

export const EVENTS = [];

export const ONBOARDING_QUESTIONS = [
  { id: "stress", text: "Stres və Həyəcan İdarəsi", icon: "spa", desc: "Zehni gərginliyi azaltmaq və sakitlik tapmaq" },
  { id: "self_awareness", text: "Özünü Tanıma və Dərin Fərqindəlik", icon: "fingerprint", desc: "Əsl kimliyini və daxili motivasiyanı anlamaq" },
  { id: "relationships", text: "Münasibətlər və Sağlam Sərhədlər", icon: "diversity_1", desc: "Ailə, partnyor və sosial əlaqələri harmoniyaya gətirmək" },
  { id: "career", text: "Karyera və Məqsədyönlülük", icon: "trending_up", desc: "Potensialı iş həyatında yüksək nəticəyə çevirmək" },
  { id: "personal_growth", text: "Şəxsi İnkişaf və İntizam", icon: "psychology_alt", desc: "Davamlı vərdişlər və daxili nizam formalaşdırmaq" },
  { id: "spirituality", text: "Mənəvi İnkişaf və Ekzistensial Dərinlik", icon: "self_improvement", desc: "Həyatın mənasını və mənəvi daxili sülhü kəşf etmək" },
  { id: "meditation", text: "Meditasiya və Nəfəs Praktikaları", icon: "lens_blur", desc: "Bədən və zehni gündəlik sükutla bərpa etmək" },
  { id: "eq", text: "Emosional İntellekt", icon: "favorite_border", desc: "Emosiyaları idarə edərək müdrik qərarlar vermək" },
  { id: "life_coaching", text: "Həyat Kouçinqi və Transformasiya", icon: "supervisor_account", desc: "Sertifikatlı kouçla sistemli fərdi inkişaf planı" }
];

export const INITIAL_PILLARS = [];

export const INITIAL_TESTIMONIALS = [];

export const INITIAL_FAQS = [];

export const INITIAL_HOME_CONTENT = {
  navbar: {
    logoUrl: "/header_logo.svg"
  },
  hero: {},
  about: {},
  areas: {},
  academy: {},
  club: {},
  coaches: {},
  community: {},
  events: {},
  testimonials: {},
  faq: {},
  newsletter: {}
};

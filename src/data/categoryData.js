// Monodoxia Academy - Centralized Taxonomy & Categories Management
// Prevents manual repetitive translation input on individual items

export const INITIAL_CATEGORIES = [
  {
    id: "cat-psychology",
    key: "psychology",
    type: "course",
    icon: "psychology_alt",
    name: "Psixologiya",
    translations: {
      az: { name: "Psixologiya", desc: "Şüuraltı, daxili arxetiplər və psixoanaliz" },
      en: { name: "Psychology", desc: "Subconscious mind, internal archetypes and psychoanalysis" },
      tr: { name: "Psikoloji", desc: "Bilinçaltı, içsel arketipler ve psikanaliz" },
      ru: { name: "Психология", desc: "Подсознание, внутренние архетипы и психоанализ" }
    }
  },
  {
    id: "cat-eq",
    key: "eq",
    type: "course",
    icon: "sentiment_satisfied",
    name: "Emosional İntellekt",
    translations: {
      az: { name: "Emosional İntellekt", desc: "Duyğuların idarə olunması və empatiya" },
      en: { name: "Emotional Intelligence", desc: "Emotion regulation and empathy development" },
      tr: { name: "Duygusal Zeka", desc: "Duygu yönetimi ve empati gelişimi" },
      ru: { name: "Эмоциональный Интеллект", desc: "Управление эмоциями и развитие эмпатии" }
    }
  },
  {
    id: "cat-coaching",
    key: "coaching",
    type: "course",
    icon: "trending_up",
    name: "Kouçinq",
    translations: {
      az: { name: "Kouçinq", desc: "Məqsədə çatma, liderlik və fərdi inkişaf metodikaları" },
      en: { name: "Coaching", desc: "Goal achievement, leadership and personal coaching methodologies" },
      tr: { name: "Koçluk", desc: "Hedefe ulaşma, liderlik ve bireysel gelişim metodolojileri" },
      ru: { name: "Коучинг", desc: "Достижение целей, лидерство и методологии развития" }
    }
  },
  {
    id: "cat-meditation",
    key: "meditation",
    type: "course",
    icon: "self_improvement",
    name: "Meditasiya",
    translations: {
      az: { name: "Meditasiya", desc: "Dərin daxili sakitlik, nəfəs və sükut praktikaları" },
      en: { name: "Meditation", desc: "Deep inner stillness, breathwork and silence practices" },
      tr: { name: "Meditasyon", desc: "Derin içsel dinginlik, nefes ve sessizlik pratikleri" },
      ru: { name: "Медитация", desc: "Глубокое внутреннее спокойствие, дыхание и практики тишины" }
    }
  },
  {
    id: "cat-child-psychology",
    key: "child-psychology",
    type: "course",
    icon: "child_care",
    name: "Uşaq və Yeniyetmə Psixologiyası",
    translations: {
      az: { name: "Uşaq və Yeniyetmə Psixologiyası", desc: "Uşaq inkişafı, yeniyetməlik dövrü və məktəb adaptasiyası" },
      en: { name: "Child & Adolescent Psychology", desc: "Child development, adolescence, and school adaptation" },
      tr: { name: "Çocuk ve Ergen Psikolojisi", desc: "Çocuk gelişimi, ergenlik dönemi ve okula uyum" },
      ru: { name: "Детская и Подростковая Психология", desc: "Развитие детей, подростковый возраст и школьная адаптация" }
    }
  },
  {
    id: "cat-family",
    key: "family",
    type: "course",
    icon: "family_restroom",
    name: "Ailə və Valideynlik",
    translations: {
      az: { name: "Ailə və Valideynlik", desc: "Valideyn-uşaq münasibətləri, ailə dinamikası və cütlük konsultasiyası" },
      en: { name: "Family & Parenting", desc: "Parent-child bonds, family dynamics and couples counseling" },
      tr: { name: "Aile ve Ebeveynlik", desc: "Ebeveyn-çocuk bağları, aile dinamikleri ve çift ilişkileri" },
      ru: { name: "Семья и Родительство", desc: "Детско-родительские связи, динамика семьи и консультирование пар" }
    }
  },
  {
    id: "cat-personal-growth",
    key: "personal-growth",
    type: "course",
    icon: "psychology",
    name: "Şəxsi İnkişaf və Özünüdərk",
    translations: {
      az: { name: "Şəxsi İnkişaf və Özünüdərk", desc: "Özünəinam, potensialın reallaşdırılması və daxili inkişaf" },
      en: { name: "Personal Growth & Self-Discovery", desc: "Self-confidence, potential realization and inner growth" },
      tr: { name: "Kişisel Gelişim ve Öz Farkındalık", desc: "Özgüven, potansiyelin gerçekleştirilmesi ve içsel gelişim" },
      ru: { name: "Личностный Рост и Самопознание", desc: "Уверенность в себе, реализация потенциала и внутренний рост" }
    }
  },
  {
    id: "cat-crisis-support",
    key: "crisis-support",
    type: "course",
    icon: "healing",
    name: "Böhran və Psixoloji Dəstək",
    translations: {
      az: { name: "Böhran və Psixoloji Dəstək", desc: "Stress, itki, yas və həyat dəyişikliklərinə adaptasiya" },
      en: { name: "Crisis & Psychological Support", desc: "Stress, grief, loss and adaptation to life transitions" },
      tr: { name: "Kriz ve Psikolojik Destek", desc: "Stres, kayıp, yas ve yaşam değişimlerine uyum" },
      ru: { name: "Кризисная и Психологическая Поддержка", desc: "Стресс, переживание утраты, горевание и адаптация к переменам" }
    }
  },
  {
    id: "cat-communication",
    key: "communication",
    type: "course",
    icon: "record_voice_over",
    name: "Ünsiyyət və Sosial Bacarıqlar",
    translations: {
      az: { name: "Ünsiyyət və Sosial Bacarıqlar", desc: "Effektiv dialoq, sərhədlər və şəxsiyyətlərarası münasibətlər" },
      en: { name: "Communication & Social Skills", desc: "Effective dialogue, healthy boundaries and interpersonal relationships" },
      tr: { name: "İletişim ve Sosyal Beceriler", desc: "Etkili diyalog, sağlıklı sınırlar ve kişilerarası ilişkiler" },
      ru: { name: "Общение и Социальные Навыки", desc: "Эффективный диалог, личные границы и межличностные отношения" }
    }
  },
  {
    id: "cat-career-guidance",
    key: "career-guidance",
    type: "course",
    icon: "work",
    name: "Karyera və Peşəyönümü",
    translations: {
      az: { name: "Karyera və Peşəyönümü", desc: "Peşə seçimi, karyera planlaşdırılması və motivasiya" },
      en: { name: "Career & Vocational Guidance", desc: "Career choices, vocational planning and professional orientation" },
      tr: { name: "Kariyer ve Mesleki Rehberlik", desc: "Meslek seçimi, kariyer planlaması ve profesyonel gelişim" },
      ru: { name: "Карьера и Профориентация", desc: "Выбор профессии, карьерное планирование и профессиональное ориентирование" }
    }
  },
  {
    id: "cat-webinar",
    key: "webinar",
    type: "event",
    icon: "videocam",
    name: "Vebinar",
    translations: {
      az: { name: "Canlı Vebinar", desc: "Onlayn interaktiv təlim və mühazirə" },
      en: { name: "Live Webinar", desc: "Online interactive training and lecture" },
      tr: { name: "Canlı Web Semineri", desc: "Çevrim içi etkileşimli eğitim ve seminer" },
      ru: { name: "Онлайн Вебинар", desc: "Онлайн интерактивный тренинг и лекция" }
    }
  },
  {
    id: "cat-workshop",
    key: "workshop",
    type: "event",
    icon: "handyman",
    name: "Vorkşop",
    translations: {
      az: { name: "Praktik Seminar / Vorkşop", desc: "Tətbiqi qrup tapşırıqları və simulyasiyalar" },
      en: { name: "Practical Workshop", desc: "Hands-on group exercises and simulations" },
      tr: { name: "Uygulamalı Atölye", desc: "Pratik grup çalışmaları ve simülasyonlar" },
      ru: { name: "Практический Воркшоп", desc: "Практические групповые упражнения и симуляции" }
    }
  },
  {
    id: "cat-retreat",
    key: "retreat",
    type: "event",
    icon: "forest",
    name: "İnziva & Retrit",
    translations: {
      az: { name: "İnziva & Retrit", desc: "Təbiət qoynunda dərin transformasiya düşərgəsi" },
      en: { name: "Retreat & Camp", desc: "Deep transformative camp in nature" },
      tr: { name: "İnziva & Kamp", desc: "Doğada derin dönüşüm kampı" },
      ru: { name: "Ретрит и Лагерь", desc: "Глубокая трансформация на природе" }
    }
  },
  {
    id: "cat-community-disc",
    key: "discussion",
    type: "community",
    icon: "forum",
    name: "Müzakirə",
    translations: {
      az: { name: "İcma Müzakirəsi", desc: "Tələbələr və ekspertlər arasında fikir mübadiləsi" },
      en: { name: "Community Discussion", desc: "Exchange of views among students and experts" },
      tr: { name: "Topluluk Tartışması", desc: "Öğrenciler ve uzmanlar arasında fikir alışverişi" },
      ru: { name: "Обсуждение", desc: "Обмен мнениями между студентами и экспертами" }
    }
  },
  {
    id: "cat-mindfulness",
    key: "mindfulness",
    type: "community",
    icon: "nest_eco_leaf",
    name: "Mindfulness & Praktika",
    translations: {
      az: { name: "Mindfulness & Praktika", desc: "Gündəlik fərqindəlik qeydləri və təcrübələr" },
      en: { name: "Mindfulness & Practice", desc: "Daily mindfulness notes and reflections" },
      tr: { name: "Farkındalık & Pratik", desc: "Günlük farkındalık notları ve paylaşımlar" },
      ru: { name: "Осознанность и Практика", desc: "Ежедневные заметки и практики осознанности" }
    }
  }
];

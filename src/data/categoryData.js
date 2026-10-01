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

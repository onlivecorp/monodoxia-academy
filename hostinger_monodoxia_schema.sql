-- ========================================================
-- Monodoxia Academy - Hostinger MySQL Database Schema & Seed
-- Verilənlər Bazası: u310078278_monodoxia
-- Server Mühərriki: MySQL / MariaDB (InnoDB, UTF-8 MB4)
-- ========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Cədvəl: mdx_settings (Sayt Tənzimləmələri)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_settings`;
CREATE TABLE `mdx_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) NOT NULL,
  `key_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_settings` (`key_name`, `key_value`) VALUES
('site_title', 'Monodoxia Academy'),
('subtitle', 'Fərdi İnkişaf və Psixologiya Mərkəzi'),
('currency', 'AZN (₼)'),
('default_lang', 'az'),
('safety_banner_active', '1'),
('safety_text', 'Monodoxia Academy təhsil, fərdi inkişaf və kouçinq platformasıdır. Təqdim edilən proqramlar və materiallar tibbi, psixiatrik və ya kliniki diaqnostika və müalicəni əvəz etmir.'),
('maintenance_mode', '0');

-- --------------------------------------------------------
-- Cədvəl: mdx_users (İstifadəçilər və Tələbələr)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_users`;
CREATE TABLE `mdx_users` (
  `id` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Tələbə',
  `tier` varchar(50) NOT NULL DEFAULT 'Basic',
  `status` varchar(50) NOT NULL DEFAULT 'Aktiv',
  `joined_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_users` (`id`, `name`, `email`, `role`, `tier`, `status`, `joined_date`) VALUES
('u7', 'Admin Baş Koordinator', 'admin@monodoxia.academy', 'Admin', 'VIP', 'Aktiv', '2025-01-01');

-- --------------------------------------------------------
-- Cədvəl: mdx_areas (Tədris Sahələri)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_areas`;
CREATE TABLE `mdx_areas` (
  `id` varchar(50) NOT NULL,
  `number_label` varchar(50) NOT NULL,
  `title` varchar(100) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_areas` (`id`, `number_label`, `title`, `icon`, `description`) VALUES
('psychology', '01 / DƏRİNLİK', 'Psixologiya', 'psychology_alt', 'İnsanın daxili strukturu, qorxular, travmalar və şüuraltı mexanizmlərin elmi analizi.'),
('personal-growth', '02 / İRƏLİLƏYİŞ', 'Şəxsi İnkişaf', 'trending_up', 'Məqsədyönlülük, intizam, vərdişlərin transformasiyası və potensialın tam realizasiyası.'),
('spiritual', '03 / MƏNƏVİYYAT', 'Spiritual Coaching', 'self_improvement', 'Həyatın ali məqsədi, ekzistensial suallar və daxili mənəvi güclə təmas.'),
('mindfulness', '04 / FƏRQİNDƏLİK', 'Mindfulness', 'nest_eco_leaf', 'İndiki zamanda yaşamaq bacarığı, avtopilotdan çıxış və təmkinli baxış.'),
('meditation', '05 / SÜKUT', 'Meditasiya', 'lens_blur', 'Nəfəs texnikaları, bədən skanı və beynin neyron harmoniyasını bərpa edən praktika.'),
('relationships', '06 / ƏLAQƏ', 'Münasibətlər', 'diversity_1', 'Partnyor, ailə və cəmiyyətlə sağlam sərhədlər, güvən və dərin emosional bağ.'),
('eq', '07 / EQ', 'Emosional İntellekt', 'favorite_border', 'Emosiyaları tanımaq, adlandırmaq və idarə edərək müdrik qərarlar vermək sənəti.'),
('identity', '08 / İDENTİKLİK', 'Özünü Tanıma', 'fingerprint', 'Maskalardan azad olaraq həqiqi dəyərlərini, istedadlarını və autentik kimliyini tapmaq.');

-- --------------------------------------------------------
-- Cədvəl: mdx_courses (Akademiya Kursları)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_courses`;
CREATE TABLE `mdx_courses` (
  `id` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `badge` varchar(100) NOT NULL,
  `badge_class` varchar(100) DEFAULT NULL,
  `duration` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `instructor` varchar(150) NOT NULL,
  `instructor_role` varchar(150) NOT NULL,
  `status` varchar(100) NOT NULL,
  `occupancy` int(11) NOT NULL DEFAULT 0,
  `price` varchar(50) NOT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_courses` (`id`, `category`, `badge`, `badge_class`, `duration`, `title`, `description`, `instructor`, `instructor_role`, `status`, `occupancy`, `price`, `featured`) VALUES
('course-1', 'psychology', 'SERTİFİKATLI KURS', 'bg-secondary/10 text-secondary', '12 Həftə | 36 Dərs', 'Özünü Tanıma və Şüur Mühəndisliyi', 'Şüuraltı inanc sistemlərinin yenidən proqramlaşdırılması, qorxuların aradan qaldırılması və ali mənliklə sinxronlaşma.', 'Dr. Leyla Əliyeva', 'PhD Psixologiya | ICF PCC', 'Qrup qəbulu aktivdir', 78, '₼ 640', 1),
('course-2', 'eq', 'DƏRİN İXTİSASLAŞMA', 'bg-primary/10 text-primary', '8 Həftə | 24 Dərs', 'Emosional İntellekt və Müdrik Liderlik', 'Böhran anlarında emosional tarazlıq, empatiya əsaslı ünsiyyət və komandalarda güvən mühitinin yaradılması.', 'Fərid Məmmədov', 'ICF Master Certified Coach (MCC)', 'Son 4 yer', 92, '₼ 480', 1),
('course-3', 'mindfulness', 'PRAKTİK KURIKULUM', 'bg-surface-container-high text-on-surface-variant', '6 Həftə | 18 Dərs', 'Fərqində Yaşam və Zihin Sükutu', 'Gündəlik xaosda zehni duruluq qazanmaq, stress hormonlarının neytrallaşdırılması və nəfəs meditasiyası təcrübələri.', 'Nərgiz Qasımova', 'Mindfulness & Somatik Terapevt', 'Qeydiyyat açıqdır', 65, '₼ 320', 0),
('course-4', 'spiritual', 'MASTERKLAS SİKLİ', 'bg-secondary/10 text-secondary', '10 Həftə | 20 Dərs', 'Məna Axtarışı və Daxili Gücün Oyanışı', 'Ekzistensial böhranlardan çıxış yolları, daxili potensialın kəşfi və həyat missiyasını dəqiq təyin etmə metodologiyası.', 'Dr. Leyla Əliyeva & Fərid Məmmədov', 'Aparıcı Mentorlar', 'Qrup formalaşır', 45, '₼ 520', 0);

-- --------------------------------------------------------
-- Cədvəl: mdx_club_tiers (Klub Rezidentlik Paketləri)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_club_tiers`;
CREATE TABLE `mdx_club_tiers` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` varchar(50) NOT NULL,
  `period` varchar(50) NOT NULL,
  `popular` tinyint(1) NOT NULL DEFAULT 0,
  `features_json` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_club_tiers` (`id`, `name`, `price`, `period`, `popular`, `features_json`, `active`) VALUES
('free', 'Giriş (Free)', '0', 'Ömürlük', 0, '[\"Açıq bloq yazılarına və ictimai müzakirələrə giriş\", \"Aylıq ümumi vebinarlara dinləyici qismində qatılmaq\", \"Bülleten və psixoloji bələdçi bildirişləri\"]', 1),
('basic', 'Basic Rezident', '45', '/ aylıq', 0, '[\"Coaching Club standart müzakirə platforması\", \"20+ saatlıq səsli meditasiya kitabxanası\", \"Kurslara 10% daimi tələbə endirimi\", \"Ayda 1 canlı sual-cavab sessiyası\"]', 1),
('premium', 'Premium Rezident', '95', '/ aylıq', 1, '[\"Bütün canlı klub tədbirləri və masterklaslar\", \"Telegram VIP məxfi müzakirə otağı\", \"Kurslara 25% fərdi endirim\", \"Aylıq 1 fərdi diaqnostik orientasiya\", \"Tam 100+ saatlıq meditasiya və video arxivi\"]', 1),
('vip', 'VIP Salon', '250', '/ aylıq', 0, '[\"Bütün Premium imtiyazlar daxil\", \"Hər ay 2 fərdi ICF kouçinq sessiyası\", \"Oflayn illik retreat və düşərgələrə prioritet giriş\", \"Şəxsi inkişaf mentoru və 24/7 dəstək xətti\"]', 1);

-- --------------------------------------------------------
-- Cədvəl: mdx_events (Tədbirlər və Masterklaslar)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_events`;
CREATE TABLE `mdx_events` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `datetime_label` varchar(100) NOT NULL,
  `type_badge` varchar(50) NOT NULL,
  `badge_class` varchar(100) DEFAULT NULL,
  `speaker` varchar(150) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 100,
  `registered` int(11) NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_events` (`id`, `title`, `datetime_label`, `type_badge`, `badge_class`, `speaker`, `capacity`, `registered`, `description`) VALUES
('ev-1', 'Daxili Tənqidçini Müttəfiqə Çevirmək', '18 DEKABR, 20:00', 'VEBİNAR', 'bg-secondary/10 text-secondary', 'Dr. Leyla Əliyeva', 150, 114, 'Özünü ittiham və mükəmməllik tələbini səmərəli özünəşəfqət enerjisinə çevirmə üsulları.'),
('ev-2', 'Dərin Diqqət və Rəqəmsal Detoks', '22 DEKABR, 19:30', 'MASTERKLAS', 'bg-primary/10 text-primary', 'Nərgiz Qasımova', 80, 72, 'Daimi bildirişlər və informasiya selində diqqəti 1 işə fokuslamaq və beyin yorğunluğunu aradan qaldırmaq.'),
('ev-3', 'Yüksək Təzyiq Altında Müdrik Qərarlar', '27 DEKABR, 21:00', 'CANLI SESSİYA', 'bg-surface-container-high text-on-surface-variant', 'Fərid Məmmədov', 100, 89, 'Rəhbərlər və sahibkarlar üçün qeyri-müəyyənlik mühitində təmkinli strateji analiz.');

-- --------------------------------------------------------
-- Cədvəl: mdx_community_posts (İcma Forumu)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_community_posts`;
CREATE TABLE `mdx_community_posts` (
  `id` varchar(50) NOT NULL,
  `badge` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `snippet` text NOT NULL,
  `author` varchar(150) NOT NULL,
  `time_ago` varchar(50) NOT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `replies` int(11) NOT NULL DEFAULT 0,
  `pinned` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_community_posts` (`id`, `badge`, `title`, `snippet`, `author`, `time_ago`, `likes`, `replies`, `pinned`) VALUES
('com-1', 'Təcrübə Bölüşümü', 'Səhər 15 dəqiqəlik nəfəs meditasiyasının iş məhsuldarlığıma təsiri', 'Artıq 3-cü həftədir ki, \"Fərqində Yaşam\" kursunun 2-ci modulundakı 4-7-8 nəfəs praktikasını hər səhər tətbiq edirəm. Gün ərzində qəfil emosional partlayışlar demək olar ki, sıfıra enib...', 'Rəşad Kərimov', '2 saat əvvəl', 24, 7, 0),
('com-2', 'Sual-Cavab', 'İçimdəki daimi tələskənlik hissini necə sakitləşdirə bilərəm?', 'Heç bir yerə gecikməsəm belə, beynimdə daim \"daha çox çatdırmalıyam\" panikası var. Hansı koçluq texnikası ilə bu tələsikliyi qeydə alıb dayandırmaq olar?', 'Günel Həsənli', '5 saat əvvəl', 18, 12, 0),
('com-3', '📌 Sabitlənmiş Müzakirə', '2025-ci il Hədəfləri və Şəxsi Dəyərlər Xəritəsi: Şablon və Qaydalar', 'Əziz klub üzvləri, dekabr ayının fərdi analiz tapşırığı üçün mentorlarımızın hazırladığı dəyərlər matrisini buradan endirə və suallarınızı bu mövzu altında verə bilərsiniz.', 'Monodoxia Mentor Komandası', '1 gün əvvəl', 67, 31, 1);

-- --------------------------------------------------------
-- Cədvəl: mdx_languages (Dəstəklənən Dillər)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_languages`;
CREATE TABLE `mdx_languages` (
  `code` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `flag` varchar(10) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_languages` (`code`, `name`, `flag`, `is_default`, `is_active`, `sort_order`) VALUES
('az', 'Azərbaycan', '🇦🇿', 1, 1, 1),
('en', 'English', '🇬🇧', 0, 1, 2),
('tr', 'Türkçe', '🇹🇷', 0, 1, 3),
('ru', 'Русский', '🇷🇺', 0, 1, 4);

-- --------------------------------------------------------
-- Cədvəl: mdx_translations (Mərkəzi Tərcümə Cədvəli)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_translations`;
CREATE TABLE `mdx_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` varchar(50) NOT NULL,
  `field_key` varchar(100) NOT NULL,
  `lang` varchar(10) NOT NULL,
  `translation_value` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `entity_lang_field` (`entity_type`, `entity_id`, `field_key`, `lang`),
  KEY `idx_entity` (`entity_type`, `entity_id`),
  KEY `idx_lang` (`lang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nümunə tərcümə qeydləri (Kurslar)
INSERT INTO `mdx_translations` (`entity_type`, `entity_id`, `field_key`, `lang`, `translation_value`) VALUES
('course', 'course-1', 'title', 'en', 'Self-Discovery and Consciousness Engineering'),
('course', 'course-1', 'title', 'tr', 'Kendini Tanıma ve Bilinç Mühendisliği'),
('course', 'course-1', 'title', 'ru', 'Самопознание и инженерия сознания'),
('course', 'course-1', 'description', 'en', 'Reprogramming subconscious belief systems, dissolving fears, and synchronizing with your higher self.'),
('course', 'course-1', 'description', 'tr', 'Bilinçaltı inanç sistemlerinin yeniden programlanması, korkuların aşılması ve benlikle senkronizasyon.'),
('course', 'course-1', 'description', 'ru', 'Перепрограммирование подсознательных установок, растворение страхов и синхронизация с высшим Я.');

COMMIT;

-- --------------------------------------------------------
-- Cədvəl: mdx_applications (Mərkəzi Müraciətlər və Qeydiyyatlar)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_applications`;
CREATE TABLE `mdx_applications` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `user_name` varchar(150) NOT NULL,
  `user_email` varchar(150) NOT NULL,
  `user_phone` varchar(50) DEFAULT NULL,
  `target_type` varchar(50) NOT NULL,
  `target_id` varchar(50) NOT NULL,
  `target_title` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Yeni',
  `payment_status` varchar(50) NOT NULL DEFAULT 'Tələb olunmur',
  `attendance_status` varchar(50) NOT NULL DEFAULT 'Gözlənilir',
  `price` varchar(50) DEFAULT NULL,
  `form_responses` longtext DEFAULT NULL,
  `user_note` text DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `applied_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_app_user` (`user_id`),
  KEY `idx_app_type` (`target_type`),
  KEY `idx_app_status` (`status`),
  KEY `idx_app_target` (`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- --------------------------------------------------------
-- Cədvəl: mdx_application_form_fields (Dinamik Form Sahələri)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_application_form_fields`;
CREATE TABLE `mdx_application_form_fields` (
  `id` varchar(50) NOT NULL,
  `target_type` varchar(50) NOT NULL DEFAULT 'all',
  `label` varchar(150) NOT NULL,
  `field_type` varchar(50) NOT NULL DEFAULT 'text',
  `options_json` text DEFAULT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_application_form_fields` (`id`, `target_type`, `label`, `field_type`, `options_json`, `placeholder`, `is_required`, `is_active`, `sort_order`) VALUES
('fld_phone', 'all', 'Əlaqə Nömrəsi (WhatsApp)', 'text', NULL, '+994 50 000 00 00', 1, 1, 1),
('fld_exp', 'all', 'Təcrübə / Hazırlıq Səviyyəniz', 'select', '[\"Başlanğıc (İlk dəfədir)\", \"Orta (Müəyyən təcrübəm var)\", \"İrəli (Peşəkar fəaliyyət)\"]', NULL, 1, 1, 2),
('fld_goal', 'all', 'Müraciət Məqsədi və Gözləntiləriniz', 'textarea', NULL, 'Bu proqramdan əsas öyrənmək istədiyiniz nədir?', 1, 1, 3),
('fld_prof', 'course', 'Peşəniz və Hazırkı Fəaliyyət Sahəniz', 'text', NULL, 'Məsələn: Həkim, Təhsilverən, Sahibkar...', 0, 1, 4),
('fld_file', 'course', 'CV / Rezüme və ya Sənəd Linki', 'text', NULL, 'Google Drive linki və ya sənəd URL', 0, 1, 5),
('fld_telegram', 'club', 'Telegram İstifadəçi Adınız (@username)', 'text', NULL, '@istifadeci_adi', 0, 1, 6),
('fld_source', 'event', 'Tədbir haqqında haradan eşitmisiniz?', 'select', '[\"Instagram / Sosial Şəbəkələr\", \"Dost tövsiyəsi\", \"Veb sayt / Axtarış\", \"Digər\"]', NULL, 0, 1, 7);

-- --------------------------------------------------------
-- Cədvəl: mdx_notifications (Sistem Bildirişləri)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_notifications`;
CREATE TABLE `mdx_notifications` (
  `id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_notif_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Cədvəl: mdx_categories (Mərkəzləşdirilmiş Kateqoriyalar və Çoxdilli Taksonomiya)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mdx_categories`;
CREATE TABLE `mdx_categories` (
  `id` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `target_type` varchar(50) NOT NULL DEFAULT 'course',
  `name` varchar(150) NOT NULL,
  `icon` varchar(50) DEFAULT 'category',
  `translations_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_category_slug` (`slug`),
  KEY `idx_category_type` (`target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `mdx_categories` (`id`, `slug`, `target_type`, `name`, `icon`, `translations_json`) VALUES
('cat-psychology', 'psychology', 'course', 'Psixologiya', 'psychology_alt', '{"az":{"name":"Psixologiya","desc":"Şüuraltı və arxetiplər"},"en":{"name":"Psychology","desc":"Subconscious mind and archetypes"},"tr":{"name":"Psikoloji","desc":"Bilinçaltı ve arketipler"},"ru":{"name":"Психология","desc":"Подсознание и архетипы"}}'),
('cat-eq', 'eq', 'course', 'Emosional İntellekt', 'sentiment_satisfied', '{"az":{"name":"Emosional İntellekt","desc":"Duyğuların idarə olunması"},"en":{"name":"Emotional Intelligence","desc":"Emotion regulation"},"tr":{"name":"Duygusal Zeka","desc":"Duygu yönetimi"},"ru":{"name":"Эмоциональный Интеллект","desc":"Управление эмоциями"}}'),
('cat-coaching', 'coaching', 'course', 'Kouçinq', 'trending_up', '{"az":{"name":"Kouçinq","desc":"Liderlik və inkişaf"},"en":{"name":"Coaching","desc":"Leadership and growth"},"tr":{"name":"Koçluk","desc":"Liderlik ve gelişim"},"ru":{"name":"Коучинг","desc":"Лидерство и развитие"}}'),
('cat-meditation', 'meditation', 'course', 'Meditasiya', 'self_improvement', '{"az":{"name":"Meditasiya","desc":"Sükut və nəfəs praktikaları"},"en":{"name":"Meditation","desc":"Stillness and breathwork"},"tr":{"name":"Meditasyon","desc":"Sessizlik ve nefes pratikleri"},"ru":{"name":"Медитация","desc":"Практики тишины и дыхания"}}');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

# MONODOXIA ACADEMY — HƏRTƏRƏFLİ TEXNİKİ AUDİT VƏ SİSTEM TƏHLİLİ HESABATI

**Layihə:** Monodoxia Academy Web  
**Versiya:** 2.5 Enterprise  
**Tarix:** 2026-10-17  
**Sənəd Növü:** Peşəkar Sistem Auditi, Memarlıq Təhlili və Qüsur Qeydiyyatı  

---

## 1. LAYİHƏ VƏ PLATFORMA İCMALI

Monodoxia Academy akademik psixologiya, qədim daxili fəlsəfə və müasir fərdi kouçinq metodologiyalarını birləşdirən elit fərdi inkişaf və tədris ekosistemidir.

### Texnologiya Yığını:
* **İstifadəçi İnterfeysi (Frontend):** React 18.3, Vite 5.4, Vanilla CSS (`css/design-system.css`), Tailwind CSS (CDN Runtime), Google Fonts, Material Symbols.
* **Server Tərəfi və API (Backend):** PHP 8.x PDO MySQL (`api.php`).
* **Verilənlər Bazası:** Hostinger MySQL / MariaDB (InnoDB, `utf8mb4_unicode_ci`, 13 əsas cədvəl).
* **Vəziyyət İdarəetməsi (State Management):** React Context API (`AppContext.jsx`, `LanguageContext.jsx`) + Brauzer `localStorage` sinxronizasiyası.
* **Beynəlmiləlləşmə (i18n):** 4 dil dəstəyi — Azərbaycan (`az`), İngilis (`en`), Türk (`tr`), Rus (`ru`).

---

## 2. MÖVCUD VƏ İCRA OLUNMUŞ FUNKSİONALLIQLAR

### 2.1 İctimai Portal və Səhifələr
* **Splash Screen:** SVG vektor animasiyaları, qızılı gradient effektləri, yüklənmə faiz sayğacı və avtomatik keçid mexanizmi.
* **Etik Təhlükəsizlik Bildirişi (Safety Banner):** Tibbi/kliniki xidmətləri əvəz etmədiyini göstərən hüquqi xəbərdarlıq zolağı.
* **Əsas Səhifə (Home):**
  * *Hero:* Dinamik çərçivə üslubları (Tağ, kəsikli, haşiyəli), video və şəkil rejimləri, sitat bloku, statistik göstəricilər.
  * *Məram və Dəyərlər (About):* 4 fundamental dəyər kartı və fəlsəfi təqdimat.
  * *8 Fundamental Sahə (Areas):* Psixologiya, Şəxsi İnkişaf, Spiritual Kouçinq, Mindfulness, Meditasiya, Münasibətlər, EQ, Özünü Tanıma.
  * *Akademiya Bölməsi (Academy):* Populyar kursların kartları, təlimçi və müddət göstəriciləri.
  * *Coaching Club:* Üzvlük üstünlükləri və abunəlik tariflərinin təqdimatı.
  * *Ekspertlər (Coaches):* Sertifikatlı mentorlar və rezervasiya bağlantısı.
  * *İcma Müzakirələri (Community):* Qapalı və açıq forum mövzuları, rəylər və bəyənmələr.
  * *Canlı Təqvim (Events):* Vebinar və oflayn tədbirlər cədvəli.
  * *Rəylər (Testimonials) & FAQ & Xəbər Bülleteni (Newsletter).*
* **Alt Səhifələr (Multi-Page Hash Routing):**
  * `/akademiya`: Bütün kurslar, modullar, dərslər və kateqoriya filtri.
  * `/koucinq`: Ekspert mentorlar heyəti, ixtisas filtri və fərdi seans rezervasiyası.
  * `/club`: Rezidentlik paketləri (Free, Basic, Premium, VIP), aylıq/illik ödəniş dövrü filtri.
  * `/tedbirler`: Təqvim cədvəli, onlayn/oflayn tədbirlər və iştirakçı qeydiyyatı.
  * `/icma`: İntellektual müzakirə mövzuları, axtarış və yeni mövzu açmaq.
  * `/haqqimizda`: Monodoxia manifesti, missiya və dəyərlər.

### 2.2 İnteraktiv Modallar Sistemi (31 Komponent)
* `AuthModal`: Giriş və Yeni Qeydiyyat pəncərəsi.
* `OnboardingModal`: Qeydiyyatdan sonra fərdi inkişaf fokus istiqamətlərinin seçilməsi sorğusu.
* `PlayerModal`: Dərslərin video/audio formatında izlənilməsi, dərsi tamamlama qeydi və tərəqqi faizi.
* `CertificateModal`: Rəsmi QR kodlu məzuniyyət sertifikatının baxışı və verifikasiyası.
* `BookingModal`: Kouçla saat dilimi və format seçərək fərdi seans sifarişi.
* `ApplicationModal`: Kurs və klub müraciətləri üçün dinamik form sahələri olan mərkəzləşdirilmiş müraciət sistemi.
* `ProfileModal`: Tələbə profili, cari müraciətlər, bildiriş mərkəzi, sertifikatlar və şifrə dəyişmə.
* `NewTopicModal`: İcma üçün yeni müzakirə başlığı yaratmaq.
* `AdminModal`: 17 paneldən ibarət Enterprise İdarəetmə Konsolu.

### 2.3 İdarəetmə Konsolu (Admin Panel Modulları)
* **İcmal & Statistika:** İstifadəçi, müraciət, maliyyə və sistem sağlamlığı göstəriciləri.
* **Müraciətlər:** Tələbə müraciətlərinin statuslarının idarə olunması (Yeni, Baxılır, Təsdiqləndi, Rədd edildi, Tamamlandı, Ləğv edildi).
* **Qeydiyyatlar:** Kurs və tədbir iştirakçılarının analitik hesabatı.
* **İstifadəçilər:** İstifadəçi siyahısı, axtarış, filtr, redaktə və silinmə.
* **Rollar & İcazələr (RBAC):** Dinamik rol yaratma, sistem rollarının qorunması, modul icazələri (`*`, `dashboard.*`, `content.*`, və s.).
* **Kurslar & LMS:** Kursların modulları, dərsləri, qiymətləri və kvota tənzimləmələri.
* **Kateqoriyalar:** Mərkəzləşdirilmiş taksonomiya idarəetməsi.
* **Club Tiers:** Abunəlik paketləri, qiymətlər, imtiyaz bəndləri və çoxdilli tərcümələr.
* **Tədbirlər:** Təqvimin yenilənməsi, spikerlər və yer limiti.
* **İcma:** Forum mövzularının moderasiyası, sabitlənməsi və silinməsi.
* **Tərcümələr (i18n):** Statik UI mətnləri və dinamik verilənlər bazası tərcümələri redaktoru.
* **Texniki Qulluq Ekranı (Maintenance Mode):** Saytın ziyarətçilər üçün bağlanması və yalnız adminlərin girişi.
* **Səhifələr & CMS Blokları:** Bütün ana səhifə bloklarının (Hero, About, Footer və s.) vizual redaktoru.
* **SQL Bazası:** Hostinger MySQL bağlantı testi, gecikmə (ping) monitorinqi və avtomatik cədvəl miqrasiyası.
* **Ümumi Parametrlər:** Sayt başlığı, valyuta, əlaqə vasitələri və qeydiyyat icazəsi.

---

## 3. KRİTİK XƏTALAR VƏ PROQRAMI DAYANDIRAN (CRASH) QÜSURLAR

### 🔴 Xəta 1: `CommunityPage.jsx` Fatal Ağ Ekran Xətası (`topicsList` is undefined)
* **Fayl:** `src/pages/CommunityPage.jsx` (Sətir 10, 26, 34)
* **Qüsur:** Komponent `useApp()`-dən `topicsList` dəyişənini çağırır. Lakin `AppContext.jsx` bu state-i `communityTopics` adlandırıb və `topicsList` adında dəyişən ixrac etmir.
* **Nəticə:** İstifadəçi menyudan "İcma" səhifəsinə kliklədikdə `TypeError: Cannot read properties of undefined (reading 'flatMap')` baş verir və bütün tətbiq çökərək ağ ekran verir.
* **Həlli:** `src/pages/CommunityPage.jsx` daxilində `topicsList` əvəzinə `communityTopics` istifadə edilməli və ya `AppContext.jsx`-də `topicsList: communityTopics` kimi təqdim olunmalıdır.

### 🔴 Xəta 2: `CoachingPage.jsx` Rezervasiya Xətası (`openBookingModal` is not a function)
* **Fayl:** `src/pages/CoachingPage.jsx` (Sətir 12 və 159)
* **Qüsur:** Səhifə `useApp()`-dən `openBookingModal` funksiyasını çağırır və düyməyə bağlayır: `onClick={() => openBookingModal(c)}`. Lakin `AppContext.jsx`-də bu funksiyanın adı `openBooking`-dir.
* **Nəticə:** İstifadəçi "Fərdi Seans Rezervasiya Et" düyməsinə kliklədikdə `TypeError: openBookingModal is not a function` xətası yaranır və əməliyyat icra olunmur.
* **Həlli:** Funksiya adları `openBooking` olaraq unifikasiya edilməlidir.

### 🔴 Xəta 3: `ClubPage.jsx` Fatal Tip Uyğunsuzluğu Xətası (`userTier.toLowerCase is not a function`)
* **Fayl:** `src/pages/ClubPage.jsx` (Sətir 84 və 157) + `src/context/AppContext.jsx` (Sətir 850)
* **Qüsur:** `ClubPage.jsx` daxilində qoşulma düyməsi bütün `tier` obyektini ötürür: `joinClubTier(tier)`. `AppContext.jsx` daxilindəki `joinClubTier` funksiyası isə `setUserTier(tier)` edərək string gözlənilən dəyişənə bütöv bir Object yazır. Re-render zamanı `ClubPage.jsx` sətir 84-də `userTier?.toLowerCase()` çağırılır.
* **Nəticə:** Obyekt üzərində string metodu çağırıldığı üçün `TypeError: userTier.toLowerCase is not a function` xətası çıxır və tətbiq qəzaya uğrayır. Eyni zamanda bildirişdə `"[object Object] üzvüsünüz"` kimi eybəcər mətn çıxır.
* **Həlli:** `joinClubTier` funksiyasına `tier.name` və ya `tier.id` ötürülməlidir; `userTier` dəyərinin daima string olması təmin edilməlidir.

### 🔴 Xəta 4: `BookingModal.jsx` Obyekt Xətası (`activeCoach.availableSlots.map`)
* **Fayl:** `src/components/modals/BookingModal.jsx` (Sətir 12 və 57)
* **Qüsur:** Komponent sətir 12-də ehtiyat `slots` massivi hazırlasa da, sətir 57-də birbaşa `activeCoach.availableSlots.map` çağırır. Əgər kouç obyektində `availableSlots` sahəsi boş və ya `undefined` olarsa, pəncərə runtime crash verir.
* **Həlli:** `slots.map(s => ...)` istifadə edilməlidir.

### 🔴 Xəta 5: `EventsPage.jsx` Filtr Qırılması (Heç bir tədbir tapılmır)
* **Fayl:** `src/pages/EventsPage.jsx` (Sətir 22 və 60-65)
* **Qüsur:** Tədbirlərin bazadakı nişanları `"CANLI VEBİNAR"`, `"PANEL MÜZAKİRƏ"` və s. formatındadır. Filtr düymələri isə dəqiq bərabərlik axtarır: `e.typeBadge?.toLowerCase() === 'vebinar'`.
* **Nəticə:** Dəqiq bərabərlik ödənmədiyi üçün istifadəçi hər hansı kateqoriyanı seçəndə tədbirlərin sayı dərhal 0-a düşür.
* **Həlli:** Dəqiq bərabərlik əvəzinə `e.typeBadge?.toLowerCase().includes(filterType.toLowerCase())` yoxlanışı tətbiq edilməlidir.

---

## 4. TƏHLÜKƏSİZLİK (SECURITY) BOŞLUQLARI VƏ RİSKLƏR

### 🚨 1. Şifrəsiz Giriş və Avtomatik Super Admin Bypass
* `AppContext.jsx` daxilində `login(email, password)` funksiyası ötürülən `password` parametrini tamamilə İQNOR edir! Heç bir şifrə yoxlanışı aparılmır.
* Hər hansı şəxs `admin@monodoxia.academy` yazıb istənilən uydurma şifrə ilə sistemə daxil olduqda, sistem onu Super Admin qəbul edir.
* Kodda `normalizedEmail.includes('admin') ? 'Admin' : ...` yazılıb! Yəni `badactor-admin@gmail.com` emaili ilə daxil olan hər kəsə avtomatik Admin hüququ verilir.

### 🚨 2. Qorumasız və İcazəsiz Backend API Endpoints (`api.php`)
* `api.php` daxilində heç bir sessiya (Session), JWT Token, API Key və ya CSRF qoruması YOXDUR.
* `header('Access-Control-Allow-Origin: *')` təyin edilib. İstənilən kənar veb-sayt və ya haker anonim HTTP sorğusu ilə:
  * `POST /api.php?action=delete_user`
  * `POST /api.php?action=delete_role`
  * `POST /api.php?action=save_settings`
  * `POST /api.php?action=migrate`
  çağıraraq bazadakı məlumatları silə, dəyişə və ya manipulyasiya edə bilər.

### 🚨 3. Açıq Mətndə Şifrə Sızması (Git Hardcoded Secret)
* `db_config.php` faylı daxilində Hostinger real verilənlər bazası şifrəsi açıq mətndə saxlanılıb:
  `$db_pass = getenv('DB_PASS') ?: 'Monodoxia@1!';`
* Bu fayl git anbarına düşdüyü üçün məxfi baza məlumatları təhlükə altındadır.

### 🚨 4. Profil Şifrə Dəyişməsinin Bazaya Yazılmaması
* `ProfileModal.jsx` daxilində şifrə dəyişdirildikdə cari şifrə yoxlanılmır və yeni şifrə MySQL bazasındakı `mdx_users.password_hash` sütununa sinxronlaşdırılmır. Yalnız local React state-də qalır.

---

## 5. VERİLƏNLƏR BAZASI VƏ SİNXRONİZASİYA ÇATIŞMAZLIQLARI

Platforma zahirən MySQL dəstəkli görünsə də, reallıqda **"Yarı-Mock / Yarı-Lokal"** vəziyyətdədir:

| Modul | Verilənlər Bazası Cədvəli | API CRUD Dəstəyi (`api.php`) | Frontend Sinxronizasiyası | Real Vəziyyət |
| :--- | :--- | :--- | :--- | :--- |
| **İstifadəçilər** | `mdx_users` | Var (`save_user`, `delete_user`) | Var | Tam sinxron |
| **Rollar (RBAC)** | `mdx_roles` | Var (`save_role`, `delete_role`) | Var | Tam sinxron |
| **Müraciətlər** | `mdx_applications` | Var (`submit_application`, və s.) | Var | Tam sinxron |
| **Klub Paketləri** | `mdx_club_tiers` | Var (`save_club_tier`, və s.) | Var | Tam sinxron |
| **Kurslar (LMS)** | `mdx_courses` | ❌ Yoxdur (Yalnız oxunur) | ❌ Yalnız localStorage | **Admin dəyişikliyi bazaya yazılmır** |
| **Tədbirlər** | `mdx_events` | ❌ Yoxdur (Yalnız oxunur) | ❌ Yalnız localStorage | **Admin dəyişikliyi bazaya yazılmır** |
| **İcma Mövzuları** | `mdx_community_posts` | ❌ Yoxdur (Yalnız oxunur) | ❌ Yalnız localStorage | **Yeni mövzular bazaya yazılmır** |
| **Kouçlar / Ekspertlər**| ❌ Cədvəl yoxdur | ❌ API yoxdur | ❌ Yalnız localStorage | **Baza dəstəyi yoxdur** |
| **CMS Blokları** | ❌ Cədvəl yoxdur | ❌ API yoxdur | ❌ Yalnız localStorage | **Fərqli brauzerdə görünmür** |
| **Tələbə LMS Tərəqqisi**| ❌ Cədvəl yoxdur | ❌ API yoxdur | ❌ Yalnız localStorage | **Cihaz dəyişəndə tərəqqi sıfırlanır** |
| **Sertifikatlar** | ❌ Cədvəl yoxdur | ❌ API yoxdur | ❌ Yalnız localStorage | **Məzuniyyət bazada qeyd olunmur** |

> **Əsas Nəticə:** Admin panelində kurs, tədbir, kouç və ya CMS mətni əlavə edildikdə, bu dəyişikliklər yalnız həmin kompyuterin brauzer yaddaşında qalır! Başqa cihazdan və ya gizli rejimdən girən ziyarətçilər köhnə ilkin məlumatları görür.

---

## 6. MƏHSULDARLIQ (PERFORMANCE) VƏ MEMARLIQ ÇATIŞMAZLIQLARI

### 1. Tailwind Play CDN İstehsalatda (Production Anti-Pattern)
* `index.html` faylında `<script src="https://cdn.tailwindcss.com"></script>` istifadə olunur.
* Bu kitabxana hər səhifə yüklənəndə brauzerin içində JavaScript ilə CSS yaradır.
* Nəticə: Səhifə açılışında vizual sıçrayışlar (FOUC), mobil telefonlarda yüksək CPU/RAM istifadəsi və internet zəif olanda saytın dizaynsız açılması.
* Həlli: Tailwind CSS layihəyə `npm`-lə qurulmalı və Vite vasitəsilə statik CSS kimi derlənməlidir.

### 2. Nəhəng Monolit JavaScript Paketi (757 kB)
* Bütün 31 modal, 17 admin paneli, tərcümə lüğətləri və mock verilənlər birbaşa `dist/assets/index-DSrYkkev.js` (757 kB minified) faylına yığılıb.
* Heç bir `React.lazy()` və ya dinamik modul yüklənməsi yoxdur. Sayta daxil olan adi bir telefon istifadəçisi heç vaxt açmayacağı Admin Panelinin yüzlərlə kilobaytlıq kodunu yükləməyə məcbur olur.

### 3. Təmizlənməmiş Qalıq Fayllar (Legacy Technical Debt)
* Layihə qovluğunda React-ə keçməmişdən əvvəlki ilkin prototip faylları hələ də qalır:
  * `code.html` (70 KB köhnə tək səhifəlik şablon)
  * `js/app.js` (32 KB köhnə vanilla JS kodu)
  * `js/data.js` (15 KB)
  * `js/i18n.js` (23 KB)
* Bu fayllar heç bir yerdə işlədilmir, layihə həcmini süni artırır və çaşqınlıq yaradır.

### 4. Ekspertlər Heyətinin Boş Başlaması
* `src/data/mockData.js` daxilində `export const COACHES = [];` massivi boş saxlanılıb.
* İlkin açılışda ana səhifədə və kouçinq səhifəsində heç bir mentor görünmür, "Ekspert Heyəti Formalaşdırılır" yazısı çıxır və ziyarətçi seans sifariş edə bilmir.

---

## 7. ÖDƏNİŞ VƏ REAL BİZNES İNTEQRASİYALARININ ƏKSİKLİYİ

1. **Ödəniş Şlüzünün Olmaması:**
   * Kurslar (₼ 290 – ₼ 640), Klub üzvlükləri (₼ 45 – ₼ 250) və Fərdi kouçinq üçün real ödəniş sistemi (Kapital Bank / BirBank, Paşa Bank, Stripe və ya GoldenPay) inteqrasiya olunmayıb.
   * Bütün ödənişlər sistemdə sadəcə "Gözlənilir" və ya "Tələb olunmur" statusu ilə qeyd edilir.
2. **Kouçinq Təqvim İnteqrasiyasının Olmaması:**
   * Kouçların real iş saatları Google Calendar, Calendly və ya daxili vaxt rezervasiyası ilə sinxronlaşdırılmayıb. Saatlar statik string olaraq qalır.
3. **Video Yayım İnfrastrukturunun Olmaması:**
   * Dərslər üçün YouTube / Vimeo / Cloudflare Stream və ya HLS təhlükəsiz video pleyer infrastrukturu qurulmayıb. Sadəcə dummy HTML5 player və ya şərti linklər mövcuddur.

---

## 8. TƏCİLİ DÜZƏLİŞ VƏ İNKİŞAF YOL XƏRİTƏSİ (ACTION PLAN)

### Faza 1: Təcili Kritik Düzəlişlər (P0 - Immediate Fixes)
1. `CommunityPage.jsx` daxilində `topicsList` xətasını `communityTopics` ilə əvəzləmək.
2. `CoachingPage.jsx` daxilində `openBookingModal` çağırışını `openBooking` ilə əvəzləmək.
3. `ClubPage.jsx` daxilində `joinClubTier(tier.id)` düzəlişini edərək tətbiqin çöküşünün qarşısını almaq.
4. `EventsPage.jsx` filtrində `.includes()` məntiqini tətbiq etmək.
5. `BookingModal.jsx` daxilində ehtiyat massivi `slots.map` ilə render etmək.
6. `mockData.js` daxilində standart ilkin kouçlar heyətini doldurmaq.

### Faza 2: Təhlükəsizlik və Autentifikasiya (P1 - Security)
1. `api.php` daxilində həqiqi `login` əməliyyatı yaratmaq, şifrəni `password_verify()` ilə yoxlamaq.
2. Admin və redaktə əməliyyatları üçün sessiya və ya gizli `X-Admin-Token` təhlükəsizlik başlığı tətbiq etmək.
3. `AppContext.jsx` daxilindəki avtomatik admin hüququ verən uydurma `email.includes('admin')` kodunu ləğv etmək.
4. `db_config.php` faylındakı açıq şifrəni təmizləmək və yalnız `.env` üzərindən oxumaq.

### Faza 3: Tam Baza Sinxronizasiyası (P2 - Backend CRUD)
1. `api.php` daxilində çatışmayan endpoint-ləri tamamlamaq:
   * `save_course`, `delete_course`
   * `save_event`, `delete_event`
   * `save_community_post`, `delete_community_post`
   * `save_coach`, `delete_coach`
   * `save_cms_content`, `get_cms_content`
2. `mdx_coaches`, `mdx_cms_blocks`, `mdx_student_progress`, `mdx_student_certificates` cədvəllərini bazaya əlavə etmək.
3. Frontend tərəfində `localStorage`-i yalnız oflayn ehtiyat (cache) kimi saxlamaq, əsas məlumatları MySQL API-dən oxumaq və yazmaq.

### Faza 4: Kod Təmizliyi və Performans (P3 - Optimization)
1. Layihədən köhnə lazımsız qalıq faylları (`code.html`, `js/app.js`, `js/data.js`, `js/i18n.js`) silmək.
2. `AdminModal` və onun ağır alt panellərini `React.lazy()` ilə parçalayaraq əsas bundle ölçüsünü 757 kB-dan 200 kB-a endirmək.
3. CDN Tailwind-i tam ləğv edərək lokal Vite Tailwind PostCSS derlənməsinə keçmək.

---

**Hesabatı Hazırladı:** Antigravity AI Senior Architecture & Security Audit Specialist  
**Status:** Düzəlişlərə Hazırdır (Ready for Remediation)

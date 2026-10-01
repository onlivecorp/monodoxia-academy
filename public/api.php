<?php
/**
 * Monodoxia Academy - Hostinger MySQL Backend API
 * Verilənlər bazası ilə vebsayt arasında məlumat körpüsü
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Xarici konfiqurasiya faylı varsa yüklə (db_config.php)
if (file_exists(__DIR__ . '/db_config.php')) {
    require_once __DIR__ . '/db_config.php';
}

// Support .env file loading if present
if (file_exists(__DIR__ . '/.env')) {
    $envLines = @file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($envLines) {
        foreach ($envLines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($envKey, $envVal) = explode('=', $line, 2);
                $envKey = trim($envKey);
                $envVal = trim($envVal, " \t\n\r\0\x0B\"'");
                if (!array_key_exists($envKey, $_SERVER) && !array_key_exists($envKey, $_ENV)) {
                    putenv("$envKey=$envVal");
                    $_ENV[$envKey] = $envVal;
                    $_SERVER[$envKey] = $envVal;
                }
            }
        }
    }
}

// Hostinger Baza Parametrləri (Environment və ya birbaşa təyin edilmiş dəyərlər)
$db_host = getenv('DB_HOST') ?: ($db_host ?? 'localhost');
$db_name = getenv('DB_NAME') ?: ($db_name ?? 'u310078278_monodoxia');
$db_user = getenv('DB_USER') ?: ($db_user ?? 'u310078278_monodoxia');
$db_pass = getenv('DB_PASS') ?: ($db_pass ?? 'BURAYA_SQL_SIFRENIZI_YAZIN'); // Hostinger-də təyin etdiyiniz şifrə

$action = $_GET['action'] ?? 'status';

// Əgər şifrə hələ dəyişdirilməyibsə və status yoxlanılırsa, izahlı cavab qaytar
if ($db_pass === 'BURAYA_SQL_SIFRENIZI_YAZIN') {
    if ($action === 'status') {
        echo json_encode([
            'status' => 'config_required',
            'message' => 'Hostinger SQL şifrəsi hələ təyin edilməyib. api.php faylında və ya db_config.php faylında $db_pass dəyərini daxil edin.',
            'database' => $db_name,
            'host' => $db_host,
            'user' => $db_user
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
}

try {
    $pdo = new PDO("mysql:host={$db_host};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Verilənlər bazasına qoşulmaq mümkün olmadı: ' . $e->getMessage(),
        'database' => $db_name,
        'host' => $db_host
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 1. STATUS VƏ PING YOXLANILMASI
// --------------------------------------------------------
if ($action === 'status') {
    $startTime = microtime(true);
    $tables = [];
    try {
        $stmt = $pdo->query("SHOW TABLES LIKE 'mdx_%'");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $ex) {}
    $latency = round((microtime(true) - $startTime) * 1000, 1);

    echo json_encode([
        'status' => 'success',
        'message' => 'Hostinger MySQL bazasına uğurla qoşuldu!',
        'database' => $db_name,
        'host' => $db_host,
        'tables_count' => count($tables),
        'tables' => $tables,
        'latency_ms' => $latency,
        'time' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 2. BÜTÜN MƏLUMATLARIN ALINMASI (GET_ALL)
// --------------------------------------------------------
if ($action === 'get_all') {
    $lang = $_GET['lang'] ?? 'az';

    $safeQuery = function($sql) use ($pdo) {
        try {
            return $pdo->query($sql)->fetchAll();
        } catch (PDOException $e) {
            return [];
        }
    };

    $users = $safeQuery("SELECT * FROM mdx_users");
    $courses = $safeQuery("SELECT * FROM mdx_courses");
    $tiers = $safeQuery("SELECT * FROM mdx_club_tiers");
    $events = $safeQuery("SELECT * FROM mdx_events");
    $community = $safeQuery("SELECT * FROM mdx_community_posts");
    $settings = $safeQuery("SELECT * FROM mdx_settings");
    $languages = $safeQuery("SELECT * FROM mdx_languages WHERE is_active = 1 ORDER BY sort_order ASC");
    $translations = $safeQuery("SELECT * FROM mdx_translations");
    $applications = $safeQuery("SELECT * FROM mdx_applications WHERE archived = 0 ORDER BY applied_at DESC");
    $form_fields = $safeQuery("SELECT * FROM mdx_application_form_fields WHERE is_active = 1 ORDER BY sort_order ASC");
    $notifications = $safeQuery("SELECT * FROM mdx_notifications ORDER BY created_at DESC LIMIT 50");
    $categories = $safeQuery("SELECT * FROM mdx_categories ORDER BY created_at ASC");

    echo json_encode([
        'status' => 'success',
        'lang' => $lang,
        'users' => $users,
        'courses' => $courses,
        'club_tiers' => $tiers,
        'events' => $events,
        'community' => $community,
        'settings' => $settings,
        'languages' => $languages,
        'translations' => $translations,
        'applications' => $applications,
        'form_fields' => $form_fields,
        'notifications' => $notifications,
        'categories' => $categories
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 3. TƏRCÜMƏLƏR APİ ENDPOİNTLƏRİ
// --------------------------------------------------------
if ($action === 'get_translations') {
    $entity_type = $_GET['entity_type'] ?? null;
    $entity_id = $_GET['entity_id'] ?? null;
    $lang = $_GET['lang'] ?? null;

    $sql = "SELECT * FROM mdx_translations WHERE 1=1";
    $params = [];

    if ($entity_type) {
        $sql .= " AND entity_type = ?";
        $params[] = $entity_type;
    }
    if ($entity_id) {
        $sql .= " AND entity_id = ?";
        $params[] = $entity_id;
    }
    if ($lang) {
        $sql .= " AND lang = ?";
        $params[] = $lang;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'count' => count($rows),
        'translations' => $rows
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_translation' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $entity_type = $input['entity_type'] ?? null;
    $entity_id = $input['entity_id'] ?? null;
    $field_key = $input['field_key'] ?? null;
    $lang = $input['lang'] ?? null;
    $val = $input['translation_value'] ?? '';

    if (!$entity_type || !$entity_id || !$field_key || !$lang) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Eksik parametr'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_translations (entity_type, entity_id, field_key, lang, translation_value)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE translation_value = VALUES(translation_value), updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$entity_type, $entity_id, $field_key, $lang, $val]);

    echo json_encode(['status' => 'success', 'message' => 'Tərcümə yadda saxlandı'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 3.5. İSTİFADƏÇİ ƏMƏLİYYATLARI (USERS APİ)
// --------------------------------------------------------
if ($action === 'get_users') {
    $stmt = $pdo->query("SELECT id, name, email, role, tier, status, joined_date FROM mdx_users ORDER BY joined_date DESC");
    $users = $stmt->fetchAll();
    echo json_encode(['status' => 'success', 'users' => $users], JSON_UNESCAPED_UNICODE);
    exit();
}

if (($action === 'register_user' || $action === 'save_user') && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }
    
    $id = $input['id'] ?? ('usr_' . round(microtime(true) * 1000));
    $name = trim($input['name'] ?? (($input['firstName'] ?? '') . ' ' . ($input['lastName'] ?? '')));
    $email = trim($input['email'] ?? '');
    $role = $input['role'] ?? 'Tələbə';
    $tier = $input['tier'] ?? 'Free';
    $status = $input['status'] ?? 'Aktiv';
    $password = $input['password'] ?? null;
    $password_hash = $password ? password_hash($password, PASSWORD_DEFAULT) : null;
    $joined_date = $input['joined_date'] ?? $input['joinedDate'] ?? date('Y-m-d');

    if (!$email) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if (!$name) {
        $name = explode('@', $email)[0];
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_users (id, name, email, password_hash, role, tier, status, joined_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            name = VALUES(name),
            role = VALUES(role),
            tier = VALUES(tier),
            status = VALUES(status),
            password_hash = COALESCE(VALUES(password_hash), password_hash)
    ");
    $stmt->execute([$id, $name, $email, $password_hash, $role, $tier, $status, $joined_date]);

    echo json_encode([
        'status' => 'success',
        'message' => 'İstifadəçi bazaya yazıldı',
        'user' => [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'tier' => $tier,
            'status' => $status,
            'joined_date' => $joined_date
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM mdx_users WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'İstifadəçi silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 4. MÜRACİƏTLƏR VƏ QEYDİYYATLAR APİ ENDPOİNTLƏRİ
// --------------------------------------------------------
if ($action === 'get_applications') {
    $user_id = $_GET['user_id'] ?? null;
    $target_type = $_GET['target_type'] ?? null;
    $status = $_GET['status'] ?? null;
    $include_archived = ($_GET['include_archived'] ?? '0') === '1';

    $sql = "SELECT * FROM mdx_applications WHERE 1=1";
    $params = [];

    if (!$include_archived) {
        $sql .= " AND archived = 0";
    }
    if ($user_id) {
        $sql .= " AND user_id = ?";
        $params[] = $user_id;
    }
    if ($target_type && $target_type !== 'all') {
        $sql .= " AND target_type = ?";
        $params[] = $target_type;
    }
    if ($status && $status !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $status;
    }

    $sql .= " ORDER BY applied_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $apps = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'count' => count($apps),
        'applications' => $apps
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'submit_application' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $user_id = trim($input['user_id'] ?? '');
    $user_name = trim($input['user_name'] ?? '');
    $user_email = trim($input['user_email'] ?? '');
    $user_phone = trim($input['user_phone'] ?? '');
    $target_type = trim($input['target_type'] ?? '');
    $target_id = trim($input['target_id'] ?? '');
    $target_title = trim($input['target_title'] ?? '');
    $price = $input['price'] ?? '0';
    $form_responses = is_array($input['form_responses'] ?? null) ? json_encode($input['form_responses'], JSON_UNESCAPED_UNICODE) : ($input['form_responses'] ?? '{}');
    $user_note = $input['user_note'] ?? null;

    if (!$user_id || !$user_email || !$target_type || !$target_id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Məcburi sahələr doldurulmalıdır.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Duplicate check: Prevent duplicate active application for same target
    $dupStmt = $pdo->prepare("SELECT id, status FROM mdx_applications WHERE user_id = ? AND target_id = ? AND status NOT IN ('Rədd edildi', 'Ləğv edildi') AND archived = 0 LIMIT 1");
    $dupStmt->execute([$user_id, $target_id]);
    $existing = $dupStmt->fetch();

    if ($existing) {
        http_response_code(409);
        echo json_encode([
            'status' => 'error',
            'code' => 'DUPLICATE_APPLICATION',
            'message' => "Siz artıq bu proqram üzrə müraciət etmisiniz. Cari status: {$existing['status']}",
            'existing_id' => $existing['id']
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $app_id = 'APP-' . strtoupper(substr(uniqid(), -6));
    $stmt = $pdo->prepare("
        INSERT INTO mdx_applications (id, user_id, user_name, user_email, user_phone, target_type, target_id, target_title, price, form_responses, user_note, status, payment_status, attendance_status, applied_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Yeni', 'Tələb olunmur', 'Gözlənilir', NOW())
    ");
    $stmt->execute([$app_id, $user_id, $user_name, $user_email, $user_phone, $target_type, $target_id, $target_title, $price, $form_responses, $user_note]);

    // Send initial notification
    try {
        $notifStmt = $pdo->prepare("
            INSERT INTO mdx_notifications (id, user_id, title, message, type, is_read, created_at)
            VALUES (?, ?, ?, ?, 'info', 0, NOW())
        ");
        $notifStmt->execute([
            'NOTIF-' . uniqid(),
            $user_id,
            'Müraciətiniz Qəbul Edildi',
            "\"{$target_title}\" üzrə müraciətiniz qeydə alındı. Administrator tərəfindən baxılır."
        ]);
    } catch (PDOException $ne) {}

    echo json_encode([
        'status' => 'success',
        'message' => 'Müraciətiniz uğurla göndərildi!',
        'application_id' => $app_id
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'update_application_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $id = $input['id'] ?? null;
    $new_status = $input['status'] ?? null;
    $admin_note = $input['admin_note'] ?? null;
    $payment_status = $input['payment_status'] ?? null;
    $attendance_status = $input['attendance_status'] ?? null;

    if (!$id || !$new_status) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID və status tələb olunur.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Fetch existing
    $getStmt = $pdo->prepare("SELECT * FROM mdx_applications WHERE id = ?");
    $getStmt->execute([$id]);
    $app = $getStmt->fetch();

    if (!$app) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Müraciət tapılmadı.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $sql = "UPDATE mdx_applications SET status = ?";
    $params = [$new_status];

    if ($admin_note !== null) {
        $sql .= ", admin_note = ?";
        $params[] = $admin_note;
    }
    if ($payment_status !== null) {
        $sql .= ", payment_status = ?";
        $params[] = $payment_status;
    }
    if ($attendance_status !== null) {
        $sql .= ", attendance_status = ?";
        $params[] = $attendance_status;
    }
    $sql .= " WHERE id = ?";
    $params[] = $id;

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Notify user
    try {
        $notifType = ($new_status === 'Təsdiqləndi' || $new_status === 'Tamamlandı') ? 'success' : (($new_status === 'Rədd edildi' || $new_status === 'Ləğv edildi') ? 'error' : 'warning');
        $notifMsg = "Sizin \"{$app['target_title']}\" müraciətinizin statusu yeniləndi: {$new_status}.";
        if ($admin_note) {
            $notifMsg .= " Qeyd: {$admin_note}";
        }

        $notifStmt = $pdo->prepare("
            INSERT INTO mdx_notifications (id, user_id, title, message, type, is_read, created_at)
            VALUES (?, ?, ?, ?, ?, 0, NOW())
        ");
        $notifStmt->execute([
            'NOTIF-' . uniqid(),
            $app['user_id'],
            "Status Yeniləndi: {$new_status}",
            $notifMsg,
            $notifType
        ]);
    } catch (PDOException $ne) {}

    echo json_encode([
        'status' => 'success',
        'message' => "Müraciət statusu uğurla yeniləndi ({$new_status})",
        'id' => $id
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_application' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    $permanent = ($input['permanent'] ?? false) === true;

    if (!$id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID göstərilməyib'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if ($permanent) {
        $stmt = $pdo->prepare("DELETE FROM mdx_applications WHERE id = ?");
    } else {
        $stmt = $pdo->prepare("UPDATE mdx_applications SET archived = 1 WHERE id = ?");
    }
    $stmt->execute([$id]);

    echo json_encode(['status' => 'success', 'message' => 'Müraciət uğurla silindi / arxivləşdirildi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 5. DİNAMİK FORM SAHƏLƏRİ APİ ENDPOİNTLƏRİ
// --------------------------------------------------------
if ($action === 'get_form_fields') {
    $target_type = $_GET['target_type'] ?? null;
    $sql = "SELECT * FROM mdx_application_form_fields WHERE is_active = 1";
    $params = [];
    if ($target_type) {
        $sql .= " AND (target_type = ? OR target_type = 'all')";
        $params[] = $target_type;
    }
    $sql .= " ORDER BY sort_order ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['status' => 'success', 'fields' => $stmt->fetchAll()], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_form_field' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? ('fld_' . uniqid());
    $target_type = $input['target_type'] ?? 'all';
    $label = $input['label'] ?? '';
    $field_type = $input['field_type'] ?? 'text';
    $options_json = is_array($input['options'] ?? null) ? json_encode($input['options'], JSON_UNESCAPED_UNICODE) : ($input['options_json'] ?? null);
    $placeholder = $input['placeholder'] ?? '';
    $is_required = !empty($input['is_required']) || !empty($input['isRequired']) ? 1 : 0;
    $is_active = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
    $sort_order = intval($input['sort_order'] ?? ($input['sortOrder'] ?? 0));

    $stmt = $pdo->prepare("
        INSERT INTO mdx_application_form_fields (id, target_type, label, field_type, options_json, placeholder, is_required, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            target_type = VALUES(target_type),
            label = VALUES(label),
            field_type = VALUES(field_type),
            options_json = VALUES(options_json),
            placeholder = VALUES(placeholder),
            is_required = VALUES(is_required),
            is_active = VALUES(is_active),
            sort_order = VALUES(sort_order)
    ");
    $stmt->execute([$id, $target_type, $label, $field_type, $options_json, $placeholder, $is_required, $is_active, $sort_order]);

    echo json_encode(['status' => 'success', 'message' => 'Form sahəsi yadda saxlandı', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_form_field' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM mdx_application_form_fields WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Form sahəsi silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 6. BİLDİRİŞLƏR (NOTIFICATIONS) APİ ENDPOİNTLƏRİ
// --------------------------------------------------------
if ($action === 'get_notifications') {
    $user_id = $_GET['user_id'] ?? null;
    if (!$user_id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'İstifadəçi ID tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }
    $stmt = $pdo->prepare("SELECT * FROM mdx_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30");
    $stmt->execute([$user_id]);

    echo json_encode(['status' => 'success', 'notifications' => $stmt->fetchAll()], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'mark_notification_read' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    $user_id = $input['user_id'] ?? null;

    if ($id === 'all' && $user_id) {
        $stmt = $pdo->prepare("UPDATE mdx_notifications SET is_read = 1 WHERE user_id = ?");
        $stmt->execute([$user_id]);
    } else if ($id) {
        $stmt = $pdo->prepare("UPDATE mdx_notifications SET is_read = 1 WHERE id = ?");
        $stmt->execute([$id]);
    }

    echo json_encode(['status' => 'success', 'message' => 'Bildiriş oxunmuş kimi qeyd edildi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 7. KATEQORİYALAR (CATEGORIES) APİ ENDPOİNTLƏRİ
// --------------------------------------------------------
if ($action === 'get_categories') {
    $target_type = $_GET['target_type'] ?? null;
    $sql = "SELECT * FROM mdx_categories WHERE 1=1";
    $params = [];
    if ($target_type && $target_type !== 'all') {
        $sql .= " AND (target_type = ? OR target_type = 'all')";
        $params[] = $target_type;
    }
    $sql .= " ORDER BY created_at ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['status' => 'success', 'categories' => $stmt->fetchAll()], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_category' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? ('cat-' . uniqid());
    $slug = $input['slug'] ?? ($input['key'] ?? $id);
    $target_type = $input['target_type'] ?? ($input['type'] ?? 'course');
    $name = $input['name'] ?? '';
    $icon = $input['icon'] ?? 'category';
    $translations_json = is_array($input['translations'] ?? null)
        ? json_encode($input['translations'], JSON_UNESCAPED_UNICODE)
        : ($input['translations_json'] ?? '{}');

    if (!$name) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Kateqoriya adı tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_categories (id, slug, target_type, name, icon, translations_json, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            target_type = VALUES(target_type),
            name = VALUES(name),
            icon = VALUES(icon),
            translations_json = VALUES(translations_json)
    ");
    $stmt->execute([$id, $slug, $target_type, $name, $icon, $translations_json]);

    echo json_encode(['status' => 'success', 'message' => 'Kateqoriya yadda saxlandı', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_category' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM mdx_categories WHERE id = ? OR slug = ?");
        $stmt->execute([$id, $id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Kateqoriya silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 8. CƏDVƏLLƏRİN AVTOMATİK MİQRASİYASI (MIGRATE TABLES)
// --------------------------------------------------------
if ($action === 'migrate' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $results = [];

    // 1. mdx_settings
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_settings` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `key_name` varchar(100) NOT NULL,
            `key_value` text DEFAULT NULL,
            `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`id`),
            UNIQUE KEY `key_name` (`key_name`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_settings';

    // 2. mdx_users
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_users` (
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
    ");
    $results[] = 'mdx_users';

    // 3. mdx_courses
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_courses` (
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
    ");
    $results[] = 'mdx_courses';

    // 4. mdx_club_tiers
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_club_tiers` (
            `id` varchar(50) NOT NULL,
            `name` varchar(100) NOT NULL,
            `price` varchar(50) NOT NULL,
            `period` varchar(50) NOT NULL,
            `popular` tinyint(1) NOT NULL DEFAULT 0,
            `features_json` text NOT NULL,
            `active` tinyint(1) NOT NULL DEFAULT 1,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_club_tiers';

    // 5. mdx_events
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_events` (
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
    ");
    $results[] = 'mdx_events';

    // 6. mdx_community_posts
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_community_posts` (
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
    ");
    $results[] = 'mdx_community_posts';

    // 7. mdx_languages
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_languages` (
            `code` varchar(10) NOT NULL,
            `name` varchar(50) NOT NULL,
            `flag` varchar(10) NOT NULL,
            `is_default` tinyint(1) NOT NULL DEFAULT 0,
            `is_active` tinyint(1) NOT NULL DEFAULT 1,
            `sort_order` int(11) NOT NULL DEFAULT 0,
            PRIMARY KEY (`code`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_languages';

    // 8. mdx_translations
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_translations` (
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
    ");
    $results[] = 'mdx_translations';

    // 9. mdx_applications
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_applications` (
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
    ");
    $results[] = 'mdx_applications';

    // 10. mdx_application_form_fields
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_application_form_fields` (
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
    ");
    $results[] = 'mdx_application_form_fields';

    // 11. mdx_notifications
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_notifications` (
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
    ");
    $results[] = 'mdx_notifications';

    // 12. mdx_categories
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_categories` (
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
    ");
    $results[] = 'mdx_categories';

    // Seed default categories if empty
    $catCount = $pdo->query("SELECT COUNT(*) FROM mdx_categories")->fetchColumn();
    if ($catCount == 0) {
        $pdo->exec("
            INSERT INTO `mdx_categories` (`id`, `slug`, `target_type`, `name`, `icon`, `translations_json`) VALUES
            ('cat-psychology', 'psychology', 'course', 'Psixologiya', 'psychology_alt', '{\"az\":{\"name\":\"Psixologiya\",\"desc\":\"Şüuraltı və arxetiplər\"},\"en\":{\"name\":\"Psychology\",\"desc\":\"Subconscious mind and archetypes\"},\"tr\":{\"name\":\"Psikoloji\",\"desc\":\"Bilinçaltı ve arketipler\"},\"ru\":{\"name\":\"Психология\",\"desc\":\"Подсознание и архетипы\"}}'),
            ('cat-eq', 'eq', 'course', 'Emosional İntellekt', 'sentiment_satisfied', '{\"az\":{\"name\":\"Emosional İntellekt\",\"desc\":\"Duyğuların idarə olunması\"},\"en\":{\"name\":\"Emotional Intelligence\",\"desc\":\"Emotion regulation\"},\"tr\":{\"name\":\"Duygusal Zeka\",\"desc\":\"Duygu yönetimi\"},\"ru\":{\"name\":\"Эмоциональный Интеллект\",\"desc\":\"Управление эмоциями\"}}'),
            ('cat-coaching', 'coaching', 'course', 'Kouçinq', 'trending_up', '{\"az\":{\"name\":\"Kouçinq\",\"desc\":\"Liderlik və inkişaf\"},\"en\":{\"name\":\"Coaching\",\"desc\":\"Leadership and growth\"},\"tr\":{\"name\":\"Koçluk\",\"desc\":\"Liderlik ve gelişim\"},\"ru\":{\"name\":\"Коучинг\",\"desc\":\"Лидерство и развитие\"}}'),
            ('cat-meditation', 'meditation', 'course', 'Meditasiya', 'self_improvement', '{\"az\":{\"name\":\"Meditasiya\",\"desc\":\"Sükut və nəfəs praktikaları\"},\"en\":{\"name\":\"Meditation\",\"desc\":\"Stillness and breathwork\"},\"tr\":{\"name\":\"Meditasyon\",\"desc\":\"Sessizlik ve nefes pratikleri\"},\"ru\":{\"name\":\"Медитация\",\"desc\":\"Практики тишины и дыхания\"}}');
        ");
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Bütün SQL cədvəlləri uğurla yoxlanıldı və sinxronlaşdırıldı!',
        'migrated_tables' => $results
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 9. NAMƏLUM ƏMƏLİYYAT (UNKNOWN ACTION)
// --------------------------------------------------------
http_response_code(400);
echo json_encode([
    'status' => 'error',
    'message' => "Naməlum API əməliyyatı: " . htmlspecialchars($action)
], JSON_UNESCAPED_UNICODE);
exit();

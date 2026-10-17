<?php
/**
 * Monodoxia Academy - Hostinger MySQL Backend API
 * Verilənlər bazası ilə vebsayt arasında məlumat körpüsü
 */

// 1. Təhlükəsiz Sessiya Konfiqurasiyası
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    $isHttps = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') 
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    if ($isHttps) {
        ini_set('session.cookie_secure', '1');
    }
    session_set_cookie_params([
        'lifetime' => 86400 * 7,
        'path' => '/',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 2. CORS və İcazəli Origin Konfiqurasiyası (Credentials dəstəyi ilə)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
];

$isAllowedOrigin = false;
if ($origin) {
    $parsed = parse_url($origin);
    $host = $parsed['host'] ?? '';
    if (in_array($origin, $allowedOrigins, true) ||
        preg_match('/(^|\.)monodoxia\.academy$/i', $host) ||
        (isset($_SERVER['HTTP_HOST']) && $host === parse_url('http://' . $_SERVER['HTTP_HOST'], PHP_URL_HOST))) {
        $isAllowedOrigin = true;
    }
}

if ($isAllowedOrigin) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-Migration-Key');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Konfiqurasiya və .env Yüklənməsi
if (file_exists(__DIR__ . '/db_config.php')) {
    require_once __DIR__ . '/db_config.php';
}

$envPath = file_exists(__DIR__ . '/.env') ? (__DIR__ . '/.env') : (file_exists(dirname(__DIR__) . '/.env') ? (dirname(__DIR__) . '/.env') : null);
if ($envPath) {
    $envLines = @file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
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

$db_host = getenv('DB_HOST') ?: ($db_host ?? 'localhost');
$db_name = getenv('DB_NAME') ?: ($db_name ?? 'u310078278_monodoxia');
$db_user = getenv('DB_USER') ?: ($db_user ?? 'u310078278_monodoxia');
$db_pass = getenv('DB_PASS') ?: ($db_pass ?? '');

$action = $_GET['action'] ?? 'status';

if (empty($db_pass)) {
    if ($action === 'status') {
        echo json_encode([
            'status' => 'config_required',
            'message' => 'Hostinger SQL şifrəsi təyin edilməyib. Zəhmət olmasa .env faylında DB_PASS parametrini daxil edin.',
            'database' => $db_name,
            'host' => $db_host,
            'user' => $db_user
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Verilənlər bazası konfiqurasiyası natamamdır (DB_PASS yoxdur).'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $pdo = new PDO("mysql:host={$db_host};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database connection error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Verilənlər bazasına qoşulmaq mümkün olmadı. Zəhmət olmasa konfiqurasiyanı yoxlayın.',
        'database' => $db_name,
        'host' => $db_host
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// ========================================================
// TƏHLÜKƏSİZLİK VƏ RBAC KÖMƏKÇİ FUNKSİYALARI
// ========================================================
function verifyCsrfToken() {
    $headers = getallheaders();
    $tokenFromHeader = $headers['X-CSRF-Token'] ?? ($headers['x-csrf-token'] ?? null);
    $rawInput = file_get_contents('php://input');
    $jsonInput = json_decode($rawInput, true);
    $tokenFromBody = $jsonInput['csrf_token'] ?? ($_POST['csrf_token'] ?? null);

    $token = $tokenFromHeader ?: $tokenFromBody;
    if ($token && hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        return true;
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false || strpos($origin, 'monodoxia.academy') !== false)) {
        return true;
    }

    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'CSRF yoxlanışı uğursuz oldu (403 Forbidden)'], JSON_UNESCAPED_UNICODE);
    exit();
}

function getSessionUser($pdo) {
    if (empty($_SESSION['user_id'])) {
        return null;
    }
    $stmt = $pdo->prepare("SELECT id, name, email, role, tier, status, joined_date FROM mdx_users WHERE id = ? LIMIT 1");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch() ?: null;
}

function requireAuthUser($pdo) {
    $user = getSessionUser($pdo);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => 'unauthorized', 'message' => 'Giriş tələb olunur (401 Unauthorized)'], JSON_UNESCAPED_UNICODE);
        exit();
    }
    return $user;
}

function requireAdminUser($pdo) {
    $user = requireAuthUser($pdo);
    if ($user['role'] === 'Admin') {
        return $user;
    }
    try {
        $stmt = $pdo->prepare("SELECT permissions FROM mdx_roles WHERE code = ? OR name = ? LIMIT 1");
        $stmt->execute([$user['role'], $user['role']]);
        $roleData = $stmt->fetch();
        if ($roleData && !empty($roleData['permissions'])) {
            $perms = json_decode($roleData['permissions'], true);
            if (is_array($perms) && (in_array('*', $perms) || in_array('all', $perms) || in_array('admin.access', $perms))) {
                return $user;
            }
        }
    } catch (Exception $e) {}

    http_response_code(403);
    echo json_encode(['status' => 'forbidden', 'message' => 'Admin hüququ tələb olunur (403 Forbidden)'], JSON_UNESCAPED_UNICODE);
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

    $users = $safeQuery("SELECT id, name, email, role, tier, status, joined_date FROM mdx_users");
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
    $roles = $safeQuery("SELECT * FROM mdx_roles ORDER BY is_system DESC, name ASC");
    $coaches = $safeQuery("SELECT * FROM mdx_coaches WHERE is_active = 1 ORDER BY created_at ASC");
    $cms_blocks = $safeQuery("SELECT block_key, content_json FROM mdx_cms_blocks");

    $student_progress = [];
    $student_certificates = [];
    $bookings = [];
    if (!empty($_SESSION['user_id'])) {
        try {
            $pStmt = $pdo->prepare("SELECT course_id, completed_lessons_json, percent FROM mdx_student_progress WHERE user_id = ?");
            $pStmt->execute([$_SESSION['user_id']]);
            $student_progress = $pStmt->fetchAll();

            $cStmt = $pdo->prepare("SELECT * FROM mdx_student_certificates WHERE user_id = ? ORDER BY created_at DESC");
            $cStmt->execute([$_SESSION['user_id']]);
            $student_certificates = $cStmt->fetchAll();

            $bStmt = $pdo->prepare("SELECT * FROM mdx_bookings WHERE user_id = ? ORDER BY created_at DESC");
            $bStmt->execute([$_SESSION['user_id']]);
            $bookings = $bStmt->fetchAll();
        } catch (PDOException $e) {}
    }

    echo json_encode([
        'status' => 'success',
        'lang' => $lang,
        'csrf_token' => $_SESSION['csrf_token'] ?? null,
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
        'categories' => $categories,
        'roles' => $roles,
        'coaches' => $coaches,
        'cms_blocks' => $cms_blocks,
        'student_progress' => $student_progress,
        'student_certificates' => $student_certificates,
        'bookings' => $bookings
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
    requireAdminUser($pdo);
    verifyCsrfToken();
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
// 3.5. KİMLİK DOĞRULAMA VƏ İSTİFADƏÇİ ƏMƏLİYYATLARI (AUTH & USERS API)
// --------------------------------------------------------

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $email = trim($input['email'] ?? '');
    $password = (string)($input['password'] ?? '');

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email və şifrə daxil edilməlidir.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("SELECT id, name, email, password_hash, role, tier, status, joined_date FROM mdx_users WHERE LOWER(email) = LOWER(?) LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Email və ya şifrə yanlışdır.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if (isset($user['status']) && $user['status'] !== 'Aktiv' && $user['status'] !== 'active') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Hesabınız aktiv deyil.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $verified = false;
    if (empty($user['password_hash'])) {
        // First login for pre-seeded user without password: initialize hash
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        $up = $pdo->prepare("UPDATE mdx_users SET password_hash = ? WHERE id = ?");
        $up->execute([$newHash, $user['id']]);
        $verified = true;
    } else {
        $verified = password_verify($password, $user['password_hash']);
    }

    if (!$verified) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Email və ya şifrə yanlışdır.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];

    unset($user['password_hash']);
    $user['csrf_token'] = $_SESSION['csrf_token'];

    echo json_encode([
        'status' => 'success',
        'message' => 'Uğurla daxil oldunuz.',
        'user' => $user,
        'csrf_token' => $_SESSION['csrf_token']
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'Çıxış edildi.'], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'me' || $action === 'get_session') {
    $user = getSessionUser($pdo);
    if ($user) {
        echo json_encode([
            'status' => 'success',
            'authenticated' => true,
            'user' => $user,
            'csrf_token' => $_SESSION['csrf_token']
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'status' => 'success',
            'authenticated' => false,
            'csrf_token' => $_SESSION['csrf_token']
        ], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

if ($action === 'change_password' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    verifyCsrfToken();
    $user = requireAuthUser($pdo);
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $currentPass = (string)($input['currentPassword'] ?? ($input['current_password'] ?? ''));
    $newPass = (string)($input['newPassword'] ?? ($input['new_password'] ?? ''));

    if (strlen($newPass) < 8 || !preg_match('/[A-Za-z]/', $newPass) || !preg_match('/[0-9]/', $newPass)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Yeni şifrə ən azı 8 simvol olmalı, ən azı bir hərf və bir rəqəm ehtiva etməlidir.'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("SELECT password_hash FROM mdx_users WHERE id = ? LIMIT 1");
    $stmt->execute([$user['id']]);
    $currentHash = $stmt->fetchColumn();

    if (!empty($currentHash) && !password_verify($currentPass, $currentHash)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Cari şifrə yanlışdır.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $newHash = password_hash($newPass, PASSWORD_DEFAULT);
    $up = $pdo->prepare("UPDATE mdx_users SET password_hash = ? WHERE id = ?");
    $up->execute([$newHash, $user['id']]);

    echo json_encode(['status' => 'success', 'message' => 'Şifrəniz uğurla yeniləndi.'], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'get_users') {
    requireAdminUser($pdo);
    $stmt = $pdo->query("SELECT id, name, email, role, tier, status, joined_date FROM mdx_users ORDER BY joined_date DESC");
    $users = $stmt->fetchAll();
    echo json_encode(['status' => 'success', 'users' => $users], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'register_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = 'usr_' . round(microtime(true) * 1000);
    $name = trim($input['name'] ?? (($input['firstName'] ?? '') . ' ' . ($input['lastName'] ?? '')));
    $email = trim($input['email'] ?? '');
    $password = (string)($input['password'] ?? '');

    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Düzgün email daxil edin.'], JSON_UNESCAPED_UNICODE);
        exit();
    }
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.'], JSON_UNESCAPED_UNICODE);
        exit();
    }
    if (!$name) {
        $name = explode('@', $email)[0];
    }

    $chk = $pdo->prepare("SELECT id FROM mdx_users WHERE LOWER(email) = LOWER(?) LIMIT 1");
    $chk->execute([$email]);
    if ($chk->fetch()) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Bu email artıq qeydiyyatdan keçib.'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    $role = 'Tələbə'; // Public registration strictly assigns Student role
    $tier = 'Free';
    $status = 'Aktiv';
    $joined_date = date('Y-m-d');

    $stmt = $pdo->prepare("
        INSERT INTO mdx_users (id, name, email, password_hash, role, tier, status, joined_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$id, $name, $email, $password_hash, $role, $tier, $status, $joined_date]);

    session_regenerate_id(true);
    $_SESSION['user_id'] = $id;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = $role;

    echo json_encode([
        'status' => 'success',
        'message' => 'Qeydiyyat uğurla tamamlandı.',
        'user' => [
            'id' => $id,
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'tier' => $tier,
            'status' => $status,
            'joined_date' => $joined_date,
            'csrf_token' => $_SESSION['csrf_token']
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_user' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    
    $id = $input['id'] ?? ('usr_' . round(microtime(true) * 1000));
    $name = trim($input['name'] ?? (($input['firstName'] ?? '') . ' ' . ($input['lastName'] ?? '')));
    $email = trim($input['email'] ?? '');
    $role = $input['role'] ?? 'Tələbə';
    $tier = $input['tier'] ?? 'Free';
    $status = $input['status'] ?? 'Aktiv';
    $password = !empty($input['password']) ? (string)$input['password'] : null;
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
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = $input['id'] ?? null;
    if ($id) {
        if ($id === ($_SESSION['user_id'] ?? '')) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Cari daxil olmuş admin hesabı silinə bilməz!'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        $stmt = $pdo->prepare("DELETE FROM mdx_users WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'İstifadəçi silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 3.6. ROLLAR VƏ İCAZƏLƏR APİ (RBAC - ROLE-BASED ACCESS CONTROL)
// --------------------------------------------------------
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_roles` (
            `id` varchar(50) NOT NULL,
            `name` varchar(100) NOT NULL,
            `code` varchar(50) NOT NULL,
            `description` text DEFAULT NULL,
            `is_system` tinyint(1) NOT NULL DEFAULT 0,
            `is_active` tinyint(1) NOT NULL DEFAULT 1,
            `color` varchar(30) DEFAULT '#b45309',
            `badge_class` varchar(100) DEFAULT NULL,
            `permissions` longtext DEFAULT NULL,
            `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `code` (`code`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $checkCount = $pdo->query("SELECT COUNT(*) FROM mdx_roles")->fetchColumn();
    if ($checkCount == 0) {
        $initRoles = [
            [
                'id' => 'role-admin',
                'name' => 'Super Admin',
                'code' => 'Admin',
                'description' => 'Bütün sistem modullarına və təhlükəsizlik tənzimləmələrinə tam məhdudiyyətsiz giriş hüququ.',
                'is_system' => 1,
                'is_active' => 1,
                'color' => '#b45309',
                'badge_class' => 'bg-amber-100 text-amber-800 border-amber-300',
                'permissions' => json_encode(['*'], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'role-moderator',
                'name' => 'Moderator',
                'code' => 'Moderator',
                'description' => 'Müraciətlərə, qeydiyyatlara, istifadəçilərə və icma müzakirələrinə operativ nəzarət və moderasiya hüququ.',
                'is_system' => 1,
                'is_active' => 1,
                'color' => '#2563eb',
                'badge_class' => 'bg-blue-100 text-blue-800 border-blue-300',
                'permissions' => json_encode([
                    'dashboard.view', 'applications.view', 'applications.approve', 'applications.reject', 'applications.export',
                    'registrations.view', 'registrations.export', 'users.view', 'users.edit',
                    'community.view', 'community.create', 'community.edit', 'community.delete', 'events.view'
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'role-coach',
                'name' => 'Kouç & Ekspert',
                'code' => 'Kouç',
                'description' => 'Kurslar, dərslər, tədbirlər və icma sessiyalarını idarə etmək üçün tədris heyəti hüququ.',
                'is_system' => 1,
                'is_active' => 1,
                'color' => '#059669',
                'badge_class' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                'permissions' => json_encode([
                    'dashboard.view', 'courses.view', 'courses.create', 'courses.edit', 'courses.publish',
                    'events.view', 'events.create', 'events.edit', 'community.view', 'community.create', 'categories.view'
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'role-editor',
                'name' => 'Məzmun Redaktoru',
                'code' => 'Məzmun Redaktoru',
                'description' => 'CMS məzmunları, tərcümələr, kateqoriyalar və bloq/forum idarəetmə hüququ.',
                'is_system' => 0,
                'is_active' => 1,
                'color' => '#7c3aed',
                'badge_class' => 'bg-purple-100 text-purple-800 border-purple-300',
                'permissions' => json_encode([
                    'dashboard.view', 'content.view', 'content.edit', 'translations.view', 'translations.edit',
                    'categories.view', 'categories.create', 'categories.edit', 'community.view', 'community.edit'
                ], JSON_UNESCAPED_UNICODE)
            ],
            [
                'id' => 'role-student',
                'name' => 'Tələbə (İstifadəçi)',
                'code' => 'Tələbə',
                'description' => 'Platformanın standart tələbə və üzv hesabı. Yalnız öz dərslərinə və ictimai imkanlara giriş.',
                'is_system' => 1,
                'is_active' => 1,
                'color' => '#64748b',
                'badge_class' => 'bg-slate-100 text-slate-800 border-slate-300',
                'permissions' => json_encode([], JSON_UNESCAPED_UNICODE)
            ]
        ];

        $ins = $pdo->prepare("
            INSERT INTO mdx_roles (id, name, code, description, is_system, is_active, color, badge_class, permissions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($initRoles as $r) {
            $ins->execute([
                $r['id'], $r['name'], $r['code'], $r['description'],
                $r['is_system'], $r['is_active'], $r['color'], $r['badge_class'], $r['permissions']
            ]);
        }
    }
} catch (PDOException $e) {}

// Avtomatik miqrasiya: translations sütunlarının yoxlanılması
try {
    $pdo->exec("ALTER TABLE mdx_roles ADD COLUMN translations LONGTEXT DEFAULT NULL");
} catch (PDOException $e) {}
try {
    $pdo->exec("ALTER TABLE mdx_club_tiers ADD COLUMN translations LONGTEXT DEFAULT NULL");
} catch (PDOException $e) {}

if ($action === 'get_roles') {
    try {
        $stmt = $pdo->query("SELECT * FROM mdx_roles ORDER BY is_system DESC, name ASC");
        $roles = $stmt->fetchAll();
        foreach ($roles as &$r) {
            if (!empty($r['permissions']) && is_string($r['permissions'])) {
                $decoded = json_decode($r['permissions'], true);
                if (is_array($decoded)) {
                    $r['permissions'] = $decoded;
                }
            }
            if (!empty($r['translations']) && is_string($r['translations'])) {
                $decodedTrans = json_decode($r['translations'], true);
                if (is_array($decodedTrans)) {
                    $r['translations'] = $decodedTrans;
                }
            }
        }
        echo json_encode(['status' => 'success', 'roles' => $roles], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

if ($action === 'save_role' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    $id = trim($input['id'] ?? ('role-' . round(microtime(true) * 1000)));
    $name = trim($input['name'] ?? '');
    $code = trim($input['code'] ?? $name);
    $description = trim($input['description'] ?? '');
    $is_system = !empty($input['isSystem']) || !empty($input['is_system']) ? 1 : 0;
    $is_active = isset($input['isActive']) ? ($input['isActive'] ? 1 : 0) : (isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1);
    $color = $input['color'] ?? '#b45309';
    $badge_class = $input['badgeClass'] ?? $input['badge_class'] ?? 'bg-amber-100 text-amber-800 border-amber-300';
    $permissions = $input['permissions'] ?? [];
    if (is_array($permissions)) {
        $permissionsJson = json_encode($permissions, JSON_UNESCAPED_UNICODE);
    } else {
        $permissionsJson = (string)$permissions;
    }
    $translations = $input['translations'] ?? [];
    $translationsJson = is_array($translations) ? json_encode($translations, JSON_UNESCAPED_UNICODE) : (string)$translations;

    if (!$name || !$code) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Rol adı və kodu tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Təhlükəsizlik: Super Admin (Admin) rolu deaktiv edilə və ya səlahiyyətləri tam silinə bilməz
    if ($code === 'Admin') {
        $is_system = 1;
        $is_active = 1;
        $permissionsJson = json_encode(['*'], JSON_UNESCAPED_UNICODE);
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_roles (id, name, code, description, is_system, is_active, color, badge_class, permissions, translations)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            code = VALUES(code),
            description = VALUES(description),
            is_active = VALUES(is_active),
            color = VALUES(color),
            badge_class = VALUES(badge_class),
            permissions = VALUES(permissions),
            translations = VALUES(translations),
            updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$id, $name, $code, $description, $is_system, $is_active, $color, $badge_class, $permissionsJson, $translationsJson]);

    // Cascade role code update to users if code changed
    $old_code = trim($input['oldCode'] ?? $input['old_code'] ?? '');
    if ($old_code && $old_code !== $code && $old_code !== 'Admin') {
        try {
            $userStmt = $pdo->prepare("UPDATE mdx_users SET role = ? WHERE role = ?");
            $userStmt->execute([$code, $old_code]);
        } catch (Exception $e) {}
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Rol məlumatları bazada yeniləndi',
        'role' => [
            'id' => $id,
            'name' => $name,
            'code' => $code,
            'description' => $description,
            'isSystem' => (bool)$is_system,
            'isActive' => (bool)$is_active,
            'color' => $color,
            'badgeClass' => $badge_class,
            'permissions' => is_array($permissions) ? $permissions : json_decode($permissionsJson, true),
            'translations' => is_array($translations) ? $translations : json_decode($translationsJson, true)
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_role' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    $code = $input['code'] ?? null;

    if (!$id && !$code) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Rol ID tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $checkStmt = $pdo->prepare("SELECT * FROM mdx_roles WHERE id = ? OR code = ? LIMIT 1");
    $checkStmt->execute([$id, $code]);
    $roleRow = $checkStmt->fetch();

    if ($roleRow) {
        if ($roleRow['is_system'] == 1 || in_array($roleRow['code'], ['Admin', 'Tələbə', 'Kouç', 'Moderator'])) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Kritik sistem rolları silinə bilməz!'], JSON_UNESCAPED_UNICODE);
            exit();
        }
        $del = $pdo->prepare("DELETE FROM mdx_roles WHERE id = ?");
        $del->execute([$roleRow['id']]);
    }

    echo json_encode(['status' => 'success', 'message' => 'Rol sistemdən silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_club_tier' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) $input = $_POST;

    $id = trim($input['id'] ?? ('tier-' . round(microtime(true) * 1000)));
    $name = trim($input['name'] ?? '');
    $price = trim($input['price'] ?? '0');
    $period = trim($input['period'] ?? '/ aylıq');
    $popular = !empty($input['popular']) ? 1 : 0;
    $active = isset($input['active']) ? ($input['active'] ? 1 : 0) : 1;
    $features = $input['features'] ?? [];
    $featuresJson = is_array($features) ? json_encode($features, JSON_UNESCAPED_UNICODE) : (string)$features;
    $translations = $input['translations'] ?? [];
    $translationsJson = is_array($translations) ? json_encode($translations, JSON_UNESCAPED_UNICODE) : (string)$translations;

    if (!$name) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Paket adı tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_club_tiers (id, name, price, period, popular, features_json, active, translations)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            price = VALUES(price),
            period = VALUES(period),
            popular = VALUES(popular),
            features_json = VALUES(features_json),
            active = VALUES(active),
            translations = VALUES(translations)
    ");
    $stmt->execute([$id, $name, $price, $period, $popular, $featuresJson, $active, $translationsJson]);

    echo json_encode(['status' => 'success', 'message' => 'Abunəlik paketi bazada saxlanıldı'], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_club_tier' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    if ($id) {
        $del = $pdo->prepare("DELETE FROM mdx_club_tiers WHERE id = ?");
        $del->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Abunəlik paketi silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_settings' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }
    if ($input && is_array($input)) {
        $stmt = $pdo->prepare("
            INSERT INTO mdx_settings (key_name, key_value)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)
        ");
        foreach ($input as $k => $v) {
            $valStr = (is_array($v) || is_object($v)) ? json_encode($v, JSON_UNESCAPED_UNICODE) : (string)$v;
            $stmt->execute([$k, $valStr]);
        }
    }
    echo json_encode(['status' => 'success', 'message' => 'Parametrlər yadda saxlandı'], JSON_UNESCAPED_UNICODE);
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
    requireAdminUser($pdo);
    verifyCsrfToken();
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
    requireAdminUser($pdo);
    verifyCsrfToken();
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
    requireAdminUser($pdo);
    verifyCsrfToken();
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
    requireAdminUser($pdo);
    verifyCsrfToken();
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
// 7.5. KURSLAR VƏ PROQRAMLAR APİ (COURSES API)
// --------------------------------------------------------
if ($action === 'save_course' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? ('course-' . round(microtime(true) * 1000)));
    $category = trim($input['category'] ?? 'psychology');
    $badge = trim($input['badge'] ?? 'KURS');
    $badge_class = trim($input['badgeClass'] ?? ($input['badge_class'] ?? 'bg-secondary/10 text-secondary'));
    $duration = trim($input['duration'] ?? '8 Həftə');
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $instructor = trim($input['instructor'] ?? 'Monodoxia Mentor');
    $instructor_role = trim($input['instructorRole'] ?? ($input['instructor_role'] ?? 'Kouç'));
    $status = trim($input['status'] ?? 'Qrup qəbulu aktivdir');
    $occupancy = intval($input['occupancy'] ?? 0);
    $price = trim($input['price'] ?? '0');
    $featured = !empty($input['featured']) ? 1 : 0;
    $is_online = isset($input['isOnline']) ? ($input['isOnline'] ? 1 : 0) : (isset($input['is_online']) ? ($input['is_online'] ? 1 : 0) : 1);

    $translations = $input['translations'] ?? [];
    $translations_json = is_array($translations) ? json_encode($translations, JSON_UNESCAPED_UNICODE) : (string)$translations;

    $modules = $input['modules'] ?? [];
    $modules_json = is_array($modules) ? json_encode($modules, JSON_UNESCAPED_UNICODE) : (string)$modules;

    $tags = $input['tags'] ?? [];
    $tags_json = is_array($tags) ? json_encode($tags, JSON_UNESCAPED_UNICODE) : (string)$tags;

    if (!$title) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Kursun başlığı tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_courses (id, category, badge, badge_class, duration, title, description, instructor, instructor_role, status, occupancy, price, featured, is_online, translations_json, modules_json, tags_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            category = VALUES(category),
            badge = VALUES(badge),
            badge_class = VALUES(badge_class),
            duration = VALUES(duration),
            title = VALUES(title),
            description = VALUES(description),
            instructor = VALUES(instructor),
            instructor_role = VALUES(instructor_role),
            status = VALUES(status),
            occupancy = VALUES(occupancy),
            price = VALUES(price),
            featured = VALUES(featured),
            is_online = VALUES(is_online),
            translations_json = VALUES(translations_json),
            modules_json = VALUES(modules_json),
            tags_json = VALUES(tags_json)
    ");
    $stmt->execute([
        $id, $category, $badge, $badge_class, $duration, $title, $description,
        $instructor, $instructor_role, $status, $occupancy, $price, $featured,
        $is_online, $translations_json, $modules_json, $tags_json
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Kurs məlumatları bazada saxlanıldı', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_course' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = $input['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM mdx_courses WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Kurs silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 7.6. TƏDBİRLƏR VƏ VEBİNARLAR APİ (EVENTS API)
// --------------------------------------------------------
if ($action === 'save_event' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? ('event-' . round(microtime(true) * 1000)));
    $title = trim($input['title'] ?? '');
    $datetime_label = trim($input['datetime'] ?? ($input['datetime_label'] ?? 'Tezliklə'));
    $type_badge = trim($input['typeBadge'] ?? ($input['type_badge'] ?? 'VEBİNAR'));
    $badge_class = trim($input['badgeClass'] ?? ($input['badge_class'] ?? 'bg-secondary/10 text-secondary'));
    $speaker = trim($input['speaker'] ?? 'Ekspert');
    $speaker_role = trim($input['speakerRole'] ?? ($input['speaker_role'] ?? 'Spiker'));
    $capacity = intval($input['capacity'] ?? 100);
    $registered = intval($input['registered'] ?? 0);
    $description = trim($input['desc'] ?? ($input['description'] ?? ''));
    $is_online = isset($input['isOnline']) ? ($input['isOnline'] ? 1 : 0) : (isset($input['is_online']) ? ($input['is_online'] ? 1 : 0) : 1);

    $translations = $input['translations'] ?? [];
    $translations_json = is_array($translations) ? json_encode($translations, JSON_UNESCAPED_UNICODE) : (string)$translations;

    $tags = $input['tags'] ?? [];
    $tags_json = is_array($tags) ? json_encode($tags, JSON_UNESCAPED_UNICODE) : (string)$tags;

    if (!$title) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Tədbirin adı tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_events (id, title, datetime_label, type_badge, badge_class, speaker, speaker_role, capacity, registered, description, is_online, translations_json, tags_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            datetime_label = VALUES(datetime_label),
            type_badge = VALUES(type_badge),
            badge_class = VALUES(badge_class),
            speaker = VALUES(speaker),
            speaker_role = VALUES(speaker_role),
            capacity = VALUES(capacity),
            registered = VALUES(registered),
            description = VALUES(description),
            is_online = VALUES(is_online),
            translations_json = VALUES(translations_json),
            tags_json = VALUES(tags_json)
    ");
    $stmt->execute([
        $id, $title, $datetime_label, $type_badge, $badge_class, $speaker,
        $speaker_role, $capacity, $registered, $description, $is_online,
        $translations_json, $tags_json
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Tədbir bazada saxlanıldı', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_event' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = $input['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM mdx_events WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Tədbir silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 7.7. İCMA VƏ FORUM APİ (COMMUNITY POSTS API)
// --------------------------------------------------------
if ($action === 'save_community_post' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $authUser = requireAuthUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? ('topic-' . round(microtime(true) * 1000)));
    $title = trim($input['title'] ?? '');
    $snippet = trim($input['snippet'] ?? ($input['content'] ?? ''));
    $content = trim($input['content'] ?? $snippet);
    $badge = trim($input['badge'] ?? 'İcma Müzakirəsi');
    $author = trim($input['author'] ?? $authUser['name']);
    $time_ago = trim($input['time'] ?? ($input['time_ago'] ?? 'İndicə'));
    $pinned = !empty($input['pinned']) ? 1 : 0;
    $likes = intval($input['likes'] ?? 0);
    $replies = intval($input['repliesCount'] ?? ($input['replies'] ?? 0));
    $author_role = trim($input['authorRole'] ?? ($input['author_role'] ?? $authUser['role']));
    $author_avatar = trim($input['authorAvatar'] ?? ($input['author_avatar'] ?? ''));
    $category = trim($input['category'] ?? 'general');

    $translations = $input['translations'] ?? [];
    $translations_json = is_array($translations) ? json_encode($translations, JSON_UNESCAPED_UNICODE) : (string)$translations;

    if (!$title) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Mövzunun başlığı tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_community_posts (id, badge, title, snippet, content, author, author_role, author_avatar, time_ago, likes, replies, pinned, category, translations_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            badge = VALUES(badge),
            title = VALUES(title),
            snippet = VALUES(snippet),
            content = VALUES(content),
            author = VALUES(author),
            author_role = VALUES(author_role),
            author_avatar = VALUES(author_avatar),
            time_ago = VALUES(time_ago),
            pinned = VALUES(pinned),
            category = VALUES(category),
            translations_json = VALUES(translations_json)
    ");
    $stmt->execute([
        $id, $badge, $title, $snippet, $content, $author, $author_role,
        $author_avatar, $time_ago, $likes, $replies, $pinned, $category,
        $translations_json
    ]);

    echo json_encode(['status' => 'success', 'message' => 'İcma mövzusu dərc edildi', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_community_post' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $authUser = requireAuthUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = $input['id'] ?? null;
    if ($id) {
        if ($authUser['role'] === 'Admin') {
            $stmt = $pdo->prepare("DELETE FROM mdx_community_posts WHERE id = ?");
            $stmt->execute([$id]);
        } else {
            $stmt = $pdo->prepare("DELETE FROM mdx_community_posts WHERE id = ? AND author = ?");
            $stmt->execute([$id, $authUser['name']]);
        }
    }
    echo json_encode(['status' => 'success', 'message' => 'Mövzu silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'like_community_post' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = $input['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("UPDATE mdx_community_posts SET likes = likes + 1 WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Bəyənmə qeydə alındı'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 7.8. KOUÇLAR VƏ EKSPERTLƏR APİ (COACHES API)
// --------------------------------------------------------
if ($action === 'save_coach' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? ('coach-' . round(microtime(true) * 1000)));
    $name = trim($input['name'] ?? '');
    $title = trim($input['title'] ?? 'Kouç & Ekspert');
    $bio = trim($input['bio'] ?? ($input['experience'] ?? ''));
    $rating = floatval($input['rating'] ?? 5.0);
    $reviews_count = intval($input['reviewsCount'] ?? ($input['reviews_count'] ?? 0));
    $hourly_rate = trim($input['hourlyRate'] ?? ($input['hourly_rate'] ?? '100 ₼ / saat'));
    $session_duration = trim($input['sessionDuration'] ?? ($input['session_duration'] ?? '60 dəqiqə'));
    $avatar_url = trim($input['image'] ?? ($input['avatarUrl'] ?? ($input['avatar_url'] ?? '')));
    $is_active = isset($input['isActive']) ? ($input['isActive'] ? 1 : 0) : (isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1);

    $specialties = $input['specialties'] ?? [];
    $specialties_json = is_array($specialties) ? json_encode($specialties, JSON_UNESCAPED_UNICODE) : (string)$specialties;

    $languages = $input['languages'] ?? [];
    $languages_json = is_array($languages) ? json_encode($languages, JSON_UNESCAPED_UNICODE) : (string)$languages;

    $available_slots = $input['availableSlots'] ?? ($input['available_slots'] ?? []);
    $available_slots_json = is_array($available_slots) ? json_encode($available_slots, JSON_UNESCAPED_UNICODE) : (string)$available_slots;

    $translations = $input['translations'] ?? [];
    $translations_json = is_array($translations) ? json_encode($translations, JSON_UNESCAPED_UNICODE) : (string)$translations;

    if (!$name) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Kouç adı tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_coaches (id, name, title, bio, rating, reviews_count, hourly_rate, session_duration, specialties_json, languages_json, available_slots_json, translations_json, avatar_url, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            title = VALUES(title),
            bio = VALUES(bio),
            rating = VALUES(rating),
            reviews_count = VALUES(reviews_count),
            hourly_rate = VALUES(hourly_rate),
            session_duration = VALUES(session_duration),
            specialties_json = VALUES(specialties_json),
            languages_json = VALUES(languages_json),
            available_slots_json = VALUES(available_slots_json),
            translations_json = VALUES(translations_json),
            avatar_url = VALUES(avatar_url),
            is_active = VALUES(is_active)
    ");
    $stmt->execute([
        $id, $name, $title, $bio, $rating, $reviews_count, $hourly_rate,
        $session_duration, $specialties_json, $languages_json,
        $available_slots_json, $translations_json, $avatar_url, $is_active
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Kouç profili saxlanıldı', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'delete_coach' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = $input['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM mdx_coaches WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(['status' => 'success', 'message' => 'Kouç silindi'], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 7.9. CMS MƏZMUN BLOKLARI APİ (CMS BLOCKS API)
// --------------------------------------------------------
if ($action === 'save_cms_block' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $block_key = trim($input['block_key'] ?? ($input['key'] ?? ''));
    $content = $input['content'] ?? ($input['content_json'] ?? null);
    $content_json = is_array($content) ? json_encode($content, JSON_UNESCAPED_UNICODE) : (string)$content;

    if (!$block_key || !$content_json) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Blok açarı və məzmun tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_cms_blocks (block_key, content_json)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$block_key, $content_json]);

    echo json_encode(['status' => 'success', 'message' => 'CMS bloku yadda saxlandı', 'block_key' => $block_key], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'get_cms_content') {
    try {
        $stmt = $pdo->query("SELECT block_key, content_json, updated_at FROM mdx_cms_blocks");
        $rows = $stmt->fetchAll();
        $blocks = [];
        foreach ($rows as $r) {
            $blocks[$r['block_key']] = json_decode($r['content_json'], true) ?: $r['content_json'];
        }
        echo json_encode(['status' => 'success', 'blocks' => $blocks], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'success', 'blocks' => []], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// --------------------------------------------------------
// 7.10. TƏLƏBƏ TƏRƏQQİSİ, SERTİFİKATLAR VƏ REZERVASİYALAR APİ
// --------------------------------------------------------
if ($action === 'save_student_progress' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $authUser = requireAuthUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $course_id = trim($input['course_id'] ?? ($input['courseId'] ?? ''));
    $lessons = $input['completed_lessons'] ?? ($input['completedLessons'] ?? []);
    $lessons_json = is_array($lessons) ? json_encode($lessons, JSON_UNESCAPED_UNICODE) : (string)$lessons;
    $percent = intval($input['percent'] ?? 0);

    if (!$course_id) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Kurs ID tələb olunur'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $stmt = $pdo->prepare("
        INSERT INTO mdx_student_progress (user_id, course_id, completed_lessons_json, percent)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE completed_lessons_json = VALUES(completed_lessons_json), percent = VALUES(percent), updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$authUser['id'], $course_id, $lessons_json, $percent]);

    echo json_encode(['status' => 'success', 'message' => 'Tərəqqi yadda saxlandı'], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_certificate' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $authUser = requireAuthUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? ('MDX-' . mt_rand(100000, 999999)));
    $course_id = trim($input['course_id'] ?? ($input['courseId'] ?? ''));
    $course_title = trim($input['course_title'] ?? ($input['courseTitle'] ?? ''));
    $student_name = trim($input['student_name'] ?? ($input['studentName'] ?? $authUser['name']));
    $instructor = trim($input['instructor'] ?? 'Monodoxia Mentor');
    $issue_date = trim($input['date'] ?? ($input['issue_date'] ?? date('Y-m-d')));

    $stmt = $pdo->prepare("
        INSERT INTO mdx_student_certificates (id, user_id, course_id, course_title, student_name, instructor, issue_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE course_title = VALUES(course_title), student_name = VALUES(student_name)
    ");
    $stmt->execute([$id, $authUser['id'], $course_id, $course_title, $student_name, $instructor, $issue_date]);

    echo json_encode(['status' => 'success', 'message' => 'Sertifikat bazada qeydə alındı', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'get_certificates') {
    $authUser = requireAuthUser($pdo);
    $stmt = $pdo->prepare("SELECT * FROM mdx_student_certificates WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$authUser['id']]);
    echo json_encode(['status' => 'success', 'certificates' => $stmt->fetchAll()], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'save_booking' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $authUser = requireAuthUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $id = trim($input['id'] ?? ('BK-' . round(microtime(true) * 1000)));
    $coach_id = trim($input['coachId'] ?? ($input['coach_id'] ?? ''));
    $coach_name = trim($input['coachName'] ?? ($input['coach_name'] ?? ''));
    $slot = trim($input['slot'] ?? ($input['time'] ?? ''));
    $format = trim($input['format'] ?? 'Online (Google Meet)');
    $notes = trim($input['notes'] ?? '');

    $stmt = $pdo->prepare("
        INSERT INTO mdx_bookings (id, user_id, coach_id, coach_name, slot, format, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$id, $authUser['id'], $coach_id, $coach_name, $slot, $format, $notes]);

    echo json_encode(['status' => 'success', 'message' => 'Kouçinq sessiyası rezervasiya edildi', 'id' => $id], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($action === 'get_bookings') {
    $authUser = requireAuthUser($pdo);
    if ($authUser['role'] === 'Admin') {
        $stmt = $pdo->query("SELECT * FROM mdx_bookings ORDER BY created_at DESC");
    } else {
        $stmt = $pdo->prepare("SELECT * FROM mdx_bookings WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$authUser['id']]);
    }
    echo json_encode(['status' => 'success', 'bookings' => $stmt->fetchAll()], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 7.11. LOKAL MƏLUMATLARIN BAZAYA TOPLU SİNXRONİZASİYASI (SYNC ALL LOCAL DATA)
// --------------------------------------------------------
if ($action === 'sync_all_local_data' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminUser($pdo);
    verifyCsrfToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $synced = [];

    // 1. Courses
    if (!empty($input['courses']) && is_array($input['courses'])) {
        $cStmt = $pdo->prepare("
            INSERT INTO mdx_courses (id, category, badge, badge_class, duration, title, description, instructor, instructor_role, status, occupancy, price, featured, is_online, translations_json, modules_json, tags_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                category=VALUES(category), badge=VALUES(badge), badge_class=VALUES(badge_class),
                duration=VALUES(duration), title=VALUES(title), description=VALUES(description),
                instructor=VALUES(instructor), instructor_role=VALUES(instructor_role),
                status=VALUES(status), occupancy=VALUES(occupancy), price=VALUES(price),
                featured=VALUES(featured), is_online=VALUES(is_online),
                translations_json=VALUES(translations_json), modules_json=VALUES(modules_json),
                tags_json=VALUES(tags_json)
        ");
        foreach ($input['courses'] as $c) {
            $cStmt->execute([
                $c['id'], $c['category'] ?? 'psychology', $c['badge'] ?? 'KURS',
                $c['badgeClass'] ?? ($c['badge_class'] ?? 'bg-secondary/10 text-secondary'),
                $c['duration'] ?? '', $c['title'] ?? '', $c['description'] ?? '',
                $c['instructor'] ?? '', $c['instructorRole'] ?? ($c['instructor_role'] ?? ''),
                $c['status'] ?? 'Qrup qəbulu aktivdir', intval($c['occupancy'] ?? 0),
                $c['price'] ?? '0', !empty($c['featured']) ? 1 : 0,
                isset($c['isOnline']) ? ($c['isOnline'] ? 1 : 0) : 1,
                json_encode($c['translations'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($c['modules'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($c['tags'] ?? [], JSON_UNESCAPED_UNICODE)
            ]);
        }
        $synced['courses'] = count($input['courses']);
    }

    // 2. Events
    if (!empty($input['events']) && is_array($input['events'])) {
        $eStmt = $pdo->prepare("
            INSERT INTO mdx_events (id, title, datetime_label, type_badge, badge_class, speaker, speaker_role, capacity, registered, description, is_online, translations_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title=VALUES(title), datetime_label=VALUES(datetime_label),
                type_badge=VALUES(type_badge), badge_class=VALUES(badge_class),
                speaker=VALUES(speaker), speaker_role=VALUES(speaker_role),
                capacity=VALUES(capacity), registered=VALUES(registered),
                description=VALUES(description), is_online=VALUES(is_online),
                translations_json=VALUES(translations_json)
        ");
        foreach ($input['events'] as $e) {
            $eStmt->execute([
                $e['id'], $e['title'] ?? '', $e['datetime'] ?? ($e['datetime_label'] ?? ''),
                $e['typeBadge'] ?? ($e['type_badge'] ?? 'VEBİNAR'),
                $e['badgeClass'] ?? ($e['badge_class'] ?? ''),
                $e['speaker'] ?? '', $e['speakerRole'] ?? ($e['speaker_role'] ?? ''),
                intval($e['capacity'] ?? 100), intval($e['registered'] ?? 0),
                $e['desc'] ?? ($e['description'] ?? ''),
                isset($e['isOnline']) ? ($e['isOnline'] ? 1 : 0) : 1,
                json_encode($e['translations'] ?? [], JSON_UNESCAPED_UNICODE)
            ]);
        }
        $synced['events'] = count($input['events']);
    }

    // 3. Community Posts
    if (!empty($input['community']) && is_array($input['community'])) {
        $cpStmt = $pdo->prepare("
            INSERT INTO mdx_community_posts (id, badge, title, snippet, content, author, time_ago, likes, replies, pinned, translations_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                badge=VALUES(badge), title=VALUES(title), snippet=VALUES(snippet),
                content=VALUES(content), author=VALUES(author), time_ago=VALUES(time_ago),
                pinned=VALUES(pinned), translations_json=VALUES(translations_json)
        ");
        foreach ($input['community'] as $p) {
            $cpStmt->execute([
                $p['id'], $p['badge'] ?? 'İcma Müzakirəsi', $p['title'] ?? '',
                $p['snippet'] ?? '', $p['content'] ?? ($p['snippet'] ?? ''),
                $p['author'] ?? 'Rezident', $p['time'] ?? ($p['time_ago'] ?? 'İndicə'),
                intval($p['likes'] ?? 0), intval($p['repliesCount'] ?? ($p['replies'] ?? 0)),
                !empty($p['pinned']) ? 1 : 0,
                json_encode($p['translations'] ?? [], JSON_UNESCAPED_UNICODE)
            ]);
        }
        $synced['community'] = count($input['community']);
    }

    // 4. Coaches
    if (!empty($input['coaches']) && is_array($input['coaches'])) {
        $coStmt = $pdo->prepare("
            INSERT INTO mdx_coaches (id, name, title, bio, rating, reviews_count, hourly_rate, session_duration, specialties_json, languages_json, available_slots_json, translations_json, avatar_url, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name=VALUES(name), title=VALUES(title), bio=VALUES(bio),
                rating=VALUES(rating), reviews_count=VALUES(reviews_count),
                hourly_rate=VALUES(hourly_rate), session_duration=VALUES(session_duration),
                specialties_json=VALUES(specialties_json), languages_json=VALUES(languages_json),
                available_slots_json=VALUES(available_slots_json),
                translations_json=VALUES(translations_json), avatar_url=VALUES(avatar_url),
                is_active=VALUES(is_active)
        ");
        foreach ($input['coaches'] as $c) {
            $coStmt->execute([
                $c['id'], $c['name'] ?? '', $c['title'] ?? '', $c['bio'] ?? ($c['experience'] ?? ''),
                floatval($c['rating'] ?? 5.0), intval($c['reviewsCount'] ?? 0),
                $c['hourlyRate'] ?? '100 ₼ / saat', $c['sessionDuration'] ?? '60 dəqiqə',
                json_encode($c['specialties'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($c['languages'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($c['availableSlots'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($c['translations'] ?? [], JSON_UNESCAPED_UNICODE),
                $c['image'] ?? ($c['avatarUrl'] ?? ''),
                isset($c['isActive']) ? ($c['isActive'] ? 1 : 0) : 1
            ]);
        }
        $synced['coaches'] = count($input['coaches']);
    }

    // 5. CMS Blocks
    if (!empty($input['cms_blocks']) && is_array($input['cms_blocks'])) {
        $cmsStmt = $pdo->prepare("
            INSERT INTO mdx_cms_blocks (block_key, content_json)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE content_json=VALUES(content_json), updated_at=CURRENT_TIMESTAMP
        ");
        foreach ($input['cms_blocks'] as $key => $content) {
            $cmsStmt->execute([
                $key,
                is_array($content) ? json_encode($content, JSON_UNESCAPED_UNICODE) : (string)$content
            ]);
        }
        $synced['cms_blocks'] = count($input['cms_blocks']);
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Bütün lokal məlumatlar uğurla Hostinger SQL bazasına sinxronlaşdırıldı!',
        'synced' => $synced
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// --------------------------------------------------------
// 8. CƏDVƏLLƏRİN AVTOMATİK MİQRASİYASI (MIGRATE TABLES)
// --------------------------------------------------------
if ($action === 'migrate' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $isDev = (($_SERVER['SERVER_NAME'] ?? '') === 'localhost' || ($_SERVER['REMOTE_ADDR'] ?? '') === '127.0.0.1');
    $migrationKey = getenv('MIGRATION_SECRET_KEY') ?: '';
    $providedKey = $_SERVER['HTTP_X_MIGRATION_KEY'] ?? ($_GET['key'] ?? '');

    $sessionUser = getSessionUser($pdo);
    $isAdmin = ($sessionUser && $sessionUser['role'] === 'Admin');
    $hasKey = (!empty($migrationKey) && hash_equals($migrationKey, $providedKey));

    if (!$isDev && !$isAdmin && !$hasKey) {
        http_response_code(403);
        echo json_encode([
            'status' => 'forbidden',
            'message' => 'Migrasiya əməliyyatı üçün super admin girişi və ya xüsusi açar tələb olunur (403 Forbidden).'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

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

    // 13. mdx_coaches
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_coaches` (
            `id` varchar(50) NOT NULL,
            `name` varchar(150) NOT NULL,
            `title` varchar(255) NOT NULL,
            `bio` text NOT NULL,
            `rating` decimal(3,2) NOT NULL DEFAULT 5.0,
            `reviews_count` int(11) NOT NULL DEFAULT 0,
            `hourly_rate` varchar(50) NOT NULL,
            `session_duration` varchar(50) NOT NULL DEFAULT '60 dəqiqə',
            `specialties_json` text DEFAULT NULL,
            `languages_json` text DEFAULT NULL,
            `available_slots_json` longtext DEFAULT NULL,
            `translations_json` longtext DEFAULT NULL,
            `avatar_url` varchar(255) DEFAULT NULL,
            `is_active` tinyint(1) NOT NULL DEFAULT 1,
            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_coaches';

    // 14. mdx_cms_blocks
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_cms_blocks` (
            `block_key` varchar(100) NOT NULL,
            `content_json` longtext NOT NULL,
            `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`block_key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_cms_blocks';

    // 15. mdx_student_progress
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_student_progress` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `user_id` varchar(50) NOT NULL,
            `course_id` varchar(50) NOT NULL,
            `completed_lessons_json` text NOT NULL,
            `percent` int(11) NOT NULL DEFAULT 0,
            `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
            PRIMARY KEY (`id`),
            UNIQUE KEY `idx_user_course` (`user_id`, `course_id`),
            KEY `idx_progress_user` (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_student_progress';

    // 16. mdx_student_certificates
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_student_certificates` (
            `id` varchar(50) NOT NULL,
            `user_id` varchar(50) NOT NULL,
            `course_id` varchar(50) DEFAULT NULL,
            `course_title` varchar(255) NOT NULL,
            `student_name` varchar(150) NOT NULL,
            `instructor` varchar(150) DEFAULT NULL,
            `issue_date` varchar(50) NOT NULL,
            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
            PRIMARY KEY (`id`),
            KEY `idx_cert_user` (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_student_certificates';

    // 17. mdx_bookings
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `mdx_bookings` (
            `id` varchar(50) NOT NULL,
            `user_id` varchar(50) NOT NULL,
            `coach_id` varchar(50) NOT NULL,
            `coach_name` varchar(150) NOT NULL,
            `slot` varchar(100) NOT NULL,
            `format` varchar(50) NOT NULL DEFAULT 'Online (Google Meet)',
            `notes` text DEFAULT NULL,
            `status` varchar(50) NOT NULL DEFAULT 'Təsdiqləndi',
            `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
            PRIMARY KEY (`id`),
            KEY `idx_booking_user` (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    $results[] = 'mdx_bookings';

    // Safe dynamic columns alteration on existing tables
    $alterStatements = [
        "ALTER TABLE mdx_courses ADD COLUMN translations_json LONGTEXT DEFAULT NULL",
        "ALTER TABLE mdx_courses ADD COLUMN modules_json LONGTEXT DEFAULT NULL",
        "ALTER TABLE mdx_courses ADD COLUMN is_online TINYINT(1) DEFAULT 1",
        "ALTER TABLE mdx_courses ADD COLUMN tags_json TEXT DEFAULT NULL",
        "ALTER TABLE mdx_events ADD COLUMN speaker_role VARCHAR(150) DEFAULT NULL",
        "ALTER TABLE mdx_events ADD COLUMN is_online TINYINT(1) DEFAULT 1",
        "ALTER TABLE mdx_events ADD COLUMN translations_json LONGTEXT DEFAULT NULL",
        "ALTER TABLE mdx_events ADD COLUMN tags_json TEXT DEFAULT NULL",
        "ALTER TABLE mdx_community_posts ADD COLUMN content LONGTEXT DEFAULT NULL",
        "ALTER TABLE mdx_community_posts ADD COLUMN author_role VARCHAR(100) DEFAULT NULL",
        "ALTER TABLE mdx_community_posts ADD COLUMN author_avatar VARCHAR(255) DEFAULT NULL",
        "ALTER TABLE mdx_community_posts ADD COLUMN category VARCHAR(50) DEFAULT NULL",
        "ALTER TABLE mdx_community_posts ADD COLUMN translations_json LONGTEXT DEFAULT NULL",
        "ALTER TABLE mdx_categories ADD COLUMN translations_json LONGTEXT DEFAULT NULL",
        "ALTER TABLE mdx_club_tiers ADD COLUMN translations LONGTEXT DEFAULT NULL"
    ];
    foreach ($alterStatements as $alterSql) {
        try {
            $pdo->exec($alterSql);
        } catch (PDOException $e) {}
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

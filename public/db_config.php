<?php
/**
 * Monodoxia Academy - Hostinger Database Configuration
 * Təhlükəsizlik qaydası: Heç vaxt şifrəni kod daxilində açıq saxlamayın.
 * Məlumatlar yalnız .env faylından və ya mühit dəyişənlərindən (Environment Variables) oxunur.
 */

// Birbaşa brauzerdən daxil olmağı əngəllə
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

// Support .env file loading from parent or current directory
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

$db_host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? ($_SERVER['DB_HOST'] ?? 'localhost'));
$db_name = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? ($_SERVER['DB_NAME'] ?? ''));
$db_user = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? ($_SERVER['DB_USER'] ?? ''));
$db_pass = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? ($_SERVER['DB_PASS'] ?? ''));

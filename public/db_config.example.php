<?php
/**
 * Monodoxia Academy - Hostinger Database Configuration Template
 * 
 * Instructions:
 * 1. Copy this file to `db_config.php`
 * 2. Fill in your Hostinger MySQL database credentials below
 * 3. Never commit `db_config.php` with real production passwords to public repositories
 */

// Block direct access via browser
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'u310078278_monodoxia';
$db_user = getenv('DB_USER') ?: 'u310078278_monodoxia';
$db_pass = getenv('DB_PASS') ?: 'YOUR_DATABASE_PASSWORD_HERE';

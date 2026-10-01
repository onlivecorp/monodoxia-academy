<?php
/**
 * Monodoxia Academy - Hostinger Database Configuration
 * Bu faylda Hostinger cPanel / hPanel-də yaratdığınız MySQL baza məlumatlarını qeyd edin.
 */

// Birbaşa brauzerdən daxil olmağı əngəllə
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access forbidden.');
}

$db_host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'u310078278_monodoxia';
$db_user = getenv('DB_USER') ?: 'u310078278_monodoxia';
$db_pass = getenv('DB_PASS') ?: 'Monodoxia@1!'; // Hostinger-də təyin etdiyiniz şifrə


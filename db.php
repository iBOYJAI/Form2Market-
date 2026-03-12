<?php
$host = 'localhost';
$dbname = 'farm2market_db';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die('<div style="font-family:monospace;color:#ff3333;background:#0a0f0a;padding:2rem;">DB Error: '.$e->getMessage().'</div>');
}

// Robust Root-Relative Path Detection (No-Document-Root Dependency)
$proj_phys = str_replace('\\', '/', __DIR__);
$script_phys = str_replace('\\', '/', $_SERVER['SCRIPT_FILENAME'] ?? '');
$script_web = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');

if ($script_phys && $script_web) {
    $relative_phys = str_ireplace($proj_phys, '', $script_phys);
    $base_url = str_ireplace($relative_phys, '', $script_web);
} else {
    // Fallback for CLI or cases where server variables are missing
    $parts = explode('/htdocs/', str_replace('\\', '/', $proj_phys));
    $base_url = isset($parts[1]) ? '/' . $parts[1] : '/';
}

// Final check: if base_url still mentions a drive letter (e.g. C:), it failed
if (strpos($base_url, ':') !== false) {
    $parts = explode('/htdocs/', str_replace('\\', '/', $base_url));
    $base_url = isset($parts[1]) ? '/' . $parts[1] : '/';
}

$base_url = '/' . trim($base_url, '/') . '/';
if ($base_url === '//') $base_url = '/';

if (!defined('BASE_URL'))  define('BASE_URL', $base_url);
if (!defined('ASSETS'))    define('ASSETS',   BASE_URL . 'assets/images/Notion-Resources/');
if (!defined('NI'))        define('NI',       ASSETS . 'Notion-Icons/Accent-Color/png/');
if (!defined('EC'))        define('EC',       ASSETS . 'Ecommerce-Club/Accent-Color/png/');
if (!defined('OC'))        define('OC',       ASSETS . 'Office-Club/Accent-Color/png/');
if (!defined('NC'))        define('NC',       ASSETS . 'Notion-Club/Accent-Color/png/');
if (!defined('PV'))        define('PV',       ASSETS . 'Payment-and-Shopping-Visuals/png/');
if (!defined('WP'))        define('WP',       ASSETS . 'Notion-Wallpapers/phone-screens/');
if (!defined('AV'))        define('AV',       BASE_URL . 'assets/images/Avatar/');
if (!defined('CURRENCY'))  define('CURRENCY', '₹');

// Assign avatar by user ID
if (!function_exists('avatar')) {
    function avatar(int $id, string $type = 'any'): string {
        $boys  = ['boy-1','boy-2','boy-3','boy-4','boy-5','boy-6','boy-7'];
        $girls = ['girl-1','girl-2','girl-3','girl-4'];
        $all   = array_merge($boys, $girls);
        if ($type === 'boy')  return AV . $boys[$id % 7] . '.png';
        if ($type === 'girl') return AV . $girls[$id % 4] . '.png';
        return AV . $all[$id % 11] . '.png';
    }
}

// Category icon
if (!function_exists('catIcon')) {
    function catIcon(string $cat): string {
        $map = [
            'vegetables' => NI . 'ni-butterfly.png',
            'fruits'     => NI . 'ni-picking-fruit.png',
            'grains'     => NI . 'ni-collection.png',
            'dairy'      => NI . 'ni-award.png',
            'poultry'    => NI . 'ni-butterfly.png',
            'spices'     => NI . 'ni-scissors.png',
            'herbs'      => NI . 'ni-butterfly.png',
            'other'      => NI . 'ni-shopping-cart.png',
        ];
        return $map[$cat] ?? NI . 'ni-shopping-cart.png';
    }
}

if (!function_exists('productImageSrc')) {
    function productImageSrc(?string $img): string {
        if (!$img) return '';
        if (preg_match('#^https?://#i', $img)) return $img;
        if (str_starts_with($img, '/')) return $img;
        if (str_starts_with($img, 'assets/')) return BASE_URL . $img;
        return BASE_URL . 'uploads/products/' . ltrim($img, '/');
    }
}
?>

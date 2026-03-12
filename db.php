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

define('ASSETS',   '/farm2market/assets/images/');
define('NI',       ASSETS . 'Notion-Icons/Accent-Color/png/');
define('EC',       ASSETS . 'Ecommerce-Club/Accent-Color/png/');
define('OC',       ASSETS . 'Office-Club/Accent-Color/png/');
define('NC',       ASSETS . 'Notion-Club/Accent-Color/png/');
define('PV',       ASSETS . 'Payment-and-Shopping-Visuals/png/');
define('WP',       ASSETS . 'Notion-Wallpapers/phone-screens/');
define('AV',       ASSETS . 'Avatar/');

// Assign avatar by user ID
function avatar(int $id, string $type = 'any'): string {
    $boys  = ['boy-1','boy-2','boy-3','boy-4','boy-5','boy-6','boy-7'];
    $girls = ['girl-1','girl-2','girl-3','girl-4'];
    $all   = array_merge($boys, $girls);
    if ($type === 'boy')  return AV . $boys[$id % 7] . '.png';
    if ($type === 'girl') return AV . $girls[$id % 4] . '.png';
    return AV . $all[$id % 11] . '.png';
}

// Category icon
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
?>

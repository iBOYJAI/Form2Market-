<?php
require_once __DIR__ . '/../db.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Layout mode (landing, auth, dashboard)
$layout_mode = $layout_mode ?? 'dashboard';
$role = $_SESSION['role'] ?? null;
$user_id = $_SESSION['user_id'] ?? 0;
$user_name = $_SESSION['name'] ?? 'Guest';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farm2Market | Luxury Fresh Market</title>
    <link rel="stylesheet" href="/farm2market/assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>

<div class="app-layout <?= ($layout_mode === 'auth') ? 'auth-mode' : (($layout_mode === 'landing') ? 'landing-mode' : '') ?>">
    
    <?php if ($layout_mode === 'dashboard'): ?>
    <!-- TOPBAR -->
    <header class="topbar">
        <a href="/farm2market/index.php" class="brand">
            <div class="brand-icon">
                <img src="<?= NI ?>ni-picking-fruit.png" alt="Icon">
            </div>
            <div class="brand-text">
                <span class="brand-name">FARM2MARKET</span>
                <span class="brand-tagline">Elite Organic Produce</span>
            </div>
        </a>

        <div class="topbar-right">
            <div class="topbar-search">
                <img src="<?= NI ?>ni-info.png" alt="Search">
                <input type="text" id="global-search" placeholder="Search products, farmers...">
            </div>

            <div class="notif-btn" id="notif-trigger">
                <img src="<?= NI ?>ni-bell.png" alt="Notifications">
                <span class="notif-count">3</span>
                
                <div class="notif-panel" id="notif-panel">
                    <div class="notif-panel-head">
                        Notifications
                        <span class="notif-clear">Mark all read</span>
                    </div>
                    <div class="notif-item unread">
                        <div class="notif-ico"><img src="<?= NI ?>ni-shopping-cart.png"></div>
                        <div class="notif-msg">New order received for Tomatoes</div>
                        <div class="notif-time">2 mins ago</div>
                    </div>
                    <div class="notif-item">
                        <div class="notif-ico"><img src="<?= NI ?>ni-check.png"></div>
                        <div class="notif-msg">Your product "Organic Honey" was approved</div>
                        <div class="notif-time">1 hour ago</div>
                    </div>
                </div>
            </div>

            <div class="user-chip">
                <div class="uc-avatar">
                    <img src="<?= avatar($user_id) ?>" alt="Avatar">
                </div>
                <div class="uc-name"><?= htmlspecialchars($user_name) ?></div>
                <div class="uc-role"><?= strtoupper($role ?? 'GUEST') ?></div>
            </div>
        </div>
    </header>

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <?php if ($role === 'admin'): ?>
            <div class="sidebar-group">
                <div class="sidebar-group-label">Administrative</div>
                <a href="/farm2market/admin/dashboard.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'admin/dashboard') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-house.png"> Dashboard
                </a>
                <a href="/farm2market/admin/manage_users.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'manage_users') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-users.png"> Manage Users
                </a>
                <a href="/farm2market/admin/manage_products.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'manage_products') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-shopping-cart.png"> Manage Products
                </a>
                <a href="/farm2market/admin/manage_orders.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'manage_orders') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-clipboard-bar-chart.png"> Manage Orders
                </a>
                <a href="/farm2market/admin/reports.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'reports') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-square-poll.png"> Reports
                </a>
            </div>
        <?php elseif ($role === 'farmer'): ?>
            <div class="sidebar-group">
                <div class="sidebar-group-label">Marketplace</div>
                <a href="/farm2market/farmer/dashboard.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'farmer/dashboard') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-house.png"> Dashboard
                </a>
                <a href="/farm2market/farmer/add_product.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'add_product') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-plus.png"> Add Product
                </a>
                <a href="/farm2market/farmer/my_products.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'my_products') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-shopping-cart.png"> My Products
                </a>
                <a href="/farm2market/farmer/my_orders.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'farmer/my_orders') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-clipboard-check.png"> Orders
                </a>
            </div>
        <?php elseif ($role === 'customer'): ?>
            <div class="sidebar-group">
                <div class="sidebar-group-label">Shopping</div>
                <a href="/farm2market/customer/dashboard.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'customer/dashboard') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-house.png"> Dashboard
                </a>
                <a href="/farm2market/customer/browse.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'browse') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-shopping-cart-fast.png"> Browse Products
                </a>
                <a href="/farm2market/customer/my_orders.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'customer/my_orders') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-clipboard-list-check.png"> My Orders
                </a>
            </div>
        <?php endif; ?>

        <div class="sidebar-hr"></div>
        
        <div class="sidebar-group">
            <a href="/farm2market/auth/logout.php" class="sidebar-link">
                <img src="<?= NI ?>ni-power-off.png"> Logout
            </a>
        </div>
    </aside>

    <main class="main-content">
    <?php endif; ?>

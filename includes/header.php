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

// Notification feed (dashboard mode only)
$notif_items = [];
if ($layout_mode === 'dashboard' && $role) {
    try {
        if ($role === 'admin') {
            $rows = $pdo->query("SELECT Product_ID, Product_Name, Created_At FROM products WHERE Status='pending' ORDER BY Created_At DESC LIMIT 5")->fetchAll();
            foreach ($rows as $r) {
                $notif_items[] = [
                    'href' => BASE_URL . 'admin/manage_products.php?status=pending',
                    'icon' => NI . 'ni-exclamation-triangle.png',
                    'msg'  => 'Pending approval: ' . $r['Product_Name'],
                    'time' => $r['Created_At'] ? date('M d • H:i', strtotime($r['Created_At'])) : 'Recently',
                    'unread' => true,
                ];
            }
        } elseif ($role === 'farmer') {
            $stmt = $pdo->prepare("
                SELECT o.Order_ID, o.Date, p.Product_ID, p.Product_Name
                FROM orders o
                JOIN products p ON o.Product_ID = p.Product_ID
                WHERE o.Farmer_ID = ? AND o.Status IN ('placed','confirmed')
                ORDER BY o.Date DESC
                LIMIT 5
            ");
            $stmt->execute([$user_id]);
            foreach ($stmt->fetchAll() as $r) {
                $notif_items[] = [
                    'href' => BASE_URL . 'farmer/my_orders.php',
                    'icon' => NI . 'ni-shopping-cart.png',
                    'msg'  => 'Order update: ' . $r['Product_Name'] . ' (#' . str_pad($r['Order_ID'], 5, '0', STR_PAD_LEFT) . ')',
                    'time' => $r['Date'] ? date('M d • H:i', strtotime($r['Date'])) : 'Recently',
                    'unread' => true,
                ];
            }
        } elseif ($role === 'customer') {
            $stmt = $pdo->prepare("
                SELECT o.Order_ID, o.Date, o.Status, p.Product_ID, p.Product_Name
                FROM orders o
                JOIN products p ON o.Product_ID = p.Product_ID
                WHERE o.Customer_ID = ?
                ORDER BY o.Date DESC
                LIMIT 5
            ");
            $stmt->execute([$user_id]);
            foreach ($stmt->fetchAll() as $r) {
                $notif_items[] = [
                    'href' => BASE_URL . 'customer/product_detail.php?id=' . urlencode((string)$r['Product_ID']),
                    'icon' => NI . 'ni-check.png',
                    'msg'  => 'Order ' . strtoupper($r['Status']) . ': ' . $r['Product_Name'],
                    'time' => $r['Date'] ? date('M d • H:i', strtotime($r['Date'])) : 'Recently',
                    'unread' => ($r['Status'] !== 'delivered'),
                ];
            }
        }
    } catch (Throwable $e) {
        $notif_items = [];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farm2Market | Luxury Fresh Market</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>

<div class="app-layout <?= ($layout_mode === 'auth') ? 'auth-mode' : (($layout_mode === 'landing') ? 'landing-mode' : '') ?>">
    
    <?php if ($layout_mode === 'landing'): ?>
    <header class="landing-topbar">
        <a href="<?= BASE_URL ?>index.php" class="brand">
            <div class="brand-icon">
                <img src="<?= NI ?>ni-picking-fruit.png" alt="Icon">
            </div>
            <div class="brand-text">
                <span class="brand-name">FARM2MARKET</span>
                <span class="brand-tagline">Elite Organic Produce</span>
            </div>
        </a>

        <nav class="landing-nav">
            <a class="landing-nav-link" href="#about">About</a>
            <a class="landing-nav-link" href="#terms">Terms</a>
            <a class="landing-nav-link" href="#how-it-works">How it Works</a>
            <a class="btn btn-primary btn-sm" href="<?= BASE_URL ?>auth/login.php">Login</a>
        </nav>
    </header>
    <?php endif; ?>

    <?php if ($layout_mode === 'dashboard'): ?>
    <!-- TOPBAR -->
    <header class="topbar">
        <a href="<?= BASE_URL ?>index.php" class="brand">
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
                <?php $notif_count = count($notif_items); ?>
                <?php if($notif_count > 0): ?>
                    <span class="notif-count"><?= $notif_count ?></span>
                <?php endif; ?>
                
                <div class="notif-panel" id="notif-panel">
                    <div class="notif-panel-head">
                        Notifications
                        <a class="notif-clear" href="<?= BASE_URL ?><?= $role === 'admin' ? 'admin/dashboard.php' : ($role === 'farmer' ? 'farmer/dashboard.php' : 'customer/dashboard.php') ?>">View</a>
                    </div>
                    <?php if(empty($notif_items)): ?>
                        <div class="notif-item">
                            <div class="notif-ico"><img src="<?= NI ?>ni-info.png"></div>
                            <div class="notif-msg">No new notifications.</div>
                            <div class="notif-time">Up to date</div>
                        </div>
                    <?php else: ?>
                        <?php foreach($notif_items as $it): ?>
                            <a class="notif-item <?= !empty($it['unread']) ? 'unread' : '' ?>" href="<?= htmlspecialchars($it['href']) ?>">
                                <div class="notif-ico"><img src="<?= htmlspecialchars($it['icon']) ?>"></div>
                                <div>
                                    <div class="notif-msg"><?= htmlspecialchars($it['msg']) ?></div>
                                    <div class="notif-time"><?= htmlspecialchars($it['time']) ?></div>
                                </div>
                            </a>
                        <?php endforeach; ?>
                    <?php endif; ?>
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
                <a href="<?= BASE_URL ?>admin/dashboard.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'admin/dashboard') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-house.png"> Dashboard
                </a>
                <a href="<?= BASE_URL ?>admin/manage_users.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'manage_users') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-users.png"> Manage Users
                </a>
                <a href="<?= BASE_URL ?>admin/manage_products.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'manage_products') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-shopping-cart.png"> Manage Products
                </a>
                <a href="<?= BASE_URL ?>admin/manage_orders.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'manage_orders') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-clipboard-bar-chart.png"> Manage Orders
                </a>
                <a href="<?= BASE_URL ?>admin/reports.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'reports') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-square-poll.png"> Reports
                </a>
            </div>
        <?php elseif ($role === 'farmer'): ?>
            <div class="sidebar-group">
                <div class="sidebar-group-label">Marketplace</div>
                <a href="<?= BASE_URL ?>farmer/dashboard.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'farmer/dashboard') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-house.png"> Dashboard
                </a>
                <a href="<?= BASE_URL ?>farmer/add_product.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'add_product') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-plus.png"> Add Product
                </a>
                <a href="<?= BASE_URL ?>farmer/my_products.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'my_products') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-shopping-cart.png"> My Products
                </a>
                <a href="<?= BASE_URL ?>farmer/my_orders.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'farmer/my_orders') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-clipboard-check.png"> Orders
                </a>
            </div>
        <?php elseif ($role === 'customer'): ?>
            <div class="sidebar-group">
                <div class="sidebar-group-label">Shopping</div>
                <a href="<?= BASE_URL ?>customer/dashboard.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'customer/dashboard') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-house.png"> Dashboard
                </a>
                <a href="<?= BASE_URL ?>customer/browse.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'browse') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-shopping-cart-fast.png"> Browse Products
                </a>
                <a href="<?= BASE_URL ?>customer/my_orders.php" class="sidebar-link <?= strpos($_SERVER['PHP_SELF'], 'customer/my_orders') !== false ? 'active' : '' ?>">
                    <img src="<?= NI ?>ni-clipboard-list-check.png"> My Orders
                </a>
            </div>
        <?php endif; ?>

        <div class="sidebar-hr"></div>
        
        <div class="sidebar-group">
            <a href="<?= BASE_URL ?>auth/logout.php" class="sidebar-link">
                <img src="<?= NI ?>ni-power-off.png"> Logout
            </a>
        </div>
    </aside>

    <main class="main-content">
    <?php endif; ?>

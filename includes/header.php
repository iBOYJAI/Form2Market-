<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farm2Market >_</title>
    <link rel="stylesheet" href="/farm2market/assets/css/style.css">
</head>
<body>

<nav class="navbar">
    <a href="/farm2market/index.php" class="navbar-brand">FARM2MARKET_</a>
    <div class="nav-links">
        <?php if(isset($_SESSION['role'])): ?>
            <?php if($_SESSION['role'] === 'admin'): ?>
                <a href="/farm2market/admin/dashboard.php">Dashboard</a>
                <a href="/farm2market/admin/manage_users.php">Users</a>
                <a href="/farm2market/admin/manage_products.php">Products</a>
                <a href="/farm2market/admin/manage_orders.php">Orders</a>
                <a href="/farm2market/admin/reports.php">Reports</a>
            <?php elseif($_SESSION['role'] === 'farmer'): ?>
                <a href="/farm2market/farmer/dashboard.php">Dashboard</a>
                <a href="/farm2market/farmer/my_products.php">My Products</a>
                <a href="/farm2market/farmer/my_orders.php">Orders</a>
            <?php elseif($_SESSION['role'] === 'customer'): ?>
                <a href="/farm2market/customer/dashboard.php">Dashboard</a>
                <a href="/farm2market/customer/browse.php">Browse</a>
                <a href="/farm2market/customer/my_orders.php">My Orders</a>
            <?php endif; ?>
            <a href="/farm2market/auth/logout.php" style="color:var(--text-muted)">Logout [<?= htmlspecialchars($_SESSION['name']) ?>]</a>
        <?php else: ?>
            <a href="/farm2market/index.php#about">About</a>
            <a href="/farm2market/auth/login.php" class="glow">Login</a>
            <a href="/farm2market/auth/register.php">Register</a>
        <?php endif; ?>
    </div>
</nav>

<?php
$required_role = 'customer';
require '../includes/session_check.php';
require '../db.php';

$customer_id = $_SESSION['user_id'];

// Stats
$stats = [
    'orders' => $pdo->query("SELECT COUNT(*) FROM orders WHERE Customer_ID = $customer_id")->fetchColumn(),
    'spent' => $pdo->query("SELECT COALESCE(SUM(Total_Amount),0) FROM orders WHERE Customer_ID = $customer_id AND Status != 'cancelled'")->fetchColumn(),
    'pending' => $pdo->query("SELECT COUNT(*) FROM orders WHERE Customer_ID = $customer_id AND Status IN ('placed','confirmed','ready')")->fetchColumn()
];

// Recent Orders
$recent_orders = $pdo->query("
    SELECT o.*, p.Product_Name, f.Name as Farmer_Name, f.Farmer_ID 
    FROM orders o 
    JOIN products p ON o.Product_ID = p.Product_ID 
    JOIN farmers f ON o.Farmer_ID = f.Farmer_ID 
    WHERE o.Customer_ID = $customer_id 
    ORDER BY o.Date DESC LIMIT 5
")->fetchAll();

// Recommended Products (Random approved)
$recommended = $pdo->query("SELECT p.*, f.Name as Farmer FROM products p JOIN farmers f ON p.Farmer_ID = f.Farmer_ID WHERE p.Status = 'approved' AND p.Quantity > 0 ORDER BY RAND() LIMIT 4")->fetchAll();

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="#">Customer</a>
            <span class="breadcrumb-sep">/</span>
            <span>Dashboard</span>
        </div>
        <h1 class="page-title">Personal Terminal</h1>
        <p class="page-subtitle">Welcome back, <?= htmlspecialchars($_SESSION['name']) ?>. Explore the marketplace and track your procurements.</p>
    </div>
    <div class="page-actions">
        <a href="browse.php" class="btn btn-primary">
            <img src="<?= NI ?>ni-shopping-bag.png"> Enter Marketplace
        </a>
        <img src="<?= NC ?>nc-woman-typing-on-machine.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<!-- Stat Grid -->
<div class="stat-grid mb-4">
    <div class="stat-card purple">
        <div class="stat-icon-wrap purple">
            <img src="<?= NI ?>ni-shopping-cart.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['orders'] ?></div>
            <div class="stat-lbl">Procurements</div>
        </div>
    </div>
    <div class="stat-card gold">
        <div class="stat-icon-wrap gold">
            <img src="<?= NC ?>nc-gauge-price-sensitivity.png">
        </div>
        <div class="stat-info">
            <div class="stat-val">₹<?= number_format($stats['spent'], 2) ?></div>
            <div class="stat-lbl">Total Expenditure</div>
        </div>
    </div>
    <div class="stat-card gold">
        <div class="stat-icon-wrap gold">
            <img src="<?= NI ?>ni-paper-plane.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['pending'] ?></div>
            <div class="stat-lbl">Active Transfers</div>
        </div>
    </div>
</div>

<div class="g2 mb-4">
    <!-- Recent Logistics -->
    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">Transfer History</h3>
            <a href="my_orders.php" class="btn btn-ghost btn-sm">View Logs</a>
        </div>
        <div class="card-body" style="padding: 0;">
            <?php if(empty($recent_orders)): ?>
                <div class="empty-state">
                    <img src="<?= EC ?>ec-reduce-customer-churn.png" class="empty-illo" style="width: 100px;">
                    <h3>No Active Transfers</h3>
                    <p>Your procurement history is currently empty.</p>
                </div>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Provider</th>
                            <th>Asset</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($recent_orders as $o): ?>
                        <tr>
                            <td>
                                <div class="td-user">
                                    <div class="td-avatar">
                                        <img src="<?= avatar($o['Farmer_ID']) ?>">
                                    </div>
                                    <span class="td-name"><?= htmlspecialchars($o['Farmer_Name']) ?></span>
                                </div>
                            </td>
                            <td><?= htmlspecialchars($o['Product_Name']) ?> x<?= $o['Quantity'] ?></td>
                            <td class="td-name">₹<?= number_format($o['Total_Amount'], 2) ?></td>
                            <td>
                                <span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>

    <!-- Suggested Assets -->
    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">Market Suggestions</h3>
            <a href="browse.php" class="btn btn-ghost btn-sm">Explore All</a>
        </div>
        <div class="card-body">
            <div class="product-mini-grid">
                <?php foreach($recommended as $p): ?>
                <a href="product_detail.php?id=<?= $p['Product_ID'] ?>" class="p-mini-card" style="text-decoration: none; color: inherit;">
                    <div class="p-mini-img">
                        <?php 
                            $img = $p['Image_Path'] ?? $p['Image'] ?? null;
                            if($img): 
                        ?>
                            <img src="/farm2market/uploads/products/<?= htmlspecialchars($img) ?>">
                        <?php else: ?>
                            <img src="<?= NI ?>ni-shopping-cart.png" style="opacity:0.2; padding:15px;">
                        <?php endif; ?>
                    </div>
                    <div class="p-mini-info">
                        <div class="td-name"><?= htmlspecialchars($p['Product_Name']) ?></div>
                        <div class="flex-between align-center mt-1">
                            <span class="td-sub" style="font-size: 0.65rem;"><?= htmlspecialchars($p['Farmer']) ?></span>
                            <span class="td-name" style="color:var(--green-600)">₹<?= $p['Price'] ?></span>
                        </div>
                    </div>
                </a>
                <?php endforeach; ?>
                <?php if(empty($recommended)): ?>
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <p>No agricultural assets available in current network scan.</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

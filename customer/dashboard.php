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
    SELECT o.*, p.Product_Name, f.Name as Farmer_Name 
    FROM orders o 
    JOIN products p ON o.Product_ID = p.Product_ID 
    JOIN farmers f ON o.Farmer_ID = f.Farmer_ID 
    WHERE o.Customer_ID = $customer_id 
    ORDER BY o.Date DESC LIMIT 5
")->fetchAll();

// Recommended Products (Random approved)
$recommended = $pdo->query("SELECT p.*, f.Name as Farmer FROM products p JOIN farmers f ON p.Farmer_ID = f.Farmer_ID WHERE p.Status = 'approved' AND p.Quantity > 0 ORDER BY RAND() LIMIT 4")->fetchAll();

?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> CONSUMER TERMINAL</h2>
            <p>Welcome, <?= htmlspecialchars($_SESSION['name']) ?></p>
        </div>
        <a href="browse.php" class="btn btn-primary">[ ENTER MARKETPLACE ]</a>
    </div>

    <!-- Stat Cards -->
    <div class="grid-3 mb-3">
        <div class="card text-center">
            <div class="stat-value"><?= $stats['orders'] ?></div>
            <div class="stat-label">Total Procurements</div>
        </div>
        <div class="card text-center">
            <div class="stat-value">₹<?= number_format($stats['spent'], 2) ?></div>
            <div class="stat-label">Total Expenditure</div>
        </div>
        <div class="card text-center">
            <div class="stat-value glow-amber" style="color:var(--amber);"><?= $stats['pending'] ?></div>
            <div class="stat-label">Active Transfers</div>
        </div>
    </div>

    <div class="grid-2">
        <!-- Recent Orders -->
        <div class="card" style="padding:0; overflow:hidden;">
            <div class="flex justify-between align-center" style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim);">
                <span class="glow" style="font-weight:700;">> RECENT LOGISTICS</span>
                <a href="my_orders.php" class="btn btn-sm" style="border:1px solid var(--border-dim)">VIEW LOGS</a>
            </div>
            <div class="table-responsive">
                <table>
                    <tr><th>Provider</th><th>Asset</th><th>Total</th><th>Status</th></tr>
                    <?php foreach($recent_orders as $o): ?>
                    <tr>
                        <td style="font-size:0.8rem;"><?= htmlspecialchars($o['Farmer_Name']) ?></td>
                        <td><?= htmlspecialchars($o['Product_Name']) ?> x<?= $o['Quantity'] ?></td>
                        <td style="font-weight:700;">₹<?= $o['Total_Amount'] ?></td>
                        <td><span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span></td>
                    </tr>
                    <?php endforeach; ?>
                    <?php if(empty($recent_orders)): ?>
                    <tr><td colspan="4" class="text-center">No recent procurements.</td></tr>
                    <?php endif; ?>
                </table>
            </div>
        </div>

        <!-- Recommended Products -->
        <div class="card" style="padding:0; overflow:hidden;">
            <div class="flex justify-between align-center" style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim);">
                <span class="glow-amber" style="font-weight:700;">> SUGGESTED ASSETS</span>
                <a href="browse.php" class="btn btn-sm" style="border:1px solid var(--border-dim)">BROWSE ALL</a>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; padding:1rem;">
                <?php foreach($recommended as $p): ?>
                <a href="product_detail.php?id=<?= $p['Product_ID'] ?>" style="text-decoration:none;">
                    <div class="product-card" style="border-color:var(--green-dim); height:auto;">
                        <?php if($p['Image_Path'] && file_exists('../uploads/products/'.$p['Image_Path'])): ?>
                            <img src="/farm2market/uploads/products/<?= $p['Image_Path'] ?>" style="height:120px;">
                        <?php else: ?>
                            <div class="img-placeholder" style="height:120px;">NO IMG</div>
                        <?php endif; ?>
                        <div class="product-card-body" style="padding:0.75rem;">
                            <div class="product-name glow" style="font-size:0.85rem; margin:0;"><?= htmlspecialchars($p['Product_Name']) ?></div>
                            <div style="color:var(--amber); font-weight:700; font-size:1rem; margin-top:0.25rem;">₹<?= $p['Price'] ?></div>
                            <div style="color:var(--text-muted); font-size:0.7rem; margin-top:0.5rem;">SYS: <?= htmlspecialchars($p['Farmer']) ?></div>
                        </div>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

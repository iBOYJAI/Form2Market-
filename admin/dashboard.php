<?php
$required_role = 'admin';
require '../includes/session_check.php';
require '../db.php';

// Stats
$stats = [
    'farmers' => $pdo->query("SELECT COUNT(*) FROM farmers")->fetchColumn(),
    'customers' => $pdo->query("SELECT COUNT(*) FROM customers")->fetchColumn(),
    'products' => $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn(),
    'pending' => $pdo->query("SELECT COUNT(*) FROM products WHERE Status='pending'")->fetchColumn(),
    'orders' => $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
    'revenue' => $pdo->query("SELECT COALESCE(SUM(Total_Amount),0) FROM orders WHERE Status != 'cancelled'")->fetchColumn()
];

// Recent Orders
$recent_orders = $pdo->query("
    SELECT o.Order_ID, c.Name as Customer, p.Product_Name as Product, o.Total_Amount, o.Status, o.Date, c.Customer_ID 
    FROM orders o 
    JOIN customers c ON o.Customer_ID = c.Customer_ID 
    JOIN products p ON o.Product_ID = p.Product_ID 
    ORDER BY o.Date DESC LIMIT 10
")->fetchAll();

// Pending Products
$pending = $pdo->query("
    SELECT p.Product_ID, p.Product_Name, p.Price, f.Name as Farmer, p.Image 
    FROM products p 
    JOIN farmers f ON p.Farmer_ID = f.Farmer_ID 
    WHERE p.Status = 'pending' LIMIT 5
")->fetchAll();

// Handle basic approve/reject from dashboard
if (isset($_GET['action'], $_GET['product_id'])) {
    $id = $_GET['product_id'];
    $status = $_GET['action'] === 'approve' ? 'approved' : 'rejected';
    $stmt = $pdo->prepare("UPDATE products SET Status = ? WHERE Product_ID = ?");
    $stmt->execute([$status, $id]);
    header("Location: dashboard.php?success=1");
    exit();
}

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="#">Admin</a>
            <span class="breadcrumb-sep">/</span>
            <span>Dashboard</span>
        </div>
        <h1 class="page-title">Administrative Console</h1>
        <p class="page-subtitle">Real-time agricultural network metrics and moderation.</p>
    </div>
    <div class="page-actions">
        <button class="btn btn-outline">
            <img src="<?= NI ?>ni-share.png"> Export Stats
        </button>
        <img src="<?= OC ?>oc-target.png" style="width: 90px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<!-- Stat Grid -->
<div class="stat-grid mb-4">
    <div class="stat-card">
        <div class="stat-icon-wrap green">
            <img src="<?= NI ?>ni-picking-fruit.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['farmers'] ?></div>
            <div class="stat-lbl">Active Farmers</div>
        </div>
    </div>
    <div class="stat-card blue">
        <div class="stat-icon-wrap blue">
            <img src="<?= NI ?>ni-users.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['customers'] ?></div>
            <div class="stat-lbl">Customers</div>
        </div>
    </div>
    <div class="stat-card gold">
        <div class="stat-icon-wrap gold">
            <img src="<?= NI ?>ni-exclamation-triangle.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['pending'] ?></div>
            <div class="stat-lbl">Pending Items</div>
        </div>
    </div>
    <div class="stat-card teal">
        <div class="stat-icon-wrap teal">
            <img src="<?= NI ?>ni-shopping-cart.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['products'] ?></div>
            <div class="stat-lbl">Total Products</div>
        </div>
    </div>
    <div class="stat-card purple">
        <div class="stat-icon-wrap purple">
            <img src="<?= NI ?>ni-clipboard-bar-chart.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['orders'] ?></div>
            <div class="stat-lbl">Total Orders</div>
        </div>
    </div>
    <div class="stat-card gold">
        <div class="stat-icon-wrap gold">
            <img src="<?= NC ?>nc-gauge-price-sensitivity.png">
        </div>
        <div class="stat-info">
            <div class="stat-val">₹<?= number_format($stats['revenue'] / 1000, 1) ?>k</div>
            <div class="stat-lbl">Revenue</div>
        </div>
    </div>
</div>

<div class="g2 mb-4">
    <!-- Pending Approvals -->
    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">Pending Approvals</h3>
            <a href="manage_products.php" class="btn btn-ghost btn-sm">View All</a>
        </div>
        <div class="card-body" style="padding: 0;">
            <?php if(empty($pending)): ?>
                <div class="empty-state">
                    <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
                    <h3>All Clear</h3>
                    <p>There are no pending product listings requiring moderation.</p>
                </div>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Farmer</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($pending as $p): ?>
                        <tr>
                            <td>
                                <div class="td-product">
                                    <div class="td-product-img">
                                        <?php if($p['Image']): ?>
                                            <img src="/farm2market/uploads/products/<?= $p['Image'] ?>">
                                        <?php else: ?>
                                            <img src="<?= NI ?>ni-shopping-cart.png" style="opacity:0.3; padding:10px;">
                                        <?php endif; ?>
                                    </div>
                                    <span class="td-name"><?= htmlspecialchars($p['Product_Name']) ?></span>
                                </div>
                            </td>
                            <td><?= htmlspecialchars($p['Farmer']) ?></td>
                            <td class="td-name">₹<?= $p['Price'] ?></td>
                            <td>
                                <div class="flex-gap gap-sm">
                                    <a href="?action=approve&product_id=<?= $p['Product_ID'] ?>" class="btn btn-primary btn-icon btn-sm" title="Approve">
                                        <img src="<?= NI ?>ni-check.png">
                                    </a>
                                    <a href="?action=reject&product_id=<?= $p['Product_ID'] ?>" class="btn btn-danger btn-icon btn-sm" title="Reject">
                                        <img src="<?= NI ?>ni-x.png">
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php endif; ?>
        </div>
    </div>

    <!-- System Metrics Placeholder -->
    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">System Growth</h3>
            <div class="chart-legend">
                <div class="legend-lbl"><span class="legend-dot" style="background:var(--green-500)"></span> Orders</div>
                <div class="legend-lbl"><span class="legend-dot" style="background:var(--gold-400)"></span> Users</div>
            </div>
        </div>
        <div class="card-body">
            <div style="height: 280px; display:flex; align-items:center; justify-content:center; background:var(--bg-secondary); border-radius:var(--radius-lg); border:1px dashed var(--border-mid);">
                <canvas id="dashboardChart"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Recent Orders -->
<div class="card">
    <div class="card-head">
        <h3 class="card-head-title">Recent Network Orders</h3>
        <a href="manage_orders.php" class="btn btn-outline btn-sm">Manage All Orders</a>
    </div>
    <div class="card-body" style="padding: 0;">
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($recent_orders as $o): ?>
                <tr>
                    <td class="td-name">#<?= str_pad($o['Order_ID'], 5, '0', STR_PAD_LEFT) ?></td>
                    <td>
                        <div class="td-user">
                            <div class="td-avatar">
                                <img src="<?= avatar($o['Customer_ID']) ?>">
                            </div>
                            <span class="td-name"><?= htmlspecialchars($o['Customer']) ?></span>
                        </div>
                    </td>
                    <td><?= htmlspecialchars($o['Product']) ?></td>
                    <td class="td-name">₹<?= number_format($o['Total_Amount'], 2) ?></td>
                    <td>
                        <div class="flex-gap">
                            <?php 
                                $status_icon = 'ni-paper-plane.png';
                                if($o['Status'] === 'confirmed') $status_icon = 'ni-double-check.png';
                                elseif($o['Status'] === 'ready') $status_icon = 'ni-check-hand.png';
                                elseif($o['Status'] === 'delivered') $status_icon = 'ni-ok.png';
                                elseif($o['Status'] === 'cancelled') $status_icon = 'ni-x.png';
                            ?>
                            <img src="<?= NI . $status_icon ?>" style="width:14px; opacity:0.6;">
                            <span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span>
                        </div>
                    </td>
                    <td class="td-sub"><?= date('M d, Y • H:i', strtotime($o['Date'])) ?></td>
                </tr>
                <?php endforeach; ?>
                <?php if(empty($recent_orders)): ?>
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <img src="<?= EC ?>ec-reduce-customer-churn.png" class="empty-illo" style="width:120px; height:120px;">
                            <p>No transactions recorded yet.</p>
                        </div>
                    </td>
                </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('dashboardChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Orders',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: '#15803d',
                    backgroundColor: 'rgba(21, 128, 61, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false },
                    x: { grid: { display: false } }
                }
            }
        });
    }
});
</script>

<?php include '../includes/footer.php'; ?>

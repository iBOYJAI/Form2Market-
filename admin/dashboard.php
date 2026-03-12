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
    SELECT o.Order_ID, c.Name as Customer, p.Product_Name as Product, o.Total_Amount, o.Status, o.Date 
    FROM orders o 
    JOIN customers c ON o.Customer_ID = c.Customer_ID 
    JOIN products p ON o.Product_ID = p.Product_ID 
    ORDER BY o.Date DESC LIMIT 10
")->fetchAll();

// Pending Products
$pending = $pdo->query("
    SELECT p.Product_ID, p.Product_Name, p.Price, f.Name as Farmer 
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
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> ADMIN CONTROL CENTER</h2>
            <p>System Overview & Metrics</p>
        </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid-3 mb-3">
        <div class="card text-center">
            <div class="stat-value"><?= $stats['farmers'] ?></div>
            <div class="stat-label">Total Farmers</div>
        </div>
        <div class="card text-center">
            <div class="stat-value"><?= $stats['customers'] ?></div>
            <div class="stat-label">Total Customers</div>
        </div>
        <div class="card text-center">
            <div class="stat-value"><?= $stats['products'] ?></div>
            <div class="stat-label">Total Products</div>
        </div>
        <div class="card text-center">
            <div class="stat-value" style="color:var(--amber); text-shadow:0 0 10px var(--amber-dim)"><?= $stats['pending'] ?></div>
            <div class="stat-label">Pending Approvals</div>
        </div>
        <div class="card text-center">
            <div class="stat-value"><?= $stats['orders'] ?></div>
            <div class="stat-label">Total Orders</div>
        </div>
        <div class="card text-center">
            <div class="stat-value">₹<?= number_format($stats['revenue'], 2) ?></div>
            <div class="stat-label">Total Revenue</div>
        </div>
    </div>

    <div class="grid-2">
        <!-- Pending Products Quick List -->
        <div class="card" style="padding:0; overflow:hidden;">
            <div style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim);">
                <span class="glow-amber" style="font-weight:700;">> ACTION REQUIRED: PENDING LISTINGS</span>
            </div>
            <?php if(empty($pending)): ?>
                <div style="padding:2rem; text-align:center; color:var(--text-muted)">All clear. No pending items.</div>
            <?php else: ?>
                <div class="table-responsive">
                    <table>
                        <tr><th>Product</th><th>Farmer</th><th>Price</th><th>Action</th></tr>
                        <?php foreach($pending as $p): ?>
                        <tr>
                            <td><?= htmlspecialchars($p['Product_Name']) ?></td>
                            <td><?= htmlspecialchars($p['Farmer']) ?></td>
                            <td>₹<?= $p['Price'] ?></td>
                            <td>
                                <a href="?action=approve&product_id=<?= $p['Product_ID'] ?>" class="btn btn-primary btn-sm">OK</a>
                                <a href="?action=reject&product_id=<?= $p['Product_ID'] ?>" class="btn btn-danger btn-sm">X</a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </table>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Charts Placeholders (Chart.js will render here if added) -->
        <div class="card">
             <div style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim); margin:-1.5rem -1.5rem 1.5rem -1.5rem;">
                <span class="glow" style="font-weight:700;">> SYSTEM METRICS</span>
            </div>
            <div style="height: 250px; display:flex; align-items:center; justify-content:center; color:var(--text-muted); border:1px dashed var(--border-dim)">
                [ CHART RENDER AREA ]<br>
                (See REPORTS for full graphs)
            </div>
        </div>
    </div>

    <!-- Recent Orders -->
    <div class="card mt-3" style="padding:0; overflow:hidden;">
        <div style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim);">
            <span class="glow" style="font-weight:700;">> RECENT ORDERS</span>
        </div>
        <div class="table-responsive">
            <table>
                <tr>
                    <th>ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th>
                </tr>
                <?php foreach($recent_orders as $o): ?>
                <tr>
                    <td>#<?= $o['Order_ID'] ?></td>
                    <td><?= htmlspecialchars($o['Customer']) ?></td>
                    <td><?= htmlspecialchars($o['Product']) ?></td>
                    <td>₹<?= $o['Total_Amount'] ?></td>
                    <td><span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span></td>
                    <td><?= date('M d, y H:i', strtotime($o['Date'])) ?></td>
                </tr>
                <?php endforeach; ?>
                <?php if(empty($recent_orders)): ?>
                <tr><td colspan="6" class="text-center">No orders yet.</td></tr>
                <?php endif; ?>
            </table>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

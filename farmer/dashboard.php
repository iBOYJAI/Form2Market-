<?php
$required_role = 'farmer';
require '../includes/session_check.php';
require '../db.php';

$farmer_id = $_SESSION['user_id'];

// Stats
$stats = [
    'my_products' => $pdo->query("SELECT COUNT(*) FROM products WHERE Farmer_ID = $farmer_id")->fetchColumn(),
    'approved' => $pdo->query("SELECT COUNT(*) FROM products WHERE Farmer_ID = $farmer_id AND Status='approved'")->fetchColumn(),
    'pending_orders' => $pdo->query("SELECT COUNT(*) FROM orders WHERE Farmer_ID = $farmer_id AND Status IN ('placed','confirmed')")->fetchColumn(),
    'revenue' => $pdo->query("SELECT COALESCE(SUM(Total_Amount),0) FROM orders WHERE Farmer_ID = $farmer_id AND Status = 'delivered'")->fetchColumn()
];

// Recent Products
$recent_products = $pdo->query("SELECT * FROM products WHERE Farmer_ID = $farmer_id ORDER BY Created_At DESC LIMIT 6")->fetchAll();

// Recent Orders
$recent_orders = $pdo->query("
    SELECT o.*, c.Name as Customer, p.Product_Name as Product 
    FROM orders o 
    JOIN customers c ON o.Customer_ID = c.Customer_ID 
    JOIN products p ON o.Product_ID = p.Product_ID 
    WHERE o.Farmer_ID = $farmer_id 
    ORDER BY o.Date DESC LIMIT 5
")->fetchAll();

// Handle basic status update from dashboard
if (isset($_GET['action'], $_GET['order_id'], $_GET['status'])) {
    $id = $_GET['order_id'];
    $status = $_GET['status'];
    // verify ownership
    $stmt = $pdo->prepare("UPDATE orders SET Status = ? WHERE Order_ID = ? AND Farmer_ID = ?");
    $stmt->execute([$status, $id, $farmer_id]);
    header("Location: dashboard.php?success=1");
    exit();
}
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> WELCOME, <?= htmlspecialchars(strtoupper($_SESSION['name'])) ?></h2>
            <p>Farm Operations & Listings Overview</p>
        </div>
        <div class="flex gap-2">
            <a href="add_product.php" class="btn btn-primary">+ ADD PRODUCT</a>
        </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid-4 mb-3">
        <div class="card text-center">
            <div class="stat-value"><?= $stats['my_products'] ?></div>
            <div class="stat-label">My Products</div>
        </div>
        <div class="card text-center">
            <div class="stat-value"><?= $stats['approved'] ?></div>
            <div class="stat-label">Approved</div>
        </div>
        <div class="card text-center">
            <div class="stat-value glow-amber" style="color:var(--amber);"><?= $stats['pending_orders'] ?></div>
            <div class="stat-label">Pending Orders</div>
        </div>
        <div class="card text-center">
            <div class="stat-value">₹<?= number_format($stats['revenue'], 2) ?></div>
            <div class="stat-label">Total Earned</div>
        </div>
    </div>

    <div class="grid-2">
        <!-- Recent Products -->
        <div class="card" style="padding:0; overflow:hidden;">
            <div class="flex justify-between align-center" style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim);">
                <span class="glow" style="font-weight:700;">> MY ASSETS</span>
                <a href="my_products.php" class="btn btn-sm" style="border:1px solid var(--border-dim)">VIEW ALL</a>
            </div>
            <div class="product-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; padding:1rem;">
                <?php foreach($recent_products as $p): ?>
                <div style="border:1px solid var(--border-dim); border-radius:var(--radius); overflow:hidden; background:var(--bg-card); display:flex; flex-direction:column;">
                    <?php if($p['Image_Path'] && file_exists('../uploads/products/'.$p['Image_Path'])): ?>
                        <img src="/farm2market/uploads/products/<?= $p['Image_Path'] ?>" style="height:100px; width:100%; object-fit:cover; filter:grayscale(0.3) contrast(1.2);">
                    <?php else: ?>
                        <div class="img-placeholder" style="height:100px;">NO IMG</div>
                    <?php endif; ?>
                    <div style="padding:0.75rem; flex-grow:1; display:flex; flex-direction:column; justify-content:space-between;">
                        <div style="font-weight:700; font-size:0.85rem;" class="glow"><?= htmlspecialchars($p['Product_Name']) ?></div>
                        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:0.5rem;">
                            <span style="color:var(--amber); font-weight:700;">₹<?= $p['Price'] ?></span>
                            <span class="badge badge-<?= $p['Status'] ?>" style="font-size:0.6rem;"><?= $p['Status'] ?></span>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
                <?php if(empty($recent_products)): ?>
                    <div style="grid-column:1/-1; padding:2rem; text-align:center; color:var(--text-muted)">No assets listed yet. <br><a href="add_product.php" style="color:var(--green-bright)">Initialize Listing</a></div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Recent Orders -->
        <div class="card" style="padding:0; overflow:hidden;">
            <div class="flex justify-between align-center" style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim);">
                <span class="glow" style="font-weight:700;">> LOGISTICS (ORDERS)</span>
                <a href="my_orders.php" class="btn btn-sm" style="border:1px solid var(--border-dim)">VIEW LOGS</a>
            </div>
            <div class="table-responsive">
                <table>
                    <tr><th>ID</th><th>Customer</th><th>Product / Qty</th><th>Amount</th><th>Status</th></tr>
                    <?php foreach($recent_orders as $o): ?>
                    <tr>
                        <td class="glow-amber">#<?= str_pad($o['Order_ID'], 5, '0', STR_PAD_LEFT) ?></td>
                        <td><?= htmlspecialchars($o['Customer']) ?></td>
                        <td><?= htmlspecialchars($o['Product']) ?> (<?= $o['Quantity'] ?>)</td>
                        <td>₹<?= $o['Total_Amount'] ?></td>
                        <td><span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span></td>
                    </tr>
                    <?php endforeach; ?>
                    <?php if(empty($recent_orders)): ?>
                    <tr><td colspan="5" class="text-center">No orders received.</td></tr>
                    <?php endif; ?>
                </table>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

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
    SELECT o.*, c.Name as Customer, p.Product_Name as Product, c.Customer_ID 
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
    $stmt = $pdo->prepare("UPDATE orders SET Status = ? WHERE Order_ID = ? AND Farmer_ID = ?");
    $stmt->execute([$status, $id, $farmer_id]);
    header("Location: dashboard.php?success=1");
    exit();
}

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="#">Farmer</a>
            <span class="breadcrumb-sep">/</span>
            <span>Dashboard</span>
        </div>
        <h1 class="page-title">Welcome, <?= htmlspecialchars($_SESSION['name']) ?></h1>
        <p class="page-subtitle">Manage your farm's inventory and fulfill direct consumer orders.</p>
    </div>
    <div class="page-actions">
        <a href="add_product.php" class="btn btn-primary">
            <img src="<?= NI ?>ni-plus.png"> Add New Product
        </a>
        <img src="<?= OC ?>oc-on-the-laptop.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<!-- Stat Grid -->
<div class="stat-grid mb-4">
    <div class="stat-card teal">
        <div class="stat-icon-wrap teal">
            <img src="<?= NI ?>ni-shopping-bag.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['my_products'] ?></div>
            <div class="stat-lbl">My Products</div>
        </div>
    </div>
    <div class="stat-card blue">
        <div class="stat-icon-wrap blue">
            <img src="<?= NI ?>ni-check.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['approved'] ?></div>
            <div class="stat-lbl">Approved Items</div>
        </div>
    </div>
    <div class="stat-card gold">
        <div class="stat-icon-wrap gold">
            <img src="<?= NI ?>ni-paper-plane.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $stats['pending_orders'] ?></div>
            <div class="stat-lbl">Pending Orders</div>
        </div>
    </div>
    <div class="stat-card gold">
        <div class="stat-icon-wrap gold">
            <img src="<?= NC ?>nc-gauge-price-sensitivity.png">
        </div>
        <div class="stat-info">
            <div class="stat-val">₹<?= number_format($stats['revenue'], 2) ?></div>
            <div class="stat-lbl">Total Earnings</div>
        </div>
    </div>
</div>

<div class="g2 mb-4">
    <!-- My Assets -->
    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">Recent Inventory</h3>
            <a href="my_products.php" class="btn btn-ghost btn-sm">Manage All</a>
        </div>
        <div class="card-body">
            <?php if(empty($recent_products)): ?>
                <div class="empty-state">
                    <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
                    <h3>No Assets Found</h3>
                    <p>Start by listing your first agricultural product.</p>
                    <a href="add_product.php" class="btn btn-outline btn-sm mt-3">Initial Listing</a>
                </div>
            <?php else: ?>
                <div class="product-mini-grid">
                    <?php foreach($recent_products as $p): ?>
                    <div class="p-mini-card">
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
                                <span class="badge badge-<?= $p['Status'] ?>" style="font-size: 0.65rem;"><?= $p['Status'] ?></span>
                                <span class="td-name" style="color:var(--green-600)">₹<?= $p['Price'] ?></span>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Logistics Orders -->
    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">Delivery Logistics</h3>
            <a href="my_orders.php" class="btn btn-ghost btn-sm">Review Logs</a>
        </div>
        <div class="card-body" style="padding: 0;">
            <?php if(empty($recent_orders)): ?>
                <div class="empty-state">
                    <img src="<?= EC ?>ec-reduce-customer-churn.png" class="empty-illo" style="width:100px; height:100px;">
                    <h3>No Active Orders</h3>
                    <p>Orders will appear here once customers initiate procurement.</p>
                </div>
            <?php else: ?>
                <table>
                    <thead>
                        <tr>
                            <th>Ref</th>
                            <th>Consumer</th>
                            <th>Product</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach($recent_orders as $o): ?>
                        <tr>
                            <td class="td-name">#<?= str_pad($o['Order_ID'], 4, '0', STR_PAD_LEFT) ?></td>
                            <td>
                                <div class="td-user">
                                    <div class="td-avatar">
                                        <img src="<?= avatar($o['Customer_ID']) ?>">
                                    </div>
                                    <span class="td-name"><?= htmlspecialchars($o['Customer']) ?></span>
                                </div>
                            </td>
                            <td><?= htmlspecialchars($o['Product']) ?> (<?= $o['Quantity'] ?>)</td>
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
</div>

<?php include '../includes/footer.php'; ?>

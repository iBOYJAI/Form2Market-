<?php
$required_role = 'farmer';
require '../includes/session_check.php';
require '../db.php';

$farmer_id = $_SESSION['user_id'];

// Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['order_id'], $_POST['status'])) {
    $stmt = $pdo->prepare("UPDATE orders SET Status = ? WHERE Order_ID = ? AND Farmer_ID = ?");
    $stmt->execute([$_POST['status'], $_POST['order_id'], $farmer_id]);
    header("Location: my_orders.php?success=1");
    exit();
}

$status_filter = $_GET['status'] ?? 'all';
$sql = "
    SELECT o.*, c.Name as Customer_Name, c.Phone as Customer_Phone, c.Address as Customer_Address, p.Product_Name, c.Customer_ID 
    FROM orders o 
    JOIN customers c ON o.Customer_ID = c.Customer_ID 
    JOIN products p ON o.Product_ID = p.Product_ID 
    WHERE o.Farmer_ID = ?
";
$params = [$farmer_id];

if ($status_filter !== 'all') {
    $sql .= " AND o.Status = ?";
    $params[] = $status_filter;
}
$sql .= " ORDER BY o.Date DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

$statuses = ['placed','confirmed','ready','delivered','cancelled'];

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Farmer</a>
            <span class="breadcrumb-sep">/</span>
            <span>Delivery Logs</span>
        </div>
        <h1 class="page-title">Order Fulfillment</h1>
        <p class="page-subtitle">Process consumer requests and manage your localized delivery pipeline.</p>
    </div>
    <div class="page-actions">
        <img src="<?= NI ?>ni-clipboard-list-check.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="filter-tabs mb-4">
    <a href="?status=all" class="ftab <?= $status_filter === 'all' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-clipboard-list-check.png"> All Orders
    </a>
    <a href="?status=placed" class="ftab <?= $status_filter === 'placed' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-paper-plane.png"> New
    </a>
    <a href="?status=confirmed" class="ftab <?= $status_filter === 'confirmed' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-double-check.png"> Confirmed
    </a>
    <a href="?status=ready" class="ftab <?= $status_filter === 'ready' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-check-hand.png"> Ready
    </a>
    <a href="?status=delivered" class="ftab <?= $status_filter === 'delivered' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-ok.png"> Done
    </a>
</div>

<div class="g2">
    <?php foreach($orders as $o): ?>
    <div class="card order-card">
        <div class="card-head">
            <div class="flex-gap">
                <span class="td-name" style="color: var(--gold-600);">#<?= str_pad($o['Order_ID'], 5, '0', STR_PAD_LEFT) ?></span>
                <span class="td-sub"><?= date('M d • H:i', strtotime($o['Date'])) ?></span>
            </div>
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
        </div>
        <div class="card-body">
            <div class="mb-4">
                <h3 class="td-name" style="font-size: 1.1rem; color: var(--green-800);"><?= htmlspecialchars($o['Product_Name']) ?></h3>
                <div class="td-sub" style="font-size: 0.9rem;">Qty: <?= $o['Quantity'] ?> Units • Total: <span class="td-name" style="color: var(--gold-700);">₹<?= number_format($o['Total_Amount'], 2) ?></span></div>
            </div>

            <div class="consumer-box">
                <div class="td-user mb-2">
                    <div class="td-avatar">
                        <img src="<?= avatar($o['Customer_ID']) ?>">
                    </div>
                    <div>
                        <div class="td-name"><?= htmlspecialchars($o['Customer_Name']) ?></div>
                        <div class="td-sub">TEL: <?= htmlspecialchars($o['Customer_Phone']) ?></div>
                    </div>
                </div>
                <div class="flex-gap align-start mt-2">
                    <img src="<?= NI ?>ni-house.png" style="width: 14px; opacity: 0.5; margin-top: 2px;">
                    <span class="td-sub" style="font-size: 0.75rem; line-height: 1.4;"><?= nl2br(htmlspecialchars($o['Customer_Address'])) ?></span>
                </div>
            </div>

            <?php if($o['Status'] !== 'delivered' && $o['Status'] !== 'cancelled'): ?>
                <div class="order-actions mt-4">
                    <form method="POST" class="flex-gap">
                        <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                        <select name="status" class="form-control" style="flex: 1;">
                            <option value="placed" <?= $o['Status']==='placed'?'selected':'' ?>>Placed</option>
                            <option value="confirmed" <?= $o['Status']==='confirmed'?'selected':'' ?>>Confirmed</option>
                            <option value="ready" <?= $o['Status']==='ready'?'selected':'' ?>>Ready for Pickup</option>
                            <option value="delivered" <?= $o['Status']==='delivered'?'selected':'' ?>>Mark Delivered</option>
                        </select>
                        <button type="submit" class="btn btn-primary">Update</button>
                    </form>
                    <form method="POST" class="mt-2" onsubmit="return confirm('Cancel this order entirely?')">
                        <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                        <input type="hidden" name="status" value="cancelled">
                        <button type="submit" class="btn btn-ghost btn-block" style="color: var(--red-500);">Cancel Transaction</button>
                    </form>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<?php if(empty($orders)): ?>
    <div class="empty-state card" style="padding: 5rem 2rem;">
        <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
        <h3>No Logistics Data</h3>
        <p>No consumer procurement requests found matching your filter.</p>
    </div>
<?php endif; ?>

<?php include '../includes/footer.php'; ?>

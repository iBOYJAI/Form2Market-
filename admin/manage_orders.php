<?php
$required_role = 'admin';
require '../includes/session_check.php';
require '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['order_id'], $_POST['status'])) {
    $stmt = $pdo->prepare("UPDATE orders SET Status = ? WHERE Order_ID = ?");
    $stmt->execute([$_POST['status'], $_POST['order_id']]);
    header("Location: manage_orders.php?success=1");
    exit();
}

$status_filter = $_GET['status'] ?? 'all';
$sql = "
    SELECT o.*, c.Name as Customer_Name, c.Phone as Customer_Phone, 
           p.Product_Name, f.Name as Farmer_Name, c.Customer_ID, f.Farmer_ID 
    FROM orders o 
    JOIN customers c ON o.Customer_ID = c.Customer_ID 
    JOIN products p ON o.Product_ID = p.Product_ID 
    JOIN farmers f ON o.Farmer_ID = f.Farmer_ID
";
$params = [];
if ($status_filter !== 'all') {
    $sql .= " WHERE o.Status = ?";
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
            <a href="dashboard.php">Admin</a>
            <span class="breadcrumb-sep">/</span>
            <span>Order Logistics</span>
        </div>
        <h1 class="page-title">Network Transaction Log</h1>
        <p class="page-subtitle">Monitor and override product delivery status across the entire network.</p>
    </div>
    <div class="page-actions">
        <img src="<?= NI ?>ni-clipboard-bar-chart.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="filter-tabs mb-4">
    <a href="?status=all" class="ftab <?= $status_filter === 'all' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-clipboard-list-check.png"> All Orders
    </a>
    <a href="?status=placed" class="ftab <?= $status_filter === 'placed' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-paper-plane.png"> Placed
    </a>
    <a href="?status=confirmed" class="ftab <?= $status_filter === 'confirmed' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-double-check.png"> Confirmed
    </a>
    <a href="?status=delivered" class="ftab <?= $status_filter === 'delivered' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-ok.png"> Delivered
    </a>
    <a href="?status=cancelled" class="ftab <?= $status_filter === 'cancelled' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-x.png"> Cancelled
    </a>
</div>

<div class="card" style="padding:0;">
    <div class="card-body" style="padding: 0;">
        <?php if(empty($orders)): ?>
            <div class="empty-state">
                <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
                <h3>No Orders Found</h3>
                <p>No transaction data exists for the selected status filter.</p>
            </div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Order Ref</th>
                        <th>Consumer</th>
                        <th>Producer</th>
                        <th>Product Details</th>
                        <th>Status</th>
                        <th>Override</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($orders as $o): ?>
                    <tr>
                        <td>
                            <div class="td-name">#<?= str_pad($o['Order_ID'], 5, '0', STR_PAD_LEFT) ?></div>
                            <div class="td-sub"><?= date('M d, Y • H:i', strtotime($o['Date'])) ?></div>
                        </td>
                        <td>
                            <div class="td-user">
                                <div class="td-avatar">
                                    <img src="<?= avatar($o['Customer_ID']) ?>">
                                </div>
                                <div>
                                    <div class="td-name"><?= htmlspecialchars($o['Customer_Name']) ?></div>
                                    <div class="td-sub"><?= htmlspecialchars($o['Customer_Phone']) ?></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="td-user">
                                <div class="td-avatar">
                                    <img src="<?= avatar($o['Farmer_ID']) ?>">
                                </div>
                                <span class="td-name"><?= htmlspecialchars($o['Farmer_Name']) ?></span>
                            </div>
                        </td>
                        <td>
                            <div class="td-name"><?= htmlspecialchars($o['Product_Name']) ?></div>
                            <div class="td-sub"><?= $o['Quantity'] ?> Units • ₹<?= number_format($o['Total_Amount'], 2) ?></div>
                        </td>
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
                        <td>
                            <form method="POST" class="flex-gap gap-sm align-center">
                                <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                                <select name="status" class="form-control-sm" style="min-width:110px;">
                                    <?php foreach($statuses as $s): ?>
                                    <option value="<?= $s ?>" <?= $o['Status']===$s?'selected':'' ?>><?= strtoupper($s) ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <button type="submit" class="btn btn-icon btn-sm btn-primary">
                                    <img src="<?= NI ?>ni-check.png">
                                </button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

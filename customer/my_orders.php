<?php
$required_role = 'customer';
require '../includes/session_check.php';
require '../db.php';

$customer_id = $_SESSION['user_id'];

// Handle Cancellation (only if placed)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['order_id']) && $_POST['action'] === 'cancel') {
    $order_id = $_POST['order_id'];
    
    // Check order status before cancelling
    $stmt = $pdo->prepare("SELECT Status, Product_ID, Quantity FROM orders WHERE Order_ID = ? AND Customer_ID = ?");
    $stmt->execute([$order_id, $customer_id]);
    $order = $stmt->fetch();
    
    if ($order && $order['Status'] === 'placed') {
        try {
            $pdo->beginTransaction();
            // Cancel order
            $stmt = $pdo->prepare("UPDATE orders SET Status = 'cancelled' WHERE Order_ID = ?");
            $stmt->execute([$order_id]);
            // Restore inventory
            $stmt = $pdo->prepare("UPDATE products SET Quantity = Quantity + ? WHERE Product_ID = ?");
            $stmt->execute([$order['Quantity'], $order['Product_ID']]);
            $pdo->commit();
            header("Location: my_orders.php?success=1");
            exit();
        } catch(PDOException $e) {
            $pdo->rollBack();
        }
    } else {
        header("Location: my_orders.php?error=Cannot cancel confirmed orders.");
        exit();
    }
}

$status_filter = $_GET['status'] ?? 'all';
$sql = "
    SELECT o.*, p.Product_Name, f.Name as Farmer_Name, f.Farmer_ID, p.Image_Path 
    FROM orders o 
    JOIN products p ON o.Product_ID = p.Product_ID 
    JOIN farmers f ON o.Farmer_ID = f.Farmer_ID 
    WHERE o.Customer_ID = ? 
";
$params = [$customer_id];
if($status_filter !== 'all') {
    $sql .= " AND o.Status = ?";
    $params[] = $status_filter;
}
$sql .= " ORDER BY o.Date DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Customer</a>
            <span class="breadcrumb-sep">/</span>
            <span>Procurement Archive</span>
        </div>
        <h1 class="page-title">My Orders</h1>
        <p class="page-subtitle">Historical and active data transfers regarding your marketplace activity.</p>
    </div>
    <div class="page-actions">
        <a href="browse.php" class="btn btn-primary">
            <img src="<?= NI ?>ni-plus.png"> New Procurement
        </a>
        <img src="<?= PV ?>Payment-and-Shopping-Visuals/png (light)1.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2.5rem; pointer-events: none;">
    </div>
</div>

<div class="filter-tabs mb-4">
    <a href="?status=all" class="ftab <?= $status_filter === 'all' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-clipboard-list-check.png"> All
    </a>
    <a href="?status=placed" class="ftab <?= $status_filter === 'placed' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-paper-plane.png"> New
    </a>
    <a href="?status=confirmed" class="ftab <?= $status_filter === 'confirmed' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-double-check.png"> Confirmed
    </a>
    <a href="?status=delivered" class="ftab <?= $status_filter === 'delivered' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-ok.png"> Done
    </a>
    <a href="?status=cancelled" class="ftab <?= $status_filter === 'cancelled' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-x.png"> Aborted
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
            <div class="flex-gap mb-4">
                <div class="td-product-img" style="width: 50px; height: 50px; border-radius: 8px;">
                    <?php if($o['Image_Path']): ?>
                        <img src="<?= htmlspecialchars(productImageSrc($o['Image_Path'])) ?>">
                    <?php else: ?>
                        <img src="<?= NI ?>ni-shopping-cart.png" style="opacity:0.2; padding:10px;">
                    <?php endif; ?>
                </div>
                <div>
                    <h3 class="td-name" style="font-size: 1.1rem; color: var(--green-800);"><?= htmlspecialchars($o['Product_Name']) ?></h3>
                    <div class="td-sub">Quantity: <?= $o['Quantity'] ?> Units • Total: <span class="td-name" style="color: var(--gold-700);"><?= CURRENCY ?><?= number_format($o['Total_Amount'], 2) ?></span></div>
                </div>
            </div>

            <div class="consumer-box">
                <div class="td-user">
                    <div class="td-avatar" style="width: 28px; height: 28px;">
                        <img src="<?= avatar($o['Farmer_ID']) ?>">
                    </div>
                    <div>
                        <div class="td-sub" style="font-size: 0.7rem; color: var(--text-muted);">PROVIDER NODE</div>
                        <div class="td-name" style="font-size: 0.85rem;"><?= htmlspecialchars($o['Farmer_Name']) ?></div>
                    </div>
                </div>
            </div>

            <?php if($o['Status'] === 'placed'): ?>
                <div class="mt-4">
                    <form method="POST" onsubmit="return confirm('Abort this transaction request?')">
                        <input type="hidden" name="action" value="cancel">
                        <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                        <button type="submit" class="btn btn-ghost btn-block" style="color: var(--red-500); border-color: var(--red-100);">
                            <img src="<?= NI ?>ni-trash.png" style="width: 14px; margin-right: 5px;">
                            Abort Order Request
                        </button>
                    </form>
                </div>
            <?php elseif($o['Status'] !== 'cancelled'): ?>
                 <div class="mt-4">
                    <button class="btn btn-ghost btn-block" disabled style="opacity: 0.5;">
                        <img src="<?= NI ?>ni-lock.png" style="width: 14px; margin-right: 5px;">
                        Status Locked
                    </button>
                </div>
            <?php endif; ?>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<?php if(empty($orders)): ?>
    <div class="empty-state card" style="padding: 5rem 2rem;">
        <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
        <h3>Archive Empty</h3>
        <p>No historical procurement records found in your node.</p>
        <a href="browse.php" class="btn btn-primary mt-3">Start Shopping</a>
    </div>
<?php endif; ?>

<?php include '../includes/footer.php'; ?>

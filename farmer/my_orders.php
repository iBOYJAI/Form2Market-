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
    SELECT o.*, c.Name as Customer_Name, c.Phone as Customer_Phone, c.Address as Customer_Address, p.Product_Name 
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
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> ORDER FULFILLMENT LOGS</h2>
            <p>Process customer requests and update status</p>
        </div>
        <div class="flex gap-2 text-sm">
            <a href="?status=all" class="btn <?= $status_filter==='all'?'btn-primary':'btn-sm' ?>">ALL</a>
            <a href="?status=placed" class="btn <?= $status_filter==='placed'?'btn-primary':'btn-sm' ?>">NEW</a>
            <a href="?status=confirmed" class="btn <?= $status_filter==='confirmed'?'btn-primary':'btn-sm' ?>">CONFIRMED</a>
            <a href="?status=ready" class="btn <?= $status_filter==='ready'?'btn-primary':'btn-sm' ?>">READY</a>
            <a href="?status=delivered" class="btn <?= $status_filter==='delivered'?'btn-primary':'btn-sm' ?>">DONE</a>
        </div>
    </div>

    <div class="grid-auto">
        <?php foreach($orders as $o): ?>
        <div class="card" style="display:flex; flex-direction:column;">
            <div class="flex justify-between align-center mb-2 pb-1" style="border-bottom:1px solid var(--border-dim)">
                <span class="glow-amber" style="font-weight:700;">ORD-<?= str_pad($o['Order_ID'], 5, '0', STR_PAD_LEFT) ?></span>
                <span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span>
            </div>
            
            <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem; flex-grow:1;">
                <div style="color:var(--green-bright); font-weight:700; font-size:1rem; margin-bottom:0.5rem;"><?= htmlspecialchars($o['Product_Name']) ?> x <?= $o['Quantity'] ?></div>
                <div>Total Expected: <strong style="color:var(--amber)">₹<?= $o['Total_Amount'] ?></strong></div>
                <div style="margin-top:0.5rem; color:var(--text-muted); font-size:0.75rem;">
                    Date: <?= date('Y-m-d H:i', strtotime($o['Date'])) ?>
                </div>
                
                <div style="margin-top:1rem; padding:0.75rem; background:var(--bg-input); border-radius:var(--radius); border:1px solid var(--border-dim);">
                    <div style="color:var(--green-bright); margin-bottom:0.25rem;">[ CONSUMER DATA ]</div>
                    <?= htmlspecialchars($o['Customer_Name']) ?><br>
                    TEL: <?= htmlspecialchars($o['Customer_Phone']) ?><br>
                    LOC: <?= nl2br(htmlspecialchars($o['Customer_Address'])) ?>
                </div>
            </div>

            <?php if($o['Status'] !== 'delivered' && $o['Status'] !== 'cancelled'): ?>
                <div style="border-top:1px solid var(--border-dim); padding-top:1rem; margin-top:auto;">
                    <form method="POST" class="flex gap-2">
                        <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                        <select name="status" style="flex:1; padding:0.4rem;">
                            <option value="placed" <?= $o['Status']==='placed'?'selected':'' ?>>PLACED</option>
                            <option value="confirmed" <?= $o['Status']==='confirmed'?'selected':'' ?>>CONFIRMED</option>
                            <option value="ready" <?= $o['Status']==='ready'?'selected':'' ?>>READY FOR PICKUP</option>
                            <option value="delivered" <?= $o['Status']==='delivered'?'selected':'' ?>>DELIVERED</option>
                        </select>
                        <button class="btn btn-sm btn-primary">UPDATE</button>
                    </form>
                    <form method="POST" style="margin-top:0.5rem;" onsubmit="return confirm('Cancel this order entirely?')">
                        <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                        <input type="hidden" name="status" value="cancelled">
                        <button class="btn btn-sm" style="width:100%; border:1px solid var(--red); color:var(--red); background:transparent;">CANCEL LOG</button>
                    </form>
                </div>
            <?php endif; ?>
        </div>
        <?php endforeach; ?>
        
        <?php if(empty($orders)): ?>
            <div style="grid-column:1/-1; padding:3rem; text-align:center; background:var(--bg-card); border:1px dashed var(--border-dim); color:var(--text-muted);">
                No network activity in this sector.
            </div>
        <?php endif; ?>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

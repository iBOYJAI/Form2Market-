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
           p.Product_Name, f.Name as Farmer_Name 
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
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> ORDER LOGISTICS MONITOR</h2>
            <p>Track and Override Order Statuses System-Wide</p>
        </div>
        <form method="GET" class="flex gap-2">
            <select name="status" onchange="this.form.submit()" style="padding:0.4rem; width:150px;">
                <option value="all" <?= $status_filter==='all'?'selected':'' ?>>All Statuses</option>
                <?php foreach($statuses as $s): ?>
                <option value="<?= $s ?>" <?= $status_filter===$s?'selected':'' ?>><?= strtoupper($s) ?></option>
                <?php endforeach; ?>
            </select>
        </form>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
        <div class="table-responsive">
            <table>
                <tr>
                    <th>ORDER ID</th><th>DATE</th><th>CUSTOMER</th><th>FARMER</th><th>PRODUCT / QTY</th><th>TOTAL ₹</th><th>STATUS</th><th>OVERRIDE</th>
                </tr>
                <?php foreach($orders as $o): ?>
                <tr>
                    <td class="glow-amber">#<?= str_pad($o['Order_ID'], 5, '0', STR_PAD_LEFT) ?></td>
                    <td style="font-size:0.75rem;"><?= date('Y-m-d H:i', strtotime($o['Date'])) ?></td>
                    <td>
                        <?= htmlspecialchars($o['Customer_Name']) ?><br>
                        <span style="font-size:0.7rem; color:var(--text-muted)"><?= htmlspecialchars($o['Customer_Phone']) ?></span>
                    </td>
                    <td><?= htmlspecialchars($o['Farmer_Name']) ?></td>
                    <td><?= htmlspecialchars($o['Product_Name']) ?> (<?= $o['Quantity'] ?>)</td>
                    <td style="font-weight:700;">₹<?= $o['Total_Amount'] ?></td>
                    <td><span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span></td>
                    <td>
                        <form method="POST" class="flex gap-2 align-center" style="margin:0;">
                            <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                            <select name="status" style="padding:0.2rem; min-width:100px;">
                                <?php foreach($statuses as $s): ?>
                                <option value="<?= $s ?>" <?= $o['Status']===$s?'selected':'' ?>><?= strtoupper($s) ?></option>
                                <?php endforeach; ?>
                            </select>
                            <button type="submit" class="btn btn-sm btn-primary">SET</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if(empty($orders)): ?>
                    <tr><td colspan="8" class="text-center">No orders match the current filter.</td></tr>
                <?php endif; ?>
            </table>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

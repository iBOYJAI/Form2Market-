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

$sql = "
    SELECT o.*, p.Product_Name, f.Name as Farmer_Name 
    FROM orders o 
    JOIN products p ON o.Product_ID = p.Product_ID 
    JOIN farmers f ON o.Farmer_ID = f.Farmer_ID 
    WHERE o.Customer_ID = ? 
    ORDER BY o.Date DESC
";
$stmt = $pdo->prepare($sql);
$stmt->execute([$customer_id]);
$orders = $stmt->fetchAll();
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> CONSUMER PROCUREMENT ARCHIVE</h2>
            <p>Historical and active data transfers</p>
        </div>
        <a href="browse.php" class="btn btn-primary">[ NEW ORDER ]</a>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
        <div class="table-responsive">
            <table>
                <tr><th>ORDER ID</th><th>DATE / TIME</th><th>ASSET (QTY)</th><th>PROVIDER</th><th>TOTAL EXPENDITURE</th><th>STATUS</th><th>ACTIONS</th></tr>
                <?php foreach($orders as $o): ?>
                <tr>
                    <td class="glow-amber">#<?= str_pad($o['Order_ID'], 5, '0', STR_PAD_LEFT) ?></td>
                    <td style="font-size:0.8rem;"><?= date('M d, Y H:i', strtotime($o['Date'])) ?></td>
                    <td><strong class="glow text-primary"><?= htmlspecialchars($o['Product_Name']) ?></strong> (x<?= $o['Quantity'] ?>)</td>
                    <td><?= htmlspecialchars($o['Farmer_Name']) ?></td>
                    <td style="font-weight:700;">₹<?= $o['Total_Amount'] ?></td>
                    <td><span class="badge badge-<?= $o['Status'] ?>"><?= $o['Status'] ?></span></td>
                    <td>
                        <?php if($o['Status'] === 'placed'): ?>
                            <form method="POST" onsubmit="return confirm('Abort this transaction request?')">
                                <input type="hidden" name="action" value="cancel">
                                <input type="hidden" name="order_id" value="<?= $o['Order_ID'] ?>">
                                <button type="submit" class="btn btn-sm" style="border:1px solid var(--red); color:var(--red); background:transparent;">ABORT</button>
                            </form>
                        <?php else: ?>
                            <span style="font-size:0.7rem; color:var(--text-muted)">LOCKED</span>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if(empty($orders)): ?>
                    <tr><td colspan="7" class="text-center" style="padding:2rem;">No historical records found.</td></tr>
                <?php endif; ?>
            </table>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

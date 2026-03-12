<?php
$required_role = 'customer';
require '../includes/session_check.php';
require '../db.php';

$customer_id = $_SESSION['user_id'];
$product_id = $_GET['id'] ?? ($_POST['id'] ?? 0);
$request_qty = (int)($_GET['qty'] ?? ($_POST['qty'] ?? 1));

// Fetch Product and Customer Info
$stmt = $pdo->prepare("SELECT p.*, f.Name as Farmer_Name FROM products p JOIN farmers f ON p.Farmer_ID = f.Farmer_ID WHERE p.Product_ID = ? AND p.Status = 'approved'");
$stmt->execute([$product_id]);
$product = $stmt->fetch();

$c_stmt = $pdo->prepare("SELECT * FROM customers WHERE Customer_ID = ?");
$c_stmt->execute([$customer_id]);
$customer = $c_stmt->fetch();

if (!$product || $request_qty > $product['Quantity'] || $request_qty < 1) {
    header("Location: browse.php?error=Invalid quantity or asset unavailable.");
    exit();
}

$total_amount = $product['Price'] * $request_qty;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $delivery_address = trim($_POST['address'] ?? '');
    $notes = trim($_POST['notes'] ?? '');

    if (empty($delivery_address)) {
        $error = "Delivery coordinates required.";
    } else {
        try {
            $pdo->beginTransaction();
            
            // Re-check inventory lock
            $stmt = $pdo->prepare("SELECT Quantity FROM products WHERE Product_ID = ? FOR UPDATE");
            $stmt->execute([$product_id]);
            $current_qty = $stmt->fetchColumn();
            
            if ($current_qty < $request_qty) {
                $pdo->rollBack();
                $error = "Inventory depleted during transaction.";
            } else {
                // Insert Order
                $stmt = $pdo->prepare("INSERT INTO orders (Customer_ID, Product_ID, Farmer_ID, Quantity, Total_Amount, Status, Delivery_Address, Notes) VALUES (?, ?, ?, ?, ?, 'placed', ?, ?)");
                $stmt->execute([$customer_id, $product_id, $product['Farmer_ID'], $request_qty, $total_amount, $delivery_address, $notes]);
                
                // Update Inventory
                $new_qty = $current_qty - $request_qty;
                $stmt = $pdo->prepare("UPDATE products SET Quantity = ? WHERE Product_ID = ?");
                $stmt->execute([$new_qty, $product_id]);
                
                $pdo->commit();
                
                header("Location: my_orders.php?success=1");
                exit();
            }
        } catch(PDOException $e) {
            $pdo->rollBack();
            $error = "Transaction Failed: " . $e->getMessage();
        }
    }
}
?>
<?php include '../includes/header.php'; ?>

<div class="container auth-wrapper" style="padding-top:2rem;">
    <div class="auth-card" style="max-width:600px; width:100%;">
        <div class="flex justify-between align-center mb-2">
            <h2 class="auth-title" style="margin:0; text-align:left;">> CONFIRM PROCUREMENT</h2>
            <a href="product_detail.php?id=<?= $product_id ?>" class="btn btn-sm" style="border:1px solid var(--border-dim)">[ CANCEL ]</a>
        </div>
        
        <?php if($error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <!-- Order Summary Box -->
        <div style="background:var(--bg-primary); border:1px dashed var(--border-dim); padding:1rem; margin-bottom:1.5rem;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;">TRANSACTION MANIFEST</div>
            <div class="flex justify-between" style="margin-bottom:0.25rem;">
                <span>Asset:</span>
                <strong class="glow"><?= htmlspecialchars($product['Product_Name']) ?></strong>
            </div>
            <div class="flex justify-between" style="margin-bottom:0.25rem;">
                <span>Provider:</span>
                <span><?= htmlspecialchars($product['Farmer_Name']) ?></span>
            </div>
            <div class="flex justify-between" style="margin-bottom:0.25rem;">
                <span>Units (Qty):</span>
                <span><?= $request_qty ?> x ₹<?= $product['Price'] ?></span>
            </div>
            <div class="flex justify-between mt-2" style="border-top:1px dashed var(--border-dim); padding-top:0.5rem;">
                <span>TOTAL EXPENDITURE:</span>
                <strong class="glow-amber" style="font-size:1.2rem;">₹<?= number_format($total_amount, 2) ?></strong>
            </div>
        </div>

        <form method="POST">
            <input type="hidden" name="id" value="<?= $product_id ?>">
            <input type="hidden" name="qty" value="<?= $request_qty ?>">

            <div class="form-group">
                <label>DELIVERY COORDINATES (Address) *</label>
                <textarea name="address" rows="3" required><?= htmlspecialchars($customer['Address']) ?></textarea>
            </div>

            <div class="form-group">
                <label>OPTIONAL LOGS (Notes to Provider)</label>
                <textarea name="notes" rows="2" placeholder="e.g., Leave package at the main gate."></textarea>
            </div>

            <div style="margin-top:2rem;">
                <button type="submit" class="btn btn-primary" style="width:100%; font-size:1.1rem; padding:1rem;">[ AUTHORIZE AND EXECUTE ORDER ]</button>
            </div>
            <p style="text-align:center; font-size:0.75rem; color:var(--text-muted); margin-top:1rem;">
                Standard terms apply. No digital transactor present.<br>Payment is COD (Cash on Delivery) explicitly.
            </p>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

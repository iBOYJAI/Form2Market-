<?php
$required_role = 'customer';
require '../includes/session_check.php';
require '../db.php';

$customer_id = $_SESSION['user_id'];
$product_id = $_GET['id'] ?? ($_POST['id'] ?? 0);
$request_qty = (int)($_GET['qty'] ?? ($_POST['qty'] ?? 1));

// Fetch Product and Customer Info
$stmt = $pdo->prepare("SELECT p.*, f.Name as Farmer_Name, f.Farmer_ID FROM products p JOIN farmers f ON p.Farmer_ID = f.Farmer_ID WHERE p.Product_ID = ? AND p.Status = 'approved'");
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

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="browse.php">Marketplace</a>
            <span class="breadcrumb-sep">/</span>
            <span>Procurement Manifest</span>
        </div>
        <h1 class="page-title">Confirm Order</h1>
        <p class="page-subtitle">Finalize your agricultural asset procurement and delivery coordinates.</p>
    </div>
    <div class="page-actions">
        <a href="product_detail.php?id=<?= $product_id ?>" class="btn btn-ghost">
            <img src="<?= NI ?>ni-x.png"> Abort Transaction
        </a>
    </div>
</div>

<div class="card mb-5" style="max-width: 700px; margin: 0 auto;">
    <div class="card-head">
        <h3 class="card-head-title">Transaction Manifest</h3>
    </div>
    <div class="card-body">
        <?php if($error): ?>
            <div class="alert alert-error mb-4">
                <img src="<?= NI ?>ni-exclamation-triangle.png">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <!-- Order Summary Box -->
        <div class="consumer-box mb-4" style="background: var(--bg-secondary); border-style: dashed;">
            <div class="td-sub mb-3" style="font-weight: 700; color: var(--gold-700); letter-spacing: 0.05em;">NETWORK MANIFEST</div>
            <div class="flex-between mb-2">
                <span class="td-sub">Selected Asset:</span>
                <span class="td-name"><?= htmlspecialchars($product['Product_Name']) ?></span>
            </div>
            <div class="flex-between mb-2">
                <span class="td-sub">Provider Node:</span>
                <div class="flex-gap">
                    <div class="td-avatar" style="width: 20px; height: 20px;">
                        <img src="<?= avatar($product['Farmer_ID']) ?>">
                    </div>
                    <span class="td-name" style="font-size: 0.85rem;"><?= htmlspecialchars($product['Farmer_Name']) ?></span>
                </div>
            </div>
            <div class="flex-between mb-3 pb-3" style="border-bottom: 1px dashed var(--border-dim);">
                <span class="td-sub">Telemetry (Qty):</span>
                <span class="td-name"><?= $request_qty ?> x ₹<?= number_format($product['Price'], 2) ?></span>
            </div>
            <div class="flex-between">
                <span class="td-name" style="color: var(--green-800);">TOTAL EXPENDITURE:</span>
                <span class="td-name" style="font-size: 1.8rem; color: var(--gold-700);">₹<?= number_format($total_amount, 2) ?></span>
            </div>
        </div>

        <form method="POST">
            <input type="hidden" name="id" value="<?= $product_id ?>">
            <input type="hidden" name="qty" value="<?= $request_qty ?>">

            <div class="form-group">
                <label>Delivery Coordinates (Detailed Address) <span class="req">*</span></label>
                <div class="input-wrap">
                    <img src="<?= NI ?>ni-house.png" class="input-ico" style="top: 1.2rem; transform: none;">
                    <textarea name="address" rows="3" required placeholder="Enter your full physical address..." style="padding-left: 2.6rem;"><?= htmlspecialchars($customer['Address']) ?></textarea>
                </div>
            </div>

            <div class="form-group">
                <label>Optional Logs (Notes for Provider)</label>
                <div class="input-wrap">
                    <img src="<?= NI ?>ni-file-text.png" class="input-ico" style="top: 1.2rem; transform: none;">
                    <textarea name="notes" rows="2" placeholder="e.g. Leave at the security gate..." style="padding-left: 2.6rem;"></textarea>
                </div>
            </div>

            <div class="mt-5">
                <button type="submit" class="btn btn-primary btn-lg btn-block" style="height: 60px; font-size: 1.2rem;">
                    Authorize and Execute Order
                    <img src="<?= NI ?>ni-arrow-right-circle.png">
                </button>
            </div>
            
            <div class="flex-gap mt-4 justify-center" style="opacity: 0.6;">
                <img src="<?= NI ?>ni-info.png" style="width: 14px;">
                <span class="td-sub" style="font-size: 0.75rem;">Payment is COD (Cash on Delivery) via direct P2P exchange.</span>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

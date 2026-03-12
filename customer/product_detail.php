<?php
$required_role = 'customer';
require '../includes/session_check.php';
require '../db.php';

$product_id = $_GET['id'] ?? 0;
$stmt = $pdo->prepare("SELECT p.*, f.Name as Farmer_Name, f.Phone, f.Address, f.Email 
                       FROM products p JOIN farmers f ON p.Farmer_ID = f.Farmer_ID 
                       WHERE p.Product_ID = ? AND p.Status = 'approved'");
$stmt->execute([$product_id]);
$product = $stmt->fetch();

if (!$product) {
    header("Location: browse.php?error=Asset unavailable.");
    exit();
}

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="browse.php">Marketplace</a>
            <span class="breadcrumb-sep">/</span>
            <span>Asset Specifications</span>
        </div>
        <h1 class="page-title"><?= htmlspecialchars($product['Product_Name']) ?></h1>
        <p class="page-subtitle">Unique Identifier: P-<?= str_pad($product_id, 5, '0', STR_PAD_LEFT) ?></p>
    </div>
    <div class="page-actions">
        <a href="browse.php" class="btn btn-ghost">
            <img src="<?= NI ?>ni-arrow-left.png"> Return to Index
        </a>
        <img src="<?= EC ?>ec-taking-note.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="g2 mb-5">
    <!-- Visual Specification -->
    <div class="card" style="padding: 0; overflow: hidden; height: 500px;">
         <?php 
            $img = $product['Image_Path'] ?? $product['Image'] ?? null;
            if($img): 
        ?>
            <img src="/farm2market/uploads/products/<?= htmlspecialchars($img) ?>" style="width: 100%; height: 100%; object-fit: cover;">
        <?php else: ?>
            <div class="empty-state" style="height: 100%; border-radius: 0;">
                <img src="<?= NI ?>ni-shopping-cart.png" style="width: 80px; opacity: 0.1;">
                <p>No visual telemetry available</p>
            </div>
        <?php endif; ?>
    </div>

    <!-- Metadata Panel -->
    <div class="card" style="display: flex; flex-direction: column;">
        <div class="card-body" style="padding: 1.5rem; flex: 1;">
            <div class="flex-between align-center mb-4">
                <div class="flex-gap">
                    <img src="<?= catIcon($product['Category']) ?>" style="width: 16px; opacity: 0.6;">
                    <span class="badge badge-approved" style="background: var(--bg-primary); border: 1px solid var(--green-dim);"><?= strtoupper($product['Category']) ?></span>
                </div>
                <div class="flex-gap">
                    <div class="td-avatar" style="width: 28px; height: 28px;">
                        <img src="<?= avatar($product['Farmer_ID']) ?>">
                    </div>
                    <span class="td-name" style="font-size: 0.85rem;"><?= htmlspecialchars($product['Farmer_Name']) ?></span>
                </div>
            </div>

            <h2 class="td-name" style="font-size: 2.2rem; margin-bottom: 0.5rem;"><?= htmlspecialchars($product['Product_Name']) ?></h2>
            <div class="mb-4">
                <span class="td-name" style="font-size: 2.5rem; color: var(--gold-700);">₹<?= number_format($product['Price'], 2) ?></span>
                <span class="td-sub" style="font-size: 1rem;">/ per unit</span>
            </div>

            <div class="consumer-box mb-4" style="background: var(--bg-secondary);">
                <div class="td-sub mb-2" style="font-weight: 700; color: var(--green-800);">SPECIFICATIONS / DESCRIPTION</div>
                <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);">
                    <?= nl2br(htmlspecialchars($product['Description'] ?: 'No additional specification logs available for this agricultural asset.')) ?>
                </p>
            </div>

            <div class="g2 mb-4">
                <div class="spec-card">
                    <div class="td-sub">STOCK QUANTITY</div>
                    <div class="td-name <?= $product['Quantity'] > 0 ? '' : 'text-red' ?>" style="font-size: 1.5rem;"><?= $product['Quantity'] ?> Units</div>
                </div>
                <div class="spec-card">
                    <div class="td-sub">ORIGIN NODE</div>
                    <div class="td-name" style="font-size: 1.2rem;"><?= htmlspecialchars($product['Farmer_Name']) ?></div>
                </div>
            </div>
        </div>

        <div class="card-footer" style="padding: 1.5rem; background: var(--bg-primary); border-top: 1px solid var(--border-dim);">
            <?php if($product['Quantity'] > 0): ?>
                <form action="place_order.php" method="GET" class="flex-gap">
                    <input type="hidden" name="id" value="<?= $product_id ?>">
                    <div style="width: 100px;">
                        <label class="td-sub mb-1 block">Units Required</label>
                        <input type="number" name="qty" min="1" max="<?= $product['Quantity'] ?>" value="1" class="form-control" style="height: 50px; font-weight: 700;">
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg" style="flex: 1; height: 50px; font-size: 1.1rem;">
                        Initialize Procurement
                        <img src="<?= NI ?>ni-arrow-right-circle.png">
                    </button>
                </form>
            <?php else: ?>
                <button class="btn btn-ghost btn-lg btn-block" disabled style="border-color: var(--red-200); color: var(--red-500);">
                    <img src="<?= NI ?>ni-x.png">
                    Inventory Depleted
                </button>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php include '../includes/header.php'; ?>
<style>
.spec-card { border: 1px solid var(--border-dim); padding: 1rem; border-radius: 12px; }
</style>
<?php include '../includes/footer.php'; ?>

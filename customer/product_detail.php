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

// Ensure the image URL works even when included in place_order.php (which shares this file visually sometimes, but we render directly here)
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> ASSET SPECIFICATIONS</h2>
            <p>Identifier: P-<?= str_pad($product_id, 5, '0', STR_PAD_LEFT) ?></p>
        </div>
        <a href="browse.php" class="btn btn-sm" style="border:1px solid var(--border-dim)">[ RETURN TO INDEX ]</a>
    </div>

    <div class="grid-2">
        <!-- Visual Component -->
        <div class="card" style="padding:0; overflow:hidden;">
             <?php if($product['Image_Path'] && file_exists('../uploads/products/'.$product['Image_Path'])): ?>
                <img src="/farm2market/uploads/products/<?= htmlspecialchars($product['Image_Path']) ?>" style="width:100%; height:100%; object-fit:cover; display:block; min-height:400px; filter:contrast(1.1) brightness(0.9);">
            <?php else: ?>
                <div class="img-placeholder" style="height:100%; min-height:400px; font-size:1.5rem;">[ NO_VISUAL_DATA ]</div>
            <?php endif; ?>
        </div>

        <!-- Meta Component -->
        <div class="card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <div class="flex justify-between align-center mb-2">
                    <span class="badge" style="border:1px solid var(--green-dim); color:var(--text-secondary);"><?= strtoupper($product['Category']) ?></span>
                </div>
                
                <h1 class="glow text-primary" style="margin-top:0; font-size:2rem;"><?= htmlspecialchars($product['Product_Name']) ?></h1>
                
                <div class="glow-amber" style="font-size:2.5rem; font-weight:700; margin:1rem 0;">
                    ₹<?= $product['Price'] ?> <span style="font-size:1rem; color:var(--text-muted); font-weight:normal;">/ unit</span>
                </div>
                
                <div style="padding:1rem; background:var(--bg-input); border:1px dashed var(--border-dim); color:var(--text-secondary); margin-bottom:1.5rem;">
                    <strong>METADATA / DESC:</strong><br>
                    <?= nl2br(htmlspecialchars($product['Description'] ?: 'No additional metadata available for this asset.')) ?>
                </div>

                <div class="grid-2 mb-3" style="gap:1rem;">
                    <div style="border:1px solid var(--border-dim); padding:0.75rem;">
                        <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.25rem;">CURRENT STOCK TICKER</div>
                        <div class="glow <?= $product['Quantity']>0?'':'text-red' ?>" style="font-size:1.5rem; font-weight:700;"><?= $product['Quantity'] ?> UNITS</div>
                    </div>
                    <div style="border:1px solid var(--border-dim); padding:0.75rem;">
                        <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.25rem;">PROVIDER IDENTIFIER</div>
                        <div class="glow" style="font-size:1.2rem; font-weight:700; color:var(--text-primary);"><?= htmlspecialchars($product['Farmer_Name']) ?></div>
                    </div>
                </div>
            </div>

            <!-- Action Block -->
            <div style="border-top:1px solid var(--border-dim); padding-top:1.5rem;">
                <?php if($product['Quantity'] > 0): ?>
                    <form action="place_order.php" method="GET" class="flex gap-2">
                        <input type="hidden" name="id" value="<?= $product_id ?>">
                        <div style="max-width:120px;">
                            <label style="margin-bottom:0.25rem;">UNITS REQ.</label>
                            <input type="number" name="qty" min="1" max="<?= $product['Quantity'] ?>" value="1" style="height:42px;">
                        </div>
                        <button type="submit" class="btn btn-primary glow" style="flex:1; font-size:1.2rem; height:42px; margin-top:auto;">INITIALIZE PROCUREMENT</button>
                    </form>
                <?php else: ?>
                    <button class="btn btn-danger" style="width:100%; font-size:1.2rem; cursor:not-allowed;" disabled>[ INVENTORY DEPLETED ]</button>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

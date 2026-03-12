<?php
$required_role = 'customer';
require '../includes/session_check.php';
require '../db.php';

$category_filter = $_GET['category'] ?? 'all';
$search_query = $_GET['q'] ?? '';

$sql = "SELECT p.*, f.Name as Farmer FROM products p JOIN farmers f ON p.Farmer_ID = f.Farmer_ID WHERE p.Status = 'approved' AND p.Quantity > 0";
$params = [];

if ($category_filter !== 'all') {
    $sql .= " AND p.Category = ?";
    $params[] = $category_filter;
}
if (!empty($search_query)) {
    $sql .= " AND (p.Product_Name LIKE ? OR f.Name LIKE ?)";
    $params[] = "%$search_query%";
    $params[] = "%$search_query%";
}

$sql .= " ORDER BY p.Created_At DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

$categories = ['all','vegetables','fruits','grains','dairy','poultry','spices','herbs','other'];
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> ASSET EXCHANGE INDEX</h2>
            <p>Browse available nodes in the network</p>
        </div>
    </div>

    <!-- Filters/Search -->
    <div class="card mb-3" style="padding:1rem;">
        <form method="GET" class="flex gap-3 align-center" style="flex-wrap:wrap;">
            <div style="flex:1; min-width:200px;">
                <input type="text" name="q" placeholder="SCAN ARCHIVE... (Asset or Provider Name)" value="<?= htmlspecialchars($search_query) ?>">
            </div>
            <div>
                <select name="category" onchange="this.form.submit()" style="padding:0.6rem; min-width:150px;">
                    <?php foreach($categories as $c): ?>
                        <option value="<?= $c ?>" <?= $category_filter===$c?'selected':'' ?>><?= strtoupper($c) ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <button type="submit" class="btn btn-primary" style="padding:0.6rem 1.5rem;">EXECUTE QUERY</button>
            <?php if(!empty($search_query) || $category_filter !== 'all'): ?>
                <a href="browse.php" class="btn btn-danger" style="padding:0.6rem 1rem;">RESET</a>
            <?php endif; ?>
        </form>
    </div>

    <div class="grid-auto">
        <?php foreach($products as $p): ?>
        <div class="product-card">
            <?php if($p['Image_Path'] && file_exists('../uploads/products/'.$p['Image_Path'])): ?>
                <img src="/farm2market/uploads/products/<?= $p['Image_Path'] ?>" alt="<?= htmlspecialchars($p['Product_Name']) ?>">
            <?php else: ?>
                <div class="img-placeholder">NO_IMAGE_DATA</div>
            <?php endif; ?>
            
            <div class="product-card-body">
                <span class="badge" style="border:1px solid var(--green-dim); color:var(--text-secondary); width:max-content; margin-bottom:0.5rem;"><?= strtoupper($p['Category']) ?></span>
                
                <div class="product-name glow text-md" style="font-size:1.1rem;"><?= htmlspecialchars($p['Product_Name']) ?></div>
                
                <div class="flex justify-between align-center" style="margin-top:0.5rem;">
                    <span class="product-price glow-amber" style="font-size:1.3rem;">₹<?= $p['Price'] ?></span>
                    <span style="font-size:0.75rem; color:var(--text-muted)">Avail: <?= $p['Quantity'] ?></span>
                </div>
                
                <div class="product-farmer mt-1 glow" style="color:var(--text-primary); border-top:1px dashed var(--border-dim); padding-top:0.5rem; margin-bottom:1rem;">
                    NODE: [ <?= htmlspecialchars($p['Farmer']) ?> ]
                </div>
                
                <a href="product_detail.php?id=<?= $p['Product_ID'] ?>" class="btn btn-primary text-center" style="width:100%;">REQUEST PROCUREMENT DATA</a>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

    <?php if(empty($products)): ?>
        <div class="card text-center" style="padding:4rem; margin-top:1rem;">
            <div class="glow-amber" style="font-size:2rem; margin-bottom:1rem;">ERROR 404: ASSETS NOT FOUND</div>
            <p style="color:var(--text-muted)">No entities match your current query parameters.</p>
        </div>
    <?php endif; ?>
</div>

<?php include '../includes/footer.php'; ?>

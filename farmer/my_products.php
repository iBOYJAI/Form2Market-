<?php
$required_role = 'farmer';
require '../includes/session_check.php';
require '../db.php';

$farmer_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['id'])) {
    if ($_POST['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM products WHERE Product_ID = ? AND Farmer_ID = ?");
        $stmt->execute([$_POST['id'], $farmer_id]);
        header("Location: my_products.php?success=1");
        exit();
    }
}

$status_filter = $_GET['status'] ?? 'all';
$sql = "SELECT * FROM products WHERE Farmer_ID = ?";
$params = [$farmer_id];

if (in_array($status_filter, ['pending','approved','rejected'])) {
    $sql .= " AND Status = ?";
    $params[] = $status_filter;
}
$sql .= " ORDER BY Created_At DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> ASSET INVENTORY</h2>
            <p>Manage and Monitor Active Listings</p>
        </div>
        <a href="add_product.php" class="btn btn-primary">+ ADD PRODUCT</a>
    </div>

    <div style="display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap;">
        <a href="?status=all" class="btn <?= $status_filter==='all'?'btn-primary':'btn-sm' ?>" style="border:1px solid var(--border-dim)">ALL</a>
        <a href="?status=pending" class="btn <?= $status_filter==='pending'?'btn-primary':'btn-sm' ?>" style="border:1px solid var(--border-dim)">PENDING</a>
        <a href="?status=approved" class="btn <?= $status_filter==='approved'?'btn-primary':'btn-sm' ?>" style="border:1px solid var(--border-dim)">APPROVED</a>
        <a href="?status=rejected" class="btn <?= $status_filter==='rejected'?'btn-primary':'btn-sm' ?>" style="border:1px solid var(--border-dim)">REJECTED</a>
        
        <input type="text" id="asset-search" placeholder="Search local inventory..." style="max-width:250px; margin-left:auto; padding:0.4rem;">
    </div>

    <div class="grid-auto">
        <?php foreach($products as $p): ?>
        <div class="product-card f-card">
            <?php if($p['Image_Path'] && file_exists('../uploads/products/'.$p['Image_Path'])): ?>
                <img src="/farm2market/uploads/products/<?= $p['Image_Path'] ?>" alt="<?= htmlspecialchars($p['Product_Name']) ?>">
            <?php else: ?>
                <div class="img-placeholder">NO_IMAGE_DATA</div>
            <?php endif; ?>
            
            <div class="product-card-body">
                <div class="flex justify-between align-center mb-1">
                    <span class="badge" style="border:1px solid var(--green-dim); color:var(--text-secondary)"><?= strtoupper($p['Category']) ?></span>
                    <span class="badge badge-<?= $p['Status'] ?>"><?= $p['Status'] ?></span>
                </div>
                <div class="product-name search-target"><?= htmlspecialchars($p['Product_Name']) ?></div>
                <div class="product-price">₹<?= $p['Price'] ?> <span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">/ unit</span></div>
                <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1rem;">Stock: <?= $p['Quantity'] ?></div>
                
                <div class="flex gap-2" style="margin-top:auto;">
                    <a href="edit_product.php?id=<?= $p['Product_ID'] ?>" class="btn btn-sm" style="flex:1; text-align:center; border:1px solid var(--amber-dim); color:var(--amber);">EDIT</a>
                    <form method="POST" style="flex:1; display:flex;" onsubmit="return confirm('Purge this asset from the database?')">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= $p['Product_ID'] ?>">
                        <button type="submit" class="btn btn-sm btn-danger" style="width:100%;">DELETE</button>
                    </form>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

    <?php if(empty($products)): ?>
        <div class="card text-center" style="padding:4rem; color:var(--text-muted);">
            No inventory found matching criteria.<br>
            [ EOF ]
        </div>
    <?php endif; ?>

</div>

<script>
    document.getElementById('asset-search').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.f-card').forEach(card => {
            const txt = card.querySelector('.search-target').textContent.toLowerCase();
            card.style.display = txt.includes(query) ? 'flex' : 'none';
        });
    });
</script>

<?php include '../includes/footer.php'; ?>

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

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Farmer</a>
            <span class="breadcrumb-sep">/</span>
            <span>Asset Inventory</span>
        </div>
        <h1 class="page-title">My Farm Produce</h1>
        <p class="page-subtitle">Manage and monitor your active listings and stock levels.</p>
    </div>
    <div class="page-actions">
        <a href="add_product.php" class="btn btn-primary">
            <img src="<?= NI ?>ni-plus.png"> Add New Product
        </a>
        <img src="<?= EC ?>ec-taking-note.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="filter-tabs mb-4">
    <a href="?status=all" class="ftab <?= $status_filter === 'all' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-house.png"> All Items
    </a>
    <a href="?status=approved" class="ftab <?= $status_filter === 'approved' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-check.png"> Approved
    </a>
    <a href="?status=pending" class="ftab <?= $status_filter === 'pending' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-exclamation-triangle.png"> Pending
    </a>
    <a href="?status=rejected" class="ftab <?= $status_filter === 'rejected' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-x.png"> Rejected
    </a>
    
    <div class="topbar-search" style="margin-left: auto; width: 250px; background: var(--bg-card);">
        <img src="<?= NI ?>ni-info.png" style="opacity: 0.4;">
        <input type="text" id="asset-search" placeholder="Search inventory...">
    </div>
</div>

<div class="g3">
    <?php foreach($products as $p): ?>
    <div class="card p-card f-card">
        <div class="p-card-img">
            <?php 
                $img = $p['Image_Path'] ?? $p['Image'] ?? null;
                if($img): 
            ?>
                <img src="/farm2market/uploads/products/<?= htmlspecialchars($img) ?>" class="search-target-img">
            <?php else: ?>
                <div class="empty-state" style="padding: 1rem; border-radius: 0;">
                    <img src="<?= NI ?>ni-shopping-cart.png" style="width: 40px; opacity: 0.2;">
                </div>
            <?php endif; ?>
            <div class="p-card-badge">
                <span class="badge badge-<?= $p['Status'] ?>"><?= $p['Status'] ?></span>
            </div>
        </div>
        <div class="card-body">
            <div class="flex-gap mb-1">
                <img src="<?= catIcon($p['Category']) ?>" style="width: 14px; opacity: 0.6;">
                <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);"><?= $p['Category'] ?></span>
            </div>
            <h3 class="td-name search-target-name"><?= htmlspecialchars($p['Product_Name']) ?></h3>
            <div class="flex-between align-end mt-2">
                <div>
                    <div class="td-name" style="color: var(--green-700); font-size: 1.1rem;">₹<?= number_format($p['Price'], 2) ?></div>
                    <div class="td-sub">Stock: <?= $p['Quantity'] ?> Units</div>
                </div>
                <div class="flex-gap gap-sm">
                    <a href="edit_product.php?id=<?= $p['Product_ID'] ?>" class="btn btn-icon btn-sm btn-outline" title="Edit Listing">
                        <img src="<?= NI ?>ni-edit.png">
                    </a>
                    <form method="POST" onsubmit="return confirm('Purge this asset from the database?')">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= $p['Product_ID'] ?>">
                        <button type="submit" class="btn btn-icon btn-sm btn-outline" style="border-color: var(--red-200);" title="Delete Permanent">
                            <img src="<?= NI ?>ni-trash.png">
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<?php if(empty($products)): ?>
    <div class="empty-state card" style="padding: 5rem 2rem;">
        <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
        <h3>No Assets Found</h3>
        <p>Your local agricultural registry is currently initialized with zero listings.</p>
        <a href="add_product.php" class="btn btn-primary mt-3">List New Product</a>
    </div>
<?php endif; ?>

<script>
    document.getElementById('asset-search')?.addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.f-card').forEach(card => {
            const name = card.querySelector('.search-target-name').textContent.toLowerCase();
            card.style.display = name.includes(q) ? '' : 'none';
        });
    });
</script>

<?php include '../includes/footer.php'; ?>

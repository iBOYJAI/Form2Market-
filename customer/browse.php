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

$categories = [
    ['id' => 'all', 'label' => 'All Assets', 'icon' => 'ni-house.png'],
    ['id' => 'vegetables', 'label' => 'Vegetables', 'icon' => 'ni-butterfly.png'],
    ['id' => 'fruits', 'label' => 'Fruits', 'icon' => 'ni-picking-fruit.png'],
    ['id' => 'grains', 'label' => 'Grains', 'icon' => 'ni-collection.png'],
    ['id' => 'dairy', 'label' => 'Dairy', 'icon' => 'ni-award.png'],
    ['id' => 'poultry', 'label' => 'Poultry', 'icon' => 'ni-butterfly.png'],
    ['id' => 'spices', 'label' => 'Spices', 'icon' => 'ni-scissors.png'],
    ['id' => 'herbs', 'label' => 'Herbs', 'icon' => 'ni-butterfly.png'],
    ['id' => 'other', 'label' => 'Other', 'icon' => 'ni-shopping-cart.png'],
];
?>

<?php include '../includes/header.php'; ?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Customer</a>
            <span class="breadcrumb-sep">/</span>
            <span>Marketplace</span>
        </div>
        <h1 class="page-title">Asset Exchange Index</h1>
        <p class="page-subtitle">Scan and procure fresh agricultural assets directly from local production nodes.</p>
    </div>
    <div class="page-actions">
        <img src="<?= EC ?>ec-easy-shopping.png" style="width: 120px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<!-- Filters Bar -->
<div class="card mb-4" style="padding: 1rem;">
    <form method="GET" class="flex-between align-center flex-wrap gap-4">
        <div class="topbar-search" style="flex: 1; min-width: 300px; background: var(--bg-secondary);">
            <img src="<?= NI ?>ni-info.png" style="opacity: 0.4;">
            <input type="text" name="q" placeholder="Search archive (Asset or Provider Name)..." value="<?= htmlspecialchars($search_query) ?>">
        </div>
        
        <div class="flex-gap">
            <?php if(!empty($search_query) || $category_filter !== 'all'): ?>
                <a href="browse.php" class="btn btn-ghost">Reset Filters</a>
            <?php endif; ?>
            <button type="submit" class="btn btn-primary">Execute Query</button>
        </div>
    </form>
</div>

<!-- Category Ribbon -->
<div class="category-ribbon mb-4">
    <?php foreach($categories as $cat): ?>
        <a href="?category=<?= $cat['id'] ?>&q=<?= urlencode($search_query) ?>" class="cat-chip <?= $category_filter === $cat['id'] ? 'active' : '' ?>">
            <img src="<?= NI . $cat['icon'] ?>">
            <span><?= $cat['label'] ?></span>
        </a>
    <?php endforeach; ?>
</div>

<div class="g4">
    <?php foreach($products as $p): ?>
    <div class="card p-card">
        <div class="p-card-img">
            <?php 
                $img = $p['Image_Path'] ?? $p['Image'] ?? null;
                if($img): 
            ?>
                <img src="/farm2market/uploads/products/<?= htmlspecialchars($img) ?>">
            <?php else: ?>
                <div class="empty-state" style="padding: 2rem; border-radius: 0;">
                    <img src="<?= NI ?>ni-shopping-cart.png" style="width: 50px; opacity: 0.15;">
                </div>
            <?php endif; ?>
            <div class="p-card-badge">
                <span class="badge badge-approved" style="background: var(--bg-primary); border: 1px solid var(--green-dim);"><?= strtoupper($p['Category']) ?></span>
            </div>
        </div>
        <div class="card-body">
            <h3 class="td-name" style="font-size: 1.1rem; margin-bottom: 0.25rem;"><?= htmlspecialchars($p['Product_Name']) ?></h3>
            <div class="td-user mb-4">
                <div class="td-avatar" style="width: 24px; height: 24px;">
                    <img src="<?= avatar($p['Farmer_ID']) ?>">
                </div>
                <span class="td-sub" style="font-size: 0.75rem;">Node: <?= htmlspecialchars($p['Farmer']) ?></span>
            </div>
            
            <div class="flex-between align-end mt-auto">
                <div>
                    <div class="td-name" style="color: var(--gold-700); font-size: 1.3rem;">₹<?= number_format($p['Price'], 2) ?></div>
                    <div class="td-sub">Avail: <?= $p['Quantity'] ?> Units</div>
                </div>
                <a href="product_detail.php?id=<?= $p['Product_ID'] ?>" class="btn btn-icon btn-primary" title="Details">
                    <img src="<?= NI ?>ni-arrow-right-circle.png">
                </a>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<?php if(empty($products)): ?>
    <div class="empty-state card" style="padding: 5rem 2rem;">
        <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
        <h3>Asset Not Found</h3>
        <p>No agricultural entities match your current network query.</p>
        <a href="browse.php" class="btn btn-outline btn-sm mt-3">Reset Scan</a>
    </div>
<?php endif; ?>

<?php include '../includes/footer.php'; ?>

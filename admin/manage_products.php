<?php
$required_role = 'admin';
require '../includes/session_check.php';
require '../db.php';

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['id'])) {
    $id = $_POST['id'];
    $act = $_POST['action'];
    
    if ($act === 'approve' || $act === 'reject') {
        $status = $act === 'approve' ? 'approved' : 'rejected';
        $stmt = $pdo->prepare("UPDATE products SET Status = ? WHERE Product_ID = ?");
        $stmt->execute([$status, $id]);
    } elseif ($act === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM products WHERE Product_ID = ?");
        $stmt->execute([$id]);
    }
    header("Location: manage_products.php?success=1");
    exit();
}

$filter = $_GET['status'] ?? 'all';
$sql = "SELECT p.*, f.Name as Farmer FROM products p JOIN farmers f ON p.Farmer_ID = f.Farmer_ID";
$params = [];
if (in_array($filter, ['pending', 'approved', 'rejected'])) {
    $sql .= " WHERE p.Status = ?";
    $params[] = $filter;
}
$sql .= " ORDER BY p.Product_ID DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Admin</a>
            <span class="breadcrumb-sep">/</span>
            <span>Product Catalog</span>
        </div>
        <h1 class="page-title">Marketplace Inventory</h1>
        <p class="page-subtitle">Moderate and manage agricultural listing parameters across the network.</p>
    </div>
    <div class="page-actions">
        <img src="<?= EC ?>ec-analyzing-market-price.png" style="width: 120px; opacity: 0.15; position: absolute; top: 1rem; right: 2.5rem; pointer-events: none;">
    </div>
</div>

<div class="filter-tabs mb-4">
    <a href="?status=all" class="ftab <?= $filter === 'all' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-house.png"> All Items
    </a>
    <a href="?status=pending" class="ftab <?= $filter === 'pending' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-exclamation-triangle.png"> Pending
    </a>
    <a href="?status=approved" class="ftab <?= $filter === 'approved' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-check.png"> Approved
    </a>
    <a href="?status=rejected" class="ftab <?= $filter === 'rejected' ? 'active' : '' ?>">
        <img src="<?= NI ?>ni-x.png"> Rejected
    </a>
</div>

<div class="card" style="padding:0;">
    <div class="card-body" style="padding: 0;">
        <?php if(empty($products)): ?>
            <div class="empty-state">
                <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
                <h3>No Products Found</h3>
                <p>The marketplace has no listings matching current criteria.</p>
            </div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Product Details</th>
                        <th>Provider</th>
                        <th>Category</th>
                        <th>Price & Qty</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($products as $p): ?>
                    <tr>
                        <td>
                            <div class="td-product">
                                <div class="td-product-img">
                                    <?php 
                                        $img = $p['Image_Path'] ?? $p['Image'] ?? null;
                                        if($img): 
                                    ?>
                                        <img src="<?= htmlspecialchars(productImageSrc($img)) ?>">
                                    <?php else: ?>
                                        <img src="<?= NI ?>ni-shopping-cart.png" style="opacity:0.2; padding:10px;">
                                    <?php endif; ?>
                                </div>
                                <div>
                                    <div class="td-name"><?= htmlspecialchars($p['Product_Name']) ?></div>
                                    <div class="td-sub">ID: P-<?= str_pad($p['Product_ID'], 5, '0', STR_PAD_LEFT) ?></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="td-user">
                                <div class="td-avatar">
                                    <img src="<?= avatar($p['Farmer_ID']) ?>">
                                </div>
                                <span class="td-name"><?= htmlspecialchars($p['Farmer']) ?></span>
                            </div>
                        </td>
                        <td>
                            <div class="flex-gap">
                                <img src="<?= catIcon($p['Category']) ?>" style="width:14px; opacity:0.6;">
                                <span style="text-transform: capitalize; font-size: 0.85rem;"><?= $p['Category'] ?></span>
                            </div>
                        </td>
                        <td>
                            <div class="td-name"><?= CURRENCY ?><?= number_format($p['Price'], 2) ?></div>
                            <div class="td-sub"><?= $p['Quantity'] ?> Units available</div>
                        </td>
                        <td>
                            <span class="badge badge-<?= $p['Status'] ?>"><?= $o['Status'] ?? $p['Status'] ?></span>
                        </td>
                        <td>
                            <div class="flex-gap gap-sm">
                                <?php if($p['Status'] !== 'approved'): ?>
                                    <form method="POST">
                                        <input type="hidden" name="id" value="<?= $p['Product_ID'] ?>">
                                        <input type="hidden" name="action" value="approve">
                                        <button class="btn btn-icon btn-sm btn-primary" title="Approve Listing">
                                            <img src="<?= NI ?>ni-check.png">
                                        </button>
                                    </form>
                                <?php endif; ?>

                                <?php if($p['Status'] !== 'rejected'): ?>
                                    <form method="POST">
                                        <input type="hidden" name="id" value="<?= $p['Product_ID'] ?>">
                                        <input type="hidden" name="action" value="reject">
                                        <button class="btn btn-icon btn-sm btn-amber" title="Reject Listing">
                                            <img src="<?= NI ?>ni-x.png">
                                        </button>
                                    </form>
                                <?php endif; ?>

                                <form method="POST" onsubmit="return confirm('Delete this product permanently?')">
                                    <input type="hidden" name="id" value="<?= $p['Product_ID'] ?>">
                                    <input type="hidden" name="action" value="delete">
                                    <button class="btn btn-icon btn-sm btn-outline" title="Delete Permanent">
                                        <img src="<?= NI ?>ni-trash.png">
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

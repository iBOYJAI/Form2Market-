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
        // Option to unlink image if necessary, but DB cascading deletes orders.
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
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> PRODUCT CATALOG MANAGEMENT</h2>
            <p>Approve, Reject, or Delete Listed Items</p>
        </div>
    </div>

    <div style="display:flex; gap:1rem; margin-bottom:1.5rem;">
        <a href="?status=all" class="btn <?= $filter === 'all' ? 'btn-primary' : 'btn-sm' ?>" style="border:1px solid var(--border-dim)">ALL</a>
        <a href="?status=pending" class="btn <?= $filter === 'pending' ? 'btn-primary' : 'btn-sm' ?>" style="border:1px solid var(--border-dim)">PENDING</a>
        <a href="?status=approved" class="btn <?= $filter === 'approved' ? 'btn-primary' : 'btn-sm' ?>" style="border:1px solid var(--border-dim)">APPROVED</a>
        <a href="?status=rejected" class="btn <?= $filter === 'rejected' ? 'btn-primary' : 'btn-sm' ?>" style="border:1px solid var(--border-dim)">REJECTED</a>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
        <div class="table-responsive">
            <table>
                <tr>
                    <th width="50">IMG</th>
                    <th>ID</th><th>Provider</th><th>Product Name</th><th>Category</th><th>Price</th><th>Qty</th><th>Status</th><th>Actions</th>
                </tr>
                <?php foreach($products as $p): ?>
                <tr>
                    <td>
                        <?php if($p['Image_Path'] && file_exists('../uploads/products/'.$p['Image_Path'])): ?>
                            <img src="/farm2market/uploads/products/<?= $p['Image_Path'] ?>" style="width:40px; height:40px; object-fit:cover; border:1px solid var(--border-dim);">
                        <?php else: ?>
                            <div style="width:40px; height:40px; background:var(--bg-hover); font-size:10px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border-dim);">N/A</div>
                        <?php endif; ?>
                    </td>
                    <td>P-<?= $p['Product_ID'] ?></td>
                    <td><?= htmlspecialchars($p['Farmer']) ?></td>
                    <td><strong><?= htmlspecialchars($p['Product_Name']) ?></strong></td>
                    <td style="text-transform:capitalize;"><?= $p['Category'] ?></td>
                    <td>₹<?= $p['Price'] ?></td>
                    <td><?= $p['Quantity'] ?></td>
                    <td><span class="badge badge-<?= $p['Status'] ?>"><?= $p['Status'] ?></span></td>
                    <td style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
                        <?php if($p['Status'] !== 'approved'): ?>
                        <form method="POST"><input type="hidden" name="id" value="<?= $p['Product_ID'] ?>"><input type="hidden" name="action" value="approve"><button class="btn btn-sm btn-primary">APP</button></form>
                        <?php endif; ?>
                        <?php if($p['Status'] !== 'rejected'): ?>
                        <form method="POST"><input type="hidden" name="id" value="<?= $p['Product_ID'] ?>"><input type="hidden" name="action" value="reject"><button class="btn btn-sm btn-amber">REJ</button></form>
                        <?php endif; ?>
                        <form method="POST" onsubmit="return confirm('Delete this product permanently?')"><input type="hidden" name="id" value="<?= $p['Product_ID'] ?>"><input type="hidden" name="action" value="delete"><button class="btn btn-sm btn-danger">DEL</button></form>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if(empty($products)): ?>
                    <tr><td colspan="9" class="text-center">No products found matching the criteria.</td></tr>
                <?php endif; ?>
            </table>
        </div>
    </div>

</div>

<?php include '../includes/footer.php'; ?>

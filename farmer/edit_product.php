<?php
$required_role = 'farmer';
require '../includes/session_check.php';
require '../db.php';

$farmer_id = $_SESSION['user_id'];
$product_id = $_GET['id'] ?? 0;

// Verify ownership
$stmt = $pdo->prepare("SELECT * FROM products WHERE Product_ID = ? AND Farmer_ID = ?");
$stmt->execute([$product_id, $farmer_id]);
$product = $stmt->fetch();

if (!$product) {
    header("Location: my_products.php?error=notfound");
    exit();
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? 0;
    $quantity = $_POST['quantity'] ?? 0;
    $desc = trim($_POST['description'] ?? '');
    
    // File handle
    $image_path = $product['Image_Path'];
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (in_array($_FILES['image']['type'], $allowed)) {
            if ($_FILES['image']['size'] <= 2097152) { // 2MB
                $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $img_name = uniqid() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                
                $upload_dir = '../uploads/products/';
                if(!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $img_name)) {
                    // Remove old image if exists
                    if ($image_path && file_exists($upload_dir . $image_path)) {
                        unlink($upload_dir . $image_path);
                    }
                    $image_path = $img_name;
                } else {
                    $error = "Image upload failed.";
                }
            } else {
                $error = "Image size exceeds 2MB.";
            }
        } else {
            $error = "Invalid image format.";
        }
    }

    if (empty($error)) {
        if (empty($name) || empty($category) || $price <= 0 || $quantity < 0) {
            $error = "Invalid parameters provided.";
        } else {
            try {
                $stmt = $pdo->prepare("UPDATE products SET Product_Name=?, Category=?, Price=?, Quantity=?, Description=?, Image_Path=?, Status='pending' WHERE Product_ID=? AND Farmer_ID=?");
                $stmt->execute([$name, $category, $price, $quantity, $desc, $image_path, $product_id, $farmer_id]);
                
                header("Location: my_products.php?success=1");
                exit();
            } catch(PDOException $e) {
                $error = "Update failed: " . $e->getMessage();
            }
        }
    }
}
$categories = ['vegetables','fruits','grains','dairy','poultry','spices','herbs','other'];

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Farmer</a>
            <span class="breadcrumb-sep">/</span>
            <a href="my_products.php">Inventory</a>
            <span class="breadcrumb-sep">/</span>
            <span>Modify Asset</span>
        </div>
        <h1 class="page-title">Edit Product</h1>
        <p class="page-subtitle">Update parameters for Asset P-<?= str_pad($product_id, 5, '0', STR_PAD_LEFT) ?>.</p>
    </div>
    <div class="page-actions">
        <img src="<?= OC ?>oc-taking-note.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="card" style="max-width: 800px; margin: 0 auto 3rem;">
    <div class="card-head">
        <h3 class="card-head-title">Listing Modification</h3>
    </div>
    <div class="card-body">
        <div class="alert alert-warning mb-4">
            <img src="<?= NI ?>ni-exclamation-triangle.png">
            <span><strong>System Notice:</strong> Any modifications to active listings will reset the status to <strong>Pending</strong> and require administrative re-approval.</span>
        </div>

        <?php if($error): ?>
            <div class="alert alert-error mb-4">
                <img src="<?= NI ?>ni-exclamation-triangle.png">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data">
            <div class="g2">
                <div class="form-group">
                    <label>Product Name <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-shopping-bag.png" class="input-ico">
                        <input type="text" name="name" required placeholder="e.g. Organic Basil" value="<?= htmlspecialchars($product['Product_Name']) ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label>Category <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-tag.png" class="input-ico">
                        <select name="category" required style="padding-left: 2.6rem;">
                            <?php foreach($categories as $c): ?>
                                <option value="<?= $c ?>" <?= $product['Category'] === $c ? 'selected' : '' ?>><?= ucfirst($c) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
            </div>

            <div class="g2">
                <div class="form-group">
                    <label>Price (₹ per unit) <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-coins.png" class="input-ico">
                        <input type="number" step="0.01" name="price" required min="1" placeholder="0.00" value="<?= $product['Price'] ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label>Total Quantity <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-box.png" class="input-ico">
                        <input type="number" name="quantity" required min="1" placeholder="10" value="<?= $product['Quantity'] ?>">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Descriptive Metadata</label>
                <div class="input-wrap">
                    <img src="<?= NI ?>ni-file-text.png" class="input-ico" style="top: 1.2rem; transform: none;">
                    <textarea name="description" rows="5" placeholder="Details regarding farming method, freshness, etc." style="padding-left: 2.6rem;"><?= htmlspecialchars($product['Description']) ?></textarea>
                </div>
            </div>

            <div class="form-group">
                <label>Visual Asset</label>
                <div class="flex-gap align-start">
                    <?php 
                        $img = $product['Image_Path'] ?? $product['Image'] ?? null;
                        if($img): 
                    ?>
                        <div style="width: 80px; height: 80px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-dim); flex-shrink: 0;">
                            <img src="/farm2market/uploads/products/<?= htmlspecialchars($img) ?>" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    <?php endif; ?>
                    <div class="input-wrap" style="flex: 1;">
                        <img src="<?= NI ?>ni-image.png" class="input-ico">
                        <input type="file" name="image" accept="image/jpeg,image/png,image/webp" style="padding-left: 2.6rem;">
                        <div class="td-sub mt-1" style="font-size: 0.7rem;">Leave empty to maintain existing telemetry visual. Max 2MB.</div>
                    </div>
                </div>
            </div>

            <div class="flex-gap mt-4">
                <button type="submit" class="btn btn-primary btn-lg" style="flex: 1;">
                    Authorize Changes
                    <img src="<?= NI ?>ni-check.png">
                </button>
                <a href="my_products.php" class="btn btn-outline btn-lg">Discard Changes</a>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

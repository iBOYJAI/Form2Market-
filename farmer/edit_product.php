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
                // Editing forces pending status again if changed data significantly, but per spec "resets to pending" is standard for edits
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
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> MODIFY ASSET DATA</h2>
            <p>Update parameters for Asset P-<?= $product_id ?>. <br><span class="glow-amber">Warning: Modifications require admin re-approval.</span></p>
        </div>
        <a href="my_products.php" class="btn btn-sm" style="border:1px solid var(--border-dim)">[ CANCEL ]</a>
    </div>

    <div class="card" style="max-width:800px; margin:0 auto;">
        <?php if($error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data">
            <div class="grid-2">
                <div class="form-group">
                    <label>Product Name *</label>
                    <input type="text" name="name" required value="<?= htmlspecialchars($product['Product_Name']) ?>">
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" required>
                        <?php foreach($categories as $c): ?>
                            <option value="<?= $c ?>" <?= $product['Category'] === $c ? 'selected' : '' ?>><?= ucfirst($c) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Price (₹ per unit) *</label>
                    <input type="number" step="0.01" name="price" required min="1" value="<?= $product['Price'] ?>">
                </div>
                <div class="form-group">
                    <label>Stock Quantity *</label>
                    <input type="number" name="quantity" required min="0" value="<?= $product['Quantity'] ?>">
                </div>
            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="5"><?= htmlspecialchars($product['Description']) ?></textarea>
            </div>

            <div class="form-group">
                <label>Update Image (Leave empty to keep current)</label>
                <?php if($product['Image_Path'] && file_exists('../uploads/products/'.$product['Image_Path'])): ?>
                    <div style="margin-bottom:0.5rem;">
                        <img src="/farm2market/uploads/products/<?= $product['Image_Path'] ?>" style="height:80px; width:80px; object-fit:cover; border:1px solid var(--border-dim);">
                    </div>
                <?php endif; ?>
                <input type="file" name="image" accept="image/jpeg,image/png,image/webp">
            </div>

            <div style="margin-top:2rem;">
                <button type="submit" class="btn btn-primary" style="font-size:1rem; padding:0.8rem 2rem;">[ SAVE AND SUBMIT FOR REVIEW ]</button>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

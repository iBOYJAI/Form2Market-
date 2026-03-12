<?php
$required_role = 'farmer';
require '../includes/session_check.php';
require '../db.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $category = $_POST['category'] ?? '';
    $price = $_POST['price'] ?? 0;
    $quantity = $_POST['quantity'] ?? 0;
    $desc = trim($_POST['description'] ?? '');
    
    // File handle
    $image_path = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (in_array($_FILES['image']['type'], $allowed)) {
            if ($_FILES['image']['size'] <= 2097152) { // 2MB
                $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                $img_name = uniqid() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                
                $upload_dir = '../uploads/products/';
                if(!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
                
                if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $img_name)) {
                    $image_path = $img_name;
                } else {
                    $error = "Failed to store image.";
                }
            } else {
                $error = "Image exceeds 2MB limit.";
            }
        } else {
            $error = "File type not supported. Use JPG, PNG, WEBP.";
        }
    }

    if (empty($error)) {
        if (empty($name) || empty($category) || $price <= 0 || $quantity <= 0) {
            $error = "Please fill all required valid parameters.";
        } else {
            try {
                $stmt = $pdo->prepare("INSERT INTO products (Farmer_ID, Product_Name, Category, Price, Quantity, Description, Image_Path, Status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");
                $stmt->execute([$_SESSION['user_id'], $name, $category, $price, $quantity, $desc, $image_path]);
                
                header("Location: my_products.php?success=1");
                exit();
            } catch(PDOException $e) {
                $error = "Database Error: " . $e->getMessage();
            }
        }
    }
}

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Farmer</a>
            <span class="breadcrumb-sep">/</span>
            <span>Initialize Asset</span>
        </div>
        <h1 class="page-title">List New Product</h1>
        <p class="page-subtitle">Provide agricultural data parameters for network approval.</p>
    </div>
    <div class="page-actions">
        <img src="<?= OC ?>oc-taking-note.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="card" style="max-width: 800px; margin: 0 auto 3rem;">
    <div class="card-head">
        <h3 class="card-head-title">Listing Specifications</h3>
    </div>
    <div class="card-body">
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
                        <input type="text" name="name" required placeholder="e.g. Organic Basil" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label>Category <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-tag.png" class="input-ico">
                        <select name="category" required style="padding-left: 2.6rem;">
                            <option value="">-- Select Type --</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="fruits">Fruits</option>
                            <option value="grains">Grains</option>
                            <option value="dairy">Dairy</option>
                            <option value="poultry">Poultry</option>
                            <option value="spices">Spices</option>
                            <option value="herbs">Herbs</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="g2">
                <div class="form-group">
                    <label>Price (<?= CURRENCY ?> per unit) <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-coins.png" class="input-ico">
                        <input type="number" step="0.01" name="price" required min="1" placeholder="0.00" value="<?= htmlspecialchars($_POST['price'] ?? '') ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label>Total Quantity <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-box.png" class="input-ico">
                        <input type="number" name="quantity" required min="1" placeholder="10" value="<?= htmlspecialchars($_POST['quantity'] ?? '') ?>">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label>Descriptive Metadata</label>
                <div class="input-wrap">
                    <img src="<?= NI ?>ni-file-text.png" class="input-ico" style="top: 1.2rem; transform: none;">
                    <textarea name="description" rows="5" placeholder="Details regarding farming method, freshness, etc." style="padding-left: 2.6rem;"><?= htmlspecialchars($_POST['description'] ?? '') ?></textarea>
                </div>
            </div>

            <div class="form-group">
                <label>Visual Asset (Image, Max 2MB)</label>
                <div class="input-wrap">
                    <img src="<?= NI ?>ni-image.png" class="input-ico">
                    <input type="file" name="image" accept="image/jpeg,image/png,image/webp" style="padding-left: 2.6rem;">
                </div>
            </div>

            <div class="flex-gap mt-4">
                <button type="submit" class="btn btn-primary btn-lg" style="flex: 1;">
                    Initialize Listing
                    <img src="<?= NI ?>ni-arrow-right-circle.png">
                </button>
                <a href="dashboard.php" class="btn btn-outline btn-lg">Cancel Abort</a>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

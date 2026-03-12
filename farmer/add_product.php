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
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> INITIALIZE NEW ASSET</h2>
            <p>List product for network approval</p>
        </div>
        <a href="dashboard.php" class="btn btn-sm" style="border:1px solid var(--border-dim)">[ CANCEL / ABORT ]</a>
    </div>

    <div class="card" style="max-width:800px; margin:0 auto;">
        <?php if($error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data">
            <div class="grid-2">
                <div class="form-group">
                    <label>Product Name *</label>
                    <input type="text" name="name" required placeholder="e.g. Organic Basil">
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" required>
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

            <div class="grid-2">
                <div class="form-group">
                    <label>Price (₹ per unit) *</label>
                    <input type="number" step="0.01" name="price" required min="1">
                </div>
                <div class="form-group">
                    <label>Total Available Quantity *</label>
                    <input type="number" name="quantity" required min="1">
                </div>
            </div>

            <div class="form-group">
                <label>Descriptive Metadata</label>
                <textarea name="description" rows="5" placeholder="Details regarding farming method, freshness, etc."></textarea>
            </div>

            <div class="form-group">
                <label>Visual Asset (Image, Max 2MB)</label>
                <input type="file" name="image" accept="image/jpeg,image/png,image/webp">
            </div>

            <div style="margin-top:2rem;">
                <button type="submit" class="btn btn-primary" style="font-size:1rem; padding:0.8rem 2rem;">[ EXECUTE INSERT ]</button>
            </div>
        </form>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

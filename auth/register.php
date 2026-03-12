<?php
require_once '../db.php';
session_start();

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm'] ?? '';
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $role = $_POST['role'] ?? '';

    if (empty($name) || empty($email) || empty($password) || empty($confirm) || empty($role)) {
        $error = "All required fields must be filled.";
    } elseif ($password !== $confirm) {
        $error = "Passwords do not match.";
    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters.";
    } else {
        $table = ($role === 'farmer') ? 'farmers' : 'customers';
        
        try {
            // Check email
            $stmt = $pdo->prepare("SELECT 1 FROM $table WHERE Email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                $error = "Email already registered in this role.";
            } else {
                $hash = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO $table (Name, Email, Password, Phone, Address) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$name, $email, $hash, $phone, $address]);
                
                $id = $pdo->lastInsertId();
                $_SESSION['user_id'] = $id;
                $_SESSION['role'] = $role;
                $_SESSION['name'] = $name;
                $_SESSION['email'] = $email;

                if ($role === 'farmer') header('Location: /farm2market/farmer/dashboard.php');
                else header('Location: /farm2market/customer/dashboard.php');
                exit();
            }
        } catch(PDOException $e) {
            $error = "Registration failed. " . $e->getMessage();
        }
    }
}
?>
<?php include '../includes/header.php'; ?>

<div class="auth-wrapper" style="padding: 3rem 1rem;">
    <div class="auth-card" style="max-width: 500px;">
        <h2 class="auth-title">NEW USER REGISTRATION</h2>
        <p class="auth-subtitle">Create a localized trading identity.</p>

        <?php if($error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <div class="role-tabs">
            <button class="role-tab active" id="tab-farmer" onclick="switchRole('farmer')">FARMER</button>
            <button class="role-tab" id="tab-customer" onclick="switchRole('customer')">CUSTOMER</button>
        </div>

        <form method="POST" action="">
            <input type="hidden" name="role" id="reg-role" value="farmer">
            
            <div class="grid-2">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" required value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" required value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                </div>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Password *</label>
                    <input type="password" name="password" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password *</label>
                    <input type="password" name="confirm" required>
                </div>
            </div>

            <div class="form-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value="<?= htmlspecialchars($_POST['phone'] ?? '') ?>">
            </div>

            <div class="form-group">
                <label>Physical Address</label>
                <textarea name="address" rows="3"><?= htmlspecialchars($_POST['address'] ?? '') ?></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1rem;">REGISTER ENTITY</button>
        </form>
        
        <div style="text-align:center; margin-top:1.5rem; font-size:0.8rem;">
            <a href="login.php" style="color:var(--text-muted)">Already have an identity? Login.</a>
        </div>
    </div>
</div>

<script>
    function switchRole(role) {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-' + role).classList.add('active');
        document.getElementById('reg-role').value = role;
    }
</script>

<?php include '../includes/footer.php'; ?>

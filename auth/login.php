<?php
require_once '../db.php';
session_start();

$error = '';
if (isset($_GET['error']) && $_GET['error'] === 'unauthorized') {
    $error = "Access Denied.";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';

    if (empty($email) || empty($password) || empty($role)) {
        $error = "Please fill in all fields.";
    } else {
        $table = '';
        $id_col = '';
        $status_check = true;

        if ($role === 'admin') {
            $table = 'admin';
            $id_col = 'Admin_ID';
            $status_check = false;
        } elseif ($role === 'farmer') {
            $table = 'farmers';
            $id_col = 'Farmer_ID';
        } else {
            $table = 'customers';
            $id_col = 'Customer_ID';
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM $table WHERE Email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['Password'])) {
                if ($status_check && $user['Status'] === 'blocked') {
                    $error = "Account is blocked. Contact administrator.";
                } else {
                    $_SESSION['user_id'] = $user[$id_col];
                    $_SESSION['role'] = $role;
                    $_SESSION['name'] = $user['Name'];
                    $_SESSION['email'] = $user['Email'];

                    if ($role === 'admin') header('Location: /farm2market/admin/dashboard.php');
                    elseif ($role === 'farmer') header('Location: /farm2market/farmer/dashboard.php');
                    else header('Location: /farm2market/customer/dashboard.php');
                    exit();
                }
            } else {
                $error = "Invalid credentials.";
            }
        } catch(PDOException $e) {
            $error = "Database error.";
        }
    }
}

$layout_mode = 'auth';
require_once '../includes/header.php';
?>

<div class="auth-page">
    <div class="auth-visual">
        <div class="auth-illo">
            <img src="<?= EC ?>ec-improve-conversion-rate.png" alt="Login Illustration">
        </div>
        <h2 class="auth-visual-title">Welcome Back to the Source</h2>
        <p class="auth-visual-sub">Connect to your localized trading terminal and manage your agricultural assets with elite precision.</p>
    </div>

    <div class="auth-form-side">
        <div class="auth-box">
            <a href="/farm2market/index.php" class="auth-brand">
                <div class="ab-icon">
                    <img src="<?= NI ?>ni-picking-fruit.png" alt="Icon">
                </div>
                <div class="ab-name">FARM2MARKET</div>
            </a>
            
            <h1 class="auth-title">System Login</h1>
            <p class="auth-sub">Enter your credentials to initialize session.</p>

            <?php if($error): ?>
                <div class="alert alert-error">
                    <img src="<?= NI ?>ni-exclamation-triangle.png">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <div class="role-tabs">
                <button class="rtab active" onclick="switchRole('farmer', this)">
                    <img src="<?= NI ?>ni-picking-fruit.png"> Farmer
                </button>
                <button class="rtab" onclick="switchRole('customer', this)">
                    <img src="<?= NI ?>ni-house.png"> Customer
                </button>
                <button class="rtab" onclick="switchRole('admin', this)">
                    <img src="<?= NI ?>ni-user-square.png"> Admin
                </button>
            </div>

            <form method="POST" action="">
                <input type="hidden" name="role" id="login-role" value="farmer">
                
                <div class="form-group">
                    <label>Email Address <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-inbox.png" class="input-ico">
                        <input type="email" name="email" required placeholder="name@example.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Password <span class="req">*</span></label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-fingerprint-id.png" class="input-ico">
                        <input type="password" name="password" required placeholder="••••••••">
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg mt-4">
                    Initialize Protocol
                    <img src="<?= NI ?>ni-arrow-right-circle.png">
                </button>
            </form>

            <div class="auth-footer">
                Don't have an identity? <a href="register.php">Create Account</a>
            </div>
        </div>
    </div>
</div>

<script>
    function switchRole(role, btn) {
        document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('login-role').value = role;
    }
</script>

<?php require_once '../includes/footer.php'; ?>

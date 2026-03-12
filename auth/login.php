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
            $status_check = false; // Admin has no status column
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
?>
<?php include '../includes/header.php'; ?>

<div class="auth-wrapper">
    <div class="auth-card">
        <h2 class="auth-title">SYSTEM LOGIN</h2>
        <p class="auth-subtitle">Verify your identity to proceed.</p>

        <?php if($error): ?>
            <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <div class="role-tabs">
            <button class="role-tab" id="tab-admin" onclick="switchRole('admin')">ADMIN</button>
            <button class="role-tab active" id="tab-farmer" onclick="switchRole('farmer')">FARMER</button>
            <button class="role-tab" id="tab-customer" onclick="switchRole('customer')">CUSTOMER</button>
        </div>

        <form method="POST" action="">
            <input type="hidden" name="role" id="login-role" value="farmer">
            
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" required placeholder="user@farm.com">
            </div>
            
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="••••••••">
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%">INITIALIZE SESSION</button>
        </form>
        
        <div style="text-align:center; margin-top:1.5rem; font-size:0.8rem;">
            <a href="register.php" style="color:var(--text-muted)">Need an account? Register here.</a>
        </div>
    </div>
</div>

<script>
    function switchRole(role) {
        document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-' + role).classList.add('active');
        document.getElementById('login-role').value = role;
    }
</script>

<?php include '../includes/footer.php'; ?>

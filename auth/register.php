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

                if ($role === 'farmer') header('Location: ' . BASE_URL . 'farmer/dashboard.php');
                else header('Location: ' . BASE_URL . 'customer/dashboard.php');
                exit();
            }
        } catch(PDOException $e) {
            $error = "Registration failed. " . $e->getMessage();
        }
    }
}

$layout_mode = 'auth';
require_once '../includes/header.php';
?>

<div class="auth-page">
    <div class="auth-visual">
        <div class="auth-illo">
            <img src="<?= NC ?>nc-improve-signup-experience.png" alt="Register Illustration">
        </div>
        <h2 class="auth-visual-title">Join the Ecosystem</h2>
        <p class="auth-visual-sub">Create your localized trading identity and start transacting directly with the source.</p>
    </div>

    <div class="auth-form-side">
        <div class="auth-box" style="max-width: 500px;">
            <a href="<?= BASE_URL ?>index.php" class="auth-brand">
                <div class="ab-icon">
                    <img src="<?= NI ?>ni-picking-fruit.png" alt="Icon">
                </div>
                <div class="ab-name">FARM2MARKET</div>
            </a>
            
            <h1 class="auth-title">Create Identity</h1>
            <p class="auth-sub">Choose your role and provide your details.</p>

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
            </div>

            <form method="POST" action="">
                <input type="hidden" name="role" id="reg-role" value="farmer">
                
                <div class="g2">
                    <div class="form-group">
                        <label>Full Name <span class="req">*</span></label>
                        <div class="input-wrap">
                            <img src="<?= NI ?>ni-user.png" class="input-ico">
                            <input type="text" name="name" required placeholder="John Doe" value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email Address <span class="req">*</span></label>
                        <div class="input-wrap">
                            <img src="<?= NI ?>ni-inbox.png" class="input-ico">
                            <input type="email" name="email" required placeholder="john@example.com" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                        </div>
                    </div>
                </div>

                <div class="g2">
                    <div class="form-group">
                        <label>Password <span class="req">*</span></label>
                        <div class="input-wrap">
                            <img src="<?= NI ?>ni-fingerprint-id.png" class="input-ico">
                            <input type="password" name="password" required placeholder="••••••••">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password <span class="req">*</span></label>
                        <div class="input-wrap">
                            <img src="<?= NI ?>ni-fingerprint-id.png" class="input-ico">
                            <input type="password" name="confirm" required placeholder="••••••••">
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Phone Number</label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-info.png" class="input-ico">
                        <input type="tel" name="phone" placeholder="+1 (555) 000-0000" value="<?= htmlspecialchars($_POST['phone'] ?? '') ?>">
                    </div>
                </div>

                <div class="form-group">
                    <label>Physical Address</label>
                    <div class="input-wrap">
                        <img src="<?= NI ?>ni-house.png" class="input-ico" style="top: 1.2rem; transform: none;">
                        <textarea name="address" rows="3" placeholder="Enter your full address..." style="padding-left: 2.4rem;"><?= htmlspecialchars($_POST['address'] ?? '') ?></textarea>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-lg mt-2">
                    Register Identity
                    <img src="<?= NI ?>ni-arrow-right-circle.png">
                </button>
            </form>

            <div class="auth-footer">
                Already have an identity? <a href="login.php">Login Protocol</a>
            </div>
        </div>
    </div>
</div>

<script>
    function switchRole(role, btn) {
        document.querySelectorAll('.rtab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('reg-role').value = role;
    }
</script>

<?php require_once '../includes/footer.php'; ?>

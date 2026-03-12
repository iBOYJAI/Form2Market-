<?php
$required_role = 'admin';
require '../includes/session_check.php';
require '../db.php';

// Handle Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['id'], $_POST['type'])) {
    $id = $_POST['id'];
    $type = $_POST['type'] === 'farmer' ? 'farmers' : 'customers';
    $id_col = $_POST['type'] === 'farmer' ? 'Farmer_ID' : 'Customer_ID';
    
    if ($_POST['action'] === 'toggle') {
        $status = $_POST['current'] === 'active' ? 'blocked' : 'active';
        $stmt = $pdo->prepare("UPDATE {$type} SET Status = ? WHERE {$id_col} = ?");
        $stmt->execute([$status, $id]);
    } elseif ($_POST['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM {$type} WHERE {$id_col} = ?");
        $stmt->execute([$id]);
    }
    header("Location: manage_users.php?success=1");
    exit();
}

$farmers = $pdo->query("SELECT * FROM farmers ORDER BY Created_At DESC")->fetchAll();
$customers = $pdo->query("SELECT * FROM customers ORDER BY Created_At DESC")->fetchAll();
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> USER MANAGEMENT</h2>
            <p>Administer Farmers and Customers</p>
        </div>
    </div>

    <div class="role-tabs">
        <button class="role-tab active" onclick="showTab('farmers')">FARMERS (<?= count($farmers) ?>)</button>
        <button class="role-tab" onclick="showTab('customers')">CUSTOMERS (<?= count($customers) ?>)</button>
    </div>

    <!-- Farmers Tab -->
    <div id="tab-farmers" class="card" style="padding:0; overflow:hidden;">
        <div style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim); display:flex; justify-content:space-between; align-items:center;">
             <input type="text" id="search-farmers" placeholder="Search farmers..." style="max-width:300px; padding:0.4rem;">
        </div>
        <div class="table-responsive">
            <table>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                <?php foreach($farmers as $u): ?>
                <tr class="f-row">
                    <td>F-<?= $u['Farmer_ID'] ?></td>
                    <td class="s-name"><?= htmlspecialchars($u['Name']) ?></td>
                    <td class="s-email"><?= htmlspecialchars($u['Email']) ?></td>
                    <td><?= htmlspecialchars($u['Phone'] ?? '-') ?></td>
                    <td><span class="badge badge-<?= $u['Status'] ?>"><?= $u['Status'] ?></span></td>
                    <td><?= date('Y-m-d', strtotime($u['Created_At'])) ?></td>
                    <td style="display:flex; gap:0.5rem;">
                        <form method="POST" style="display:inline;">
                            <input type="hidden" name="type" value="farmer">
                            <input type="hidden" name="id" value="<?= $u['Farmer_ID'] ?>">
                            <input type="hidden" name="action" value="toggle">
                            <input type="hidden" name="current" value="<?= $u['Status'] ?>">
                            <button type="submit" class="btn btn-sm <?= $u['Status'] === 'active' ? 'btn-amber' : 'btn-primary' ?>">
                                <?= $u['Status'] === 'active' ? 'BLOCK' : 'ACTIVATE' ?>
                            </button>
                        </form>
                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this farmer forever? All their products will be deleted as well.')">
                            <input type="hidden" name="type" value="farmer">
                            <input type="hidden" name="id" value="<?= $u['Farmer_ID'] ?>">
                            <input type="hidden" name="action" value="delete">
                            <button type="submit" class="btn btn-sm btn-danger">X</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>

    <!-- Customers Tab -->
    <div id="tab-customers" class="card" style="padding:0; overflow:hidden; display:none;">
        <div style="background:var(--bg-primary); padding:1rem; border-bottom:1px solid var(--border-dim); display:flex; justify-content:space-between; align-items:center;">
             <input type="text" id="search-customers" placeholder="Search customers..." style="max-width:300px; padding:0.4rem;">
        </div>
        <div class="table-responsive">
            <table>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                <?php foreach($customers as $u): ?>
                <tr class="c-row">
                    <td>C-<?= $u['Customer_ID'] ?></td>
                    <td class="s-name"><?= htmlspecialchars($u['Name']) ?></td>
                    <td class="s-email"><?= htmlspecialchars($u['Email']) ?></td>
                    <td><?= htmlspecialchars($u['Phone'] ?? '-') ?></td>
                    <td><span class="badge badge-<?= $u['Status'] ?>"><?= $u['Status'] ?></span></td>
                    <td><?= date('Y-m-d', strtotime($u['Created_At'])) ?></td>
                    <td style="display:flex; gap:0.5rem;">
                        <form method="POST" style="display:inline;">
                            <input type="hidden" name="type" value="customer">
                            <input type="hidden" name="id" value="<?= $u['Customer_ID'] ?>">
                            <input type="hidden" name="action" value="toggle">
                            <input type="hidden" name="current" value="<?= $u['Status'] ?>">
                            <button type="submit" class="btn btn-sm <?= $u['Status'] === 'active' ? 'btn-amber' : 'btn-primary' ?>">
                                <?= $u['Status'] === 'active' ? 'BLOCK' : 'ACTIVATE' ?>
                            </button>
                        </form>
                        <form method="POST" style="display:inline;" onsubmit="return confirm('Delete this customer forever?')">
                            <input type="hidden" name="type" value="customer">
                            <input type="hidden" name="id" value="<?= $u['Customer_ID'] ?>">
                            <input type="hidden" name="action" value="delete">
                            <button type="submit" class="btn btn-sm btn-danger">X</button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>
    </div>

</div>

<script>
    function showTab(type) {
        document.getElementById('tab-farmers').style.display = type === 'farmers' ? 'block' : 'none';
        document.getElementById('tab-customers').style.display = type === 'customers' ? 'block' : 'none';
        
        const tabs = document.querySelectorAll('.role-tab');
        tabs[0].classList.toggle('active', type === 'farmers');
        tabs[1].classList.toggle('active', type === 'customers');
    }

    // Basic live search
    document.getElementById('search-farmers').addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.f-row').forEach(r => {
            const txt = r.innerText.toLowerCase();
            r.style.display = txt.includes(q) ? '' : 'none';
        });
    });
    document.getElementById('search-customers').addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.c-row').forEach(r => {
            const txt = r.innerText.toLowerCase();
            r.style.display = txt.includes(q) ? '' : 'none';
        });
    });
</script>

<?php include '../includes/footer.php'; ?>

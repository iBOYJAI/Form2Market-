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

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Admin</a>
            <span class="breadcrumb-sep">/</span>
            <span>User Management</span>
        </div>
        <h1 class="page-title">Network Registry</h1>
        <p class="page-subtitle">Moderate farmers and customers within the Farm2Market ecosystem.</p>
    </div>
    <div class="page-actions">
        <img src="<?= OC ?>oc-puzzle.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="role-tabs mb-4">
    <button class="rtab active" id="btn-farmers" onclick="showTab('farmers')">
        <img src="<?= NI ?>ni-picking-fruit.png"> Farmers (<?= count($farmers) ?>)
    </button>
    <button class="rtab" id="btn-customers" onclick="showTab('customers')">
        <img src="<?= NI ?>ni-users.png"> Customers (<?= count($customers) ?>)
    </button>
</div>

<!-- Farmers Tab -->
<div id="tab-farmers" class="card" style="padding:0;">
    <div class="card-head">
        <h3 class="card-head-title">Registered Farmers</h3>
        <div class="topbar-search" style="width: 260px; background: var(--bg-secondary);">
            <img src="<?= NI ?>ni-info.png" style="opacity: 0.4;">
            <input type="text" id="search-farmers" placeholder="Search farmers...">
        </div>
    </div>
    <div class="card-body" style="padding: 0;">
        <?php if(empty($farmers)): ?>
            <div class="empty-state">
                <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
                <h3>No Farmers Found</h3>
                <p>The registry is currently empty of agricultural providers.</p>
            </div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Identity</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($farmers as $u): ?>
                    <tr class="f-row">
                        <td>
                            <div class="td-user">
                                <div class="td-avatar">
                                    <img src="<?= avatar($u['Farmer_ID']) ?>">
                                </div>
                                <div>
                                    <div class="td-name"><?= htmlspecialchars($u['Name']) ?></div>
                                    <div class="td-sub">ID: F-<?= str_pad($u['Farmer_ID'], 4, '0', STR_PAD_LEFT) ?></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="td-name" style="font-size:0.8rem;"><?= htmlspecialchars($u['Email']) ?></div>
                            <div class="td-sub"><?= htmlspecialchars($u['Phone'] ?? '-') ?></div>
                        </td>
                        <td>
                            <div class="flex-gap">
                                <span class="badge badge-<?= $u['Status'] ?>"><?= $u['Status'] ?></span>
                            </div>
                        </td>
                        <td class="td-sub"><?= date('M d, Y', strtotime($u['Created_At'])) ?></td>
                        <td>
                            <div class="flex-gap gap-sm">
                                <form method="POST">
                                    <input type="hidden" name="type" value="farmer">
                                    <input type="hidden" name="id" value="<?= $u['Farmer_ID'] ?>">
                                    <input type="hidden" name="action" value="toggle">
                                    <input type="hidden" name="current" value="<?= $u['Status'] ?>">
                                    <button type="submit" class="btn btn-icon btn-sm <?= $u['Status'] === 'active' ? 'btn-danger' : 'btn-primary' ?>" title="<?= $u['Status'] === 'active' ? 'Block User' : 'Activate User' ?>">
                                        <img src="<?= NI . ($u['Status'] === 'active' ? 'ni-user-slash.png' : 'ni-ok.png') ?>">
                                    </button>
                                </form>
                                <form method="POST" onsubmit="return confirm('Delete this farmer forever?')">
                                    <input type="hidden" name="type" value="farmer">
                                    <input type="hidden" name="id" value="<?= $u['Farmer_ID'] ?>">
                                    <input type="hidden" name="action" value="delete">
                                    <button type="submit" class="btn btn-icon btn-sm btn-outline" title="Delete Permanent">
                                        <img src="<?= NI ?>ni-x.png">
                                    </button>
                                </form>
                                <a href="#" class="btn btn-icon btn-sm btn-outline" title="View Details">
                                    <img src="<?= NI ?>ni-info.png">
                                </a>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</div>

<!-- Customers Tab -->
<div id="tab-customers" class="card" style="padding:0; display:none;">
    <div class="card-head">
        <h3 class="card-head-title">Registered Customers</h3>
        <div class="topbar-search" style="width: 260px; background: var(--bg-secondary);">
            <img src="<?= NI ?>ni-info.png" style="opacity: 0.4;">
            <input type="text" id="search-customers" placeholder="Search customers...">
        </div>
    </div>
    <div class="card-body" style="padding: 0;">
        <?php if(empty($customers)): ?>
            <div class="empty-state">
                <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
                <h3>No Customers Found</h3>
                <p>No consumers have initialized their identities yet.</p>
            </div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Identity</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($customers as $u): ?>
                    <tr class="c-row">
                        <td>
                            <div class="td-user">
                                <div class="td-avatar">
                                    <img src="<?= avatar($u['Customer_ID']) ?>">
                                </div>
                                <div>
                                    <div class="td-name"><?= htmlspecialchars($u['Name']) ?></div>
                                    <div class="td-sub">ID: C-<?= str_pad($u['Customer_ID'], 5, '0', STR_PAD_LEFT) ?></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="td-name" style="font-size:0.8rem;"><?= htmlspecialchars($u['Email']) ?></div>
                            <div class="td-sub"><?= htmlspecialchars($u['Phone'] ?? '-') ?></div>
                        </td>
                        <td>
                            <div class="flex-gap">
                                <span class="badge badge-<?= $u['Status'] ?>"><?= $u['Status'] ?></span>
                            </div>
                        </td>
                        <td class="td-sub"><?= date('M d, Y', strtotime($u['Created_At'])) ?></td>
                        <td>
                            <div class="flex-gap gap-sm">
                                <form method="POST">
                                    <input type="hidden" name="type" value="customer">
                                    <input type="hidden" name="id" value="<?= $u['Customer_ID'] ?>">
                                    <input type="hidden" name="action" value="toggle">
                                    <input type="hidden" name="current" value="<?= $u['Status'] ?>">
                                    <button type="submit" class="btn btn-icon btn-sm <?= $u['Status'] === 'active' ? 'btn-danger' : 'btn-primary' ?>" title="<?= $u['Status'] === 'active' ? 'Block User' : 'Activate User' ?>">
                                        <img src="<?= NI . ($u['Status'] === 'active' ? 'ni-user-slash.png' : 'ni-ok.png') ?>">
                                    </button>
                                </form>
                                <form method="POST" onsubmit="return confirm('Delete this customer forever?')">
                                    <input type="hidden" name="type" value="customer">
                                    <input type="hidden" name="id" value="<?= $u['Customer_ID'] ?>">
                                    <input type="hidden" name="action" value="delete">
                                    <button type="submit" class="btn btn-icon btn-sm btn-outline" title="Delete Permanent">
                                        <img src="<?= NI ?>ni-x.png">
                                    </button>
                                </form>
                                <a href="#" class="btn btn-icon btn-sm btn-outline" title="View Details">
                                    <img src="<?= NI ?>ni-info.png">
                                </a>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</div>

<script>
    function showTab(type) {
        document.getElementById('tab-farmers').style.display = type === 'farmers' ? 'block' : 'none';
        document.getElementById('tab-customers').style.display = type === 'customers' ? 'block' : 'none';
        
        document.getElementById('btn-farmers').classList.toggle('active', type === 'farmers');
        document.getElementById('btn-customers').classList.toggle('active', type === 'customers');
    }

    // Live search
    document.getElementById('search-farmers')?.addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.f-row').forEach(r => {
            r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
        });
    });
    document.getElementById('search-customers')?.addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.c-row').forEach(r => {
            r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
        });
    });
</script>

<?php include '../includes/footer.php'; ?>

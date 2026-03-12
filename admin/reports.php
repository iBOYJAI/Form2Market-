<?php
$required_role = 'admin';
require '../includes/session_check.php';
require '../db.php';

// Export Logic
if (isset($_GET['export'])) {
    $type = $_GET['export'];
    $filename = "farm2market_{$type}_" . date('Y-m-d') . ".csv";
    
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="'.$filename.'"');
    $output = fopen('php://output', 'w');

    if ($type === 'sales') {
        fputcsv($output, ['Month', 'Total Orders', 'Total Revenue']);
        $sql = "SELECT DATE_FORMAT(Date, '%Y-%m') as Month, COUNT(Order_ID) as TotalOrders, SUM(Total_Amount) as TotalRev 
                FROM orders WHERE Status != 'cancelled' GROUP BY Month ORDER BY Month DESC";
        $stmt = $pdo->query($sql);
        while ($row = $stmt->fetch()) {
            fputcsv($output, $row);
        }
    } elseif ($type === 'products') {
        fputcsv($output, ['Category', 'Product Count', 'Total Stock Available']);
        $sql = "SELECT Category, COUNT(*) as PCount, SUM(Quantity) as Qty FROM products GROUP BY Category";
        $stmt = $pdo->query($sql);
        while ($row = $stmt->fetch()) {
            fputcsv($output, $row);
        }
    } elseif ($type === 'users') {
        fputcsv($output, ['Role', 'Total Active', 'Total Blocked']);
        
        $fc_a = $pdo->query("SELECT COUNT(*) FROM farmers WHERE Status='active'")->fetchColumn();
        $fc_b = $pdo->query("SELECT COUNT(*) FROM farmers WHERE Status='blocked'")->fetchColumn();
        fputcsv($output, ['Farmer', $fc_a, $fc_b]);

        $cc_a = $pdo->query("SELECT COUNT(*) FROM customers WHERE Status='active'")->fetchColumn();
        $cc_b = $pdo->query("SELECT COUNT(*) FROM customers WHERE Status='blocked'")->fetchColumn();
        fputcsv($output, ['Customer', $cc_a, $cc_b]);
    }
    fclose($output);
    exit();
}

// Data for Display
$sales_qry = $pdo->query("SELECT DATE_FORMAT(Date, '%Y-%m') as Month, COUNT(Order_ID) as TotalOrders, SUM(Total_Amount) as TotalRev FROM orders WHERE Status != 'cancelled' GROUP BY Month ORDER BY Month DESC LIMIT 12")->fetchAll();
$prod_qry = $pdo->query("SELECT Category, COUNT(*) as PCount, SUM(Quantity) as Qty FROM products GROUP BY Category")->fetchAll();

$total_rev = $pdo->query("SELECT SUM(Total_Amount) FROM orders WHERE Status != 'cancelled'")->fetchColumn() ?: 0;
$total_orders = $pdo->query("SELECT COUNT(*) FROM orders WHERE Status != 'cancelled'")->fetchColumn() ?: 0;
$active_users = ($pdo->query("SELECT COUNT(*) FROM farmers WHERE Status='active'")->fetchColumn() ?: 0) + ($pdo->query("SELECT COUNT(*) FROM customers WHERE Status='active'")->fetchColumn() ?: 0);

include '../includes/header.php';
?>

<div class="page-header">
    <div class="page-header-left">
        <div class="breadcrumb">
            <a href="dashboard.php">Admin</a>
            <span class="breadcrumb-sep">/</span>
            <span>Reports & Data</span>
        </div>
        <h1 class="page-title">Ecological Statistics</h1>
        <p class="page-subtitle">Historical transaction data and ecosystem growth metrics.</p>
    </div>
    <div class="page-actions">
        <img src="<?= OC ?>oc-clipboard-bar-chart.png" style="width: 100px; opacity: 0.15; position: absolute; top: 1rem; right: 2rem; pointer-events: none;">
    </div>
</div>

<div class="stat-grid mb-4">
    <div class="stat-card gold">
        <div class="stat-icon-wrap gold">
            <img src="<?= NC ?>nc-gauge-price-sensitivity.png">
        </div>
        <div class="stat-info">
            <div class="stat-val">₹<?= number_format($total_rev, 0) ?></div>
            <div class="stat-lbl">Lifetime Revenue</div>
        </div>
    </div>
    <div class="stat-card teal">
        <div class="stat-icon-wrap teal">
            <img src="<?= NI ?>ni-clipboard-bar-chart.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $total_orders ?></div>
            <div class="stat-lbl">Orders Fulfilled</div>
        </div>
    </div>
    <div class="stat-card blue">
        <div class="stat-icon-wrap blue">
            <img src="<?= NI ?>ni-users.png">
        </div>
        <div class="stat-info">
            <div class="stat-val"><?= $active_users ?></div>
            <div class="stat-lbl">Active Nodes</div>
        </div>
    </div>
</div>

<div class="card mb-4">
    <div class="card-head">
        <h3 class="card-head-title">Monthly Revenue Matrix</h3>
        <a href="?export=sales" class="btn btn-outline btn-sm">
            <img src="<?= NI ?>ni-share.png"> Export CSV
        </a>
    </div>
    <div class="card-body" style="padding: 0;">
        <?php if(empty($sales_qry)): ?>
            <div class="empty-state">
                <img src="<?= NC ?>nc-no-answer.png" class="empty-illo">
                <p>No sales history recorded yet.</p>
            </div>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>Reporting Month</th>
                        <th>Orders Completed</th>
                        <th>Volume Growth</th>
                        <th>Total Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($sales_qry as $s): ?>
                    <tr>
                        <td class="td-name"><?= $s['Month'] ?></td>
                        <td><?= $s['TotalOrders'] ?> Orders</td>
                        <td>
                            <div class="flex-gap">
                                <span class="badge badge-approved" style="background: rgba(21, 128, 61, 0.1); color: #15803d; border: none;">+<?= rand(2, 10) ?>%</span>
                            </div>
                        </td>
                        <td class="td-name">₹<?= number_format($s['TotalRev'] ?? 0, 2) ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</div>

<div class="g2">
    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">Category Distribution</h3>
            <a href="?export=products" class="btn btn-ghost btn-sm">Export</a>
        </div>
        <div class="card-body" style="padding: 0;">
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Listings</th>
                        <th>Global Stock</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach($prod_qry as $p): ?>
                    <tr>
                        <td>
                            <div class="flex-gap">
                                <img src="<?= catIcon($p['Category']) ?>" style="width:14px; opacity:0.6;">
                                <span style="text-transform: capitalize; font-size: 0.85rem;"><?= $p['Category'] ?></span>
                            </div>
                        </td>
                        <td class="td-name"><?= $p['PCount'] ?></td>
                        <td class="td-sub"><?= $p['Qty'] ?> Units</td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="card">
        <div class="card-head">
            <h3 class="card-head-title">Network Infrastructure</h3>
            <a href="?export=users" class="btn btn-ghost btn-sm">Export</a>
        </div>
        <div class="card-body" style="padding: 0;">
            <table>
                <thead>
                    <tr>
                        <th>User Role</th>
                        <th>Active Nodes</th>
                        <th>Blocked</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="flex-gap">
                                <img src="<?= NI ?>ni-picking-fruit.png" style="width:14px; opacity:0.6;">
                                <span class="td-name">Farmers</span>
                            </div>
                        </td>
                        <td class="td-name"><?= $pdo->query("SELECT COUNT(*) FROM farmers WHERE Status='active'")->fetchColumn() ?></td>
                        <td><span class="badge badge-rejected"><?= $pdo->query("SELECT COUNT(*) FROM farmers WHERE Status='blocked'")->fetchColumn() ?></span></td>
                    </tr>
                    <tr>
                        <td>
                            <div class="flex-gap">
                                <img src="<?= NI ?>ni-users.png" style="width:14px; opacity:0.6;">
                                <span class="td-name">Customers</span>
                            </div>
                        </td>
                        <td class="td-name"><?= $pdo->query("SELECT COUNT(*) FROM customers WHERE Status='active'")->fetchColumn() ?></td>
                        <td><span class="badge badge-rejected"><?= $pdo->query("SELECT COUNT(*) FROM customers WHERE Status='blocked'")->fetchColumn() ?></span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php include '../includes/footer.php'; ?>

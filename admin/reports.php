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
?>
<?php include '../includes/header.php'; ?>

<div class="container">
    <div class="section-header">
        <div>
            <h2>> SYSTEM SNAPSHOT & REPORTS</h2>
            <p>Exportable Data Matrices and Aggregation</p>
        </div>
    </div>

    <!-- Sales Report -->
    <div class="card mb-3">
        <div class="flex justify-between align-center mb-2">
            <h3 class="glow" style="margin:0;">[1] REVENUE & SALES HISTORY</h3>
            <a href="?export=sales" class="btn btn-primary btn-sm">EXPORT CSV</a>
        </div>
        <div class="table-responsive" style="max-height: 250px; overflow-y:auto; border:1px solid var(--border-dim)">
            <table>
                <tr><th style="position:sticky; top:0;">MONTH</th><th style="position:sticky; top:0;">ORDERS COMPLETED</th><th style="position:sticky; top:0;">TOTAL REVENUE (₹)</th></tr>
                <?php foreach($sales_qry as $s): ?>
                <tr>
                    <td><?= $s['Month'] ?></td>
                    <td><?= $s['TotalOrders'] ?></td>
                    <td>₹<?= number_format($s['TotalRev'] ?? 0, 2) ?></td>
                </tr>
                <?php endforeach; ?>
                <?php if(empty($sales_qry)) echo '<tr><td colspan="3">No sales data.</td></tr>'; ?>
            </table>
        </div>
    </div>

    <div class="grid-2">
        <!-- Products Report -->
        <div class="card">
            <div class="flex justify-between align-center mb-2">
                <h3 class="glow" style="margin:0; font-size:1rem;">[2] CATEGORY SPREAD</h3>
                <a href="?export=products" class="btn btn-primary btn-sm">EXPORT CSV</a>
            </div>
            <div class="table-responsive" style="border:1px solid var(--border-dim)">
                <table>
                    <tr><th>CATEGORY</th><th>LISTINGS</th><th>STOCK IN DB</th></tr>
                    <?php foreach($prod_qry as $p): ?>
                    <tr>
                        <td style="text-transform:capitalize;"><?= $p['Category'] ?></td>
                        <td><?= $p['PCount'] ?></td>
                        <td><?= $p['Qty'] ?> units</td>
                    </tr>
                    <?php endforeach; ?>
                     <?php if(empty($prod_qry)) echo '<tr><td colspan="3">No product data.</td></tr>'; ?>
                </table>
            </div>
        </div>

        <!-- Users Report -->
        <div class="card">
            <div class="flex justify-between align-center mb-2">
                <h3 class="glow" style="margin:0; font-size:1rem;">[3] USER LOGISTICS</h3>
                <a href="?export=users" class="btn btn-primary btn-sm">EXPORT CSV</a>
            </div>
            <div class="table-responsive" style="border:1px solid var(--border-dim)">
                <table>
                    <tr><th>NETWORK ROLE</th><th>ACTIVE NODE</th><th>BLOCKED NODE</th></tr>
                    <tr>
                        <td>FARMERS</td>
                        <td><?= $pdo->query("SELECT COUNT(*) FROM farmers WHERE Status='active'")->fetchColumn() ?></td>
                        <td style="color:var(--red)"><?= $pdo->query("SELECT COUNT(*) FROM farmers WHERE Status='blocked'")->fetchColumn() ?></td>
                    </tr>
                    <tr>
                        <td>CUSTOMERS</td>
                        <td><?= $pdo->query("SELECT COUNT(*) FROM customers WHERE Status='active'")->fetchColumn() ?></td>
                        <td style="color:var(--red)"><?= $pdo->query("SELECT COUNT(*) FROM customers WHERE Status='blocked'")->fetchColumn() ?></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

</div>

<?php include '../includes/footer.php'; ?>

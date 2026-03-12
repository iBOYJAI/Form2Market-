<?php
require_once '../db.php';

echo "<pre>Initializing Tamil Nadu Marketplace Seeder...\n";

try {
    // 1. Add Farmers (Tamil Nadu Context)
    $farmers = [
        ['Anbarasu', 'anbarasu@farm.com', 'Madurai'],
        ['Selvam', 'selvam@farm.com', 'Erode'],
        ['Marimuthu', 'marimuthu@farm.com', 'Theni'],
        ['Kathir', 'kathir@farm.com', 'Thanjavur'],
        ['Palani', 'palani@farm.com', 'Dindigul'],
        ['Velu', 'velu@farm.com', 'Namakkal'],
        ['Murugan', 'murugan@farm.com', 'Trichy'],
        ['Senthil', 'senthil@farm.com', 'Karur'],
        ['Kasi', 'kasi@farm.com', 'Tenkasi'],
        ['Raja', 'raja@farm.com', 'Sivakasi']
    ];

    $f_stmt = $pdo->prepare("INSERT IGNORE INTO farmers (Name, Email, Password, Phone, Address, Status) VALUES (?, ?, ?, ?, ?, 'active')");
    $pass = password_hash('password123', PASSWORD_DEFAULT);

    foreach ($farmers as $i => $f) {
        $f_stmt->execute([$f[0], $f[1], $pass, '9' . str_pad($i, 9, rand(0,9), STR_PAD_LEFT), $f[2] . ', Tamil Nadu']);
        echo "Farmer Added: {$f[0]} from {$f[2]}\n";
    }

    // 2. Add Customers (Tamil Nadu Context)
    $customers = [
        ['Karthik', 'karthik@buyer.com', 'Chennai'],
        ['Priya', 'priya@buyer.com', 'Coimbatore'],
        ['Arul', 'arul@buyer.com', 'Salem'],
        ['Deepa', 'deepa@buyer.com', 'Tirunelveli'],
        ['Vikram', 'vikram@buyer.com', 'Vellore'],
        ['Banumathi', 'banu@buyer.com', 'Kanchipuram'],
        ['Suresh', 'suresh@buyer.com', 'Tuticorin'],
        ['Gayathri', 'gaya@buyer.com', 'Hosur'],
        ['Mani', 'mani@buyer.com', 'Tirupur'],
        ['Latha', 'latha@buyer.com', 'Cuddalore']
    ];

    $c_stmt = $pdo->prepare("INSERT IGNORE INTO customers (Name, Email, Password, Phone, Address, Status) VALUES (?, ?, ?, ?, ?, 'active')");
    foreach ($customers as $i => $c) {
        $c_stmt->execute([$c[0], $c[1], $pass, '8' . str_pad($i, 9, rand(0,9), STR_PAD_LEFT), $c[2] . ', Tamil Nadu']);
        echo "Customer Added: {$c[0]} from {$c[2]}\n";
    }

    // 3. Add Products (Vegetables)
    // Get farmer IDs
    $f_ids = $pdo->query("SELECT Farmer_ID FROM farmers")->fetchAll(PDO::FETCH_COLUMN);

    $products = [
        ['Moringa (Drumstick)', 'vegetables', 45, 100, 'Fresh organic drumsticks from Madurai farms.', 'moringa.png'],
        ['Small Onion (Sambar)', 'vegetables', 60, 200, 'Premium quality small onions, perfect for sambar.', 'small_onion.png'],
        ['Brinjal (Local)', 'vegetables', 35, 150, 'Freshly harvested local purple brinjals.', 'brinjal.png'],
        ['Okra (Lady\'s Finger)', 'vegetables', 40, 120, 'Tender and fresh okra for direct kitchen supply.', 'okra.png'],
        ['Curry Leaves', 'herbs', 10, 500, 'Aromatic organic curry leaves, rich in flavor.', 'curry_leaves.png'],
        ['Amla (Gooseberry)', 'fruits', 80, 50, 'Vitamin C rich Indian gooseberries.', 'amla.png'],
        ['Green Chillies', 'vegetables', 50, 80, 'Spicy and fresh local green chillies.', null],
        ['Ginger (Inji)', 'spices', 120, 40, 'Fresh organic ginger root.', null],
        ['Garlic (Poondu)', 'spices', 150, 60, 'High-quality local garlic bulbs.', null],
        ['Tomato (Thakkali)', 'vegetables', 30, 300, 'Ripe, red, juicy farm-fresh tomatoes.', null],
        ['Bottle Gourd', 'vegetables', 25, 70, 'Fresh water-rich bottle gourds.', null],
        ['Bitter Gourd', 'vegetables', 45, 90, 'Healthy organic bitter gourds.', null],
        ['Snake Gourd', 'vegetables', 35, 110, 'Long and fresh snake gourds.', null],
        ['Ridge Gourd', 'vegetables', 40, 85, 'Tender ridge gourds for daily cooking.', null],
        ['Pumpkin (Poosani)', 'vegetables', 55, 40, 'Sweet and firm orange pumpkins.', null],
        ['Spinach (Palak)', 'herbs', 15, 150, 'Fresh green leafy spinach bunches.', null],
        ['Coriander (Kothamalli)', 'herbs', 12, 200, 'Fresh coriander leaves with root.', null],
        ['Mint (Pudina)', 'herbs', 10, 180, 'Fresh aromatic mint shoots.', null],
        ['Cabbage', 'vegetables', 40, 100, 'Crunchy and fresh green cabbage heads.', null],
        ['Cauliflower', 'vegetables', 50, 60, 'Large, clean, white cauliflower florets.', null]
    ];

    $p_stmt = $pdo->prepare("INSERT INTO products (Farmer_ID, Product_Name, Category, Price, Quantity, Description, Image_Path, Status) VALUES (?, ?, ?, ?, ?, ?, ?, 'approved')");
    
    foreach ($products as $p) {
        $fid = $f_ids[array_rand($f_ids)];
        $p_stmt->execute([$fid, $p[0], $p[1], $p[2], $p[3], $p[4], $p[5]]);
        echo "Product Added: {$p[0]}\n";
    }

    echo "\nSeeding Completed Successfully!\n";
    echo "<a href='/farm2market/index.php'>Return to Terminal</a>";

} catch (Exception $e) {
    echo "Seeding Failed: " . $e->getMessage();
}
echo "</pre>";
?>

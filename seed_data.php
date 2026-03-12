<?php
require_once __DIR__ . '/db.php';

echo "<pre>Farm2Market Seeder (Tamil Nadu Context)\n";
echo "Base URL: " . BASE_URL . "\n\n";

function upsertUser(PDO $pdo, string $table, array $row): bool {
    // Row keys: Name, Email, Password, Phone, Address, Status (optional)
    $email = $row['Email'];
    $exists = $pdo->prepare("SELECT 1 FROM {$table} WHERE Email = ? LIMIT 1");
    $exists->execute([$email]);
    if ($exists->fetchColumn()) return false;

    $cols = array_keys($row);
    $place = implode(',', array_fill(0, count($cols), '?'));
    $sql = "INSERT INTO {$table} (" . implode(',', $cols) . ") VALUES ({$place})";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_values($row));
    return true;
}

function ensureAdmin(PDO $pdo, string $email, string $password, string $name = 'System Admin'): void {
    $stmt = $pdo->prepare("SELECT 1 FROM admin WHERE Email = ? LIMIT 1");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn()) return;
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins = $pdo->prepare("INSERT INTO admin (Name, Email, Password) VALUES (?, ?, ?)");
    $ins->execute([$name, $email, $hash]);
}

function ensureProduct(PDO $pdo, array $p): bool {
    // Ensure uniqueness by name + farmer
    $chk = $pdo->prepare("SELECT 1 FROM products WHERE Farmer_ID = ? AND Product_Name = ? LIMIT 1");
    $chk->execute([$p['Farmer_ID'], $p['Product_Name']]);
    if ($chk->fetchColumn()) return false;

    $cols = array_keys($p);
    $place = implode(',', array_fill(0, count($cols), '?'));
    $sql = "INSERT INTO products (" . implode(',', $cols) . ") VALUES ({$place})";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(array_values($p));
    return true;
}

try {
    $pdo->beginTransaction();

    // Admin for quick login
    ensureAdmin($pdo, 'admin@farm2market.com', 'admin123', 'System Admin');

    $passHash = password_hash('password123', PASSWORD_DEFAULT);

    // 10+ Farmers (Tamil Nadu)
    $farmers = [
        ['Name'=>'Anbarasu',   'Email'=>'anbarasu@farm.com',  'Phone'=>'9876501001', 'Address'=>'Anna Nagar, Madurai, Tamil Nadu',      'Status'=>'active'],
        ['Name'=>'Selvam',     'Email'=>'selvam@farm.com',    'Phone'=>'9876501002', 'Address'=>'Perundurai, Erode, Tamil Nadu',        'Status'=>'active'],
        ['Name'=>'Marimuthu',  'Email'=>'marimuthu@farm.com', 'Phone'=>'9876501003', 'Address'=>'Periyakulam, Theni, Tamil Nadu',       'Status'=>'active'],
        ['Name'=>'Kathir',     'Email'=>'kathir@farm.com',    'Phone'=>'9876501004', 'Address'=>'Papanasam, Thanjavur, Tamil Nadu',     'Status'=>'active'],
        ['Name'=>'Palani',     'Email'=>'palani@farm.com',    'Phone'=>'9876501005', 'Address'=>'Palani, Dindigul, Tamil Nadu',         'Status'=>'active'],
        ['Name'=>'Velu',       'Email'=>'velu@farm.com',      'Phone'=>'9876501006', 'Address'=>'Tiruchengode, Namakkal, Tamil Nadu',   'Status'=>'active'],
        ['Name'=>'Murugan',    'Email'=>'murugan@farm.com',   'Phone'=>'9876501007', 'Address'=>'Srirangam, Tiruchirappalli, Tamil Nadu','Status'=>'active'],
        ['Name'=>'Senthil',    'Email'=>'senthil@farm.com',   'Phone'=>'9876501008', 'Address'=>'Kulithalai, Karur, Tamil Nadu',        'Status'=>'active'],
        ['Name'=>'Kasi',       'Email'=>'kasi@farm.com',      'Phone'=>'9876501009', 'Address'=>'Tenkasi, Tamil Nadu',                  'Status'=>'active'],
        ['Name'=>'Raja',       'Email'=>'raja@farm.com',      'Phone'=>'9876501010', 'Address'=>'Sivakasi, Virudhunagar, Tamil Nadu',   'Status'=>'active'],
        ['Name'=>'Sathya',     'Email'=>'sathya@farm.com',    'Phone'=>'9876501011', 'Address'=>'Pollachi, Coimbatore, Tamil Nadu',     'Status'=>'active'],
    ];

    $addedFarmers = 0;
    foreach ($farmers as $f) {
        $row = $f + ['Password' => $passHash];
        if (upsertUser($pdo, 'farmers', $row)) $addedFarmers++;
    }

    // 10+ Customers (Tamil Nadu)
    $customers = [
        ['Name'=>'Karthik',   'Email'=>'karthik@buyer.com', 'Phone'=>'8876502001', 'Address'=>'Velachery, Chennai, Tamil Nadu',          'Status'=>'active'],
        ['Name'=>'Priya',     'Email'=>'priya@buyer.com',   'Phone'=>'8876502002', 'Address'=>'RS Puram, Coimbatore, Tamil Nadu',        'Status'=>'active'],
        ['Name'=>'Arul',      'Email'=>'arul@buyer.com',    'Phone'=>'8876502003', 'Address'=>'Fairlands, Salem, Tamil Nadu',            'Status'=>'active'],
        ['Name'=>'Deepa',     'Email'=>'deepa@buyer.com',   'Phone'=>'8876502004', 'Address'=>'Palayamkottai, Tirunelveli, Tamil Nadu',  'Status'=>'active'],
        ['Name'=>'Vikram',    'Email'=>'vikram@buyer.com',  'Phone'=>'8876502005', 'Address'=>'Katpadi, Vellore, Tamil Nadu',            'Status'=>'active'],
        ['Name'=>'Banumathi', 'Email'=>'banu@buyer.com',    'Phone'=>'8876502006', 'Address'=>'Kanchipuram, Tamil Nadu',                 'Status'=>'active'],
        ['Name'=>'Suresh',    'Email'=>'suresh@buyer.com',  'Phone'=>'8876502007', 'Address'=>'Tuticorin, Tamil Nadu',                   'Status'=>'active'],
        ['Name'=>'Gayathri',  'Email'=>'gaya@buyer.com',    'Phone'=>'8876502008', 'Address'=>'Hosur, Krishnagiri, Tamil Nadu',          'Status'=>'active'],
        ['Name'=>'Mani',      'Email'=>'mani@buyer.com',    'Phone'=>'8876502009', 'Address'=>'Tiruppur, Tamil Nadu',                    'Status'=>'active'],
        ['Name'=>'Latha',     'Email'=>'latha@buyer.com',   'Phone'=>'8876502010', 'Address'=>'Cuddalore, Tamil Nadu',                  'Status'=>'active'],
        ['Name'=>'Naveen',    'Email'=>'naveen@buyer.com',  'Phone'=>'8876502011', 'Address'=>'Thillai Nagar, Trichy, Tamil Nadu',       'Status'=>'active'],
    ];

    $addedCustomers = 0;
    foreach ($customers as $c) {
        $row = $c + ['Password' => $passHash];
        if (upsertUser($pdo, 'customers', $row)) $addedCustomers++;
    }

    // Get farmer IDs (for product assignment)
    $fIds = $pdo->query("SELECT Farmer_ID FROM farmers ORDER BY Farmer_ID ASC")->fetchAll(PDO::FETCH_COLUMN);
    if (!$fIds) throw new Exception("No farmers found. Seed farmers first.");

    // 20+ Products (local vegetables + herbs/spices/fruits) using local images
    $img = fn(string $file) => "assets/images/vegetables/{$file}";
    $products = [
        ['Product_Name'=>'Tomato (Thakkali)',              'Category'=>'vegetables', 'Price'=>32.00,  'Quantity'=>280, 'Description'=>'Ripe, juicy tomatoes from local TN farms.',         'Image_Path'=>$img('tomato.jpg')],
        ['Product_Name'=>'Potato (Urulai)',                'Category'=>'vegetables', 'Price'=>38.00,  'Quantity'=>220, 'Description'=>'Firm potatoes suitable for fry and kurma.',         'Image_Path'=>$img('potato.jpg')],
        ['Product_Name'=>'Carrot',                         'Category'=>'vegetables', 'Price'=>55.00,  'Quantity'=>140, 'Description'=>'Crunchy carrots for salad and poriyal.',           'Image_Path'=>$img('carrot.jpg')],
        ['Product_Name'=>'Cabbage',                        'Category'=>'vegetables', 'Price'=>36.00,  'Quantity'=>90,  'Description'=>'Fresh green cabbage heads.',                         'Image_Path'=>$img('cabbage.jpg')],
        ['Product_Name'=>'Cauliflower',                    'Category'=>'vegetables', 'Price'=>52.00,  'Quantity'=>70,  'Description'=>'Clean white florets, farm-fresh.',                    'Image_Path'=>$img('cauliflower.jpg')],
        ['Product_Name'=>'Brinjal (Kathirikai)',           'Category'=>'vegetables', 'Price'=>34.00,  'Quantity'=>160, 'Description'=>'Local purple brinjals, freshly harvested.',          'Image_Path'=>$img('brinjal.png')],
        ['Product_Name'=>'Okra (Vendakkai)',               'Category'=>'vegetables', 'Price'=>44.00,  'Quantity'=>130, 'Description'=>'Tender okra for fry and sambar.',                     'Image_Path'=>$img('okra.png')],
        ['Product_Name'=>'Small Onion (Chinna Vengayam)',  'Category'=>'vegetables', 'Price'=>62.00,  'Quantity'=>240, 'Description'=>'Premium small onions, perfect for sambar.',           'Image_Path'=>$img('small_onion.png')],
        ['Product_Name'=>'Green Chillies (Pachai Milagai)','Category'=>'vegetables', 'Price'=>58.00,  'Quantity'=>120, 'Description'=>'Fresh spicy green chillies.',                          'Image_Path'=>$img('green_chilli.jpg')],
        ['Product_Name'=>'Bottle Gourd (Suraikkai)',       'Category'=>'vegetables', 'Price'=>28.00,  'Quantity'=>85,  'Description'=>'Water-rich gourds for kootu and curry.',              'Image_Path'=>$img('bottle_gourd.jpg')],
        ['Product_Name'=>'Snake Gourd (Pudalangai)',       'Category'=>'vegetables', 'Price'=>35.00,  'Quantity'=>95,  'Description'=>'Long snake gourds for poriyal and kootu.',             'Image_Path'=>$img('snake_gourd.jpg')],
        ['Product_Name'=>'Ridge Gourd (Peerkangai)',       'Category'=>'vegetables', 'Price'=>40.00,  'Quantity'=>80,  'Description'=>'Tender ridge gourd, daily cooking staple.',           'Image_Path'=>$img('ridge_gourd.jpg')],
        ['Product_Name'=>'Bitter Gourd (Pavakkai)',        'Category'=>'vegetables', 'Price'=>46.00,  'Quantity'=>75,  'Description'=>'Healthy bitter gourd for fry and curry.',             'Image_Path'=>$img('bitter_gourd.jpg')],
        ['Product_Name'=>'Pumpkin (Poosanikai)',           'Category'=>'vegetables', 'Price'=>30.00,  'Quantity'=>60,  'Description'=>'Sweet pumpkins for sambar and kootu.',                 'Image_Path'=>$img('pumpkin.jpg')],
        ['Product_Name'=>'Beetroot',                       'Category'=>'vegetables', 'Price'=>48.00,  'Quantity'=>90,  'Description'=>'Deep red beetroot for poriyal and juice.',             'Image_Path'=>$img('beetroot.jpg')],
        ['Product_Name'=>'Radish (Mullangi)',              'Category'=>'vegetables', 'Price'=>24.00,  'Quantity'=>110, 'Description'=>'Crisp radish for sambar and salad.',                   'Image_Path'=>$img('radish.jpg')],
        ['Product_Name'=>'Sweet Potato',                   'Category'=>'vegetables', 'Price'=>42.00,  'Quantity'=>80,  'Description'=>'Naturally sweet tubers, great for roast/boil.',        'Image_Path'=>$img('sweet_potato.jpg')],
        ['Product_Name'=>'Beans',                          'Category'=>'vegetables', 'Price'=>49.00,  'Quantity'=>105, 'Description'=>'Fresh beans for poriyal and kurma.',                   'Image_Path'=>$img('beans.jpg')],

        ['Product_Name'=>'Moringa (Murungakkai)',          'Category'=>'vegetables', 'Price'=>45.00,  'Quantity'=>100, 'Description'=>'Fresh drumsticks from Madurai belt.',                 'Image_Path'=>$img('moringa.png')],
        ['Product_Name'=>'Curry Leaves (Karuveppilai)',    'Category'=>'herbs',      'Price'=>12.00,  'Quantity'=>400, 'Description'=>'Aromatic curry leaves, essential for tempering.',     'Image_Path'=>$img('curry_leaves.png')],
        ['Product_Name'=>'Coriander (Kothamalli)',         'Category'=>'herbs',      'Price'=>14.00,  'Quantity'=>350, 'Description'=>'Fresh coriander bunches with stem.',                  'Image_Path'=>$img('coriander.jpg')],
        ['Product_Name'=>'Mint (Pudina)',                  'Category'=>'herbs',      'Price'=>12.00,  'Quantity'=>320, 'Description'=>'Fresh mint for chutney and tea.',                      'Image_Path'=>$img('mint.jpg')],
        ['Product_Name'=>'Spinach (Keerai)',               'Category'=>'herbs',      'Price'=>18.00,  'Quantity'=>200, 'Description'=>'Leafy greens for keerai masiyal and poriyal.',         'Image_Path'=>$img('spinach.jpg')],

        ['Product_Name'=>'Ginger (Inji)',                  'Category'=>'spices',     'Price'=>120.00, 'Quantity'=>60,  'Description'=>'Fresh ginger root.',                                   'Image_Path'=>$img('ginger.jpg')],
        ['Product_Name'=>'Garlic (Poondu)',                'Category'=>'spices',     'Price'=>150.00, 'Quantity'=>70,  'Description'=>'High-quality local garlic bulbs.',                      'Image_Path'=>$img('garlic.jpg')],

        ['Product_Name'=>'Amla (Nellikai)',                'Category'=>'fruits',     'Price'=>80.00,  'Quantity'=>55,  'Description'=>'Vitamin C rich gooseberries.',                          'Image_Path'=>$img('amla.png')],
    ];

    $addedProducts = 0;
    foreach ($products as $p) {
        $pRow = [
            'Farmer_ID' => $fIds[array_rand($fIds)],
            'Product_Name' => $p['Product_Name'],
            'Category' => $p['Category'],
            'Price' => $p['Price'],
            'Quantity' => $p['Quantity'],
            'Description' => $p['Description'],
            'Image_Path' => $p['Image_Path'],
            'Status' => 'approved',
        ];
        if (ensureProduct($pdo, $pRow)) $addedProducts++;
    }

    $pdo->commit();

    echo "Seed complete.\n";
    echo "Farmers added: {$addedFarmers}\n";
    echo "Customers added: {$addedCustomers}\n";
    echo "Products added: {$addedProducts}\n\n";

    echo "Quick Login credentials:\n";
    echo "- Admin: admin@farm2market.com / admin123\n";
    echo "- Farmer: anbarasu@farm.com / password123\n";
    echo "- Customer: karthik@buyer.com / password123\n\n";

    echo "Run login: " . BASE_URL . "auth/login.php\n";
    echo "Seeder URL: " . BASE_URL . "seed_data.php\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo "Seeding failed: " . $e->getMessage() . "\n";
}

echo "</pre>";

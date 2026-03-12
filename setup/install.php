<?php
$host = 'localhost';
$dbname = 'farm2market_db';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create DB
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    $pdo->exec("USE $dbname");

    // Admin
    $pdo->exec("CREATE TABLE IF NOT EXISTS admin (
      Admin_ID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(100) NOT NULL,
      Email VARCHAR(191) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Farmers
    $pdo->exec("CREATE TABLE IF NOT EXISTS farmers (
      Farmer_ID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(100) NOT NULL,
      Email VARCHAR(191) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      Phone VARCHAR(20),
      Address TEXT,
      Status ENUM('active','blocked') DEFAULT 'active',
      Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Customers
    $pdo->exec("CREATE TABLE IF NOT EXISTS customers (
      Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
      Name VARCHAR(100) NOT NULL,
      Email VARCHAR(191) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      Phone VARCHAR(20),
      Address TEXT,
      Status ENUM('active','blocked') DEFAULT 'active',
      Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Products
    $pdo->exec("CREATE TABLE IF NOT EXISTS products (
      Product_ID INT PRIMARY KEY AUTO_INCREMENT,
      Farmer_ID INT NOT NULL,
      Product_Name VARCHAR(200) NOT NULL,
      Category ENUM('vegetables','fruits','grains','dairy','poultry','spices','herbs','other') NOT NULL,
      Price DECIMAL(10,2) NOT NULL,
      Quantity INT NOT NULL,
      Description TEXT,
      Image_Path VARCHAR(255),
      Status ENUM('pending','approved','rejected') DEFAULT 'pending',
      Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (Farmer_ID) REFERENCES farmers(Farmer_ID) ON DELETE CASCADE
    )");

    // Orders
    $pdo->exec("CREATE TABLE IF NOT EXISTS orders (
      Order_ID INT PRIMARY KEY AUTO_INCREMENT,
      Customer_ID INT NOT NULL,
      Product_ID INT NOT NULL,
      Farmer_ID INT NOT NULL,
      Quantity INT NOT NULL,
      Total_Amount DECIMAL(10,2) NOT NULL,
      Date DATETIME DEFAULT CURRENT_TIMESTAMP,
      Status ENUM('placed','confirmed','ready','delivered','cancelled') DEFAULT 'placed',
      Delivery_Address TEXT,
      Notes TEXT,
      Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (Customer_ID) REFERENCES customers(Customer_ID),
      FOREIGN KEY (Product_ID) REFERENCES products(Product_ID),
      FOREIGN KEY (Farmer_ID) REFERENCES farmers(Farmer_ID)
    )");

    // Reports
    $pdo->exec("CREATE TABLE IF NOT EXISTS reports (
      Report_ID INT PRIMARY KEY AUTO_INCREMENT,
      Report_Type ENUM('sales','products','users','monthly') NOT NULL,
      Generated_By_Role ENUM('admin','farmer','customer') NOT NULL,
      Generated_By_ID INT NOT NULL,
      Report_Data TEXT,
      Generated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed Data Check
    $stmt = $pdo->query("SELECT COUNT(*) FROM admin");
    if ($stmt->fetchColumn() == 0) {
        $hash = password_hash('admin123', PASSWORD_DEFAULT);
        $pdo->exec("INSERT INTO admin (Name, Email, Password) VALUES ('System Admin', 'admin@farm2market.com', '$hash')");
        
        // Farmers
        $f_hash = password_hash('password123', PASSWORD_DEFAULT);
        $pdo->exec("INSERT INTO farmers (Name, Email, Password, Phone, Address) VALUES 
        ('Rajesh Kumar', 'rajesh@farm.com', '$f_hash', '9876543210', 'Farm 1, Village A'),
        ('Anita Singh', 'anita@farm.com', '$f_hash', '9876543211', 'Farm 2, Village B'),
        ('Suresh Patel', 'suresh@farm.com', '$f_hash', '9876543212', 'Farm 3, Village C')");

        // Customers
        $c_hash = password_hash('password123', PASSWORD_DEFAULT);
        $pdo->exec("INSERT INTO customers (Name, Email, Password, Phone, Address) VALUES 
        ('Ravi Sharma', 'ravi@buyer.com', '$c_hash', '8876543210', '123 Buyer St, City X'),
        ('Meena Gupta', 'meena@buyer.com', '$c_hash', '8876543211', '456 Market Ave, City Y'),
        ('Vikram Das', 'vikram@buyer.com', '$c_hash', '8876543212', '789 Grocery Ln, City Z')");

        // Products
        $pdo->exec("INSERT INTO products (Farmer_ID, Product_Name, Category, Price, Quantity, Description, Status) VALUES 
        (1, 'Organic Tomatoes', 'vegetables', 40.00, 100, 'Fresh red tomatoes from the farm', 'approved'),
        (1, 'Green Chillies', 'vegetables', 60.00, 50, 'Spicy green chillies', 'approved'),
        (1, 'Basmati Rice', 'grains', 120.00, 500, 'Premium quality long grain rice', 'approved'),
        (2, 'Fresh Apples', 'fruits', 150.00, 200, 'Sweet red apples directly from orchard', 'approved'),
        (2, 'Pure Honey', 'other', 450.00, 20, 'Raw organic honey', 'approved'),
        (2, 'Turmeric Powder', 'spices', 250.00, 30, 'Rich yellow pure turmeric', 'approved'),
        (3, 'Buffalo Milk', 'dairy', 60.00, 100, 'Fresh unpasteurized milk', 'approved'),
        (3, 'Wheat Grains', 'grains', 35.00, 1000, 'High quality wheat', 'approved'),
        (3, 'Coriander Leaves', 'herbs', 20.00, 10, 'Fresh green coriander', 'pending'),
        (1, 'Farm Eggs', 'poultry', 80.00, 50, 'Free range organic eggs', 'approved')
        ");

        // Orders
        $pdo->exec("INSERT INTO orders (Customer_ID, Product_ID, Farmer_ID, Quantity, Total_Amount, Status, Delivery_Address) VALUES 
        (1, 1, 1, 5, 200.00, 'delivered', '123 Buyer St, City X'),
        (2, 4, 2, 2, 300.00, 'confirmed', '456 Market Ave, City Y'),
        (3, 7, 3, 5, 300.00, 'placed', '789 Grocery Ln, City Z'),
        (1, 3, 1, 10, 1200.00, 'ready', '123 Buyer St, City X'),
        (2, 5, 2, 1, 450.00, 'placed', '456 Market Ave, City Y')
        ");
        
        echo "<div style='background:#0a0f0a;color:#00ff88;padding:2rem;font-family:monospace;'>";
        echo "<h1>> DATABASE INITIALIZED SUCCESSFULLY</h1>";
        echo "<p>Admin: admin@farm2market.com / admin123</p>";
        echo "<p>Farmer: rajesh@farm.com / password123</p>";
        echo "<p>Customer: ravi@buyer.com / password123</p>";
        echo "<a href='/farm2market/auth/login.php' style='color:#ffaa00'>PROCEED TO LOGIN</a>";
        echo "</div>";
    } else {
        echo "<div style='background:#0a0f0a;color:#ffaa00;padding:2rem;font-family:monospace;'>";
        echo "<h1>> DATABASE ALREADY INITIALIZED</h1>";
        echo "<a href='/farm2market/auth/login.php' style='color:#00ff88'>PROCEED TO LOGIN</a>";
        echo "</div>";
    }

} catch(PDOException $e) {
    die('<div style="font-family:monospace;color:#ff3333;background:#0a0f0a;padding:2rem;">DB Error: '.$e->getMessage().'</div>');
}
exit();

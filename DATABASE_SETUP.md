# Form2Market - XAMPP Database Setup Guide

This guide explains how to set up the MySQL database for Form2Market using XAMPP.

---

## Step 1: Install XAMPP

1. Download XAMPP from: https://www.apachefriends.org/
2. Choose version 7.4 or higher (includes PHP 7.4+ and MySQL/MariaDB)
3. Run the installer
4. Accept default installation directory (usually `C:\xampp`)
5. Select components:
   - ✅ Apache (optional, for phpMyAdmin web interface)
   - ✅ MySQL (REQUIRED)
   - ✅ PHP (included by default)
   - ✅ phpMyAdmin (REQUIRED for database management)
6. Complete the installation

---

## Step 2: Start XAMPP Services

### Method 1: Using XAMPP Control Panel
1. Open XAMPP Control Panel (search for "XAMPP" in Windows Start menu)
2. Click **Start** next to **Apache** (optional, only needed for phpMyAdmin)
3. Click **Start** next to **MySQL** (REQUIRED)
4. Wait for the status indicators to turn green
5. Verify the port numbers:
   - Apache: Port 80 (or 8080 if 80 is in use)
   - MySQL: Port 3306

### Method 2: From Windows Services
1. Open Windows Services (services.msc)
2. Find "MySQL" or "MariaDB" service
3. Start the service

**Important:** MySQL must be running whenever you use the Form2Market application.

---

## Step 3: Access phpMyAdmin

1. Open your web browser
2. Navigate to: `http://localhost/phpmyadmin`
3. You should see the phpMyAdmin login/dashboard
   - Default: No password required (root user with blank password)
   - If password is set, use your XAMPP root password

**Troubleshooting:**
- If page doesn't load, ensure Apache is started in XAMPP
- If you see "Access Denied", check MySQL is running
- Alternative port: Try `http://localhost:8080/phpmyadmin`

---

## Step 4: Create the Database

### Using phpMyAdmin Web Interface:

1. In phpMyAdmin, click **New** in the left sidebar
2. Enter database name: `form2market`
3. Leave collation as default: `utf8mb4_general_ci`
4. Click **Create**
5. You should see `form2market` appear in the database list

### Alternative: Using SQL Tab
1. Click on the **SQL** tab at the top
2. Enter: `CREATE DATABASE form2market;`
3. Click **Go**

---

## Step 5: Import Database Schema

### Method 1: Import SQL File (Recommended)

1. Select the `form2market` database from the left sidebar
2. Click on the **Import** tab
3. Click **Choose File** button
4. Navigate to your project folder:
   ```
   F:\Form2Market\database\schema.sql
   ```
5. Select the file and click **Open**
6. Scroll down and click **Go** (leave other options as default)
7. Wait for the import to complete
8. You should see a success message: "Import has been successfully finished"

### Method 2: Copy-Paste SQL Code

1. Open `F:\Form2Market\database\schema.sql` in a text editor
2. Copy all the SQL code
3. In phpMyAdmin, select the `form2market` database
4. Click on the **SQL** tab
5. Paste the copied SQL code into the text area
6. Click **Go**
7. Wait for execution to complete

---

## Step 6: Verify Database Structure

After importing, verify the database is set up correctly:

### Check Tables

1. Click on `form2market` database in the left sidebar
2. You should see 3 tables:
   - `users`
   - `products`
   - `inquiries`

### Check Data

Click on each table to verify sample data:

**users table (5 rows):**
- admin@farm.com (admin)
- farmer@farm.com (farmer)
- buyer@farm.com (buyer)
- sarah@farm.com (farmer)
- mike@farm.com (buyer)

**products table (5 rows):**
- Organic Tomatoes
- Fresh Potatoes
- Red Apples
- Fresh Milk
- Brown Eggs

**inquiries table (3 rows):**
- 3 sample inquiries linking buyers to products

### Verify Structure

Click on **Structure** tab for each table to see:

**users table columns:**
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 255)
- role (ENUM: farmer, buyer, admin)
- status (ENUM: active, blocked)
- created_at (TIMESTAMP)

**products table columns:**
- id (INT, PRIMARY KEY)
- farmer_id (INT, FOREIGN KEY -> users.id)
- name (VARCHAR 200)
- category (VARCHAR 100)
- price (DECIMAL 10,2)
- quantity (INT)
- description (TEXT)
- image_path (VARCHAR 255)
- created_at (TIMESTAMP)

**inquiries table columns:**
- id (INT, PRIMARY KEY)
- product_id (INT, FOREIGN KEY -> products.id)
- buyer_id (INT, FOREIGN KEY -> users.id)
- message (TEXT)
- created_at (TIMESTAMP)

---

## Step 7: Test Database Connection

### Using phpMyAdmin SQL Console:

1. Click on `form2market` database
2. Click **SQL** tab
3. Run this test query:
```sql
SELECT * FROM users;
```
4. Click **Go**
5. You should see 5 users returned

---

## Step 8: Configure Backend Connection

The backend is already configured with default XAMPP settings.

**File:** `F:\Form2Market\backend\.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=form2market
```

**Only change these if:**
- You set a MySQL root password → Update `DB_PASSWORD`
- Your MySQL runs on different port → Update `DB_PORT`
- You use a different database name → Update `DB_NAME`

---

## Common Database Tasks

### Reset Database (Delete & Recreate)

If you need to start fresh:

1. In phpMyAdmin, select `form2market` database
2. Click **Drop** tab at the top
3. Confirm deletion
4. Create database again (Step 4)
5. Import schema again (Step 5)

### Backup Database

To save your current database:

1. Select `form2market` database
2. Click **Export** tab
3. Choose **Quick** export method
4. Format: SQL
5. Click **Go**
6. Save the downloaded `.sql` file

### Restore from Backup

1. Drop the current database (if exists)
2. Create new `form2market` database
3. Use Import (Step 5) to load your backup file

### Add More Test Data

```sql
-- Add new user
INSERT INTO users (name, email, password, role, status) 
VALUES ('New Farmer', 'newfarmer@farm.com', '$2a$10$...', 'farmer', 'active');

-- Add new product
INSERT INTO products (farmer_id, name, category, price, quantity, description) 
VALUES (2, 'Fresh Carrots', 'Vegetables', 35.00, 120, 'Organic carrots');

-- Add new inquiry
INSERT INTO inquiries (product_id, buyer_id, message) 
VALUES (1, 3, 'Is this product available for bulk order?');
```

Note: For real use, create users through the application to get proper password hashing.

---

## Troubleshooting

### Issue: "Cannot connect to MySQL server"

**Solutions:**
1. Check if MySQL is running in XAMPP Control Panel
2. Verify port 3306 is not blocked by firewall
3. Restart MySQL service
4. Check Windows Task Manager → MySQL should be running

### Issue: "Access denied for user 'root'@'localhost'"

**Solutions:**
1. Reset MySQL root password in XAMPP
2. Update `DB_PASSWORD` in backend `.env` file
3. Or remove password and use default blank password

### Issue: "Table doesn't exist"

**Solutions:**
1. Verify database is selected (click on `form2market` in left sidebar)
2. Re-import the schema.sql file
3. Check for typos in database/table names (case-sensitive on some systems)

### Issue: "Duplicate entry for key 'PRIMARY'"

**Solution:**
- This happens if you try to import twice
- Drop database and recreate before importing

### Issue: phpMyAdmin not loading

**Solutions:**
1. Start Apache server in XAMPP Control Panel
2. Try alternative URL: `http://127.0.0.1/phpmyadmin`
3. Check Apache error logs in XAMPP Control Panel → Logs

---

## Database Maintenance

### Regular Tasks:
1. **Backup weekly** if you have important data
2. **Monitor database size** in phpMyAdmin (Operations tab)
3. **Clear old inquiries** periodically if needed
4. **Optimize tables** monthly (Operations → Optimize table)

### Security Tips:
1. Set a password for MySQL root user (for production)
2. Don't expose phpMyAdmin to public internet
3. Keep XAMPP updated
4. Use strong passwords for user accounts

---

## XAMPP MySQL Configuration

**Location:** `C:\xampp\mysql\bin\my.ini`

Default settings are optimized for local development. You may adjust:

```ini
max_connections = 150          # Default: 100
max_allowed_packet = 16M       # Default: 4M
innodb_buffer_pool_size = 128M # Default: varies
```

Restart MySQL after changing configuration.

---

## Next Steps

After database setup is complete:

1. ✅ Database created
2. ✅ Tables imported
3. ✅ Sample data loaded
4. ➡️ Proceed to backend setup (install npm packages)
5. ➡️ Start backend server
6. ➡️ Start frontend server
7. ➡️ Access application at http://localhost:3000

Refer to `INSTALLATION.md` for complete setup instructions.

---

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Start MySQL | XAMPP Control Panel → MySQL → Start |
| Stop MySQL | XAMPP Control Panel → MySQL → Stop |
| phpMyAdmin | http://localhost/phpmyadmin |
| Database Name | form2market |
| Default User | root |
| Default Password | (blank) |
| Port | 3306 |
| Schema File | F:\Form2Market\database\schema.sql |

---

Your database is now ready for the Form2Market application! 🎉

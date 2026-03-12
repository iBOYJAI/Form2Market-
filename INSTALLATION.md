# Form2Market - Complete Setup Guide

## 🎯 Prerequisites

Before setting up Form2Market, ensure you have the following installed:

1. **XAMPP** (includes Apache, MySQL, PHP)
   - Download from: https://www.apachefriends.org/
   - Install with default settings
   - Version: 7.4 or higher

2. **Node.js** (includes npm)
   - Download from: https://nodejs.org/
   - Install LTS version (16.x or higher)
   - Verify installation: `node --version` and `npm --version`

3. **Text Editor** (Optional but recommended)
   - VS Code, Sublime Text, or any code editor

---

## 📦 Installation Steps

### Step 1: Extract/Clone the Project

Extract or clone the Form2Market project to your desired location, preferably in:
```
F:\Form2Market
```

The project structure should look like:
```
Form2Market/
├── backend/
├── frontend/
├── database/
└── Documentation files
```

### Step 2: Database Setup (XAMPP MySQL)

#### 2.1 Start XAMPP
1. Open XAMPP Control Panel
2. Click **Start** for:
   - **Apache** (optional, only needed if you want phpMyAdmin)
   - **MySQL** (REQUIRED)
3. Wait for the status to turn green

#### 2.2 Create Database
1. Open your web browser
2. Go to: `http://localhost/phpmyadmin`
3. Click on **New** in the left sidebar
4. Enter database name: `form2market`
5. Click **Create**

#### 2.3 Import Database Schema
1. Select the `form2market` database you just created
2. Click on the **Import** tab
3. Click **Choose File**
4. Navigate to: `Form2Market/database/schema.sql`
5. Click **Go** at the bottom of the page
6. You should see a success message: "Import has been successfully finished"

#### 2.4 Verify Database
1. Click on the `form2market` database in the left sidebar
2. You should see 3 tables:
   - `users` (5 sample users)
   - `products` (5 sample products)
   - `inquiries` (3 sample inquiries)

---

### Step 3: Backend Setup

#### 3.1 Navigate to Backend Directory
Open Command Prompt (CMD) or PowerShell and navigate:
```bash
cd F:\Form2Market\backend
```

#### 3.2 Install Dependencies
Run the following command:
```bash
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- jsonwebtoken
- multer
- cors
- dotenv
- express-validator

Wait for installation to complete.

#### 3.3 Configure Environment Variables
The `.env` file is already created with default XAMPP settings:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=form2market
```

**Note:** If you changed your MySQL password in XAMPP, update `DB_PASSWORD` in the `.env` file.

#### 3.4 Start the Backend Server
Run:
```bash
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Form2Market Backend Server Started
📡 Server running on: http://localhost:5000
```

**Keep this terminal window open!** The backend server must run continuously.

---

### Step 4: Frontend Setup

#### 4.1 Open a New Terminal
Open a **NEW** Command Prompt or PowerShell window (keep the backend terminal running).

#### 4.2 Navigate to Frontend Directory
```bash
cd F:\Form2Market\frontend
```

#### 4.3 Install Dependencies
Run:
```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- vite

Wait for installation to complete.

#### 4.4 Start the Frontend Development Server
Run:
```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal window open too!**

---

### Step 5: Access the Application

1. Open your web browser (Chrome, Firefox, or Edge)
2. Go to: **http://localhost:3000**
3. You should see the Form2Market home page

---

## 🔐 Test Login Credentials

Use these pre-configured accounts to test the system:

### Admin Account
- **Email:** admin@farm.com
- **Password:** password123
- **Access:** Full system management

### Farmer Account
- **Email:** farmer@farm.com
- **Password:** password123
- **Access:** Add/edit products, view inquiries

### Buyer Account
- **Email:** buyer@farm.com
- **Password:** password123
- **Access:** Browse products, send inquiries

---

## ✅ Verification Checklist

After installation, verify the following:

- [ ] XAMPP MySQL is running (green status in Control Panel)
- [ ] Database `form2market` exists in phpMyAdmin
- [ ] All 3 tables are created with sample data
- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] You can access http://localhost:3000 in browser
- [ ] You can login with test credentials
- [ ] You can navigate between pages

---

## 🔧 Troubleshooting

### Issue: "Database connection failed"
**Solution:**
- Ensure XAMPP MySQL is running
- Check if port 3306 is available
- Verify database credentials in `backend/.env`

### Issue: "Port 5000 already in use"
**Solution:**
- Change `PORT=5000` to `PORT=5001` in `backend/.env`
- Restart the backend server

### Issue: "Port 3000 already in use"
**Solution:**
- The Vite server will automatically suggest an alternative port
- Use the suggested port or stop the other application using port 3000

### Issue: "npm install fails"
**Solution:**
- Ensure you have a stable internet connection
- Try running: `npm cache clean --force`
- Then run `npm install` again

### Issue: "Cannot find module"
**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json` file
- Run `npm install` again

---

## 📱 Using the Application

### As a Farmer:
1. Login with farmer credentials
2. Click "Add Product" to list your products
3. Fill in product details and upload an image
4. View and manage your products from the dashboard
5. Check inquiries from buyers

### As a Buyer:
1. Login with buyer credentials
2. Browse available products
3. Use filters to search by category or price
4. Click on a product to view details
5. Send an inquiry to the farmer
6. View your inquiries from "My Inquiries"

### As an Admin:
1. Login with admin credentials
2. View user statistics
3. Block/activate users
4. Delete inappropriate products
5. Manage the entire marketplace

---

## 🛑 Stopping the Application

To stop the application:

1. **Frontend:** Press `Ctrl + C` in the frontend terminal
2. **Backend:** Press `Ctrl + C` in the backend terminal
3. **XAMPP:** Open XAMPP Control Panel and stop MySQL

---

## 🔄 Restarting the Application

To restart after stopping:

1. Start XAMPP MySQL
2. Navigate to `F:\Form2Market\backend` and run `npm start`
3. Navigate to `F:\Form2Market\frontend` and run `npm run dev`
4. Access http://localhost:3000

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify all prerequisites are installed correctly
3. Ensure XAMPP MySQL is running
4. Check terminal logs for error messages

---

## 🎉 You're All Set!

Your Form2Market offline marketplace is now fully operational. Enjoy connecting farmers with buyers directly!

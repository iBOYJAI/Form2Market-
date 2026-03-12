# COMPLETE PROJECT REPORT: Farm to Market (Form2Market)

## 1. PROJECT OVERVIEW & SYNOPSIS

**Farm to Market** is a complete, fully offline agricultural marketplace designed specifically to bridge the gap between local farmers and buyers without the need for an active internet connection. In many rural agricultural sectors, farmers struggle to secure fair prices for their produce due to heavy reliance on intermediaries and limited access to broader markets. Farm to Market addresses this critical issue by providing a direct, localized digital platform where agricultural transactions and negotiations can take place transparently and efficiently.

### 1.1 Objectives and Scope
The primary objective is to eliminate the exploitation of farmers by middle-men by providing a direct communication channel with potential buyers through an offline-capable digital marketplace. It encompasses the design and implementation of a role-based marketplace system including Farmer, Buyer, and Admin modules. The platform operates natively on local networks using technologies like Node.js, React, and XAMPP MySQL.

### 1.2 Key Highlights
- **100% Offline**: Works completely without internet, resilient for rural areas.
- **No Middlemen**: Direct farmer-to-buyer interactions, keeping economic benefits local.
- **Secure Authentication**: JWT tokens with bcrypt password hashing.
- **Role-Based Access**: Specialized interfaces for Farmers, Buyers, and Admins.

---

## 2. TECHNOLOGY STACK & ARCHITECTURE

The system is built upon a reliable software stack that prioritizes stability and local performance.

### 2.1 Technologies
- **Frontend**: React 18, React Router DOM, Axios, Vite, Vanilla CSS.
- **Backend**: Node.js (16.x+), Express.js, MySQL2, JWT, Bcrypt.js, Multer (file uploads), CORS, Express Validator.
- **Database**: MySQL 5.7+ (via XAMPP/MariaDB).

### 2.2 System & Hardware Requirements
- **Hardware**: Intel Core i3 minimum (Core i5 recommended), 4GB+ RAM, 500MB available disk space. Functional Wi-Fi adapter or Ethernet port for local network connectivity.
- **Software**: Windows 10/11 (64-bit), XAMPP (7.4+), Node.js (16.x+), modern web browser.

### 2.3 Data Flow
1. **User Request** → Frontend (React)
2. **API Call** → `services/api.js` (Axios)
3. **HTTP Request** → Backend (Express) on `:5000`
4. **Authentication** → `middleware/auth.js` (JWT verify)
5. **Route Handling** → `routes/*.js`
6. **Business Logic** → `controllers/*.js`
7. **Database Query** → `db.js` → MySQL
8. **Response** → Controller → Route → Frontend
9. **UI Update** → React component re-render

---

## 3. ROLES & FEATURES

### 3.1 Farmer
- **Capabilities**: Maintain a professional digital catalog of produce.
- **Features**: 
  - Add, edit, and delete products.
  - Upload product images.
  - View product statistics.
  - Receive, view, and manage buyer inquiries directly from the dashboard.
  - Access buyer contact information for negotiation.

### 3.2 Buyer
- **Capabilities**: Professional interface to discover high-quality local produce.
- **Features**: 
  - Browse available products with advanced categorization and search features.
  - Filter by category, price, and search keywords.
  - View detailed product information and farmer contact info.
  - Send direct inquiries to farmers for specific products.
  - Track inquiry history.

### 3.3 Admin
- **Capabilities**: System-wide management, moderation, and oversight.
- **Features**: 
  - View system-wide user statistics (Total users, farmers, buyers, active/blocked).
  - Manage all users (view, block, activate, delete).
  - Manage all listings (view, delete inappropriate listings).
  - Full system oversight to maintain security and platform integrity.

---

## 4. WORKFLOWS & USER FLOW

### 4.1 Authentication & Onboarding
- **Registration**: Users choose their role (Farmer/Buyer) and provide details. Input validation ensures data integrity. Successful registration automatically logs the user in.
- **Login**: Token-based login verifying credentials against hashed MySQL records. Automatically routes users to their specific dashboard based on their role (`/farmer/dashboard`, `/buyer/dashboard`, `/admin/dashboard`).

### 4.2 Product Management Flow (Farmer)
1. Navigate to "Add Product".
2. Fill out comprehensive form data (Name, category, price, quantity, description, and image upload).
3. System validates constraints and securely stores image locally.
4. Product immediately populates on the public buyer catalog.

### 4.3 Discovery & Inquiry Flow (Buyer)
1. Buyer logs in and views the Product Grid.
2. Buyer applies filters (e.g., Category: Vegetables, Price < ₹100).
3. Buyer clicks a product card to view full details.
4. Buyer fills out the "Send Inquiry" form.
5. Inquiry saved to the DB and linked to the corresponding Farmer.
6. Farmer logs in, reviews inquiries on their dashboard, and reaches out to the Buyer offline or via email.

### 4.4 Complete Navigation Flow
```text
Home (/)
├── Register → (Auto-login) → Role Dashboard
├── Login
│   ├── Farmer → Farmer Dashboard
│   │   ├── Add Product Form
│   │   ├── Edit Product Form
│   │   └── View Inquiries (Widgets)
│   ├── Buyer → Buyer Dashboard
│   │   ├── View Product Details
│   │   │   └── Send Inquiry
│   │   └── My Inquiries
│   └── Admin → Admin Dashboard
│       ├── Users Management Tab
│       └── Products Management Tab
└── Logout → Redirects to Home
```

---

## 5. DATABASE DESIGN & SCHEMA

The system uses a relational MySQL database (`form2market`) structured for normalizing user, logic, and operational data.

### 5.1 Entities and Relationships
- **User**: Central entity. A User (Farmer) can list multiple Products (One-to-Many). A User (Buyer) can initiate multiple Inquiries (One-to-Many). 
- **Inquiry**: Links exactly one Product and one Buyer. Forms the core of direct communication tracking.

### 5.2 Table Specifications

**users**
- `id` (INT, PK, Auto-Inc)
- `name` (VARCHAR 100)
- `email` (VARCHAR 191, Unique)
- `password` (VARCHAR 255)
- `role` (ENUM: farmer, buyer, admin)
- `status` (ENUM: active, blocked)
- `created_at` (TIMESTAMP)

**products**
- `id` (INT, PK)
- `farmer_id` (INT, FK → users.id)
- `name` (VARCHAR 200)
- `category` (VARCHAR 100)
- `price` (DECIMAL 10,2)
- `quantity` (INT)
- `description` (TEXT)
- `image_path` (VARCHAR 255)

**inquiries**
- `id` (INT, PK)
- `product_id` (INT, FK → products.id)
- `buyer_id` (INT, FK → users.id)
- `message` (TEXT)
- `created_at` (TIMESTAMP)
- `read_status` (TINYINT)

---

## 6. FOLDER & PROJECT STRUCTURE

**Project Root**
```text
Form2Market/
├── backend/              # Node.js Express API server
├── frontend/             # React Vite application
├── database/             # SQL database schema
├── INSTALLATION.md       # Setup instructions
├── API_DOCUMENTATION.md  # API reference
└── README.md             # Project overview
```

**Backend Architecture**
Follows a modular MVC-style logic without views (handled by React).
- `controllers/`: Business logic (`authController.js`, `productController.js`, etc.)
- `middleware/`: Express middleware (`auth.js` for JWT checks).
- `routes/`: API route definitions.
- `uploads/`: Stores local product images.
- `db.js`: MySQL connection pool.
- `server.js`: Main entry point.

**Frontend Architecture**
- `src/components/`: Reusable React components (`Navbar.jsx`, `ProtectedRoute.jsx`).
- `src/context/`: Context providers (`AuthContext.jsx`).
- `src/pages/`: Main views corresponding to URL routes.
- `src/services/`: API Axios setup (`api.js`).
- `App.jsx`: Global routing wrapper.

---

## 7. PAGES & SCREENS DESCRIPTION

- **Home Page (`/`)**: Hero section, system features, and call-to-actions.
- **Registration & Login (`/register`, `/login`)**: Central authentication forms with role routing.
- **Farmer Dashboard (`/farmer/dashboard`)**: Statistics, "My Products" grid showing all inventory, and a "Recent Inquiries" tracker.
- **Add/Edit Product (`/farmer/products/*`)**: Forms including image upload utilities.
- **Buyer Dashboard (`/buyer/dashboard`)**: Interactive searchable/filterable catalog.
- **Product Details (`/products/:id`)**: Comprehensive read-out of a product, farmer info, and an inquiry submission engine.
- **Buyer Inquiries (`/buyer/inquiries`)**: History tracking for sent negotiations.
- **Admin Dashboard (`/admin/dashboard`)**: Tabs for `Users Management` and `Products Management`. Actions to block/activate users and delete inappropriate products. Includes statistics widgets.

---

## 8. API ARCHITECTURE

All endpoints are prefixed with `/api`. Security involves JWT Bearer tokens included in the header authorization. Form boundaries are configured for `multipart/form-data` during uploads.

- **Auth**: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- **Products**: 
  - `GET /products` (Supports category, minPrice, maxPrice, search queries)
  - `GET /products/:id`, `GET /products/farmer/my-products`
  - `POST /products`, `PUT /products/:id` (Multipart form uploads)
  - `DELETE /products/:id`
- **Inquiries**: `POST /inquiries`, `GET /inquiries/farmer`, `GET /inquiries/buyer`
- **Users (Admin)**: `GET /users`, `PUT /users/:id/status`, `DELETE /users/:id`, `GET /users/stats/summary`

---

## 9. SETUP & INSTALLATION WORKFLOW

### Setting up the Database
1. Run XAMPP (Apache optional, MySQL required).
2. Create DB `form2market` in phpMyAdmin.
3. Import `database/schema.sql`.

### Backend Configuration
1. Navigate to `/backend` and `npm install`.
2. Configure `.env` (`DB_HOST=localhost`, `DB_USER=root`, `DB_NAME=form2market`, etc.).
3. Start server via `npm start`.

### Frontend Configuration
1. Navigate to `/frontend` and `npm install`.
2. Ensure Vite proxy matches backend port (`vite.config.js`).
3. Start React via `npm run dev`.

---

## 10. TESTING SCENARIOS

Default testing credentials configured in `schema.sql`:
- **Admin**: `admin@farm.com` / `password123`
- **Farmer 1**: `farmer@farm.com` / `password123`
- **Buyer 1**: `buyer@farm.com` / `password123`

**Integration Tests Covered**:
1. Role-based routing (e.g. Farmer attempting to access buyer views redirects dynamically).
2. Cross-data integrity (Blocking a farmer account immediately restricts their login capability without purging their underlying product listing until handled by admin).
3. Image size constraints (Backend restricts >5MB).
4. Unplugged testing (Fully disabling the host network verifies that React caching and local XAMPP loopback maintains 100% operation).

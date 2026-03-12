# 🌾 Form2Market

**Offline Farmer-to-Buyer Marketplace**

A complete, production-ready, fully offline agricultural marketplace system that connects farmers and buyers directly, eliminating middlemen. Built with React.js, Node.js, Express.js, MySQL (XAMPP), and JWT authentication.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Default Credentials](#default-credentials)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

Form2Market is a fully offline marketplace platform designed to empower agricultural communities by providing a direct connection between farmers and buyers. The system operates entirely on localhost using XAMPP MySQL and local Node.js server, making it ideal for areas with limited or no internet connectivity.

### Key Highlights

- ✅ **100% Offline**: Works completely without internet
- ✅ **No Middlemen**: Direct farmer-to-buyer transactions
- ✅ **Role-Based Access**: Farmer, Buyer, and Admin roles
- ✅ **Product Management**: Full CRUD operations with image uploads
- ✅ **Inquiry System**: Direct communication between buyers and farmers
- ✅ **Admin Panel**: Complete system oversight and management
- ✅ **Secure Authentication**: JWT tokens with bcrypt password hashing
- ✅ **Modern UI**: Responsive design with clean aesthetics

---

## ✨ Features

### For Farmers
- 📝 Add, edit, and delete products
- 📸 Upload product images (stored locally)
- 📊 View product statistics
- 📨 Receive and manage buyer inquiries
- 📧 Access buyer contact information

### For Buyers
- 🔍 Browse all available products
- 🏷️ Filter by category, price, and search
- 📱 View detailed product information
- 💬 Send inquiries to farmers
- 📑 Track inquiry history
- 📞 Direct access to farmer contact details

### For Admins
- 👥 Manage all users (view, block, activate, delete)
- 📦 Manage all products (view, delete)
- 📈 View system statistics
- 🔒 Prevent inappropriate listings
- 🛡️ Full system oversight

### Security Features
- 🔐 Password hashing with bcrypt
- 🎫 JWT token-based authentication
- 🚪 Role-based access control
- 🛡️ SQL injection prevention
- ✅ Input validation on frontend and backend
- 🔒 Protected routes with automatic redirects

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Vanilla CSS** - Styling (no external dependencies)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - MySQL client
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

### Database
- **MySQL 5.7+** (via XAMPP/MariaDB)
- Relational database design
- Foreign key constraints
- Indexed columns for performance

---

## 📦 Prerequisites

Before installing, ensure you have:

1. **XAMPP** (version 7.4 or higher)
   - Download: https://www.apachefriends.org/
   - Includes Apache, MySQL, PHP, and phpMyAdmin

2. **Node.js** (version 16.x or higher)
   - Download: https://nodejs.org/
   - Includes npm package manager

3. **Web Browser** (Chrome, Firefox, or Edge)

4. **Text Editor** (optional, VS Code recommended)

---

## 🚀 Quick Start

### 1. Clone/Extract the Project
```bash
# Extract to your preferred location
F:\Form2Market
```

### 2. Set Up Database
```bash
# Start XAMPP MySQL
# Open phpMyAdmin: http://localhost/phpmyadmin
# Create database: 'form2market'
# Import: database/schema.sql
```

Detailed instructions: [DATABASE_SETUP.md](DATABASE_SETUP.md)

### 3. Install Backend Dependencies
```bash
cd F:\Form2Market\backend
npm install
```

### 4. Start Backend Server
```bash
npm start
```

Server will run on: `http://localhost:5000`

### 5. Install Frontend Dependencies
```bash
# Open new terminal
cd F:\Form2Market\frontend
npm install
```

### 6. Start Frontend Server
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

### 7. Access the Application
Open your browser and navigate to: **http://localhost:3000**

---

## 📚 Documentation

Comprehensive documentation is provided in the project:

| Document | Description |
|----------|-------------|
| [INSTALLATION.md](INSTALLATION.md) | Complete installation and setup guide |
| [DATABASE_SETUP.md](DATABASE_SETUP.md) | XAMPP MySQL configuration and setup |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | REST API endpoints reference |
| [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) | Project organization explained |
| [TEST_USERS.md](TEST_USERS.md) | Test credentials and testing scenarios |
| [SCREENS_DESCRIPTION.md](SCREENS_DESCRIPTION.md) | UI screens for project reports |

---

## 📁 Project Structure

```
Form2Market/
│
├── backend/                  # Node.js Express API
│   ├── controllers/          # Business logic
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth & validation
│   ├── uploads/              # Product images
│   ├── .env                  # Environment config
│   ├── db.js                 # Database connection
│   └── server.js             # Main server file
│
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # Global state
│   │   ├── services/         # API services
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   └── vite.config.js        # Vite configuration
│
├── database/                 # Database files
│   └── schema.sql            # DB initialization script
│
└── Documentation files
```

See [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) for detailed explanation.

---

## 🔑 Default Credentials

Use these test accounts to explore the system:

### Admin
- **Email:** admin@farm.com
- **Password:** password123
- Full system management access

### Farmer
- **Email:** farmer@farm.com
- **Password:** password123
- Add/manage products and view inquiries

### Buyer
- **Email:** buyer@farm.com
- **Password:** password123
- Browse products and send inquiries

See [TEST_USERS.md](TEST_USERS.md) for more test accounts and scenarios.

---

## 📸 Screenshots

### Home Page
Modern landing page with feature highlights

### Farmer Dashboard
Product management and inquiry tracking

### Buyer Dashboard
Product browsing with advanced filters

### Product Details
Comprehensive product information with inquiry form

### Admin Panel
User and product management interface

*For detailed screen descriptions, see [SCREENS_DESCRIPTION.md](SCREENS_DESCRIPTION.md)*

---

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=form2market
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
MAX_FILE_SIZE=5242880
```

### Frontend Proxy (vite.config.js)
```javascript
{
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000'
    }
  }
}
```

---

## 🧪 Testing

### Run Complete System Test

1. **Authentication Flow**
   - Register new users (farmer & buyer)
   - Login with different roles
   - Test role-based redirects

2. **Farmer Operations**
   - Add product with image
   - Edit product details
   - Delete product
   - View inquiries

3. **Buyer Operations**
   - Browse and filter products
   - View product details
   - Send inquiry
   - Check inquiry history

4. **Admin Operations**
   - View user statistics
   - Block/activate users
   - Delete products
   - System management

See [TEST_USERS.md](TEST_USERS.md) for detailed test scenarios.

---

## 🐛 Troubleshooting

### Backend won't start
- ✅ Ensure XAMPP MySQL is running
- ✅ Check database exists (`form2market`)
- ✅ Verify `.env` configuration
- ✅ Check port 5000 is available

### Frontend won't start
- ✅ Run `npm install` in frontend directory
- ✅ Check port 3000 is available
- ✅ Ensure backend is running

### Database connection fails
- ✅ Start MySQL in XAMPP Control Panel
- ✅ Verify credentials in `.env`
- ✅ Check database name is correct
- ✅ Ensure port 3306 is open

### Images not displaying
- ✅ Check `uploads/` directory exists in backend
- ✅ Verify image paths in database
- ✅ Ensure backend static file serving is working

See [INSTALLATION.md](INSTALLATION.md) for detailed troubleshooting.

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (farmer)
- `PUT /api/products/:id` - Update product (farmer)
- `DELETE /api/products/:id` - Delete product (farmer/admin)

### Inquiries
- `POST /api/inquiries` - Send inquiry (buyer)
- `GET /api/inquiries/farmer` - Get farmer's inquiries
- `GET /api/inquiries/buyer` - Get buyer's inquiries

### Users (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/status` - Block/activate user
- `DELETE /api/users/:id` - Delete user

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

---

## 🎓 Learning Resources

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- JWT authentication
- Role-based access control
- File upload handling
- React state management with Context
- Protected routes
- Form validation
- Responsive design
- MySQL database design
- Offline-first architecture

---

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Protected routes with middleware
- SQL injection prevention (parameterized queries)
- Input validation with express-validator
- File upload restrictions (type & size)
- CORS configuration
- XSS protection through React

---

## 🚀 Deployment for Production

For production deployment:

1. **Database Security**
   - Set strong MySQL root password
   - Create dedicated database user
   - Update `.env` with new credentials

2. **Backend Security**
   - Change `JWT_SECRET` to strong random string
   - Set `NODE_ENV=production`
   - Enable HTTPS
   - Configure proper CORS origins

3. **Frontend**
   - Run `npm run build` in frontend
   - Serve build files with backend or nginx

4. **Server**
   - Use PM2 for process management
   - Set up reverse proxy (nginx/Apache)
   - Configure firewall rules

---

## 📄 License

This project is provided as-is for educational and demonstration purposes.

---

## 👥 Support

For issues and questions:
1. Check documentation files
2. Review troubleshooting sections
3. Verify all prerequisites are installed
4. Ensure XAMPP MySQL is running

---

## 🎉 Acknowledgments

Built with modern web technologies and best practices for offline agricultural marketplaces.

---

## 📞 Contact

For queries regarding this project, refer to the documentation files or review the codebase.

---

**Form2Market** - Connecting Farms to Markets, Offline! 🌾

---

## Quick Commands Reference

```bash
# Backend
cd F:\Form2Market\backend
npm install              # Install dependencies
npm start                # Start server

# Frontend
cd F:\Form2Market\frontend
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Build for production

# Database (MySQL via XAMPP)
# Start: XAMPP Control Panel → MySQL → Start
# phpMyAdmin: http://localhost/phpmyadmin
# Import: database/schema.sql

# Access
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# phpMyAdmin: http://localhost/phpmyadmin
```

---

Made with ❤️ for the agricultural community

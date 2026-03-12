# Form2Market - Folder Structure

This document explains the organization and purpose of all files and directories in the Form2Market project.

## Project Root
```
Form2Market/
├── backend/              # Node.js Express API server
├── frontend/             # React Vite application
├── database/             # SQL database schema
├── INSTALLATION.md       # Setup instructions
├── API_DOCUMENTATION.md  # API reference
├── README.md             # Project overview
└── Other documentation files
```

---

## Backend Directory

```
backend/
├── controllers/          # Business logic controllers
│   ├── authController.js         # Authentication logic
│   ├── productController.js      # Product CRUD operations
│   ├── userController.js         # User management (admin)
│   └── inquiryController.js      # Inquiry handling
│
├── middleware/           # Express middleware
│   └── auth.js                   # JWT verification & role checking
│
├── routes/              # API route definitions
│   ├── auth.js                   # Auth endpoints
│   ├── products.js               # Product endpoints
│   ├── users.js                  # User management endpoints
│   └── inquiries.js              # Inquiry endpoints
│
├── uploads/             # Uploaded product images (created on first upload)
│
├── .env                 # Environment variables (DB config, JWT secret)
├── db.js                # MySQL connection pool
├── server.js            # Main Express server entry point
├── package.json         # NPM dependencies and scripts
└── package-lock.json    # Locked dependency versions
```

### Backend File Purposes:

**server.js**
- Main application entry point
- Express server setup with middleware
- Route mounting
- Error handling
- Port listening

**db.js**
- MySQL database connection pool
- Connection verification
- Error handling for DB connection

**controllers/**
- Separate business logic from routes
- Handle database operations
- Input validation
- Response formatting

**middleware/auth.js**
- JWT token verification
- User authentication
- Role-based authorization (farmer/buyer/admin)

**routes/**
- Define API endpoints
- Map HTTP methods to controller functions
- Apply middleware (auth, validation, file upload)

**uploads/**
- Stores uploaded product images
- Served statically by Express
- Images named with timestamps to avoid conflicts

---

## Frontend Directory

```
frontend/
├── public/              # Static assets (auto-created by Vite)
│
├── src/                 # Source code
│   ├── components/      # Reusable React components
│   │   ├── Navbar.jsx            # Navigation bar
│   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   │
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx       # Global auth state management
│   │
│   ├── pages/           # Page components (routes)
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Login form
│   │   ├── Register.jsx          # Registration form
│   │   ├── FarmerDashboard.jsx   # Farmer main dashboard
│   │   ├── AddProduct.jsx        # Add/Edit product form
│   │   ├── BuyerDashboard.jsx    # Buyer product browsing
│   │   ├── BuyerInquiries.jsx    # Buyer's sent inquiries
│   │   ├── ProductDetails.jsx    # Product detail & inquiry
│   │   └── AdminDashboard.jsx    # Admin panel
│   │
│   ├── services/        # API service layer
│   │   └── api.js                # Axios config & API methods
│   │
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
│
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # NPM dependencies and scripts
└── package-lock.json    # Locked dependency versions
```

### Frontend File Purposes:

**main.jsx**
- React application entry point
- Renders root component
- Wraps with StrictMode

**App.jsx**
- Main application component
- React Router setup
- Route definitions
- Auth provider wrapper

**components/Navbar.jsx**
- Navigation bar component
- Role-based menu display
- User information display
- Logout functionality

**components/ProtectedRoute.jsx**
- HOC for route protection
- Redirect unauthenticated users
- Role-based access control

**context/AuthContext.jsx**
- Global authentication state
- Login/logout functions
- User data storage
- Role checking helpers

**pages/**
- Each file represents a distinct route
- Contains page-specific logic and UI
- Uses global auth context
- Calls API services

**services/api.js**
- Centralized API client
- Axios instance configuration
- Request/response interceptors
- JWT token attachment
- API method wrappers

**index.css**
- Global CSS styles
- Design system variables
- Component styles
- Responsive breakpoints

---

## Database Directory

```
database/
└── schema.sql           # MySQL database initialization script
```

**schema.sql**
- Creates `form2market` database
- Defines table structures
- Sets up foreign keys and indexes
- Inserts sample data
- Verification queries

---

## Configuration Files

### Backend .env
```
PORT=5000                # Server port
DB_HOST=localhost        # MySQL host
DB_PORT=3306             # MySQL port
DB_USER=root             # MySQL username
DB_PASSWORD=             # MySQL password (empty for XAMPP default)
DB_NAME=form2market      # Database name
JWT_SECRET=...           # Secret key for JWT signing
JWT_EXPIRE=7d            # Token expiration time
MAX_FILE_SIZE=5242880    # 5MB file upload limit
```

### Frontend vite.config.js
```javascript
{
  server: {
    port: 3000,           # Frontend dev server port
    proxy: {
      '/api': 'http://localhost:5000',      # API proxy
      '/uploads': 'http://localhost:5000'   # Image proxy
    }
  }
}
```

---

## Dependencies

### Backend (Node.js)
- **express**: Web framework
- **mysql2**: MySQL client
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **multer**: File upload handling
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **express-validator**: Input validation

### Frontend (React)
- **react**: UI library
- **react-dom**: React DOM renderer
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **vite**: Build tool and dev server

---

## Data Flow

1. **User Request** → Frontend (React)
2. **API Call** → services/api.js (Axios)
3. **HTTP Request** → Backend (Express) on :5000
4. **Authentication** → middleware/auth.js (JWT verify)
5. **Route Handling** → routes/*.js
6. **Business Logic** → controllers/*.js
7. **Database Query** → db.js → MySQL
8. **Response** → Controller → Route → Frontend
9. **UI Update** → React component re-render

---

## File Naming Conventions

- **Backend files**: camelCase (e.g., authController.js)
- **Frontend components**: PascalCase (e.g., BuyerDashboard.jsx)
- **Routes/services**: camelCase (e.g., api.js)
- **Documentation**: UPPERCASE (e.g., README.md)
- **SQL files**: lowercase (e.g., schema.sql)

---

## Important Notes

1. **uploads/ directory**: Created automatically when first product image is uploaded
2. **.env file**: Never commit to version control (contains secrets)
3. **node_modules/**: Auto-generated, excluded from version control
4. **package-lock.json**: Should be committed to lock dependency versions
5. **Vite cache**: Auto-generated in frontend, can be deleted safely

---

## Best Practices

- Keep controllers thin, move complex logic to separate service files if needed
- Use environment variables for all configuration
- Validate all user inputs on both frontend and backend
- Handle errors gracefully with proper status codes
- Keep components small and focused on single responsibility
- Use React Context for global state (auth)
- Keep CSS organized with clear class naming

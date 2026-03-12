# Form2Market - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new farmer or buyer.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer"  // or "buyer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

---

### Login
**POST** `/auth/login`

Login to the system.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get current user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "farmer",
    "status": "active",
    "created_at": "2025-12-18T06:00:00.000Z"
  }
}
```

---

## Product Endpoints

### Get All Products
**GET** `/products`

Get all products with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search in name and description

**Example:** `/products?category=Vegetables&minPrice=20&maxPrice=100`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "products": [
    {
      "id": 1,
      "farmer_id": 2,
      "name": "Organic Tomatoes",
      "category": "Vegetables",
      "price": 50.00,
      "quantity": 100,
      "description": "Fresh organic tomatoes",
      "image_path": "/uploads/product-123456.jpg",
      "created_at": "2025-12-18T06:00:00.000Z",
      "farmer_name": "John Farmer",
      "farmer_email": "farmer@farm.com"
    }
  ]
}
```

---

### Get Product by ID
**GET** `/products/:id`

Get single product details.

**Response:**
```json
{
  "success": true,
  "product": {
    "id": 1,
    "farmer_id": 2,
    "name": "Organic Tomatoes",
    "category": "Vegetables",
    "price": 50.00,
    "quantity": 100,
    "description": "Fresh organic tomatoes",
    "image_path": "/uploads/product-123456.jpg",
    "farmer_name": "John Farmer",
    "farmer_email": "farmer@farm.com"
  }
}
```

---

### Get Farmer's Products
**GET** `/products/farmer/my-products`

Get all products of the logged-in farmer (requires farmer authentication).

**Response:**
```json
{
  "success": true,
  "count": 3,
  "products": [...]
}
```

---

### Create Product
**POST** `/products`

Create a new product (requires farmer authentication).

**Request Type:** `multipart/form-data`

**Form Data:**
- `name` (required): Product name
- `category` (required): Product category
- `price` (required): Price per kg
- `quantity` (required): Available quantity
- `description` (optional): Product description
- `image` (optional): Product image file

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {...}
}
```

---

### Update Product
**PUT** `/products/:id`

Update a product (requires farmer/admin authentication).

**Request Type:** `multipart/form-data`

Same form data as create product.

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {...}
}
```

---

### Delete Product
**DELETE** `/products/:id`

Delete a product (requires farmer/admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Get Categories
**GET** `/products/categories/list`

Get all unique product categories.

**Response:**
```json
{
  "success": true,
  "categories": ["Vegetables", "Fruits", "Grains", "Dairy", "Poultry"]
}
```

---

## Inquiry Endpoints

### Create Inquiry
**POST** `/inquiries`

Send an inquiry to a farmer (requires buyer authentication).

**Request Body:**
```json
{
  "product_id": 1,
  "message": "I am interested in this product. Can you deliver?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inquiry sent successfully",
  "inquiry": {
    "id": 1,
    "product_id": 1,
    "buyer_id": 3,
    "message": "I am interested...",
    "product_name": "Organic Tomatoes",
    "buyer_name": "Jane Buyer",
    "buyer_email": "buyer@farm.com",
    "created_at": "2025-12-18T06:00:00.000Z"
  }
}
```

---

### Get Farmer Inquiries
**GET** `/inquiries/farmer`

Get all inquiries for farmer's products (requires farmer authentication).

**Response:**
```json
{
  "success": true,
  "count": 5,
  "inquiries": [
    {
      "id": 1,
      "product_id": 1,
      "buyer_id": 3,
      "message": "I am interested...",
      "product_name": "Organic Tomatoes",
      "buyer_name": "Jane Buyer",
      "buyer_email": "buyer@farm.com",
      "created_at": "2025-12-18T06:00:00.000Z"
    }
  ]
}
```

---

### Get Buyer Inquiries
**GET** `/inquiries/buyer`

Get all inquiries sent by the buyer (requires buyer authentication).

**Response:**
```json
{
  "success": true,
  "count": 3,
  "inquiries": [...]
}
```

---

### Get Product Inquiries
**GET** `/inquiries/product/:productId`

Get all inquiries for a specific product (requires farmer authentication and ownership).

**Response:**
```json
{
  "success": true,
  "count": 2,
  "inquiries": [...]
}
```

---

## User Management Endpoints (Admin Only)

### Get All Users
**GET** `/users`

Get all users (requires admin authentication).

**Query Parameters:**
- `role` (optional): Filter by role (farmer/buyer/admin)
- `status` (optional): Filter by status (active/blocked)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "farmer",
      "status": "active",
      "created_at": "2025-12-18T06:00:00.000Z"
    }
  ]
}
```

---

### Get User by ID
**GET** `/users/:id`

Get single user details (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "user": {...}
}
```

---

### Update User Status
**PUT** `/users/:id/status`

Block or activate a user (requires admin authentication).

**Request Body:**
```json
{
  "status": "blocked"  // or "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User blocked successfully",
  "user": {...}
}
```

---

### Delete User
**DELETE** `/users/:id`

Delete a user (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### Get User Statistics
**GET** `/users/stats/summary`

Get user statistics (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_users": 10,
    "total_farmers": 5,
    "total_buyers": 4,
    "total_admins": 1,
    "active_users": 9,
    "blocked_users": 1
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Rate Limiting
Currently, there are no rate limits implemented as this is an offline system.

## File Upload Limits
- Maximum file size: 5MB
- Allowed formats: JPG, PNG, GIF
- Files are stored locally in `/uploads` directory

---

## Testing with cURL

### Login Example:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@farm.com",
    "password": "password123"
  }'
```

### Get Products with Token:
```bash
curl http://localhost:5000/api/products/farmer/my-products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Product:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "name=Fresh Apples" \
  -F "category=Fruits" \
  -F "price=100" \
  -F "quantity=50" \
  -F "description=Sweet apples" \
  -F "image=@/path/to/image.jpg"
```

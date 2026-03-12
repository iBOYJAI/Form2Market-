# Form2Market - Screen Descriptions for Project Report

This document describes all screens/pages in the Form2Market application for inclusion in project reports and presentations.

---

## 1. Home Page (Landing Page)

**Route:** `/`

**Purpose:** Welcome page and application introduction

**Features:**
- Hero section with application title and tagline
- Brief description of the marketplace concept
- Call-to-action buttons (Login / Register)
- Features section highlighting key benefits:
  - For Farmers: Easy product listing and inventory management
  - For Buyers: Direct access to fresh products
  -100% Offline: No internet dependency
  - No Middlemen: Direct farmer-to-buyer connection
- Responsive design with modern aesthetics

**User Actions:**
- Click "Get Started" → Navigate to Registration
- Click "Login" → Navigate to Login page
- View feature cards

**Screenshot Elements:**
- Large hero text with agricultural icon
- Bright green color scheme
- Feature cards in grid layout
- Modern, clean design

---

## 2. Registration Page

**Route:** `/register`

**Purpose:** New user account creation

**Features:**
- Registration form with fields:
  - Full Name (text input)
  - Email Address (email input with validation)
  - Role Selection (dropdown: Farmer or Buyer)
  - Password (minimum 6 characters)
  - Confirm Password (must match)
- Real-time validation feedback
- Error message display for validation failures
- Link to login page for existing users
- Automatic login after successful registration

**User Actions:**
- Fill in registration details
- Select role (Farmer/Buyer)
- Submit form
- Redirect to role-appropriate dashboard on success

**Validation Rules:**
- All fields required
- Valid email format
- Password minimum 6 characters
- Passwords must match
- Email must be unique

---

## 3. Login Page

**Route:** `/login`

**Purpose:** User authentication

**Features:**
- Login form with fields:
  - Email Address
  - Password
- "Remember me" implied through JWT token storage
- Test credentials display for demo purposes
- Error messages for incorrect credentials
- Link to registration page
- Role-based redirect after login:
  - Farmer → Farmer Dashboard
  - Buyer → Buyer Dashboard
  - Admin → Admin Dashboard

**User Actions:**
- Enter credentials
- Submit login form
- View error if credentials invalid
- Redirect to dashboard on success

**Security Features:**
- Password hidden (type=password)
- JWT token stored in localStorage
- Blocked users cannot login

---

## 4. Farmer Dashboard

**Route:** `/farmer/dashboard`

**Access:** Farmers only (protected route)

**Purpose:** Central hub for farmer operations

**Features:**
- Welcome header with farmer name
- "Add New Product" button (prominent call-to-action)
- Statistics cards:
  - Total Products count
  - Inquiries Received count
- "My Products" section:
  - Grid layout of product cards
  - Each card shows:
    - Product image (if uploaded)
    - Product name
    - Category badge
    - Price per kg
    - Available quantity
    - Edit and Delete buttons
  - Empty state if no products
- "Recent Inquiries" section:
  - List of latest 5 inquiries
  - Shows:
    - Buyer name
    - Product name
    - Inquiry message
    - Buyer email (clickable mailto link)
    - Date received

**User Actions:**
- Click "Add New Product" → Navigate to add product form
- Click "Edit" on product → Navigate to edit form
- Click "Delete" on product → Confirm and delete
- Click buyer email → Open email client
- View statistics at a glance

**Empty States:**
- "You haven't added any products yet" with CTA to add first product
- "No inquiries yet" message

---

## 5. Add/Edit Product Page

**Routes:** `/farmer/products/add` and `/farmer/products/edit/:id`

**Access:** Farmers only

**Purpose:** Create new products or edit existing ones

**Features:**
- Dynamic title: "Add New Product" or "Edit Product"
- Comprehensive form with fields:
  - Product Name (required)
  - Category (dropdown: Vegetables, Fruits, Grains, Dairy, Poultry, Other)
  - Price per kg (number, min 0)
  - Quantity in kg (number, min 0)
  - Description (textarea, optional)
  - Product Image (file upload, max 5MB)
- For edit mode:
  - Form pre-filled with existing data
  - Current image displayed
  - Option to replace image
- Form validation
- Cancel and Save buttons
- Success/error message display

**User Actions:**
- Fill in product details
- Upload product image
- Click "Add Product" or "Update Product"
- Click "Cancel" to return to dashboard
- View validation errors

**Image Upload:**
- Accepts: JPG, PNG, GIF
- Max size: 5MB
- Preview of current image (edit mode)
- File size warning displayed

---

## 6. Buyer Dashboard (Product Catalog)

**Route:** `/buyer/dashboard`

**Access:** Buyers only

**Purpose:** Browse and discover products

**Features:**
- Page header with "Browse Products" title
- "My Inquiries" button to view sent inquiries
- Search and filter section:
  - Text search bar (searches name and description)
  - Category dropdown filter
  - Min Price input
  - Max Price input
  - Search and Clear buttons
- Product grid display:
  - Responsive grid layout (3-4 columns on desktop)
  - Each product card shows:
    - Product image
    - Product name
    - Category badge
    - Price per kg
    - Available quantity
    - Farmer name
    - "View Details" button
- Loading state while fetching
- Empty state if no products match filters

**User Actions:**
- Type in search box
- Select category filter
- Enter price range
- Click "Search" to apply filters
- Click "Clear" to reset all filters
- Click on product card to view details
- Navigate to "My Inquiries"

**Filters:**
- Combine multiple filters (AND logic)
- Real-time results update
- Filter count display

---

## 7. Product Details Page

**Route:** `/products/:id`

**Access:** Public (authenticated required for inquiry)

**Purpose:** View detailed product information and send inquiries

**Features:**
- Back button to return to previous page
- Two-column layout (desktop):
  - Left: Full-size product image or placeholder
  - Right: Product information
- Product information panel:
  - Product name (large heading)
  - Category badge (colored)
  - Price tag (prominent, ₹ symbol)
  - Available quantity
  - Full description
  - Farmer information section:
    - Farmer name
    - Farmer email (clickable)
- Inquiry form (buyers only):
  - Large text area for message
  - Minimum 10 characters validation
  - "Send Inquiry" button
  - Success/error message display
- Login prompt for non-authenticated users

**User Actions:**
- View product details
- Read description
- See farmer contact info
- Type inquiry message
- Submit inquiry
- View confirmation message
- Click farmer email to contact

**Responsive Design:**
- Stack layout on mobile
- Full-width image
- Scrollable content

---

## 8. Buyer Inquiries Page

**Route:** `/buyer/inquiries`

**Access:** Buyers only

**Purpose:** View history of sent inquiries

**Features:**
- Page title: "My Inquiries"
- List of all inquiries sent by the buyer:
  - Product name (heading)
  - Date sent
  - Farmer name
  - Inquiry message (in quote box)
  - Farmer contact email (clickable)
- Chronological order (newest first)
- Empty state if no inquiries:
  - "You haven't sent any inquiries yet"
  - Button to browse products

**User Actions:**
- View all sent inquiries
- Click farmer email to contact
- Navigate to browse products
- Reference past conversations

**Display Format:**
- Card-based layout
- Clear visual separation between inquiries
- Color-coded left border
- Timestamp in relative format

---

## 9. Admin Dashboard

**Route:** `/admin/dashboard`

**Access:** Admin only

**Purpose:** System-wide management and oversight

**Features:**
- Page title: "Admin Dashboard"
- Statistics cards (top row):
  - Total Users
  - Total Farmers
  - Total Buyers
  - Total Products
- Tab navigation:
  - Users Management
  - Products Management

### Users Management Tab:
- Table view with columns:
  - ID
  - Name
  - Email
  - Role (color-coded badge)
  - Status (Active/Blocked badge)
  - Joined Date
  - Actions
- Action buttons for each user:
  - Block/Activate (toggle based on status)
  - Delete (with confirmation)
- Cannot modify admin accounts
- Filters for role and status (optional)

### Products Management Tab:
- Grid view of all products
- Each card shows:
  - Product image
  - Product name
  - Category
  - Price
  - Farmer name
  - Delete button
- Delete confirmation dialog

**User Actions:**
- Switch between tabs
- Block/activate users
- Delete users
- Delete products
- View statistics
- Confirm dangerous actions

**Security:**
- Admin cannot delete/block self
- Confirmation dialogs for deletions
- Success/error feedback

---

## Design Elements Used Across All Screens

### Color Scheme:
- Primary Green: #2d8659 (agricultural theme)
- Secondary Orange: #f59e0b (call-to-action)
- Success Green: #10b981
- Error Red: #ef4444
- Neutral Grays for text and backgrounds

### Typography:
- Modern sans-serif font stack
- Clear heading hierarchy
- Readable body text (16px base)

### Components:
- **Navbar:** Fixed top bar with logo, navigation links, user menu, logout
- **Buttons:** Primary (green), Secondary (orange), Danger (red), with hover effects
- **Cards:** Elevated with shadow, rounded corners
- **Forms:** Clean inputs with focus states, validation feedback
- **Alerts:** Color-coded (error=red, success=green)
- **Badges:** Small colored labels for categories, roles, status

### Responsive Design:
- Desktop (1280px+): Multi-column layouts
- Tablet (768px-1280px): Flexible grids
- Mobile (<768px): Stacked single-column layout
- Touch-friendly buttons (48px minimum)

### Accessibility:
- Semantic HTML
- Color contrast compliance
- Keyboard navigation support
- Screen reader friendly labels

---

## Navigation Flow

```
Home
├── Register → (Auto-login) → Role Dashboard
├── Login
│   ├── Farmer → Farmer Dashboard
│   │   ├── Add Product → Add Product Form → Farmer Dashboard
│   │   ├── Edit Product → Edit Product Form → Farmer Dashboard
│   │   └── View Inquiries (on dashboard)
│   ├── Buyer → Buyer Dashboard
│   │   ├── View Product → Product Details
│   │   │   └── Send Inquiry → Product Details (success) / My Inquiries
│   │   └── My Inquiries → Buyer Inquiries Page
│   └── Admin → Admin Dashboard
│       ├── Users Management Tab
│       └── Products Management Tab
└── Logout → Home
```

---

## Screenshots Recommended for Report

1. **Home Page:** Full landing page with hero and features
2. **Registration:** Form with all fields visible
3. **Login:** Simple auth screen with test credentials
4. **Farmer Dashboard:** With products and inquiries displayed
5. **Add Product Form:** Complete form with validation
6. **Buyer Dashboard:** Product grid with filters active
7. **Product Details:** Full detail view with inquiry form
8. **Buyer Inquiries:** List of sent inquiries
9. **Admin Dashboard - Users:** Table view with actions
10. **Admin Dashboard - Products:** Grid view of all products
11. **Mobile View:** Any screen on mobile device
12. **Error States:** Form validation, 404, unauthorized access

---

This screen description document provides comprehensive information about all user interfaces in the Form2Market application, suitable for project reports, presentations, and documentation.

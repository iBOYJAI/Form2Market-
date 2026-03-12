# Form2Market - Test Users Guide

This document provides sample test credentials and usage scenarios for testing the Form2Market application.

---

## 🔐 Test Credentials

### 1. Admin User
```
Email:    admin@farm.com
Password: password123
Role:     admin
```

**Capabilities:**
- View all users and statistics
- Block/activate user accounts
- Delete users (except self)
- View all products
- Delete any product
- Full system access

**Test Scenarios:**
- Login and view admin dashboard
- Check user statistics
- Block a farmer account
- Activate the blocked account
- View all products in the system
- Delete inappropriate products

---

### 2. Farmer User
```
Email:    farmer@farm.com
Password: password123
Role:     farmer
```

**Capabilities:**
- Add new products with images
- Edit own products
- Delete own products
- View received inquiries from buyers
- View buyer contact details

**Test Scenarios:**
- Login and view farmer dashboard
- Add a new product with image
- Edit product details
- View inquiries on products
- Contact buyers via email
- Delete a product

---

### 3. Secondary Farmer
```
Email:    sarah@farm.com
Password: password123
Role:     farmer
```

**Purpose:** Test multiple farmers in the system

**Test Scenarios:**
- Add products from different farmer
- Verify product ownership restrictions
- Test that farmers can only edit their own products

---

### 4. Buyer User
```
Email:    buyer@farm.com
Password: password123
Role:     buyer
```

**Capabilities:**
- Browse all available products
- Filter products by category and price
- View product details
- Send inquiries to farmers
- View sent inquiry history

**Test Scenarios:**
- Login and browse products
- Use search and filter functions
- View product details
- Send inquiry to farmer
- Check inquiry history
- View farmer contact information

---

### 5. Secondary Buyer
```
Email:    mike@farm.com
Password: password123
Role:     buyer
```

**Purpose:** Test multiple buyers in the system

**Test Scenarios:**
- Send inquiries from different buyer
- Verify buyer can only see own inquiries

---

## 📋 Sample Test Data

### Pre-loaded Products

1. **Organic Tomatoes**
   - Farmer: farmer@farm.com
   - Category: Vegetables
   - Price: ₹50/kg
   - Quantity: 100 kg

2. **Fresh Potatoes**
   - Farmer: farmer@farm.com
   - Category: Vegetables
   - Price: ₹30/kg
   - Quantity: 200 kg

3. **Red Apples**
   - Farmer: sarah@farm.com
   - Category: Fruits
   - Price: ₹120/kg
   - Quantity: 50 kg

4. **Fresh Milk**
   - Farmer: sarah@farm.com
   - Category: Dairy
   - Price: ₹60/liter
   - Quantity: 30 liters

5. **Brown Eggs**
   - Farmer: farmer@farm.com
   - Category: Poultry
   - Price: ₹80/dozen
   - Quantity: 100 dozens

### Pre-loaded Inquiries

1. Buyer (buyer@farm.com) → Product: Organic Tomatoes
   - Message: "Hi, I am interested in buying 10 kg of tomatoes. Can you deliver to the city?"

2. Buyer (mike@farm.com) → Product: Red Apples
   - Message: "Are these apples organic? What is the minimum order quantity?"

3. Buyer (buyer@farm.com) → Product: Fresh Milk
   - Message: "I would like to order milk regularly. Do you offer subscription?"

---

## 🧪 Complete Test Flow

### Test 1: New User Registration & Login

1. Navigate to registration page
2. Register as a new farmer:
   - Name: Test Farmer
   - Email: testfarmer@example.com
   - Password: test123
   - Role: Farmer
3. Verify automatic login after registration
4. Logout
5. Login again with same credentials
6. Verify successful login

### Test 2: Farmer Product Management

1. Login as `farmer@farm.com`
2. View farmer dashboard
3. Click "Add Product"
4. Fill in product details:
   - Name: Fresh Carrots
   - Category: Vegetables
   - Price: 40
   - Quantity: 150
   - Description: Organic carrots from our farm
   - Upload an image
5. Submit form
6. Verify product appears in dashboard
7. Click "Edit" on the new product
8. Change price to 45
9. Upload different image
10. Save changes
11. Verify updates are reflected
12. Delete the product
13. Confirm deletion

### Test 3: Buyer Product Discovery & Inquiry

1. Login as `buyer@farm.com`
2. View buyer dashboard (product catalog)
3. Test search functionality:
   - Search for "tomatoes"
   - Verify results
4. Test category filter:
   - Select "Fruits"
   - Verify only fruits shown
5. Test price filter:
   - Set min: 50, max: 100
   - Verify filtered results
6. Click on a product to view details
7. Read product information
8. Send an inquiry:
   - Type message (min 10 characters)
   - Submit
9. Verify success message
10. Navigate to "My Inquiries"
11. Verify inquiry appears in list
12. Copy farmer's email for contact

### Test 4: Farmer Inquiry Management

1. Login as `farmer@farm.com`
2. View farmer dashboard
3. Check "Recent Inquiries" section
4. Verify inquiry details:
   - Buyer name
   - Product name
   - Message content
   - Buyer email
5. Note buyer's email for follow-up

### Test 5: Admin User Management

1. Login as `admin@farm.com`
2. View admin dashboard
3. Check user statistics
4. Navigate to "Users Management" tab
5. Find a farmer user
6. Click "Block" button
7. Confirm blocking
8. Logout
9. Try to login as blocked farmer
10. Verify login fails with blocked message
11. Login back as admin
12. Activate the user again
13. Verify farmer can login now

### Test 6: Admin Product Management

1. Login as `admin@farm.com`
2. Navigate to "Products Management" tab
3. View all products from all farmers
4. Select a product to delete
5. Click "Delete Product"
6. Confirm deletion
7. Verify product removed
8. Logout and login as farmer
9. Verify product no longer in farmer's list

### Test 7: Role-Based Access Control

1. Login as `farmer@farm.com`
2. Try to access buyer routes directly:
   - `/buyer/dashboard`
   - Verify redirect or access denied
3. Try to access admin routes:
   - `/admin/dashboard`
   - Verify redirect or access denied
4. Logout
5. Login as `buyer@farm.com`
6. Try to access farmer routes:
   - `/farmer/dashboard`
   - Verify redirect or access denied
7. Verify protection works correctly

### Test 8: Image Upload

1. Login as farmer
2. Add product with image:
   - Try small image (<1MB) → Should work
   - Try large image (>5MB) → Should show error
   - Try non-image file → Should show error
3. Verify image displays correctly
4. Edit product and change image
5. Verify old image replaced

### Test 9: Form Validation

**Registration:**
- Try empty fields → Should show required errors
- Try invalid email → Should show format error
- Try password < 6 chars → Should show length error
- Try mismatched passwords → Should show match error

**Product Creation:**
- Try empty required fields → Should show errors
- Try negative price → Should show validation error
- Try negative quantity → Should show validation error

**Inquiry:**
- Try message < 10 chars → Should show length error

### Test 10: Offline Functionality

1. Disconnect from internet
2. Verify application still works:
   - Login
   - Browse products
   - Add products
   - Send inquiries
   - Admin functions
3. All operations should work without internet
4. Images load from local uploads folder

---

## 🔍 Expected Behavior

### Authentication
- ✅ Successful login redirects to role-specific dashboard
- ✅ Invalid credentials show error message
- ✅ Blocked users cannot login
- ✅ Token expires after 7 days
- ✅ Logout clears session

### Authorization
- ✅ Farmers can only edit/delete their own products
- ✅ Buyers can only see their own inquiries
- ✅ Admin can manage all users and products
- ✅ Unauthorized routes redirect to login

### Product Management
- ✅ Images stored in `/uploads` folder
- ✅ Product list updates immediately after changes
- ✅ Deleted products remove associated inquiries
- ✅ Filters work correctly

### Inquiries
- ✅ Buyers can send inquiries
- ✅ Farmers receive all product inquiries
- ✅ Email addresses visible for contact

### Data Integrity
- ✅ Foreign keys maintain referential integrity
- ✅ Cascading deletes work correctly
- ✅ Timestamps auto-populate

---

## 🐛 Known Test Edges

1. **Password in DB:** Sample users have a placeholder hash; real hashing happens on new registrations
2. **Image paths:** Sample products may not have images; add images through UI
3. **Time zones:** Timestamps in UTC; may differ from local time

---

## 📊 Test Results Checklist

After testing, verify:

- [ ] All test users can login
- [ ] Each role has correct permissions
- [ ] Products can be created, read, updated, deleted
- [ ] Images upload and display correctly
- [ ] Inquiries work end-to-end
- [ ] Admin can manage users
- [ ] Search and filters work
- [ ] Form validation prevents bad input
- [ ] Application works offline
- [ ] Role-based access enforced
- [ ] No console errors
- [ ] Responsive design works on mobile

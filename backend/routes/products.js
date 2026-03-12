/**
 * Product Routes
 * /api/products
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate, isFarmer, isAdmin, isFarmerOrAdmin } = require('../middleware/auth');
const {
    getAllProducts,
    getProductById,
    getFarmerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getFeaturedProducts,
    productValidation
} = require('../controllers/productController');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    }
});

// Public routes (buyers can view products)
router.get('/', getAllProducts);
router.get('/categories/list', getCategories);
router.get('/featured/list', getFeaturedProducts);
router.get('/:id', getProductById);

// Farmer routes
router.get('/farmer/my-products', authenticate, isFarmer, getFarmerProducts);
router.post('/', authenticate, isFarmer, upload.single('image'), productValidation, createProduct);
router.put('/:id', authenticate, isFarmerOrAdmin, upload.single('image'), productValidation, updateProduct);
router.delete('/:id', authenticate, isFarmerOrAdmin, deleteProduct);

module.exports = router;

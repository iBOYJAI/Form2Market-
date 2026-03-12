/**
 * Product Controller
 * Handles product CRUD operations
 */

const { body, validationResult } = require('express-validator');
const db = require('../db');
const fs = require('fs').promises;
const path = require('path');

/**
 * Get all products (with optional filters)
 * GET /api/products
 */
const getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, status } = req.query;

        let query = `
      SELECT p.*, u.name as farmer_name, u.email as farmer_email 
      FROM products p 
      JOIN users u ON p.farmer_id = u.id 
      WHERE 1=1
    `;
        const params = [];

        // For non-admin users, only show approved or featured products (and pending for demo)
        if (!req.user || req.user.role !== 'admin') {
            query += ' AND (p.status = ? OR p.status = ? OR p.status = ?)';
            params.push('approved', 'featured', 'pending');
        }

        // Admin can filter by status
        if (status && req.user && req.user.role === 'admin') {
            query += ' AND p.status = ?';
            params.push(status);
        }

        // Apply filters
        if (category) {
            query += ' AND p.category = ?';
            params.push(category);
        }

        if (minPrice) {
            query += ' AND p.price >= ?';
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            query += ' AND p.price <= ?';
            params.push(parseFloat(maxPrice));
        }

        if (search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Show featured products first, and move rejected to the bottom
        query += ` ORDER BY 
            CASE WHEN p.status = 'rejected' THEN 1 ELSE 0 END,
            p.featured DESC, p.created_at DESC`;

        const [products] = await db.query(query, params);

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT p.*, u.name as farmer_name, u.email as farmer_email, u.id as farmer_id
       FROM products p 
       JOIN users u ON p.farmer_id = u.id 
       WHERE p.id = ?`,
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            product: products[0]
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get farmer's products
 * GET /api/products/farmer/my-products
 */
const getFarmerProducts = async (req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get farmer products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Create new product
 * POST /api/products
 */
const createProduct = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, category, price, quantity, description } = req.body;
        const image_path = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await db.query(
            `INSERT INTO products (farmer_id, name, category, price, quantity, description, image_path, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [req.user.id, name, category, parseFloat(price), parseInt(quantity), description, image_path]
        );

        const [newProduct] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully and pending approval',
            product: newProduct[0]
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Update product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        // Check if product exists and belongs to farmer
        const [existing] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership (only for farmers, admin can update any)
        if (req.user.role === 'farmer' && existing[0].farmer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        const { name, category, price, quantity, description } = req.body;
        let image_path = existing[0].image_path;

        // If new image uploaded, delete old one and use new
        if (req.file) {
            if (existing[0].image_path) {
                const oldImagePath = path.join(__dirname, '..', existing[0].image_path);
                try {
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            image_path = `/uploads/${req.file.filename}`;
        }

        await db.query(
            `UPDATE products 
       SET name = ?, category = ?, price = ?, quantity = ?, description = ?, image_path = ?
       WHERE id = ?`,
            [name, category, parseFloat(price), parseInt(quantity), description, image_path, req.params.id]
        );

        const [updated] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            product: updated[0]
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
    try {
        // Check if product exists
        const [existing] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check ownership (only for farmers, admin can delete any)
        if (req.user.role === 'farmer' && existing[0].farmer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        // Delete image file if exists
        if (existing[0].image_path) {
            const imagePath = path.join(__dirname, '..', existing[0].image_path);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.error('Error deleting image:', err);
            }
        }

        // Delete product
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get product categories
 * GET /api/products/categories/list
 */
const getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(
            'SELECT DISTINCT category FROM products WHERE status IN ("approved", "featured") ORDER BY category'
        );

        res.json({
            success: true,
            categories: categories.map(c => c.category)
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get featured products
 * GET /api/products/featured/list
 */
const getFeaturedProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT p.*, u.name as farmer_name 
            FROM products p 
            JOIN users u ON p.farmer_id = u.id 
            WHERE p.featured = TRUE AND p.status = 'featured'
            ORDER BY p.created_at DESC 
            LIMIT 10
        `);

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Validation rules for product creation/update
 */
const productValidation = [
    body('name').trim().notEmpty().withMessage('Product name is required')
        .isLength({ min: 2, max: 200 }).withMessage('Name must be 2-200 characters'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
    body('description').optional().trim()
];

module.exports = {
    getAllProducts,
    getProductById,
    getFarmerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getFeaturedProducts,
    productValidation
};

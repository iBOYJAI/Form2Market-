/**
 * Inquiry Controller
 * Handles buyer inquiries on products
 */

const db = require('../db');
const { body, validationResult } = require('express-validator');
const { createNotification } = require('./notificationController');

/**
 * Create new inquiry (starts a chat)
 */
const createInquiry = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

        const { product_id, message } = req.body;

        const [products] = await db.query('SELECT farmer_id, name FROM products WHERE id = ?', [product_id]);
        if (products.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });

        const farmerId = products[0].farmer_id;
        const productName = products[0].name;

        // Create inquiry container
        const [result] = await db.query(
            'INSERT INTO inquiries (product_id, buyer_id, message) VALUES (?, ?, ?)',
            [product_id, req.user.id, message]
        );
        const inquiryId = result.insertId;

        // OPTIONAL: Also insert into inquiry_messages for chat history consistency
        await db.query(
            'INSERT INTO inquiry_messages (inquiry_id, sender_id, message) VALUES (?, ?, ?)',
            [inquiryId, req.user.id, message]
        );

        // Notify Farmer
        await createNotification(
            farmerId,
            'message',
            'New Product Inquiry',
            `You have a new inquiry about ${productName}.`,
            '/farmer/inquiries' // or specific chat link
        );

        res.status(201).json({ success: true, message: 'Inquiry sent successfully', inquiryId });
    } catch (error) {
        console.error('Create inquiry error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Reply to an inquiry (Chat)
 * POST /api/inquiries/:id/reply
 */
const replyToInquiry = async (req, res) => {
    try {
        const { message } = req.body;
        const inquiryId = req.params.id;

        // Get inquiry details to find participants
        const [inquiry] = await db.query(
            `SELECT i.*, p.farmer_id 
             FROM inquiries i 
             JOIN products p ON i.product_id = p.id 
             WHERE i.id = ?`,
            [inquiryId]
        );

        if (inquiry.length === 0) return res.status(404).json({ success: false, message: 'Inquiry not found' });

        const { buyer_id, farmer_id } = inquiry[0];

        // Determine recipient
        let recipientId;
        if (req.user.id === buyer_id) {
            recipientId = farmer_id;
        } else if (req.user.id === farmer_id) {
            recipientId = buyer_id;
        } else {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Save message
        await db.query(
            'INSERT INTO inquiry_messages (inquiry_id, sender_id, message) VALUES (?, ?, ?)',
            [inquiryId, req.user.id, message]
        );

        // Notify recipient
        await createNotification(
            recipientId,
            'message',
            'New Message',
            `You have a new message from ${req.user.name}.`,
            req.user.role === 'farmer' ? `/buyer/inquiries` : `/farmer/inquiries`
        );

        res.json({ success: true, message: 'Reply sent' });
    } catch (error) {
        console.error('Reply error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Get chat history for an inquiry
 * GET /api/inquiries/:id/messages
 */
const getInquiryMessages = async (req, res) => {
    try {
        const [messages] = await db.query(
            `SELECT m.*, u.name as sender_name 
             FROM inquiry_messages m 
             JOIN users u ON m.sender_id = u.id 
             WHERE m.inquiry_id = ? 
             ORDER BY m.created_at ASC`,
            [req.params.id]
        );

        res.json({ success: true, messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ... keep existing getter functions (getFarmerInquiries, getBuyerInquiries, etc.) but export new ones ...

const getFarmerInquiries = async (req, res) => {
    try {
        const [inquiries] = await db.query(
            `SELECT i.*, p.name as product_name, u.name as buyer_name, u.email as buyer_email
       FROM inquiries i
       JOIN products p ON i.product_id = p.id
       JOIN users u ON i.buyer_id = u.id
       WHERE p.farmer_id = ?
       ORDER BY i.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: inquiries.length,
            inquiries
        });
    } catch (error) {
        console.error('Get farmer inquiries error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get buyer's inquiries
 * GET /api/inquiries/buyer
 */
const getBuyerInquiries = async (req, res) => {
    try {
        const [inquiries] = await db.query(
            `SELECT i.*, p.name as product_name, p.farmer_id, u.name as farmer_name, u.email as farmer_email
       FROM inquiries i
       JOIN products p ON i.product_id = p.id
       JOIN users u ON p.farmer_id = u.id
       WHERE i.buyer_id = ?
       ORDER BY i.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            count: inquiries.length,
            inquiries
        });
    } catch (error) {
        console.error('Get buyer inquiries error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get inquiries for a specific product
 * GET /api/inquiries/product/:productId
 */
const getProductInquiries = async (req, res) => {
    try {
        // Check if product exists and belongs to farmer
        const [products] = await db.query(
            'SELECT farmer_id FROM products WHERE id = ?',
            [req.params.productId]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Only farmer who owns the product can see inquiries
        if (products[0].farmer_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these inquiries'
            });
        }

        const [inquiries] = await db.query(
            `SELECT i.*, u.name as buyer_name, u.email as buyer_email
       FROM inquiries i
       JOIN users u ON i.buyer_id = u.id
       WHERE i.product_id = ?
       ORDER BY i.created_at DESC`,
            [req.params.productId]
        );

        res.json({
            success: true,
            count: inquiries.length,
            inquiries
        });
    } catch (error) {
        console.error('Get product inquiries error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Delete inquiry (Admin only)
 * DELETE /api/inquiries/:id
 */
const deleteInquiry = async (req, res) => {
    try {
        // Check if inquiry exists
        const [inquiries] = await db.query(
            'SELECT id FROM inquiries WHERE id = ?',
            [req.params.id]
        );

        if (inquiries.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        await db.query('DELETE FROM inquiries WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Inquiry deleted successfully'
        });
    } catch (error) {
        console.error('Delete inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Validation rules for inquiry creation
 */
const inquiryValidation = [
    body('product_id').isInt().withMessage('Valid product ID is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters')
];

module.exports = {
    createInquiry,
    getFarmerInquiries,
    getBuyerInquiries,
    getProductInquiries,
    deleteInquiry,
    replyToInquiry,
    getInquiryMessages,
    inquiryValidation
};

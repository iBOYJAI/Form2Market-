/**
 * Inquiry Routes
 * /api/inquiries
 */

const express = require('express');
const router = express.Router();
const { authenticate, isBuyer, isFarmer, isAdmin } = require('../middleware/auth');
const {
    createInquiry,
    getFarmerInquiries,
    getBuyerInquiries,
    getProductInquiries,
    deleteInquiry,
    inquiryValidation,
    replyToInquiry,
    getInquiryMessages
} = require('../controllers/inquiryController');

// Protected routes
router.post('/', authenticate, isBuyer, inquiryValidation, createInquiry);
router.get('/farmer', authenticate, isFarmer, getFarmerInquiries);
router.get('/buyer', authenticate, isBuyer, getBuyerInquiries);
router.get('/product/:productId', authenticate, isFarmer, getProductInquiries);
router.delete('/:id', authenticate, isAdmin, deleteInquiry);

// Chat endpoints
router.post('/:id/reply', authenticate, replyToInquiry);
router.get('/:id/messages', authenticate, getInquiryMessages);

module.exports = router;

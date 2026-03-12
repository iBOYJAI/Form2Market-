/**
 * Contact Routes
 * /api/contact
 */

const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const {
    submitContactMessage,
    getAllMessages,
    archiveMessage,
    restoreMessage,
    deleteMessage
} = require('../controllers/contactController');

// Public route: Submit a message
router.post('/', submitContactMessage);

// Protected route: Get all messages (Admin only)
router.get('/', authenticate, isAdmin, getAllMessages);

// Protected route: Archive message (Admin only)
router.put('/:id/archive', authenticate, isAdmin, archiveMessage);

// Protected route: Restore message (Admin only)
router.put('/:id/restore', authenticate, isAdmin, restoreMessage);

// Protected route: Delete message (Admin only)
router.delete('/:id', authenticate, isAdmin, deleteMessage);

module.exports = router;

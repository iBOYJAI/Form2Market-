/**
 * Admin Routes
 * Protected routes for admin-only operations
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

// Settings routes
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

// Banner and Announcement routes are now handled by siteContent.js
// Old routes removed to prevent conflicts

// Product management routes
router.put('/products/:id/approve', adminController.approveProduct);
router.put('/products/:id/reject', adminController.rejectProduct);
router.put('/products/:id/featured', adminController.toggleFeatured);

// Statistics route
router.get('/statistics', adminController.getStatistics);

module.exports = router;

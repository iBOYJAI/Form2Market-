/**
 * Profile Routes
 * User profile management routes
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Profile routes
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

// Address routes (for buyers)
router.get('/addresses', profileController.getAddresses);
router.post('/addresses', profileController.addAddress);
router.put('/addresses/:id', profileController.updateAddress);
router.delete('/addresses/:id', profileController.deleteAddress);

// Delivery routes (for transporters)
router.get('/deliveries', profileController.getDeliveryAssignments);
router.put('/deliveries/:id', profileController.updateDeliveryStatus);

module.exports = router;

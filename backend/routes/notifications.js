const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate); // All notification routes require auth

router.get('/', notificationController.getMyNotifications);
router.put('/:id/read', notificationController.markRead);
router.put('/read-all', notificationController.markAllRead);

module.exports = router;

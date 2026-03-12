const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Post a new job (Farmer/Buyer)
router.post('/jobs', logisticsController.createJob);

// Get my jobs (Requester see theirs, Transporter see assigned)
router.get('/my-jobs', logisticsController.getMyJobs);

// Transporter only routes
router.get('/jobs/open', authorize('transporter'), logisticsController.getOpenJobs);
router.put('/jobs/:id/accept', authorize('transporter'), logisticsController.acceptJob);

module.exports = router;

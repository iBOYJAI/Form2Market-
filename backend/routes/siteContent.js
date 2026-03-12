const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const siteContentController = require('../controllers/siteContentController');

// Public Routes
router.get('/banners/public', siteContentController.getPublicBanners);
router.get('/announcements/public', siteContentController.getPublicAnnouncements);

// Admin Routes (Protected)
// Admin Routes (Protected)
router.get('/banners', authenticate, authorize('admin'), siteContentController.getBanners);
router.post('/banners', authenticate, authorize('admin'), siteContentController.createBanner);
router.put('/banners/:id', authenticate, authorize('admin'), siteContentController.updateBanner);
router.delete('/banners/:id', authenticate, authorize('admin'), siteContentController.deleteBanner);

router.get('/announcements', authenticate, authorize('admin'), siteContentController.getAnnouncements);
router.post('/announcements', authenticate, authorize('admin'), siteContentController.createAnnouncement);
router.put('/announcements/:id', authenticate, authorize('admin'), siteContentController.updateAnnouncement);
router.delete('/announcements/:id', authenticate, authorize('admin'), siteContentController.deleteAnnouncement);

module.exports = router;

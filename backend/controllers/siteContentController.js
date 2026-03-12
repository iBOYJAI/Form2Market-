/**
 * Site Content Controller
 * Handles banners and announcements
 */

const db = require('../db');

/**
 * Get all banners (Admin view - includes active/inactive)
 */
const getBanners = async (req, res) => {
    try {
        const [banners] = await db.query('SELECT * FROM site_banners ORDER BY display_order ASC, created_at DESC');
        res.json({ success: true, banners });
    } catch (error) {
        console.error('Get banners error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch banners' });
    }
};

/**
 * Get public active banners
 */
const getPublicBanners = async (req, res) => {
    try {
        const [banners] = await db.query(
            'SELECT * FROM site_banners WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC'
        );
        res.json({ success: true, banners });
    } catch (error) {
        console.error('Get public banners error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch banners' });
    }
};

/**
 * Create a banner
 */
const createBanner = async (req, res) => {
    try {
        const { title, subtitle, image_path, link_url, display_order, is_active } = req.body;

        const [result] = await db.query(
            `INSERT INTO site_banners (title, subtitle, image_path, link_url, display_order, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, subtitle, image_path, link_url, display_order, is_active]
        );

        res.status(201).json({
            success: true,
            message: 'Banner created',
            bannerId: result.insertId
        });
    } catch (error) {
        console.error('Create banner error:', error);
        res.status(500).json({ success: false, message: 'Failed to create banner' });
    }
};

/**
 * Update a banner
 */
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, image_path, link_url, display_order, is_active } = req.body;

        await db.query(
            `UPDATE site_banners 
             SET title=?, subtitle=?, image_path=?, link_url=?, display_order=?, is_active=?
             WHERE id=?`,
            [title, subtitle, image_path, link_url, display_order, is_active, id]
        );

        res.json({ success: true, message: 'Banner updated' });
    } catch (error) {
        console.error('Update banner error:', error);
        res.status(500).json({ success: false, message: 'Failed to update banner' });
    }
};

/**
 * Delete a banner
 */
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM site_banners WHERE id=?', [id]);
        res.json({ success: true, message: 'Banner deleted' });
    } catch (error) {
        console.error('Delete banner error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete banner' });
    }
};

/**
 * Get all announcements (Admin view)
 */
const getAnnouncements = async (req, res) => {
    try {
        const [announcements] = await db.query('SELECT * FROM site_announcements ORDER BY created_at DESC');
        res.json({ success: true, announcements });
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
    }
};

/**
 * Get public active announcements
 */
const getPublicAnnouncements = async (req, res) => {
    try {
        const [announcements] = await db.query(
            'SELECT * FROM site_announcements WHERE show_on_homepage = 1 ORDER BY created_at DESC'
        );
        res.json({ success: true, announcements });
    } catch (error) {
        console.error('Get public announcements error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
    }
};

/**
 * Create an announcement
 */
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type, show_on_homepage } = req.body;

        const [result] = await db.query(
            `INSERT INTO site_announcements (title, content, type, show_on_homepage) 
             VALUES (?, ?, ?, ?)`,
            [title, content, type, show_on_homepage]
        );

        res.status(201).json({
            success: true,
            message: 'Announcement created',
            announcementId: result.insertId
        });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ success: false, message: 'Failed to create announcement' });
    }
};

/**
 * Update an announcement
 */
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type, show_on_homepage } = req.body;

        await db.query(
            `UPDATE site_announcements 
             SET title=?, content=?, type=?, show_on_homepage=?
             WHERE id=?`,
            [title, content, type, show_on_homepage, id]
        );

        res.json({ success: true, message: 'Announcement updated' });
    } catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({ success: false, message: 'Failed to update announcement' });
    }
};

/**
 * Delete an announcement
 */
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM site_announcements WHERE id=?', [id]);
        res.json({ success: true, message: 'Announcement deleted' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete announcement' });
    }
};

module.exports = {
    getBanners,
    getPublicBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    getAnnouncements,
    getPublicAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};

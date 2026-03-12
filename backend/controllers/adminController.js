/**
 * Admin Controller
 * Handles admin-specific operations
 */

const db = require('../db');

// Get platform settings
const getSettings = async (req, res) => {
    try {
        const [settings] = await db.query('SELECT * FROM site_settings');

        // Convert to object format
        const settingsObj = {};
        settings.forEach(setting => {
            let value = setting.setting_value;

            // Parse based on type
            if (setting.setting_type === 'number') {
                value = parseFloat(value);
            } else if (setting.setting_type === 'boolean') {
                value = value === 'true';
            } else if (setting.setting_type === 'json') {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    console.error('Failed to parse JSON setting:', setting.setting_key);
                }
            }

            settingsObj[setting.setting_key] = value;
        });

        res.json({ success: true, settings: settingsObj });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings' });
    }
};

// Update platform settings
const updateSettings = async (req, res) => {
    try {
        const settings = req.body;

        // Update each setting
        for (const [key, value] of Object.entries(settings)) {
            let stringValue = String(value);
            let type = 'string';

            if (typeof value === 'number') {
                type = 'number';
            } else if (typeof value === 'boolean') {
                type = 'boolean';
            } else if (typeof value === 'object') {
                type = 'json';
                stringValue = JSON.stringify(value);
            }

            await db.query(
                `INSERT INTO site_settings (setting_key, setting_value, setting_type) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE setting_value = ?, setting_type = ?`,
                [key, stringValue, type, stringValue, type]
            );
        }

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, message: 'Failed to update settings' });
    }
};

// Get all banners
const getBanners = async (req, res) => {
    try {
        const [banners] = await db.query(
            'SELECT * FROM homepage_banners ORDER BY display_order ASC'
        );
        res.json({ success: true, banners });
    } catch (error) {
        console.error('Get banners error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch banners' });
    }
};

// Create banner
const createBanner = async (req, res) => {
    try {
        const { title, subtitle, image_path, link_url, display_order, is_active } = req.body;

        const [result] = await db.query(
            `INSERT INTO homepage_banners (title, subtitle, image_path, link_url, display_order, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, subtitle || null, image_path, link_url || null, display_order || 0, is_active !== false]
        );

        res.json({ success: true, message: 'Banner created successfully', bannerId: result.insertId });
    } catch (error) {
        console.error('Create banner error:', error);
        res.status(500).json({ success: false, message: 'Failed to create banner' });
    }
};

// Update banner
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, image_path, link_url, display_order, is_active } = req.body;

        await db.query(
            `UPDATE homepage_banners 
             SET title = ?, subtitle = ?, image_path = ?, link_url = ?, display_order = ?, is_active = ?
             WHERE id = ?`,
            [title, subtitle || null, image_path, link_url || null, display_order || 0, is_active !== false, id]
        );

        res.json({ success: true, message: 'Banner updated successfully' });
    } catch (error) {
        console.error('Update banner error:', error);
        res.status(500).json({ success: false, message: 'Failed to update banner' });
    }
};

// Delete banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM homepage_banners WHERE id = ?', [id]);

        res.json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('Delete banner error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete banner' });
    }
};

// Get all announcements
const getAnnouncements = async (req, res) => {
    try {
        const [announcements] = await db.query(
            `SELECT a.*, u.name as creator_name 
             FROM announcements a 
             LEFT JOIN users u ON a.created_by = u.id 
             ORDER BY a.created_at DESC`
        );
        res.json({ success: true, announcements });
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
    }
};

// Create announcement
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type, show_on_homepage, expires_at } = req.body;
        const userId = req.user.id;

        const [result] = await db.query(
            `INSERT INTO announcements (title, content, type, show_on_homepage, created_by, expires_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, content, type || 'info', show_on_homepage !== false, userId, expires_at || null]
        );

        res.json({ success: true, message: 'Announcement created successfully', announcementId: result.insertId });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ success: false, message: 'Failed to create announcement' });
    }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type, is_active, show_on_homepage, expires_at } = req.body;

        await db.query(
            `UPDATE announcements 
             SET title = ?, content = ?, type = ?, is_active = ?, show_on_homepage = ?, expires_at = ?
             WHERE id = ?`,
            [title, content, type || 'info', is_active !== false, show_on_homepage !== false, expires_at || null, id]
        );

        res.json({ success: true, message: 'Announcement updated successfully' });
    } catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({ success: false, message: 'Failed to update announcement' });
    }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('DELETE FROM announcements WHERE id = ?', [id]);

        res.json({ success: true, message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete announcement' });
    }
};

// Approve product
const approveProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query('UPDATE products SET status = ? WHERE id = ?', ['approved', id]);

        res.json({ success: true, message: 'Product approved successfully' });
    } catch (error) {
        console.error('Approve product error:', error);
        res.status(500).json({ success: false, message: 'Failed to approve product' });
    }
};

// Reject product
const rejectProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        await db.query('UPDATE products SET status = ? WHERE id = ?', ['rejected', id]);

        // TODO: Send notification to farmer with rejection reason

        res.json({ success: true, message: 'Product rejected successfully' });
    } catch (error) {
        console.error('Reject product error:', error);
        res.status(500).json({ success: false, message: 'Failed to reject product' });
    }
};

// Toggle featured status
const toggleFeatured = async (req, res) => {
    try {
        const { id } = req.params;

        // Get current status
        const [products] = await db.query('SELECT featured FROM products WHERE id = ?', [id]);
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const newStatus = !products[0].featured;
        await db.query('UPDATE products SET featured = ?, status = ? WHERE id = ?', [newStatus, newStatus ? 'featured' : 'approved', id]);

        res.json({ success: true, message: `Product ${newStatus ? 'featured' : 'unfeatured'} successfully`, featured: newStatus });
    } catch (error) {
        console.error('Toggle featured error:', error);
        res.status(500).json({ success: false, message: 'Failed to update featured status' });
    }
};

// Get dashboard statistics
const getStatistics = async (req, res) => {
    try {
        const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
        const [totalProducts] = await db.query('SELECT COUNT(*) as count FROM products');
        const [pendingProducts] = await db.query('SELECT COUNT(*) as count FROM products WHERE status = ?', ['pending']);
        const [totalInquiries] = await db.query('SELECT COUNT(*) as count FROM inquiries');

        const [usersByRole] = await db.query(`
            SELECT role, COUNT(*) as count 
            FROM users 
            GROUP BY role
        `);

        const [productsByStatus] = await db.query(`
            SELECT status, COUNT(*) as count 
            FROM products 
            GROUP BY status
        `);

        res.json({
            success: true,
            statistics: {
                totalUsers: totalUsers[0].count,
                totalProducts: totalProducts[0].count,
                pendingProducts: pendingProducts[0].count,
                totalInquiries: totalInquiries[0].count,
                usersByRole,
                productsByStatus
            }
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    approveProduct,
    rejectProduct,
    toggleFeatured,
    getStatistics
};

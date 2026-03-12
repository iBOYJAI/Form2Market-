/**
 * Notification Controller
 * Handles user notifications
 */

const db = require('../db');

/**
 * Get user's notifications
 * GET /api/notifications
 */
const getMyNotifications = async (req, res) => {
    try {
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [req.user.id]
        );

        const [unreadCount] = await db.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
            [req.user.id]
        );

        res.json({
            success: true,
            notifications,
            unreadCount: unreadCount[0].count
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
const markRead = async (req, res) => {
    try {
        await db.query(
            'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Mark all notifications as read
 * PUT /api/notifications/read-all
 */
const markAllRead = async (req, res) => {
    try {
        await db.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [req.user.id]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Internal helper to create notification
 */
const createNotification = async (userId, type, title, message, link) => {
    try {
        await db.query(
            'INSERT INTO notifications (user_id, type, title, message, link) VALUES (?, ?, ?, ?, ?)',
            [userId, type, title, message, link]
        );
    } catch (error) {
        console.error('Create notification error:', error);
    }
};

module.exports = {
    getMyNotifications,
    markRead,
    markAllRead,
    createNotification
};

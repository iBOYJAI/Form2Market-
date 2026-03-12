/**
 * User Controller
 * Admin operations for user management
 */

const db = require('../db');

/**
 * Get all users (Admin only)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
    try {
        const { role, status } = req.query;

        let query = 'SELECT id, name, email, role, status, created_at FROM users WHERE 1=1';
        const params = [];

        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const [users] = await db.query(query, params);

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get user by ID (Admin only)
 * GET /api/users/:id
 */
const getUserById = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Update user status (Admin only)
 * PUT /api/users/:id/status
 */
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be active or blocked.'
            });
        }

        // Check if user exists
        const [users] = await db.query(
            'SELECT id FROM users WHERE id = ?',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from blocking themselves
        if (req.user.id === parseInt(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot change your own status'
            });
        }

        // Update status
        await db.query(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        const [updated] = await db.query(
            'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: `User ${status === 'blocked' ? 'blocked' : 'activated'} successfully`,
            user: updated[0]
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
    try {
        // Check if user exists
        const [users] = await db.query(
            'SELECT id FROM users WHERE id = ?',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (req.user.id === parseInt(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Delete user (cascade will delete related products and inquiries)
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get user statistics (Admin only)
 * GET /api/users/stats/summary
 */
const getUserStats = async (req, res) => {
    try {
        const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(CASE WHEN role = 'farmer' THEN 1 ELSE 0 END) as total_farmers,
        SUM(CASE WHEN role = 'buyer' THEN 1 ELSE 0 END) as total_buyers,
        SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as total_admins,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
        SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked_users
      FROM users
    `);

        res.json({
            success: true,
            stats: stats[0]
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    deleteUser,
    getUserStats
};

/**
 * Profile Controller
 * Handles user profile operations
 */

const db = require('../db');
const path = require('path');

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await db.query(
            'SELECT id, name, email, phone, role, profile_picture, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = users[0];

        // Get role-specific data
        if (user.role === 'buyer') {
            const [addresses] = await db.query(
                'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
                [userId]
            );
            user.addresses = addresses;
        }

        res.json({ success: true, profile: user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, profile_picture } = req.body;

        // Check if email is already taken by another user
        if (email) {
            const [existing] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, userId]
            );

            if (existing.length > 0) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        await db.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, profile_picture = ? WHERE id = ?',
            [name, email, phone || null, profile_picture || null, userId]
        );

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

// Get user addresses (buyers)
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;

        const [addresses] = await db.query(
            'SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
            [userId]
        );

        res.json({ success: true, addresses });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
    }
};

// Add address
const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address_type, address_line1, address_line2, city, state, pincode, phone, is_default } = req.body;

        // If this is the default address, unset other defaults
        if (is_default) {
            await db.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
        }

        const [result] = await db.query(
            `INSERT INTO user_addresses (user_id, address_type, address_line1, address_line2, city, state, pincode, phone, is_default) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, address_type || 'home', address_line1, address_line2 || null, city, state, pincode, phone || null, is_default || false]
        );

        res.json({ success: true, message: 'Address added successfully', addressId: result.insertId });
    } catch (error) {
        console.error('Add address error:', error);
        res.status(500).json({ success: false, message: 'Failed to add address' });
    }
};

// Update address
const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { address_type, address_line1, address_line2, city, state, pincode, phone, is_default } = req.body;

        // Verify address belongs to user
        const [existing] = await db.query(
            'SELECT id FROM user_addresses WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // If this is the default address, unset other defaults
        if (is_default) {
            await db.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND id != ?', [userId, id]);
        }

        await db.query(
            `UPDATE user_addresses 
             SET address_type = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, pincode = ?, phone = ?, is_default = ?
             WHERE id = ? AND user_id = ?`,
            [address_type || 'home', address_line1, address_line2 || null, city, state, pincode, phone || null, is_default || false, id, userId]
        );

        res.json({ success: true, message: 'Address updated successfully' });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ success: false, message: 'Failed to update address' });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await db.query('DELETE FROM user_addresses WHERE id = ? AND user_id = ?', [id, userId]);

        res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete address' });
    }
};

// Get delivery assignments (transporters)
const getDeliveryAssignments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        let query = `
            SELECT da.* 
            FROM delivery_assignments da
            WHERE da.transporter_id = ?
        `;

        const params = [userId];

        if (status) {
            query += ' AND da.status = ?';
            params.push(status);
        }

        query += ' ORDER BY da.assigned_at DESC';

        const [assignments] = await db.query(query, params);

        res.json({ success: true, assignments });
    } catch (error) {
        console.error('Get delivery assignments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch delivery assignments' });
    }
};

// Update delivery status
const updateDeliveryStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status, notes } = req.body;

        // Verify assignment belongs to transporter
        const [existing] = await db.query(
            'SELECT id FROM delivery_assignments WHERE id = ? AND transporter_id = ?',
            [id, userId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Delivery assignment not found' });
        }

        let updateQuery = 'UPDATE delivery_assignments SET status = ?, notes = ?';
        const params = [status, notes || null];

        // Update timestamps based on status
        if (status === 'picked_up') {
            updateQuery += ', picked_up_at = NOW()';
        } else if (status === 'delivered') {
            updateQuery += ', delivered_at = NOW()';
        }

        updateQuery += ' WHERE id = ? AND transporter_id = ?';
        params.push(id, userId);

        await db.query(updateQuery, params);

        res.json({ success: true, message: 'Delivery status updated successfully' });
    } catch (error) {
        console.error('Update delivery status error:', error);
        res.status(500).json({ success: false, message: 'Failed to update delivery status' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getDeliveryAssignments,
    updateDeliveryStatus
};

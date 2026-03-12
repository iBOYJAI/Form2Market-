const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const db = require('../db');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user role/status
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { role, status } = req.body;
        await db.query('UPDATE users SET role = ?, status = ? WHERE id = ?', [role, status, req.params.id]);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new user (Optional, for admin convenience)
router.post('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

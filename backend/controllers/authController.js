/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

/**
 * Register new user (Farmer or Buyer)
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password, role } = req.body;

        // Validate role
        if (!['farmer', 'buyer'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be farmer or buyer.'
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        // Check if registration is enabled
        const [settings] = await db.query(
            "SELECT setting_value FROM site_settings WHERE setting_key = 'enable_registration'"
        );

        if (settings.length > 0 && settings[0].setting_value === 'false') {
            return res.status(403).json({
                success: false,
                message: 'Registration is currently disabled.'
            });
        }

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, 'active']
        );

        // Generate token
        const user = {
            id: result.insertId,
            name,
            email,
            role,
            status: 'active'
        };

        const token = generateToken(user);

        // Check for Admin Notifications
        const [adminSettings] = await db.query(
            "SELECT setting_value FROM site_settings WHERE setting_key = 'admin_notifications'"
        );

        if (adminSettings.length > 0 && adminSettings[0].setting_value === 'true') {
            console.log(`[MOCK EMAIL] To: Admin <support@form2market.com>`);
            console.log(`[MOCK EMAIL] Subject: New User Registration`);
            console.log(`[MOCK EMAIL] Body: A new user ${name} (${email}) has registered as ${role}.`);
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Check if user is blocked
        if (user.status === 'blocked') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been blocked. Please contact admin.'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
            [req.user.id]
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
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Validation rules for registration
 */
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').notEmpty().withMessage('Role is required')
];

/**
 * Validation rules for login
 */
const loginValidation = [
    body('email').trim().isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
    register,
    login,
    getCurrentUser,
    registerValidation,
    loginValidation
};

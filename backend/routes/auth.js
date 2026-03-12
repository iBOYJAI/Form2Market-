/**
 * Authentication Routes
 * /api/auth
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
    register,
    login,
    getCurrentUser,
    registerValidation,
    loginValidation
} = require('../controllers/authController');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

module.exports = router;

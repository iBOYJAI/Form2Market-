/**
 * Form2Market Backend Server
 * Express.js API server for offline farmer-to-buyer marketplace
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Force restart for DB changes

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const inquiryRoutes = require('./routes/inquiries');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const settingsRoutes = require('./routes/settings');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/content', require('./routes/siteContent')); // Add site content routes
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/logistics', require('./routes/logistics'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Form2Market API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Form2Market API Server',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            users: '/api/users',
            inquiries: '/api/inquiries',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message
        });
    }

    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('===========================================');
    console.log('🚀 Form2Market Backend Server Started');
    console.log('===========================================');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
    console.log('===========================================');
    console.log('💡 Make sure XAMPP MySQL is running!');
    console.log('===========================================');
});

module.exports = app;

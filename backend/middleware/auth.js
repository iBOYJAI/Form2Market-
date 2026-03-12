/**
 * Authentication Middleware
 * JWT verification and role-based access control
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from Authorization header
 */
const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

/**
 * Check if user has required role
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

/**
 * Check if user is farmer
 */
const isFarmer = authorize('farmer');

/**
 * Check if user is buyer
 */
const isBuyer = authorize('buyer');

/**
 * Check if user is admin
 */
const isAdmin = authorize('admin');

/**
 * Check if user is farmer or admin
 */
const isFarmerOrAdmin = authorize('farmer', 'admin');

/**
 * Check if user is transporter
 */
const isTransporter = authorize('transporter');

module.exports = {
    authenticate,
    authorize,
    isFarmer,
    isBuyer,
    isAdmin,
    isTransporter,
    isFarmerOrAdmin
};

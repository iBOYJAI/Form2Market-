-- Schema Updates for Form2Market Application
-- Run this script to add new tables and columns for enhanced functionality

-- Add profile picture to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255) DEFAULT NULL;

-- Add status column to products table for approval workflow
ALTER TABLE products ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected', 'featured') DEFAULT 'pending';
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
    ('platform_fee', '5', 'number'),
    ('support_email', 'support@form2market.com', 'string'),
    ('enable_registration', 'true', 'boolean'),
    ('maintenance_mode', 'false', 'boolean'),
    ('site_name', 'Form2Market', 'string'),
    ('admin_notifications', 'true', 'boolean')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- Create homepage_banners table
CREATE TABLE IF NOT EXISTS homepage_banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image_path VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default banners
INSERT INTO homepage_banners (title, subtitle, image_path, display_order, is_active) VALUES
    ('Welcome to Form2Market', 'Connecting Farmers Directly to Buyers', '/images/banner-welcome.jpg', 1, TRUE),
    ('Fresh Produce Daily', 'Quality vegetables and fruits from local farms', '/images/banner-produce.jpg', 2, TRUE)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('info', 'warning', 'success', 'danger') DEFAULT 'info',
    is_active BOOLEAN DEFAULT TRUE,
    show_on_homepage BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create delivery_assignments table
CREATE TABLE IF NOT EXISTS delivery_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    transporter_id INT NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    status ENUM('assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled') DEFAULT 'assigned',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    picked_up_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (transporter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_addresses table for buyers
CREATE TABLE IF NOT EXISTS user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_type ENUM('home', 'work', 'other') DEFAULT 'home',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(15),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_banners_active ON homepage_banners(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_delivery_status ON delivery_assignments(status);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user ON user_addresses(user_id);

-- Update existing products to approved status (for migration)
UPDATE products SET status = 'approved' WHERE status IS NULL OR status = '';

SELECT 'Schema updates completed successfully!' AS message;

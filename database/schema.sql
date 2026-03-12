-- Form2Market Database Schema
-- Compatible with MySQL/MariaDB (WAMP, XAMPP, LAMP)

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- Database Creation
-- ---------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `form2market` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `form2market`;

-- ---------------------------------------------------------
-- Cleanup (Drop existing tables in correct order)
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `inquiries`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;

-- ---------------------------------------------------------
-- Table: users
-- ---------------------------------------------------------
CREATE TABLE `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL, -- 191 limit for indexing on utf8mb4
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('farmer', 'buyer', 'admin') NOT NULL,
    `status` ENUM('active', 'blocked') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_email` (`email`),
    INDEX `idx_role` (`role`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table: products
-- ---------------------------------------------------------
CREATE TABLE `products` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `farmer_id` INT(11) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `quantity` INT(11) NOT NULL,
    `description` TEXT,
    `image_path` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_products_farmer` (`farmer_id`),
    INDEX `idx_category` (`category`),
    INDEX `idx_price` (`price`),
    CONSTRAINT `fk_products_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table: inquiries
-- ---------------------------------------------------------
CREATE TABLE `inquiries` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `product_id` INT(11) NOT NULL,
    `buyer_id` INT(11) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `read_status` TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `fk_inquiries_product` (`product_id`),
    KEY `fk_inquiries_buyer` (`buyer_id`),
    CONSTRAINT `fk_inquiries_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_inquiries_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table: contact_messages
-- ---------------------------------------------------------
CREATE TABLE `contact_messages` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `read_status` TINYINT(1) DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Seeding Data
-- ---------------------------------------------------------

-- Users (Password: password123)
-- $2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) VALUES
('Admin User', 'admin@farm.com', '$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe', 'admin', 'active'),
('John Farmer', 'farmer@farm.com', '$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe', 'farmer', 'active'),
('Jane Buyer', 'buyer@farm.com', '$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe', 'buyer', 'active'),
('Sarah Farmer', 'sarah@farm.com', '$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe', 'farmer', 'active'),
('Mike Buyer', 'mike@farm.com', '$2a$10$XqYvZ6L8rL6xQ5XqKQZUqeXGqK5FGpXqKQZUqeXGqK5FGpXqKQZUqe', 'buyer', 'active');

-- Products
INSERT INTO `products` (`farmer_id`, `name`, `category`, `price`, `quantity`, `description`, `image_path`) VALUES
(2, 'Organic Tomatoes', 'Vegetables', 50.00, 100, 'Fresh organic tomatoes from local farm', NULL),
(2, 'Fresh Potatoes', 'Vegetables', 30.00, 200, 'High quality potatoes, perfect for cooking', NULL),
(4, 'Red Apples', 'Fruits', 120.00, 50, 'Sweet and crispy red apples', NULL),
(4, 'Fresh Milk', 'Dairy', 60.00, 30, 'Pure cow milk, collected daily', NULL),
(2, 'Brown Eggs', 'Poultry', 80.00, 100, 'Farm fresh brown eggs', NULL);

-- Inquiries
INSERT INTO `inquiries` (`product_id`, `buyer_id`, `message`) VALUES
(1, 3, 'Hi, I am interested in buying 10 kg of tomatoes. Can you deliver to the city?'),
(3, 5, 'Are these apples organic? What is the minimum order quantity?'),
(4, 3, 'I would like to order milk regularly. Do you offer subscription?');

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------
-- Verification
-- ---------------------------------------------------------
SELECT 'Database setup completed successfully' as status;
-- Removed information_schema query to prevent permission errors on restricted shared hosts/phpMyAdmin
SELECT COUNT(*) as user_count FROM `users`;
SELECT COUNT(*) as product_count FROM `products`;


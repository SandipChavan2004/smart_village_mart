-- Product Availability Notifications Migration
-- Creates tables for notification system

-- Create product_notifications table
-- Tracks customer subscriptions to product availability
CREATE TABLE IF NOT EXISTS product_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notified BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMP NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_subscription (customer_id, product_id),
  INDEX idx_product (product_id, notified)
);

-- Create notifications table
-- Stores all notifications for users (customers and shopkeepers)
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  user_role ENUM('customer', 'shopkeeper') NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id, user_role),
  INDEX idx_unread (user_id, is_read),
  INDEX idx_created (created_at DESC)
);

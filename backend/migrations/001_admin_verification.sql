-- ============================================
-- Admin Verification System - Database Setup
-- ============================================

-- Step 1: Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Update shopkeepers table with verification fields
-- Check if columns exist before adding them
SET @dbname = DATABASE();
SET @tablename = 'shopkeepers';

-- Add verification_status column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'verification_status');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE shopkeepers ADD COLUMN verification_status ENUM(''pending'', ''approved'', ''rejected'') DEFAULT ''pending'' AFTER category', 
  'SELECT ''Column verification_status already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add verified_by column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'verified_by');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE shopkeepers ADD COLUMN verified_by INT NULL AFTER verification_status', 
  'SELECT ''Column verified_by already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add verified_at column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'verified_at');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE shopkeepers ADD COLUMN verified_at TIMESTAMP NULL AFTER verified_by', 
  'SELECT ''Column verified_at already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add rejection_reason column
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'rejection_reason');
SET @sql = IF(@col_exists = 0, 
  'ALTER TABLE shopkeepers ADD COLUMN rejection_reason TEXT NULL AFTER verified_at', 
  'SELECT ''Column rejection_reason already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for better query performance
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_verification_status');
SET @sql = IF(@index_exists = 0, 
  'ALTER TABLE shopkeepers ADD INDEX idx_verification_status (verification_status)', 
  'SELECT ''Index idx_verification_status already exists'' AS message');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Create initial admin account
-- Email: admin@smartvillagemart.com
-- Password: admin123 (you should change this after first login)
INSERT INTO admins (name, email, password) 
VALUES (
  'System Admin', 
  'admin@smartvillagemart.com', 
  '$2b$10$tcDiM9pVOvPYHbdfXL/3TONvsY.sOYYgZp.xB2jVFc6BRD3rjCQl56'
)
ON DUPLICATE KEY UPDATE name='System Admin';

-- Step 4: Set existing shopkeepers to 'approved' (for existing data)
-- This ensures existing shopkeepers can continue operating
UPDATE shopkeepers 
SET verification_status = 'approved', 
    verified_at = CURRENT_TIMESTAMP 
WHERE verification_status = 'pending';

-- Display results
SELECT 'Migration completed successfully!' AS status;
SELECT COUNT(*) as admin_count FROM admins;
SELECT verification_status, COUNT(*) as count FROM shopkeepers GROUP BY verification_status;

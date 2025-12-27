-- Fix admin password
-- This script updates the admin password to 'admin123'

-- First, let's check if admin exists
SELECT id, email FROM admins WHERE email = 'admin@smartvillagemart.com';

-- Update admin password with new hash
-- Password: admin123
UPDATE admins 
SET password = '$2b$10$tcDiM9pVOvPYHbdfXL/3TONvsY.sOYYgZp.xB2jVFc6BRD3rjCQl56'
WHERE email = 'admin@smartvillagemart.com';

-- Verify update
SELECT id, email, 'Password updated successfully' as status FROM admins WHERE email = 'admin@smartvillagemart.com';

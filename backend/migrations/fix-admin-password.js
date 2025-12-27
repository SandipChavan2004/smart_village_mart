const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdminPassword() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'smart_village_mart'
        });

        console.log('✅ Connected to database');

        // Generate new password hash
        const password = 'admin123';
        const hash = await bcrypt.hash(password, 10);

        console.log('🔐 Generated new password hash');

        // Update admin password
        const [result] = await connection.query(
            'UPDATE admins SET password = ? WHERE email = ?',
            [hash, 'admin@smartvillagemart.com']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Admin password updated successfully!');
            console.log('\n📋 Admin Credentials:');
            console.log('   Email: admin@smartvillagemart.com');
            console.log('   Password: admin123');
            console.log('   ⚠️  Please change this password after first login!\n');
        } else {
            console.log('❌ Admin account not found. Creating new admin...');

            // Create admin account
            await connection.query(
                'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
                ['System Admin', 'admin@smartvillagemart.com', hash]
            );

            console.log('✅ Admin account created!');
            console.log('\n📋 Admin Credentials:');
            console.log('   Email: admin@smartvillagemart.com');
            console.log('   Password: admin123\n');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

fixAdminPassword();

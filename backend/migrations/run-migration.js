const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'smart_village_mart',
            multipleStatements: true
        });

        console.log('✅ Connected to database');

        // Read migration file
        const migrationPath = path.join(__dirname, '001_admin_verification.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📝 Running migration: 001_admin_verification.sql');

        // Execute migration
        await connection.query(sql);

        console.log('✅ Migration completed successfully!');
        console.log('\n📋 Admin Credentials:');
        console.log('   Email: admin@smartvillagemart.com');
        console.log('   Password: admin123');
        console.log('   ⚠️  Please change this password after first login!\n');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

runMigration();

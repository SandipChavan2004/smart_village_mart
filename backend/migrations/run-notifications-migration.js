require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runNotificationsMigration() {
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

        // Read SQL file
        const sqlFile = path.join(__dirname, '002_product_notifications.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('📝 Running notifications migration...');

        // Execute SQL
        await connection.query(sql);

        console.log('✅ Notifications tables created successfully!');
        console.log('\n📋 Created tables:');
        console.log('   - product_notifications');
        console.log('   - notifications\n');

    } catch (error) {
        console.error('❌ Migration Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

runNotificationsMigration();

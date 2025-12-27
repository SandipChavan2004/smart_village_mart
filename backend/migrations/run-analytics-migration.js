require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'smart_village_mart',
            multipleStatements: true
        });

        console.log('✅ Connected to database');

        // Read and execute migration
        const migrationSQL = fs.readFileSync(
            path.join(__dirname, '003_analytics_schema.sql'),
            'utf8'
        );

        console.log('📝 Running analytics migration...');
        const [results] = await connection.query(migrationSQL);

        console.log('✅ Analytics migration completed successfully!');

        // Display results
        if (Array.isArray(results)) {
            results.forEach(result => {
                if (result && result.length > 0) {
                    console.table(result);
                }
            });
        }

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('👋 Database connection closed');
        }
    }
}

runMigration();

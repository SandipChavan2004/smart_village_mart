require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkNotifications() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'smart_village_mart'
        });

        console.log('✅ Connected to database\n');

        // Check subscriptions
        console.log('📋 Product Subscriptions:');
        const [subs] = await connection.query('SELECT * FROM product_notifications ORDER BY id DESC LIMIT 10');
        console.table(subs);

        // Check notifications
        console.log('\n📬 Notifications:');
        const [notifs] = await connection.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10');
        console.table(notifs);

        // Check products with stock = 0
        console.log('\n📦 Out of Stock Products:');
        const [products] = await connection.query('SELECT id, name, stock FROM products WHERE stock = 0 LIMIT 5');
        console.table(products);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkNotifications();

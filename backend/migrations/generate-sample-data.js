require('dotenv').config();
const mysql = require('mysql2/promise');

async function generateSampleData() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'smart_village_mart'
        });

        console.log('✅ Connected to database');

        // Get all shopkeepers
        const [shopkeepers] = await connection.query('SELECT id FROM shopkeepers WHERE verification_status = "approved"');

        if (shopkeepers.length === 0) {
            console.log('⚠️  No approved shopkeepers found');
            return;
        }

        // Get all customers
        const [customers] = await connection.query('SELECT id FROM customers');

        if (customers.length === 0) {
            console.log('⚠️  No customers found');
            return;
        }

        console.log(`📊 Generating sample data for ${shopkeepers.length} shopkeeper(s)...`);

        for (const shopkeeper of shopkeepers) {
            // Get products for this shopkeeper
            const [products] = await connection.query(
                'SELECT id, name, price FROM products WHERE shopkeeper_id = ?',
                [shopkeeper.id]
            );

            if (products.length === 0) {
                console.log(`⚠️  No products found for shopkeeper ${shopkeeper.id}`);
                continue;
            }

            // Generate 20-50 random orders over the last 90 days
            const orderCount = Math.floor(Math.random() * 31) + 20;

            for (let i = 0; i < orderCount; i++) {
                // Random date within last 90 days
                const daysAgo = Math.floor(Math.random() * 90);
                const orderDate = new Date();
                orderDate.setDate(orderDate.getDate() - daysAgo);

                // Random customer
                const customer = customers[Math.floor(Math.random() * customers.length)];

                // Random status (mostly delivered)
                const statuses = ['delivered', 'delivered', 'delivered', 'confirmed', 'pending'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                // Create order
                const [orderResult] = await connection.query(
                    `INSERT INTO orders (customer_id, shopkeeper_id, total_amount, status, payment_method, customer_name, customer_phone, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [customer.id, shopkeeper.id, 0, status, 'cash_on_delivery', 'Sample Customer', '9876543210', orderDate]
                );

                const orderId = orderResult.insertId;

                // Add 1-5 random products to the order
                const itemCount = Math.floor(Math.random() * 5) + 1;
                let totalAmount = 0;

                for (let j = 0; j < itemCount; j++) {
                    const product = products[Math.floor(Math.random() * products.length)];
                    const quantity = Math.floor(Math.random() * 3) + 1;
                    const subtotal = product.price * quantity;
                    totalAmount += subtotal;

                    await connection.query(
                        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal)
             VALUES (?, ?, ?, ?, ?, ?)`,
                        [orderId, product.id, product.name, quantity, product.price, subtotal]
                    );
                }

                // Update order total
                await connection.query(
                    'UPDATE orders SET total_amount = ? WHERE id = ?',
                    [totalAmount, orderId]
                );
            }

            // Generate product views (100-300 views)
            const viewCount = Math.floor(Math.random() * 201) + 100;

            for (let i = 0; i < viewCount; i++) {
                const product = products[Math.floor(Math.random() * products.length)];
                const customer = customers[Math.floor(Math.random() * customers.length)];

                // Random date within last 90 days
                const daysAgo = Math.floor(Math.random() * 90);
                const viewDate = new Date();
                viewDate.setDate(viewDate.getDate() - daysAgo);

                await connection.query(
                    `INSERT INTO product_views (product_id, customer_id, shopkeeper_id, viewed_at)
           VALUES (?, ?, ?, ?)`,
                    [product.id, customer.id, shopkeeper.id, viewDate]
                );
            }

            console.log(`✅ Generated data for shopkeeper ${shopkeeper.id}: ${orderCount} orders, ${viewCount} views`);
        }

        console.log('🎉 Sample data generation completed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

generateSampleData();

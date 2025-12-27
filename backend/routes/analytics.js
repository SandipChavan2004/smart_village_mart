const express = require('express');
const db = require('../config/db');

const router = express.Router();

/* ================= SALES OVERVIEW ================= */
router.get('/shopkeeper/:id/overview', async (req, res) => {
    try {
        const shopkeeperId = req.params.id;
        const { period = '30' } = req.query; // days

        // Calculate date range
        const dateFilter = period === 'all'
            ? ''
            : `AND o.created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)`;

        // Get total revenue
        const [revenueResult] = await db.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
      WHERE shopkeeper_id = ? AND status != 'cancelled' ${dateFilter}
    `, [shopkeeperId]);

        // Get total orders
        const [ordersResult] = await db.query(`
      SELECT COUNT(*) as total_orders
      FROM orders
      WHERE shopkeeper_id = ? AND status != 'cancelled' ${dateFilter}
    `, [shopkeeperId]);

        // Get total products
        const [productsResult] = await db.query(`
      SELECT COUNT(*) as total_products
      FROM products
      WHERE shopkeeper_id = ?
    `, [shopkeeperId]);

        // Get total product views
        const [viewsResult] = await db.query(`
      SELECT COUNT(*) as total_views
      FROM product_views
      WHERE shopkeeper_id = ? ${dateFilter.replace('o.created_at', 'viewed_at')}
    `, [shopkeeperId]);

        // Get average order value
        const avgOrderValue = ordersResult[0].total_orders > 0
            ? revenueResult[0].total_revenue / ordersResult[0].total_orders
            : 0;

        // Get previous period data for comparison
        const prevDateFilter = period === 'all'
            ? ''
            : `AND o.created_at >= DATE_SUB(NOW(), INTERVAL ${period * 2} DAY) 
         AND o.created_at < DATE_SUB(NOW(), INTERVAL ${period} DAY)`;

        const [prevRevenueResult] = await db.query(`
      SELECT COALESCE(SUM(total_amount), 0) as prev_revenue
      FROM orders o
      WHERE shopkeeper_id = ? AND status != 'cancelled' ${prevDateFilter}
    `, [shopkeeperId]);

        const [prevOrdersResult] = await db.query(`
      SELECT COUNT(*) as prev_orders
      FROM orders o
      WHERE shopkeeper_id = ? AND status != 'cancelled' ${prevDateFilter}
    `, [shopkeeperId]);

        // Calculate growth percentages
        const revenueGrowth = prevRevenueResult[0].prev_revenue > 0
            ? ((revenueResult[0].total_revenue - prevRevenueResult[0].prev_revenue) / prevRevenueResult[0].prev_revenue) * 100
            : 0;

        const ordersGrowth = prevOrdersResult[0].prev_orders > 0
            ? ((ordersResult[0].total_orders - prevOrdersResult[0].prev_orders) / prevOrdersResult[0].prev_orders) * 100
            : 0;

        res.json({
            totalRevenue: parseFloat(revenueResult[0].total_revenue),
            totalOrders: ordersResult[0].total_orders,
            totalProducts: productsResult[0].total_products,
            totalViews: viewsResult[0].total_views,
            avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
            revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
            ordersGrowth: parseFloat(ordersGrowth.toFixed(2))
        });
    } catch (err) {
        console.error('ANALYTICS OVERVIEW ERROR:', err);
        res.status(500).json({ message: 'Failed to load analytics overview' });
    }
});

/* ================= REVENUE TRENDS ================= */
router.get('/shopkeeper/:id/revenue-trends', async (req, res) => {
    try {
        const shopkeeperId = req.params.id;
        const { period = '30' } = req.query;

        let groupBy, dateFormat;
        if (period === '7') {
            groupBy = 'DATE(created_at)';
            dateFormat = '%Y-%m-%d';
        } else if (period === '30' || period === '90') {
            groupBy = 'DATE(created_at)';
            dateFormat = '%Y-%m-%d';
        } else {
            groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
            dateFormat = '%Y-%m';
        }

        const dateFilter = period === 'all'
            ? ''
            : `AND created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)`;

        const [trends] = await db.query(`
      SELECT 
        DATE_FORMAT(created_at, ?) as date,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE shopkeeper_id = ? AND status != 'cancelled' ${dateFilter}
      GROUP BY ${groupBy}
      ORDER BY created_at ASC
    `, [dateFormat, shopkeeperId]);

        res.json(trends);
    } catch (err) {
        console.error('REVENUE TRENDS ERROR:', err);
        res.status(500).json({ message: 'Failed to load revenue trends' });
    }
});

/* ================= TOP PRODUCTS ================= */
router.get('/shopkeeper/:id/top-products', async (req, res) => {
    try {
        const shopkeeperId = req.params.id;
        const { period = '30', limit = '10' } = req.query;

        const dateFilter = period === 'all'
            ? ''
            : `AND o.created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)`;

        const [products] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.category,
        p.image,
        p.stock,
        COALESCE(SUM(oi.quantity), 0) as units_sold,
        COALESCE(SUM(oi.subtotal), 0) as revenue,
        COUNT(DISTINCT o.id) as order_count,
        (SELECT COUNT(*) FROM product_views pv 
         WHERE pv.product_id = p.id ${dateFilter.replace('o.created_at', 'pv.viewed_at')}) as views
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled' ${dateFilter}
      WHERE p.shopkeeper_id = ?
      GROUP BY p.id, p.name, p.category, p.image, p.stock
      ORDER BY revenue DESC
      LIMIT ?
    `, [shopkeeperId, parseInt(limit)]);

        res.json(products);
    } catch (err) {
        console.error('TOP PRODUCTS ERROR:', err);
        res.status(500).json({ message: 'Failed to load top products' });
    }
});

/* ================= CATEGORY BREAKDOWN ================= */
router.get('/shopkeeper/:id/category-breakdown', async (req, res) => {
    try {
        const shopkeeperId = req.params.id;
        const { period = '30' } = req.query;

        const dateFilter = period === 'all'
            ? ''
            : `AND o.created_at >= DATE_SUB(NOW(), INTERVAL ${period} DAY)`;

        const [categories] = await db.query(`
      SELECT 
        p.category,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(SUM(oi.quantity), 0) as units_sold,
        COALESCE(SUM(oi.subtotal), 0) as revenue
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled' ${dateFilter}
      WHERE p.shopkeeper_id = ?
      GROUP BY p.category
      ORDER BY revenue DESC
    `, [shopkeeperId]);

        res.json(categories);
    } catch (err) {
        console.error('CATEGORY BREAKDOWN ERROR:', err);
        res.status(500).json({ message: 'Failed to load category breakdown' });
    }
});

/* ================= RECENT ORDERS ================= */
router.get('/shopkeeper/:id/recent-orders', async (req, res) => {
    try {
        const shopkeeperId = req.params.id;
        const { limit = '10' } = req.query;

        const [orders] = await db.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.payment_method,
        o.customer_name,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.shopkeeper_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `, [shopkeeperId, parseInt(limit)]);

        res.json(orders);
    } catch (err) {
        console.error('RECENT ORDERS ERROR:', err);
        res.status(500).json({ message: 'Failed to load recent orders' });
    }
});

module.exports = router;

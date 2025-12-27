const express = require('express');
const db = require('../config/db');

const router = express.Router();

/* ================= HELPER FUNCTION ================= */
async function createNotification(userId, userRole, type, title, message, link = null) {
    try {
        await db.query(
            `INSERT INTO notifications (user_id, user_role, type, title, message, link)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [userId, userRole, type, title, message, link]
        );
    } catch (err) {
        console.error('CREATE NOTIFICATION ERROR:', err);
        throw err;
    }
}

/* ================= SUBSCRIBE TO PRODUCT NOTIFICATIONS ================= */
router.post('/subscribe', async (req, res) => {
    try {
        const { product_id, customer_id } = req.body;

        if (!product_id || !customer_id) {
            return res.status(400).json({ message: 'Product ID and Customer ID are required' });
        }

        // Check if already subscribed
        const [existing] = await db.query(
            'SELECT id FROM product_notifications WHERE customer_id = ? AND product_id = ?',
            [customer_id, product_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already subscribed to this product' });
        }

        // Create subscription
        await db.query(
            `INSERT INTO product_notifications (customer_id, product_id)
       VALUES (?, ?)`,
            [customer_id, product_id]
        );

        res.json({ message: 'Successfully subscribed to product notifications' });
    } catch (err) {
        console.error('SUBSCRIBE ERROR:', err);
        res.status(500).json({ message: 'Failed to subscribe' });
    }
});

/* ================= UNSUBSCRIBE FROM PRODUCT NOTIFICATIONS ================= */
router.delete('/unsubscribe/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { customer_id } = req.body;

        if (!customer_id) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        await db.query(
            'DELETE FROM product_notifications WHERE customer_id = ? AND product_id = ?',
            [customer_id, productId]
        );

        res.json({ message: 'Successfully unsubscribed' });
    } catch (err) {
        console.error('UNSUBSCRIBE ERROR:', err);
        res.status(500).json({ message: 'Failed to unsubscribe' });
    }
});

/* ================= CHECK SUBSCRIPTION STATUS ================= */
router.get('/subscription/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { customer_id } = req.query;

        if (!customer_id) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        const [rows] = await db.query(
            'SELECT id FROM product_notifications WHERE customer_id = ? AND product_id = ?',
            [customer_id, productId]
        );

        res.json({ subscribed: rows.length > 0 });
    } catch (err) {
        console.error('CHECK SUBSCRIPTION ERROR:', err);
        res.status(500).json({ message: 'Failed to check subscription' });
    }
});

/* ================= GET ALL NOTIFICATIONS ================= */
router.get('/', async (req, res) => {
    try {
        const { user_id, user_role, unread } = req.query;

        if (!user_id || !user_role) {
            return res.status(400).json({ message: 'User ID and role are required' });
        }

        let query = `
      SELECT id, type, title, message, link, is_read, created_at
      FROM notifications
      WHERE user_id = ? AND user_role = ?
    `;
        const params = [user_id, user_role];

        if (unread === 'true') {
            query += ' AND is_read = FALSE';
        }

        query += ' ORDER BY created_at DESC LIMIT 50';

        const [notifications] = await db.query(query, params);
        res.json(notifications);
    } catch (err) {
        console.error('GET NOTIFICATIONS ERROR:', err);
        res.status(500).json({ message: 'Failed to load notifications' });
    }
});

/* ================= GET UNREAD COUNT ================= */
router.get('/unread-count', async (req, res) => {
    try {
        const { user_id, user_role } = req.query;

        if (!user_id || !user_role) {
            return res.status(400).json({ message: 'User ID and role are required' });
        }

        const [result] = await db.query(
            `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = ? AND user_role = ? AND is_read = FALSE`,
            [user_id, user_role]
        );

        res.json({ count: result[0].count });
    } catch (err) {
        console.error('GET UNREAD COUNT ERROR:', err);
        res.status(500).json({ message: 'Failed to get unread count' });
    }
});

/* ================= MARK NOTIFICATION AS READ ================= */
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ?',
            [id]
        );

        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('MARK AS READ ERROR:', err);
        res.status(500).json({ message: 'Failed to mark as read' });
    }
});

/* ================= MARK ALL AS READ ================= */
router.put('/mark-all-read', async (req, res) => {
    try {
        const { user_id, user_role } = req.body;

        if (!user_id || !user_role) {
            return res.status(400).json({ message: 'User ID and role are required' });
        }

        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND user_role = ? AND is_read = FALSE',
            [user_id, user_role]
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('MARK ALL AS READ ERROR:', err);
        res.status(500).json({ message: 'Failed to mark all as read' });
    }
});

// Export both router and helper function
module.exports = { router, createNotification };

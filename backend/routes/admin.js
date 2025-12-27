const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const adminAuth = require('../middlewares/adminAuth');

const router = express.Router();

/* ================= ADMIN LOGIN ================= */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find admin by email
        const [admins] = await db.query(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );

        if (admins.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const admin = admins[0];

        // Verify password
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token with admin role
        const user = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin'
        };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user });
    } catch (err) {
        console.error('ADMIN LOGIN ERROR:', err);
        res.status(500).json({ message: 'Login failed' });
    }
});

/* ================= GET PENDING SHOPKEEPERS ================= */
router.get('/shopkeepers/pending', adminAuth, async (req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        id, name, email, phone, shop_name, address, 
        category, gstin, pan, license_number,
        verification_status
      FROM shopkeepers
      WHERE verification_status = 'pending'
      ORDER BY id DESC
    `);

        res.json(rows);
    } catch (err) {
        console.error('GET PENDING SHOPKEEPERS ERROR:', err);
        res.status(500).json({ message: 'Failed to load pending shopkeepers' });
    }
});

/* ================= GET ALL SHOPKEEPERS ================= */
router.get('/shopkeepers/all', adminAuth, async (req, res) => {
    try {
        const { status } = req.query;

        let query = `
      SELECT 
        id, name, email, phone, shop_name, address, 
        category, gstin, pan, license_number,
        verification_status, verified_at, rejection_reason
      FROM shopkeepers
    `;

        const params = [];

        if (status) {
            query += ' WHERE verification_status = ?';
            params.push(status);
        }

        query += ' ORDER BY id DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('GET ALL SHOPKEEPERS ERROR:', err);
        res.status(500).json({ message: 'Failed to load shopkeepers' });
    }
});

/* ================= APPROVE SHOPKEEPER ================= */
router.put('/shopkeepers/:id/approve', adminAuth, async (req, res) => {
    const { id } = req.params;
    const adminId = req.admin.id;

    try {
        // Update shopkeeper status
        await db.query(`
      UPDATE shopkeepers 
      SET verification_status = 'approved',
          verified_by = ?,
          verified_at = CURRENT_TIMESTAMP,
          rejection_reason = NULL
      WHERE id = ?
    `, [adminId, id]);

        // Get updated shopkeeper details
        const [shopkeepers] = await db.query(
            'SELECT id, name, shop_name, verification_status, verified_at FROM shopkeepers WHERE id = ?',
            [id]
        );

        if (shopkeepers.length === 0) {
            return res.status(404).json({ message: 'Shopkeeper not found' });
        }

        res.json({
            message: 'Shopkeeper approved successfully',
            shopkeeper: shopkeepers[0]
        });
    } catch (err) {
        console.error('APPROVE SHOPKEEPER ERROR:', err);
        res.status(500).json({ message: 'Failed to approve shopkeeper' });
    }
});

/* ================= REJECT SHOPKEEPER ================= */
router.put('/shopkeepers/:id/reject', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.admin.id;

    if (!reason) {
        return res.status(400).json({ message: 'Rejection reason is required' });
    }

    try {
        // Update shopkeeper status
        await db.query(`
      UPDATE shopkeepers 
      SET verification_status = 'rejected',
          verified_by = ?,
          verified_at = CURRENT_TIMESTAMP,
          rejection_reason = ?
      WHERE id = ?
    `, [adminId, reason, id]);

        // Get updated shopkeeper details
        const [shopkeepers] = await db.query(
            'SELECT id, name, shop_name, verification_status, rejection_reason FROM shopkeepers WHERE id = ?',
            [id]
        );

        if (shopkeepers.length === 0) {
            return res.status(404).json({ message: 'Shopkeeper not found' });
        }

        res.json({
            message: 'Shopkeeper rejected',
            shopkeeper: shopkeepers[0]
        });
    } catch (err) {
        console.error('REJECT SHOPKEEPER ERROR:', err);
        res.status(500).json({ message: 'Failed to reject shopkeeper' });
    }
});

module.exports = router;

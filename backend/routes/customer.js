const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    const [exists] = await db.query(
      'SELECT id FROM customers WHERE email=?',
      [email]
    );
    if (exists.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO customers (name,email,password,phone,address)
       VALUES (?,?,?,?,?)`,
      [name, email, hashed, phone, address]
    );

    const user = {
      id: result.insertId,
      name,
      email,
      role: 'customer',
      phone,
      address
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({
      message: 'Customer registration failed',
      error: err.message
    });
  }

});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM customers WHERE email=?',
      [email]
    );
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userDB = users[0];
    const match = await bcrypt.compare(password, userDB.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      role: 'customer',
      phone: userDB.phone,
      address: userDB.address
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

/* ================= UPDATE CUSTOMER PROFILE ================= */
router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    // Update customer profile
    await db.query(
      `UPDATE customers 
       SET name = ?, phone = ?, address = ?
       WHERE id = ?`,
      [name, phone, address, id]
    );

    // Get updated user data
    const [users] = await db.query(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const userDB = users[0];
    const user = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      role: 'customer',
      phone: userDB.phone,
      address: userDB.address
    };

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("UPDATE CUSTOMER PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;

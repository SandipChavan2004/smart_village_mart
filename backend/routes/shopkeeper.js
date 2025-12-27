const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    name, email, password, phone,
    shop_name, address, gstin, pan,
    license_number, category
  } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO shopkeepers
      (name,email,password,phone,shop_name,address,gstin,pan,license_number,category)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        name, email, hashed, phone,
        shop_name, address, gstin, pan,
        license_number, category
      ]
    );

    const user = {
      id: result.insertId,
      name,
      email,
      role: 'shopkeeper',
      phone,
      shop_name,
      address,
      category,
      gstin,
      pan,
      verification_status: 'pending'
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Shopkeeper registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM shopkeepers WHERE email=?',
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
      role: 'shopkeeper',
      phone: userDB.phone,
      shop_name: userDB.shop_name,
      address: userDB.address,
      category: userDB.category,
      gstin: userDB.gstin,
      pan: userDB.pan,
      verification_status: userDB.verification_status,
      rejection_reason: userDB.rejection_reason
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

/* ================= UPDATE SHOPKEEPER PROFILE ================= */
router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      shop_name,
      address,
      category,
      gstin,
      pan,
      license_number
    } = req.body;

    // Update shopkeeper profile
    await db.query(
      `UPDATE shopkeepers 
       SET name = ?, phone = ?, shop_name = ?, address = ?, 
           category = ?, gstin = ?, pan = ?, license_number = ?
       WHERE id = ?`,
      [name, phone, shop_name, address, category, gstin, pan, license_number, id]
    );

    // Get updated user data
    const [users] = await db.query(
      'SELECT * FROM shopkeepers WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Shopkeeper not found" });
    }

    const userDB = users[0];
    const user = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      role: 'shopkeeper',
      phone: userDB.phone,
      shop_name: userDB.shop_name,
      address: userDB.address,
      category: userDB.category,
      gstin: userDB.gstin,
      pan: userDB.pan,
      verification_status: userDB.verification_status,
      rejection_reason: userDB.rejection_reason
    };

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

/* ================= GET SHOPKEEPER BY ID ================= */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, shop_name, name, category, address, phone, email FROM shopkeepers WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET SHOPKEEPER ERROR:", err);
    res.status(500).json({ message: "Failed to load shop details" });
  }
});

module.exports = router;

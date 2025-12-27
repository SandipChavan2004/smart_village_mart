const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../config/db");

const router = express.Router();

/* ================= ENSURE UPLOADS FOLDER ================= */
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= ADD PRODUCT ================= */
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const {
      shopkeeper_id,
      name,
      description,
      price,
      stock,
      category,
    } = req.body;

    if (!shopkeeper_id || !name || !price || !stock || !category) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Check if shopkeeper is verified
    const [shopkeeper] = await db.query(
      'SELECT verification_status FROM shopkeepers WHERE id = ?',
      [shopkeeper_id]
    );

    if (shopkeeper.length === 0) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }

    if (shopkeeper[0].verification_status !== 'approved') {
      return res.status(403).json({
        message: 'Your account must be verified by admin before adding products',
        verification_status: shopkeeper[0].verification_status
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO products
      (shopkeeper_id, name, description, price, stock, category, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      shopkeeper_id,
      name,
      description,
      price,
      stock,
      category,
      image,
    ]);

    res.json({ message: 'Product added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


/* ================= GET ALL PRODUCTS (PUBLIC) ================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category,
        p.image,
        s.shop_name
      FROM products p
      JOIN shopkeepers s ON p.shopkeeper_id = s.id
      WHERE s.verification_status = 'approved'
      ORDER BY p.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("FETCH PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Failed to load products" });
  }
});

/* ================= PRICE COMPARISON - GET ALL PRODUCTS ================= */
router.get("/compare", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category,
        p.image,
        p.shopkeeper_id as shop_id,
        s.shop_name,
        s.address as shop_address,
        s.phone as shop_phone
      FROM products p
      JOIN shopkeepers s ON p.shopkeeper_id = s.id
      WHERE s.verification_status = 'approved'
      ORDER BY p.name ASC, p.price ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("PRICE COMPARISON ERROR:", err);
    res.status(500).json({ message: "Failed to load price comparisons" });
  }
});

/* ================= GET SINGLE PRODUCT BY ID ================= */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category,
        p.image,
        p.shopkeeper_id,
        s.shop_name,
        s.address,
        s.phone
      FROM products p
      JOIN shopkeepers s ON p.shopkeeper_id = s.id
      WHERE p.id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to load product" });
  }
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Get old stock value and product name before update
    const [oldProduct] = await db.query('SELECT stock, name FROM products WHERE id = ?', [req.params.id]);
    const oldStock = oldProduct[0]?.stock || 0;
    const productName = oldProduct[0]?.name || name;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    let query = `
      UPDATE products 
      SET name=?, description=?, price=?, stock=?, category=?
    `;
    const values = [name, description, price, stock, category];

    if (imagePath) {
      query += ", image=?";
      values.push(imagePath);
    }

    query += " WHERE id=?";
    values.push(req.params.id);

    await db.query(query, values);

    // Check if stock changed from 0 to > 0 (product back in stock)
    if (oldStock === 0 && stock > 0) {
      console.log(`📢 Product "${productName}" back in stock! Notifying subscribers...`);

      // Get all subscribers who haven't been notified yet
      const [subscribers] = await db.query(
        `SELECT customer_id FROM product_notifications 
         WHERE product_id = ? AND notified = FALSE`,
        [req.params.id]
      );

      if (subscribers.length > 0) {
        // Import notification functions
        const { createNotification } = require('./notification');
        const { sendProductAvailableEmail } = require('../services/emailService');

        // Get product details for email
        const [productDetails] = await db.query(
          'SELECT price FROM products WHERE id = ?',
          [req.params.id]
        );
        const productPrice = productDetails[0]?.price || 0;
        const productLink = `http://localhost:5173/product/${req.params.id}`;

        // Create notifications and send emails for each subscriber
        for (const sub of subscribers) {
          // Create in-app notification
          await createNotification(
            sub.customer_id,
            'customer',
            'product_available',
            'Product Back in Stock! 🎉',
            `${productName} is now available with ${stock} units in stock`,
            `/product/${req.params.id}`
          );

          // Get customer email
          const [customer] = await db.query(
            'SELECT email, name FROM customers WHERE id = ?',
            [sub.customer_id]
          );

          if (customer.length > 0) {
            const { email, name } = customer[0];
            // Send email notification
            await sendProductAvailableEmail(
              email,
              name,
              productName,
              productPrice,
              stock,
              productLink
            );
          }
        }

        // Mark all subscriptions as notified
        await db.query(
          `UPDATE product_notifications 
           SET notified = TRUE, notified_at = NOW() 
           WHERE product_id = ? AND notified = FALSE`,
          [req.params.id]
        );

        console.log(`✅ Notified ${subscribers.length} customer(s) about "${productName}"`);
      }
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
});

/* ================= DELETE PRODUCT ================= */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id=?", [req.params.id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

/* ================= GET ALL PRODUCTS FOR PRICE COMPARISON ================= */
router.get("/compare", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category,
        p.image,
        p.shopkeeper_id as shop_id,
        s.shop_name,
        s.address as shop_address,
        s.phone as shop_phone
      FROM products p
      JOIN shopkeepers s ON p.shopkeeper_id = s.id
      WHERE s.verification_status = 'approved'
      ORDER BY p.name ASC, p.price ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error("PRICE COMPARISON ERROR:", err);
    res.status(500).json({ message: "Failed to load price comparisons" });
  }
});

module.exports = router;

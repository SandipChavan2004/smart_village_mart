require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

/* Serve uploaded images */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* Routes */
const customerRoutes = require('./routes/customer');
const shopkeeperRoutes = require('./routes/shopkeeper');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const { router: notificationRoutes } = require('./routes/notification');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/customer', customerRoutes);
app.use('/api/shopkeeper', shopkeeperRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('Smart Village Mart Backend Running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
<div align="center">

# 🏪 Smart Village Mart

### *Empowering Rural Commerce Through Digital Innovation*

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479a1?style=flat-square&logo=mysql)](https://www.mysql.com/)

</div>

---

## 📖 About

A full-stack e-commerce platform connecting local village shopkeepers with customers, enabling them to list products online and reach customers beyond geographical boundaries.

### ✨ Key Features

- 🔐 **Multi-Role Authentication** - Separate portals for Customers, Shopkeepers, and Admins
- 🛒 **Product Management** - Search, filter, and browse products by category
- 📊 **Analytics Dashboard** - Business insights for shopkeepers
- 🔔 **Real-time Notifications** - Order updates and alerts
- 📱 **Responsive Design** - Works seamlessly on all devices

---

## 🛠️ Tech Stack

**Frontend:** React 18.3.1, TypeScript, Vite, Tailwind CSS, Radix UI, Material-UI  
**Backend:** Node.js, Express 5.2.1, MySQL 2, JWT, Bcrypt  
**Tools:** Axios, React Router, Multer, Nodemailer

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/SandipChavan2004/smart_village_mart.git
cd smart_village_mart
```

**2. Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

**3. Database setup**
```bash
# Create database
mysql -u root -p
CREATE DATABASE smart_village_mart;
exit;

# Run migrations
cd backend/migrations
mysql -u root -p smart_village_mart < 001_admin_verification.sql
mysql -u root -p smart_village_mart < 002_product_notifications.sql
mysql -u root -p smart_village_mart < 003_analytics_schema.sql
```

**4. Configure environment**

Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_village_mart
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

**5. Run the application**
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

---

## 🎮 Default Credentials

**Admin:**
```
Email: admin@smartvillagemart.com
Password: admin123
```

> ⚠️ Change default credentials in production

---

## 📁 Project Structure

```
smart_village_mart/
├── backend/
│   ├── config/          # Database configuration
│   ├── middlewares/     # Auth & upload middlewares
│   ├── migrations/      # SQL migration files
│   ├── routes/          # API routes
│   ├── services/        # Email & other services
│   ├── uploads/         # Product images
│   └── server.js        # Express server
├── src/
│   ├── app/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Root component
│   ├── contexts/        # React contexts
│   ├── styles/          # CSS files
│   └── main.tsx         # Entry point
└── public/              # Static assets
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/shopkeeper/login` - Shopkeeper login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/customer/register` - Customer registration
- `POST /api/auth/shopkeeper/register` - Shopkeeper registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Auth required)
- `PUT /api/products/:id` - Update product (Auth required)
- `DELETE /api/products/:id` - Delete product (Auth required)

### Orders & Notifications
- `GET /api/customer/orders/:id` - Get customer orders
- `GET /api/shopkeeper/orders/:id` - Get shopkeeper orders
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Analytics & Admin
- `GET /api/analytics/shopkeeper/:id` - Shopkeeper analytics
- `GET /api/admin/shopkeepers/pending` - Pending verifications
- `PUT /api/admin/shopkeeper/:id/verify` - Verify shopkeeper

---

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control
- SQL injection prevention
- CORS protection
- Secure file uploads

---

## 🚧 Roadmap

- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Product reviews & ratings
- [ ] Wishlist feature

---

## 👨‍💻 Author

**Sandip Chavan**

- GitHub: [@SandipChavan2004](https://github.com/SandipChavan2004)
- Email: sandipchavan2004@example.com

---

<div align="center">

**Made with ❤️ for Rural India**

⭐ Star this repo if you find it helpful!

</div>
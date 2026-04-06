# E-Commerce AI - Full Stack E-Commerce Application

A complete real-time E-commerce web application with AI-based product recommendation system built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based register/login/logout with protected routes
- **Product System**: Product listing, details, categories, search & filter
- **Cart System**: Add/remove items, update quantity, total calculation
- **Orders**: Place orders, order history, order status tracking
- **Admin Panel**: Product management, order management, dashboard stats

### AI Recommendation System
- Content-based filtering (category, tags matching)
- Collaborative filtering (similar users)
- User activity tracking for personalized recommendations
- "Recently Viewed" and "Recommended For You" sections

### Bonus Features
- Wishlist functionality
- Ratings & reviews system
- Mock payment integration (COD, Card, UPI)
- Pagination
- Responsive modern UI (Amazon/Flipkart style)

---

## 📁 Project Structure

```
E-Commerce AI/
├── backend/                 # Node.js + Express Backend
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Activity.js    # For AI recommendations
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── recommendations.js
│   ├── middleware/         # Auth middleware
│   │   └── auth.js
│   ├── server.js           # Express server entry
│   ├── seed.js             # Sample data seeder
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # React.js Frontend
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # State management
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md              # This file
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Step 1: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with the following:
# MONGODB_URI=mongodb://localhost:27017/ecommerce-ai
# JWT_SECRET=your_jwt_secret_key_here
# PORT=5000
# NODE_ENV=development
```

### Step 2: Start Backend Server

```bash
# Run the backend server
npm run dev
# or
node server.js
```

The backend will run on `http://localhost:5000`

### Step 3: Seed Sample Data (Optional)

```bash
# This will create sample products
node seed.js
```

### Step 4: Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 🔑 Default Admin Credentials

After running the seed script:
- **Email**: admin@ecommerce.com
- **Password**: admin123

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Products
- `GET /api/products` - Get all products (with pagination, filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/reviews` - Add review

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart` - Add to cart (protected)
- `PUT /api/cart/:itemId` - Update quantity (protected)
- `DELETE /api/cart/:itemId` - Remove item (protected)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Place order (protected)
- `GET /api/orders/admin` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations (protected)
- `GET /api/recommendations/trending` - Get trending products

---

## 🧠 AI Recommendation System

### How It Works

1. **Activity Tracking**: Every product view, cart addition, and order is stored in the Activity model
2. **Content-Based Filtering**: Analyzes product categories, tags, and brands to find similar items
3. **Collaborative Filtering**: Finds users with similar preferences and recommends what they bought
4. **Hybrid Approach**: Combines both methods for better recommendations

### Recommendation Types
- **For You**: Personalized based on your browsing history
- **Trending**: Popular products across all users
- **Similar Products**: Based on current product category

---

## 🛒 Tech Stack

### Frontend
- React.js 18 with Vite
- React Router v6
- TailwindCSS
- Axios for API calls
- React Icons
- Context API for state management

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- cors, dotenv

---

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce-ai
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
```

### Frontend (vite.config.js proxy)
The frontend proxies API calls to `http://localhost:5000`

---

## 🔧 Available Scripts

### Backend
- `npm run dev` - Development server with hot reload
- `node server.js` - Start production server
- `node seed.js` - Seed sample data

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Developer

Created as a complete full-stack e-commerce demonstration with AI recommendations.

## Key Features in Code

- **Modular backend** with separate route handlers
- **JWT authentication** with token verification middleware
- **AI recommendation system** with content-based and collaborative filtering
- **User activity tracking** for powering recommendations
- **Responsive UI** with modern e-commerce design
- **Protected routes** for authenticated users and admin-only pages
- **Cart persistence** in database
- **Order management** with status tracking# E-Commerce-AI

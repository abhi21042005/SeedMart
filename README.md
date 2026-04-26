# Seed & Fertilizer Marketplace

A full-stack, production-ready web application built for Indian farmers to buy high-quality seeds and fertilizers directly from verified sellers.

## Features
- **User Roles:** Farmer (buyer), Seller, Admin
- **Marketplace:** Search, filter by category/price, pagination, and sorting
- **Cart & Orders:** Add to cart, checkout, view order history
- **Seller Dashboard:** Full CRUD for products, manage stock, update order statuses
- **AI Chatbot:** Rule-based crop advisor supporting 15+ crops with Hindi aliases
- **Reviews & Ratings:** Authenticated users can leave reviews
- **Wishlist:** Save products for later
- **Modern UI:** Responsive, accessible, glassmorphism design, custom CSS variables

## Tech Stack
- **Frontend:** React (Vite), React Router, Context API, Axios, React Icons, React Toastify
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer
- **Styling:** Custom Vanilla CSS (no Tailwind)

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `localhost:27017` or use MongoDB Atlas)

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Ensure the `.env` file exists in the root directory (parent of `server` and `client`)
   - Example `.env`:
     ```env
     MONGO_URI=mongodb://localhost:27017/seed-marketplace
     JWT_SECRET=your_secret_key_here
     PORT=5000
     NODE_ENV=development
     ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### 3. Usage Guide
1. Open your browser and go to `http://localhost:5173`.
2. Register a **Seller** account.
3. Go to the **Dashboard** and add some products (seeds/fertilizers) with images and stock.
4. Log out and register a **Farmer** account.
5. Browse the marketplace, filter, search, add products to wishlist or cart.
6. Checkout to create an order.
7. Open the floating **AI Chatbot** and ask about a crop (e.g., "wheat", "rice", "aloo").

## Folder Structure
```
Fr/
├── server/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth, error handling, file upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routing
│   ├── uploads/         # Image storage
│   └── utils/           # JWT & Chatbot logic
├── client/
│   ├── src/
│   │   ├── components/  # Shared UI (Navbar, Footer, ProductCard)
│   │   ├── context/     # Auth & Cart state
│   │   ├── pages/       # Route components
│   │   └── services/    # Axios API calls
│   └── public/
└── .env
```

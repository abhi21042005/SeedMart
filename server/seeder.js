const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const { users, products } = require('./data/mockData');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

connectDB();

const importData = async () => {
  try {
    // Clear all existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    // Create users with hashed passwords
    const bcrypt = require('bcryptjs');
    const hashedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 12)
    }));
    const createdUsers = await User.insertMany(hashedUsers);

    // Get seller ID
    const sellerUser = createdUsers.find(user => user.role === 'seller');

    // Add seller ID to all products
    const sampleProducts = products.map(product => {
      return { ...product, sellerId: sellerUser._id };
    });

    // Create products
    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully! 🌱');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    console.log('Data Destroyed Successfully! 💥');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

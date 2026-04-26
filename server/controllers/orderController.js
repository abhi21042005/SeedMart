const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty. Add items before placing an order.');
  }

  // Build order items and validate stock
  const orderItems = [];
  let totalPrice = 0;

  for (const item of cart.items) {
    const product = item.productId;

    if (!product) {
      res.status(400);
      throw new Error('One or more products in your cart no longer exist');
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
    }

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
      sellerId: product.sellerId,
    });

    totalPrice += product.price * item.quantity;
  }

  // Create order
  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    totalPrice: Math.round(totalPrice * 100) / 100,
    status: 'pending',
  });

  // Reduce stock for each product
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check authorization
  if (
    order.userId._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin' &&
    req.user.role !== 'seller'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Get orders for seller's products
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'items.sellerId': req.user._id,
  })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  // Filter items to only show seller's products
  const sellerOrders = orders.map((order) => {
    const orderObj = order.toObject();
    orderObj.items = orderObj.items.filter(
      (item) => item.sellerId.toString() === req.user._id.toString()
    );
    return orderObj;
  });

  res.json(sellerOrders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // If cancelling, restore stock
  if (status === 'cancelled' && order.status !== 'cancelled') {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }
  }

  order.status = status;
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
};

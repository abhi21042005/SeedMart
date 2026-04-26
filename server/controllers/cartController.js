const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get populated cart with total price
const getPopulatedCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate(
    'items.productId',
    'name price image stock category'
  );

  if (!cart) {
    return { items: [], totalPrice: 0 };
  }

  const cartObj = cart.toObject();
  cartObj.totalPrice = cart.items.reduce((acc, item) => {
    return acc + (item.productId ? item.productId.price * item.quantity : 0);
  }, 0);

  return cartObj;
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await getPopulatedCart(req.user._id);
  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user._id,
      items: [{ productId, quantity }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  }

  res.json(await getPopulatedCart(req.user._id));
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Not enough stock available');
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;
  await cart.save();

  res.json(await getPopulatedCart(req.user._id));
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== req.params.productId
  );
  await cart.save();

  res.json(await getPopulatedCart(req.user._id));
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared', items: [], totalPrice: 0 });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };

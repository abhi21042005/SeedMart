const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build filter query
  const query = {};

  // Search by name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }

  // Filter by category
  if (req.query.category && ['seeds', 'fertilizers'].includes(req.query.category)) {
    query.category = req.query.category;
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Sort
  let sortBy = { createdAt: -1 };
  if (req.query.sort === 'price_asc') sortBy = { price: 1 };
  if (req.query.sort === 'price_desc') sortBy = { price: -1 };
  if (req.query.sort === 'name') sortBy = { name: 1 };
  if (req.query.sort === 'rating') sortBy = { 'reviews.rating': -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('sellerId', 'name')
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('sellerId', 'name email');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  if (!name || !price || !description || !category) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const product = await Product.create({
    name,
    price: parseFloat(price),
    description,
    category,
    stock: parseInt(stock) || 0,
    image: req.file ? `/uploads/${req.file.filename}` : '/uploads/default-product.png',
    sellerId: req.user._id,
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller (owner)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check ownership
  if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  const { name, price, description, category, stock } = req.body;

  product.name = name || product.name;
  product.price = price ? parseFloat(price) : product.price;
  product.description = description || product.description;
  product.category = category || product.category;
  product.stock = stock !== undefined ? parseInt(stock) : product.stock;

  if (req.file) {
    product.image = `/uploads/${req.file.filename}`;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller (owner) or Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check ownership or admin
  if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this product');
  }

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed successfully' });
});

// @desc    Get seller's own products
// @route   GET /api/products/seller/my
// @access  Private/Seller
const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
  res.json(products);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};

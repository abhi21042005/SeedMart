const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Add review to product
// @route   POST /api/reviews/:productId
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide rating and comment');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.userId.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    userId: req.user._id,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  await product.save();

  // Return updated product
  const updatedProduct = await Product.findById(req.params.productId).populate(
    'reviews.userId',
    'name'
  );

  res.status(201).json({
    message: 'Review added successfully',
    reviews: updatedProduct.reviews,
    averageRating: updatedProduct.averageRating,
  });
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId).populate(
    'reviews.userId',
    'name'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    reviews: product.reviews,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
  });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.id(req.params.reviewId);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Only review owner or admin can delete
  if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  product.reviews.pull(req.params.reviewId);
  await product.save();

  res.json({ message: 'Review removed successfully' });
});

module.exports = { addReview, getProductReviews, deleteReview };

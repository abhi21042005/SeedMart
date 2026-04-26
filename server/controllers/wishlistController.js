const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
    'products',
    'name price image category stock averageRating description'
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
  }

  res.json(wishlist);
});

// @desc    Toggle product in wishlist (add/remove)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
  }

  const productIndex = wishlist.products.indexOf(productId);

  let action;
  if (productIndex > -1) {
    // Remove from wishlist
    wishlist.products.splice(productIndex, 1);
    action = 'removed';
  } else {
    // Add to wishlist
    wishlist.products.push(productId);
    action = 'added';
  }

  await wishlist.save();

  const updatedWishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
    'products',
    'name price image category stock description'
  );

  res.json({
    message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
    wishlist: updatedWishlist,
  });
});

module.exports = { getWishlist, toggleWishlist };

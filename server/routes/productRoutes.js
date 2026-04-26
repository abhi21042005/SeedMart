const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);

// Seller routes (must be before /:id to avoid conflict)
router.get('/seller/my', protect, authorize('seller', 'admin'), getSellerProducts);

// Public single product
router.get('/:id', getProductById);

// Protected seller routes
router.post('/', protect, authorize('seller', 'admin'), upload.single('image'), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require auth

router.post('/', createOrder);
router.get('/my', getUserOrders);
router.get('/seller', authorize('seller', 'admin'), getSellerOrders);
router.get('/all', authorize('admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('seller', 'admin'), updateOrderStatus);

module.exports = router;

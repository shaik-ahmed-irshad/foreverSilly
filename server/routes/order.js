const express = require('express');
const router = express.Router();
const { 
  createNewOrder, 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { validateRequest, orderSchema } = require('../utils/validation');

// POST /api/order - Create new order
router.post('/', validateRequest(orderSchema), createNewOrder);

// GET /api/order - Get all orders (admin)
router.get('/', getAllOrders);

// GET /api/order/:id - Get specific order
router.get('/:id', getOrderById);

// PUT /api/order/:id/status - Update order status
router.put('/:id/status', updateOrderStatus);

module.exports = router; 
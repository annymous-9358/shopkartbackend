import express from 'express';
import { protect } from '../middleware/auth.js';
import { createOrder, getMyOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.use(protect);

// Create a new order
router.post('/', createOrder);

// Get user orders
router.get('/my-orders', getMyOrders);

// Update order status
router.patch('/:id/status', updateOrderStatus);

export default router;
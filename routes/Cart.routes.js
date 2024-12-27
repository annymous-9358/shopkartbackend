import express from 'express';
import { addToCart, getCart } from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart);

export default router;
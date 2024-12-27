import express from 'express';
import { body } from 'express-validator';
import * as reviewController from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', reviewController.getProductReviews);

router.post('/', [
  protect,
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').notEmpty(),
  body('productId').notEmpty()
], reviewController.createReview);

export default router;
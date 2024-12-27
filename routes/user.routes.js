import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

router.post('/profile/address', userController.addAddress);

export default router;
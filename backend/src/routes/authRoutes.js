import express from 'express';
import { login, me, register, updateProfile, googleAuth, verifyOTP } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);

export default router;


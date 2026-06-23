import express from 'express';
import { login, me, register, updateProfile, googleAuth, verifyOTP, getAllUsers, forgotPassword, resetPassword } from '../controllers/authController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', requireAuth, me);
router.put('/profile', requireAuth, updateProfile);
router.get('/users', requireAuth, requireAdmin, getAllUsers);

export default router;


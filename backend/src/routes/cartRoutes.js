import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items', updateCartItem);
router.delete('/items', removeCartItem);
router.delete('/', clearCart);

export default router;


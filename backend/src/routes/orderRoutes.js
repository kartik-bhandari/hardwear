import express from 'express';
import { requireAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { createOrderFromCart, getAllOrders, getMyOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', createOrderFromCart);
router.get('/mine', getMyOrders);

router.get('/', requireAdmin, getAllOrders);
router.put('/:id/status', requireAdmin, updateOrderStatus);

export default router;


import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getWishlist);
router.post('/items', addToWishlist);
router.delete('/items', removeFromWishlist);

export default router;


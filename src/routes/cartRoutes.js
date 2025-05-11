// routes/cartRoutes.js
import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);

export default router;

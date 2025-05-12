// routes/cartRoutes.js
import express from 'express';
import { orderDetails } from '../controllers/orderController.js';

const router = express.Router();

router.post('/details', orderDetails);

export default router;

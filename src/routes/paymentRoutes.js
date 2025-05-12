// routes/paymentRoutes.js
import express from 'express';
import { createOrder, checkPaymentStatus } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.get('/status/:orderId', checkPaymentStatus);

export default router;

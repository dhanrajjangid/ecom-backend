// routes/cartRoutes.js
import express from 'express';
import {
    orderDetails, 
    getUserOrders,
    getOrderById,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/details', orderDetails);
router.get('/user/:userId', getUserOrders);
router.get('/:orderId', getOrderById);

export default router;

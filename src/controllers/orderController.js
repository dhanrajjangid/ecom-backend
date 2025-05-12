import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const router = express.Router();

export const orderDetails = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Missing userId in request body' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        const detailedItems = [];
        let subtotal = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.productId);

            if (!product) continue;

            const price = product.salePrice ?? product.price;
            const total = price * item.quantity;

            detailedItems.push({
                productId: product._id,
                name: product.name,
                thumbnail: product.thumbnail,
                price,
                quantity: item.quantity,
                total,
            });

            subtotal += total;
        }

        const shipping = 0;
        const total = subtotal + shipping;

        // Step 5: Send the order details as the response
        res.json({
            items: detailedItems,
            subtotal,
            shipping,
            total,
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserOrders = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }
  
      res.json(orders);
    } catch (err) {
      console.error('Error fetching user orders:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const getOrderById = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await Order.findById(orderId)
        .populate('items.product', 'name thumbnail salePrice')
        .populate('user', 'name email');
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(order);
    } catch (err) {
      console.error('Error fetching order by ID:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

export default router;

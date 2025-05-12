// controllers/paymentController.js
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch the cart for the logged-in user
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    // Calculate total amount based on cart items
    const items = cart.items.map(item => ({
      product: item.productId._id,
      quantity: item.quantity,
      price: item.productId.salePrice,
      total: item.quantity * item.productId.salePrice,
    }));

    const totalAmount = items.reduce((acc, item) => acc + item.total, 0);

    if (totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid order amount' });
    }

    // Create a Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    // Create the order in the database with items
    const newOrder = new Order({
      user: userId,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      items,  // Add the items directly into the order
    });

    await newOrder.save();

    // Optionally, you can clear the cart after order creation
    await Cart.deleteOne({ userId });

    // Send back the order details to the client
    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: newOrder._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err, "Errorerror")
  }
};

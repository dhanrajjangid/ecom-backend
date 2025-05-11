// controllers/cartController.js
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  const { userId, sessionId } = req.query;

  try {
    const cart = await Cart.findOne({ $or: [{ userId }, { sessionId }] }).populate({
      path: 'items.productId',
      model: Product,
      select: 'name thumbnail salePrice price'
    });

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { userId, sessionId, productId, quantity } = req.body;
  const filter = userId ? { userId } : { sessionId };

  try {
    let cart = await Cart.findOne(filter);
    if (!cart) cart = new Cart({ ...filter, items: [] });

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, sessionId, productId } = req.body;
  const filter = userId ? { userId } : { sessionId };

  try {
    const cart = await Cart.findOne(filter);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId?.toString() !== productId);
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const mergeGuestCartToUser = async (sessionId, userId) => {
  if (!sessionId || !userId) return;

  try {
    const sessionCart = await Cart.findOne({ sessionId });
    if (!sessionCart || sessionCart.items.length === 0) return;

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({ userId, items: [] });
    }

    // Merge logic
    sessionCart.items.forEach((guestItem) => {
      const existingItem = userCart.items.find((item) =>
        item.productId.toString() === guestItem.productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    await userCart.save();
    await Cart.deleteOne({ _id: sessionCart._id });

  } catch (error) {
    console.error('Error merging carts:', error.message);
    throw new Error('Cart merge failed');
  }
};


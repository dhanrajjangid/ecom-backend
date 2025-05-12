import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './src/routes/productRoutes.js';
import authRoutes from './src/routes/authRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import addressRoutes from './src/routes/addressRoutes.js'
import paymentRoutes from './src/routes/paymentRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI,{ serverSelectionTimeoutMS: 30000,})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route setup
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/payment', paymentRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

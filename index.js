import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './src/routes/productRoutes.js';
import authRoutes from './src/routes/authRoutes.js'

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route setup
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

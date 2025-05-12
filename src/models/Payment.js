// models/paymentModel.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  currency: String,
  status: { type: String, default: 'captured' }, // or 'paid'
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);

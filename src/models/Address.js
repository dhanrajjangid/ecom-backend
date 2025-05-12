import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/,
  },
  country: {
    type: String,
    default: 'India',
    required: true,
  },
  landmark: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{9}$/,
  },
  addressType: {
    type: String,
    enum: ['Home', 'Office', 'Other'],
    required: true,
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Pre-save hook to auto-set first address as primary
addressSchema.pre('save', async function (next) {
  if (this.isNew) {
    const existingCount = await mongoose.model('Address').countDocuments({ userId: this.userId });
    if (existingCount === 0) {
      this.isPrimary = true;
    }
  }
  next();
});

export default mongoose.model('Address', addressSchema);

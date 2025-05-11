import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: { type: String },
  attributes: { type: Map, of: String }, // e.g., { size: "M", color: "Black" }
  price: { type: Number },
  stock: { type: Number, default: 0 },
  image: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  images: [{ type: String, required: true }],
  thumbnail: { type: String },

  brand: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String }],

  price: { type: Number, required: true },
  salePrice: { type: Number },
  currency: { type: String, default: 'INR' },

  countInStock: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  backorderAllowed: { type: Boolean, default: false },

  weight: { type: Number }, // in grams
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },

  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  metaTitle: { type: String },
  metaDescription: { type: String },

  gtin: { type: String },
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  visibility: { type: String, enum: ['public', 'private', 'hidden'], default: 'public' },

  variants: [variantSchema],
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;

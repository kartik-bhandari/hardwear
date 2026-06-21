import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL'] }],
    colors: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    category: { type: String, default: 'T-Shirts' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', productSchema);
export default Product;


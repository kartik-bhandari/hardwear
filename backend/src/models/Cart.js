import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1, default: 1 },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
    color: { type: String, required: true },
    priceAtAdd: { type: Number, required: true, min: 0 },
    nameAtAdd: { type: String, required: true },
    imageAtAdd: { type: String, required: true },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;


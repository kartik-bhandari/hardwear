import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

function calcSubtotal(items) {
  return items.reduce((sum, it) => sum + Number(it.priceAtAdd) * Number(it.qty), 0);
}

export const createOrderFromCart = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) {
    res.status(400);
    throw new Error('shippingAddress is required');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const subtotal = calcSubtotal(cart.items);
  const shipping = subtotal >= 1999 ? 0 : 99;
  const total = subtotal + shipping;

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((it) => ({
      product: it.product,
      qty: it.qty,
      size: it.size,
      color: it.color,
      price: it.priceAtAdd,
      name: it.nameAtAdd,
      image: it.imageAtAdd,
    })),
    subtotal,
    shipping,
    total,
    shippingAddress,
    status: 'pending',
    payment: { method: 'mock', isPaid: false },
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({ order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find({}).populate('user', 'name email role').sort({ createdAt: -1 });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || !['pending', 'shipped', 'delivered'].includes(status)) {
    res.status(400);
    throw new Error('Valid status is required (pending|shipped|delivered)');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  const saved = await order.save();
  res.json({ order: saved });
});


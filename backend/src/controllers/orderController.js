import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

function calcSubtotal(items) {
  return items.reduce((sum, it) => sum + Number(it.priceAtAdd) * Number(it.qty), 0);
}

export const createOrderFromCart = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) {
    res.status(400);
    throw new Error('shippingAddress is required');
  }

  const cleanedPhone = shippingAddress.phone ? shippingAddress.phone.replace(/\D/g, '') : '';
  if (cleanedPhone.length !== 10) {
    res.status(400);
    throw new Error('Phone number must be exactly 10 digits');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Validate stock for each item in cart
  const productIds = cart.items.map((it) => it.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productsMap = products.reduce((acc, p) => {
    acc[p._id.toString()] = p;
    return acc;
  }, {});

  for (const item of cart.items) {
    const product = productsMap[item.product.toString()];
    if (!product) {
      res.status(404);
      throw new Error(`Product "${item.nameAtAdd}" not found in our catalog`);
    }
    if (product.stock < item.qty) {
      res.status(400);
      throw new Error(`"${product.name}" has only ${product.stock} units remaining in stock.`);
    }
  }

  const subtotal = calcSubtotal(cart.items);
  const shipping = 0;
  const total = subtotal;

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

  res.status(201).json({ order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id, 'payment.isPaid': true }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find({ 'payment.isPaid': true }).populate('user', 'name email role').sort({ createdAt: -1 });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || !['pending', 'delivered'].includes(status)) {
    res.status(400);
    throw new Error('Valid status is required (pending|delivered)');
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


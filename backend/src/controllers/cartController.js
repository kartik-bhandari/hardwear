import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { normalizeCart } from '../utils/url.js';

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
}

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json({ cart: normalizeCart(cart, req) });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1, size, color } = req.body;
  if (!productId || !size || !color) {
    res.status(400);
    throw new Error('productId, size, color are required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (!product.sizes.includes(size)) {
    res.status(400);
    throw new Error('Size not available');
  }
  if (!product.colors.includes(color)) {
    res.status(400);
    throw new Error('Color not available');
  }

  const cart = await getOrCreateCart(req.user._id);
  const idx = cart.items.findIndex(
    (it) => it.product.toString() === productId && it.size === size && it.color === color,
  );

  const nextQty = Math.max(1, Number(qty));
  const snapshot = {
    product: product._id,
    qty: nextQty,
    size,
    color,
    priceAtAdd: product.price,
    nameAtAdd: product.name,
    imageAtAdd: product.images?.[0] || '',
  };

  if (idx >= 0) {
    cart.items[idx].qty = cart.items[idx].qty + nextQty;
  } else {
    cart.items.push(snapshot);
  }

  await cart.save();
  res.status(201).json({ cart: normalizeCart(cart, req) });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, size, color, qty } = req.body;
  if (!productId || !size || !color || qty == null) {
    res.status(400);
    throw new Error('productId, size, color, qty are required');
  }
  const cart = await getOrCreateCart(req.user._id);
  const idx = cart.items.findIndex(
    (it) => it.product.toString() === productId && it.size === size && it.color === color,
  );
  if (idx < 0) {
    res.status(404);
    throw new Error('Cart item not found');
  }
  cart.items[idx].qty = Math.max(1, Number(qty));
  await cart.save();
  res.json({ cart: normalizeCart(cart, req) });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId, size, color } = req.body;
  if (!productId || !size || !color) {
    res.status(400);
    throw new Error('productId, size, color are required');
  }

  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter(
    (it) => !(it.product.toString() === productId && it.size === size && it.color === color),
  );
  await cart.save();
  res.json({ cart: normalizeCart(cart, req) });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ cart: normalizeCart(cart, req) });
});


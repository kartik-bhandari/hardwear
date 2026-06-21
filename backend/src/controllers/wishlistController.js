import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

async function getOrCreateWishlist(userId) {
  let list = await Wishlist.findOne({ user: userId });
  if (!list) list = await Wishlist.create({ user: userId, items: [] });
  return list;
}

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  res.json({ wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.items.some((it) => it.product.toString() === productId);
  if (!exists) {
    wishlist.items.push({
      product: product._id,
      nameAtAdd: product.name,
      priceAtAdd: product.price,
      imageAtAdd: product.images?.[0] || '',
    });
    await wishlist.save();
  }

  res.status(201).json({ wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    res.status(400);
    throw new Error('productId is required');
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.items = wishlist.items.filter((it) => it.product.toString() !== productId);
  await wishlist.save();
  res.json({ wishlist });
});


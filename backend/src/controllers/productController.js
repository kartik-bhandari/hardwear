import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const listProducts = asyncHandler(async (req, res) => {
  const {
    priceMin,
    priceMax,
    size,
    color,
    sort = 'newest',
    featured,
    q,
  } = req.query;

  const filter = {};
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (featured === 'true') filter.isFeatured = true;
  if (size) filter.sizes = size;
  if (color) filter.colors = { $in: [color] };
  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) filter.price.$gte = Number(priceMin);
    if (priceMax) filter.price.$lte = Number(priceMax);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  const products = await Product.find(filter).sort(sortMap[sort] || sortMap.newest);
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  let product;
  if (req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(req.params.slug);
  } else {
    product = await Product.findOne({ slug: req.params.slug });
  }
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, sizes, colors, images, stock, isFeatured, category } = req.body;
  if (!name || price == null) {
    res.status(400);
    throw new Error('name and price are required');
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let i = 1;
  while (await Product.exists({ slug })) {
    i += 1;
    slug = `${baseSlug}-${i}`;
  }

  const product = await Product.create({
    name,
    slug,
    price: Number(price),
    description: description || '',
    sizes: Array.isArray(sizes) ? sizes : ['S', 'M', 'L', 'XL'],
    colors: Array.isArray(colors) ? colors : [],
    images: Array.isArray(images) ? images : [],
    stock: stock == null ? 0 : Number(stock),
    isFeatured: Boolean(isFeatured),
    category: category || 'T-Shirts',
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatable = ['name', 'price', 'description', 'sizes', 'colors', 'images', 'stock', 'isFeatured', 'category'];
  for (const key of updatable) {
    if (req.body[key] !== undefined) product[key] = req.body[key];
  }

  if (req.body.name && req.body.name !== product.name) {
    product.slug = slugify(req.body.name);
  }

  const saved = await product.save();
  res.json({ product: saved });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ ok: true });
});


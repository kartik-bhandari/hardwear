import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDb from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sampleProducts() {
  return [
    {
      name: 'Core Heavyweight Tee',
      price: 1299,
      description: 'Heavyweight cotton tee with a clean, structured drape.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White'],
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80'],
      stock: 50,
      isFeatured: true,
    },
    {
      name: 'Everyday Essential Tee',
      price: 999,
      description: 'Soft everyday tee with premium stitching and minimal branding.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Charcoal', 'Navy'],
      images: ['https://images.unsplash.com/photo-1520975958225-f0f2c95b0b62?auto=format&fit=crop&w=1200&q=80'],
      stock: 80,
      isFeatured: true,
    },
    {
      name: 'Drop-Shoulder Oversized Tee',
      price: 1499,
      description: 'Oversized fit with drop shoulders for a premium street silhouette.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Sand', 'Olive'],
      images: ['https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1200&q=80'],
      stock: 35,
      isFeatured: false,
    },
  ];
}

async function run() {
  await connectDb();

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@hardwear.dev').toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

  await User.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: 'Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  const base = sampleProducts();
  const used = new Set();
  const withSlugs = base.map((p) => {
    const baseSlug = slugify(p.name);
    let slug = baseSlug;
    let i = 1;
    while (used.has(slug)) {
      i += 1;
      slug = `${baseSlug}-${i}`;
    }
    used.add(slug);
    return { ...p, slug };
  });

  await Product.insertMany(withSlugs);

  // eslint-disable-next-line no-console
  console.log('Seed complete');
  // eslint-disable-next-line no-console
  console.log(`Admin login: ${admin.email} / ${adminPassword}`);

  await mongoose.connection.close();
}

run().catch(async (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});


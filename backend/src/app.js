import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDb from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// Dynamically connect/reconnect to MongoDB on every request if not connected
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDb();
    } catch (err) {
      console.error('Database connection failed:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((v) => v.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow localhost in development
      if (process.env.NODE_ENV === 'development') {
        if (origin && (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:'))) {
          return callback(null, true);
        }
      }
      // Allow server-to-server calls and local tools without origin header.
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);

      console.warn(`[CORS Blocked] Origin "${origin}" is not in the allowed list:`, allowedOrigins);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'HARD-WEAR API is running' });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'hardwear-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', paymentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;


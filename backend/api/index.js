import mongoose from 'mongoose';
import '../src/config/env.js';
import connectDb from '../src/config/db.js';
import app from '../src/app.js';

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

export default app;

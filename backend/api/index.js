import '../src/config/env.js';
import connectDb from '../src/config/db.js';
import app from '../src/app.js';

let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDb();
      isConnected = true;
    } catch (err) {
      console.error('Database connection failed:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

export default app;

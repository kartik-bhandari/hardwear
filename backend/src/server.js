import './config/env.js';
import app from './app.js';
import connectDb from './config/db.js';

const PORT = process.env.PORT || 5000;

await connectDb();

console.log(`[SMTP Config Loaded] Host: "${process.env.SMTP_HOST}", Port: "${process.env.SMTP_PORT}"`);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on port ${PORT}`);
}); // Trigger reload.


import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/create-order
// @access  Private
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    if (amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least 100 paise' });
    }

    const options = {
      amount, // in paise
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay create-order error:', error);
    // Handle authentication failures or external API failure
    if (error.statusCode === 401 || (error.message && error.message.includes('401'))) {
      return res.status(401).json({ message: 'Razorpay authentication failed' });
    }
    res.status(500).json({ message: 'Razorpay API Error', error: error.message || error });
  }
});

// @desc    Verify payment signature
// @route   POST /api/verify-payment
// @access  Private
router.post('/verify-payment', requireAuth, async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required signature verification fields' });
    }

    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
      return res.status(404).json({ message: 'Order not found in database' });
    }

    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: Signature mismatch' });
    }

    dbOrder.payment.isPaid = true;
    dbOrder.payment.method = 'razorpay';
    dbOrder.payment.razorpayOrderId = razorpay_order_id;
    dbOrder.payment.razorpayPaymentId = razorpay_payment_id;
    dbOrder.payment.razorpaySignature = razorpay_signature;

    await dbOrder.save();

    // 1. Deduct stock for each item in the order
    try {
      for (const item of dbOrder.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: -item.qty } }
        );
      }
    } catch (stockErr) {
      console.error('Error reducing stock on payment verification:', stockErr);
    }

    // 2. Clear user's cart upon successful verification
    await Cart.updateOne({ user: dbOrder.user }, { $set: { items: [] } });

    // 3. Send order confirmation email asynchronously
    sendOrderConfirmationEmail(req.user.email, dbOrder).catch((emailErr) => {
      console.error('Error sending order confirmation email:', emailErr);
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and order updated successfully',
      order: dbOrder,
    });
  } catch (error) {
    console.error('Razorpay verify-payment error:', error);
    res.status(500).json({ message: 'Server error during signature verification', error: error.message || error });
  }
});

export default router;

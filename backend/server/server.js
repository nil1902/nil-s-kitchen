const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Create order endpoint
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    
    console.log('Creating order with amount:', amount);
    
    const options = {
      amount: amount,
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    
    console.log('Order created:', order.id);
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
});

// Verify payment endpoint
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    console.log('Verifying payment:', razorpay_payment_id);
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (isAuthentic) {
      console.log('Payment verified successfully:', razorpay_payment_id);
      res.json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      console.log('Invalid signature for payment:', razorpay_payment_id);
      res.status(400).json({
        success: false,
        error: "Invalid signature"
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify payment'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});
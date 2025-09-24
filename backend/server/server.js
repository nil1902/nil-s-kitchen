const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
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

// Initialize Google Sheets
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

let googleSheetsAuth = null;
let googleSheet = null;

// Initialize Google Sheets connection
async function initializeGoogleSheets() {
  try {
    if (!GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEET_ID) {
      console.warn('⚠️ Google Sheets credentials not found in environment variables');
      return false;
    }

    googleSheetsAuth = new JWT({
      email: GOOGLE_SHEETS_CLIENT_EMAIL,
      key: GOOGLE_SHEETS_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    googleSheet = new GoogleSpreadsheet(GOOGLE_SHEET_ID, googleSheetsAuth);
    await googleSheet.loadInfo();
    
    console.log('✅ Google Sheets initialized successfully');
    console.log('📊 Sheet Title:', googleSheet.title);
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error.message);
    return false;
  }
}

// Initialize Google Sheets on startup
initializeGoogleSheets();

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

// Google Sheets endpoints
app.post('/api/log-order', async (req, res) => {
  try {
    const {
      orderId,
      customerName,
      phone,
      email,
      itemsCount,
      totalAmount,
      paymentStatus,
      transactionMode,
      orderDate,
      deliveryAddress,
      paymentId
    } = req.body;

    console.log('📝 Logging order to Google Sheets:', orderId);

    if (!googleSheet) {
      console.warn('⚠️ Google Sheets not initialized, attempting to reinitialize...');
      const initialized = await initializeGoogleSheets();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Google Sheets service unavailable'
        });
      }
    }

    // Get or create the orders sheet
    let sheet = googleSheet.sheetsByTitle['Orders'];
    if (!sheet) {
      sheet = await googleSheet.addSheet({
        title: 'Orders',
        headerValues: [
          'Order ID',
          'Customer Name',
          'Phone',
          'Email',
          'Items Count',
          'Total Amount',
          'Payment Status',
          'Transaction Mode',
          'Order Date',
          'Delivery Address',
          'Payment ID'
        ]
      });
      console.log('✅ Created new Orders sheet');
    }

    // Add the order data
    await sheet.addRow({
      'Order ID': orderId,
      'Customer Name': customerName,
      'Phone': phone,
      'Email': email,
      'Items Count': itemsCount,
      'Total Amount': totalAmount,
      'Payment Status': paymentStatus,
      'Transaction Mode': transactionMode,
      'Order Date': orderDate,
      'Delivery Address': deliveryAddress,
      'Payment ID': paymentId || 'N/A'
    });

    console.log('✅ Order logged to Google Sheets successfully:', orderId);
    
    res.json({
      success: true,
      message: 'Order logged successfully'
    });
  } catch (error) {
    console.error('❌ Failed to log order to Google Sheets:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to log order'
    });
  }
});

app.post('/api/update-payment-status', async (req, res) => {
  try {
    const { orderId, paymentStatus, paymentId } = req.body;

    console.log('🔄 Updating payment status for order:', orderId);

    if (!googleSheet) {
      console.warn('⚠️ Google Sheets not initialized, attempting to reinitialize...');
      const initialized = await initializeGoogleSheets();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Google Sheets service unavailable'
        });
      }
    }

    const sheet = googleSheet.sheetsByTitle['Orders'];
    if (!sheet) {
      return res.status(404).json({
        success: false,
        error: 'Orders sheet not found'
      });
    }

    // Find and update the row
    const rows = await sheet.getRows();
    const targetRow = rows.find(row => row.get('Order ID') === orderId);
    
    if (targetRow) {
      targetRow.set('Payment Status', paymentStatus);
      if (paymentId) {
        targetRow.set('Payment ID', paymentId);
      }
      await targetRow.save();
      
      console.log('✅ Payment status updated successfully:', orderId);
      res.json({
        success: true,
        message: 'Payment status updated successfully'
      });
    } else {
      console.warn('⚠️ Order not found in sheet:', orderId);
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
  } catch (error) {
    console.error('❌ Failed to update payment status:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update payment status'
    });
  }
});

app.get('/api/test-sheets', async (req, res) => {
  try {
    if (!googleSheet) {
      const initialized = await initializeGoogleSheets();
      if (!initialized) {
        return res.status(500).json({
          success: false,
          error: 'Google Sheets service unavailable'
        });
      }
    }

    res.json({
      success: true,
      message: 'Google Sheets connection successful',
      sheetTitle: googleSheet.title
    });
  } catch (error) {
    console.error('❌ Google Sheets test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Google Sheets test failed'
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
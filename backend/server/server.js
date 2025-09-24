const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Startup validation
console.log('🔍 Starting Bengal Bay Server...');
console.log(`📍 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔑 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing'}`);
console.log(`🔐 Razorpay Secret: ${process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Missing'}`);

// Validate required environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  Warning: Razorpay credentials not set. Payment endpoints will not work.');
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Google Sheets (optional feature)
const GOOGLE_SHEETS_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_SHEETS_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

let googleSheetsAuth = null;
let googleSheet = null;

// Initialize Google Sheets connection (non-blocking)
async function initializeGoogleSheets() {
  try {
    if (!GOOGLE_SHEETS_PRIVATE_KEY || !GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEET_ID) {
      console.log('ℹ️  Google Sheets credentials not configured - sheets features disabled');
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
    console.log('ℹ️  Google Sheets initialization failed (optional feature):', error.message);
    return false;
  }
}

// Initialize Google Sheets on startup (non-blocking)
initializeGoogleSheets().catch(() => {
  console.log('ℹ️  Continuing without Google Sheets integration');
});

// Startup/readiness probe for Render
app.get('/ready', (req, res) => {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Bengal Bay Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
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
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Google Sheets endpoints (optional features - won't affect Razorpay)
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
      paymentId,
      deliveryOTP,
      orderStatus,
      otpVerified,
      deliveryVerificationTime,
      orderItems
    } = req.body;

    console.log('📝 Logging order to Google Sheets:', orderId);

    if (!googleSheet) {
      console.log('⚠️ Google Sheets not initialized, attempting to reinitialize...');
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
          'Order Items',
          'Items Count',
          'Total Amount',
          'Payment Status',
          'Transaction Mode',
          'Order Date',
          'Delivery Address',
          'Payment ID',
          'Delivery OTP',
          'Order Status',
          'OTP Verified',
          'Delivery Verification Time',
          'Created At'
        ]
      });
      console.log('✅ Created new Orders sheet with enhanced COD tracking');
    }

    // Process order items - convert array to comma-separated string
    let orderItemsString = 'N/A';
    if (orderItems && Array.isArray(orderItems)) {
      orderItemsString = orderItems.map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (item && item.name) {
          return `${item.name}${item.quantity ? ` (x${item.quantity})` : ''}`;
        }
        return JSON.stringify(item);
      }).join(', ');
    } else if (orderItems && typeof orderItems === 'string') {
      orderItemsString = orderItems;
    }

    // Add the order data
    await sheet.addRow({
      'Order ID': orderId,
      'Customer Name': customerName,
      'Phone': phone,
      'Email': email,
      'Order Items': orderItemsString,
      'Items Count': itemsCount,
      'Total Amount': totalAmount,
      'Payment Status': paymentStatus,
      'Transaction Mode': transactionMode,
      'Order Date': orderDate,
      'Delivery Address': deliveryAddress,
      'Payment ID': paymentId || 'N/A',
      'Delivery OTP': deliveryOTP || 'N/A',
      'Order Status': orderStatus || 'Processing',
      'OTP Verified': otpVerified || false,
      'Delivery Verification Time': deliveryVerificationTime || 'Pending',
      'Created At': new Date().toISOString()
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
      console.log('⚠️ Google Sheets not initialized, attempting to reinitialize...');
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
      console.log('⚠️ Order not found in sheet:', orderId);
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

app.get('/api/orders', async (req, res) => {
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

    const sheet = googleSheet.sheetsByTitle['Orders'];
    if (!sheet) {
      return res.json({
        success: true,
        orders: [],
        message: 'No orders sheet found'
      });
    }

    const rows = await sheet.getRows();
    const orders = rows.map(row => ({
      orderId: row.get('Order ID'),
      customerName: row.get('Customer Name'),
      phone: row.get('Phone'),
      email: row.get('Email'),
      orderItems: row.get('Order Items'),
      itemsCount: row.get('Items Count'),
      totalAmount: row.get('Total Amount'),
      paymentStatus: row.get('Payment Status'),
      transactionMode: row.get('Transaction Mode'),
      orderDate: row.get('Order Date'),
      deliveryAddress: row.get('Delivery Address'),
      paymentId: row.get('Payment ID'),
      deliveryOTP: row.get('Delivery OTP'),
      orderStatus: row.get('Order Status'),
      otpVerified: row.get('OTP Verified'),
      deliveryVerificationTime: row.get('Delivery Verification Time'),
      createdAt: row.get('Created At')
    }));

    console.log('📊 Retrieved', orders.length, 'orders from Google Sheets');

    res.json({
      success: true,
      orders: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('❌ Failed to retrieve orders:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve orders'
    });
  }
});

// 🚚 COD OTP Verification Endpoint (For Delivery Personnel)
app.post('/api/verify-cod-otp', async (req, res) => {
  try {
    const { orderId, enteredOTP, deliveryPersonId } = req.body;

    console.log('🔐 Verifying COD OTP for order:', orderId);

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

    // Find the order
    const rows = await sheet.getRows();
    const targetRow = rows.find(row => row.get('Order ID') === orderId);

    if (!targetRow) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const storedOTP = targetRow.get('Delivery OTP');
    const currentStatus = targetRow.get('Payment Status');

    // Verify OTP
    if (storedOTP === enteredOTP) {
      // Update order status to completed
      targetRow.set('Payment Status', 'Completed');
      targetRow.set('Order Status', 'Delivered & Paid');
      targetRow.set('OTP Verified', true);
      targetRow.set('Delivery Verification Time', new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }));
      targetRow.set('Payment ID', `cod_verified_${Date.now()}`);
      await targetRow.save();

      console.log('✅ COD OTP verified successfully:', orderId);
      res.json({
        success: true,
        message: 'OTP verified successfully. Payment completed.',
        orderStatus: 'Delivered & Paid'
      });
    } else {
      console.warn('❌ Invalid OTP for order:', orderId);
      res.status(400).json({
        success: false,
        error: 'Invalid OTP. Please check and try again.'
      });
    }

  } catch (error) {
    console.error('❌ Failed to verify COD OTP:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify OTP'
    });
  }
});

// 📋 Get Order Details (For Delivery Personnel App)
app.get('/api/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log('📋 Fetching order details:', orderId);

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

    // Find the order
    const rows = await sheet.getRows();
    const targetRow = rows.find(row => row.get('Order ID') === orderId);

    if (!targetRow) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const orderDetails = {
      orderId: targetRow.get('Order ID'),
      customerName: targetRow.get('Customer Name'),
      phone: targetRow.get('Phone'),
      email: targetRow.get('Email'),
      orderItems: targetRow.get('Order Items'),
      totalAmount: targetRow.get('Total Amount'),
      paymentStatus: targetRow.get('Payment Status'),
      transactionMode: targetRow.get('Transaction Mode'),
      orderDate: targetRow.get('Order Date'),
      deliveryAddress: targetRow.get('Delivery Address'),
      orderStatus: targetRow.get('Order Status'),
      otpVerified: targetRow.get('OTP Verified'),
      deliveryVerificationTime: targetRow.get('Delivery Verification Time')
    };

    console.log('✅ Order details fetched successfully:', orderId);
    res.json({
      success: true,
      order: orderDetails
    });

  } catch (error) {
    console.error('❌ Failed to fetch order details:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch order details'
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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bengal Bay API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/api/test',
      createOrder: '/api/create-razorpay-order',
      verifyPayment: '/api/verify-payment',
      logOrder: '/api/log-order',
      updatePaymentStatus: '/api/update-payment-status',
      getOrders: '/api/orders',
      getOrderDetails: '/api/order/:orderId',
      verifyCodOtp: '/api/verify-cod-otp',
      testSheets: '/api/test-sheets'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server with proper error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Bengal Bay Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Process ID: ${process.pid}`);

  // Signal that the server is ready (important for Render)
  if (process.send) {
    process.send('ready');
  }
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Timeout safety - if server doesn't start in 30 seconds, exit
const startupTimeout = setTimeout(() => {
  console.error('Server startup timeout - exiting');
  process.exit(1);
}, 30000);

server.on('listening', () => {
  clearTimeout(startupTimeout);
  console.log('✅ Server is listening and ready to accept connections');
});
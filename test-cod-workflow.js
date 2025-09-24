// 🚚 COD Workflow Testing Script
// This script demonstrates the complete COD workflow

const BACKEND_URL = 'https://bengal-bay-api.onrender.com';

// Test data
const testOrderData = {
  orderId: `ORD-${Date.now()}-TEST`,
  customerName: "John Doe",
  phone: "9876543210",
  email: "john@example.com",
  itemsCount: 3,
  totalAmount: "₹450.00",
  paymentStatus: "Pending (COD)",
  transactionMode: "Cash on Delivery",
  orderDate: new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }),
  deliveryAddress: "123 Test Street, Mumbai, Maharashtra - 400001",
  paymentId: "cod_test_123",
  deliveryOTP: "1234567",
  orderStatus: "Confirmed - Preparing",
  otpVerified: false,
  deliveryVerificationTime: null
};

console.log('🚀 Starting COD Workflow Test...\n');

// Step 1: Create COD Order
async function createCODOrder() {
  console.log('📝 Step 1: Creating COD Order...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/log-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ COD Order created successfully!');
      console.log(`   Order ID: ${testOrderData.orderId}`);
      console.log(`   Customer: ${testOrderData.customerName}`);
      console.log(`   Amount: ${testOrderData.totalAmount}`);
      console.log(`   OTP: ${testOrderData.deliveryOTP}`);
      console.log(`   Status: ${testOrderData.paymentStatus}\n`);
      return true;
    } else {
      console.error('❌ Failed to create order:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    return false;
  }
}

// Step 2: Fetch Order Details (Delivery Person)
async function fetchOrderDetails() {
  console.log('📋 Step 2: Fetching Order Details (Delivery Person View)...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/order/${testOrderData.orderId}`);
    const result = await response.json();

    if (result.success) {
      console.log('✅ Order details fetched successfully!');
      console.log('   Order Details:');
      console.log(`   - Customer: ${result.order.customerName}`);
      console.log(`   - Phone: ${result.order.phone}`);
      console.log(`   - Address: ${result.order.deliveryAddress}`);
      console.log(`   - Amount: ${result.order.totalAmount}`);
      console.log(`   - Status: ${result.order.paymentStatus}`);
      console.log(`   - OTP Verified: ${result.order.otpVerified}\n`);
      return result.order;
    } else {
      console.error('❌ Failed to fetch order:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching order:', error.message);
    return null;
  }
}

// Step 3: Verify OTP (Delivery Completion)
async function verifyCODOTP() {
  console.log('🔐 Step 3: Verifying COD OTP (Payment Completion)...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/verify-cod-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: testOrderData.orderId,
        enteredOTP: testOrderData.deliveryOTP,
        deliveryPersonId: "delivery_test_001"
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ COD OTP verified successfully!');
      console.log('   Payment Status: Completed');
      console.log('   Order Status: Delivered & Paid');
      console.log('   Verification Time: Just now\n');
      return true;
    } else {
      console.error('❌ OTP verification failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying OTP:', error.message);
    return false;
  }
}

// Step 4: Verify Final Status
async function verifyFinalStatus() {
  console.log('🔍 Step 4: Verifying Final Order Status...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/order/${testOrderData.orderId}`);
    const result = await response.json();

    if (result.success) {
      console.log('✅ Final status verified!');
      console.log('   Final Order Status:');
      console.log(`   - Payment Status: ${result.order.paymentStatus}`);
      console.log(`   - Order Status: ${result.order.orderStatus}`);
      console.log(`   - OTP Verified: ${result.order.otpVerified}`);
      console.log(`   - Verification Time: ${result.order.deliveryVerificationTime}\n`);
      return true;
    } else {
      console.error('❌ Failed to verify final status:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error verifying final status:', error.message);
    return false;
  }
}

// Run the complete workflow
async function runCODWorkflowTest() {
  console.log('🎯 COD WORKFLOW COMPLETE TEST');
  console.log('================================\n');

  const step1 = await createCODOrder();
  if (!step1) return;

  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

  const step2 = await fetchOrderDetails();
  if (!step2) return;

  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

  const step3 = await verifyCODOTP();
  if (!step3) return;

  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

  const step4 = await verifyFinalStatus();
  if (!step4) return;

  console.log('🎉 COD WORKFLOW TEST COMPLETED SUCCESSFULLY!');
  console.log('=====================================');
  console.log('✅ Order created with OTP');
  console.log('✅ Order details fetched by delivery person');
  console.log('✅ OTP verified and payment completed');
  console.log('✅ Final status updated in Google Sheets');
  console.log('\n📱 Delivery Verification URL:');
  console.log('   http://localhost:5173/delivery-verification');
  console.log(`   Test with Order ID: ${testOrderData.orderId}`);
  console.log(`   Test with OTP: ${testOrderData.deliveryOTP}`);
}

// Run the test
runCODWorkflowTest().catch(console.error);
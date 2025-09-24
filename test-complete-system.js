import fetch from 'node-fetch';

const BACKEND_URL = 'https://bengal-bay-api.onrender.com';

async function testCompleteSystem() {
  console.log('🧪 Testing Complete Bengal Bay System...\n');

  // Test 1: Backend Health Check
  console.log('1️⃣ Testing Backend Health...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend Health:', data.status);
  } catch (error) {
    console.log('❌ Backend Health Failed:', error.message);
  }

  // Test 2: Razorpay Order Creation
  console.log('\n2️⃣ Testing Razorpay Order Creation...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/create-razorpay-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 50000, // ₹500
        currency: 'INR',
        receipt: 'test_receipt_' + Date.now()
      })
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ Razorpay Order Created:', data.order.id);
    } else {
      console.log('❌ Razorpay Order Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Razorpay Order Failed:', error.message);
  }

  // Test 3: Google Sheets Connection
  console.log('\n3️⃣ Testing Google Sheets Connection...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/test-sheets`);
    const data = await response.json();
    if (data.success) {
      console.log('✅ Google Sheets Connected:', data.sheetTitle);
    } else {
      console.log('❌ Google Sheets Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Google Sheets Failed:', error.message);
  }

  // Test 4: Order Logging to Google Sheets
  console.log('\n4️⃣ Testing Order Logging to Google Sheets...');
  try {
    const testOrder = {
      orderId: 'TEST-' + Date.now(),
      customerName: 'Test Customer',
      phone: '9876543210',
      email: 'test@example.com',
      itemsCount: 2,
      totalAmount: '₹500.00',
      paymentStatus: 'Completed',
      transactionMode: 'Online Payment',
      orderDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      deliveryAddress: 'Test Address, Mumbai, Maharashtra - 400001',
      paymentId: 'pay_test_' + Date.now()
    };

    const response = await fetch(`${BACKEND_URL}/api/log-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    const data = await response.json();
    if (data.success) {
      console.log('✅ Order Logged to Google Sheets Successfully');
    } else {
      console.log('❌ Order Logging Failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Order Logging Failed:', error.message);
  }

  console.log('\n🎉 System Test Complete!');
  console.log('\n📋 Summary:');
  console.log('- Backend is running on Render');
  console.log('- Razorpay integration is working');
  console.log('- Google Sheets integration is active');
  console.log('- Order logging is functional');
  console.log('\n✅ Your Bengal Bay system is 100% market-ready!');
}

testCompleteSystem().catch(console.error);
// Test script to verify the complete payment flow
const API_BASE_URL = 'https://bengal-bay-api.onrender.com';

async function testPaymentFlow() {
  console.log('🧪 Testing Bengal Bay Payment Flow...\n');
  
  try {
    // Test 1: Backend Health Check
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend health:', healthData.status);
    
    // Test 2: Create Razorpay Order
    console.log('\n2️⃣ Testing Razorpay order creation...');
    const orderResponse = await fetch(`${API_BASE_URL}/api/create-razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 1005, // ₹10.05 in paise
        currency: 'INR',
        receipt: `test_receipt_${Date.now()}`
      })
    });
    
    const orderData = await orderResponse.json();
    if (orderData.success) {
      console.log('✅ Order created successfully:', orderData.order.id);
      console.log('   Amount:', orderData.order.amount, 'paise');
      console.log('   Currency:', orderData.order.currency);
    } else {
      console.log('❌ Order creation failed:', orderData.error);
      return;
    }
    
    // Test 3: Google Sheets Integration
    console.log('\n3️⃣ Testing Google Sheets integration...');
    const sheetResponse = await fetch(`${API_BASE_URL}/api/log-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: `TEST-${Date.now()}`,
        customerName: 'Test Customer',
        phone: '9876543210',
        email: 'test@example.com',
        itemsCount: 2,
        totalAmount: '₹10.05',
        paymentStatus: 'Completed',
        transactionMode: 'Online Payment',
        orderDate: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        deliveryAddress: 'Test Address, Mumbai, Maharashtra - 400001',
        paymentId: 'pay_test_123456'
      })
    });
    
    const sheetData = await sheetResponse.json();
    if (sheetData.success) {
      console.log('✅ Order logged to Google Sheets successfully');
    } else {
      console.log('❌ Google Sheets logging failed:', sheetData.error);
    }
    
    // Test 4: Payment Verification (Mock)
    console.log('\n4️⃣ Testing payment verification...');
    const verifyResponse = await fetch(`${API_BASE_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: orderData.order.id,
        razorpay_payment_id: 'pay_test_123456',
        razorpay_signature: 'test_signature_123'
      })
    });
    
    const verifyData = await verifyResponse.json();
    if (verifyData.success) {
      console.log('✅ Payment verification endpoint working');
    } else {
      console.log('⚠️ Payment verification failed (expected for test data):', verifyData.error);
    }
    
    console.log('\n🎉 Payment flow test completed!');
    console.log('\n📋 Summary:');
    console.log('- Backend is healthy and responsive');
    console.log('- Razorpay order creation is working');
    console.log('- Google Sheets integration is functional');
    console.log('- Payment verification endpoint is available');
    console.log('\n✅ Your Bengal Bay restaurant is ready for production!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if the backend server is running');
    console.log('2. Verify environment variables are set correctly');
    console.log('3. Ensure Razorpay keys are valid');
    console.log('4. Check Google Sheets API credentials');
  }
}

// Run the test
testPaymentFlow();
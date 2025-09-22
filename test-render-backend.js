// Test script to verify Render backend connection
const testRenderBackend = async () => {
  const BACKEND_URL = 'https://bengal-bay-api.onrender.com';
  
  console.log('🧪 Testing Render Backend Connection...');
  console.log('🔗 Backend URL:', BACKEND_URL);
  console.log('');
  
  try {
    // Test 1: Health Check
    console.log('📡 Test 1: Health Check');
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check: SUCCESS');
      console.log('📊 Response:', healthData);
    } else {
      console.log('❌ Health Check: FAILED');
      console.log('📊 Status:', healthResponse.status);
    }
    console.log('');
    
    // Test 2: API Test
    console.log('📡 Test 2: API Test');
    const apiResponse = await fetch(`${BACKEND_URL}/api/test`);
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('✅ API Test: SUCCESS');
      console.log('📊 Response:', apiData);
    } else {
      console.log('❌ API Test: FAILED');
      console.log('📊 Status:', apiResponse.status);
    }
    console.log('');
    
    // Test 3: Payment Order Creation
    console.log('📡 Test 3: Payment Order Creation');
    const orderResponse = await fetch(`${BACKEND_URL}/api/create-razorpay-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 10000, // ₹100 in paise
        currency: 'INR',
        receipt: 'test_receipt_' + Date.now()
      })
    });
    
    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Payment Order: SUCCESS');
      console.log('📊 Order ID:', orderData.order?.id);
      console.log('💰 Amount:', orderData.order?.amount, 'paise (₹' + (orderData.order?.amount / 100) + ')');
    } else {
      console.log('❌ Payment Order: FAILED');
      console.log('📊 Status:', orderResponse.status);
      const errorText = await orderResponse.text();
      console.log('📊 Error:', errorText);
    }
    
    console.log('');
    console.log('🎉 Backend Connection Test Complete!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Go to: http://localhost:5173');
    console.log('3. Try checkout and payment');
    console.log('4. Check browser console for connection logs');
    
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('');
    console.log('🔧 Possible Issues:');
    console.log('- Backend might be sleeping (wait 30 seconds and try again)');
    console.log('- Network connectivity issues');
    console.log('- Backend deployment failed');
    console.log('');
    console.log('💡 Solutions:');
    console.log('1. Visit https://bengal-bay-api.onrender.com/health in browser');
    console.log('2. Wait 30 seconds for backend to wake up');
    console.log('3. Run this test again');
  }
};

// Run the test
testRenderBackend();
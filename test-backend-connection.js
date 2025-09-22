// Quick test to check if backend is running
const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend health check:', healthData);
    } else {
      console.log('❌ Backend health check failed:', healthResponse.status);
    }
    
    // Test API endpoint
    const apiResponse = await fetch('http://localhost:5000/api/test');
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('✅ Backend API test:', apiData);
    } else {
      console.log('❌ Backend API test failed:', apiResponse.status);
    }
    
    // Test Razorpay order creation
    const orderResponse = await fetch('http://localhost:5000/api/create-razorpay-order', {
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
      console.log('✅ Razorpay order creation test:', orderData);
    } else {
      console.log('❌ Razorpay order creation failed:', orderResponse.status);
      const errorText = await orderResponse.text();
      console.log('Error details:', errorText);
    }
    
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    console.log('Make sure your backend server is running on http://localhost:5000');
  }
};

// Run the test
testBackend();
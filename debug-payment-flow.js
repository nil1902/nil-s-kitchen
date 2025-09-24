import fetch from 'node-fetch';

const BACKEND_URL = 'https://bengal-bay-api.onrender.com';

async function debugPaymentFlow() {
  console.log('🔍 Debugging Payment Flow...\n');

  // Test the exact data that should be sent after payment
  const testOrderData = {
    orderId: 'ORD-' + Math.floor(Math.random() * 1000000),
    customerName: 'Test Customer',
    phone: '9876543210',
    email: 'test@example.com',
    itemsCount: 2,
    totalAmount: '₹500.00',
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
    paymentId: 'pay_test_' + Date.now()
  };

  console.log('📝 Test Order Data:');
  console.log(JSON.stringify(testOrderData, null, 2));
  console.log('\n');

  try {
    console.log('🚀 Sending to backend...');
    const response = await fetch(`${BACKEND_URL}/api/log-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData),
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers));

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success Response:', result);
      console.log('\n🎉 Order should now appear in your Google Sheet!');
      console.log('📋 Check: https://docs.google.com/spreadsheets/d/1Z_ujaIqaXoReK-75BR9vcxLGxHd5ctI3683DOayFwpU/edit');
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }

  console.log('\n🔍 Next Steps:');
  console.log('1. Check your Google Sheet for the test order');
  console.log('2. If it appears, the backend is working');
  console.log('3. If not, check Render logs for errors');
  console.log('4. Make sure environment variables are set correctly');
}

debugPaymentFlow().catch(console.error);
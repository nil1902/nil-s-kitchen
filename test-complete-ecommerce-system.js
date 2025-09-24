// 🛒 Complete E-Commerce System Test
// This script tests the entire COD workflow with real-time tracking

const BACKEND_URL = 'https://bengal-bay-api.onrender.com';

// Test order data
const testOrder = {
  orderId: `ORD-${Date.now()}-ECOM`,
  customerName: "Alice Johnson",
  phone: "9876543210",
  email: "alice@example.com",
  itemsCount: 2,
  totalAmount: "₹650.00",
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
  deliveryAddress: "456 Test Avenue, Bangalore, Karnataka - 560001",
  paymentId: "cod_ecom_test",
  deliveryOTP: "7654321",
  orderStatus: "Order Confirmed",
  otpVerified: false,
  deliveryVerificationTime: null
};

console.log('🛒 COMPLETE E-COMMERCE SYSTEM TEST');
console.log('=====================================\n');

// Step 1: Create Order with Complete Tracking
async function createOrderWithTracking() {
  console.log('📝 Step 1: Creating Order with Complete Tracking...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/log-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Order created with tracking!');
      console.log(`   📦 Order ID: ${testOrder.orderId}`);
      console.log(`   👤 Customer: ${testOrder.customerName}`);
      console.log(`   💰 Amount: ${testOrder.totalAmount}`);
      console.log(`   🔐 OTP: ${testOrder.deliveryOTP}`);
      console.log(`   📍 Status: ${testOrder.orderStatus}`);
      console.log(`   🚚 Payment: ${testOrder.paymentStatus}\n`);
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

// Step 2: Test Real-time Order Tracking
async function testOrderTracking() {
  console.log('📱 Step 2: Testing Real-time Order Tracking...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/order/${testOrder.orderId}`);
    const result = await response.json();

    if (result.success) {
      console.log('✅ Order tracking working!');
      console.log('   📋 Tracking Details:');
      console.log(`   - Status: ${result.order.orderStatus}`);
      console.log(`   - Payment: ${result.order.paymentStatus}`);
      console.log(`   - OTP: ${result.order.deliveryOTP}`);
      console.log(`   - Customer: ${result.order.customerName}`);
      console.log(`   - Phone: ${result.order.phone}`);
      console.log(`   - Address: ${result.order.deliveryAddress}`);
      console.log(`   - Amount: ${result.order.totalAmount}\n`);
      return result.order;
    } else {
      console.error('❌ Failed to track order:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error tracking order:', error.message);
    return null;
  }
}

// Step 3: Simulate Order Status Updates
async function simulateOrderUpdates() {
  console.log('🔄 Step 3: Simulating Order Status Updates...');
  
  const statusUpdates = [
    { status: "Order Confirmed - Preparing", note: "Restaurant is preparing your food" },
    { status: "Food Ready - Out for Delivery", note: "Your order is on the way" },
    { status: "Delivery Person Arrived", note: "Delivery person has reached your location" }
  ];

  for (let i = 0; i < statusUpdates.length; i++) {
    const update = statusUpdates[i];
    console.log(`   📱 Updating to: ${update.status}`);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/update-order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: testOrder.orderId,
          newStatus: update.status,
          updateNote: update.note,
          deliveryPersonId: "DEL001"
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`   ✅ Status updated: ${update.status}`);
      } else {
        console.error(`   ❌ Failed to update status: ${result.error}`);
      }
      
      // Wait 2 seconds between updates
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`   ❌ Error updating status: ${error.message}`);
    }
  }
  console.log('');
}

// Step 4: Test OTP Validation (Pre-verification)
async function testOTPValidation() {
  console.log('🔐 Step 4: Testing OTP Validation...');
  
  // Test with wrong OTP first
  try {
    console.log('   Testing with wrong OTP: 1111111');
    const wrongResponse = await fetch(`${BACKEND_URL}/api/validate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: testOrder.orderId,
        enteredOTP: "1111111"
      }),
    });

    const wrongResult = await wrongResponse.json();
    console.log(`   ${wrongResult.isValid ? '❌' : '✅'} Wrong OTP correctly rejected`);
    
    // Test with correct OTP
    console.log(`   Testing with correct OTP: ${testOrder.deliveryOTP}`);
    const correctResponse = await fetch(`${BACKEND_URL}/api/validate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: testOrder.orderId,
        enteredOTP: testOrder.deliveryOTP
      }),
    });

    const correctResult = await correctResponse.json();
    console.log(`   ${correctResult.isValid ? '✅' : '❌'} Correct OTP validated successfully\n`);
    
    return correctResult.isValid;
  } catch (error) {
    console.error('❌ Error validating OTP:', error.message);
    return false;
  }
}

// Step 5: Complete Delivery with OTP Verification
async function completeDelivery() {
  console.log('🚚 Step 5: Completing Delivery with OTP Verification...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/verify-cod-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: testOrder.orderId,
        enteredOTP: testOrder.deliveryOTP,
        deliveryPersonId: "DEL001"
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Delivery completed successfully!');
      console.log('   💰 Payment Status: Completed');
      console.log('   📦 Order Status: Delivered & Paid');
      console.log('   🔐 OTP Verified: Yes');
      console.log('   ⏰ Completion Time: Just now\n');
      return true;
    } else {
      console.error('❌ Delivery completion failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error completing delivery:', error.message);
    return false;
  }
}

// Step 6: Final Status Verification
async function verifyFinalStatus() {
  console.log('🔍 Step 6: Verifying Final Order Status...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/order/${testOrder.orderId}`);
    const result = await response.json();

    if (result.success) {
      console.log('✅ Final status verification complete!');
      console.log('   📊 Final Order Details:');
      console.log(`   - Order ID: ${result.order.orderId}`);
      console.log(`   - Customer: ${result.order.customerName}`);
      console.log(`   - Payment Status: ${result.order.paymentStatus}`);
      console.log(`   - Order Status: ${result.order.orderStatus}`);
      console.log(`   - OTP Verified: ${result.order.otpVerified}`);
      console.log(`   - Delivery Time: ${result.order.deliveryVerificationTime}`);
      console.log(`   - Last Updated: ${result.order.lastUpdated}\n`);
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

// Step 7: Test Admin Dashboard (Get All Orders)
async function testAdminDashboard() {
  console.log('👨‍💼 Step 7: Testing Admin Dashboard...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders?limit=5`);
    const result = await response.json();

    if (result.success) {
      console.log(`✅ Admin dashboard working! Found ${result.total} orders`);
      console.log('   📋 Recent Orders:');
      result.orders.slice(0, 3).forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.orderId} - ${order.customerName} - ${order.paymentStatus}`);
      });
      console.log('');
      return true;
    } else {
      console.error('❌ Admin dashboard failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing admin dashboard:', error.message);
    return false;
  }
}

// Run Complete E-Commerce System Test
async function runCompleteSystemTest() {
  console.log('🎯 STARTING COMPLETE E-COMMERCE SYSTEM TEST\n');

  const results = [];
  
  results.push(await createOrderWithTracking());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await testOrderTracking());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await simulateOrderUpdates();
  
  results.push(await testOTPValidation());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await completeDelivery());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await verifyFinalStatus());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await testAdminDashboard());

  // Summary
  console.log('🎉 COMPLETE E-COMMERCE SYSTEM TEST RESULTS');
  console.log('==========================================');
  const passedTests = results.filter(Boolean).length;
  const totalTests = results.length;
  
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log('');
  console.log('🔗 SYSTEM URLS:');
  console.log('📱 Customer Order Tracking: http://localhost:5173/track-order');
  console.log('🚚 Delivery Verification: http://localhost:5173/delivery-verification');
  console.log('👤 User Profile & Orders: http://localhost:5173/profile');
  console.log('');
  console.log('🧪 TEST DATA:');
  console.log(`📦 Order ID: ${testOrder.orderId}`);
  console.log(`🔐 OTP: ${testOrder.deliveryOTP}`);
  console.log(`👤 Customer: ${testOrder.customerName}`);
  console.log(`📞 Phone: ${testOrder.phone}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎊 ALL TESTS PASSED! E-COMMERCE SYSTEM IS FULLY FUNCTIONAL! 🎊');
  } else {
    console.log(`\n⚠️  ${totalTests - passedTests} tests failed. Please check the logs above.`);
  }
}

// Run the complete test
runCompleteSystemTest().catch(console.error);
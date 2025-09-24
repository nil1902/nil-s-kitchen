// Comprehensive test script for Bengal Bay API endpoints
const API_BASE_URL = 'https://bengal-bay-api.onrender.com';

async function testEndpoint(name, url, method = 'GET', body = null) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name} - SUCCESS`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`❌ ${name} - FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error:`, JSON.stringify(data, null, 2));
    }
    
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`❌ ${name} - ERROR`);
    console.log(`   Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Bengal Bay API Tests...\n');
  console.log(`📍 Testing API at: ${API_BASE_URL}`);
  
  const tests = [
    // Basic health checks
    {
      name: 'Health Check',
      url: `${API_BASE_URL}/health`,
      method: 'GET'
    },
    {
      name: 'API Test',
      url: `${API_BASE_URL}/api/test`,
      method: 'GET'
    },
    {
      name: 'Root Endpoint',
      url: `${API_BASE_URL}/`,
      method: 'GET'
    },
    
    // Google Sheets tests
    {
      name: 'Google Sheets Test',
      url: `${API_BASE_URL}/api/test-sheets`,
      method: 'GET'
    },
    
    // Razorpay tests
    {
      name: 'Create Razorpay Order',
      url: `${API_BASE_URL}/api/create-razorpay-order`,
      method: 'POST',
      body: {
        amount: 50000,
        currency: 'INR',
        receipt: `test_receipt_${Date.now()}`
      }
    },
    
    // Order logging test
    {
      name: 'Log Order to Google Sheets',
      url: `${API_BASE_URL}/api/log-order`,
      method: 'POST',
      body: {
        orderId: `TEST_ORDER_${Date.now()}`,
        customerName: 'Test Customer',
        phone: '9999999999',
        email: 'test@example.com',
        orderItems: ['Test Item 1', 'Test Item 2'],
        itemsCount: 2,
        totalAmount: 500,
        paymentStatus: 'Pending',
        transactionMode: 'Test',
        orderDate: new Date().toISOString(),
        deliveryAddress: 'Test Address, Test City',
        orderStatus: 'Processing'
      }
    },
    
    // Get orders test
    {
      name: 'Get All Orders',
      url: `${API_BASE_URL}/api/orders`,
      method: 'GET'
    }
  ];
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url, test.method, test.body);
    results.push({ ...test, result });
    
    // Add delay between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  
  const passed = results.filter(r => r.result.success).length;
  const failed = results.filter(r => !r.result.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.result.success).forEach(test => {
      console.log(`   - ${test.name}: ${test.result.error || 'HTTP ' + test.result.status}`);
    });
  }
  
  console.log('\n🎉 All tests completed!');
}

// Run the tests
runAllTests().catch(console.error);
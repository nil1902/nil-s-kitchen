import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOrderTracking } from '@/hooks/useOrderTracking';

const GoogleSheetsTest: React.FC = () => {
  const { testConnection, logOrderToSheet, isLogging, error } = useOrderTracking();
  const [testResult, setTestResult] = useState<string>('');

  const handleTestConnection = async () => {
    setTestResult('Testing connection...');
    try {
      const result = await testConnection();
      setTestResult(result ? '✅ Connection successful!' : '❌ Connection failed');
    } catch (err) {
      setTestResult(`❌ Error: ${err}`);
    }
  };

  const handleTestOrder = async () => {
    setTestResult('Testing order logging...');
    try {
      const testOrderData = {
        orderId: `TEST-${Date.now()}`,
        customerName: 'Test Customer',
        phone: '9876543210',
        email: 'test@example.com',
        items: [
          { id: 1, name: 'Test Item 1', quantity: 2, price: 100 },
          { id: 2, name: 'Test Item 2', quantity: 1, price: 150 }
        ],
        totalAmount: 350,
        paymentStatus: 'Completed',
        transactionMode: 'Online',
        deliveryAddress: 'Test Address, Test City, Test State - 123456',
        paymentId: 'test_payment_123'
      };

      await logOrderToSheet(testOrderData);
      setTestResult('✅ Test order logged successfully!');
    } catch (err) {
      setTestResult(`❌ Error logging order: ${err}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Google Sheets Test</h2>
      
      <div className="space-y-4">
        <Button 
          onClick={handleTestConnection}
          disabled={isLogging}
          className="w-full"
        >
          Test Connection
        </Button>
        
        <Button 
          onClick={handleTestOrder}
          disabled={isLogging}
          className="w-full"
          variant="outline"
        >
          Test Order Logging
        </Button>
        
        {testResult && (
          <div className={`p-3 rounded-md ${
            testResult.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {testResult}
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-md">
            Error: {error}
          </div>
        )}
        
        {isLogging && (
          <div className="text-center text-gray-600">
            Processing...
          </div>
        )}
      </div>
      
      <div className="mt-6 text-xs text-gray-500">
        <p>Sheet URL: <a href="https://docs.google.com/spreadsheets/d/1Z_ujaIqaXoReK-75BR9vcxLGxHd5ctI3683DOayFwpU/edit" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Sheet</a></p>
      </div>
    </div>
  );
};

export default GoogleSheetsTest;
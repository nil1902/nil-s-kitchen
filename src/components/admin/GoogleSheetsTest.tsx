import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOrderTracking } from '@/hooks/useOrderTracking';

const GoogleSheetsTest: React.FC = () => {
  const { testConnection, logOrderToSheet, syncPendingData, isLogging, error } = useOrderTracking();
  const [testResult, setTestResult] = useState<string>('');

  const handleTestConnection = async () => {
    setTestResult('Testing backend connection...');
    try {
      const result = await testConnection();
      setTestResult(result ? '✅ Backend connection successful!' : '❌ Backend connection failed - using local backup');
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

      const result = await logOrderToSheet(testOrderData);
      if (result) {
        setTestResult('✅ Test order logged successfully!');
      } else {
        setTestResult('⚠️ Order saved locally - will sync when backend is available');
      }
    } catch (err) {
      setTestResult(`❌ Error logging order: ${err}`);
    }
  };

  const handleSyncPending = async () => {
    setTestResult('Syncing pending data...');
    try {
      await syncPendingData();
      setTestResult('✅ Pending data sync completed!');
    } catch (err) {
      setTestResult(`❌ Sync failed: ${err}`);
    }
  };

  const checkPendingData = () => {
    const pendingOrders = JSON.parse(localStorage.getItem('pending_sheet_orders') || '[]');
    const pendingUpdates = JSON.parse(localStorage.getItem('pending_payment_updates') || '[]');
    
    setTestResult(`📊 Pending Orders: ${pendingOrders.length}, Pending Updates: ${pendingUpdates.length}`);
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
          Test Backend Connection
        </Button>
        
        <Button 
          onClick={handleTestOrder}
          disabled={isLogging}
          className="w-full"
          variant="outline"
        >
          Test Order Logging
        </Button>

        <Button 
          onClick={checkPendingData}
          disabled={isLogging}
          className="w-full"
          variant="secondary"
        >
          Check Pending Data
        </Button>

        <Button 
          onClick={handleSyncPending}
          disabled={isLogging}
          className="w-full"
          variant="destructive"
        >
          Sync Pending Data
        </Button>
        
        {testResult && (
          <div className={`p-3 rounded-md ${
            testResult.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : testResult.includes('⚠️') || testResult.includes('📊')
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
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
        <p><strong>How it works:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Orders try backend first</li>
          <li>Falls back to local storage if backend fails</li>
          <li>Syncs when backend becomes available</li>
        </ul>
        <p className="mt-2">Sheet URL: <a href="https://docs.google.com/spreadsheets/d/1Z_ujaIqaXoReK-75BR9vcxLGxHd5ctI3683DOayFwpU/edit" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Sheet</a></p>
      </div>
    </div>
  );
};

export default GoogleSheetsTest;
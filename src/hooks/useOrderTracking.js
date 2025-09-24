import { useState, useCallback } from 'react';
import googleSheetsService from '../services/googleSheets';

export const useOrderTracking = () => {
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState(null);

  const logOrderToSheet = useCallback(async (orderDetails) => {
    setIsLogging(true);
    setError(null);

    try {
      // Prepare order data for Google Sheets
      const orderData = {
        orderId: orderDetails.orderId || `ORD-${Date.now()}`,
        customerName: orderDetails.customerName || 'Guest',
        phone: orderDetails.phone || 'N/A',
        email: orderDetails.email || 'N/A',
        itemsCount: orderDetails.items?.length || 0,
        totalAmount: `₹${orderDetails.totalAmount || 0}`,
        paymentStatus: orderDetails.paymentStatus || 'Pending',
        transactionMode: orderDetails.transactionMode || 'Online',
        orderDate: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        deliveryAddress: orderDetails.deliveryAddress || 'N/A',
        paymentId: orderDetails.paymentId || null
      };

      await googleSheetsService.addOrderToSheet(orderData);
      console.log('✅ Order logged to Google Sheets successfully');
      
      return orderData;
    } catch (err) {
      console.error('❌ Failed to log order to Google Sheets:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLogging(false);
    }
  }, []);

  const updatePaymentStatus = useCallback(async (orderId, paymentStatus, paymentId) => {
    setIsLogging(true);
    setError(null);

    try {
      await googleSheetsService.updatePaymentStatus(orderId, paymentStatus, paymentId);
      console.log('✅ Payment status updated in Google Sheets');
    } catch (err) {
      console.error('❌ Failed to update payment status:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLogging(false);
    }
  }, []);

  const testConnection = useCallback(async () => {
    try {
      const result = await googleSheetsService.testConnection();
      return result;
    } catch (err) {
      console.error('❌ Connection test failed:', err);
      setError(err.message);
      return false;
    }
  }, []);

  return {
    logOrderToSheet,
    updatePaymentStatus,
    testConnection,
    isLogging,
    error
  };
};
import { useState, useCallback } from 'react';
import googleSheetsService from '../services/googleSheets';

// TypeScript interfaces
interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderDetails {
  orderId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  items?: CartItem[];
  totalAmount?: number;
  paymentStatus?: string;
  transactionMode?: string;
  deliveryAddress?: string;
  paymentId?: string | null;
}

interface OrderData {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  items: CartItem[];
  totalAmount: string;
  paymentStatus: string;
  transactionMode: string;
  deliveryAddress: string;
  paymentId: string | null;
}

interface UseOrderTrackingReturn {
  logOrderToSheet: (orderDetails: OrderDetails) => Promise<OrderData | null>;
  updatePaymentStatus: (orderId: string, paymentStatus: string, paymentId?: string) => Promise<void>;
  testConnection: () => Promise<boolean>;
  syncPendingData: () => Promise<void>;
  isLogging: boolean;
  error: string | null;
}

export const useOrderTracking = (): UseOrderTrackingReturn => {
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logOrderToSheet = useCallback(async (orderDetails: OrderDetails): Promise<OrderData | null> => {
    setIsLogging(true);
    setError(null);

    try {
      // Prepare order data for Google Sheets
      const orderData: OrderData = {
        orderId: orderDetails.orderId || `ORD-${Date.now()}`,
        customerName: orderDetails.customerName || 'Guest',
        phone: orderDetails.phone || 'N/A',
        email: orderDetails.email || 'N/A',
        items: orderDetails.items || [],
        totalAmount: `₹${orderDetails.totalAmount || 0}`,
        paymentStatus: orderDetails.paymentStatus || 'Pending',
        transactionMode: orderDetails.transactionMode || 'Online',
        deliveryAddress: orderDetails.deliveryAddress || 'N/A',
        paymentId: orderDetails.paymentId || null
      };

      const result = await googleSheetsService.addOrderToSheet(orderData);
      
      if (result.success !== false) {
        console.log('✅ Order logged to Google Sheets successfully');
      } else {
        console.warn('⚠️ Order logging had issues but order process continues');
      }
      
      return orderData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Failed to log order to Google Sheets:', err);
      setError(errorMessage);
      // Don't throw error - we don't want to break the order process
      return null;
    } finally {
      setIsLogging(false);
    }
  }, []);

  const updatePaymentStatus = useCallback(async (
    orderId: string, 
    paymentStatus: string, 
    paymentId?: string
  ): Promise<void> => {
    setIsLogging(true);
    setError(null);

    try {
      const result = await googleSheetsService.updatePaymentStatus(orderId, paymentStatus, paymentId);
      
      if (result.success !== false) {
        console.log('✅ Payment status updated in Google Sheets');
      } else {
        console.warn('⚠️ Payment status update had issues');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Failed to update payment status:', err);
      setError(errorMessage);
      // Don't throw error
    } finally {
      setIsLogging(false);
    }
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const result = await googleSheetsService.testConnection();
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Connection test failed:', err);
      setError(errorMessage);
      return false;
    }
  }, []);

  const syncPendingData = useCallback(async (): Promise<void> => {
    try {
      await googleSheetsService.syncPendingOrders();
      console.log('✅ Pending data sync completed');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Failed to sync pending data:', err);
      setError(errorMessage);
    }
  }, []);

  return {
    logOrderToSheet,
    updatePaymentStatus,
    testConnection,
    syncPendingData,
    isLogging,
    error
  };
};
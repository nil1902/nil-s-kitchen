// TypeScript interfaces
interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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

interface SheetData {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  itemsCount: number;
  totalAmount: string;
  paymentStatus: string;
  transactionMode: string;
  orderDate: string;
  deliveryAddress: string;
  paymentId: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  method?: string;
}

interface PendingOrder extends SheetData {
  timestamp: string;
  synced: boolean;
}

interface PendingUpdate {
  orderId: string;
  paymentStatus: string;
  paymentId?: string;
  timestamp: string;
}

// Simple HTTP-based Google Sheets service
class GoogleSheetsService {
  private backendUrl: string;

  constructor() {
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com';
  }

  async addOrderToSheet(orderData: OrderData): Promise<ApiResponse> {
    try {
      const {
        orderId,
        customerName,
        phone,
        email,
        items,
        totalAmount,
        paymentStatus,
        transactionMode,
        deliveryAddress,
        paymentId
      } = orderData;

      // Prepare data for backend
      const sheetData: SheetData = {
        orderId,
        customerName,
        phone,
        email,
        itemsCount: items?.length || 0,
        totalAmount,
        paymentStatus,
        transactionMode,
        orderDate: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        deliveryAddress,
        paymentId: paymentId || 'N/A'
      };

      // Try to send to backend first
      try {
        const response = await fetch(`${this.backendUrl}/api/log-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData),
        });

        if (response.ok) {
          console.log('✅ Order logged to Google Sheets via backend');
          return await response.json();
        } else {
          throw new Error(`Backend error: ${response.status}`);
        }
      } catch (backendError: unknown) {
        const errorMessage = backendError instanceof Error ? backendError.message : 'Unknown backend error';
        console.warn('Backend unavailable, using fallback method:', errorMessage);
        
        // Fallback: Use Google Forms submission (works from browser)
        return await this.submitToGoogleForm(sheetData);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Failed to add order to sheet:', error);
      // Don't throw error - we don't want to break the order process
      return { success: false, error: errorMessage };
    }
  }

  private async submitToGoogleForm(orderData: SheetData): Promise<ApiResponse> {
    try {
      // This is a fallback method using Google Forms
      // You would need to create a Google Form connected to your sheet
      console.log('📝 Order data prepared for logging:', orderData);
      
      // For now, just log locally as backup
      const orders: PendingOrder[] = JSON.parse(localStorage.getItem('pending_sheet_orders') || '[]');
      orders.push({
        ...orderData,
        timestamp: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem('pending_sheet_orders', JSON.stringify(orders));
      
      console.log('✅ Order saved locally, will sync when backend is available');
      return { success: true, method: 'local_backup' };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Fallback method failed:', error);
      return { success: false, error: errorMessage };
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string, paymentId?: string): Promise<ApiResponse> {
    try {
      const updateData = {
        orderId,
        paymentStatus,
        paymentId: paymentId || 'N/A'
      };

      const response = await fetch(`${this.backendUrl}/api/update-payment-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        console.log('✅ Payment status updated in Google Sheets');
        return await response.json();
      } else {
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Failed to update payment status:', error);
      
      // Store update for later sync
      const updates: PendingUpdate[] = JSON.parse(localStorage.getItem('pending_payment_updates') || '[]');
      updates.push({
        orderId,
        paymentStatus,
        paymentId,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('pending_payment_updates', JSON.stringify(updates));
      return { success: false, error: errorMessage };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/api/test-sheets`, {
        method: 'GET',
      });

      if (response.ok) {
        console.log('✅ Google Sheets connection test successful');
        return true;
      } else {
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('❌ Google Sheets connection test failed:', error);
      return false;
    }
  }

  // Sync pending orders when backend becomes available
  async syncPendingOrders(): Promise<void> {
    try {
      const pendingOrders: PendingOrder[] = JSON.parse(localStorage.getItem('pending_sheet_orders') || '[]');
      const pendingUpdates: PendingUpdate[] = JSON.parse(localStorage.getItem('pending_payment_updates') || '[]');

      if (pendingOrders.length > 0) {
        for (const order of pendingOrders) {
          // Convert PendingOrder back to OrderData format
          const orderData: OrderData = {
            orderId: order.orderId,
            customerName: order.customerName,
            phone: order.phone,
            email: order.email,
            items: [], // Items not stored in pending orders
            totalAmount: order.totalAmount,
            paymentStatus: order.paymentStatus,
            transactionMode: order.transactionMode,
            deliveryAddress: order.deliveryAddress,
            paymentId: order.paymentId === 'N/A' ? null : order.paymentId
          };
          await this.addOrderToSheet(orderData);
        }
        localStorage.removeItem('pending_sheet_orders');
        console.log(`✅ Synced ${pendingOrders.length} pending orders`);
      }

      if (pendingUpdates.length > 0) {
        for (const update of pendingUpdates) {
          await this.updatePaymentStatus(update.orderId, update.paymentStatus, update.paymentId);
        }
        localStorage.removeItem('pending_payment_updates');
        console.log(`✅ Synced ${pendingUpdates.length} pending payment updates`);
      }
    } catch (error: unknown) {
      console.error('❌ Failed to sync pending data:', error);
    }
  }
}

export default new GoogleSheetsService();
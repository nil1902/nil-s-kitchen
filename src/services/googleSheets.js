import { google } from 'googleapis';

class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.auth = null;
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SHEET_ID || '1Z_ujaIqaXoReK-75BR9vcxLGxHd5ctI3683DOayFwpU';
  }

  async initialize() {
    try {
      // Create JWT auth client
      this.auth = new google.auth.JWT(
        import.meta.env.VITE_GOOGLE_SHEETS_CLIENT_EMAIL,
        null,
        import.meta.env.VITE_GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      // Initialize sheets API
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      console.log('✅ Google Sheets service initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Sheets:', error);
      return false;
    }
  }

  async addOrderToSheet(orderData) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const {
        orderId,
        customerName,
        phone,
        email,
        itemsCount,
        totalAmount,
        paymentStatus,
        transactionMode,
        orderDate,
        deliveryAddress,
        paymentId
      } = orderData;

      // Prepare row data
      const rowData = [
        orderId,
        customerName,
        phone,
        email,
        itemsCount,
        totalAmount,
        paymentStatus,
        transactionMode,
        orderDate,
        deliveryAddress,
        paymentId || 'N/A'
      ];

      // Append to sheet
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Bengal Bay Orders!A:K',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [rowData]
        }
      });

      console.log('✅ Order added to Google Sheet:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to add order to sheet:', error);
      throw error;
    }
  }

  async updatePaymentStatus(orderId, paymentStatus, paymentId) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      // First, find the row with this order ID
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Bengal Bay Orders!A:K'
      });

      const rows = response.data.values;
      let rowIndex = -1;

      // Find the row with matching order ID
      for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header
        if (rows[i][0] === orderId) {
          rowIndex = i + 1; // +1 because sheets are 1-indexed
          break;
        }
      }

      if (rowIndex === -1) {
        console.log('Order not found in sheet:', orderId);
        return;
      }

      // Update payment status (column G) and payment ID (column K)
      await this.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          valueInputOption: 'USER_ENTERED',
          data: [
            {
              range: `Bengal Bay Orders!G${rowIndex}`,
              values: [[paymentStatus]]
            },
            {
              range: `Bengal Bay Orders!K${rowIndex}`,
              values: [[paymentId || 'N/A']]
            }
          ]
        }
      });

      console.log('✅ Payment status updated in Google Sheet');
    } catch (error) {
      console.error('❌ Failed to update payment status:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.initialize();
      
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });

      console.log('✅ Google Sheets connection test successful');
      console.log('Sheet title:', response.data.properties.title);
      return true;
    } catch (error) {
      console.error('❌ Google Sheets connection test failed:', error);
      return false;
    }
  }
}

export default new GoogleSheetsService();
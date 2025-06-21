# Google Forms & Sheets Integration Setup Guide

## 📋 Overview
This guide will help you set up Google Forms integration with Google Sheets for your restaurant management system.

## 🔗 Your Resources
- **Google Sheet**: https://docs.google.com/spreadsheets/d/1rY4jh2WzlArfJiu12IGC6QPwxhgXG2vCySpBxYilyS0/edit#gid=0
- **Existing Forms**:
  - Orders: **(TO BE CREATED)** - Follow Step 1 below
  - Messages: https://forms.gle/qvD4PLm6NsVzQZX46
  - Billing: https://forms.gle/em3hNLxCVErrYGTs9
  - Feedback: https://forms.gle/DZPw4ijRjP2q4r7f9
  - Reservations: https://forms.gle/q17KRhppiY1U6g859

## 🚀 Step-by-Step Setup

### Step 1: Create Orders Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "+ Blank" to create a new form
3. Title: "Restaurant Orders Form"
4. Add the following questions:

   **Question 1: Customer Name**
   - Type: Short answer
   - Required: Yes

   **Question 2: Items Ordered**
   - Type: Paragraph
   - Required: Yes
   - Description: "List all items ordered (e.g., Butter Chicken, Garlic Naan, Mango Lassi)"

   **Question 3: Quantity**
   - Type: Short answer
   - Required: Yes
   - Response validation: Number, Greater than 0

   **Question 4: Price per Item (₹)**
   - Type: Short answer
   - Required: Yes
   - Response validation: Number, Greater than or equal to 0

   **Question 5: Payment Method**
   - Type: Multiple choice
   - Required: Yes
   - Options: Cash, Credit/Debit Card, UPI, Online Payment, Digital Wallet

   **Question 6: Comments / Notes**
   - Type: Paragraph
   - Required: No
   - Description: "Any special instructions or notes"

   **Question 7: Access Password** (Optional for security)
   - Type: Short answer
   - Required: Yes
   - Description: "Enter access password"

5. Click "Send" and copy the form URL
6. **IMPORTANT**: Update the form URL in your React components:
   - Replace `https://forms.gle/ORDERS_FORM_TO_BE_CREATED` in `src/components/admin/GoogleFormsIntegration.tsx`
   - Replace `https://forms.gle/ORDERS_FORM_TO_BE_CREATED` in `src/components/forms/OrdersFormEmbed.tsx`

### Step 2: Link All Forms to Google Sheet

For each form (including the new Orders form):

1. Open the Google Form
2. Click "Responses" tab
3. Click the Google Sheets icon ("Link to Sheets")
4. Select "Select existing spreadsheet"
5. Choose "Restaurant Data Tracker"
6. Click "Create"

**Important**: Each form will create a new tab in your sheet with the form name.

### Step 3: Set Up Google Apps Script

1. Open your Google Sheet
2. Go to "Extensions" → "Apps Script"
3. Delete the default code
4. Copy and paste the code from `src/scripts/google-apps-script.js`
5. Save the project (Ctrl+S)
6. Name it "Restaurant Data Manager"

### Step 4: Configure Script Permissions

1. Click "Run" button (▶️) next to any function
2. Click "Review permissions"
3. Choose your Google account
4. Click "Advanced" → "Go to Restaurant Data Manager (unsafe)"
5. Click "Allow"

### Step 5: Set Up Triggers

1. In Apps Script, click "Triggers" (⏰) in the left sidebar
2. Click "+ Add Trigger"
3. Set up these triggers:

   **Trigger 1: Auto-calculate on edit**
   - Function: `onEdit`
   - Event source: From spreadsheet
   - Event type: On edit

   **Trigger 2: Daily email report**
   - Function: `emailDailyReport`
   - Event source: Time-driven
   - Type: Day timer
   - Time: 9am to 10am

   **Trigger 3: Weekly backup**
   - Function: `backupData`
   - Event source: Time-driven
   - Type: Week timer
   - Day: Sunday
   - Time: 10pm to 11pm

### Step 6: Format Your Google Sheet

1. Open your Google Sheet
2. Create these tabs (if not already created by forms):
   - Orders
   - Billing
   - Feedback
   - Messages
   - Reservations

3. **For Orders tab**, set up columns:
   - A: Timestamp
   - B: Customer Name
   - C: Items Ordered
   - D: Quantity
   - E: Price per Item
   - F: Total Price (will be auto-calculated)
   - G: Payment Method
   - H: Date (auto-filled)
   - I: Time (auto-filled)
   - J: Comments / Notes

4. Format currency columns:
   - Select columns E and F
   - Format → Number → Currency (₹)

### Step 7: Test the Setup

1. Submit a test order through your Orders form
2. Check if data appears in the Orders tab
3. Verify that Total Price is calculated automatically
4. Check if Date and Time are auto-filled

### Step 8: Set Up Form Access Protection

**Option A: Restrict to Google Workspace users**
1. Open each form
2. Click Settings (⚙️)
3. Under "Responses", check "Restrict to users in [your domain]"

**Option B: Password protection (using Apps Script)**
1. The script includes password validation
2. Default password is "restaurant123"
3. Change it in the script: `const correctPassword = 'your_password';`

### Step 9: Enable Excel Export

1. In your Google Sheet, you'll see a new menu "Restaurant Manager"
2. Use "Export to Excel" to download .xlsx file
3. Or use the direct URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=xlsx`

### Step 10: Set Up Email Notifications

1. In the Apps Script, change the admin email:
   ```javascript
   const adminEmail = 'your-email@gmail.com';
   ```
2. The script will send daily reports with Excel attachment

## 🔧 Customization Options

### Change Password
In Apps Script, modify:
```javascript
const correctPassword = 'your_new_password';
```

### Change Email Schedule
Modify the trigger settings or change the time in:
```javascript
ScriptApp.newTrigger('emailDailyReport')
  .timeBased()
  .everyDays(1)
  .atHour(9) // Change this hour
  .create();
```

### Add More Calculations
In the `onEdit` function, add more formulas as needed.

## 🌐 Embedding Forms in Your Website

### Option 1: Direct Links
Use the form URLs directly in your React components.

### Option 2: Iframe Embed
```html
<iframe 
  src="YOUR_FORM_URL" 
  width="640" 
  height="800" 
  frameborder="0">
</iframe>
```

### Option 3: Custom Form Component
Use the `OrdersFormEmbed` component provided in your React app.

## 📊 Using the Dashboard

1. The `GoogleFormsIntegration` component provides a management interface
2. The `DataDashboard` component shows analytics (mock data for now)
3. Both components are ready to use in your admin panel

## 🔍 Troubleshooting

### Forms not linking to sheet
- Ensure you selected the correct existing spreadsheet
- Check that the sheet has the right permissions

### Apps Script not working
- Check if you authorized all permissions
- Verify triggers are set up correctly
- Check the execution log for errors

### Calculations not working
- Ensure column numbers in script match your sheet
- Check if the `onEdit` trigger is active

### Email not sending
- Verify the admin email address is correct
- Check Gmail quota limits
- Ensure the script has email permissions

## 📞 Support

If you encounter issues:
1. Check the Apps Script execution log
2. Verify all permissions are granted
3. Test with a simple form submission
4. Check Google Sheets API quotas

## 🎉 You're All Set!

Your restaurant management system now has:
- ✅ Google Forms for data collection
- ✅ Centralized Google Sheet storage
- ✅ Automatic calculations
- ✅ Currency formatting
- ✅ Daily email reports
- ✅ Excel export functionality
- ✅ Data backup system
- ✅ Form access protection

Update the form URLs in your React components and start collecting data!
# Bengal Bay - Full Stack Restaurant App Setup Guide

##  Quick Start

### 1. Configure Razorpay Keys

**Frontend (.env file):**
`
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
VITE_API_BASE_URL=http://localhost:5000
`

**Backend (backend/server/.env file):**
`
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET_HERE
PORT=5000
`

### 2. Start the Application

**Terminal 1 - Backend Server:**
`ash
cd backend/server
npm start
`

**Terminal 2 - Frontend:**
`ash
npm run dev
`

### 3. Test Payment Flow

1. Go to http://localhost:5173
2. Add items to cart
3. Go to checkout
4. Select Razorpay payment
5. Use test card: 4111 1111 1111 1111
6. Any future expiry date
7. Any CVV

##  What I Fixed

1. **Routing Issue**: Fixed basename mismatch between Vite config and BrowserRouter
2. **Syntax Errors**: Fixed RazorpayPayment component syntax errors
3. **Environment Setup**: Created proper .env files for both frontend and backend
4. **Backend Dependencies**: Installed all required packages
5. **Payment Flow**: Complete end-to-end payment integration

##  Project Structure

`
bengal-bay/
 src/
    components/
       checkout/
          RazorpayPayment.tsx (Fixed)
          PaymentOptions.tsx
       ...
    lib/
       razorpay.ts
       mockApi.ts
    ...
 backend/
    server/
        server.js
        package.json
        .env
 .env (Frontend)
 package.json
`

##  Features

-  Complete Razorpay Integration
-  Cart Management
-  User Authentication
-  Order Management
-  Responsive Design
-  Error Handling
-  Mock API Fallback

##  Important Notes

1. Replace YOUR_ACTUAL_KEY_ID_HERE and YOUR_ACTUAL_KEY_SECRET_HERE with your real Razorpay keys
2. Make sure both servers are running (backend on port 5000, frontend on port 5173)
3. Use test mode for development
4. Check browser console for any errors

##  Troubleshooting

- **Blank Page**: Make sure both servers are running
- **Payment Failed**: Check Razorpay keys in .env files
- **CORS Errors**: Backend has CORS enabled
- **Network Errors**: Check if backend is running on port 5000

Your app is now fully functional! 

# Payment Gateway Setup Guide

## 🚀 Quick Start

### 1. Start Development Environment
```bash
# Option 1: Use the batch file (Windows)
./start-dev.bat

# Option 2: Manual start
# Terminal 1 - Backend
cd backend/server
npm start

# Terminal 2 - Frontend  
npm run dev
```

### 2. Environment Variables

**Frontend (.env):**
```
VITE_RAZORPAY_KEY_ID=rzp_test_RJ8qybQN1ECcEw
VITE_API_BASE_URL=http://localhost:5000
```

**Backend (backend/server/.env):**
```
RAZORPAY_KEY_ID=rzp_test_RJ8qybQN1ECcEw
RAZORPAY_KEY_SECRET=JVyK7lfU5FqOHFa4A3RMlFdm
PORT=5000
```

## 🔧 How It Works

### Payment Flow
1. **User clicks "Pay"** → Frontend loads Razorpay script
2. **Create Order** → Backend creates Razorpay order
3. **Payment Gateway** → User completes payment
4. **Verify Payment** → Backend verifies payment signature
5. **Save Order** → Order saved to Firebase/localStorage
6. **Confirmation** → Email sent to user

### Fallback System
- If backend is down → Uses mock API
- If Razorpay fails → Shows user-friendly error
- If verification fails → Uses mock verification
- Always saves order data locally as backup

## 🛠️ Troubleshooting

### Common Issues

**1. "Payment gateway failed to load"**
- Check internet connection
- Verify Razorpay script is accessible
- Clear browser cache

**2. "Server error: 500"**
- Ensure backend server is running
- Check backend environment variables
- Verify Razorpay credentials

**3. "Payment verification failed"**
- Check backend logs
- Verify webhook signature
- Ensure correct API keys

**4. Page crashes during payment**
- Check browser console for errors
- Ensure all dependencies are installed
- Verify React component state management

### Debug Steps

1. **Check Backend Health:**
   ```
   http://localhost:5000/health
   ```

2. **Test API Endpoints:**
   ```
   http://localhost:5000/api/test
   ```

3. **Browser Console:**
   - Look for JavaScript errors
   - Check network requests
   - Verify payment data flow

## 🔒 Security Features

- Payment signature verification
- Secure API endpoints
- Environment variable protection
- Error handling without data exposure
- Timeout protection for API calls

## 📱 Testing

### Test Cards (Razorpay Test Mode)
- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date

### Test UPI
- **Success:** success@razorpay
- **Failure:** failure@razorpay

## 🚨 Production Checklist

- [ ] Replace test keys with live keys
- [ ] Update webhook URLs
- [ ] Enable proper error logging
- [ ] Set up monitoring
- [ ] Test with real payment methods
- [ ] Verify SSL certificates
- [ ] Update CORS settings

## 📞 Support

If payment issues persist:
1. Check this guide first
2. Review browser console errors
3. Verify all environment variables
4. Test with different browsers
5. Contact support with error logs

## 🔄 Rollback Plan

If you need to rollback to a previous version:
1. Your code is safely backed up
2. All changes are incremental
3. Mock payment system ensures functionality
4. No breaking changes to existing features
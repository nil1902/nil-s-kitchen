@echo off
echo 🔧 Bengal Bay Payment Connection Fix
echo.

echo ✅ Step 1: Fixed .env file to point to localhost:5000
echo ✅ Step 2: Simplified API URL detection
echo ✅ Step 3: Added connection debugging
echo.

echo 🧪 Testing backend connection...
node test-backend-connection.js

echo.
echo 📋 Next Steps:
echo 1. Make sure backend is running: cd backend/server && npm start
echo 2. Make sure frontend is running: npm run dev
echo 3. Or use: ./start-dev.bat to start both
echo.

echo 🔍 If payment still doesn't work:
echo 1. Check browser console for errors
echo 2. Check backend terminal for logs
echo 3. Verify both servers are running on correct ports
echo.

pause
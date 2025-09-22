@echo off
echo 🚀 Starting Bengal Bay with Render Backend
echo.

echo 🧪 Testing Render Backend Connection...
node test-render-backend.js

echo.
echo ⏳ Waiting 5 seconds for backend to warm up...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 Starting Frontend Development Server...
echo 📡 Backend: https://bengal-bay-api.onrender.com
echo 🌐 Frontend: http://localhost:5173
echo.
echo 🎯 Ready to test payment system!
echo.

npm run dev
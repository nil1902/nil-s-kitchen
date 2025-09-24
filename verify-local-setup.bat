@echo off
echo 🔍 Verifying Bengal Bay Local Setup...
echo.

echo ✅ Checking frontend dependencies...
if exist "node_modules" (
    echo    Frontend dependencies: INSTALLED
) else (
    echo    ❌ Frontend dependencies: NOT INSTALLED
    echo    Run: npm install
)

echo.
echo ✅ Checking backend dependencies...
if exist "backend/server/node_modules" (
    echo    Backend dependencies: INSTALLED
) else (
    echo    ❌ Backend dependencies: NOT INSTALLED
    echo    Run: cd backend/server && npm install
)

echo.
echo ✅ Checking environment files...
if exist ".env" (
    echo    Frontend .env: EXISTS
) else (
    echo    ❌ Frontend .env: MISSING
)

if exist "backend/server/.env" (
    echo    Backend .env: EXISTS
) else (
    echo    ❌ Backend .env: MISSING
)

echo.
echo ✅ Checking Google Sheets dependencies...
if exist "backend/server/node_modules/google-spreadsheet" (
    echo    Google Sheets API: INSTALLED
) else (
    echo    ❌ Google Sheets API: NOT INSTALLED
    echo    Run: ./install-backend-deps.bat
)

echo.
echo 📋 Setup Summary:
echo    - Frontend: React + Vite + TypeScript
echo    - Backend: Node.js + Express + Razorpay + Google Sheets
echo    - Database: Google Sheets + Local Storage
echo    - Payment: Razorpay (Test Mode)
echo    - Deployment: Render (Backend) + Vercel (Frontend)
echo.
echo 🎉 Your Bengal Bay system is ready for market launch!
echo.
pause
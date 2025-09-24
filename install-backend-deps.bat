@echo off
echo Installing backend dependencies for Google Sheets integration...
echo.

cd backend/server

echo Installing Google Sheets dependencies...
npm install google-spreadsheet@4.1.2 google-auth-library@9.4.1

echo.
echo ✅ Backend dependencies installed successfully!
echo.
echo The following packages were installed:
echo - google-spreadsheet@4.1.2 (Google Sheets API)
echo - google-auth-library@9.4.1 (Google Authentication)
echo.
echo Your backend is now ready for Google Sheets integration!
echo.
pause
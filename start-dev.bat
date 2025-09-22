@echo off
echo 🚀 Starting Bengal Bay Development Environment...
echo.

echo 📡 Starting Backend Server...
start "Bengal Bay Backend" cmd /k "cd backend/server && echo Starting backend server... && npm start"

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo 🌐 Starting Frontend Development Server...
start "Bengal Bay Frontend" cmd /k "echo Starting frontend server... && npm run dev"

echo.
echo ✅ Both servers are starting...
echo 📡 Backend API: http://localhost:5000
echo 🌐 Frontend App: http://localhost:5173
echo.
echo 🧪 To test backend connection, run: node test-backend-connection.js
echo.
echo Press any key to close this window...
pause > nul
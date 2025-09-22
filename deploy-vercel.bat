@echo off
echo 🚀 Preparing Bengal Bay for Vercel Deployment...
echo.

echo ✅ Checking build...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo ✅ Build successful!
echo.
echo 📋 Next Steps:
echo 1. Go to https://vercel.com
echo 2. Click "New Project"
echo 3. Import your GitHub repository
echo 4. Add environment variables (see VERCEL_DEPLOYMENT.md)
echo 5. Deploy!
echo.
echo 📖 Full deployment guide: VERCEL_DEPLOYMENT.md
echo.
pause
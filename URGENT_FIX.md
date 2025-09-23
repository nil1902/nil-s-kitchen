# 🚨 URGENT: Fix Hardcoded URL Issue

## 🔍 Problem Identified:
The built JavaScript files (`checkout-BFZZanHZ.js`) still contain the hardcoded URL `https://your-vercel-app.vercel.app/api/create-razorpay-order` instead of using your environment variable.

## 🛠️ IMMEDIATE FIXES NEEDED:

### 1. Clear Build Cache & Rebuild
```bash
# Delete build cache and dist folder
rm -rf dist
rm -rf node_modules/.vite
rm -rf .vercel

# Reinstall dependencies
npm install

# Build with environment variables
npm run build
```

### 2. Verify Environment Variables in Vercel
Go to your Vercel dashboard:
1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Make sure these are set for **Production**:
   ```
   VITE_BACKEND_URL=https://bengal-bay-api.onrender.com
   VITE_RAZORPAY_KEY_ID=rzp_test_RJ8qybQN1ECcEw
   ```

### 3. Force Redeploy
```bash
# Trigger a fresh deployment
vercel --prod --force

# Or if using Git deployment, make a small change and push:
git add .
git commit -m "Force rebuild to fix hardcoded URLs"
git push origin main
```

### 4. Alternative: Check for Undefined Environment Variables
The issue might be that `import.meta.env.VITE_BACKEND_URL` is undefined during build, causing it to fall back to a default value.

## 🔧 Code Fix (if env vars are the issue):

Add better error handling to catch undefined environment variables:
# 🚨 COMPLETE FIX: Hardcoded URL Issue

## 🎯 Root Cause:
The built JavaScript files contain a hardcoded URL `https://your-vercel-app.vercel.app/api/create-razorpay-order` instead of using your environment variable `VITE_BACKEND_URL`.

## 🛠️ STEP-BY-STEP SOLUTION:

### Step 1: Verify Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `nil-s-kitchen`
3. Go to **Settings** → **Environment Variables**
4. Ensure these are set for **Production**:
   ```
   VITE_BACKEND_URL=https://bengal-bay-api.onrender.com
   VITE_RAZORPAY_KEY_ID=rzp_test_RJ8qybQN1ECcEw
   VITE_FIREBASE_API_KEY=AIzaSyCJNQNiN9RGLicy3FK1l645bIy4OMmzhZs
   VITE_FIREBASE_AUTH_DOMAIN=lmsnil.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=lmsnil
   VITE_FIREBASE_STORAGE_BUCKET=lmsnil.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=424223991850
   VITE_FIREBASE_APP_ID=1:424223991850:web:c58b5a3dc2bf7893a1bb53
   ```

### Step 2: Clear All Caches
```bash
# Delete all cache and build files
rm -rf dist
rm -rf node_modules/.vite
rm -rf .vercel
rm -rf node_modules/.cache

# Reinstall dependencies
npm install
```

### Step 3: Test Build Locally
```bash
# Test build with debug info
npm run build

# Check if environment variables are loaded correctly
# Look for the debug output in console
```

### Step 4: Force Redeploy on Vercel
```bash
# Option A: Using Vercel CLI
vercel --prod --force

# Option B: Git deployment (recommended)
git add .
git commit -m "Fix: Force rebuild to resolve hardcoded URL issue"
git push origin main
```

### Step 5: Add Firebase Domain (IMPORTANT!)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `lmsnil`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**
4. Add: `nil-s-kitchen.vercel.app`
5. Click **Add domain**

## 🔍 Debug Information Added:
I've added debug logging to help identify the issue:
- Environment variable values will be logged during payment
- Safety check to prevent using wrong URLs
- Build-time validation of environment variables

## 🧪 Testing After Fix:
1. **Open browser dev tools** (F12)
2. **Go to Console tab**
3. **Try making a payment**
4. **Look for debug logs** showing:
   ```
   🔍 Environment Debug:
   VITE_BACKEND_URL: https://bengal-bay-api.onrender.com
   🔗 Using Backend URL: https://bengal-bay-api.onrender.com
   ```

## ⚠️ If Issue Persists:
1. **Check Network tab** in dev tools - API calls should go to `bengal-bay-api.onrender.com`
2. **Clear browser cache** completely or use incognito mode
3. **Verify Render backend** is running: https://bengal-bay-api.onrender.com/api/test
4. **Check Vercel build logs** for any environment variable issues

## 🎯 Expected Results After Fix:
- ✅ No CORS errors
- ✅ API calls go to Render backend
- ✅ Firebase authentication works
- ✅ Razorpay payments process correctly
- ✅ No more hardcoded URLs in network requests

## 🆘 Emergency Fallback:
If the issue still persists, the problem might be that Vercel is not reading the environment variables correctly. In that case:

1. **Hardcode the URL temporarily** in the source code for testing
2. **Contact Vercel support** about environment variable issues
3. **Consider switching to a different deployment platform** like Netlify

The debug script I added will help identify exactly where the problem is occurring.
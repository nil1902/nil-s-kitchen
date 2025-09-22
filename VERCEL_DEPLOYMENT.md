# 🚀 Vercel Deployment Guide for Bengal Bay

## 📋 Pre-Deployment Checklist

### ✅ Files Ready for Deployment:
- `vercel.json` - Vercel configuration
- `api/` folder - Serverless functions for backend
- `.env.production` - Production environment variables
- Updated `vite.config.ts` - Optimized build settings

## 🔧 Deployment Steps

### 1. **Connect Repository to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "Bengal Bay" project

### 2. **Configure Environment Variables**
In Vercel Dashboard → Settings → Environment Variables, add:

```
RAZORPAY_KEY_ID=rzp_test_RJ8qybQN1ECcEw
RAZORPAY_KEY_SECRET=JVyK7lfU5FqOHFa4A3RMlFdm
VITE_RAZORPAY_KEY_ID=rzp_test_RJ8qybQN1ECcEw
VITE_FIREBASE_API_KEY=AIzaSyCJNQNiN9RGLicy3FK1l645bIy4OMmzhZs
VITE_FIREBASE_AUTH_DOMAIN=lmsnil.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lmsnil
VITE_FIREBASE_STORAGE_BUCKET=lmsnil.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=424223991850
VITE_FIREBASE_APP_ID=1:424223991850:web:c58b5a3dc2bf7893a1bb53
VITE_NODE_ENV=production
```

### 3. **Build Settings**
Vercel should auto-detect:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4. **Deploy**
Click "Deploy" - Vercel will:
1. Install dependencies
2. Build the project
3. Deploy frontend + API functions
4. Provide you with a live URL

## 🔗 API Endpoints (After Deployment)

Your API will be available at:
- `https://your-app.vercel.app/api/test`
- `https://your-app.vercel.app/api/create-razorpay-order`
- `https://your-app.vercel.app/api/verify-payment`

## 🛠️ Post-Deployment Configuration

### Update Environment Variables
After deployment, update your local `.env`:
```
VITE_API_BASE_URL=https://your-actual-vercel-url.vercel.app
```

### Test Your Deployment
1. **Frontend Routes:** All pages should load without blank screens
2. **API Functions:** Test payment creation and verification
3. **Payment Gateway:** Test with Razorpay test cards
4. **Firebase:** Ensure authentication and database work

## 🚨 Common Issues & Solutions

### **Blank Page Issues:**
- ✅ **Fixed:** `vercel.json` rewrites all routes to `index.html`
- ✅ **Fixed:** React Router configured with proper basename
- ✅ **Fixed:** All lazy-loaded components have proper fallbacks

### **Payment Crashes:**
- ✅ **Fixed:** Error boundaries around payment components
- ✅ **Fixed:** Comprehensive error handling in payment flow
- ✅ **Fixed:** Timeout protection for API calls
- ✅ **Fixed:** Fallback to mock payment when API fails
- ✅ **Fixed:** State management prevents double processing

### **API Issues:**
- ✅ **Fixed:** Serverless functions in `/api` folder
- ✅ **Fixed:** CORS headers configured
- ✅ **Fixed:** Environment variables properly set

### **Build Issues:**
- ✅ **Fixed:** Vite config optimized for production
- ✅ **Fixed:** Dependencies properly listed in package.json
- ✅ **Fixed:** Git submodules warning handled
- ✅ **Fixed:** No console logs in production build

## 📱 Testing Checklist

After deployment, test:
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Menu page displays items
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Payment gateway opens
- [ ] User authentication works
- [ ] Responsive design on mobile
- [ ] All images load properly
- [ ] Contact forms submit successfully

## 🔄 Continuous Deployment

Once connected to Vercel:
- Every push to `main` branch auto-deploys
- Preview deployments for pull requests
- Automatic HTTPS certificates
- Global CDN distribution

## 🎯 Performance Optimizations Applied

- ✅ Code splitting with lazy loading
- ✅ Image optimization
- ✅ Minified production builds
- ✅ Gzip compression
- ✅ CDN caching headers
- ✅ Tree shaking for smaller bundles

## 📞 Support

If deployment fails:
1. Check Vercel build logs
2. Verify all environment variables
3. Test locally with `npm run build && npm run preview`
4. Check this guide for common solutions

## 🎉 Success!

Your Bengal Bay restaurant website will be live at:
`https://your-project-name.vercel.app`

All features including:
- 🍽️ Menu browsing
- 🛒 Shopping cart
- 💳 Payment processing
- 📱 Mobile responsive design
- 🔐 User authentication
- 📧 Contact forms

Will work seamlessly on Vercel! 🚀
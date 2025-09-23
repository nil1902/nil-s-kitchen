// Debug script to check environment variables during build
console.log("🔍 Build Environment Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("VITE_BACKEND_URL:", process.env.VITE_BACKEND_URL);
console.log("VITE_RAZORPAY_KEY_ID:", process.env.VITE_RAZORPAY_KEY_ID);

// Check if we're in Vercel build environment
if (process.env.VERCEL) {
  console.log("🚀 Building on Vercel");
  console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
}

// Validate required environment variables
const requiredVars = ['VITE_BACKEND_URL', 'VITE_RAZORPAY_KEY_ID'];
const missing = requiredVars.filter(varName => !process.env[varName]);

if (missing.length > 0) {
  console.error("❌ Missing environment variables:", missing);
  process.exit(1);
} else {
  console.log("✅ All required environment variables are present");
}
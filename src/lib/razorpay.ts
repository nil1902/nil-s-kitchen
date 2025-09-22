import { verifyMockPayment } from "./mockApi";

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    
    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      resolve(true);
    };
    
    script.onerror = (error) => {
      console.error("Failed to load Razorpay script:", error);
      resolve(false);
    };
    
    // Add timeout for script loading
    const timeout = setTimeout(() => {
      console.error("Razorpay script loading timeout");
      resolve(false);
    }, 10000);
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log("Razorpay script loaded successfully");
      resolve(true);
    };
    
    document.head.appendChild(script);
  });
};

export const verifyPayment = async (paymentData: any) => {
  // If it's a mock payment, use mock verification
  if (paymentData._isMockPayment) {
    console.log("Using mock verification for mock payment");
    return await verifyMockPayment(paymentData);
  }

  try {
    console.log("Verifying payment:", paymentData.razorpay_payment_id);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
      (import.meta.env.PROD ? window.location.origin : "http://localhost:5000");
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log("Verification response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format from server");
    }
    
    const result = await response.json();
    console.log("Payment verification result:", result.success ? "SUCCESS" : "FAILED");
    return result;
    
  } catch (error: any) {
    console.error("Payment verification failed, using mock:", error.message);
    
    // For network errors or timeouts, use mock verification as fallback
    if (error.name === 'AbortError') {
      console.warn("Verification request timed out, using mock verification");
    }
    
    return await verifyMockPayment(paymentData);
  }
};
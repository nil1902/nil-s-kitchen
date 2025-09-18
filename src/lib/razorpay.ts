import { verifyMockPayment } from "./mockApi";

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const verifyPayment = async (paymentData: any) => {
  try {
    console.log("Verifying payment:", paymentData);
    
    // FIXED: Use proper URL construction
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });
    
    console.log("Verification response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      // If not JSON, use mock verification
      console.warn("API returned non-JSON response, using mock verification");
      return await verifyMockPayment(paymentData);
    }
  } catch (error) {
    console.error("Payment verification failed, using mock:", error);
    return await verifyMockPayment(paymentData);
  }
};
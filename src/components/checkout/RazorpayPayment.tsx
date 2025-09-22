import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { loadRazorpay } from "@/lib/razorpay";
import { useCart } from "../cart/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createMockRazorpayOrder } from "@/lib/mockApi";

interface RazorpayPaymentProps {
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cartTotal, cartItems } = useCart();
  const { currentUser } = useAuth();

  // Calculate total amount
  const tax = cartTotal * 0.05;
  const protectFee = 9;
  const amount = Math.round((cartTotal + tax + protectFee) * 100); // Convert to paise

  const initiatePayment = async () => {
    if (cartItems.length === 0) {
      onError({ message: "Cart is empty" });
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      console.log("Loading Razorpay script...");
      const razorpayLoaded = await loadRazorpay();
      
      if (!razorpayLoaded) {
        throw new Error("Failed to load payment gateway. Please check your internet connection.");
      }
      console.log("Razorpay script loaded successfully");
      
      let orderData;
      let isUsingMock = false;
      
      // Generate a receipt ID
      const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Try to create order with real backend first
      try {
        console.log("Creating order with amount:", amount);
        
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
          (import.meta.env.PROD ? window.location.origin : "http://localhost:5000");
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const orderResponse = await fetch(`${API_BASE_URL}/api/create-razorpay-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency: "INR",
            receipt: receiptId,
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        console.log("Order response status:", orderResponse.status);
        
        if (!orderResponse.ok) {
          throw new Error(`Server error: ${orderResponse.status}`);
        }
        
        const contentType = orderResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format from server");
        }
        
        orderData = await orderResponse.json();
        console.log("Order created successfully:", orderData.order?.id);
        
      } catch (error) {
        console.warn("Backend API failed, using mock payment:", error);
        isUsingMock = true;
        orderData = await createMockRazorpayOrder(amount);
      }
      
      if (!orderData?.success) {
        throw new Error(orderData?.error || "Failed to create payment order");
      }
      
      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RJ8qybQN1ECcEw",
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "Bengal Bay",
        description: "Food Order Payment",
        order_id: orderData.order.id,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          // Add mock flag to response if using mock
          if (isUsingMock) {
            response._isMockPayment = true;
          }
          onSuccess(response);
        },
        prefill: {
          name: currentUser?.displayName || "Guest User",
          email: currentUser?.email || "guest@example.com",
          contact: "+918250565455",
        },
        notes: {
          address: "Bengal Bay Restaurant",
          userId: currentUser?.uid || "guest",
          orderItems: cartItems.length,
        },
        theme: {
          color: "#F59E0B",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal closed by user");
            setIsProcessing(false);
          }
        }
      };
      
      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description || "Please try again"}`);
        onError(response.error);
        setIsProcessing(false);
      });
      
      razorpay.open();
      
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      const errorMessage = error.message || "Failed to initiate payment. Please try again.";
      setError(errorMessage);
      onError({ message: errorMessage });
      setIsProcessing(false);
    }
  };

  // Format amount for display (convert back to rupees)
  const displayAmount = (amount / 100).toFixed(2);

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <Button
        onClick={initiatePayment}
        disabled={isProcessing || cartItems.length === 0}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-6 text-lg transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          `Pay ₹${displayAmount}`
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        You will be redirected to a secure payment gateway
      </p>
      
      {isProcessing && (
        <p className="text-xs text-amber-600 text-center mt-1">
          Please do not close this window or press back button
        </p>
      )}
    </div>
  );
};

export default RazorpayPayment;
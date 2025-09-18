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
    
    try {
      console.log("Loading Razorpay script...");
      const razorpayLoaded = await loadRazorpay();
      
      if (!razorpayLoaded) {
        throw new Error("Failed to load payment gateway");
      }
      console.log("Razorpay script loaded successfully");
      
      let orderData;
      
      // Generate a receipt ID
      const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Try to create order with real backend, fallback to mock if fails
      try {
        console.log("Creating order with amount:", amount);
        
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
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
        });
        
        console.log("Order response status:", orderResponse.status);
        
        if (!orderResponse.ok) {
          throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }
        
        orderData = await orderResponse.json();
        console.log("Order data:", orderData);
        
      } catch (error) {
        console.warn("Real API failed, using mock:", error);
        orderData = await createMockRazorpayOrder(amount);
      }
      
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1234567890abcdef",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Bengal Bay",
        description: "Food Order Payment",
        order_id: orderData.order.id,
        handler: function (response: any) {
          console.log("Payment successful:", response);
          onSuccess(response);
        },
        prefill: {
          name: currentUser?.displayName || "Guest User",
          email: currentUser?.email || "guest@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Restaurant Order",
          userId: currentUser?.uid || "guest",
        },
        theme: {
          color: "#F59E0B",
        },
      };
      
      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        onError(response.error);
      });
      
      razorpay.open();
      
    } catch (error) {
      console.error("Payment initiation error:", error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format amount for display (convert back to rupees)
  const displayAmount = (amount / 100).toFixed(2);

  return (
    <div className="p-4">
      <Button
        onClick={initiatePayment}
        disabled={isProcessing || cartItems.length === 0}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg"
      >
        {isProcessing ? "Processing..." : `Pay ₹${displayAmount}`}
      </Button>
      <p className="text-xs text-gray-500 text-center mt-2">
        You will be redirected to a secure payment gateway
      </p>
    </div>
  );
};

export default RazorpayPayment;
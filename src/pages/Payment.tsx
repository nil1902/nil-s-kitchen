import React from "react";

const Payment: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://bengal-bay-api.onrender.com";
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const startPayment = async () => {
    try {
      // console.log("🔄 Creating Razorpay order...");
      
      // Step 1: Create order from backend
      const response = await fetch(`${API_BASE_URL}/api/create-razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: 50000, // Rs. 500 in paise
          currency: "INR",
          receipt: `test_receipt_${Date.now()}`
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orderData = await response.json();
      // console.log("✅ Order created:", orderData);

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Step 2: Open Razorpay checkout
      const options: any = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Bengal Bay",
        description: "Test Transaction",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // console.log("🔄 Verifying payment...");
            
            // Step 3: Verify payment with backend
            const verifyRes = await fetch(`${API_BASE_URL}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const result = await verifyRes.json();
            
            if (result.success) {
              alert("✅ Payment successful!");
              // console.log("✅ Payment verified successfully");
            } else {
              alert("❌ Payment verification failed: " + result.error);
              // console.error("❌ Payment verification failed:", result.error);
            }
          } catch (error) {
            // console.error("❌ Payment verification error:", error);
            alert("❌ Payment verification failed");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: { 
          color: "#3399cc" 
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (error) {
      // console.error("❌ Payment initiation error:", error);
      alert("❌ Failed to initiate payment: " + (error as Error).message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Test Payment</h2>
      <button 
        onClick={startPayment}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Pay ₹500 with Razorpay
      </button>
    </div>
  );
};

export default Payment;

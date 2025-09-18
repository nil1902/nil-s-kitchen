import React from "react";

const Payment: React.FC = () => {
  const startPayment = async () => {
    // Step 1: Create order from backend
    const response = await fetch("http://localhost:5000/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500 }), // Rs. 500
    });

    const order = await response.json();

    // Step 2: Open Razorpay checkout
    const options: any = {
      key: "YOUR_RAZORPAY_KEY_ID", // from dashboard
      amount: order.amount,
      currency: order.currency,
      name: "Bengal Bay",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response: any) {
        // Step 3: Verify payment with backend
        const verifyRes = await fetch("http://localhost:5000/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const result = await verifyRes.json();
        alert("Payment " + result.status);
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return <button onClick={startPayment}>Pay ₹500 with Razorpay</button>;
};

export default Payment;

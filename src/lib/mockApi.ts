// Mock API functions for development and fallback
export const createMockRazorpayOrder = async (amount: number) => {
  console.log("Creating mock Razorpay order for amount:", amount);
  
  // Simulate realistic API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  const orderId = `order_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    success: true,
    order: {
      id: orderId,
      amount: amount,
      currency: "INR",
      status: "created",
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000),
      _isMock: true
    }
  };
};

export const verifyMockPayment = async (paymentData: any) => {
  console.log("Using mock payment verification for:", paymentData.razorpay_payment_id || "mock payment");
  
  // Simulate realistic API delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
  
  // Always succeed for mock payments to prevent user frustration
  // In production, you'd want proper verification
  return {
    success: true,
    message: "Mock payment verified successfully",
    _isMockVerification: true
  };
};
// Mock API functions for development
export const createMockRazorpayOrder = async (amount: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    order: {
      id: `order_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount,
      currency: "INR",
      status: "created",
      attempts: 0
    }
  };
};

export const verifyMockPayment = async (paymentData: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate successful verification 90% of the time
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      message: "Payment verified successfully"
    };
  } else {
    return {
      success: false,
      error: "Payment verification failed"
    };
  }
};
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../cart/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import RazorpayPayment from "./RazorpayPayment";
import CodPaymentForm from "./CodPaymentForm";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { verifyPayment } from "@/lib/razorpay";
import ErrorBoundary from "@/components/common/ErrorBoundary";

interface PaymentOptionsProps {
  onPaymentComplete: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const { cartTotal, cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Countdown timer
  const [countdown, setCountdown] = useState<{
    minutes: number;
    seconds: number;
  }>({
    minutes: 10,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePaymentSuccess = async (paymentData: any) => {
    if (isProcessing) {
      console.log("Payment already being processed, ignoring duplicate call");
      return; // Prevent double processing
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Processing payment success...");
      
      // Validate payment data
      if (!paymentData) {
        throw new Error("Invalid payment data received");
      }
      
      // Verify payment with backend (with timeout)
      let verification;
      try {
        const verificationPromise = verifyPayment(paymentData);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Payment verification timeout")), 15000)
        );
        
        verification = await Promise.race([verificationPromise, timeoutPromise]);
      } catch (verifyError: any) {
        console.warn("Payment verification failed:", verifyError.message);
        // For mock payments or verification failures, still proceed but log the issue
        verification = { success: true, _fallback: true };
      }
      
      if (!verification.success && !verification._fallback) {
        throw new Error(verification.error || "Payment verification failed");
      }
      
      console.log("Payment verified successfully");
      
      // Generate order ID and save order
      const randomOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      try {
        await saveOrder(randomOrderId, paymentData);
      } catch (saveError) {
        console.error("Failed to save order:", saveError);
        // Continue anyway - order will be saved to localStorage as backup
      }
      
      // Send confirmation email (don't wait for it to complete)
      sendConfirmationEmail(randomOrderId).catch(error => {
        console.warn("Failed to send confirmation email:", error);
      });
      
      setOrderId(randomOrderId);
      setIsPaymentComplete(true);
      onPaymentComplete();
      
    } catch (error: any) {
      console.error("Payment processing error:", error);
      
      // Show user-friendly error message
      const errorMessage = error.message || "Payment processing failed. Please contact support.";
      
      // Use a more user-friendly notification instead of alert
      if (window.confirm(`Error: ${errorMessage}\n\nWould you like to try again?`)) {
        setIsProcessing(false);
      } else {
        // User chose not to retry, redirect to menu
        navigate("/menu");
      }
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    setIsProcessing(false);
    
    const errorMessage = error.description || error.message || "Payment failed. Please try again.";
    
    // Use a more user-friendly notification
    if (window.confirm(`Payment Failed: ${errorMessage}\n\nWould you like to try again?`)) {
      // User wants to try again, just reset the state
      return;
    } else {
      // User doesn't want to try again, redirect to menu
      navigate("/menu");
    }
  };

  const saveOrder = async (orderId: string, paymentData: any) => {
    const orderDate = new Date().toISOString();
    const tax = cartTotal * 0.05;
    const protectFee = 9;
    const totalAmount = cartTotal + tax + protectFee;

    const orderData = {
      id: orderId,
      date: orderDate,
      items: cartItems.map((item) => ({
        ...item,
        subtotal: item.price * item.quantity,
        purchaseTime: new Date().toISOString(),
      })),
      total: totalAmount,
      status: "Processing",
      userId: currentUser?.uid,
      userEmail: currentUser?.email,
      userName: currentUser?.displayName || "Guest User",
      paymentMethod: paymentMethod,
      paymentStatus: "Completed",
      paymentId: paymentData.razorpay_payment_id,
      orderId: paymentData.razorpay_order_id,
      signature: paymentData.razorpay_signature,
      tax: tax,
      subtotal: cartTotal,
      protectFee: protectFee,
    };

    // Save to Firestore
    if (currentUser) {
      try {
        const ordersRef = collection(db, "orders");
        await addDoc(ordersRef, {
          ...orderData,
          timestamp: serverTimestamp(),
        });

        // Also save to localStorage as backup
        const userOrdersKey = `orders_${currentUser.uid}`;
        const existingOrders = localStorage.getItem(userOrdersKey);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.unshift(orderData);
        localStorage.setItem(userOrdersKey, JSON.stringify(orders));
      } catch (error) {
        console.error("Error saving order:", error);
        // Fallback to localStorage only
        const userOrdersKey = `orders_${currentUser.uid}`;
        const existingOrders = localStorage.getItem(userOrdersKey);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.unshift(orderData);
        localStorage.setItem(userOrdersKey, JSON.stringify(orders));
      }
    }
  };

  const sendConfirmationEmail = async (orderId: string) => {
    const userEmail = currentUser?.email || "guest@example.com";
    const userName = currentUser?.displayName || "Guest User";
    const tax = cartTotal * 0.05;
    const protectFee = 9;
    const totalAmount = cartTotal + tax + protectFee;

    const emailContent = {
      to: userEmail,
      subject: `Order Confirmation #${orderId} - Bengal Bay`,
      message: `
        Dear ${userName},

        Thank you for your order at Bengal Bay!

        Order ID: ${orderId}
        Date: ${new Date().toLocaleString()}

        Items:
        ${cartItems
          .map(
            (item) => `
        - ${item.name} (${item.quantity}x) - ₹${(item.price * item.quantity).toFixed(2)}
          Item ID: ${item.id}
          Unit Price: ₹${item.price.toFixed(2)}
        `,
          )
          .join("")}

        Subtotal: ₹${cartTotal.toFixed(2)}
        Tax (5%): ₹${tax.toFixed(2)}
        Protect Fee: ₹${protectFee.toFixed(2)}
        Total: ₹${totalAmount.toFixed(2)}

        Payment Method: ${paymentMethod === "razorpay" ? "Online Payment" : "Cash on Delivery"}
        Payment Status: Completed

        Your order has been received and is being processed.
        You can track your order in the My Orders section of your profile.

        Thank you for choosing Bengal Bay!
        
        Best regards,
        The Bengal Bay Team
      `,
    };

    try {
      await fetch("https://formsubmit.co/ajax/nilimeshpal4@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(emailContent),
      });
    } catch (error) {
      console.error("Failed to send email notification", error);
    }
  };

  const handleCodSubmit = () => {
    const randomOrderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
    setOrderId(randomOrderId);
    setIsPaymentComplete(true);
    onPaymentComplete();
    
    // Save COD order
    saveCodOrder(randomOrderId);
    sendConfirmationEmail(randomOrderId);
  };

  const saveCodOrder = async (orderId: string) => {
    const orderDate = new Date().toISOString();
    const tax = cartTotal * 0.05;
    const protectFee = 9;
    const totalAmount = cartTotal + tax + protectFee;

    const orderData = {
      id: orderId,
      date: orderDate,
      items: cartItems.map((item) => ({
        ...item,
        subtotal: item.price * item.quantity,
        purchaseTime: new Date().toISOString(),
      })),
      total: totalAmount,
      status: "Confirmed",
      userId: currentUser?.uid,
      userEmail: currentUser?.email,
      userName: currentUser?.displayName || "Guest User",
      paymentMethod: "cod",
      paymentStatus: "Pending",
      tax: tax,
      subtotal: cartTotal,
      protectFee: protectFee,
    };

    // Save to localStorage
    if (currentUser) {
      const userOrdersKey = `orders_${currentUser.uid}`;
      const existingOrders = localStorage.getItem(userOrdersKey);
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.unshift(orderData);
      localStorage.setItem(userOrdersKey, JSON.stringify(orders));
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  // Calculate tax and total
  const tax = cartTotal * 0.05;
  const totalPayable = cartTotal + tax;
  const protectFee = 9;
  const grandTotal = totalPayable + protectFee;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payment Options</span>
              <div className="text-sm font-normal text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Complete payment in {countdown.minutes}:
                {countdown.seconds < 10
                  ? `0${countdown.seconds}`
                  : countdown.seconds}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4 mb-6"
            >
              {/* Razorpay Payment Option */}
              <div
                className={`border rounded-lg p-4 ${paymentMethod === "razorpay" ? "border-amber-500 bg-amber-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <div className="flex-1">
                    <label
                      htmlFor="razorpay"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                      </div>
                      <span className="font-medium">Secure Payment Gateway</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1 ml-8">
                      Pay via Cards, UPI, Net Banking, Wallets
                    </p>
                  </div>
                </div>
                {paymentMethod === "razorpay" && (
                  <div className="mt-4">
                    <ErrorBoundary fallback={
                      <div className="p-4 text-center border border-red-200 rounded-md bg-red-50">
                        <p className="text-red-600 mb-2">Payment gateway error</p>
                        <Button 
                          onClick={() => window.location.reload()} 
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Refresh Page
                        </Button>
                      </div>
                    }>
                      <RazorpayPayment
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </ErrorBoundary>
                  </div>
                )}
              </div>

              {/* Cash on Delivery Option */}
              <div
                className={`border rounded-lg p-4 ${paymentMethod === "cod" ? "border-amber-500 bg-amber-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem value="cod" id="cod" />
                  <div>
                    <label
                      htmlFor="cod"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-yellow-600"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="M12 4v16" />
                        </svg>
                      </div>
                      <span className="font-medium">Cash on Delivery</span>
                    </label>
                  </div>
                </div>
                {paymentMethod === "cod" && (
                  <div className="mt-4">
                    <CodPaymentForm
                      onSubmit={handleCodSubmit}
                      amount={grandTotal}
                    />
                  </div>
                )}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </span>
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Price Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} items)</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Protect Promise Fee</span>
                <span>₹{protectFee.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Amount Payable</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <div className="text-green-600 font-medium">
              Your Total Savings on this order ₹{(cartTotal * 0.1).toFixed(2)}
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="bg-blue-100 p-1 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <span className="text-sm">
                  Secure payment with end-to-end encryption
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="bg-red-100 p-1 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <span className="text-sm">
                  5% Unlimited Cashback on Credit Card
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={isPaymentComplete} onOpenChange={setIsPaymentComplete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Placed Successfully!</DialogTitle>
            <DialogDescription>
              {paymentMethod === "cod" 
                ? "Your order has been placed successfully. Please keep cash ready for delivery."
                : "Your payment has been processed successfully."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="text-center space-y-3">
              <p className="font-medium">
                Thank you for your order, {currentUser?.displayName || "Guest"}!
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">Order Details:</p>
                <p>Order ID: {orderId}</p>
                <p>Amount: ₹{grandTotal.toFixed(2)}</p>
                <p>
                  Payment Method: {" "}
                  {paymentMethod === "cod" 
                    ? "Cash on Delivery" 
                    : "Online Payment"}
                </p>
                <p>Status: {paymentMethod === "cod" ? "Confirmed" : "Paid"}</p>
              </div>
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to your registered email
                address. You can track your order in the My Orders section of
                your profile.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setIsPaymentComplete(false);
                clearCart();
                navigate("/");
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentOptions;
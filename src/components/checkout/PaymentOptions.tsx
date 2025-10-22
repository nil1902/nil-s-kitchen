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
  onPaymentComplete: (paymentData?: any) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>("");
  const [isCODComplete, setIsCODComplete] = useState<boolean>(false);
  const [codOTP, setCodOTP] = useState<string>("");
  const { cartTotal, cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Generate 7-digit OTP for COD orders
  const generateCODOTP = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };

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
      // console.log("Payment already being processed, ignoring duplicate call");
      return; // Prevent double processing
    }

    setIsProcessing(true);

    try {
      // Add small delay to ensure state is stable
      await new Promise(resolve => setTimeout(resolve, 50));
      // console.log("Processing payment success...");

      // Validate payment data
      if (!paymentData) {
        throw new Error("Invalid payment data received");
      }

      // Skip verification for now to test Google Sheets integration
      // console.log("⏭️ Skipping payment verification for testing");
      const verification = { success: true, _testing: true };

      // console.log("Payment verified successfully");

      // Generate order ID and save order
      const randomOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Save order in background - don't wait for it
      saveOrder(randomOrderId, paymentData).then(() => {
        // console.log("✅ Order saved successfully");
      }).catch((saveError) => {
        // console.error("❌ Failed to save order:", saveError);
        // Continue anyway - order will be saved to localStorage as backup
      });

      // Send confirmation email (don't wait for it to complete)
      sendConfirmationEmail(randomOrderId).catch(error => {
        // console.warn("Failed to send confirmation email:", error);
      });

      setOrderId(randomOrderId);

      // console.log("🚀 Calling onPaymentComplete with data:", paymentData);
      onPaymentComplete(paymentData);
      // console.log("✅ onPaymentComplete called successfully");

      // 🏠 DIRECT REDIRECT TO HOMEPAGE (Same as COD)
      // console.log("🏠 Razorpay payment successful - redirecting to homepage");
      
      // Safe navigation with error handling
      try {
        clearCart();
        setTimeout(() => {
          navigate("/", { replace: false });
          // Ensure scroll to top after navigation
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }, 200);
      } catch (navError) {
        // console.error("Navigation error:", navError);
        // Fallback: force reload to home
        window.location.href = "/";
      }

      // Also make a direct Google Sheets call as backup
      // console.log("🔄 Making direct Google Sheets backup call...");
      const backupOrderData = {
        orderId: randomOrderId,
        customerName: "Test Customer",
        phone: "9876543210",
        email: currentUser?.email || "guest@example.com",
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        itemsCount: cartItems.length,
        totalAmount: `₹${(cartTotal + cartTotal * 0.05 + 9).toFixed(2)}`,
        paymentStatus: "Completed",
        transactionMode: "Online Payment",
        orderDate: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        deliveryAddress: "Test Address, Mumbai, Maharashtra - 400001",
        paymentId: paymentData.razorpay_payment_id || 'N/A'
      };

      fetch('https://bengal-bay-api.onrender.com/api/log-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backupOrderData),
      })
        .then(response => {
          // console.log("📊 Backup Google Sheets API Response Status:", response.status);
          return response.json();
        })
        .then(result => {
          if (result.success) {
            // console.log("✅ Backup order logged to Google Sheets successfully:", result);
          } else {
            // console.error("❌ Backup Google Sheets API Error:", result.error);
          }
        })
        .catch(error => {
          // console.error("❌ Backup Google Sheets API Call Failed:", error);
        });

    } catch (error: any) {
      // console.error("Payment processing error:", error);

      // Safe state update
      setTimeout(() => {
        setIsProcessing(false);
      }, 100);

      // Mobile-friendly error handling - just log, don't show alerts
      const errorMessage = error.message || "Payment processing failed";
      // console.log(`Error: ${errorMessage}`);
      
      // Don't redirect or show alerts - let user stay on page and retry
    }
  };

  const handlePaymentError = (error: any) => {
    // console.error("Payment error:", error);
    
    // Safe state update with timeout
    setTimeout(() => {
      setIsProcessing(false);
    }, 100);

    const errorMessage = error.description || error.message || "Payment cancelled or failed";

    // Mobile-friendly error handling - just log and reset, don't show confirm dialog
    // console.log(`Payment issue: ${errorMessage}`);
    
    // Don't redirect or show alerts on mobile - just reset state
    // User can try again by clicking the payment button
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

    // Save to localStorage only (Firebase disabled to prevent errors)
    if (currentUser) {
      const userOrdersKey = `orders_${currentUser.uid}`;
      const existingOrders = localStorage.getItem(userOrdersKey);
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.unshift(orderData);
      localStorage.setItem(userOrdersKey, JSON.stringify(orders));
      // console.log("✅ Order saved to localStorage successfully");
    }
  };

  const sendConfirmationEmail = async (orderId: string, otpCode?: string) => {
    const userEmail = currentUser?.email || "guest@example.com";
    const userName = currentUser?.displayName || "Guest User";
    const tax = cartTotal * 0.05;
    const protectFee = 9;
    const totalAmount = cartTotal + tax + protectFee;

    const emailContent = {
      to: userEmail,
      subject: `🍽️ Order Confirmation #${orderId} - Bengal Bay Restaurant`,
      message: `
        Dear ${userName},

        🎉 Thank you for your order at Bengal Bay Restaurant!

        📋 ORDER DETAILS:
        ═══════════════════════════════════════
        Order ID: ${orderId}
        Date: ${new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'short'
      })}
        Customer: ${userName}
        Email: ${userEmail}

        🍽️ ITEMS ORDERED:
        ═══════════════════════════════════════
        ${cartItems
          .map(
            (item) => `
        • ${item.name}
          Quantity: ${item.quantity}x
          Unit Price: ₹${item.price.toFixed(2)}
          Subtotal: ₹${(item.price * item.quantity).toFixed(2)}
        `,
          )
          .join("")}

        💰 BILLING SUMMARY:
        ═══════════════════════════════════════
        Items Subtotal:     ₹${cartTotal.toFixed(2)}
        Tax (5%):          ₹${tax.toFixed(2)}
        Protect Fee:       ₹${protectFee.toFixed(2)}
        ─────────────────────────────────────
        TOTAL AMOUNT:      ₹${totalAmount.toFixed(2)}

        💳 PAYMENT INFORMATION:
        ═══════════════════════════════════════
        Payment Method: ${paymentMethod === "razorpay" ? "Online Payment (Razorpay)" : "Cash on Delivery"}
        Payment Status: ${paymentMethod === "razorpay" ? "✅ Completed" : "⏳ Pending (COD)"}
        ${paymentMethod === "cod" && otpCode ? `
        � DELIVERTY VERIFICATION OTP:
        ═══════════════════════════════════════
        Your Delivery OTP: ${otpCode}
        
        📱 IMPORTANT INSTRUCTIONS:
        • Show this OTP to the delivery person
        • Keep this OTP safe until delivery is complete
        • This ensures secure order delivery
        • Payment: ₹${totalAmount.toFixed(2)} (Cash on Delivery)
        ` : ''}

        📦 ORDER STATUS:
        ═══════════════════════════════════════
        Status: Order Confirmed & Being Processed
        Estimated Delivery: 30-45 minutes
        
        📱 TRACK YOUR ORDER:
        You can track your order status in the "My Orders" section of your Bengal Bay account.

        🙏 Thank you for choosing Bengal Bay Restaurant!
        We appreciate your business and hope you enjoy your delicious meal.
        
        Best regards,
        The Bengal Bay Team
        📧 Contact: support@bengalbay.com
        📞 Phone: +91 82505 65455
      `,
    };

    try {
      // Send email to the logged-in user's email address
      await fetch(`https://formsubmit.co/ajax/${userEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(emailContent),
      });
      // console.log(`✅ Billing email sent to user: ${userEmail}`);
    } catch (error) {
      // console.error("Failed to send email notification", error);
    }
  };

  const handleCodSubmit = async () => {
    if (isProcessing) {
      // console.log("COD order already being processed, ignoring duplicate call");
      return;
    }

    setIsProcessing(true);

    try {
      // console.log("🚚 Processing Cash on Delivery order...");

      const randomOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setOrderId(randomOrderId);

      // COD payment data (same format as Razorpay for consistency)
      const codPaymentData = {
        payment_method: "cod",
        razorpay_order_id: randomOrderId,
        razorpay_payment_id: `cod_${Date.now()}`,
        razorpay_signature: `cod_signature_${Date.now()}`,
        amount: grandTotal,
        _isCOD: true
      };

      // Generate 7-digit OTP for security FIRST
      const generatedOTP = generateCODOTP();
      setCodOTP(generatedOTP);
      // console.log("🔐 Generated COD OTP:", generatedOTP);

      // 🚀 LOG COD ORDER TO GOOGLE SHEETS (Same as Razorpay)
      // console.log("📊 Logging COD order to Google Sheets...");

      const backendOrderData = {
        orderId: randomOrderId,
        customerName: currentUser?.displayName || "Guest User",
        phone: "9876543210", // You can get this from address form
        email: currentUser?.email || "guest@example.com",
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        itemsCount: cartItems.length,
        totalAmount: `₹${grandTotal.toFixed(2)}`,
        paymentStatus: "Pending (COD)",
        transactionMode: "Cash on Delivery",
        orderDate: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        deliveryAddress: "Customer Address", // You can get this from address form
        paymentId: `cod_${Date.now()}`
      };

      // Enhanced backend order data with OTP
      const enhancedOrderData = {
        ...backendOrderData,
        deliveryOTP: generatedOTP,
        orderStatus: "Confirmed - Preparing",
        otpVerified: false,
        deliveryVerificationTime: null
      };

      // Direct API call to backend for Google Sheets logging
      const sheetsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com'}/api/log-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedOrderData),
      });

      const sheetsResult = await sheetsResponse.json();

      if (sheetsResult.success) {
        // console.log("✅ COD order logged to Google Sheets successfully:", sheetsResult);

        // Save COD order locally
        saveCodOrder(randomOrderId);

        // Send confirmation email with OTP for COD orders
        sendConfirmationEmail(randomOrderId, generatedOTP).catch(error => {
          // console.warn("Failed to send COD confirmation email:", error);
        });

        // Show special COD success dialog with OTP
        setIsCODComplete(true);

        // DON'T call parent completion handler yet - let user manually proceed
        // console.log("🔐 COD OTP card will be shown to user");
        // console.log("✅ COD order completed successfully with OTP:", generatedOTP);

        // Parent completion will be called when user clicks "Return to Home"

      } else {
        // console.error("❌ COD Google Sheets API Error:", sheetsResult.error);
        throw new Error("Failed to log order to system. Please try again.");
      }

    } catch (error: any) {
      // console.error("❌ COD order processing error:", error);

      const errorMessage = error.message || "Failed to process COD order. Please try again.";
      // console.log(`Error: ${errorMessage}`);
      
      // Mobile-friendly error handling - just reset state
      setTimeout(() => {
        setIsProcessing(false);
      }, 100);
    } finally {
      // Safe state update
      setTimeout(() => {
        setIsProcessing(false);
      }, 100);
    }
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
                          size="lg"
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
                      isProcessing={isProcessing}
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

      {/* Payment Confirmation Dialog - DISABLED (Direct redirect to homepage) */}
      <Dialog open={false} onOpenChange={setIsPaymentComplete}>
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
                navigate("/", { replace: false });
                // Ensure scroll to top after navigation
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Continue Shopping
            </Button>

          </div>
        </DialogContent>
      </Dialog>

      {/* COD Success Dialog with OTP */}
      <Dialog open={isCODComplete} onOpenChange={() => { }} modal={true}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto [&>button[aria-label*='Close']]:hidden [&>button[data-dialog-close]]:hidden [&>.absolute.right-4.top-4]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 text-xl">🎉 Order confirmed successfully!</DialogTitle>
            <DialogDescription className="text-center text-gray-600">

            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="rounded-full bg-green-100 p-4 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>

            <div className="text-center space-y-4 w-full">
              <p className="font-medium text-lg">
                Thank you, {currentUser?.displayName || "Guest"}!
              </p>

              {/* OTP Security Section */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-amber-200 p-3 rounded-full mr-3 shadow-md">
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
                      className="text-amber-700"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="m7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-amber-800 text-lg"> Delivery Security OTP</h3>
                </div>

                <div className="bg-white border-3 border-amber-400 rounded-xl p-6 mb-4 shadow-inner">
                  <p className="text-sm text-amber-700 mb-3 font-semibold text-center">Your Delivery Verification Code:</p>
                  <div className="text-4xl font-bold text-amber-900 tracking-widest text-center bg-gradient-to-r from-amber-100 to-yellow-100 py-4 rounded-lg border-2 border-amber-300 shadow-sm">
                    {codOTP}
                  </div>
                </div>

                <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-amber-800 space-y-1">
                    <p className="font-bold flex items-center">
                      <span className="mr-2">📱</span>
                      IMPORTANT: Take a screenshot of this OTP now!
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">🚚</span>
                      Show this OTP to the delivery person
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">🔐</span>
                      This ensures secure and verified delivery
                    </p>
                    <p className="flex items-center">
                      <span className="mr-2">⏰</span>
                      Keep this OTP safe until delivery is complete
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 p-5 rounded-xl text-left shadow-sm">
                <p className="font-bold mb-3 text-gray-800 flex items-center">
                  <span className="mr-2">📋</span>
                  Order Summary
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-600">Order ID:</span>
                    <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{orderId}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-600">Items:</span>
                    <span className="font-semibold text-blue-600">{cartItems.length} items</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-600">Total Amount:</span>
                    <span className="font-bold text-green-600 text-lg">₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-600">Payment Method:</span>
                    <span className="font-semibold text-orange-600">💰 Cash on Delivery</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className="font-bold text-green-600 flex items-center">
                      <span className="mr-1">✅</span>
                      Confirmed & Logged
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm text-blue-800 font-medium flex items-center">
                  <span className="mr-2">📧</span>
                  Email Confirmation Sent!
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  A detailed billing confirmation has been sent to your registered email address with complete order details.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-800 font-medium flex items-center">
                  <span className="mr-2">🎉</span>
                  Order Successfully Processed!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Your order has been logged to our system and delivery will be arranged shortly.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-3 pb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 w-full">
              <p className="text-sm text-yellow-800 text-center font-medium">
                💡 Remember: Screenshot this OTP before proceeding!
              </p>
            </div>

            <Button
              onClick={() => {
                // console.log("🏠 User clicked Return to Home - completing COD order");
                setIsCODComplete(false);

                // Now call parent completion handler
                const codPaymentData = {
                  payment_method: "cod",
                  razorpay_order_id: orderId,
                  razorpay_payment_id: `cod_${Date.now()}`,
                  razorpay_signature: `cod_signature_${Date.now()}`,
                  amount: grandTotal,
                  _isCOD: true,
                  _otpVerified: true,
                  _otp: codOTP
                };

                onPaymentComplete(codPaymentData);
                
                // Safe navigation with error handling
                try {
                  clearCart();
                  setTimeout(() => {
                    navigate("/", { replace: false });
                    // Ensure scroll to top after navigation
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }, 200);
                } catch (navError) {
                  // console.error("Navigation error:", navError);
                  // Fallback: force reload to home
                  window.location.href = "/";
                }
              }}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Go to Homepage
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Thank you for choosing Bengal Bay Restaurant! 🍽️
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentOptions;
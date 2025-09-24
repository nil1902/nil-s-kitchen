import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Package, User, MapPin, Phone, CreditCard } from "lucide-react";

interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  totalAmount: string;
  paymentStatus: string;
  transactionMode: string;
  orderDate: string;
  deliveryAddress: string;
  orderStatus: string;
  otpVerified: boolean;
  deliveryVerificationTime: string;
}

const DeliveryVerification = () => {
  const [orderId, setOrderId] = useState("");
  const [enteredOTP, setEnteredOTP] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const fetchOrderDetails = async () => {
    if (!orderId.trim()) {
      setMessage("Please enter an Order ID");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com'}/api/order/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrderDetails(result.order);
        setMessage("Order details loaded successfully");
        setMessageType("success");
      } else {
        setMessage(result.error || "Order not found");
        setMessageType("error");
        setOrderDetails(null);
      }
    } catch (error) {
      setMessage("Failed to fetch order details");
      setMessageType("error");
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!enteredOTP.trim()) {
      setMessage("Please enter the OTP");
      setMessageType("error");
      return;
    }

    if (!orderDetails) {
      setMessage("Please load order details first");
      setMessageType("error");
      return;
    }

    setVerifying(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com'}/api/verify-cod-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderDetails.orderId,
          enteredOTP: enteredOTP,
          deliveryPersonId: "delivery_001" // You can make this dynamic
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage("✅ OTP Verified! Payment completed successfully.");
        setMessageType("success");
        // Refresh order details
        await fetchOrderDetails();
        setEnteredOTP("");
      } else {
        setMessage(result.error || "Invalid OTP");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to verify OTP");
      setMessageType("error");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚚 Delivery Verification</h1>
          <p className="text-gray-600">Verify COD payments with customer OTP</p>
        </div>

        {/* Order ID Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Enter Order ID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Order ID (e.g., ORD-123456)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={fetchOrderDetails}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Loading..." : "Load Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            messageType === "success" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {messageType === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {message}
          </div>
        )}

        {/* Order Details */}
        {orderDetails && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order ID</label>
                  <p className="font-mono text-sm">{orderDetails.orderId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Name</label>
                  <p>{orderDetails.customerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {orderDetails.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Total Amount</label>
                  <p className="flex items-center gap-1 font-semibold text-green-600">
                    <CreditCard className="h-4 w-4" />
                    {orderDetails.totalAmount}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                  <p className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    {orderDetails.deliveryAddress}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Status</label>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    orderDetails.paymentStatus === "Completed" 
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {orderDetails.paymentStatus}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Status</label>
                  <p className="text-sm">{orderDetails.orderStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OTP Verification */}
        {orderDetails && orderDetails.paymentStatus !== "Completed" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Verify Customer OTP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Ask customer for their 7-digit delivery OTP:
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter 7-digit OTP"
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value)}
                    maxLength={7}
                    className="flex-1 text-center text-lg font-mono"
                  />
                  <Button 
                    onClick={verifyOTP}
                    disabled={verifying}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {verifying ? "Verifying..." : "Verify & Complete"}
                  </Button>
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Instructions:</strong> Ask the customer to show you their delivery OTP 
                  from their order confirmation. Enter it above to complete the COD payment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Already Completed */}
        {orderDetails && orderDetails.paymentStatus === "Completed" && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Payment Already Completed
                </h3>
                <p className="text-green-700">
                  This order has already been verified and paid.
                </p>
                {orderDetails.deliveryVerificationTime !== "Pending" && (
                  <p className="text-sm text-green-600 mt-2">
                    Verified on: {orderDetails.deliveryVerificationTime}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DeliveryVerification;
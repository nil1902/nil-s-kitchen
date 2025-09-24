import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Package, Truck, MapPin, Phone, CreditCard, Shield } from "lucide-react";

interface TrackingInfo {
  orderId: string;
  orderStatus: string;
  paymentStatus: string;
  transactionMode: string;
  orderDate: string;
  estimatedDelivery: string;
  customerName: string;
  totalAmount: string;
  deliveryAddress: string;
  orderItems: string;
  otpRequired: boolean;
  deliveryOTP: string | null;
}

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      if (!orderId) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com'}/api/track-order/${orderId}`);
        const result = await response.json();

        if (result.success) {
          setTrackingInfo(result.tracking);
        } else {
          setError(result.error || "Order not found");
        }
      } catch (error) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingInfo();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTrackingInfo, 30000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!trackingInfo) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered & paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'out for delivery':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressStep = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
      case 'preparing':
        return 1;
      case 'out for delivery':
        return 2;
      case 'completed':
      case 'delivered & paid':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getProgressStep(trackingInfo.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🍽️ Order Tracking</h1>
          <p className="text-gray-600">Track your Bengal Bay order in real-time</p>
        </div>

        {/* Order Status Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order #{trackingInfo.orderId}
              </span>
              <Badge className={getStatusColor(trackingInfo.orderStatus)}>
                {trackingInfo.orderStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`text-center p-4 rounded-lg ${currentStep >= 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
                <CheckCircle2 className={`h-8 w-8 mx-auto mb-2 ${currentStep >= 0 ? 'text-green-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${currentStep >= 0 ? 'text-green-900' : 'text-gray-500'}`}>Order Placed</p>
                <p className={`text-xs ${currentStep >= 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {new Date(trackingInfo.orderDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${currentStep >= 1 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <Clock className={`h-8 w-8 mx-auto mb-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-900' : 'text-gray-500'}`}>Preparing</p>
                <p className={`text-xs ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  {currentStep >= 1 ? 'In Progress' : 'Pending'}
                </p>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${currentStep >= 2 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                <Truck className={`h-8 w-8 mx-auto mb-2 ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${currentStep >= 2 ? 'text-orange-900' : 'text-gray-500'}`}>Out for Delivery</p>
                <p className={`text-xs ${currentStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                  {currentStep >= 2 ? 'On the way' : 'Soon'}
                </p>
              </div>
              
              <div className={`text-center p-4 rounded-lg ${currentStep >= 3 ? 'bg-green-50' : 'bg-gray-50'}`}>
                <Package className={`h-8 w-8 mx-auto mb-2 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${currentStep >= 3 ? 'text-green-900' : 'text-gray-500'}`}>Delivered</p>
                <p className={`text-xs ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                  {currentStep >= 3 ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
            
            {/* Estimated Delivery */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Estimated Delivery: <span className="font-medium text-blue-600">{trackingInfo.estimatedDelivery}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800">{trackingInfo.orderItems}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{trackingInfo.transactionMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <Badge className={getStatusColor(trackingInfo.paymentStatus)}>
                  {trackingInfo.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-green-600">{trackingInfo.totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-gray-600 block">Customer:</span>
                <span className="font-medium">{trackingInfo.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Address:</span>
                <span className="font-medium">{trackingInfo.deliveryAddress}</span>
              </div>
              <div>
                <span className="text-gray-600 block">Order Date:</span>
                <span className="font-medium">{new Date(trackingInfo.orderDate).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COD OTP Information */}
        {trackingInfo.otpRequired && trackingInfo.deliveryOTP && trackingInfo.paymentStatus !== "Completed" && (
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Shield className="h-5 w-5" />
                Cash on Delivery - Your OTP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border-2 border-amber-300">
                  <p className="text-center text-2xl font-bold text-amber-800 tracking-widest">
                    {trackingInfo.deliveryOTP}
                  </p>
                  <p className="text-center text-sm text-amber-600 mt-2">
                    Show this OTP to the delivery person
                  </p>
                </div>
                <div className="space-y-2 text-amber-700">
                  <p>• <strong>Keep this OTP ready</strong> for the delivery person</p>
                  <p>• Have exact cash amount ready: <strong>{trackingInfo.totalAmount}</strong></p>
                  <p>• The delivery person will verify this OTP to complete your payment</p>
                  <p>• Your order will be marked as completed after OTP verification</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto-refresh notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This page auto-refreshes every 30 seconds to show the latest status</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
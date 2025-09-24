import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User,
  CreditCard,
  Shield,
  RefreshCw,
  Search
} from "lucide-react";

const OrderTracking = () => {
  const { orderId: urlOrderId } = useParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(urlOrderId || "");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrderDetails = async () => {
    if (!orderId.trim()) {
      setError("Please enter an Order ID");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com'}/api/order/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrderDetails(result.order);
        setError("");
      } else {
        setError(result.error || "Order not found");
        setOrderDetails(null);
      }
    } catch (error) {
      setError("Failed to fetch order details. Please try again.");
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📦 Track Your Order</h1>
          <p className="text-gray-600">Real-time order tracking and delivery updates</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Enter Order ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your Order ID (e.g., ORD-123456)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={fetchOrderDetails}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Track Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {orderDetails && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 rounded-full border font-medium bg-blue-100 text-blue-800">
                    {orderDetails.orderStatus}
                  </div>
                  <p className="text-sm text-gray-600">
                    Order ID: {orderDetails.orderId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total: {orderDetails.totalAmount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
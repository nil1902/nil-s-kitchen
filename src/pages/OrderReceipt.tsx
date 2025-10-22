import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  purchaseTime?: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  protectFee: number;
  status: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  shippingAddress?: any;
  paymentMethod?: string;
  paymentStatus?: string;
}

const OrderReceipt = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Show order from localStorage immediately if available
  useEffect(() => {
    if (!id) return;
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      const storedOrders = localStorage.getItem(`orders_${userId}`);
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          const found = parsedOrders.find((o: Order) => o.id === id);
          if (found) {
            setOrder(found);
            setLoading(false); // Never show spinner if we have data
            setUpdating(true); // Show subtle updating indicator
            // console.log("Loaded order from localStorage immediately:", found);
          }
        } catch (err) {
          // console.error("Failed to parse orders from localStorage", err);
        }
      }
    }
  }, [id]);

  // Fetch order from Firestore in the background
  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    const fetchOrder = async () => {
      const start = Date.now();
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("id", "==", id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const fetchedOrder = { ...doc.data(), id: doc.data().id || doc.id } as Order;
          if (isMounted) {
            setOrder(fetchedOrder);
            setUpdating(false);
            setLoading(false);
            // console.log(`Fetched order from Firestore in ${Date.now() - start}ms:`, fetchedOrder);
          }
        } else {
          if (isMounted) setUpdating(false);
        }
      } catch (err) {
        // console.error("Failed to fetch order from Firestore", err);
        if (isMounted) setUpdating(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => { isMounted = false; };
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading && !order) {
    return <div className="container mx-auto py-10 px-4 text-center">Loading receipt...</div>;
  }
  if (!order) {
    return <div className="container mx-auto py-10 px-4 text-center">Order not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-2 sm:p-4 print:bg-white">
      <div className="max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className="mb-3 text-amber-700 hover:bg-amber-100" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 text-center">
            <div className="text-2xl mb-1">✅</div>
            <h1 className="text-lg font-bold">Order Confirmed!</h1>
            <p className="text-sm opacity-90">Cash on Delivery</p>
          </div>

          <CardContent className="p-4 space-y-4">
            {/* Order ID & Date */}
            <div className="text-center bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">Order ID</div>
              <div className="font-mono text-sm font-semibold">{order.id.slice(-8)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(order.date).toLocaleDateString()}
              </div>
            </div>

            {/* Items Summary */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-700">Items ({order.items.length})</h3>
              <div className="space-y-2">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                    <div className="h-8 w-8 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(0)}</div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-amber-700">₹{order.total.toFixed(0)}</span>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Pay by cash when delivered
              </div>
            </div>

            {/* Delivery Info */}
            {order.shippingAddress && (
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-blue-800 mb-1">Delivery Address</h4>
                <div className="text-xs text-blue-700">
                  <div>{order.userName}</div>
                  <div>{order.shippingAddress.address}</div>
                  <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
                  {order.shippingAddress.phone && <div>📞 {order.shippingAddress.phone}</div>}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="flex-1 text-xs"
              >
                <Printer className="mr-1 h-3 w-3" /> Print
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate('/menu')}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-xs"
              >
                Order Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderReceipt; 
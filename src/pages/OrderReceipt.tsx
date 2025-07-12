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
            console.log("Loaded order from localStorage immediately:", found);
          }
        } catch (err) {
          console.error("Failed to parse orders from localStorage", err);
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
            console.log(`Fetched order from Firestore in ${Date.now() - start}ms:`, fetchedOrder);
          }
        } else {
          if (isMounted) setUpdating(false);
        }
      } catch (err) {
        console.error("Failed to fetch order from Firestore", err);
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
    <div className="container mx-auto py-10 px-4 print:bg-white">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
      </Button>
      {updating && (
        <div className="text-xs text-gray-400 mb-2">Updating with latest data...</div>
      )}
      <Card className="max-w-2xl mx-auto shadow-lg print:shadow-none">
        <CardHeader className="bg-gray-50 print:bg-white">
          <CardTitle className="text-xl">Order Receipt</CardTitle>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">Order ID: {order.id}</span>
            <span className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Customer Info</h3>
            <div className="text-sm text-gray-700">
              <div>Name: {order.userName}</div>
              <div>Email: {order.userEmail}</div>
              {order.shippingAddress && (
                <div>
                  Address: {order.shippingAddress.address}, {order.shippingAddress.locality}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </div>
              )}
              {order.shippingAddress?.phone && <div>Phone: {order.shippingAddress.phone}</div>}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Order Items</h3>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-2">
                  <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Payment Summary</h3>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{order.tax?.toFixed(2) || (order.total * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Protect Fee</span>
                <span>₹{order.protectFee?.toFixed(2) || "9.00"}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Download/Print Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderReceipt; 
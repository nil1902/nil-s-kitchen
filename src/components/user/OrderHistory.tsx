import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ExternalLink,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  protectFee: number;
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  userId?: string;
  userEmail?: string;
  userName?: string;
  shippingAddress?: any;
  paymentMethod?: string;
  paymentStatus?: string;
}

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Show localStorage orders immediately if available
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const userOrdersKey = `orders_${currentUser.uid}`;
    const storedOrders = localStorage.getItem(userOrdersKey);
    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
        setLoading(false);
        console.log("Loaded orders from localStorage immediately:", parsedOrders);
      } catch (err) {
        console.error("Failed to parse orders from localStorage", err);
      }
    }
  }, [currentUser]);

  // Fetch orders from Firestore in the background
  useEffect(() => {
    if (!currentUser) return;
    let isMounted = true;
    const fetchOrders = async () => {
      const start = Date.now();
      try {
        // Query orders collection for the current user
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", currentUser.uid),
          orderBy("date", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const userOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          const orderData = doc.data();
          userOrders.push({
            id: orderData.id || doc.id,
            date: orderData.date || new Date().toISOString(),
            items: orderData.items || [],
            total: orderData.total || 0,
            status: orderData.status || "Processing",
            userId: orderData.userId || currentUser.uid,
            userEmail: orderData.userEmail || currentUser.email,
            ...orderData,
          } as Order);
        });
        console.log(`Fetched orders from Firestore in ${Date.now() - start}ms:`, userOrders);
        if (isMounted && userOrders.length > 0) {
          setOrders(userOrders);
          // Update localStorage for next time
          localStorage.setItem(`orders_${currentUser.uid}`, JSON.stringify(userOrders));
        }
      } catch (error) {
        console.error("Error fetching orders from Firestore:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, [currentUser]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* User Navigation Menu */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/profile")}
        >
          <User className="h-4 w-4" />
          My Profile
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gray-100"
          onClick={() => navigate("/profile?tab=orders")}
        >
          <Package className="h-4 w-4" />
          My Orders
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/profile?tab=bookings")}
        >
          <Calendar className="h-4 w-4" />
          My Bookings
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/profile?tab=payment")}
        >
          <CreditCard className="h-4 w-4" />
          Payment Methods
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Check your order history here.</p>

          <Button
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => navigate("/menu")}
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.date).toLocaleDateString()} at{" "}
                      {new Date(order.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(order.status)} px-3 py-1`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.id}`}
                      className="flex items-center gap-4 border-b pb-4"
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Purchased on:{" "}
                          {new Date(
                            order.date,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="space-y-1 pt-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-sm">
                        ₹{order.subtotal?.toFixed(2) || order.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tax (5%)</span>
                      <span className="text-sm">
                        ₹
                        {order.tax?.toFixed(2) ||
                          (order.total * 0.05).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Protect Fee</span>
                      <span className="text-sm">
                        ₹{order.protectFee?.toFixed(2) || "9.00"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-600 border-amber-600 hover:bg-amber-50"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

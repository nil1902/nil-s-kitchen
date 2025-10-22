import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserService, UserProfile as UserProfileType } from "@/lib/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Calendar, Package, Eye, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const profile = await UserService.getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
    fetchUserOrders();
  }, [currentUser]);

  const fetchUserOrders = async () => {
    if (!currentUser) return;
    
    setOrdersLoading(true);
    try {
      // First try to get from localStorage
      const userOrdersKey = `orders_${currentUser.uid}`;
      const localOrders = localStorage.getItem(userOrdersKey);
      
      if (localOrders) {
        const parsedOrders = JSON.parse(localOrders);
        setOrders(parsedOrders.slice(0, 10)); // Show last 10 orders
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("completed") || statusLower.includes("delivered")) {
      return "bg-green-100 text-green-800";
    } else if (statusLower.includes("processing") || statusLower.includes("confirmed")) {
      return "bg-blue-100 text-blue-800";
    } else if (statusLower.includes("pending")) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Profile information not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium">{userProfile.displayName}</p>
                  <p className="text-sm text-gray-500">Full Name</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium">{userProfile.email}</p>
                  <p className="text-sm text-gray-500">Email Address</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium">{userProfile.mobileNumber}</p>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {new Date(userProfile.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Member Since</p>
                </div>
             </div>
              
              <div className="pt-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✓ Verified Account
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order History
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUserOrders}
                  disabled={ordersLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse border rounded-lg p-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No orders found</p>
                  <Button onClick={() => navigate('/menu')}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/track-order/${order.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Track
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/order/${order.id}`)}
                          >
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/track-order')}
                    >
                      Track Any Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
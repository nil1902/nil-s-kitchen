import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Truck,
  User,
  CreditCard
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  orderItems: string;
  itemsCount: string;
  totalAmount: string;
  paymentStatus: string;
  transactionMode: string;
  orderDate: string;
  deliveryAddress: string;
  paymentId: string;
  deliveryOTP: string;
  orderStatus: string;
  otpVerified: boolean;
  deliveryVerificationTime: string;
  createdAt: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com'}/api/orders`);
      const result = await response.json();
      
      if (result.success) {
        // Sort orders by creation date (newest first)
        const sortedOrders = result.orders.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== "All") {
      if (statusFilter === "Pending") {
        filtered = filtered.filter(order => 
          order.paymentStatus.includes('Pending') || order.orderStatus === 'Processing'
        );
      } else if (statusFilter === "Completed") {
        filtered = filtered.filter(order => 
          order.paymentStatus === 'Completed' || order.orderStatus === 'Delivered & Paid'
        );
      } else if (statusFilter === "COD") {
        filtered = filtered.filter(order => order.transactionMode === 'Cash on Delivery');
      } else if (statusFilter === "Online") {
        filtered = filtered.filter(order => order.transactionMode === 'Online Payment');
      }
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Here you would typically call an API to update the order status
      // For now, we'll update locally
      setOrders(prev => prev.map(order =>
        order.orderId === orderId 
          ? { ...order, orderStatus: newStatus }
          : order
      ));
      
      console.log(`Updated order ${orderId} status to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered & paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'preparing':
      case 'confirmed - preparing':
        return 'bg-blue-100 text-blue-800';
      case 'out for delivery':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
      case 'pending (cod)':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending (cod)':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const getOrderPriority = (order: Order) => {
    const orderTime = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - orderTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 2 && order.paymentStatus.includes('Pending')) {
      return 'high';
    } else if (hoursDiff > 1) {
      return 'medium';
    }
    return 'normal';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 Order Management</h1>
            <p className="text-gray-600">Manage and track all restaurant orders</p>
          </div>
          <Button onClick={fetchOrders} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => o.paymentStatus.includes('Pending')).length}
                  </div>
                  <p className="text-sm text-gray-600">Pending Orders</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.paymentStatus === 'Completed').length}
                  </div>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {orders.filter(o => o.transactionMode === 'Cash on Delivery').length}
                  </div>
                  <p className="text-sm text-gray-600">COD Orders</p>
                </div>
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Order ID, Customer Name, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending Orders</option>
              <option value="Completed">Completed Orders</option>
              <option value="COD">COD Orders</option>
              <option value="Online">Online Payment</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const priority = getOrderPriority(order);
            return (
              <Card 
                key={order.orderId} 
                className={`${priority === 'high' ? 'border-red-300 bg-red-50' : 
                           priority === 'medium' ? 'border-yellow-300 bg-yellow-50' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Order Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{order.orderId}</h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {order.customerName}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {order.phone}
                          </p>
                        </div>
                        {priority === 'high' && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Items:</strong> {order.orderItems}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{order.deliveryAddress}</span>
                      </div>
                    </div>

                    {/* Payment & Status */}
                    <div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Amount:</span>
                          <p className="font-bold text-green-600">{order.totalAmount}</p>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500">Payment:</span>
                          <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500">Mode:</span>
                          <p className="text-sm">{order.transactionMode}</p>
                        </div>

                        {order.transactionMode === 'Cash on Delivery' && order.deliveryOTP && (
                          <div>
                            <span className="text-sm text-gray-500">OTP:</span>
                            <p className="font-mono font-bold text-amber-600">{order.deliveryOTP}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Badge className={getStatusColor(order.orderStatus || 'Processing')}>
                        {order.orderStatus || 'Processing'}
                      </Badge>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        
                        {order.paymentStatus.includes('Pending') && (
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.orderId, 'Preparing')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Mark Preparing
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.orderId, 'Out for Delivery')}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Out for Delivery
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">No orders match your current filters.</p>
            </CardContent>
          </Card>
        )}

        {/* Order Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="font-medium">{selectedOrder.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="font-medium">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Order Date</label>
                      <p className="font-medium">{selectedOrder.orderDate}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800">{selectedOrder.orderItems}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        Total Items: {selectedOrder.itemsCount}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Amount</label>
                      <p className="font-bold text-green-600 text-lg">{selectedOrder.totalAmount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Method</label>
                      <p className="font-medium">{selectedOrder.transactionMode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment Status</label>
                      <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Payment ID</label>
                      <p className="font-mono text-sm">{selectedOrder.paymentId}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Delivery Address</label>
                        <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                      </div>
                      
                      {selectedOrder.transactionMode === 'Cash on Delivery' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Delivery OTP</label>
                            <p className="font-mono font-bold text-amber-600 text-lg">
                              {selectedOrder.deliveryOTP || 'Not Generated'}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">OTP Verified</label>
                            <p className="font-medium">
                              {selectedOrder.otpVerified ? '✅ Yes' : '❌ No'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Order Status</label>
                        <Badge className={getStatusColor(selectedOrder.orderStatus || 'Processing')}>
                          {selectedOrder.orderStatus || 'Processing'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.orderId, 'Preparing')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Mark as Preparing
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.orderId, 'Out for Delivery')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Out for Delivery
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.orderId, 'Delivered')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark as Delivered
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderManagement;
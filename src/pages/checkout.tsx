import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  ShoppingCart,
  MapPin,
  CreditCard,
  Edit,
} from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PaymentOptions from "@/components/checkout/PaymentOptions";
import AddressForm, { AddressData } from "@/components/checkout/AddressForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Direct API calls for better reliability

const CheckoutPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("payment");
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address data with user info if available
  const [address, setAddress] = useState<AddressData>({
    name: currentUser?.displayName || "Guest User",
    phone: "9876543210",
    pincode: "400001",
    locality: "Main Area",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    landmark: "",
    addressType: "home",
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // If cart is empty, redirect to menu
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/menu");
    }
  }, [cartItems, navigate]);

  // Direct API calls instead of using hook for better reliability

  const handlePaymentComplete = async (paymentData?: any) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Generate a random order ID
      const randomOrderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
      const orderDate = new Date().toISOString();
      const totalAmount = cartTotal + cartTotal * 0.05 + 9;

      // Create order object with detailed information
      const orderData = {
        id: randomOrderId,
        date: orderDate,
        items: cartItems.map((item) => ({
          ...item,
          subtotal: item.price * item.quantity,
          purchaseTime: new Date().toISOString(),
        })),
        total: totalAmount,
        status: "Processing",
        userId: currentUser?.uid || "guest",
        userEmail: currentUser?.email || "guest@example.com",
        userName: currentUser?.displayName || address.name,
        shippingAddress: address,
        paymentMethod: paymentData ? "Online Payment" : "Cash on Delivery",
        paymentStatus: paymentData ? "Completed" : "Pending",
        tax: cartTotal * 0.05,
        subtotal: cartTotal,
        protectFee: 9,
      };

      // Save to localStorage as backup
      const userOrdersKey = "orders";
      const existingOrders = localStorage.getItem(userOrdersKey);
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.unshift(orderData);
      localStorage.setItem(userOrdersKey, JSON.stringify(orders));
      localStorage.setItem("currentUserId", currentUser?.uid || "guest");

      // 🚀 LOG ORDER TO GOOGLE SHEETS (Non-blocking)
      const sheetOrderData = {
        orderId: randomOrderId,
        customerName: address.name,
        phone: address.phone,
        email: currentUser?.email || "guest@example.com",
        items: cartItems,
        totalAmount: totalAmount,
        paymentStatus: paymentData ? "Completed" : "Pending",
        transactionMode: paymentData ? "Online Payment" : "Cash on Delivery",
        deliveryAddress: `${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`,
        paymentId: paymentData?.razorpay_payment_id || null
      };

      // 🚀 LOG ORDER TO GOOGLE SHEETS - Direct API Call
      console.log("🚀 Attempting to log order to Google Sheets:", sheetOrderData);
      
      // Prepare data for backend API
      const backendOrderData = {
        orderId: randomOrderId,
        customerName: address.name,
        phone: address.phone,
        email: currentUser?.email || "guest@example.com",
        itemsCount: cartItems.length,
        totalAmount: `₹${totalAmount.toFixed(2)}`,
        paymentStatus: paymentData ? "Completed" : "Pending",
        transactionMode: paymentData ? "Online Payment" : "Cash on Delivery",
        orderDate: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        deliveryAddress: `${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`,
        paymentId: paymentData?.razorpay_payment_id || 'N/A'
      };

      // Direct API call to backend
      fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://bengal-bay-api.onrender.com'}/api/log-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendOrderData),
      })
      .then(response => {
        console.log("📊 Google Sheets API Response Status:", response.status);
        return response.json();
      })
      .then(result => {
        if (result.success) {
          console.log("✅ Order logged to Google Sheets successfully:", result);
        } else {
          console.error("❌ Google Sheets API Error:", result.error);
        }
      })
      .catch(error => {
        console.error("❌ Google Sheets API Call Failed:", error);
      });

      // Clear cart immediately after successful order processing
      clearCart();
      
      // Force cart UI refresh by clearing localStorage as well
      localStorage.removeItem("cart");
      
      // Show success dialog - DISABLED TO PREVENT DOUBLE SUCCESS CARDS
      setOrderId(randomOrderId);
      // setIsOrderComplete(true); // Commented out - success handled by PaymentOptions component

      console.log("✅ Order completed successfully:", orderData);
      console.log("🛒 Cart cleared and localStorage updated");
      
      // No auto-redirect - handled by PaymentOptions success dialog
      // setTimeout(() => {
      setIsOrderComplete(false);
      navigate("/");
      // }, 3000);

    } catch (error) {
      console.error("❌ Failed to process order:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressChange = (newAddress: AddressData) => {
    setAddress(newAddress);
    setIsAddressFormOpen(false);
  };

  // Add error recovery
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Checkout page error:", event.error);
      event.preventDefault();
      // Don't crash - just log the error
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" >
      <div className="container mx-auto py-6 md:py-10 px-4">
        {/* Mobile-Optimized Header */}
        <div className="text-center md:text-left mb-6">
          <div className="inline-flex items-center bg-amber-100 px-4 py-2 rounded-full mb-3 md:hidden">
            <span className="text-amber-600 font-medium text-sm">🛒 Final Step</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-6">
            <span className="md:hidden">Complete Your Order</span>
            <span className="hidden md:inline">Checkout</span>
          </h1>
          <p className="text-sm text-gray-600 md:hidden">Review your order and choose payment method</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddressFormOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>

          <div className="bg-white p-4 rounded-lg border mb-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{address.name}</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {address.addressType.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600">{address.address}</p>
              <p className="text-gray-600">
                {address.locality}, {address.city}, {address.state} -{" "}
                {address.pincode}
              </p>
              <p className="text-gray-600">Phone: {address.phone}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-4 rounded-lg border mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Items ({cartItems.length})</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Protect Fee</span>
                <span>₹9.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{(cartTotal + cartTotal * 0.05 + 9).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Options
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment">
            <ErrorBoundary fallback={
              <div className="p-8 text-center">
                <p className="text-red-600 mb-4">Payment system encountered an error.</p>
                <Button onClick={() => window.location.reload()} className="bg-amber-600 hover:bg-amber-700 text-white">
                  Refresh Page
                </Button>
              </div>
            }>
              <PaymentOptions onPaymentComplete={handlePaymentComplete} />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
          <Button
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => navigate("/menu")}
          >
            Browse Menu
          </Button>
        </div>
      )}

      {/* Address Form Dialog */}
      <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <div className="max-h-[85vh] overflow-y-auto">
            <AddressForm
              initialAddress={address}
              onSave={handleAddressChange}
              onCancel={() => setIsAddressFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Confirmation Dialog - COMMENTED OUT TO PREVENT DOUBLE SUCCESS CARDS */}
      {/* 
      <Dialog open={isOrderComplete} onOpenChange={setIsOrderComplete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Confirmed!</DialogTitle>
            <DialogDescription>
              Your order has been successfully placed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-4">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center space-y-3">
              <p className="font-medium">
                Thank you for your order, {address.name}!
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">Order Details:</p>
                <p>Order ID: {orderId}</p>
                <p>Items: {cartItems.length}</p>
                <div className="mt-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ₹{item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%):</span>
                    <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protect Fee:</span>
                    <span>₹9.00</span>
                  </div>
                  <div className="flex justify-between font-medium mt-1">
                    <span>Total:</span>
                    <span>
                      ₹{(cartTotal + cartTotal * 0.05 + 9).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500 text-center">
              🎉 Redirecting to home page in 3 seconds...
            </p>
            <Button
              onClick={() => {
                setIsOrderComplete(false);
                navigate("/");
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Go to Home Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      */}
    </div>
  );
</div>
)};
export default CheckoutPage;

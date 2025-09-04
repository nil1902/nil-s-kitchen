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
import PaymentOptions from "@/components/checkout/PaymentOptions";
import AddressForm, { AddressData } from "@/components/checkout/AddressForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const CheckoutPage = () => {
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // If cart is empty, redirect to menu
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/menu");
    }
  }, [cartItems, navigate]);

  const handlePaymentComplete = async () => {
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
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        userName: currentUser?.displayName || address.name,
        shippingAddress: address,
        paymentMethod: "Online Payment",
        paymentStatus: "Completed",
        tax: cartTotal * 0.05,
        subtotal: cartTotal,
        protectFee: 9,
        timestamp: serverTimestamp(),
      };

      // Save to Firestore
      if (currentUser) {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order saved with ID: ", docRef.id);
        setOrderId(randomOrderId);

        // Also save to user-specific localStorage as backup
        const userOrdersKey = `orders_${currentUser.uid}`;
        const existingOrders = localStorage.getItem(userOrdersKey);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.unshift(orderData);
        localStorage.setItem(userOrdersKey, JSON.stringify(orders));
        // Save current userId for fallback order lookup
        localStorage.setItem("currentUserId", currentUser.uid);

        // Create detailed email content with order information
        const emailContent = {
          to: currentUser.email,
          subject: `Order Confirmation #${randomOrderId} - Bengal Bay`,
          message: `
            Dear ${currentUser.displayName || address.name},

            Thank you for your order at Bengal Bay!

            Order ID: ${randomOrderId}
            Date: ${new Date(orderDate).toLocaleString()}

            Items:
            ${cartItems
              .map(
                (item) => `
            - ${item.name} (${item.quantity}x) - ₹${(item.price * item.quantity).toFixed(2)}
              Item ID: ${item.id}
              Unit Price: ₹${item.price.toFixed(2)}
            `,
              )
              .join("")}

            Subtotal: ₹${cartTotal.toFixed(2)}
            Tax (5%): ₹${(cartTotal * 0.05).toFixed(2)}
            Protect Fee: ₹9.00
            Total: ₹${totalAmount.toFixed(2)}

            Shipping Address:
            ${address.name}
            ${address.address}
            ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}
            Phone: ${address.phone}

            Payment Method: Online Payment
            Payment Status: Completed

            Your order has been received and is being processed.
            You can track your order in the My Orders section of your profile.

            Thank you for choosing Bengal Bay!
            
            Best regards,
            The Bengal Bay Team
          `,
        };

        // Create detailed email content for owner
        const ownerEmailContent = {
          ...emailContent,
          to: "snresturent@gmail.com",
        };
        // Create detailed email content for customer
        const customerEmailContent = {
          ...emailContent,
          to: currentUser.email,
        };

        // Send confirmation email to owner
        try {
          await fetch("https://formsubmit.co/ajax/snresturent@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(ownerEmailContent),
          });
          console.log("Confirmation email sent successfully to owner");
        } catch (emailErr) {
          console.error("Failed to send confirmation email to owner", emailErr);
        }

        // Send confirmation email to customer
        try {
          await fetch("https://formsubmit.co/ajax/" + currentUser.email, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(customerEmailContent),
          });
          console.log("Confirmation email sent successfully to customer");
        } catch (emailErr) {
          console.error("Failed to send confirmation email to customer", emailErr);
        }

        // Show confirmation dialog
        setIsOrderComplete(true);
        // Clear cart after successful order
        clearCart();
      }
    } catch (error) {
      console.error("Failed to process order:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressChange = (newAddress: AddressData) => {
    setAddress(newAddress);
    setIsAddressFormOpen(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{(cartTotal + cartTotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="text-green-600 text-sm mt-2">
                Your Total Savings: ₹{(cartTotal * 0.1).toFixed(2)}
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
            <PaymentOptions onPaymentComplete={handlePaymentComplete} />
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
        <DialogContent className="sm:max-w-2xl">
          <AddressForm
            initialAddress={address}
            onSave={handleAddressChange}
            onCancel={() => setIsAddressFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Order Confirmation Dialog */}
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
                Thank you for your order,{" "}
                {currentUser?.displayName || address.name}!
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
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to {currentUser?.email}. You
                can track your order in the My Orders section of your profile.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setIsOrderComplete(false);
                clearCart();
                navigate("/");
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;

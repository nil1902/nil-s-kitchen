import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Package,
  Calendar,
  CreditCard,
  LogOut,
  Edit2,
  Save,
  Plus,
} from "lucide-react";

const UserDashboard = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || "",
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Empty arrays for orders and bookings for fresh accounts
  // These will be populated from a database in a real application
  const orders: any[] = [];
  const bookings: any[] = [];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await updateUserProfile(displayName);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <Tabs
        defaultValue="profile"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="mb-8">
          <div className="relative">
            <div className="scroll-fade-left"></div>
            <div className="scroll-fade-right"></div>
            <div className="flex overflow-x-auto scrollbar-hide pb-2 gap-2">
              <TabsList className="flex w-full min-w-max space-x-2 bg-transparent">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-2 bg-white border rounded-md hover:bg-gray-50 data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-colors duration-200"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-2 bg-white border rounded-md hover:bg-gray-50 data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-colors duration-200"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-2 bg-white border rounded-md hover:bg-gray-50 data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-colors duration-200"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Bookings</span>
                <span className="sm:hidden">Bookings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payment" 
                className="flex items-center gap-2 whitespace-nowrap px-3 sm:px-4 py-2 bg-white border rounded-md hover:bg-gray-50 data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-colors duration-200"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payment Methods</span>
                <span className="sm:hidden">Payment</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </div>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setDisplayName(currentUser?.displayName || "");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-gray-50">
                      {currentUser?.displayName || "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    {currentUser?.email}
                  </div>
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={loading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                )}

                <Separator className="my-6" />

                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View your past orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="flex justify-center space-x-8 py-8">
                  {/* New Orders */}
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">New Orders</p>
                    <Button
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => navigate("/menu")}
                    >
                      Browse Menu
                    </Button>
                  </div>

                  {/* Order History */}
                  <div className="text-center">
                    <Package className="h-12 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Order History</p>
                    <Button
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => navigate("/profile?tab=orders")}
                    >
                      My Orders
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{order.id}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm">{order.items} items</span>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">
                            ₹{order.total.toFixed(2)}
                          </span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Your Reservations</CardTitle>
              <CardDescription>Manage your table reservations</CardDescription>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <div className="flex justify-center space-x-8 py-8">
                  {/* Make New Reservations */}
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">New reservations.</p>
                    <Button
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => navigate("/reservations")}
                    >
                      Book a Table
                    </Button>
                  </div>

                  {/* Booking History */}
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Booking History</p>
                    <Button
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => navigate("/profile?tab=bookings")}
                    >
                      My Booking
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{booking.id}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.date).toLocaleDateString()} at{" "}
                            {booking.time}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "Completed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {booking.status}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm">{booking.guests} guests</span>
                        <div className="flex items-center gap-2">
                          {booking.status === "Upcoming" && (
                            <>
                              <Button variant="outline" size="sm">
                                Modify
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {booking.status === "Completed" && (
                            <Button variant="outline" size="sm">
                              Book Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-3 ">
                <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-6 " />
                <p className="text-gray-500 mb-4">
                  Paying attention costs you nothing, but not paying attention
                  could cost you everything.
                </p>
                <div className="w-full max-w-md mx-auto">
                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-8">
                    <h3 className="text-xl font-semibold text-center mb-6">
                      We Accept
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png"
                          alt="UPI"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">UPI</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png"
                          alt="Paytm"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">Paytm</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png"
                          alt="Google Pay"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">
                          Google Pay
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png"
                          alt="PhonePe"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">PhonePe</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MasterCard_logo.png/640px-MasterCard_logo.png"
                          alt="MasterCard"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">
                          MasterCard
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png"
                          alt="Visa"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">Visa</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                          alt="American Express"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">Amex</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/1200px-RuPay.svg.png"
                          alt="RuPay"
                          className="h-10 object-contain mb-2"
                        />
                        <span className="text-xs text-gray-600">RuPay</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-centre  mx-30">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        UPI ID: 8250565455@ybl
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Bank Account: 1256545835
                      </p>
                      <p className="text-sm text-gray-600 ">
                        IFSC CODE: SBIN0006
                      </p>
                    </div>
                    <Button
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => navigate("/checkout")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Make Payment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;

import React, { useEffect } from "react";
import UserDashboard from "@/components/user/UserDashboard";
import OrderHistory from "@/components/user/OrderHistory";
import BookingHistory from "@/components/user/BookingHistory";
import PaymentMethods from "@/components/user/PaymentMethods";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import OrderReceipt from "./NotFound"; // Will be renamed to OrderReceipt

function Profile() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab") || "profile";

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>Loading your profile...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Render the appropriate component based on the tab parameter
  const renderContent = () => {
    switch (tab) {
      case "orders":
        return <OrderHistory />;
      case "bookings":
        return <BookingHistory />;
      case "payment":
        return <PaymentMethods />;
      default:
        return <UserDashboard />;
    }
  };

  return renderContent();
}

export default Profile;

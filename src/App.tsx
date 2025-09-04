import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./components/cart/CartContext";
import BuyNowPopup from "./components/cart/BuyNowPopup";
import { measurePerformance, preloadCriticalImages } from "./utils/performance";

// Lazy load all pages for better performance
const Home = lazy(() => import("./pages/home"));
const Menu = lazy(() => import("./pages/menu"));
const Gallery = lazy(() => import("./pages/gallery"));
const About = lazy(() => import("./pages/about"));
const Reservations = lazy(() => import("./pages/reservations"));
const Contact = lazy(() => import("./pages/contact"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Profile = lazy(() => import("./pages/profile"));
const Checkout = lazy(() => import("./pages/checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderReceipt = lazy(() => import("./pages/OrderReceipt"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsOfService = lazy(() => import("./pages/terms-of-service"));

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Performance monitoring
  React.useEffect(() => {
    measurePerformance();
    preloadCriticalImages();
  }, []);
  
  return (
    <AuthProvider>
      <CartProvider>
        <BuyNowPopup />
        <Suspense fallback={<LoadingSpinner size="lg" className="min-h-[40vh]" />}>
          <div className="flex flex-col min-h-screen">
            {!isHomePage && <Navbar isLandingPage={false} />}
            <main className={`scroll-smooth flex-grow ${!isHomePage ? 'pt-20' : ''}`}>
              {/* Add padding top to account for fixed navbar */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/about" element={<About />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/order/:id" element={<OrderReceipt />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

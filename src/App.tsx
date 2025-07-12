import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Menu from "./pages/menu";
import Gallery from "./pages/gallery";
import About from "./pages/about";
import Reservations from "./pages/reservations";
import Contact from "./pages/contact";
import Login from "./pages/login";
import Register from "./pages/register";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./components/cart/CartContext";
import NotFound from "./pages/NotFound";
import OrderReceipt from "./pages/OrderReceipt";

const Profile = lazy(() => import("./pages/profile"));
const Checkout = lazy(() => import("./pages/checkout"));

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <AuthProvider>
      <CartProvider>
        <Suspense fallback={<div className="flex justify-center items-center min-h-[40vh]"><svg className="animate-spin h-8 w-8 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Loading...</div>}>
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
                <Route
                  path="/privacy-policy"
                  element={React.createElement(
                    React.lazy(() => import("./pages/privacy-policy")),
                  )}
                />
                <Route
                  path="/terms-of-service"
                  element={React.createElement(
                    React.lazy(() => import("./pages/terms-of-service")),
                  )}
                />
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

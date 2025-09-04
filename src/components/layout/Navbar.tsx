import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, ShoppingCart } from "lucide-react";
import CartDrawer from "../cart/CartDrawer";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/components/cart/CartContext";

interface NavbarProps {
  isLoggedIn?: boolean;
  cartItemCount?: number;
  isLandingPage?: boolean;
}

const Navbar = ({ cartItemCount = 0, isLandingPage = false }: NavbarProps) => {
  const { currentUser, logout } = useAuth();
  const isLoggedIn = !!currentUser;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full h-20 z-50 ${isLandingPage ? (scrolled ? "bg-slate-900/80 backdrop-blur-sm shadow-md" : "bg-transparent") : "bg-slate-900 shadow-md"}`}
        style={{ 
          transform: 'translate3d(0, 0, 0)',
          willChange: 'auto',
          backfaceVisibility: 'hidden',
          contain: 'layout',
          overflow: 'visible'
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between" style={{ 
          minHeight: '80px',
          maxHeight: '80px',
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden'
        }}>
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="./assets/images/logo/bengal-bay.png"
              alt="Bengal Bay Logo"
              className="h-10 w-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
            />
            
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`px-4 py-2 transition-all duration-300 relative font-medium text-lg rounded-lg hover:bg-white/10 hover:scale-105 ${location.pathname === "/menu" ? "text-amber-600" : "text-white hover:text-amber-600"}`}
                    asChild
                  >
                    <Link to="/menu">
                      Menu
                      {location.pathname === "/menu" && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-fade-in" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`px-4 py-2 transition-all duration-300 relative font-medium text-lg rounded-lg hover:bg-white/10 hover:scale-105 ${location.pathname === "/gallery" ? "text-amber-600" : "text-white hover:text-amber-600"}`}
                    asChild
                  >
                    <Link to="/gallery">
                      Gallery
                      {location.pathname === "/gallery" && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-fade-in" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`px-4 py-2 transition-all duration-300 relative font-medium text-lg rounded-lg hover:bg-white/10 hover:scale-105 ${location.pathname === "/reservations" ? "text-amber-600" : "text-white hover:text-amber-600"}`}
                    asChild
                  >
                    <Link to="/reservations">
                      Reservations
                      {location.pathname === "/reservations" && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-fade-in" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`px-4 py-2 transition-all duration-300 relative font-medium text-lg rounded-lg hover:bg-white/10 hover:scale-105 ${location.pathname === "/about" ? "text-amber-600" : "text-white hover:text-amber-600"}`}
                    asChild
                  >
                    <Link to="/about">
                      About
                      {location.pathname === "/about" && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-fade-in" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={`px-4 py-2 transition-all duration-300 relative font-medium text-lg rounded-lg hover:bg-white/10 hover:scale-105 ${location.pathname === "/contact" ? "text-amber-600" : "text-white hover:text-amber-600"}`}
                    asChild
                  >
                    <Link to="/contact">
                      Contact
                      {location.pathname === "/contact" && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-8 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full animate-fade-in" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth & Cart Buttons */}
          <div className="hidden md:flex items-center space-x-4" style={{ position: 'relative', zIndex: 1000 }}>
            {isLoggedIn ? (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full text-white hover:bg-amber-100 hover:text-amber-600"
                  style={{ 
                    minWidth: '40px', 
                    minHeight: '40px',
                    maxWidth: '40px',
                    maxHeight: '40px'
                  }}
                  asChild
                >
                  <Link to="/profile">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="h-7 w-7 rounded-full object-cover border-2 border-amber-400" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 hover:scale-105 hover:shadow-md text-lg"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  className="text-white hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 hover:scale-105 hover:shadow-md text-lg"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  variant="default"
                  className="bg-amber-600 hover:bg-amber-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg"
                  asChild
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            <div className="relative flex items-center" style={{ position: 'relative', zIndex: 1000 }}>
              <CartDrawer>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full text-white hover:bg-amber-100 hover:text-amber-600"
                  aria-label="Open cart"
                  style={{ 
                    minWidth: '40px', 
                    minHeight: '40px',
                    maxWidth: '40px',
                    maxHeight: '40px'
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 animate-fade-in border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </CartDrawer>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-amber-100 hover:text-amber-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ minWidth: '40px', minHeight: '40px' }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute w-full max-h-[80vh] overflow-y-auto animate-slide-in-down">
            <div className="flex flex-col p-4 space-y-4">
              <Link
                to="/menu"
                className={`py-2 border-b border-gray-100 ${location.pathname === "/menu" ? "text-amber-600 font-medium" : "text-black hover:text-amber-600"}`}
                onClick={toggleMobileMenu}
              >
                Menu
              </Link>
              <Link
                to="/gallery"
                className={`py-2 border-b border-gray-100 ${location.pathname === "/gallery" ? "text-amber-600 font-medium" : "text-black hover:text-amber-600"}`}
                onClick={toggleMobileMenu}
              >
                Gallery
              </Link>
              <Link
                to="/reservations"
                className={`py-2 border-b border-gray-100 ${location.pathname === "/reservations" ? "text-amber-600 font-medium" : "text-black hover:text-amber-600"}`}
                onClick={toggleMobileMenu}
              >
                Reservations
              </Link>
              <Link
                to="/about"
                className={`py-2 border-b border-gray-100 ${location.pathname === "/about" ? "text-amber-600 font-medium" : "text-black hover:text-amber-600"}`}
                onClick={toggleMobileMenu}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`py-2 border-b border-gray-100 ${location.pathname === "/contact" ? "text-amber-600 font-medium" : "text-black hover:text-amber-600"}`}
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      className="block py-2 text-black hover:text-amber-600"
                      onClick={toggleMobileMenu}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      className="block py-2 text-black hover:text-amber-600"
                      onClick={toggleMobileMenu}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile?tab=bookings"
                      className="block py-2 text-black hover:text-amber-600"
                      onClick={toggleMobileMenu}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile?tab=payment"
                      className="block py-2 text-black hover:text-amber-600"
                      onClick={toggleMobileMenu}
                    >
                      Payment Methods
                    </Link>
                    <button
                      className="block w-full text-left py-2 text-black hover:text-amber-600"
                      onClick={() => {
                        handleLogout();
                        toggleMobileMenu();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      className="justify-center text-black hover:text-amber-600 hover:bg-amber-50"
                      asChild
                    >
                      <Link to="/login" onClick={toggleMobileMenu}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      variant="default"
                      className="justify-center bg-amber-600 hover:bg-amber-700 text-white"
                      asChild
                    >
                      <Link to="/register" onClick={toggleMobileMenu}>
                        Register
                      </Link>
                    </Button>
                  </div>
                )}

                <button
                  className="flex items-center justify-between py-3 mt-4 border-t border-gray-100 text-black hover:text-amber-600 w-full"
                  onClick={() => {
                    toggleMobileMenu();
                    (document.querySelector('[aria-label="Open cart"]') as HTMLElement | null)?.click();
                  }}
                >
                  <span className="flex items-center">
                    <CartDrawer>
                      <span className="flex items-center">Cart</span>
                    </CartDrawer>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Gradient border at bottom */}
    </>
  );
};

export default Navbar;

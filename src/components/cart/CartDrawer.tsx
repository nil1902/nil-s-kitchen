import React, { memo, useCallback, useMemo, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  children?: React.ReactNode;
}

// Skeleton component for instant loading
const CartSkeleton = memo(() => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="h-20 w-20 rounded-md bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-between items-center">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

// Memoized CartItem component to prevent unnecessary re-renders
const CartItem = memo(({ item, onRemove, onUpdateQuantity }: {
  item: any;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) => {
  const formatPrice = useCallback((price: number) => `₹${price.toFixed(2)}`, []);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex gap-4">
      <div className="h-20 w-20 rounded-md overflow-hidden bg-muted relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={item.image}
          alt={item.name}
          className={`h-full w-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
          <h4 className="font-medium">{item.name}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {item.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <p className="font-medium">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
});

const CartDrawer: React.FC<CartDrawerProps> = ({ children }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } =
    useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Preload cart data on hover for instant opening
  const handleMouseEnter = useCallback(() => {
    if (!isPreloaded) {
      setIsPreloaded(true);
      // Preload images
      cartItems.forEach(item => {
        const img = new Image();
        img.src = item.image;
      });
    }
  }, [cartItems, isPreloaded]);

  // Handle cart opening with skeleton
  const handleOpenChange = useCallback((open: boolean) => {
    if (open && cartItems.length > 0) {
      setShowSkeleton(true);
      // Show skeleton briefly for perceived performance
      setTimeout(() => setShowSkeleton(false), 150);
    }
    setIsOpen(open);
  }, [cartItems.length]);

  const handleCheckout = useCallback(() => {
    if (!currentUser) {
      setIsOpen(false);
      navigate("/login", { replace: false });
    } else {
      setIsOpen(false);
      navigate("/checkout", { replace: false });
    }
  }, [currentUser, navigate]);

  const formatPrice = useCallback((price: number) => `₹${price.toFixed(2)}`, []);

  // Memoized calculations
  const taxAmount = useMemo(() => cartTotal * 0.05, [cartTotal]);
  const finalTotal = useMemo(() => cartTotal + taxAmount, [cartTotal, taxAmount]);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div onMouseEnter={handleMouseEnter}>
          {children || (
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Your Cart</SheetTitle>
            {/* Only one X button for closing */}
          </div>
          <div className="text-sm text-muted-foreground">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </div>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <SheetClose asChild>
              <Button
                variant="default"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              {showSkeleton ? (
                <CartSkeleton />
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={removeFromCart}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{cartTotal > 0 ? "Free" : formatPrice(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

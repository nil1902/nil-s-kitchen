import React, { useEffect, useRef, useState } from "react";
import { useCart } from "./CartContext";

const SHOW_DURATION = 12000; // ms (12 seconds - 3 times longer)

const BuyNowPopup: React.FC = () => {
  const { cartItems } = useCart();
  const [show, setShow] = useState(false);
  const prevCartLength = useRef(cartItems.length);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cartItems.length > prevCartLength.current) {
      setShow(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setShow(false), SHOW_DURATION);
    }
    prevCartLength.current = cartItems.length;
    // eslint-disable-next-line
  }, [cartItems.length]);

  const handleClick = () => {
    setShow(false);
    // Trigger the cart drawer by clicking the cart button in the navbar
    const cartButton = document.querySelector('[aria-label="Open cart"]') as HTMLElement;
    if (cartButton) {
      cartButton.click();
    }
  };

  if (!show) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
    >
      <button
        onClick={handleClick}
        style={{
          backgroundColor: '#d97706',
          color: 'white',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '9999px',
          border: 'none',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
          cursor: 'pointer',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#b45309';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#d97706';
        }}
      >
        🛒 Buy Now
      </button>
    </div>
  );
};

export default BuyNowPopup; 
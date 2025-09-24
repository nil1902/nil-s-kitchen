import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const HeroBanner = ({
  title = "Welcome to Bengal Bay",
  subtitle = "Experience authentic flavors with our handcrafted dishes made from the freshest ingredients.",
  imageUrl = "./assets/images/home/p1.webp",
}: HeroBannerProps) => {
  const navigate = useNavigate();

  const handleBookTable = () => {
    navigate("/reservations");
  };

  const handleOrderOnline = () => {
    navigate("/menu");
  };

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      <Navbar isLandingPage={true} />

      {/* Background Image with Mobile-Optimized Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {/* Enhanced gradient overlay for better mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 md:bg-gradient-to-r md:from-black/50 md:via-transparent md:to-black/20"></div>
      </div>

      {/* Mobile-First Content Layout */}
      <div className="relative h-full flex flex-col justify-center items-center md:items-start text-center md:text-left text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-center md:justify-center h-full">

          {/* Mobile-Optimized Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 max-w-4xl leading-tight drop-shadow-2xl animate-fade-in">
            <span className="block md:inline">{title.split(' ').slice(0, 2).join(' ')}</span>
            <span className="block md:inline text-amber-400 mt-1 md:mt-0 md:ml-2">{title.split(' ').slice(2).join(' ')}</span>
          </h1>

          {/* Mobile-Optimized Subtitle */}
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl leading-relaxed text-gray-100 animate-fade-in delay-100">
            {subtitle}
          </p>

          {/* Mobile-First CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto animate-fade-in delay-200">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-amber-400"
              onClick={handleOrderOnline}
            >
              🍽️ Order Online <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white/90 backdrop-blur-sm text-amber-700 font-semibold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:bg-white transform hover:scale-105 transition-all duration-300 border-2 border-white/50"
              onClick={handleBookTable}
            >
              📅 Book a Table
            </Button>
          </div>

          {/* Mobile-Optimized Features */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6 md:mt-8 animate-fade-in delay-300">
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full text-sm">
              <span className="mr-2">⭐</span>
              <span>4.8 Rating</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full text-sm">
              <span className="mr-2">🚚</span>
              <span>Free Delivery</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full text-sm">
              <span className="mr-2">⚡</span>
              <span>30 Min Delivery</span>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Opening Hours Badge */}

      </div>

      {/* Enhanced Scroll Down Indicator - Responsive Centered */}
      <div className="absolute bottom-6 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 w-fit flex flex-col items-center animate-bounce z-20">
        <span className="text-white/80 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Explore More</span>
        <div
          onClick={handleScrollDown}
          className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg hover:scale-110 active:scale-95"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

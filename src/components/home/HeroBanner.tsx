import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const HeroBanner = ({
  title = "Welcome to Bengal Bay",
  subtitle = "Experience authentic flavors with our handcrafted dishes made from the freshest ingredients.",
  imageUrl = "/assets/images/home/p1.webp",
}: HeroBannerProps) => {
  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      <Navbar isLandingPage={true} />
      {/* Background Image with Animated Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
       
      </div>
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-slate-100">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-2x  drop-shadow-2xl animate-fade-in">
          {title}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl animate-fade-in delay-100">
          {subtitle}
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all duration-200"
            onClick={() => (window.location.href = "/reservations")}
          >
            Book a Table
          </Button>
          <Button
            size="lg"
            className="bg-white text-amber-700 font-bold shadow-lg hover:bg-amber-100 transition-all duration-200 border border-amber-600"
            onClick={() => (window.location.href = "/menu")}
          >
            Order Online <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Optional Badge */}
        <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8 bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md animate-fade-in delay-300">
          Open Today: 11:00 AM - 10:00 PM
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10">
        <span className="text-white text-xs mb-1">Scroll Down</span>
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default HeroBanner;

import React, { useEffect } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import IntroSection from "@/components/home/IntroSection";
import FeaturedDishes from "@/components/home/FeaturedDishes";

function Home() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="w-full">
      <HeroBanner />
      <IntroSection />
      <FeaturedDishes />
      <TestimonialsSection />
    </div>
  );
}

export default Home;

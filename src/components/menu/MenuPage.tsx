import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DishCard from "./DishCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { menuItems } from "./MenuData";
import FoodDetailDialog from "./FoodDetailDialog";

import { MenuItem } from "./MenuData";

const MenuPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const filteredDishes = menuItems.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && dish.type === activeTab;
  });

  const { addToCart } = useCart();

  const handleAddToCart = (id: string) => {
    const dish = menuItems.find((item) => item.id === id);
    if (dish) {
      addToCart(dish);
    }
  };

  const handleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDishClick = (dish: MenuItem) => {
    setSelectedDish(dish);
    setIsDetailDialogOpen(true);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('scrollable-tabs');
    if (container) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-50 to-white py-8 md:py-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Mobile-Optimized Header */}
        <div className="text-center mb-6 md:mb-10">
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Our <span className="text-amber-600">Menu</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore our wide range of delicious dishes prepared with the finest
            ingredients and authentic recipes
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          {/* Enhanced Mobile Search */}
          <div className="relative w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Search your favorite dish..."
              className="pl-12 pr-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 bg-white shadow-sm text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-500" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Tabs */}
          <Tabs
            defaultValue="all"
            className="hidden md:block w-full md:w-auto"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-8 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="veg">Vegetarian</TabsTrigger>
              <TabsTrigger value="non-veg">Non-Veg</TabsTrigger>
              <TabsTrigger value="biryani">Biryani</TabsTrigger>
              <TabsTrigger value="bread">Bread</TabsTrigger>
              <TabsTrigger value="starter">Starters</TabsTrigger>
              <TabsTrigger value="drinks">Drinks</TabsTrigger>
              <TabsTrigger value="dessert">Desserts</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Enhanced Mobile Sliding Tabs */}
          <div className="md:hidden w-full">
            <div className="relative bg-white rounded-xl shadow-sm border border-amber-100 p-2">
              {/* Left Scroll Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg rounded-full h-8 w-8 hover:from-amber-600 hover:to-amber-700"
                onClick={() => handleScroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Right Scroll Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg rounded-full h-8 w-8 hover:from-amber-600 hover:to-amber-700"
                onClick={() => handleScroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Scrollable Tabs Container */}
              <div 
                id="scrollable-tabs"
                className="flex gap-2 overflow-x-auto scrollbar-hide px-10 py-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {[
                  { key: "all", label: "🍽️ All", emoji: "🍽️" },
                  { key: "veg", label: "🥬 Veg", emoji: "🥬" },
                  { key: "non-veg", label: "🍖 Non-Veg", emoji: "🍖" },
                  { key: "biryani", label: "🍚 Biryani", emoji: "🍚" },
                  { key: "bread", label: "🍞 Bread", emoji: "🍞" },
                  { key: "starter", label: "🥗 Starters", emoji: "🥗" },
                  { key: "drinks", label: "🥤 Drinks", emoji: "🥤" },
                  { key: "dessert", label: "🍰 Desserts", emoji: "🍰" }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      activeTab === tab.key
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md"
                        : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <span>{tab.emoji}</span>
                      <span className="hidden sm:inline">{tab.label.split(' ')[1]}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count for Mobile */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <p className="text-sm text-gray-600">
            {filteredDishes.length} dishes found
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm text-amber-600 font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Enhanced Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => handleDishClick(dish)}
                className="cursor-pointer"
              >
                <DishCard
                  id={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  image={dish.image}
                  rating={dish.rating}
                  category={dish.category}
                  isSpecial={dish.isSpecial}
                  onAddToCart={(id) => {
                    // Prevent the click event from bubbling up to the parent
                    event?.stopPropagation();
                    handleAddToCart(id);
                  }}
                  onFavorite={(id) => {
                    // Prevent the click event from bubbling up to the parent
                    event?.stopPropagation();
                    handleFavorite(id);
                  }}
                  isFavorite={favorites.includes(dish.id)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-500">
                No dishes found matching your search.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Food Detail Dialog */}
      <FoodDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        dish={selectedDish}
        onFavorite={(id) => {
          handleFavorite(id);
        }}
      />
    </div>
  );
};

export default MenuPage;

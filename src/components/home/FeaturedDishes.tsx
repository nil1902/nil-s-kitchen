import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, StarHalf, Star as StarOutline } from "lucide-react";
import DishCard from "../menu/DishCard";
import { useNavigate } from "react-router-dom";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  isSpecial: boolean;
}

interface FeaturedDishesProps {
  title?: string;
  subtitle?: string;
  dishes?: Dish[];
  onAddToCart?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

const FeaturedDishes = ({
  title = "Featured Dishes",
  subtitle = "Our chef's special selection of signature dishes that you must try",
  dishes = [
    {
      id: "1",
      name: "Butter Chicken",
      description:
        "Tender chicken in a rich, creamy tomato sauce with aromatic spices",
      price: 160.99,
      image:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80",
      rating: 4.8,
      category: "Main Course",
      isSpecial: true,
    },
    {
      id: "2",
      name: "Vegetable Biryani",
      description:
        "Fragrant basmati rice cooked with mixed vegetables and aromatic spices",
      price: 145.99,
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80",
      rating: 4.6,
      category: "Rice",
      isSpecial: false,
    },
    {
      id: "3",
      name: "Garlic Naan",
      description:
        "Soft, fluffy bread topped with garlic and butter, baked in a tandoor",
      price: 9.99,
      image:
        "https://imgs.search.brave.com/9T2jwTVsOJbFNt0t-8zqxg3hU4P2aU9TZw6MYH0RY8A/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/aGFsZmJha2VkaGFy/dmVzdC5jb20vd3At/Y29udGVudC91cGxv/YWRzLzIwMTkvMDIv/SGVyYmVkLUdhcmxp/Yy1CdXR0ZXItTmFh/bi05LTcwMHg0Njcu/anBn",
      rating: 4.7,
      category: "Bread",
      isSpecial: false,
    },
    {
      id: "4",
      name: "Mango Lassi",
      description:
        "Refreshing yogurt drink blended with ripe mangoes and a hint of cardamom",
      price: 39.99,
      image:
        "https://imgs.search.brave.com/FphJjw_7jaEvUCqR06yMKoski7IPEIOAsphqWP6x5ww/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9k/ZWxpY2lvdXMtaW5k/aWFuLW1hbmdvLWRy/aW5rXzIzLTIxNDg3/MzQ2NzkuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MA",
      rating: 4.5,
      category: "Beverage",
      isSpecial: true,
    },
    {
      id: "5",
      name: "Paneer Tikka",
      description:
        "Chunks of cottage cheese marinated in spices and grilled to perfection",
      price: 99.99,
      image:
        "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&q=80",
      rating: 4.4,
      category: "Appetizer",
      isSpecial: false,
    },
    {
      id: "6",
      name: "Lucknowi Biryani",
      description: "Fragrant basmati rice cooked with meat in the Lucknowi style",
      price: 599,
      image:
        "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80",
      rating: 4.7,
      category: "Rice",
      isSpecial: false,
    },
    {
      id: "7",
      name: "Hyderabadi Biryani",
      description:
        "Authentic Hyderabadi-style biryani with tender meat and aromatic rice",
      price: 649,
      image:
        "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500&q=80",
      rating: 4.9,
      category: "Rice",
      isSpecial: true,
    },
    {
      id: "8",
      name: "Chicken Korma",
      description: "Chicken pieces in a mild, creamy sauce with nuts and spices",
      price: 499,
      image:
        "https://imgs.search.brave.com/yxwZmENfW3Fxyl_Q0komABB9cbzHnn8gL075veXSjwA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ncmVh/dGN1cnJ5cmVjaXBl/cy5uZXQvd3AtY29u/dGVudC91cGxvYWRz/LzIwMTUvMDQvdGh1/bWIzLmpwZw",
      rating: 4.7,
      category: "Main Course",
      isSpecial: false,
    },
  ],
  onAddToCart = (id) => console.log(`Added dish ${id} to cart`),
  onFavorite = (id) => console.log(`Added dish ${id} to favorites`),
}: FeaturedDishesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1); // mobile
      else if (window.innerWidth < 768) setItemsPerView(2); // small tablet
      else if (window.innerWidth < 1024) setItemsPerView(3); // tablet
      else setItemsPerView(4); // desktop
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, dishes.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleViewFullMenu = () => {
    navigate("/menu");
  };

  return (
    <div className="w-full bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mx-auto max-w-2xl text-gray-600">{subtitle}</p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-md"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="w-full overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="w-full px-2 sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 transition-transform duration-200 hover:scale-105 hover:z-10"
                  >
                    <div className="relative">
                      {dish.isSpecial && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded z-20 animate-fade-in">
                          Special
                        </span>
                      )}
                      <DishCard
                        id={dish.id}
                        name={dish.name}
                        description={dish.description}
                        price={dish.price}
                        image={dish.image}
                        rating={dish.rating}
                        category={dish.category}
                        isSpecial={dish.isSpecial}
                        onAddToCart={onAddToCart}
                        onFavorite={onFavorite}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white shadow-md"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-2">
          {Array.from({
            length: Math.ceil(dishes.length / itemsPerView),
          }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`h-2 w-2 rounded-full p-0 ${currentIndex === index ? "bg-primary" : "bg-gray-300"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            className="bg-amber-600 text-white hover:bg-amber-700"
            onClick={handleViewFullMenu}
          >
            View Full Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDishes;

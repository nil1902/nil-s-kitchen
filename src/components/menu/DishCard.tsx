import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

interface DishCardProps {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  rating?: number;
  category?: string;
  isSpecial?: boolean;
  isFavorite?: boolean;
  onAddToCart?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

const DishCard = ({
  id = "1",
  name = "Spicy Chicken Pasta",
  description = "Tender chicken pieces in a spicy tomato sauce with fresh herbs and parmesan cheese.",
  price = 499, // Price in INR
  image = "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
  rating = 4.5,
  category = "Pasta",
  isSpecial = false,
  isFavorite = false,
  onAddToCart = () => console.log("Add to cart clicked"), // Default handler
  onFavorite = () => {},
}: DishCardProps) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <Card className="w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px] lg:max-w-[300px] h-[390px] md:h-[410px] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg bg-white">
      <div className="relative">
        <div className="h-[180px] w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        {isSpecial && (
          <Badge className="absolute left-2 top-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded z-20 animate-fade-in hover:bg-amber-500 hover:text-white">
            Special
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-2 bg-white/80 ${isFavorite ? "text-red-600" : "text-red-500"} hover:bg-white hover:text-red-600 transition-transform duration-200 ${isFavorite ? "scale-110" : "hover:scale-110"}`}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(id);
          }}
        >
          <Heart
            className={`h-5 w-5 ${isFavorite ? "fill-current" : ""} transition-all duration-300 hover:scale-110`}
          />
        </Button>
      </div>

      <CardHeader className="p-3 pb-0 md:p-4 md:pb-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate max-w-[140px] md:max-w-[180px]">{name}</h3>
          <Badge variant="outline" className="bg-gray-100 text-gray-700 text-xs md:text-sm px-2 py-1">
            {category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-2 md:p-4 md:pt-2 flex-1">
        <p className="mb-2 line-clamp-2 text-xs md:text-sm text-gray-600">{description}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-3 pt-0 md:p-4 md:pt-0 gap-2 w-full">
        <div className="flex items-center min-w-0 gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
          <span className="text-xs md:text-sm font-medium text-gray-700 truncate">{rating}</span>
        </div>
        <span className="text-base md:text-lg font-bold text-gray-900 mx-2 whitespace-nowrap">
          ₹{price.toFixed(2)}
        </span>
        {quantity > 0 ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); updateQuantity(id, quantity - 1); }} aria-label="Decrease quantity">-</Button>
            <span className="min-w-[24px] text-center">{quantity}</span>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); updateQuantity(id, quantity + 1); }} aria-label="Increase quantity">+</Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="bg-primary text-white hover:bg-primary/90 flex-shrink-0 text-xs md:text-sm px-2 md:px-3"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, name, description, price, image, rating, category, type: "veg", isSpecial });
            }}
            aria-label="Add to cart"
          >
            <ShoppingCart className="mr-1 md:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add to Cart</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DishCard;

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "food" | "restaurant" | "events" | "team";
}

const galleryImages: GalleryImage[] = [
  // Food Images
  {
    id: "f1",
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    alt: "Signature Dish - Butter Chicken",
    category: "food",
  },
  {
    id: "f2",
    src: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&q=80",
    alt: "Paneer Tikka Appetizer",
    category: "food",
  },
  {
    id: "f3",
    src: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&q=80",
    alt: "Vegetable Biryani",
    category: "food",
  },
  {
    id: "f4",
    src: "https://imgs.search.brave.com/Z0ZZkxbZHUGhaUD7lfPJvSVCH0SdCvlM7C5SlguDr7Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMz/NzIxMzMwOS9waG90/by9ndWxhYi1qYW11/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9TnpESDlPbTIz/aFp5RnNXNkt0NVo1/VUsyT19WUTdhaG80/SDB4b0hBRzg2TT0",
    alt: "Gulab Jamun Dessert",
    category: "food",
  },
  {
    id: "f5",
    src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80",
    alt: "Chana Masala",
    category: "food",
  },
  {
    id: "f6",
    src: "https://images.unsplash.com/photo-1626508035297-0cd27c397d67?w=1200&q=80",
    alt: "Fish Curry",
    category: "food",
  },
  {
    id: "f7",
    src: "https://imgs.search.brave.com/36UiHPC4R-fCsU2NXqJIz-9BghaENOxDjpepP76LTSU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzA4Lzg0LzI0/LzM2MF9GXzYwODg0/MjQxM19oZFlhZHA2/dVNDN2M3cHE2TEpl/dzlzOGdQblJTZ2ps/bi5qcGc",
    alt: "Chicken Biriyani",
    category: "food",
  },

  // Restaurant Images
  {
    id: "r1",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
    alt: "Restaurant Interior - Main Dining Area",
    category: "restaurant",
  },
  {
    id: "r2",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    alt: "Restaurant Bar Area",
    category: "restaurant",
  },
  {
    id: "r3",
    src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
    alt: "Private Dining Room",
    category: "restaurant",
  },
  {
    id: "r4",
    src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80",
    alt: "Outdoor Seating Area",
    category: "restaurant",
  },
  {
    id: "r5",
    src: "https://images.unsplash.com/photo-1519690889869-e705e59f72e1?w=1200&q=80",
    alt: "Restaurant Entrance",
    category: "restaurant",
  },

  // Events Images
  {
    id: "e1",
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
    alt: "Wedding Reception",
    category: "events",
  },
  {
    id: "e2",
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80",
    alt: "Corporate Event",
    category: "events",
  },
  {
    id: "e3",
    src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=80",
    alt: "Birthday Celebration",
    category: "events",
  },
  {
    id: "e4",
    src: "https://images.unsplash.com/photo-1470753937643-efeb931202a9?w=1200&q=80",
    alt: "Private Party",
    category: "events",
  },

  // Team Images
  {
    id: "t1",
    src: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&q=80",
    alt: "Chef Nilesh Kumar",
    category: "team",
  },
  {
    id: "t2",
    src: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1200&q=80",
    alt: "Our Culinary Team",
    category: "team",
  },
  {
    id: "t3",
    src: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&q=80",
    alt: "Restaurant Staff",
    category: "team",
  },
  {
    id: "t4",
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    alt: "Service Team",
    category: "team",
  },
];

const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredImages =
    activeTab === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeTab);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handlePrevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const prevIndex =
      (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id,
    );
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white py-8 md:py-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Mobile-Optimized Header */}
        <div className="text-center mb-6 md:mb-10">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Our <span className="text-amber-600">Gallery</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Take a visual journey through our restaurant, delicious dishes,
            special events, and our dedicated team
          </p>
        </div>

        {/* Mobile-Optimized Tabs */}
        <div className="mb-6 md:mb-8">
          {/* Desktop Tabs */}
          <Tabs
            defaultValue="all"
            className="hidden md:block w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-5 w-full max-w-md mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {[
                { key: "all", label: "All", emoji: "🖼️", count: galleryImages.length },
                { key: "food", label: "Food", emoji: "🍽️", count: galleryImages.filter(img => img.category === "food").length },
                { key: "restaurant", label: "Restaurant", emoji: "🏪", count: galleryImages.filter(img => img.category === "restaurant").length },
                { key: "events", label: "Events", emoji: "🎉", count: galleryImages.filter(img => img.category === "events").length },
                { key: "team", label: "Team", emoji: "👥", count: galleryImages.filter(img => img.category === "team").length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${activeTab === tab.key
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-700 shadow-sm border border-gray-200"
                    }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{tab.emoji}</span>
                    <span className="text-xs">{tab.label}</span>
                    <span className="text-xs opacity-75">({tab.count})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            {activeTab !== 'all' && ` in ${activeTab}`}
          </p>
          <div className="text-sm text-amber-600 font-medium">
            Tap to view full size
          </div>
        </div>

        {/* Enhanced Mobile Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
              onClick={() => handleImageClick(image)}
            >
              <AspectRatio ratio={1}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  loading={index < 8 ? "eager" : "lazy"}
                />
                {/* Mobile Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium truncate">
                      {image.alt}
                    </p>
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {image.category === 'food' && '🍽️'}
                    {image.category === 'restaurant' && '🏪'}
                    {image.category === 'events' && '🎉'}
                    {image.category === 'team' && '👥'}
                  </span>
                </div>
              </AspectRatio>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 text-white bg-black/50 hover:bg-black/70"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              <div className="relative">
                <img
                  src={selectedImage?.src}
                  alt={selectedImage?.alt}
                  className="w-full max-h-[80vh] object-contain"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>

              <div className="p-4 bg-white">
                <p className="text-lg font-medium">{selectedImage?.alt}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GalleryPage;

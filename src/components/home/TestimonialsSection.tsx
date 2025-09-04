import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ayesha Singh",
    role: "Food Blogger",
    image:
      "https://randomuser.me/api/portraits/women/75.webp",
    content:
              "Bengal Bay is my new go-to spot! Every bite bursts with authentic flavour – you can literally taste the love in each dish.",
  },
  {
    id: "2",
    name: "Rahul Sharma",
    role: "Entrepreneur",
    image:
      "https://randomuser.me/api/portraits/men/32.webp",
    content:
      "From presentation to taste, everything is five-star. The Butter Chicken left me speechless!",
  },
  {
    id: "3",
    name: "Priya Desai",
    role: "Designer",
    image:
      "https://randomuser.me/api/portraits/women/68.webp",
    content:
      "Beautiful ambience and incredible service. I celebrated my birthday here and it was perfect!",
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white to-amber-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">What our guests say</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          We value every smile that walks out of our restaurant. Here’s what some
          of our regulars have to say about their experience at Bengal Bay.
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="relative flex-1 max-w-md md:max-w-none bg-white shadow-lg border-0 hover:-translate-y-1 hover:shadow-xl transition-transform duration-300"
            >
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={t.image} alt={t.name} />
                  <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="italic text-gray-700 leading-relaxed">“{t.content}”</p>
                <div className="text-amber-600 font-semibold">
                  {t.name}
                  <span className="block text-sm font-normal text-gray-500">
                    {t.role}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

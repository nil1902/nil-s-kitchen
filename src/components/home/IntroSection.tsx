import React from "react";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";

interface IntroSectionProps {
  title?: string;
  description?: string;
  chefName?: string;
  chefDescription?: string;
  restaurantHistory?: string;
}

const IntroSection = ({
  title = "Welcome to Bengal Bay",
  description = "Experience the finest culinary delights in a warm, inviting atmosphere. Our passion for exceptional food and service creates memorable dining experiences for all our guests.",
  chefName = "Chef Nilesh Kumar",
  chefDescription = "With over 5 years of culinary expertise, Chef Nilesh brings his unique vision and passion to every dish, combining traditional techniques with innovative flavors.",
  restaurantHistory = "Established in 2020, Bengal Bay began as a small family restaurant and has grown into one of the city's most beloved dining destinations, known for our commitment to quality ingredients and authentic flavors.",
}: IntroSectionProps) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate("/about");
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4 animate-slide-in-down">
          {title}
        </h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-600 animate-fade-in delay-100">{description}</p>
      </div>

      <Separator className="my-8 animate-fade-in delay-200" />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 bg-purple-100/20 text-white p-8 rounded-xl border border-emerald-200/40 animate-slide-in-left">
          <h3 className="text-2xl font-semibold text-gray-900">
            {" "}
            <div className="flex items-center space-x-3">
              <img
                src="https://img.icons8.com/?size=100&id=23288&format=png"
                alt="Chef Icon"
                className="w-6 h-6 object-contain"
              />
              <span className="text-xxl font-semibold text-gray-800">
                {chefName}
              </span>
            </div>
          </h3>
          <p className="text-gray-600">{chefDescription}</p>
          <div className="pt-4">
            <button
              onClick={handleLearnMore}
              className="text-amber-600 hover:text-amber-700 font-medium inline-block cursor-pointer"
            >
              Learn more about our team →
            </button>
          </div>
        </div>

        <div className="bg-purple-100/20 text-white p-8 rounded-xl border border-emerald-200/40 animate-slide-in-right">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://img.icons8.com/?size=100&id=7xE1Vu0MCgzW&format=png"
                alt="Story Book Icon"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xxl font-semibold text-gray-800">
                Our Story
              </span>
            </div>
          </h3>
          <p className="text-gray-600">{restaurantHistory}</p>
          <div className="pt-4">
            <button
              onClick={handleLearnMore}
              className="text-amber-600 hover:text-amber-700 font-medium inline-block cursor-pointer"
            >
              Read our full story →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;

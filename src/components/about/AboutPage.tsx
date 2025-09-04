import React from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, Users, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80)`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            About Bengal Bay
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Our journey from a small family restaurant to a beloved culinary
            destination
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Bengal Bay was founded in 2010 by Chef Nilesh Kumar with a
                simple mission: to share authentic flavors and create memorable
                dining experiences for every guest.
              </p>
              <p>
                What began as a small 20-seat restaurant has grown into one of
                the city's most beloved culinary destinations, known for our
                commitment to quality ingredients, traditional techniques, and
                warm hospitality.
              </p>
              <p>
                Over the years, we've expanded our space and menu while staying
                true to our roots. Each dish tells a story of tradition,
                innovation, and passion for exceptional food.
              </p>
              <p>
                Today, Bengal Bay continues to be a family-owned
                establishment where every customer is treated like a part of our
                extended family. We take pride in creating a warm, inviting
                atmosphere where memories are made around the table.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
                alt="Restaurant Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md mt-8">
              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80"
                alt="Private Dining Area"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80"
                alt="Outdoor Seating"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md mt-8">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"
                alt="Bar Area"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="max-w-7xl mx-auto" />

      {/* Our Values */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The principles that guide everything we do at Bengal Bay
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-3 rounded-full mb-4">
                  <Heart className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Passion</h3>
                <p className="text-gray-600">
                  We pour our heart into every dish, creating food that delights
                  and inspires.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-3 rounded-full mb-4">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-gray-600">
                  We use only the finest ingredients and maintain the highest
                  standards in everything we do.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-3 rounded-full mb-4">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We create a welcoming space where people connect and celebrate
                  life's moments together.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-3 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tradition</h3>
                <p className="text-gray-600">
                  We honor culinary heritage while embracing innovation to
                  create timeless experiences.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="max-w-7xl mx-auto" />

      {/* Meet the Team */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The talented individuals who bring passion and expertise to Nil's
            Kitchen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4 border-4 border-amber-100">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
                alt="Chef Nilesh Kumar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Nilesh Kumar</h3>
            <p className="text-amber-600 mb-2">Founder & Head Chef</p>
            <p className="text-gray-600 max-w-xs mx-auto">
              With over 20 years of culinary experience, Chef Nilesh brings his
              passion and expertise to every dish.
            </p>
          </div>

          <div className="text-center">
            <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4 border-4 border-amber-100">
              <img
                src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=400&q=80"
                alt="Priya Sharma"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Priya Sharma</h3>
            <p className="text-amber-600 mb-2">Executive Chef</p>
            <p className="text-gray-600 max-w-xs mx-auto">
              Priya's innovative approach to traditional recipes has helped
              define our unique culinary style.
            </p>
          </div>

          <div className="text-center">
            <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4 border-4 border-amber-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                alt="Rahul Patel"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Rahul Patel</h3>
            <p className="text-amber-600 mb-2">Restaurant Manager</p>
            <p className="text-gray-600 max-w-xs mx-auto">
              Rahul ensures that every guest receives exceptional service and
              leaves with a memorable experience.
            </p>
          </div>

          <div className="text-center">
            <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4 border-4 border-amber-100">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"
                alt="Meera Kapoor"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Meera Kapoor</h3>
            <p className="text-amber-600 mb-2">Pastry Chef</p>
            <p className="text-gray-600 max-w-xs mx-auto">
              Meera's creative desserts provide the perfect sweet ending to
              every meal at Bengal Bay.
            </p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Achievements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recognition of our commitment to excellence over the years
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Best Restaurant 2023
                    </h3>
                    <p className="text-gray-600 mb-2">City Food Awards</p>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 border-amber-200"
                    >
                      2023
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Chef of the Year
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Culinary Excellence Awards
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 border-amber-200"
                    >
                      2022
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Customer Choice Award
                    </h3>
                    <p className="text-gray-600 mb-2">Dining Excellence</p>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-800 border-amber-200"
                    >
                      2021-2023
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Culinary Philosophy */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Culinary Philosophy
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                At Bengal Bay, we believe that food is more than just
                sustenance—it's an experience that brings people together and
                creates lasting memories.
              </p>
              <p>
                Our culinary philosophy is rooted in three core principles:
                authenticity, quality, and innovation. We stay true to
                traditional recipes while incorporating modern techniques and
                presentations.
              </p>
              <p>
                We source the freshest ingredients from local farmers and
                suppliers whenever possible, ensuring that every dish we serve
                is of the highest quality. Our spices are ground in-house daily
                to maintain their aromatic potency.
              </p>
              <p>
                Each dish at Bengal Bay tells a story—of heritage, of
                passion, and of the diverse culinary traditions that inspire us.
                We invite you to be part of this story and experience the magic
                that happens when exceptional food is served with genuine
                hospitality.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80"
                alt="Spice Selection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md mt-8">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80"
                alt="Chef Preparing Food"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"
                alt="Fresh Ingredients"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-md mt-8">
              <img
                src="https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=600&q=80"
                alt="Plated Dish"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Community Involvement */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Community Involvement
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in giving back to the community that has supported us
              throughout our journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-100 p-3 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-green-600"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Culinary Education
                  </h3>
                  <p className="text-gray-600">
                    We partner with local schools to provide culinary education
                    programs, teaching students about nutrition, cooking
                    techniques, and food sustainability.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-600"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Food Donation Program
                  </h3>
                  <p className="text-gray-600">
                    Through our food donation program, we provide meals to local
                    shelters and food banks, ensuring that everyone in our
                    community has access to nutritious food.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-100 p-3 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-purple-600"
                    >
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Charity Events</h3>
                  <p className="text-gray-600">
                    We regularly host charity dinners and fundraising events,
                    with proceeds going to various local causes and
                    organizations that make a difference in our community.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

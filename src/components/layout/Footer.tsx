import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NewsletterForm from "@/components/home/NewsletterForm";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-900 to-slate-800 text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Mobile-First Brand Section */}
        <div className="text-center md:hidden mb-8">
          <h2 className="text-2xl font-bold text-amber-400 mb-2">Bengal Bay</h2>
          <p className="text-gray-300 text-sm">Authentic Bengali Cuisine</p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 p-3 rounded-full hover:bg-amber-600 transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 p-3 rounded-full hover:bg-amber-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 p-3 rounded-full hover:bg-amber-600 transition-colors"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Restaurant Info */}
          <div className="md:block hidden">
            <h3 className="text-xl font-bold mb-4 text-amber-400">Bengal Bay</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">Shantipur, Station Rd, PIN: 741404</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">+918250565455</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">nilimeshpal4@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Mobile Contact Info */}
          <div className="md:hidden bg-slate-800 rounded-xl p-4">
            <h3 className="text-lg font-bold mb-3 text-amber-400 text-center">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Shantipur, Station Rd, PIN: 741404</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-amber-400 flex-shrink-0" />
                <a href="tel:+918250565455" className="text-gray-300 text-sm hover:text-amber-400">+918250565455</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 flex-shrink-0" />
                <a href="mailto:nilimeshpal4@gmail.com" className="text-gray-300 text-sm hover:text-amber-400">nilimeshpal4@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-slate-800 rounded-xl p-4 md:bg-transparent md:p-0">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-amber-400 text-center md:text-left">Opening Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm md:text-base">Monday - Friday</p>
                  <p className="text-gray-300 text-sm">11:00 AM - 10:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm md:text-base">Saturday - Sunday</p>
                  <p className="text-gray-300 text-sm">10:00 AM - 11:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="bg-slate-800 rounded-xl p-4 md:bg-transparent md:p-0">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-amber-400 text-center md:text-left">Quick Links</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <Link
                to="/menu"
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm md:text-base py-1 flex items-center gap-2"
              >
                <span className="md:hidden">🍽️</span>
                Menu
              </Link>
              <Link
                to="/reservations"
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm md:text-base py-1 flex items-center gap-2"
              >
                <span className="md:hidden">📅</span>
                Reservations
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm md:text-base py-1 flex items-center gap-2"
              >
                <span className="md:hidden">ℹ️</span>
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm md:text-base py-1 flex items-center gap-2"
              >
                <span className="md:hidden">📞</span>
                Contact
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm md:text-base py-1 flex items-center gap-2"
              >
                <span className="md:hidden">🔒</span>
                Privacy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-gray-300 hover:text-amber-400 transition-colors text-sm md:text-base py-1 flex items-center gap-2"
              >
                <span className="md:hidden">📋</span>
                Terms
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-slate-800 rounded-xl p-4 md:bg-transparent md:p-0">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-amber-400 text-center md:text-left">Newsletter</h3>
            <p className="mb-4 text-gray-300 text-sm md:text-base text-center md:text-left">
              Subscribe for special offers and updates.
            </p>
            <NewsletterForm />
            <div className="hidden md:flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6 md:my-8 bg-slate-700" />

        {/* Mobile-Optimized Bottom Section */}
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Bengal Bay. All rights reserved.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm md:text-base">
              Crafted with ❤️ by <span className="text-amber-400 font-medium">Nilimesh & Soumik & Rohit</span>
            </p>
          </div>

          <div className="flex gap-4 text-xs md:text-sm md:hidden">
            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-amber-400 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/terms-of-service"
              className="text-gray-400 hover:text-amber-400 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-8 w-8 text-emerald-500" />
              <span className="font-bold text-xl">Smart Village Mart</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting local village shopkeepers with customers. Supporting local businesses and bringing quality products to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-emerald-500 transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-emerald-500 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shopkeeper-login" className="text-gray-400 hover:text-emerald-500 transition">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/groceries" className="text-gray-400 hover:text-emerald-500 transition">
                  Groceries
                </Link>
              </li>
              <li>
                <Link to="/category/electronics" className="text-gray-400 hover:text-emerald-500 transition">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/agricultural" className="text-gray-400 hover:text-emerald-500 transition">
                  Agricultural
                </Link>
              </li>
              <li>
                <Link to="/category/fashion" className="text-gray-400 hover:text-emerald-500 transition">
                  Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">Village Market, India</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">+91 1234567890</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span className="text-sm">support@villagemart.com</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-2 mt-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition p-2" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition p-2" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition p-2" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Smart Village Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

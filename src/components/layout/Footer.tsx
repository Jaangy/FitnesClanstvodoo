import React from 'react';
import { Dumbbell, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Fitnes d.o.o.</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Providing exceptional fitness services since 2010. Join our community and transform your life.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/classes" className="text-gray-400 hover:text-white text-sm">
                  Classes
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-white text-sm">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/memberships" className="text-gray-400 hover:text-white text-sm">
                  Memberships
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-2 text-sm">
              <p>123 Fitness Street</p>
              <p>Ljubljana, 1000</p>
              <p>Slovenia</p>
              <p className="mt-2">Email: info@fitnes.com</p>
              <p>Phone: +386 1 234 5678</p>
            </address>
          </div>

          {/* Opening hours */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>6:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>8:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Holidays:</span>
                <span>10:00 - 16:00</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Fitnes d.o.o. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm text-gray-400">
              <li>
                <Link to="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
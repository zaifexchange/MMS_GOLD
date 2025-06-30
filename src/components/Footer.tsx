import React from 'react';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-500">MMS Gold</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner in gold trading and investment. Join thousands of satisfied clients 
              who have transformed their financial future with our platform.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-yellow-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Gold Trading</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Fixed Deposits</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">GoldGrowth Network</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400">Forex Gold Trading</span></li>
              <li><span className="text-gray-400">AI-Powered Trading</span></li>
              <li><span className="text-gray-400">Gold Coins & Bars</span></li>
              <li><span className="text-gray-400">Expert Advisors</span></li>
              <li><span className="text-gray-400">Trading Indicators</span></li>
              <li><span className="text-gray-400">24/7 Support</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-400">support@mmsgold.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-400">123 Gold Street, Financial District</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MMS Gold. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">Risk Disclosure</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
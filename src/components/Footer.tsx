import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
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
            <h3 className="text-xl font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-yellow-500 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-yellow-500 transition-colors">Our Services</Link></li>
              <li><Link to="/trading" className="text-gray-400 hover:text-yellow-500 transition-colors">Trading Platform</Link></li>
              <li><Link to="/education" className="text-gray-400 hover:text-yellow-500 transition-colors">Education Center</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-yellow-500 transition-colors">Support</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-yellow-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Trading */}
          <div>
            <h3 className="text-xl font-bold mb-6">Trading</h3>
            <ul className="space-y-3">
              <li><Link to="/trading" className="text-gray-400 hover:text-yellow-500 transition-colors">Gold Trading</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-yellow-500 transition-colors">Fixed Deposits</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-yellow-500 transition-colors">AI Trading</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-yellow-500 transition-colors">Expert Advisors</Link></li>
              <li><Link to="/education" className="text-gray-400 hover:text-yellow-500 transition-colors">Market Analysis</Link></li>
              <li><Link to="/education" className="text-gray-400 hover:text-yellow-500 transition-colors">Trading Signals</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-xl font-bold mb-6">Legal & Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Risk Disclosure</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Regulatory Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Complaints</a></li>
              <li><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">Email Support</p>
                <p className="text-white font-medium">support@mmsgold.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">24/7 Phone Support</p>
                <p className="text-white font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">Headquarters</p>
                <p className="text-white font-medium">123 Gold Street, Financial District</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 MMS Gold. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">Sitemap</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">Careers</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">Press</a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 text-sm transition-colors">Investors</a>
            </div>
          </div>
          
          {/* Risk Warning */}
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-xs leading-relaxed">
              <strong className="text-yellow-500">Risk Warning:</strong> Trading gold and other financial instruments involves substantial risk and may not be suitable for all investors. 
              Past performance is not indicative of future results. Please ensure you fully understand the risks involved and seek independent advice if necessary. 
              MMS Gold is regulated by [Regulatory Body] and client funds are held in segregated accounts with tier-1 banks.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
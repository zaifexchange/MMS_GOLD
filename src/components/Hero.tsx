import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Zap, DollarSign } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              MMS Gold
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Your all-in-all gold trading platform with AI-powered solutions, 
            fixed deposits, and the revolutionary GoldGrowth Network
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Start Trading Now
            </Link>
            <Link 
              to="/services" 
              className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-black transition-all transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Forex Gold Trading</h3>
              <p className="text-gray-400 text-sm">Trade XAU/USD with expert tools</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-400 text-sm">Bank-level security & encryption</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Trading</h3>
              <p className="text-gray-400 text-sm">Advanced algorithms & indicators</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Returns</h3>
              <p className="text-gray-400 text-sm">Up to 10% monthly returns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
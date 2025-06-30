import React from 'react';
import { BarChart3, Coins, Bot, PiggyBank, Users, ShoppingCart } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: BarChart3,
      title: 'Forex Gold Trading (XAU/USD)',
      description: 'Trade gold on international forex markets with real-time data and advanced charting tools.',
      features: ['Real-time charts', 'Expert advisors', 'Risk management tools']
    },
    {
      icon: Coins,
      title: 'Gold Coins & Bars',
      description: 'Buy and sell physical gold coins and bars with competitive pricing and secure delivery.',
      features: ['Various denominations', 'Secure storage', 'Global shipping']
    },
    {
      icon: Bot,
      title: 'AI-Powered Trading',
      description: 'Let artificial intelligence handle your gold trading with sophisticated algorithms.',
      features: ['Automated trading', 'Smart indicators', 'Market analysis']
    },
    {
      icon: PiggyBank,
      title: 'Fixed Deposit Plans',
      description: 'Secure your investment with guaranteed returns on fixed deposit plans.',
      features: ['6% - 3 months', '8% - 6 months', '10% - 1 year']
    },
    {
      icon: Users,
      title: 'GoldGrowth Network',
      description: 'Earn through our referral program with multi-level commission structure.',
      features: ['Level 1: 10%', 'Level 2: 3%', 'Level 3: 2%']
    },
    {
      icon: ShoppingCart,
      title: 'Trading Tools & EAs',
      description: 'Purchase expert advisors and premium trading indicators for better performance.',
      features: ['Expert advisors', 'Custom indicators', 'Trading signals']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive gold trading solutions designed for both beginners and professional traders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <service.icon className="h-8 w-8 text-black" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
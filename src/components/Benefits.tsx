import React from 'react';
import { Shield, Zap, Award, Clock } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Secure & Transparent Trading',
      description: 'Bank-level security with SSL encryption and transparent trading processes'
    },
    {
      icon: Zap,
      title: 'Instant Withdrawals',
      description: 'Quick and hassle-free withdrawals processed within 24 hours'
    },
    {
      icon: Award,
      title: 'Expert Support',
      description: '24/7 customer support with dedicated account managers for premium clients'
    },
    {
      icon: Clock,
      title: 'Real-Time Trading',
      description: 'Access live market data and execute trades in real-time with zero delays'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose MMS Gold?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the difference with our premium gold trading platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
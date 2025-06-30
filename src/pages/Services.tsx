import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServicesSection from '../components/ServicesSection';
import { BarChart3, Coins, Bot, PiggyBank, Users, ShoppingCart, TrendingUp, Shield, Zap, Award } from 'lucide-react';

const Services = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Market Data',
      description: 'Access live gold prices and market analysis 24/7'
    },
    {
      icon: Shield,
      title: 'Secure Trading',
      description: 'Bank-level security with SSL encryption'
    },
    {
      icon: Zap,
      title: 'Instant Execution',
      description: 'Lightning-fast trade execution with zero delays'
    },
    {
      icon: Award,
      title: 'Expert Support',
      description: '24/7 customer support from trading experts'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for beginners',
      features: [
        'Basic trading tools',
        'Market analysis',
        'Email support',
        'Educational resources'
      ]
    },
    {
      name: 'Professional',
      price: '$99/month',
      description: 'For serious traders',
      features: [
        'Advanced trading tools',
        'AI-powered signals',
        'Priority support',
        'Custom indicators',
        'Risk management tools'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$299/month',
      description: 'For institutional clients',
      features: [
        'All Professional features',
        'Dedicated account manager',
        'Custom EA development',
        'API access',
        'White-label solutions'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive gold trading solutions designed for traders of all levels
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced features that give you the edge in gold trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect plan for your trading needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black transform scale-105' 
                  : 'bg-white border-2 border-gray-200'
              } shadow-xl hover:shadow-2xl transition-all`}>
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-black text-yellow-500 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-black' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className={`text-4xl font-bold mb-2 ${plan.popular ? 'text-black' : 'text-gray-900'}`}>
                    {plan.price}
                  </div>
                  <p className={plan.popular ? 'text-black opacity-90' : 'text-gray-600'}>
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center ${plan.popular ? 'text-black' : 'text-gray-700'}`}>
                      <div className={`w-2 h-2 rounded-full mr-3 ${plan.popular ? 'bg-black' : 'bg-yellow-500'}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  plan.popular 
                    ? 'bg-black text-yellow-500 hover:bg-gray-900' 
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Trading?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful traders who trust MMS Gold for their trading needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105">
              Start Trading Now
            </button>
            <button className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-black transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
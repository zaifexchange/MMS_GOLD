import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Award, Users, TrendingUp, Target, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Security First',
      description: 'We prioritize the security of your investments with bank-level encryption and secure trading protocols.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from trading tools to customer support.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a strong community of traders who support and learn from each other.'
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description: 'Focused on helping our clients achieve consistent growth and financial success.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Traders' },
    { number: '$50M+', label: 'Trading Volume' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About MMS Gold</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your trusted partner in gold trading and investment, providing innovative solutions 
              for traders worldwide since our inception.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At MMS Gold, we're dedicated to democratizing gold trading and making it accessible 
                to everyone. Our mission is to provide cutting-edge trading tools, secure platforms, 
                and comprehensive support to help our clients achieve their financial goals.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe in transparency, innovation, and putting our clients first. Through our 
                advanced AI-powered trading systems and expert guidance, we're building the future 
                of gold trading.
              </p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 text-black">
              <Target className="h-16 w-16 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg leading-relaxed">
                To become the world's leading gold trading platform, empowering millions of traders 
                with innovative technology and unparalleled service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Our Impact</h2>
            <p className="text-xl text-black opacity-90">Numbers that speak for themselves</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-lg text-black opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experts behind MMS Gold's success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'John Smith',
                role: 'CEO & Founder',
                experience: '15+ years in financial markets'
              },
              {
                name: 'Sarah Johnson',
                role: 'CTO',
                experience: '12+ years in fintech development'
              },
              {
                name: 'Michael Brown',
                role: 'Head of Trading',
                experience: '20+ years in gold trading'
              }
            ].map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-black font-bold text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-yellow-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Globe className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Global Presence</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Serving traders across 50+ countries with localized support and compliance
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">50+</div>
                <div className="text-gray-300">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">25</div>
                <div className="text-gray-300">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">15</div>
                <div className="text-gray-300">Offices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">24/7</div>
                <div className="text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
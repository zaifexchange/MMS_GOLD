import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Video, Users, Award, TrendingUp, BarChart3, Target, Lightbulb } from 'lucide-react';

const Education = () => {
  const courses = [
    {
      title: 'Gold Trading Fundamentals',
      description: 'Learn the basics of gold trading, market dynamics, and key factors affecting gold prices.',
      duration: '4 hours',
      level: 'Beginner',
      lessons: 12,
      icon: BookOpen
    },
    {
      title: 'Technical Analysis Mastery',
      description: 'Master chart patterns, indicators, and technical analysis techniques for gold trading.',
      duration: '6 hours',
      level: 'Intermediate',
      lessons: 18,
      icon: BarChart3
    },
    {
      title: 'Risk Management Strategies',
      description: 'Develop robust risk management techniques to protect your trading capital.',
      duration: '3 hours',
      level: 'Intermediate',
      lessons: 10,
      icon: Target
    },
    {
      title: 'Advanced Trading Psychology',
      description: 'Understand the psychological aspects of trading and develop mental discipline.',
      duration: '5 hours',
      level: 'Advanced',
      lessons: 15,
      icon: Lightbulb
    }
  ];

  const webinars = [
    {
      title: 'Weekly Market Outlook',
      date: 'Every Monday',
      time: '15:00 GMT',
      host: 'Senior Market Analyst',
      description: 'Weekly analysis of gold market trends and upcoming events.'
    },
    {
      title: 'Live Trading Session',
      date: 'Every Wednesday',
      time: '13:00 GMT',
      host: 'Professional Trader',
      description: 'Watch live trades and learn real-time decision making.'
    },
    {
      title: 'Q&A with Experts',
      date: 'Every Friday',
      time: '16:00 GMT',
      host: 'Trading Team',
      description: 'Get your trading questions answered by our experts.'
    }
  ];

  const resources = [
    {
      icon: BookOpen,
      title: 'Trading Guides',
      description: 'Comprehensive guides covering all aspects of gold trading',
      count: '50+ Guides'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video lessons from beginner to advanced',
      count: '200+ Videos'
    },
    {
      icon: BarChart3,
      title: 'Market Analysis',
      description: 'Daily market reports and technical analysis',
      count: 'Daily Updates'
    },
    {
      icon: Users,
      title: 'Trading Community',
      description: 'Connect with fellow traders and share strategies',
      count: '10,000+ Members'
    }
  ];

  const tradingBasics = [
    {
      title: 'What is Gold Trading?',
      content: 'Gold trading involves buying and selling gold to profit from price movements. Traders can trade physical gold, gold futures, or gold CFDs (XAU/USD).'
    },
    {
      title: 'Why Trade Gold?',
      content: 'Gold is a safe-haven asset that often performs well during economic uncertainty. It provides portfolio diversification and inflation protection.'
    },
    {
      title: 'Gold Market Factors',
      content: 'Gold prices are influenced by inflation, interest rates, USD strength, geopolitical events, and central bank policies.'
    },
    {
      title: 'Trading Sessions',
      content: 'Gold trades 24/5 across global markets. The most active sessions are London (08:00-17:00 GMT) and New York (13:00-22:00 GMT).'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Trading Education Center</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Master the art of gold trading with our comprehensive educational resources, 
              expert-led courses, and interactive learning materials.
            </p>
            <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105">
              Start Learning Today
            </button>
          </div>
        </div>
      </section>

      {/* Trading Basics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Gold Trading Basics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential knowledge every gold trader should know
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tradingBasics.map((basic, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{basic.title}</h3>
                <p className="text-gray-600 leading-relaxed">{basic.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Structured learning paths designed by trading professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <course.icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{course.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{course.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-900">{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Level:</span>
                    <span className={`font-medium ${
                      course.level === 'Beginner' ? 'text-green-600' :
                      course.level === 'Intermediate' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Lessons:</span>
                    <span className="font-medium text-gray-900">{course.lessons}</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all">
                  Start Course
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Webinars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Live Webinars</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our expert-led live sessions and interact with professional traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {webinars.map((webinar, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-semibold text-sm">LIVE</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{webinar.title}</h3>
                <p className="text-gray-600 mb-6">{webinar.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Schedule:</span>
                    <span className="text-sm font-medium text-gray-900">{webinar.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Time:</span>
                    <span className="text-sm font-medium text-gray-900">{webinar.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Host:</span>
                    <span className="text-sm font-medium text-gray-900">{webinar.host}</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Register Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Learning Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access our comprehensive library of trading materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <resource.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="text-yellow-600 font-bold text-lg">{resource.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Glossary */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trading Glossary</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential trading terms every gold trader should know
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { term: 'Spread', definition: 'The difference between the bid and ask price' },
              { term: 'Pip', definition: 'The smallest price move in a currency pair (0.01 for XAU/USD)' },
              { term: 'Leverage', definition: 'Using borrowed capital to increase potential returns' },
              { term: 'Margin', definition: 'The deposit required to open a leveraged position' },
              { term: 'Stop Loss', definition: 'An order to close a position at a predetermined loss level' },
              { term: 'Take Profit', definition: 'An order to close a position at a predetermined profit level' },
              { term: 'Slippage', definition: 'The difference between expected and actual execution price' },
              { term: 'Volatility', definition: 'The degree of price fluctuation in the market' },
              { term: 'Support', definition: 'A price level where buying interest is strong' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.term}</h4>
                <p className="text-gray-600">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our comprehensive education program and become a successful gold trader
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105">
              Enroll Now
            </button>
            <button className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-black transition-all">
              Free Trial
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Education;
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, BarChart3, Zap, Shield, Target, Clock, DollarSign, Award } from 'lucide-react';

const Trading = () => {
  const tradingFeatures = [
    {
      icon: TrendingUp,
      title: 'Real-Time Gold Prices',
      description: 'Access live XAU/USD prices with millisecond precision updates from global markets.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Charting',
      description: 'Professional-grade charts with 50+ technical indicators and drawing tools.'
    },
    {
      icon: Zap,
      title: 'Lightning Execution',
      description: 'Ultra-fast order execution with average speeds under 50ms.'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Built-in stop-loss, take-profit, and position sizing tools.'
    }
  ];

  const tradingStrategies = [
    {
      name: 'Scalping',
      description: 'Quick trades capturing small price movements',
      timeframe: '1-5 minutes',
      riskLevel: 'High',
      profitPotential: '2-5 pips per trade'
    },
    {
      name: 'Day Trading',
      description: 'Intraday positions closed before market close',
      timeframe: '15 minutes - 4 hours',
      riskLevel: 'Medium',
      profitPotential: '10-50 pips per trade'
    },
    {
      name: 'Swing Trading',
      description: 'Multi-day positions following trends',
      timeframe: '4 hours - Daily',
      riskLevel: 'Medium',
      profitPotential: '50-200 pips per trade'
    },
    {
      name: 'Position Trading',
      description: 'Long-term positions based on fundamentals',
      timeframe: 'Weekly - Monthly',
      riskLevel: 'Low',
      profitPotential: '200+ pips per trade'
    }
  ];

  const marketHours = [
    { session: 'Sydney', time: '22:00 - 07:00 GMT', overlap: 'Tokyo' },
    { session: 'Tokyo', time: '00:00 - 09:00 GMT', overlap: 'London' },
    { session: 'London', time: '08:00 - 17:00 GMT', overlap: 'New York' },
    { session: 'New York', time: '13:00 - 22:00 GMT', overlap: 'Sydney' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Gold Trading Platform</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Trade XAU/USD with institutional-grade tools, real-time data, and advanced analytics. 
              Join thousands of traders who trust our platform for their gold trading needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105">
                Start Trading Now
              </button>
              <button className="border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-black transition-all">
                Try Demo Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Gold Price */}
      <section className="py-12 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Live Gold Price (XAU/USD)</h2>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold">$2,045.32</div>
                <div className="text-sm opacity-90">Current Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">+12.45 (+0.61%)</div>
                <div className="text-sm opacity-90">24h Change</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">$2,058.90</div>
                <div className="text-sm opacity-90">24h High</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">$2,032.15</div>
                <div className="text-sm opacity-90">24h Low</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trading Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Professional Trading Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to trade gold successfully in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Strategies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trading Strategies</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the trading style that matches your goals and risk tolerance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tradingStrategies.map((strategy, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{strategy.name}</h3>
                <p className="text-gray-600 mb-6">{strategy.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Timeframe:</span>
                    <span className="text-sm font-medium text-gray-900">{strategy.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Risk Level:</span>
                    <span className={`text-sm font-medium ${
                      strategy.riskLevel === 'High' ? 'text-red-600' :
                      strategy.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{strategy.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Profit Potential:</span>
                    <span className="text-sm font-medium text-gray-900">{strategy.profitPotential}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Hours */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Trading Sessions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gold trades 24/5 across major financial centers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketHours.map((session, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{session.session}</h3>
                <p className="text-yellow-600 font-semibold mb-2">{session.time}</p>
                <p className="text-sm text-gray-600">Overlaps with {session.overlap}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Statistics */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Platform Statistics</h2>
            <p className="text-xl text-gray-300">Trusted by traders worldwide</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">$2.5B+</div>
              <div className="text-gray-300">Monthly Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">50ms</div>
              <div className="text-gray-300">Avg Execution</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Warning */}
      <section className="py-12 bg-red-50 border-l-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-4">
            <Shield className="h-8 w-8 text-red-500 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-red-900 mb-2">Risk Warning</h3>
              <p className="text-red-800 leading-relaxed">
                Trading gold and other financial instruments involves substantial risk and may not be suitable for all investors. 
                Past performance is not indicative of future results. Please ensure you fully understand the risks involved 
                and seek independent advice if necessary. Never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Trading;
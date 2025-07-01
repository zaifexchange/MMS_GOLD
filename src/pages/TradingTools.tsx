import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Bot, TrendingUp, BarChart3, Target, Zap, Download, Star, Shield, Award, Users } from 'lucide-react';

const TradingTools = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const tradingTools = [
    // Expert Advisors
    {
      id: 1,
      name: 'Gold Scalper Pro EA',
      type: 'ea',
      price: 299.99,
      rating: 4.8,
      downloads: 1250,
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Advanced scalping EA for XAU/USD with AI-powered entry and exit signals',
      features: [
        'AI-powered signal generation',
        'Risk management system',
        'Multiple timeframe analysis',
        'Backtested on 5+ years data',
        'Works on MT4/MT5'
      ],
      winRate: '78%',
      maxDrawdown: '12%',
      avgMonthlyReturn: '15%'
    },
    {
      id: 2,
      name: 'Gold Trend Master EA',
      type: 'ea',
      price: 399.99,
      rating: 4.9,
      downloads: 890,
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Trend-following EA that captures major gold price movements',
      features: [
        'Trend identification algorithm',
        'Dynamic stop loss/take profit',
        'News filter integration',
        'Multi-currency support',
        'Real-time alerts'
      ],
      winRate: '82%',
      maxDrawdown: '8%',
      avgMonthlyReturn: '18%'
    },
    {
      id: 3,
      name: 'Gold Grid Trading EA',
      type: 'ea',
      price: 249.99,
      rating: 4.6,
      downloads: 1580,
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Grid-based trading system for ranging gold markets',
      features: [
        'Adaptive grid system',
        'Market condition detection',
        'Automatic lot sizing',
        'Profit target optimization',
        'Low-risk strategy'
      ],
      winRate: '75%',
      maxDrawdown: '15%',
      avgMonthlyReturn: '12%'
    },
    {
      id: 4,
      name: 'Gold Breakout Hunter EA',
      type: 'ea',
      price: 349.99,
      rating: 4.7,
      downloads: 720,
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'Specialized EA for trading gold breakouts and momentum',
      features: [
        'Breakout detection system',
        'Volume analysis',
        'False breakout filter',
        'Momentum indicators',
        'Session-based trading'
      ],
      winRate: '80%',
      maxDrawdown: '10%',
      avgMonthlyReturn: '16%'
    },
    {
      id: 5,
      name: 'Gold News Trader EA',
      type: 'ea',
      price: 449.99,
      rating: 4.5,
      downloads: 650,
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
      description: 'News-based trading EA that capitalizes on gold volatility',
      features: [
        'Economic calendar integration',
        'News impact analysis',
        'Volatility-based entries',
        'Quick profit taking',
        'Risk event filtering'
      ],
      winRate: '73%',
      maxDrawdown: '18%',
      avgMonthlyReturn: '20%'
    },
    // Indicators
    {
      id: 6,
      name: 'Gold Trend Indicator',
      type: 'indicator',
      price: 99.99,
      rating: 4.8,
      downloads: 2340,
      image: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg',
      description: 'Advanced trend detection indicator specifically designed for gold trading',
      features: [
        'Multi-timeframe trend analysis',
        'Trend strength measurement',
        'Entry/exit signals',
        'Customizable alerts',
        'No repainting'
      ]
    },
    {
      id: 7,
      name: 'Gold Support Resistance',
      type: 'indicator',
      price: 79.99,
      rating: 4.7,
      downloads: 1890,
      image: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg',
      description: 'Dynamic support and resistance levels for gold trading',
      features: [
        'Automatic S/R detection',
        'Historical level validation',
        'Breakout alerts',
        'Multiple timeframes',
        'Clean visual display'
      ]
    },
    {
      id: 8,
      name: 'Gold Volatility Meter',
      type: 'indicator',
      price: 89.99,
      rating: 4.6,
      downloads: 1560,
      image: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg',
      description: 'Real-time volatility measurement for optimal trade timing',
      features: [
        'Real-time volatility calculation',
        'Market session analysis',
        'Volatility-based alerts',
        'Historical comparisons',
        'Risk assessment tools'
      ]
    },
    {
      id: 9,
      name: 'Gold Momentum Oscillator',
      type: 'indicator',
      price: 69.99,
      rating: 4.5,
      downloads: 2100,
      image: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg',
      description: 'Advanced momentum indicator for gold price movements',
      features: [
        'Momentum calculation',
        'Divergence detection',
        'Overbought/oversold levels',
        'Signal filtering',
        'Multiple display modes'
      ]
    },
    {
      id: 10,
      name: 'Gold Market Scanner',
      type: 'indicator',
      price: 149.99,
      rating: 4.9,
      downloads: 980,
      image: 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg',
      description: 'Comprehensive market scanning tool for gold opportunities',
      features: [
        'Multi-timeframe scanning',
        'Pattern recognition',
        'Signal prioritization',
        'Real-time notifications',
        'Customizable filters'
      ]
    },
    // Trading Systems
    {
      id: 11,
      name: 'Complete Gold Trading System',
      type: 'system',
      price: 799.99,
      rating: 4.9,
      downloads: 450,
      image: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg',
      description: 'Complete trading system with EAs, indicators, and strategies',
      features: [
        '5 Expert Advisors',
        '10 Custom Indicators',
        'Trading manual & videos',
        'Risk management tools',
        'Lifetime updates'
      ]
    },
    {
      id: 12,
      name: 'Gold Scalping Bundle',
      type: 'system',
      price: 599.99,
      rating: 4.7,
      downloads: 320,
      image: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg',
      description: 'Professional scalping system for short-term gold trading',
      features: [
        '3 Scalping EAs',
        '5 Scalping Indicators',
        'M1-M15 strategies',
        'Video tutorials',
        '6 months support'
      ]
    },
    {
      id: 13,
      name: 'Gold Swing Trading Kit',
      type: 'system',
      price: 499.99,
      rating: 4.8,
      downloads: 280,
      image: 'https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg',
      description: 'Swing trading system for medium-term gold positions',
      features: [
        '2 Swing Trading EAs',
        '4 Trend Indicators',
        'H4-Daily strategies',
        'Position sizing calculator',
        '3 months support'
      ]
    }
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tradingTools 
    : tradingTools.filter(tool => tool.type === selectedCategory);

  const handleBuyNow = (tool) => {
    setSelectedTool(tool);
    setShowPayment(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ea': return <Bot className="h-5 w-5" />;
      case 'indicator': return <BarChart3 className="h-5 w-5" />;
      case 'system': return <Target className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'ea': return 'Expert Advisor';
      case 'indicator': return 'Indicator';
      case 'system': return 'Trading System';
      default: return 'Tool';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Trading Tools & Expert Advisors</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional trading tools, expert advisors, and indicators designed specifically 
              for gold trading. Boost your trading performance with our proven systems.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-black">
            <div>
              <div className="text-3xl font-bold">15,000+</div>
              <div className="text-sm opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm opacity-90">Trading Tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tools ({tradingTools.length})
            </button>
            <button
              onClick={() => setSelectedCategory('ea')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === 'ea'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expert Advisors ({tradingTools.filter(t => t.type === 'ea').length})
            </button>
            <button
              onClick={() => setSelectedCategory('indicator')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === 'indicator'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Indicators ({tradingTools.filter(t => t.type === 'indicator').length})
            </button>
            <button
              onClick={() => setSelectedCategory('system')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === 'system'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Trading Systems ({tradingTools.filter(t => t.type === 'system').length})
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
                <div className="relative">
                  <img 
                    src={tool.image} 
                    alt={tool.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    {getTypeIcon(tool.type)}
                    <span>{getTypeName(tool.type)}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    ${tool.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{tool.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{tool.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  {tool.winRate && (
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-green-50 p-2 rounded">
                        <div className="text-sm font-bold text-green-600">{tool.winRate}</div>
                        <div className="text-xs text-gray-600">Win Rate</div>
                      </div>
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="text-sm font-bold text-blue-600">{tool.avgMonthlyReturn}</div>
                        <div className="text-xs text-gray-600">Monthly Return</div>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <div className="text-sm font-bold text-red-600">{tool.maxDrawdown}</div>
                        <div className="text-xs text-gray-600">Max DD</div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tool.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                      {tool.features.length > 3 && (
                        <li className="text-gray-500">+{tool.features.length - 3} more features</li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleBuyNow(tool)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105"
                  >
                    Buy Now - ${tool.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Trading Tools?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade tools developed by experienced traders and programmers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Proven Results</h3>
              <p className="text-gray-600">All tools are backtested and forward-tested with real market data</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Download</h3>
              <p className="text-gray-600">Get immediate access to your tools after purchase</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Support</h3>
              <p className="text-gray-600">Get help from our team of trading experts</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Access</h3>
              <p className="text-gray-600">Join our exclusive traders community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedTool.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedTool.description}</p>
              <div className="text-2xl font-bold text-yellow-600">${selectedTool.price}</div>
            </div>

            <div className="mb-6">
              <div 
                className="DePayButton" 
                data-label="Buy Now" 
                data-integration="2f3cbb13-1065-448c-9822-9d64f93a33e5" 
                data-blockchains='["ethereum"]'
                data-amount={selectedTool.price.toFixed(2)}
              ></div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      {/* DePay Scripts */}
      <script src="https://integrate.depay.com/buttons/v13.js"></script>
      <noscript>
        <a href="https://depay.com">Web3 Payments</a> are only supported with JavaScript enabled.
      </noscript>
      <script>
        {`if (typeof DePayButtons !== 'undefined') {
          DePayButtons.init({document: document});
        }`}
      </script>
    </div>
  );
};

export default TradingTools;
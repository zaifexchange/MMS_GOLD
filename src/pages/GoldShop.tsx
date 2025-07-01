import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Coins, Package, Calculator, Truck, Shield, Award, Star, Filter } from 'lucide-react';

const GoldShop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const goldProducts = [
    // Gold Coins
    {
      id: 1,
      name: 'American Gold Eagle 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '22k (91.67%)',
      price: 2089.50,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'Official gold bullion coin of the United States',
      inStock: 25
    },
    {
      id: 2,
      name: 'Canadian Gold Maple Leaf 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2095.75,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'Premium Canadian gold coin with maple leaf design',
      inStock: 18
    },
    {
      id: 3,
      name: 'South African Krugerrand 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '22k (91.67%)',
      price: 2087.25,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'World-famous South African gold coin',
      inStock: 32
    },
    {
      id: 4,
      name: 'Austrian Gold Philharmonic 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2093.80,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'Beautiful Austrian coin featuring musical instruments',
      inStock: 22
    },
    {
      id: 5,
      name: 'Chinese Gold Panda 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.9%)',
      price: 2098.50,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'Collectible Chinese coin with annual panda design',
      inStock: 15
    },
    {
      id: 6,
      name: 'British Gold Britannia 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2094.25,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'Iconic British coin featuring Britannia',
      inStock: 28
    },
    {
      id: 7,
      name: 'American Gold Buffalo 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2096.75,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'First 24-karat gold coin from the US Mint',
      inStock: 20
    },
    {
      id: 8,
      name: 'Australian Gold Kangaroo 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2095.00,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'Australian coin with kangaroo design',
      inStock: 24
    },
    {
      id: 9,
      name: 'Mexican Gold Libertad 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.9%)',
      price: 2097.50,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'Mexican gold coin featuring Winged Victory',
      inStock: 16
    },
    {
      id: 10,
      name: 'French Gold Rooster 1 oz',
      type: 'coin',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2099.25,
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      description: 'French coin with Gallic Rooster design',
      inStock: 12
    },
    // Gold Bars
    {
      id: 11,
      name: 'PAMP Suisse Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2078.50,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Premium Swiss gold bar with assay certificate',
      inStock: 45
    },
    {
      id: 12,
      name: 'Credit Suisse Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2076.25,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Trusted Swiss bank gold bar',
      inStock: 38
    },
    {
      id: 13,
      name: 'Perth Mint Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2077.75,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Australian government-backed gold bar',
      inStock: 52
    },
    {
      id: 14,
      name: 'Valcambi Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2079.00,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Swiss-made gold bar with security features',
      inStock: 41
    },
    {
      id: 15,
      name: 'Johnson Matthey Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2075.50,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Renowned British precious metals refiner',
      inStock: 35
    },
    {
      id: 16,
      name: 'PAMP Suisse Gold Bar 10 oz',
      type: 'bar',
      weight: '10 oz',
      purity: '24k (99.99%)',
      price: 20745.00,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Large Swiss gold bar for serious investors',
      inStock: 8
    },
    {
      id: 17,
      name: 'Royal Canadian Mint Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2078.25,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Canadian government mint gold bar',
      inStock: 29
    },
    {
      id: 18,
      name: 'Sunshine Minting Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2074.75,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'American-made gold bar with security features',
      inStock: 33
    },
    {
      id: 19,
      name: 'Argor-Heraeus Gold Bar 1 oz',
      type: 'bar',
      weight: '1 oz',
      purity: '24k (99.99%)',
      price: 2077.00,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Swiss-German gold bar with kinebar technology',
      inStock: 26
    },
    {
      id: 20,
      name: 'PAMP Suisse Gold Bar 5 oz',
      type: 'bar',
      weight: '5 oz',
      purity: '24k (99.99%)',
      price: 10385.00,
      image: 'https://images.pexels.com/photos/1602726/pexels-photo-1602726.jpeg',
      description: 'Mid-size Swiss gold bar for portfolio diversification',
      inStock: 14
    }
  ];

  const countries = [
    { code: 'US', name: 'United States', tax: 0, shipping: 25 },
    { code: 'CA', name: 'Canada', tax: 5, shipping: 35 },
    { code: 'UK', name: 'United Kingdom', tax: 20, shipping: 45 },
    { code: 'DE', name: 'Germany', tax: 19, shipping: 40 },
    { code: 'FR', name: 'France', tax: 20, shipping: 40 },
    { code: 'AU', name: 'Australia', tax: 10, shipping: 55 },
    { code: 'JP', name: 'Japan', tax: 10, shipping: 60 },
    { code: 'SG', name: 'Singapore', tax: 7, shipping: 50 },
    { code: 'CH', name: 'Switzerland', tax: 7.7, shipping: 35 },
    { code: 'NL', name: 'Netherlands', tax: 21, shipping: 40 }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? goldProducts 
    : goldProducts.filter(product => product.type === selectedCategory);

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  const calculateTotal = (product) => {
    const subtotal = product.price * quantity;
    const tax = subtotal * (selectedCountryData.tax / 100);
    const shipping = selectedCountryData.shipping;
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Gold Shop</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Purchase premium gold coins and bars from trusted mints worldwide. 
              All products are authenticated and come with certificates of authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* Current Gold Price */}
      <section className="py-8 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-black">
            <h2 className="text-xl font-bold mb-2">Live Gold Spot Price</h2>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">$2,045.32/oz</div>
                <div className="text-sm opacity-90">Current Spot Price</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-700">+12.45 (+0.61%)</div>
                <div className="text-sm opacity-90">24h Change</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Calculator */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="all">All Products</option>
                      <option value="coin">Gold Coins</option>
                      <option value="bar">Gold Bars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calculator className="h-4 w-4 inline mr-1" />
                      Shipping Country
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Tax & Shipping</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Tax Rate:</span>
                        <span>{selectedCountryData.tax}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${selectedCountryData.shipping}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Products' : 
                   selectedCategory === 'coin' ? 'Gold Coins' : 'Gold Bars'} 
                  ({filteredProducts.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const pricing = calculateTotal(product);
                  
                  return (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          {product.type === 'coin' ? (
                            <Coins className="h-6 w-6 text-yellow-500" />
                          ) : (
                            <Package className="h-6 w-6 text-yellow-500" />
                          )}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                          {product.inStock} in stock
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Weight:</span>
                            <span className="font-medium">{product.weight}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Purity:</span>
                            <span className="font-medium">{product.purity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Unit Price:</span>
                            <span className="font-bold text-yellow-600">${product.price.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="border-t pt-4 mb-4">
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal ({quantity}x):</span>
                              <span>${pricing.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax ({selectedCountryData.tax}%):</span>
                              <span>${pricing.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>${pricing.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                              <span>Total:</span>
                              <span className="text-green-600">${pricing.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBuyNow(product)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Buy From Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We guarantee authenticity, secure shipping, and competitive pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Authentic Products</h3>
              <p className="text-gray-600">All products come with certificates of authenticity</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Shipping</h3>
              <p className="text-gray-600">Insured and tracked delivery worldwide</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing based on live market rates</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trusted Service</h3>
              <p className="text-gray-600">Thousands of satisfied customers worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span>${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${calculateTotal(selectedProduct).total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div 
                className="DePayButton" 
                data-label="Pay Now" 
                data-integration="2f3cbb13-1065-448c-9822-9d64f93a33e5" 
                data-blockchains='["ethereum"]'
                data-amount={calculateTotal(selectedProduct).total.toFixed(2)}
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

export default GoldShop;
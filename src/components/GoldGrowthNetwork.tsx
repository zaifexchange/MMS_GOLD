import React from 'react';
import { Users, Gift, TrendingUp } from 'lucide-react';

const GoldGrowthNetwork = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-yellow-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">GoldGrowth Network</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our exclusive referral program and earn commissions by sharing the opportunity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Earn Through Referrals</h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our GoldGrowth Network rewards you for introducing others to our platform. 
              Build your network and earn passive income through our multi-level commission structure.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">Level 1 - 10% Commission</h4>
                  <p className="text-gray-600">Direct referrals earn you 10% commission on their trading activities</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">Level 2 - 3% Commission</h4>
                  <p className="text-gray-600">Earn 3% from referrals made by your direct referrals</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">Level 3 - 2% Commission</h4>
                  <p className="text-gray-600">Third-level referrals provide additional 2% commission</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-10 w-10 text-black" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Join the Network</h4>
              <p className="text-gray-600">Start earning commissions today</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Monthly Potential</span>
                  <span className="font-bold text-green-600">$500 - $5,000+</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Commission Structure</span>
                  <span className="font-bold text-blue-600">3-Level Deep</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Payment Schedule</span>
                  <span className="font-bold text-purple-600">Weekly</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 rounded-lg mt-6 hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105">
              Get Your Referral Link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoldGrowthNetwork;
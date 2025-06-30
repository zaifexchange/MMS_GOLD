import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import TradingOverview from '../components/dashboard/TradingOverview';
import FixedDeposits from '../components/dashboard/FixedDeposits';
import ReferralNetwork from '../components/dashboard/ReferralNetwork';
import Profile from '../components/dashboard/Profile';
import Transactions from '../components/dashboard/Transactions';
import { 
  BarChart3, 
  PiggyBank, 
  Users, 
  User, 
  CreditCard,
  TrendingUp,
  DollarSign,
  Award,
  Eye
} from 'lucide-react';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'deposits', label: 'Fixed Deposits', icon: PiggyBank },
    { id: 'referrals', label: 'GoldGrowth Network', icon: Users },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const stats = [
    {
      title: 'Account Balance',
      value: `$${user?.balance?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Total Profit',
      value: '$12,450',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Active Deposits',
      value: '$15,000',
      icon: PiggyBank,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Referral Earnings',
      value: '$2,850',
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <TradingOverview />;
      case 'trading':
        return <TradingOverview />;
      case 'deposits':
        return <FixedDeposits />;
      case 'referrals':
        return <ReferralNetwork />;
      case 'transactions':
        return <Transactions />;
      case 'profile':
        return <Profile />;
      default:
        return <TradingOverview />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-8 text-black">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name}</h1>
          <p className="text-lg opacity-90">Ready to continue your gold trading journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
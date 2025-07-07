import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    userGrowth: [],
    revenueData: [],
    tradingVolume: [],
    predictionStats: []
  });
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Calculate date range
      const now = new Date();
      const daysBack = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

      // Fetch user growth data
      const { data: users } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      // Fetch revenue data
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, created_at, type')
        .gte('created_at', startDate.toISOString())
        .eq('status', 'completed');

      // Fetch trading data
      const { data: trades } = await supabase
        .from('trades')
        .select('amount, created_at, profit_loss')
        .gte('created_at', startDate.toISOString());

      // Fetch prediction data
      const { data: predictions } = await supabase
        .from('user_predictions')
        .select('amount, created_at, status')
        .gte('created_at', startDate.toISOString());

      // Process data for charts
      const userGrowthData = processTimeSeriesData(users || [], 'created_at', daysBack);
      const revenueData = processRevenueData(transactions || [], daysBack);
      const tradingVolumeData = processTradingData(trades || [], daysBack);
      const predictionStatsData = processPredictionData(predictions || [], daysBack);

      setAnalytics({
        userGrowth: userGrowthData,
        revenueData: revenueData,
        tradingVolume: tradingVolumeData,
        predictionStats: predictionStatsData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processTimeSeriesData = (data: any[], dateField: string, days: number) => {
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = data.filter(item => 
        new Date(item[dateField]).toISOString().split('T')[0] === dateStr
      ).length;
      
      result.push({
        date: dateStr,
        value: count,
        label: date.toLocaleDateString()
      });
    }
    
    return result;
  };

  const processRevenueData = (transactions: any[], days: number) => {
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayTransactions = transactions.filter(t => 
        new Date(t.created_at).toISOString().split('T')[0] === dateStr
      );
      
      const revenue = dayTransactions
        .filter(t => ['deposit', 'fixed_deposit'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        date: dateStr,
        value: revenue,
        label: date.toLocaleDateString()
      });
    }
    
    return result;
  };

  const processTradingData = (trades: any[], days: number) => {
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayTrades = trades.filter(t => 
        new Date(t.created_at).toISOString().split('T')[0] === dateStr
      );
      
      const volume = dayTrades.reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        date: dateStr,
        value: volume,
        label: date.toLocaleDateString()
      });
    }
    
    return result;
  };

  const processPredictionData = (predictions: any[], days: number) => {
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayPredictions = predictions.filter(p => 
        new Date(p.created_at).toISOString().split('T')[0] === dateStr
      );
      
      const volume = dayPredictions.reduce((sum, p) => sum + p.amount, 0);
      
      result.push({
        date: dateStr,
        value: volume,
        label: date.toLocaleDateString()
      });
    }
    
    return result;
  };

  const summaryStats = [
    {
      title: 'Total Users',
      value: analytics.userGrowth.reduce((sum, item) => sum + item.value, 0),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Total Revenue',
      value: `$${analytics.revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Trading Volume',
      value: `$${analytics.tradingVolume.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Prediction Volume',
      value: `$${analytics.predictionStats.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Loading analytics...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive platform analytics and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">User Growth</h3>
            <div className="h-64 flex items-end space-x-2">
              {analytics.userGrowth.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${Math.max((item.value / Math.max(...analytics.userGrowth.map(i => i.value))) * 200, 4)}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue</h3>
            <div className="h-64 flex items-end space-x-2">
              {analytics.revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 rounded-t"
                    style={{ height: `${Math.max((item.value / Math.max(...analytics.revenueData.map(i => i.value))) * 200, 4)}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trading Volume Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Trading Volume</h3>
            <div className="h-64 flex items-end space-x-2">
              {analytics.tradingVolume.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-yellow-500 rounded-t"
                    style={{ height: `${Math.max((item.value / Math.max(...analytics.tradingVolume.map(i => i.value))) * 200, 4)}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Volume Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Prediction Volume</h3>
            <div className="h-64 flex items-end space-x-2">
              {analytics.predictionStats.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500 rounded-t"
                    style={{ height: `${Math.max((item.value / Math.max(...analytics.predictionStats.map(i => i.value))) * 200, 4)}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    activeTrades: 0,
    pendingKYC: 0,
    totalBalance: 0,
    monthlyGrowth: 0,
    activePredictions: 0,
    totalPredictions: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total deposits
      const { data: deposits } = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'completed');

      const totalDeposits = deposits?.reduce((sum, d) => sum + d.amount, 0) || 0;

      // Fetch total balance
      const { data: profiles } = await supabase
        .from('profiles')
        .select('balance');

      const totalBalance = profiles?.reduce((sum, p) => sum + p.balance, 0) || 0;

      // Fetch active trades
      const { count: activeTrades } = await supabase
        .from('trades')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      // Fetch pending KYC
      const { count: pendingKYC } = await supabase
        .from('kyc_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch prediction stats
      const { count: activePredictions } = await supabase
        .from('prediction_questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: totalPredictions } = await supabase
        .from('user_predictions')
        .select('*', { count: 'exact', head: true });

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalUsers: totalUsers || 0,
        totalDeposits,
        activeTrades: activeTrades || 0,
        pendingKYC: pendingKYC || 0,
        totalBalance,
        monthlyGrowth: 12.5,
        activePredictions: activePredictions || 0,
        totalPredictions: totalPredictions || 0
      });

      setRecentActivity(activity || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      change: '+12%'
    },
    {
      title: 'Total Deposits',
      value: `$${stats.totalDeposits.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100',
      change: '+8.5%'
    },
    {
      title: 'Platform Balance',
      value: `$${stats.totalBalance.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      change: '+15%'
    },
    {
      title: 'Active Predictions',
      value: stats.activePredictions.toString(),
      icon: Target,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      change: `${stats.totalPredictions} total`
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Monitor your platform's performance and activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm font-medium mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-blue-600'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">{activity.profiles?.full_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${activity.amount}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/users" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left block">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Manage Users</h4>
                <p className="text-sm text-gray-600">View and edit user accounts</p>
              </a>
              
              <a href="/admin/predictions" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left block">
                <Target className="h-8 w-8 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Predictions</h4>
                <p className="text-sm text-gray-600">Manage prediction questions</p>
              </a>
              
              <a href="/admin/transactions" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left block">
                <CreditCard className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Transactions</h4>
                <p className="text-sm text-gray-600">Monitor financial activity</p>
              </a>
              
              <a href="/admin/analytics" className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left block">
                <BarChart3 className="h-8 w-8 text-yellow-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-600">View detailed reports</p>
              </a>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Platform Status</h4>
              <p className="text-green-600">All Systems Operational</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Trading Engine</h4>
              <p className="text-blue-600">Running Smoothly</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Security</h4>
              <p className="text-yellow-600">High Protection</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
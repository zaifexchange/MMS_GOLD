import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield,
  FileText,
  Settings,
  BarChart3,
  UserCheck,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { supabase, Profile, Transaction, FixedDeposit, KYCDocument } from '../lib/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    activeTrades: 0,
    pendingKYC: 0
  });
  const [recentUsers, setRecentUsers] = useState<Profile[]>([]);
  const [pendingActions, setPendingActions] = useState<any[]>([]);
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

      setStats({
        totalUsers: totalUsers || 0,
        totalDeposits,
        activeTrades: activeTrades || 0,
        pendingKYC: pendingKYC || 0
      });

      // Fetch recent users
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      setRecentUsers(users || []);

      // Fetch pending actions
      const { data: kycDocs } = await supabase
        .from('kyc_documents')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('status', 'pending')
        .limit(4);

      const { data: withdrawals } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('type', 'withdrawal')
        .eq('status', 'pending')
        .limit(4);

      const actions = [
        ...(kycDocs?.map(doc => ({
          type: 'KYC Verification',
          user: doc.profiles?.full_name,
          amount: null,
          time: new Date(doc.uploaded_at).toLocaleString()
        })) || []),
        ...(withdrawals?.map(tx => ({
          type: 'Withdrawal Request',
          user: tx.profiles?.full_name,
          amount: `$${tx.amount}`,
          time: new Date(tx.created_at).toLocaleString()
        })) || [])
      ];

      setPendingActions(actions);
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
      title: 'Active Trades',
      value: stats.activeTrades.toString(),
      icon: TrendingUp,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      change: '+15%'
    },
    {
      title: 'Pending KYC',
      value: stats.pendingKYC.toString(),
      icon: Shield,
      color: 'text-red-600',
      bg: 'bg-red-100',
      change: '-5%'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-lg opacity-90">Manage your MMS Gold platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm font-medium mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
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
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
              <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                View All Users
              </button>
            </div>

            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${user.balance.toFixed(2)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.kyc_status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.kyc_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Pending Actions</h3>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingActions.length} pending
              </span>
            </div>

            <div className="space-y-4">
              {pendingActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-900">{action.type}</p>
                      <p className="text-sm text-gray-600">{action.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {action.amount && (
                      <p className="font-medium text-gray-900">{action.amount}</p>
                    )}
                    <p className="text-sm text-gray-500">{action.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Verify KYC</h4>
            <p className="text-gray-600 text-sm">Review pending KYC documents</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Manage Payments</h4>
            <p className="text-gray-600 text-sm">Process deposits and withdrawals</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">View Reports</h4>
            <p className="text-gray-600 text-sm">Generate financial reports</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow cursor-pointer">
            <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">System Settings</h4>
            <p className="text-gray-600 text-sm">Configure platform settings</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
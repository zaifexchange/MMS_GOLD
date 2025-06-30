import React, { useState, useEffect } from 'react';
import { Users, Copy, Gift, TrendingUp, Share2, Award } from 'lucide-react';
import { supabase, Referral, Profile } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const ReferralNetwork = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<(Referral & { referred_profile: Profile })[]>([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    thisMonth: 0,
    pendingPayout: 0
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const referralLink = `${window.location.origin}/register?ref=${user?.referral_code}`;

  useEffect(() => {
    if (user) {
      fetchReferrals();
      fetchStats();
    }
  }, [user]);

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_profile:profiles!referrals_referred_id_fkey(*)
        `)
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total referrals count
      const { count: totalReferrals } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user?.id);

      // Get total earnings from referral commissions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('user_id', user?.id)
        .eq('type', 'referral_commission');

      const totalEarnings = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0;
      
      // Calculate this month's earnings
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthEarnings = transactions?.filter(t => 
        new Date(t.created_at) >= thisMonth
      ).reduce((sum, t) => sum + t.amount, 0) || 0;

      setStats({
        totalReferrals: totalReferrals || 0,
        totalEarnings,
        thisMonth: thisMonthEarnings,
        pendingPayout: 0 // This would be calculated based on pending transactions
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStatsCards = [
    {
      title: 'Total Referrals',
      value: stats.totalReferrals.toString(),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'This Month',
      value: `$${stats.thisMonth.toFixed(2)}`,
      icon: Award,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Pending Payout',
      value: `$${stats.pendingPayout.toFixed(2)}`,
      icon: Gift,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  const commissionStructure = [
    { level: 1, percentage: '10%', description: 'Direct referrals', color: 'bg-green-500' },
    { level: 2, percentage: '3%', description: 'Second level referrals', color: 'bg-blue-500' },
    { level: 3, percentage: '2%', description: 'Third level referrals', color: 'bg-purple-500' }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">GoldGrowth Network</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Earn commissions by referring others to our platform. Build your network and create passive income.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {referralStatsCards.map((stat, index) => (
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

      {/* Referral Link */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-8 text-black">
        <h3 className="text-2xl font-bold mb-4">Your Referral Link</h3>
        <div className="flex items-center space-x-4 bg-white rounded-lg p-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-transparent text-gray-900 font-medium outline-none"
          />
          <button
            onClick={copyReferralLink}
            className="bg-black text-yellow-500 px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center space-x-2"
          >
            <Copy className="h-4 w-4" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-sm opacity-90 mt-4">
          Share this link with friends and earn commissions on their trading activities
        </p>
      </div>

      {/* Commission Structure */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Commission Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {commissionStructure.map((level) => (
            <div key={level.level} className="text-center">
              <div className={`w-20 h-20 ${level.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-white font-bold text-2xl">{level.level}</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Level {level.level}</h4>
              <div className="text-3xl font-bold text-gray-900 mb-2">{level.percentage}</div>
              <p className="text-gray-600">{level.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Your Referrals</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Level</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Earned</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => (
                <tr key={referral.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {referral.referred_profile.full_name}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {referral.referred_profile.email}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      referral.level === 1 
                        ? 'bg-green-100 text-green-800' 
                        : referral.level === 2
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      Level {referral.level}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{referral.commission_rate}%</td>
                  <td className="py-4 px-4 font-semibold text-green-600">
                    ${referral.total_commission.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {referrals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No referrals yet. Start sharing your link to build your network!</p>
          </div>
        )}
      </div>

      {/* Share Options */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Share Your Link</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join me on MMS Gold for gold trading!&url=${encodeURIComponent(referralLink)}`)}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Twitter</span>
          </button>
          <button 
            onClick={copyReferralLink}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Copy Link</span>
          </button>
          <button 
            onClick={() => window.open(`mailto:?subject=Join MMS Gold&body=Join me on MMS Gold for gold trading! ${referralLink}`)}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Gift className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Email</span>
          </button>
          <button 
            onClick={() => window.open(`https://wa.me/?text=Join me on MMS Gold for gold trading! ${encodeURIComponent(referralLink)}`)}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-8 w-8 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralNetwork;
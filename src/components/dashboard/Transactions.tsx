import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Filter, Download, Search, Calendar } from 'lucide-react';
import { supabase, Transaction } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType, searchTerm, dateRange]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case '7days':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        filterDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    filtered = filtered.filter(t => new Date(t.created_at) >= filterDate);

    setFilteredTransactions(filtered);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'fixed_deposit_return':
      case 'referral_commission':
      case 'trade_profit':
        return <ArrowDownLeft className="h-5 w-5 text-green-600" />;
      case 'withdrawal':
      case 'fixed_deposit':
      case 'trade_loss':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      default:
        return <ArrowUpRight className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAmountColor = (amount: number, type: string) => {
    const isIncoming = ['deposit', 'fixed_deposit_return', 'referral_commission', 'trade_profit'].includes(type);
    return isIncoming ? 'text-green-600' : 'text-red-600';
  };

  const formatAmount = (amount: number, type: string) => {
    const isIncoming = ['deposit', 'fixed_deposit_return', 'referral_commission', 'trade_profit'].includes(type);
    const prefix = isIncoming ? '+' : '-';
    return `${prefix}$${Math.abs(amount).toFixed(2)}`;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'deposit': 'Deposit',
      'withdrawal': 'Withdrawal',
      'trade_profit': 'Trade Profit',
      'trade_loss': 'Trade Loss',
      'referral_commission': 'Referral',
      'fixed_deposit': 'Fixed Deposit',
      'fixed_deposit_return': 'FD Return'
    };
    return labels[type] || type;
  };

  const totalBalance = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => {
      const isIncoming = ['deposit', 'fixed_deposit_return', 'referral_commission', 'trade_profit'].includes(t.type);
      return sum + (isIncoming ? t.amount : -t.amount);
    }, 0);

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-gray-600 mt-1">Track all your financial activities</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button className="flex items-center space-x-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Current Balance</h3>
          <p className="text-2xl font-bold text-gray-900">${user?.balance?.toFixed(2)}</p>
          <p className="text-sm text-green-600 mt-1">Available balance</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Deposits</h3>
          <p className="text-2xl font-bold text-gray-900">${totalDeposits.toFixed(2)}</p>
          <p className="text-sm text-blue-600 mt-1">All time</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Withdrawals</h3>
          <p className="text-2xl font-bold text-gray-900">${totalWithdrawals.toFixed(2)}</p>
          <p className="text-sm text-red-600 mt-1">All time</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="trade_profit">Trade Profits</option>
              <option value="trade_loss">Trade Losses</option>
              <option value="referral_commission">Referrals</option>
              <option value="fixed_deposit">Fixed Deposits</option>
              <option value="fixed_deposit_return">FD Returns</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Transaction</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Date & Time</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Reference</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {getTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-bold ${getAmountColor(transaction.amount, transaction.type)}`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600 font-mono">
                      {transaction.reference_id || 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  reference_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, filterType, filterStatus]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(full_name, email)
        `)
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

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  };

  const updateTransactionStatus = async (transactionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', transactionId);

      if (error) throw error;
      
      fetchTransactions();
      alert('Transaction status updated successfully!');
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all platform transactions</p>
          </div>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
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
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Description</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.profiles?.full_name}</p>
                        <p className="text-sm text-gray-600">{transaction.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {getTypeLabel(transaction.type)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.reference_id}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleTimeString()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {transaction.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateTransactionStatus(transaction.id, 'completed')}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateTransactionStatus(transaction.id, 'failed')}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
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
      </div>
    </AdminLayout>
  );
};

export default TransactionManagement;
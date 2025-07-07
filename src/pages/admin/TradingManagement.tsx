import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Trade {
  id: string;
  user_id: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at: string | null;
  profiles: {
    full_name: string;
    email: string;
  };
}

const TradingManagement = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [exitPrice, setExitPrice] = useState('');

  useEffect(() => {
    fetchTrades();
  }, []);

  useEffect(() => {
    filterTrades();
  }, [trades, searchTerm, filterType, filterStatus]);

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('opened_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrades = () => {
    let filtered = trades;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.pair.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    setFilteredTrades(filtered);
  };

  const closeTrade = async () => {
    if (!selectedTrade || !exitPrice) {
      alert('Please enter exit price');
      return;
    }

    try {
      const exit = parseFloat(exitPrice);
      const profitLoss = selectedTrade.type === 'buy' 
        ? (exit - selectedTrade.entry_price) * (selectedTrade.amount / selectedTrade.entry_price)
        : (selectedTrade.entry_price - exit) * (selectedTrade.amount / selectedTrade.entry_price);

      // Update trade
      const { error: tradeError } = await supabase
        .from('trades')
        .update({
          exit_price: exit,
          profit_loss: profitLoss,
          status: 'closed',
          closed_at: new Date().toISOString(),
        })
        .eq('id', selectedTrade.id);

      if (tradeError) throw tradeError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: selectedTrade.user_id,
          type: profitLoss >= 0 ? 'trade_profit' : 'trade_loss',
          amount: Math.abs(profitLoss),
          description: `Trade closed by admin - ${selectedTrade.pair} ${profitLoss >= 0 ? 'Profit' : 'Loss'}`,
          status: 'completed',
          reference_id: `ADMIN-TRD-${selectedTrade.id}`,
        });

      if (transactionError) throw transactionError;

      // Update user balance
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', selectedTrade.user_id)
        .single();

      if (userProfile) {
        const newBalance = userProfile.balance + selectedTrade.amount + profitLoss;
        await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('id', selectedTrade.user_id);
      }

      alert('Trade closed successfully!');
      setShowCloseModal(false);
      setSelectedTrade(null);
      setExitPrice('');
      fetchTrades();
    } catch (error) {
      console.error('Error closing trade:', error);
      alert('Failed to close trade');
    }
  };

  const getTradeIcon = (type: string) => {
    return type === 'buy' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'open' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getProfitLossColor = (profitLoss: number) => {
    if (profitLoss > 0) return 'text-green-600';
    if (profitLoss < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const stats = {
    totalTrades: trades.length,
    openTrades: trades.filter(t => t.status === 'open').length,
    totalVolume: trades.reduce((sum, t) => sum + t.amount, 0),
    totalProfitLoss: trades.filter(t => t.status === 'closed').reduce((sum, t) => sum + t.profit_loss, 0)
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
            <h1 className="text-3xl font-bold text-gray-900">Trading Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all trading activities</p>
          </div>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrades}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Open Trades</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openTrades}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalVolume.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total P&L</p>
                <p className={`text-2xl font-bold ${getProfitLossColor(stats.totalProfitLoss)}`}>
                  ${stats.totalProfitLoss.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
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
                  placeholder="Search trades..."
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
                <option value="buy">Buy Orders</option>
                <option value="sell">Sell Orders</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredTrades.length} of {trades.length} trades
            </div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Trader</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Pair</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Entry Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Exit Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">P&L</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{trade.profiles?.full_name}</p>
                        <p className="text-sm text-gray-600">{trade.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{trade.pair}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getTradeIcon(trade.type)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          trade.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">${trade.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">${trade.entry_price?.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">
                        {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-medium ${getProfitLossColor(trade.profit_loss)}`}>
                        {trade.status === 'open' ? 'Active' : `$${trade.profit_loss.toFixed(2)}`}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trade.status)}`}>
                        {trade.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {trade.status === 'open' && (
                          <button
                            onClick={() => {
                              setSelectedTrade(trade);
                              setShowCloseModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTrades.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No trades found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Close Trade Modal */}
        {showCloseModal && selectedTrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Close Trade</h3>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Trade Details</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Trader:</strong> {selectedTrade.profiles?.full_name}</p>
                  <p><strong>Pair:</strong> {selectedTrade.pair}</p>
                  <p><strong>Type:</strong> {selectedTrade.type.toUpperCase()}</p>
                  <p><strong>Amount:</strong> ${selectedTrade.amount.toFixed(2)}</p>
                  <p><strong>Entry Price:</strong> ${selectedTrade.entry_price?.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exit Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter exit price"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={closeTrade}
                  className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close Trade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TradingManagement;
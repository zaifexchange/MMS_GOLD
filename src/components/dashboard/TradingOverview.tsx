import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { supabase, Trade, Transaction } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TradingViewWidget from '../TradingViewWidget';

const TradingOverview = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrades();
    }
  }, [user]);

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTrade = async (type: 'buy' | 'sell', amount: number) => {
    if (!user) return;

    try {
      const goldPrice = 2045.32; // This would come from a real API
      
      const { error: tradeError } = await supabase
        .from('trades')
        .insert({
          user_id: user.id,
          pair: 'XAU/USD',
          type,
          amount,
          entry_price: goldPrice,
          status: 'open',
        });

      if (tradeError) throw tradeError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: -amount,
          description: `${type.toUpperCase()} trade opened - XAU/USD`,
          status: 'completed',
          reference_id: `TRD-${Date.now()}`,
        });

      if (transactionError) throw transactionError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: user.balance - amount })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      alert('Trade opened successfully!');
      fetchTrades();
    } catch (error) {
      console.error('Error creating trade:', error);
      alert('Failed to open trade');
    }
  };

  const closeTrade = async (tradeId: string, exitPrice: number) => {
    if (!user) return;

    try {
      const trade = trades.find(t => t.id === tradeId);
      if (!trade) return;

      const profitLoss = trade.type === 'buy' 
        ? (exitPrice - (trade.entry_price || 0)) * (trade.amount / (trade.entry_price || 1))
        : ((trade.entry_price || 0) - exitPrice) * (trade.amount / (trade.entry_price || 1));

      // Update trade
      const { error: tradeError } = await supabase
        .from('trades')
        .update({
          exit_price: exitPrice,
          profit_loss: profitLoss,
          status: 'closed',
          closed_at: new Date().toISOString(),
        })
        .eq('id', tradeId);

      if (tradeError) throw tradeError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: profitLoss >= 0 ? 'trade_profit' : 'trade_loss',
          amount: Math.abs(profitLoss),
          description: `Trade closed - XAU/USD ${profitLoss >= 0 ? 'Profit' : 'Loss'}`,
          status: 'completed',
          reference_id: `TRD-${tradeId}`,
        });

      if (transactionError) throw transactionError;

      // Update user balance
      const newBalance = user.balance + trade.amount + profitLoss;
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      alert('Trade closed successfully!');
      fetchTrades();
    } catch (error) {
      console.error('Error closing trade:', error);
      alert('Failed to close trade');
    }
  };

  const goldPrice = 2045.32;
  const priceChange = 12.45;
  const percentChange = 0.61;

  const totalProfit = trades
    .filter(t => t.status === 'closed')
    .reduce((sum, t) => sum + t.profit_loss, 0);

  const activeTrades = trades.filter(t => t.status === 'open').length;
  const winRate = trades.filter(t => t.status === 'closed').length > 0
    ? (trades.filter(t => t.status === 'closed' && t.profit_loss > 0).length / trades.filter(t => t.status === 'closed').length) * 100
    : 0;

  const tradingStats = [
    { label: 'Total Trades', value: trades.length.toString(), change: `${activeTrades} active` },
    { label: 'Win Rate', value: `${winRate.toFixed(1)}%`, change: 'All time' },
    { label: 'Total Profit', value: `$${totalProfit.toFixed(2)}`, change: 'All time' },
    { label: 'Active Trades', value: activeTrades.toString(), change: 'Currently open' }
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Current Gold Price */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-black">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold opacity-90">XAU/USD Current Price</h3>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-bold">${goldPrice}</span>
              <div className="flex items-center space-x-1">
                {priceChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-700" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-700" />
                )}
                <span className={`font-semibold ${priceChange > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  +{priceChange} (+{percentChange}%)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <button 
              onClick={() => {
                const amount = prompt('Enter trade amount:');
                if (amount) createTrade('buy', parseFloat(amount));
              }}
              className="bg-black text-yellow-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors mr-2"
            >
              Buy Gold
            </button>
            <button 
              onClick={() => {
                const amount = prompt('Enter trade amount:');
                if (amount) createTrade('sell', parseFloat(amount));
              }}
              className="bg-black text-yellow-500 px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
            >
              Sell Gold
            </button>
          </div>
        </div>
      </div>

      {/* Trading Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tradingStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* TradingView Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Live Gold Price Chart</h3>
        <div className="h-96 w-full">
          <TradingViewWidget />
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Trades</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pair</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Entry Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Profit/Loss</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{trade.pair}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trade.type === 'buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">${trade.amount}</td>
                  <td className="py-4 px-4 text-gray-700">${trade.entry_price?.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`font-medium ${
                      trade.profit_loss > 0 
                        ? 'text-green-600' 
                        : trade.profit_loss < 0 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}>
                      {trade.status === 'open' ? 'Active' : `$${trade.profit_loss.toFixed(2)}`}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      trade.status === 'open' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {trade.status === 'open' && (
                      <button
                        onClick={() => {
                          const exitPrice = prompt('Enter exit price:');
                          if (exitPrice) closeTrade(trade.id, parseFloat(exitPrice));
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {trades.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No trades yet. Start trading to see your history here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingOverview;
import React, { useState, useEffect } from 'react';
import { PiggyBank, TrendingUp, Calendar, DollarSign, Plus } from 'lucide-react';
import { supabase, FixedDeposit } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const FixedDeposits = () => {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState<FixedDeposit[]>([]);
  const [showNewDeposit, setShowNewDeposit] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(true);

  const depositPlans = [
    {
      id: '3_month',
      duration: '3 Months',
      rate: '6%',
      minAmount: 1000,
      description: 'Short-term investment with guaranteed returns'
    },
    {
      id: '6_month',
      duration: '6 Months',
      rate: '8%',
      minAmount: 2500,
      description: 'Medium-term investment with higher returns'
    },
    {
      id: '1_year',
      duration: '1 Year',
      rate: '10%',
      minAmount: 5000,
      description: 'Long-term investment with maximum returns'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchDeposits();
    }
  }, [user]);

  const fetchDeposits = async () => {
    try {
      const { data, error } = await supabase
        .from('fixed_deposits')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeposits(data || []);
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeposit = async () => {
    if (!selectedPlan || !depositAmount || !user) {
      alert('Please select a plan and enter deposit amount');
      return;
    }
    
    const plan = depositPlans.find(p => p.id === selectedPlan);
    const amount = parseFloat(depositAmount);
    
    if (amount < plan!.minAmount) {
      alert(`Minimum deposit amount for this plan is $${plan!.minAmount}`);
      return;
    }

    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      // Calculate maturity date
      const startDate = new Date();
      const maturityDate = new Date(startDate);
      
      switch (selectedPlan) {
        case '3_month':
          maturityDate.setMonth(maturityDate.getMonth() + 3);
          break;
        case '6_month':
          maturityDate.setMonth(maturityDate.getMonth() + 6);
          break;
        case '1_year':
          maturityDate.setFullYear(maturityDate.getFullYear() + 1);
          break;
      }

      // Create fixed deposit
      const { error: depositError } = await supabase
        .from('fixed_deposits')
        .insert({
          user_id: user.id,
          amount,
          plan: selectedPlan as any,
          interest_rate: parseFloat(plan!.rate.replace('%', '')),
          maturity_date: maturityDate.toISOString(),
        });

      if (depositError) throw depositError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'fixed_deposit',
          amount: -amount,
          description: `Fixed deposit created - ${plan!.duration}`,
          status: 'completed',
          reference_id: `FD-${Date.now()}`,
        });

      if (transactionError) throw transactionError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: user.balance - amount })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      alert('Fixed deposit created successfully!');
      setShowNewDeposit(false);
      setSelectedPlan('');
      setDepositAmount('');
      fetchDeposits();
    } catch (error) {
      console.error('Error creating deposit:', error);
      alert('Failed to create fixed deposit');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDaysLeft = (maturityDate: string) => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = maturity.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fixed Deposits</h2>
          <p className="text-gray-600 mt-1">Secure your investment with guaranteed returns</p>
        </div>
        <button
          onClick={() => setShowNewDeposit(true)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Deposit</span>
        </button>
      </div>

      {/* Deposit Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {depositPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-yellow-500 transition-all">
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.duration}</h3>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{plan.rate}</div>
              <p className="text-sm text-gray-600 mb-4">Monthly Returns</p>
              <p className="text-gray-700 mb-4">{plan.description}</p>
              <p className="text-sm text-gray-600 mb-6">
                Minimum: <span className="font-semibold">${plan.minAmount.toLocaleString()}</span>
              </p>
              <button
                onClick={() => {
                  setSelectedPlan(plan.id);
                  setShowNewDeposit(true);
                }}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
              >
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Deposits */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Fixed Deposits</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Start Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Maturity Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Earned</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Days Left</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">${deposit.amount}</td>
                  <td className="py-4 px-4 text-gray-700">
                    {depositPlans.find(p => p.id === deposit.plan)?.duration}
                  </td>
                  <td className="py-4 px-4 text-yellow-600 font-semibold">{deposit.interest_rate}%</td>
                  <td className="py-4 px-4 text-gray-700">{formatDate(deposit.start_date)}</td>
                  <td className="py-4 px-4 text-gray-700">{formatDate(deposit.maturity_date)}</td>
                  <td className="py-4 px-4 text-green-600 font-semibold">${deposit.total_earned}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      deposit.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : deposit.status === 'matured'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {deposit.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {deposit.status === 'active' 
                      ? `${getDaysLeft(deposit.maturity_date)} days` 
                      : 'Completed'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {deposits.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No fixed deposits yet. Create your first deposit to start earning!</p>
          </div>
        )}
      </div>

      {/* New Deposit Modal */}
      {showNewDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Fixed Deposit</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Plan
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Choose a plan</option>
                  {depositPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.duration} - {plan.rate} (Min: ${plan.minAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Amount
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Available balance: ${user?.balance?.toLocaleString()}
                </p>
              </div>

              {selectedPlan && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Plan Details:</h4>
                  {(() => {
                    const plan = depositPlans.find(p => p.id === selectedPlan);
                    return plan ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>Duration: {plan.duration}</p>
                        <p>Monthly Return: {plan.rate}</p>
                        <p>Minimum Amount: ${plan.minAmount}</p>
                        {depositAmount && parseFloat(depositAmount) >= plan.minAmount && (
                          <p className="text-green-600 font-semibold">
                            Expected Monthly Return: ${(parseFloat(depositAmount) * parseFloat(plan.rate.replace('%', '')) / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowNewDeposit(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDeposit}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
                >
                  Create Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedDeposits;
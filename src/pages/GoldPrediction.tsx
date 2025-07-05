import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, TrendingDown, Clock, DollarSign, Target, Award, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PredictionQuestion {
  id: string;
  question: string;
  description: string;
  deadline: string;
  multiplier: number;
  status: 'active' | 'closed' | 'resolved';
  correct_answer?: boolean;
  created_at: string;
}

interface UserPrediction {
  id: string;
  question_id: string;
  user_id: string;
  prediction: boolean;
  amount: number;
  potential_payout: number;
  status: 'pending' | 'won' | 'lost';
  created_at: string;
}

const GoldPrediction = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<PredictionQuestion[]>([]);
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<PredictionQuestion | null>(null);
  const [predictionAmount, setPredictionAmount] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    correctPredictions: 0,
    totalEarnings: 0,
    winRate: 0
  });

  useEffect(() => {
    fetchQuestions();
    if (user) {
      fetchUserPredictions();
      fetchUserStats();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('prediction_questions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback to default questions if table doesn't exist
      setQuestions(getDefaultQuestions());
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPredictions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPredictions(data || []);
    } catch (error) {
      console.error('Error fetching user predictions:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const predictions = data || [];
      const totalPredictions = predictions.length;
      const correctPredictions = predictions.filter(p => p.status === 'won').length;
      const totalEarnings = predictions
        .filter(p => p.status === 'won')
        .reduce((sum, p) => sum + (p.potential_payout - p.amount), 0);
      const winRate = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;

      setStats({
        totalPredictions,
        correctPredictions,
        totalEarnings,
        winRate
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getDefaultQuestions = (): PredictionQuestion[] => [
    {
      id: '1',
      question: 'Will the price of gold exceed $3,400 per ounce at 7 PM tomorrow during the NFP report release?',
      description: 'Non-Farm Payroll (NFP) reports often cause significant volatility in gold prices.',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      question: 'Will the price of gold drop by 5% or more within the next month?',
      description: 'Major corrections in gold prices can present significant opportunities.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      question: 'Will the price of gold fall below $3,300 per ounce during the next FOMC report?',
      description: 'Federal Open Market Committee decisions heavily influence precious metals.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      question: 'Will the market closing price of gold tomorrow be above $3,500 per ounce?',
      description: 'Daily closing prices are crucial for technical analysis and trend determination.',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      question: 'Will gold prices rise by more than 3% within the next week following the US CPI data release?',
      description: 'Consumer Price Index data is a key inflation indicator affecting gold prices.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      question: 'Will the price of gold stay above $3,200 per ounce during the next ECB interest rate announcement?',
      description: 'European Central Bank decisions impact global precious metals markets.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '7',
      question: 'Will gold prices surpass $3,600 per ounce before the next US Federal Reserve meeting?',
      description: 'Federal Reserve meetings are major market-moving events for precious metals.',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '8',
      question: 'Will the price of gold decline by more than 2% on the day of the next US unemployment report?',
      description: 'Employment data releases often trigger immediate market reactions.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '9',
      question: 'Will gold prices be higher than $3,450 per ounce at the close of the next trading week?',
      description: 'Weekly closing levels are important for medium-term trend analysis.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '10',
      question: 'Will the price of gold drop below $3,150 per ounce during the next OPEC meeting?',
      description: 'Oil market decisions can indirectly affect precious metals through currency impacts.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '11',
      question: 'Will gold prices increase by more than 4% within the next two weeks after the US GDP report?',
      description: 'Gross Domestic Product data reflects economic health and affects safe-haven demand.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '12',
      question: 'Will the price of gold remain below $3,700 per ounce at the next market close following a US retail sales report?',
      description: 'Retail sales data indicates consumer spending patterns and economic strength.',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '13',
      question: 'Will gold prices exceed $3,500 per ounce during the next Bank of Japan interest rate decision?',
      description: 'Japanese monetary policy affects global currency markets and precious metals.',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '14',
      question: 'Will the price of gold fall by more than 3% within the next 10 days after a US PPI report release?',
      description: 'Producer Price Index data provides early inflation signals affecting precious metals.',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: '15',
      question: 'Will gold prices be above $3,300 per ounce at the close of the next trading day after a US housing starts report?',
      description: 'Housing market data reflects economic activity and investment demand patterns.',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      multiplier: 1.9,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ];

  const handleMakePrediction = (question: PredictionQuestion) => {
    if (!user) {
      alert('Please login to make predictions');
      return;
    }
    setSelectedQuestion(question);
    setShowPredictionModal(true);
  };

  const submitPrediction = async () => {
    if (!selectedQuestion || selectedAnswer === null || !predictionAmount || !user) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(predictionAmount);
    if (amount < 10) {
      alert('Minimum prediction amount is $10');
      return;
    }

    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      const potentialPayout = amount * selectedQuestion.multiplier;

      // Create prediction record
      const { error: predictionError } = await supabase
        .from('user_predictions')
        .insert({
          question_id: selectedQuestion.id,
          user_id: user.id,
          prediction: selectedAnswer,
          amount,
          potential_payout: potentialPayout,
          status: 'pending'
        });

      if (predictionError) throw predictionError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: -amount,
          description: `Gold prediction: ${selectedQuestion.question.substring(0, 50)}...`,
          status: 'completed',
          reference_id: `PRED-${Date.now()}`
        });

      if (transactionError) throw transactionError;

      // Update user balance
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: user.balance - amount })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      alert('Prediction submitted successfully!');
      setShowPredictionModal(false);
      setPredictionAmount('');
      setSelectedAnswer(null);
      fetchUserPredictions();
      fetchUserStats();
    } catch (error) {
      console.error('Error submitting prediction:', error);
      alert('Failed to submit prediction');
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const timeLeft = deadlineTime - now;

    if (timeLeft <= 0) return 'Expired';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getUserPredictionForQuestion = (questionId: string) => {
    return userPredictions.find(p => p.question_id === questionId);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-64">Loading...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Gold Price Predictions</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Test your market knowledge and earn rewards by predicting gold price movements. 
              Make informed predictions and multiply your earnings with 1.9x payouts.
            </p>
          </div>
        </div>
      </section>

      {/* Current Gold Price */}
      <section className="py-8 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-black">
            <h2 className="text-xl font-bold mb-2">Live Gold Price (XAU/USD)</h2>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">$3,245.32</div>
                <div className="text-sm opacity-90">Current Price</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-700">+45.25 (+1.42%)</div>
                <div className="text-sm opacity-90">24h Change</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Stats */}
      {user && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalPredictions}</div>
                <div className="text-sm opacity-90">Total Predictions</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.correctPredictions}</div>
                <div className="text-sm opacity-90">Correct Predictions</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl text-center">
                <Award className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
                <div className="text-sm opacity-90">Win Rate</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-6 rounded-xl text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
                <div className="text-sm opacity-90">Total Earnings</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Prediction Questions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Active Predictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our expert-curated prediction questions and earn 1.9x your stake for correct predictions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {questions.map((question) => {
              const userPrediction = getUserPredictionForQuestion(question.id);
              const timeRemaining = getTimeRemaining(question.deadline);
              const isExpired = timeRemaining === 'Expired';
              
              return (
                <div key={question.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{question.question}</h3>
                      <p className="text-gray-600 text-sm mb-4">{question.description}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        {question.multiplier}x Payout
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{timeRemaining}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Deadline: {new Date(question.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  {userPrediction ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-blue-900">Your Prediction</p>
                          <p className="text-blue-700">
                            {userPrediction.prediction ? 'YES' : 'NO'} - ${userPrediction.amount}
                          </p>
                          <p className="text-sm text-blue-600">
                            Potential payout: ${userPrediction.potential_payout.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userPrediction.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : userPrediction.status === 'won'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {userPrediction.status.charAt(0).toUpperCase() + userPrediction.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleMakePrediction(question)}
                        disabled={isExpired}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <TrendingUp className="h-5 w-5" />
                        <span>Predict YES</span>
                      </button>
                      <button
                        onClick={() => handleMakePrediction(question)}
                        disabled={isExpired}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <TrendingDown className="h-5 w-5" />
                        <span>Predict NO</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to start earning with gold price predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Question</h3>
              <p className="text-gray-600">Select from our expert-curated prediction questions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Make Prediction</h3>
              <p className="text-gray-600">Choose YES or NO and set your stake amount</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wait for Result</h3>
              <p className="text-gray-600">Monitor the market until the deadline</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-2xl">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Earn Rewards</h3>
              <p className="text-gray-600">Get 1.9x payout for correct predictions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Modal */}
      {showPredictionModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Make Your Prediction</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{selectedQuestion.question}</h4>
              <p className="text-sm text-gray-600 mb-4">{selectedQuestion.description}</p>
              <div className="text-sm text-gray-500">
                Deadline: {new Date(selectedQuestion.deadline).toLocaleString()}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Prediction
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedAnswer(true)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === true
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                >
                  <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-bold">YES</span>
                </button>
                <button
                  onClick={() => setSelectedAnswer(false)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === false
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  <TrendingDown className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-bold">NO</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stake Amount (USD)
              </label>
              <input
                type="number"
                min="10"
                step="0.01"
                value={predictionAmount}
                onChange={(e) => setPredictionAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter amount (min $10)"
              />
              <p className="text-sm text-gray-600 mt-1">
                Available balance: ${user?.balance?.toFixed(2)}
              </p>
            </div>

            {predictionAmount && parseFloat(predictionAmount) >= 10 && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Prediction Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Your stake:</span>
                    <span>${parseFloat(predictionAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential payout:</span>
                    <span className="font-bold text-green-600">
                      ${(parseFloat(predictionAmount) * selectedQuestion.multiplier).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential profit:</span>
                    <span className="font-bold text-green-600">
                      ${((parseFloat(predictionAmount) * selectedQuestion.multiplier) - parseFloat(predictionAmount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => setShowPredictionModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPrediction}
                disabled={selectedAnswer === null || !predictionAmount || parseFloat(predictionAmount) < 10}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50"
              >
                Submit Prediction
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GoldPrediction;
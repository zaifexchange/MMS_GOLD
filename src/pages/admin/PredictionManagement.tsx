import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Save, Clock, Target, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
  profiles: {
    full_name: string;
    email: string;
  };
}

const PredictionManagement = () => {
  const [questions, setQuestions] = useState<PredictionQuestion[]>([]);
  const [predictions, setPredictions] = useState<UserPrediction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PredictionQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    deadline: '',
    multiplier: 1.9,
    status: 'active' as 'active' | 'closed' | 'resolved'
  });

  useEffect(() => {
    fetchQuestions();
    fetchPredictions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('prediction_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        // If table doesn't exist, create default questions
        await createDefaultQuestions();
      } else {
        setQuestions(data || []);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      await createDefaultQuestions();
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_predictions')
        .select(`
          *,
          profiles(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching predictions:', error);
      } else {
        setPredictions(data || []);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const createDefaultQuestions = async () => {
    const defaultQuestions = [
      {
        question: 'Will the price of gold exceed $2,100 per ounce by the end of this week?',
        description: 'Gold has been showing strong momentum. Technical indicators suggest a potential breakout above key resistance levels.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        multiplier: 1.9,
        status: 'active'
      },
      {
        question: 'Will gold prices drop below $2,000 per ounce within the next month?',
        description: 'Economic indicators and Fed policy decisions could impact gold prices significantly in the coming weeks.',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        multiplier: 1.9,
        status: 'active'
      },
      {
        question: 'Will the price of gold reach $2,200 per ounce before the next FOMC meeting?',
        description: 'Federal Open Market Committee decisions heavily influence precious metals markets and investor sentiment.',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        multiplier: 1.9,
        status: 'active'
      },
      {
        question: 'Will gold prices rise by more than 5% this month?',
        description: 'Current market conditions and geopolitical tensions could drive significant gold price movements.',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        multiplier: 1.9,
        status: 'active'
      }
    ];

    try {
      for (const question of defaultQuestions) {
        await supabase
          .from('prediction_questions')
          .insert(question);
      }
      
      // Fetch the newly created questions
      fetchQuestions();
    } catch (error) {
      console.error('Error creating default questions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question || !formData.description || !formData.deadline) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      if (editingQuestion) {
        // Update existing question
        const { error } = await supabase
          .from('prediction_questions')
          .update(formData)
          .eq('id', editingQuestion.id);

        if (error) throw error;
        alert('Question updated successfully!');
      } else {
        // Create new question
        const { error } = await supabase
          .from('prediction_questions')
          .insert(formData);

        if (error) throw error;
        alert('Question created successfully!');
      }

      setShowAddModal(false);
      setEditingQuestion(null);
      setFormData({
        question: '',
        description: '',
        deadline: '',
        multiplier: 1.9,
        status: 'active'
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
    }
  };

  const handleEdit = (question: PredictionQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      description: question.description,
      deadline: question.deadline.split('T')[0] + 'T' + question.deadline.split('T')[1].split('.')[0],
      multiplier: question.multiplier,
      status: question.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This will also delete all related predictions.')) return;

    try {
      const { error } = await supabase
        .from('prediction_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      
      alert('Question deleted successfully!');
      fetchQuestions();
      fetchPredictions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const resolveQuestion = async (questionId: string, correctAnswer: boolean) => {
    if (!confirm(`Are you sure you want to resolve this question with answer: ${correctAnswer ? 'YES' : 'NO'}?`)) return;

    try {
      // Update question status
      const { error } = await supabase
        .from('prediction_questions')
        .update({ 
          status: 'resolved',
          correct_answer: correctAnswer
        })
        .eq('id', questionId);

      if (error) throw error;

      // Process payouts
      await processPayouts(questionId, correctAnswer);
      
      alert('Question resolved successfully!');
      fetchQuestions();
      fetchPredictions();
    } catch (error) {
      console.error('Error resolving question:', error);
      alert('Failed to resolve question');
    }
  };

  const processPayouts = async (questionId: string, correctAnswer: boolean) => {
    try {
      // Get all predictions for this question
      const { data: predictions, error } = await supabase
        .from('user_predictions')
        .select('*')
        .eq('question_id', questionId)
        .eq('status', 'pending');

      if (error) throw error;

      for (const prediction of predictions || []) {
        const isWinner = prediction.prediction === correctAnswer;
        const newStatus = isWinner ? 'won' : 'lost';

        // Update prediction status
        await supabase
          .from('user_predictions')
          .update({ status: newStatus })
          .eq('id', prediction.id);

        if (isWinner) {
          // Credit the payout to user's balance
          const { data: user } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', prediction.user_id)
            .single();

          if (user) {
            await supabase
              .from('profiles')
              .update({ balance: user.balance + prediction.potential_payout })
              .eq('id', prediction.user_id);

            // Create transaction record
            await supabase
              .from('transactions')
              .insert({
                user_id: prediction.user_id,
                type: 'trade_profit',
                amount: prediction.potential_payout,
                description: `Prediction win: $${prediction.potential_payout.toFixed(2)}`,
                status: 'completed',
                reference_id: `PRED-WIN-${prediction.id}`
              });
          }
        }
      }
    } catch (error) {
      console.error('Error processing payouts:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const timeLeft = deadlineTime - now;

    if (timeLeft <= 0) return 'Expired';

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const stats = {
    totalQuestions: questions.length,
    activeQuestions: questions.filter(q => q.status === 'active').length,
    totalPredictions: predictions.length,
    totalVolume: predictions.reduce((sum, p) => sum + p.amount, 0)
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading predictions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prediction Management</h1>
            <p className="text-gray-600 mt-2">Manage gold prediction questions and resolve outcomes</p>
          </div>
          <button
            onClick={() => {
              setEditingQuestion(null);
              setFormData({
                question: '',
                description: '',
                deadline: '',
                multiplier: 1.9,
                status: 'active'
              });
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Question</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Questions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeQuestions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPredictions}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalVolume.toFixed(2)}</p>
              </div>
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'questions'
                  ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Questions ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'predictions'
                  ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              User Predictions ({predictions.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'questions' ? (
              <div className="space-y-6">
                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No prediction questions yet.</p>
                    <p className="text-gray-400">Create your first question to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {questions.map((question) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{question.question}</h3>
                            <p className="text-gray-600 mb-4">{question.description}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Deadline: {new Date(question.deadline).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{getTimeRemaining(question.deadline)}</span>
                              </div>
                              <span className="font-bold text-yellow-600">{question.multiplier}x payout</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(question.status)}`}>
                              {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(question)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              
                              {question.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => resolveQuestion(question.id, true)}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                    title="Resolve as YES"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => resolveQuestion(question.id, false)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Resolve as NO"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              
                              <button
                                onClick={() => handleDelete(question.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {predictions.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No user predictions yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Question</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Prediction</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Potential Payout</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictions.map((prediction) => (
                          <tr key={prediction.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{prediction.profiles?.full_name}</p>
                                <p className="text-sm text-gray-600">{prediction.profiles?.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900 max-w-xs truncate">
                                {questions.find(q => q.id === prediction.question_id)?.question || 'Question not found'}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                prediction.prediction 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {prediction.prediction ? 'YES' : 'NO'}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-medium text-gray-900">${prediction.amount.toFixed(2)}</td>
                            <td className="py-4 px-4 font-medium text-green-600">${prediction.potential_payout.toFixed(2)}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                prediction.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : prediction.status === 'won'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {new Date(prediction.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <textarea
                    rows={3}
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter the prediction question..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Provide context or explanation for the question..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payout Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.1"
                      max="10"
                      value={formData.multiplier}
                      onChange={(e) => setFormData({ ...formData, multiplier: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'closed' | 'resolved' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>{editingQuestion ? 'Update' : 'Create'} Question</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PredictionManagement;
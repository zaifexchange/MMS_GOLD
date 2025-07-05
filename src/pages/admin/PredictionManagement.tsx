import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Save, Clock, Target, CheckCircle, XCircle } from 'lucide-react';
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

const PredictionManagement = () => {
  const [questions, setQuestions] = useState<PredictionQuestion[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PredictionQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    deadline: '',
    multiplier: 1.9,
    status: 'active' as 'active' | 'closed' | 'resolved'
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('prediction_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Initialize with default questions if table doesn't exist
      initializeDefaultQuestions();
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultQuestions = async () => {
    const defaultQuestions = [
      {
        question: 'Will the price of gold exceed $3,400 per ounce at 7 PM tomorrow during the NFP report release?',
        description: 'Non-Farm Payroll (NFP) reports often cause significant volatility in gold prices.',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        multiplier: 1.9,
        status: 'active'
      },
      {
        question: 'Will the price of gold drop by 5% or more within the next month?',
        description: 'Major corrections in gold prices can present significant opportunities.',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        multiplier: 1.9,
        status: 'active'
      },
      {
        question: 'Will the price of gold fall below $3,300 per ounce during the next FOMC report?',
        description: 'Federal Open Market Committee decisions heavily influence precious metals.',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        multiplier: 1.9,
        status: 'active'
      }
    ];

    try {
      // Create table if it doesn't exist
      await supabase.rpc('create_prediction_tables');
      
      // Insert default questions
      for (const question of defaultQuestions) {
        await supabase
          .from('prediction_questions')
          .insert(question);
      }
      
      fetchQuestions();
    } catch (error) {
      console.error('Error initializing questions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('prediction_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      
      alert('Question deleted successfully!');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question');
    }
  };

  const resolveQuestion = async (questionId: string, correctAnswer: boolean) => {
    try {
      const { error } = await supabase
        .from('prediction_questions')
        .update({ 
          status: 'resolved',
          correct_answer: correctAnswer
        })
        .eq('id', questionId);

      if (error) throw error;

      // Update user predictions and process payouts
      await processPayouts(questionId, correctAnswer);
      
      alert('Question resolved successfully!');
      fetchQuestions();
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
                description: `Prediction win: ${prediction.potential_payout.toFixed(2)}`,
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

        {/* Questions List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Question</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Deadline</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Multiplier</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          {question.question.substring(0, 80)}...
                        </p>
                        <p className="text-sm text-gray-600">{question.description}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {new Date(question.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-yellow-600">{question.multiplier}x</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(question.status)}`}>
                        {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {questions.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No prediction questions yet.</p>
              <p className="text-gray-400">Create your first question to get started.</p>
            </div>
          )}
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
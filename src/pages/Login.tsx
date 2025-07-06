import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isSupabaseConfigured = supabaseUrl && supabaseKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseKey !== 'placeholder-key';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isSupabaseConfigured) {
      setError('Database not configured. Please set up Supabase connection first.');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by the auth context
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Database Not Configured</h2>
            <p className="text-gray-600 mt-2">Please set up Supabase connection first</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-900 mb-2">Setup Required</h3>
            <ol className="text-sm text-red-800 space-y-1 list-decimal list-inside">
              <li>Click "Connect to Supabase" button</li>
              <li>Create a new Supabase project</li>
              <li>Run the database migrations</li>
              <li>Set up environment variables</li>
            </ol>
          </div>

          <Link 
            to="/"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all text-center block"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-10 w-10 text-yellow-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              MMS Gold
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all pr-12"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-yellow-600 hover:text-yellow-700">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-600 hover:text-yellow-700 font-semibold">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Demo Credentials</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Admin:</strong> monirhasan2003@gmail.com / Zarra-852882</p>
            <p><strong>Note:</strong> Create account first if it doesn't exist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
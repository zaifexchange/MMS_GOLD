import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, Shield, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'monirhasan2003@gmail.com', // Pre-filled for convenience
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by the auth context
    } catch (error: any) {
      console.error('Admin login failed:', error);
      alert(error.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = () => {
    setFormData({
      email: 'monirhasan2003@gmail.com',
      password: 'Zarra-852882'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-red-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Administrator Access</h2>
          <p className="text-gray-600 mt-2">Secure login for platform administrators</p>
        </div>

        {/* Quick Access Info */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="h-4 w-4 text-red-600" />
            <span className="text-sm font-semibold text-red-800">Admin Credentials</span>
          </div>
          <div className="text-xs text-red-700 space-y-1">
            <p><strong>Email:</strong> monirhasan2003@gmail.com</p>
            <p><strong>Password:</strong> Zarra-852882</p>
            <button
              onClick={handleQuickLogin}
              className="mt-2 text-red-600 hover:text-red-800 underline text-xs"
            >
              Click to auto-fill credentials
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="Enter admin email"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                placeholder="Enter admin password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Signing In...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Not an administrator?{' '}
            <Link to="/login" className="text-red-600 hover:text-red-700 font-semibold">
              Regular Login
            </Link>
          </p>
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm mt-2 block">
            ← Back to Homepage
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🔒 This is a secure admin area. All activities are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
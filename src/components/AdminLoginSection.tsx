import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLoginSection = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(adminCredentials.email, adminCredentials.password);
      navigate('/admin');
    } catch (error: any) {
      console.error('Admin login failed:', error);
      alert(error.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginOptions = [
    {
      role: 'Admin',
      email: 'admin@mmsgold.com',
      password: 'admin123',
      icon: Shield,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Full admin access'
    },
    {
      role: 'Demo User',
      email: 'demo@mmsgold.com', 
      password: 'demo123',
      icon: User,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Client dashboard access'
    }
  ];

  const handleQuickLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      await login(email, password);
      const isAdmin = email.includes('admin');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (error: any) {
      console.error('Quick login failed:', error);
      alert(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Quick Access</h2>
          <p className="text-gray-300 text-lg">
            Demo the platform with instant access to admin or client dashboards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {quickLoginOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.role}</h3>
                <p className="text-gray-600">{option.description}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Email:</p>
                  <p className="font-mono text-sm text-gray-900">{option.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Password:</p>
                  <p className="font-mono text-sm text-gray-900">{option.password}</p>
                </div>
              </div>

              <button
                onClick={() => handleQuickLogin(option.email, option.password)}
                disabled={loading}
                className={`w-full mt-6 ${option.color} text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2`}
              >
                <LogIn className="h-5 w-5" />
                <span>{loading ? 'Logging in...' : `Login as ${option.role}`}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Custom Admin Login */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAdminLogin(!showAdminLogin)}
            className="text-yellow-400 hover:text-yellow-300 font-semibold text-lg underline"
          >
            Or login with custom credentials
          </button>
        </div>

        {showAdminLogin && (
          <div className="mt-8 max-w-md mx-auto bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Custom Login</h3>
            
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter email"
                  value={adminCredentials.email}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            These are demo accounts for testing purposes. In production, use secure authentication.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginSection;
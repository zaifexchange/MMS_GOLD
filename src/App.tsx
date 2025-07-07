import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import ClientDashboard from './pages/ClientDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Services from './pages/Services';
import Trading from './pages/Trading';
import Education from './pages/Education';
import Support from './pages/Support';
import Contact from './pages/Contact';
import GoldShop from './pages/GoldShop';
import TradingTools from './pages/TradingTools';
import GoldPrediction from './pages/GoldPrediction';
import AdminLogin from './pages/AdminLogin';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import WebsiteContent from './pages/admin/WebsiteContent';
import SystemSettings from './pages/admin/SystemSettings';
import PredictionManagement from './pages/admin/PredictionManagement';
import TransactionManagement from './pages/admin/TransactionManagement';
import Analytics from './pages/admin/Analytics';

import { AuthProvider, useAuth } from './contexts/AuthContext';

// Component to handle automatic navigation after login
const AuthNavigator = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role after login
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AuthNavigator />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/gold-prediction" element={<GoldPrediction />} />
            <Route path="/education" element={<Education />} />
            <Route path="/support" element={<Support />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gold-shop" element={<GoldShop />} />
            <Route path="/trading-tools" element={<TradingTools />} />
            
            {/* Client Dashboard */}
            <Route path="/dashboard" element={<ClientDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/content" element={<WebsiteContent />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
            <Route path="/admin/predictions" element={<PredictionManagement />} />
            <Route path="/admin/transactions" element={<TransactionManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp, LogIn, UserPlus, ShoppingCart, Bot, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                MMS Gold
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-yellow-400 transition-colors font-medium">
              About
            </Link>
            <Link to="/services" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Services
            </Link>
            <Link to="/trading" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Trading
            </Link>
            <Link to="/gold-prediction" className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center space-x-1">
              <Target className="h-4 w-4" />
              <span>Gold Prediction</span>
            </Link>
            <Link to="/gold-shop" className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center space-x-1">
              <ShoppingCart className="h-4 w-4" />
              <span>Gold Shop</span>
            </Link>
            <Link to="/trading-tools" className="text-white hover:text-yellow-400 transition-colors font-medium flex items-center space-x-1">
              <Bot className="h-4 w-4" />
              <span>Trading Tools</span>
            </Link>
            <Link to="/education" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Education
            </Link>
            <Link to="/support" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Support
            </Link>
            <Link to="/contact" className="text-white hover:text-yellow-400 transition-colors font-medium">
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-yellow-400 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              About
            </Link>
            <Link to="/services" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Services
            </Link>
            <Link to="/trading" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Trading
            </Link>
            <Link to="/gold-prediction" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Gold Prediction
            </Link>
            <Link to="/gold-shop" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Gold Shop
            </Link>
            <Link to="/trading-tools" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Trading Tools
            </Link>
            <Link to="/education" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Education
            </Link>
            <Link to="/support" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Support
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
              Contact
            </Link>
            
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="block px-3 py-2 text-yellow-400 font-semibold"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 text-yellow-400 font-semibold">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
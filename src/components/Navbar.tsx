import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  TrendingUp, 
  LogIn, 
  UserPlus, 
  ChevronDown,
  BarChart3,
  Target,
  ShoppingCart,
  Bot,
  BookOpen,
  Headphones,
  Mail,
  Info,
  Briefcase,
  PiggyBank,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const menuItems = [
    {
      label: 'Trading',
      icon: BarChart3,
      hasDropdown: true,
      items: [
        { label: 'Live Trading', href: '/trading', icon: TrendingUp, description: 'Real-time gold trading platform' },
        { label: 'Gold Prediction', href: '/gold-prediction', icon: Target, description: 'Predict gold price movements' },
        { label: 'Trading Tools', href: '/trading-tools', icon: Bot, description: 'Expert advisors & indicators' },
      ]
    },
    {
      label: 'Services',
      icon: Briefcase,
      hasDropdown: true,
      items: [
        { label: 'Our Services', href: '/services', icon: Briefcase, description: 'Complete service overview' },
        { label: 'Fixed Deposits', href: '/services#deposits', icon: PiggyBank, description: 'Guaranteed returns up to 10%' },
        { label: 'GoldGrowth Network', href: '/services#referrals', icon: Users, description: 'Multi-level referral program' },
        { label: 'Gold Shop', href: '/gold-shop', icon: ShoppingCart, description: 'Buy physical gold & coins' },
      ]
    },
    {
      label: 'Learn',
      icon: BookOpen,
      hasDropdown: true,
      items: [
        { label: 'Education Center', href: '/education', icon: BookOpen, description: 'Trading courses & tutorials' },
        { label: 'About Us', href: '/about', icon: Info, description: 'Our mission & vision' },
      ]
    },
    {
      label: 'Support',
      icon: Headphones,
      hasDropdown: true,
      items: [
        { label: 'Help Center', href: '/support', icon: Headphones, description: '24/7 customer support' },
        { label: 'Contact Us', href: '/contact', icon: Mail, description: 'Get in touch with our team' },
      ]
    }
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-xl sticky top-0 z-50" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeDropdown}>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                MMS Gold
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className="text-white hover:text-yellow-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
              onClick={closeDropdown}
            >
              Home
            </Link>

            {menuItems.map((item) => (
              <div key={item.label} className="relative">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        onClick={closeDropdown}
                        className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                          <subItem.icon className="h-4 w-4 text-black" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                            {subItem.label}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{subItem.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105"
                  onClick={closeDropdown}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-yellow-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/20">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                  onClick={closeDropdown}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105"
                  onClick={closeDropdown}
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
              className="text-white hover:text-yellow-400 transition-colors p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-gray-700">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link 
              to="/" 
              className="block px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {menuItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center space-x-2 px-4 py-2 text-yellow-400 font-semibold">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-8 py-2 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <subItem.icon className="h-4 w-4" />
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </div>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-700">
              {user ? (
                <div className="space-y-2">
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="block px-4 py-3 text-yellow-400 font-semibold hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 px-4 py-3 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-2 px-4 py-3 text-yellow-400 font-semibold hover:bg-white/10 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
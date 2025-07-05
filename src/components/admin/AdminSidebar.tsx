import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  BarChart3, 
  Shield, 
  CreditCard,
  MessageSquare,
  Globe,
  Database,
  UserCheck,
  TrendingUp
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    { icon: TrendingUp, label: 'Trading', path: '/admin/trading' },
    { icon: UserCheck, label: 'KYC Verification', path: '/admin/kyc' },
    { icon: Globe, label: 'Website Content', path: '/admin/content' },
    { icon: MessageSquare, label: 'Notifications', path: '/admin/notifications' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Database, label: 'System Settings', path: '/admin/settings' },
    { icon: Shield, label: 'Security', path: '/admin/security' }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-yellow-500">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-yellow-600 text-black'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
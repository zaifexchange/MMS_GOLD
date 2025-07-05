import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings, Users, BarChart3, Database, Globe } from 'lucide-react';

const AdminQuickAccess = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-xl shadow-2xl">
        <div className="text-center mb-4">
          <Shield className="h-8 w-8 mx-auto mb-2" />
          <h3 className="font-bold text-lg">Admin Access</h3>
          <p className="text-sm opacity-90">Quick admin panel access</p>
        </div>
        
        <div className="space-y-2">
          <Link
            to="/admin"
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            to="/admin/users"
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all text-sm"
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </Link>
          
          <Link
            to="/admin/content"
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all text-sm"
          >
            <Globe className="h-4 w-4" />
            <span>Content</span>
          </Link>
          
          <Link
            to="/admin/settings"
            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all text-sm"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <p className="text-xs opacity-75 text-center">
            Admin: monirhasan2003@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminQuickAccess;
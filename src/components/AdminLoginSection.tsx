import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const AdminLoginSection = () => {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 text-lg">
            Join thousands of successful traders on our platform
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
          <Link 
            to="/login"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105"
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
          
          <Link 
            to="/register"
            className="flex items-center justify-center space-x-2 border-2 border-yellow-500 text-yellow-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-black transition-all"
          >
            <UserPlus className="h-5 w-5" />
            <span>Sign Up</span>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Start your gold trading journey today with our professional platform
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginSection;
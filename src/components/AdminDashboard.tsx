import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome to the Admin Dashboard. Here you can manage users, view platform statistics, and perform administrative actions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Example Stat Cards */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-yellow-700">1,234</div>
            <div className="text-gray-700">Total Users</div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-700">567</div>
            <div className="text-gray-700">Active Trades</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">89</div>
            <div className="text-gray-700">Pending Requests</div>
          </div>
        </div>

        {/* Placeholder for admin controls or navigation */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Quick Actions</h2>
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                Manage Users
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                View Reports
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                Platform Settings
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

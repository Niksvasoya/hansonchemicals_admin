import React from 'react';
import { FlaskRound as Flask } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Flask size={24} className="text-indigo-200" />
            <h1 className="text-2xl font-bold">Hanson Chemicals</h1>
          </div>
          {/* <div className="hidden md:flex items-center space-x-6">
            <button className="text-indigo-100 hover:text-white transition-colors">Dashboard</button>
            <button className="text-indigo-100 hover:text-white transition-colors">Products</button>
            <button className="text-indigo-100 hover:text-white transition-colors">Reports</button>
            <button className="text-indigo-100 hover:text-white transition-colors">Settings</button>
          </div> */}
          <div className="flex items-center">
            <button className="bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Profile
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
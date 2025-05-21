import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ProductTable from '../components/products/ProductTable';
import { ChemicalProductProvider } from '../context/ChemicalProductContext';

const Dashboard: React.FC = () => {
  return (
    <ChemicalProductProvider>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProductTable />
          </div>
        </main>
      </div>
    </ChemicalProductProvider>
  );
};

export default Dashboard;

import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth'; // Fixed import path

const PromoterDashboardPage = () => {
  const { user } = useAuth();
  console.log("Rendered PromoterDashboardPage with user:", user?.id);
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-purple-600 mb-4">
            Promoter Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Welcome to your promoter dashboard. Here you can manage your promotions and view analytics.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Active Promotions
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You currently have no active promotions.
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Performance Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track the performance of your promotions here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterDashboardPage;

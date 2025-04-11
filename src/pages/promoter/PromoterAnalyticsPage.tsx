
import React from 'react';
import Layout from '@/components/Layout';

const PromoterAnalyticsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-purple-600 mb-4">
            Promoter Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Track the performance of your promotions and campaigns.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Total Impressions
              </h2>
              <p className="text-3xl font-bold">0</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Click-through Rate
              </h2>
              <p className="text-3xl font-bold">0%</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Conversions
              </h2>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
              <div className="h-64 flex items-center justify-center border-t border-gray-200 dark:border-gray-700 p-4">
                <p className="text-gray-500">No data available yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterAnalyticsPage;

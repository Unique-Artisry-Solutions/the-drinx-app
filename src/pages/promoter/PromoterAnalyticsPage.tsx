
import React from 'react';
import Layout from '@/components/Layout';
import { BarChart3, LineChart, PieChart } from 'lucide-react';

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
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Engagements</p>
                <p className="text-2xl font-bold text-purple-600">0</p>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <LineChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">0%</p>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                <p className="text-2xl font-bold text-purple-600">-</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-purple-600 mb-4">
              Performance Over Time
            </h2>
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No analytics data available yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterAnalyticsPage;

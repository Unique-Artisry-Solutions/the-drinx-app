
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const PromoterAnalyticsPage = () => {
  const { user } = useAuth();
  console.log("Rendered PromoterAnalyticsPage with user:", user?.id);
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-purple-600 mb-4">
                Promoter Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Track the performance of your promotions and campaigns.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/create-swig-circuit" className="flex items-center gap-2">
                  <PlusCircle size={16} />
                  Create New Swig Circuit
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800 mb-1">Total Promotions</h3>
              <p className="text-2xl font-semibold">0</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800 mb-1">Active Campaigns</h3>
              <p className="text-2xl font-semibold">0</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800 mb-1">Engagement Rate</h3>
              <p className="text-2xl font-semibold">0%</p>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-purple-600 mb-4">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center py-10">
              No data available yet. Start creating promotions to see analytics here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterAnalyticsPage;

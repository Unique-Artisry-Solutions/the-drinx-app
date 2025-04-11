
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart2, Activity, Calendar } from 'lucide-react';

const PromoterDashboardPage = () => {
  const { user } = useAuth();
  console.log("Rendered PromoterDashboardPage with user:", user?.id);
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-purple-600 mb-2">
                Promoter Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome to your promoter dashboard. Here you can manage your promotions and view analytics.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-purple-600">
                  Active Promotions
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                You currently have no active promotions.
              </p>

              <div className="mt-4">
                <Button variant="outline" asChild className="text-purple-600 border-purple-600 hover:bg-purple-50">
                  <Link to="/create-swig-circuit">Start Creating</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <BarChart2 className="h-5 w-5 text-purple-600 mr-2" />
                <h2 className="text-lg font-semibold text-purple-600">
                  Performance Overview
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track the performance of your promotions here.
              </p>
              
              <Button variant="outline" asChild className="text-purple-600 border-purple-600 hover:bg-purple-50">
                <Link to="/promoter/analytics">
                  <Activity size={16} className="mr-2" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterDashboardPage;

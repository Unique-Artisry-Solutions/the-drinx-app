
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth'; // Fixed import path
import { Link } from 'react-router-dom';
import { MessageSquare, CalendarDays, ChartBar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You currently have no active promotions.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Create Promotion
              </Button>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Performance Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track the performance of your promotions here.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                View Analytics
              </Button>
            </div>

            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Venue Communications
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect and message venues for your events.
              </p>
              <Link to="/promoter/communication">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Open Inbox
                </Button>
              </Link>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Brand Connections
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with brands to enhance your events.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Explore Brands
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterDashboardPage;

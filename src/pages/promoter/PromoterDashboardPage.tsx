
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, BarChart, PlusCircle } from 'lucide-react';

const PromoterDashboardPage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Promotions Dashboard</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="h-4 w-4 mr-2" /> Create Promotion
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Megaphone className="h-4 w-4 mr-2 text-purple-600" />
                My Promotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 border-t border-gray-100 mt-2">
                <p className="text-gray-500 mb-4">You haven't created any promotions yet.</p>
                <p className="text-sm text-gray-400">
                  Create your first promotion to start attracting customers to your events!
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-purple-600" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 border-t border-gray-100 mt-2">
                <p className="text-gray-500">No performance data available yet.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Performance metrics will appear here once you create promotions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Getting Started with Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>As a promoter on our platform, you can:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create and manage promotional campaigns for venues</li>
                <li>Track engagement and performance metrics</li>
                <li>Reach thousands of potential customers</li>
                <li>Earn commissions based on venue traffic generated</li>
              </ul>
              <Button variant="outline" className="mt-4 border-purple-200 text-purple-600 hover:bg-purple-50">
                View Tutorial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PromoterDashboardPage;

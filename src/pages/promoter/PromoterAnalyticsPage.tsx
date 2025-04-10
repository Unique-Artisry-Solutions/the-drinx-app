
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, BarChart4 } from 'lucide-react';

const PromoterAnalyticsPage = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <h1 className="text-2xl font-bold mb-6">Promoter Analytics</h1>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-purple-600" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="py-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Active Promotions</p>
                        <p className="text-2xl font-bold text-purple-600">0</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Total Clicks</p>
                        <p className="text-2xl font-bold text-purple-600">0</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Venue Visits</p>
                        <p className="text-2xl font-bold text-purple-600">0</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center py-8 border-t border-gray-100">
                  <CalendarIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-gray-500">No analytics data available yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create and run promotions to start seeing analytics data here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No performance data available yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No revenue data available yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterAnalyticsPage;

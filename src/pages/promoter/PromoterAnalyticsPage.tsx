
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart4, TrendingUp, Users, Calendar } from 'lucide-react';

const PromoterAnalyticsPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track your promotion performance</p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Promotions</CardDescription>
                  <CardTitle className="text-2xl flex items-center">
                    0 <BarChart4 className="h-4 w-4 ml-1 text-purple-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">No active promotions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Engagement</CardDescription>
                  <CardTitle className="text-2xl flex items-center">
                    0% <TrendingUp className="h-4 w-4 ml-1 text-purple-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Audience Reach</CardDescription>
                  <CardTitle className="text-2xl flex items-center">
                    0 <Users className="h-4 w-4 ml-1 text-purple-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Period</CardDescription>
                  <CardTitle className="text-2xl flex items-center">
                    30 days <Calendar className="h-4 w-4 ml-1 text-purple-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Create promotions to see data here</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No analytics data available yet</p>
                  <p className="text-sm text-muted-foreground">
                    Analytics will appear here once you create and run promotions
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>No campaigns found</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    You haven't created any promotional campaigns yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Insights</CardTitle>
                <CardDescription>No audience data available</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Audience data will appear once you have active promotions
                  </p>
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

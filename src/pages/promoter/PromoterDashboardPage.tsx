
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Calendar, Users, TrendingUp } from 'lucide-react';

const PromoterDashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" />
            Promoter Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your events and track promotional campaigns</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and manage bar crawls and tasting events
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Audience Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track attendance and engagement across your events
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Monitor campaign performance and ROI metrics
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterDashboardPage;

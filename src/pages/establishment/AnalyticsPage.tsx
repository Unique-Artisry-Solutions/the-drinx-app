
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useEstablishmentProfile } from '@/hooks/useEstablishmentProfile';
import VisitorStatsTab from '@/components/establishment/VisitorStatsTab';

const AnalyticsPage: React.FC = () => {
  const { visitorStats } = useEstablishmentProfile();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Review visitor statistics and engagement metrics</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Visitor Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitorStatsTab visitorStats={visitorStats} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;

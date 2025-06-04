
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PromotionalToolsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Promotional Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the promotional tools page.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PromotionalToolsPage;


import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EstablishmentReviewsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Establishment Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the establishment reviews page.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EstablishmentReviewsPage;

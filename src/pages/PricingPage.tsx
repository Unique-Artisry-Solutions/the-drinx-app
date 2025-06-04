
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingTier, PricingFeature } from '@/types/PricingTypes';

const PricingPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Pricing Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a placeholder for the pricing page.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PricingPage;

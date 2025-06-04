
import React from 'react';
import Layout from '@/components/Layout';
import { DynamicPricingDashboard } from '@/components/pricing/DynamicPricingDashboard';

const PromoterPricingPage = () => {
  // Mock promoter ID - in real implementation, this would come from auth context
  const promoterId = "promoter-123";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dynamic Pricing</h1>
          <p className="text-muted-foreground">Manage your pricing rules and automation</p>
        </div>
        <DynamicPricingDashboard promoterId={promoterId} />
      </div>
    </Layout>
  );
};

export default PromoterPricingPage;

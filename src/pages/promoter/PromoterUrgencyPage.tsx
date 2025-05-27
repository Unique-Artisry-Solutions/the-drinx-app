
import React from 'react';
import Layout from '@/components/Layout';
import { UrgencyDashboard } from '@/components/promoter/urgency/UrgencyDashboard';

const PromoterUrgencyPage = () => {
  // Mock data - in real implementation, this would come from auth context and URL params
  const promoterId = "promoter-123";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Urgency Features</h1>
          <p className="text-muted-foreground">Manage countdown timers and urgency campaigns</p>
        </div>
        <UrgencyDashboard promoterId={promoterId} />
      </div>
    </Layout>
  );
};

export default PromoterUrgencyPage;

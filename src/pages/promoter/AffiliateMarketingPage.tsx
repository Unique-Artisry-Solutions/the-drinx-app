
import React from 'react';
import { Layout } from '@/components/Layout';
import AffiliateDashboard from '@/components/promoter/affiliate/AffiliateDashboard';
import { useAuth } from '@/contexts/auth';

const AffiliateMarketingPage = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <AffiliateDashboard promoterId={user?.id || ''} />
    </Layout>
  );
};

export default AffiliateMarketingPage;

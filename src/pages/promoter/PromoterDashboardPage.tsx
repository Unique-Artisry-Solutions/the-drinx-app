
import React from 'react';
import Layout from '@/components/Layout';
import PromoterDashboard from './PromoterDashboard';

const PromoterDashboardPage = () => {
  console.log('PromoterDashboardPage - Rendering dashboard (route protection handled at route level)');

  return (
    <Layout>
      <PromoterDashboard />
    </Layout>
  );
};

export default PromoterDashboardPage;

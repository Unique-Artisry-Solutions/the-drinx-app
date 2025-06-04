import React from 'react';
import { Layout } from '@/components/Layout';
import AllActionsOverview from '@/components/establishment/AllActionsOverview';

const AllActionsPage: React.FC = () => {
  return (
    <Layout>
      <AllActionsOverview />
    </Layout>
  );
};

export default AllActionsPage;

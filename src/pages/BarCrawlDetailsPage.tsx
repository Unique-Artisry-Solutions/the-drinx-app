import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import BarCrawlManagement from '@/components/barCrawl/management/BarCrawlManagement';

const BarCrawlDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <BarCrawlManagement barCrawlId={id || ''} />
    </Layout>
  );
};

export default BarCrawlDetailsPage;

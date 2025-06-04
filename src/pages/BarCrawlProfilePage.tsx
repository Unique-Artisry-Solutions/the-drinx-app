import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import BarCrawlProfile from '@/components/barCrawl/BarCrawlProfile';

const BarCrawlProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <BarCrawlProfile barCrawlId={id || ''} />
    </Layout>
  );
};

export default BarCrawlProfilePage;

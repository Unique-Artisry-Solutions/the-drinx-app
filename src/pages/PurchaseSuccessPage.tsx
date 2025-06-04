import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import PurchaseSuccess from '@/components/purchase/PurchaseSuccess';

const PurchaseSuccessPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <Layout>
      <PurchaseSuccess sessionId={sessionId || ''} />
    </Layout>
  );
};

export default PurchaseSuccessPage;

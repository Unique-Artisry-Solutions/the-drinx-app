import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import PurchaseConfirmation from '@/components/purchase/PurchaseConfirmation';

const PurchaseConfirmationPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  return (
    <Layout>
      <PurchaseConfirmation sessionId={sessionId || ''} />
    </Layout>
  );
};

export default PurchaseConfirmationPage;

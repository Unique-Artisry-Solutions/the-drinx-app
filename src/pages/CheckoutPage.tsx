import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import CheckoutFlow from '@/components/checkout/CheckoutFlow';

const CheckoutPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();

  if (!eventId) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <p className="text-red-500">Error: Event ID is missing.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <CheckoutFlow eventId={eventId} />
      </div>
    </Layout>
  );
};

export default CheckoutPage;


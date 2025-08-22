import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ThreadDetailView from '@/components/establishment/communication/ThreadDetailView';

const PromoterMessageThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();

  if (!threadId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Thread Not Found</h1>
            <p className="text-muted-foreground">The message thread you're looking for could not be found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <ThreadDetailView threadId={threadId} />
      </div>
    </Layout>
  );
};

export default PromoterMessageThreadPage;
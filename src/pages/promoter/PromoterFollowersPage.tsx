
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth/AuthProvider';
import SimpleFollowersDashboard from '@/components/promoter/followers/SimpleFollowersDashboard';

const PromoterFollowersPage: React.FC = () => {
  const { user } = useAuth();
  const promoterId = user?.id || 'mock-promoter-id';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Followers</h1>
          <p className="text-muted-foreground">
            Manage your social media followers and track your audience growth
          </p>
        </div>

        <SimpleFollowersDashboard promoterId={promoterId} />
      </div>
    </Layout>
  );
};

export default PromoterFollowersPage;

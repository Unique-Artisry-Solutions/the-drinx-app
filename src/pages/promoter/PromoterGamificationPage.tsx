
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth/AuthProvider';
import GamificationDashboard from '@/components/promoter/followers/GamificationDashboard';

const PromoterGamificationPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Gamification</h1>
          <p className="text-muted-foreground">
            Track your achievements and progress
          </p>
        </div>

        <GamificationDashboard userId={user?.id} />
      </div>
    </Layout>
  );
};

export default PromoterGamificationPage;

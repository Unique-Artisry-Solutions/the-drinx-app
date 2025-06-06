
import React from 'react';
import Layout from '@/components/Layout';
import GamificationDashboard from '@/components/gamification/GamificationDashboard';
import { useAuth } from '@/contexts/auth/AuthProvider';

const PromoterGamificationPage: React.FC = () => {
  const { user } = useAuth();
  const promoterId = user?.id || 'mock-promoter-id';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gamification & Loyalty</h1>
          <p className="text-muted-foreground">
            Manage badges, tiers, and rewards for your followers
          </p>
        </div>

        <GamificationDashboard 
          promoterId={promoterId}
          mode="promoter"
        />
      </div>
    </Layout>
  );
};

export default PromoterGamificationPage;

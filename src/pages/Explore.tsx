
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import TopNavigation from '@/components/TopNavigation';
import { FeatureGate } from '@/components/FeatureGate';
import { FEATURES } from '@/lib/features/registry';
import { EnhancedExploreSection } from '@/components/home/EnhancedExploreSection';
import DevRoleSwitcher from '@/components/development/DevRoleSwitcher';

const Explore: React.FC = () => {
  return (
    <FeatureGate 
      feature={FEATURES.EXPLORE_PAGE} 
      fallback={<Navigate to="/" replace />}
    >
      <Layout>
        <TopNavigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <EnhancedExploreSection />
          <DevRoleSwitcher />
        </div>
      </Layout>
    </FeatureGate>
  );
};

export default Explore;

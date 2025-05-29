
import React from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '@/components/Layout';
import { TopNavigation } from '@/components/TopNavigation';
import { FeatureGate } from '@/components/FeatureGate';
import { EnhancedExploreSection } from '@/components/home/EnhancedExploreSection';
import DevRoleSwitcher from '@/components/development/DevRoleSwitcher';

const Explore: React.FC = () => {
  return (
    <FeatureGate 
      featureName="explore" 
      fallback={<Redirect to="/" />}
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

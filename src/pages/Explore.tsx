
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import TopNavigation from '@/components/TopNavigation';
import { EnhancedExploreSection } from '@/components/home/EnhancedExploreSection';
import DevRoleSwitcher from '@/components/development/DevRoleSwitcher';

const Explore: React.FC = () => {
  return (
    <Layout>
      <TopNavigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <EnhancedExploreSection />
        <DevRoleSwitcher />
      </div>
    </Layout>
  );
};

export default Explore;

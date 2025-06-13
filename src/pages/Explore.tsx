
import React from 'react';
import Layout from '@/components/Layout';
import RecommendationsWidget from '@/components/explore/RecommendationsWidget';
import QuickActionCards from '@/components/explore/personalized/QuickActionCards';
import SwigCircuitsSection from '@/components/explore/SwigCircuitsSection';
import { useIsMobile } from '@/hooks/use-mobile';

const Explore: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Your Perfect Experience
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore cocktails, establishments, and experiences tailored for you
            </p>
          </div>

          <QuickActionCards />
          <SwigCircuitsSection />
          <RecommendationsWidget />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover Your Perfect Experience
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore cocktails, establishments, and experiences tailored for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <QuickActionCards />
            <SwigCircuitsSection />
            <RecommendationsWidget />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;

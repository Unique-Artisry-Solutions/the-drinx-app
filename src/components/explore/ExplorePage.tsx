
import React from 'react';
import BarCrawlSection from '@/components/explore/BarCrawlSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';

const ExplorePage = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Explore</h1>
      
      <FeaturedEstablishmentsSection />
      
      <div className="my-10">
        <BarCrawlSection />
      </div>
      
      <div className="my-10">
        <CocktailsSection />
      </div>
    </div>
  );
};

export default ExplorePage;

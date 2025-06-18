
import React from 'react';
import Layout from '@/components/Layout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { UnauthenticatedFallback } from '@/components/explore/personalized/UnauthenticatedFallback';
import PromoterSection from '@/components/explore/PromoterSection';

const Explore: React.FC = () => {
  const { data, isLoading, error, isAuthenticated } = usePersonalizedData();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-red-600">
            <p>Error loading explore page: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isAuthenticated ? 'Your Personalized Dashboard' : 'Explore Mocktails'}
          </h1>
          <p className="text-muted-foreground">
            {isAuthenticated 
              ? 'Track your mocktail journey and discover new favorites'
              : 'Discover amazing mocktails and establishments'
            }
          </p>
        </div>

        {!isAuthenticated ? (
          <UnauthenticatedFallback />
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
              <QuickStatsWidget
                totalMocktailsTried={data.totalMocktailsTried}
                totalPoints={data.totalPoints}
                currentStreak={data.currentStreak}
                isAuthenticated={isAuthenticated}
              />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{rec.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{rec.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-8">
          <PromoterSection />
        </div>
      </div>
    </Layout>
  );
};

export default Explore;

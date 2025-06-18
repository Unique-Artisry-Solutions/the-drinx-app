
import React from 'react';
import Layout from '@/components/Layout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import PersonalizedRecommendations from '@/components/explore/personalized/PersonalizedRecommendations';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';

const Explore: React.FC = () => {
  const { userStats, recentActivity, loading, isAuthenticated, error } = usePersonalizedData();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
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
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading data: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {isAuthenticated ? 'Your Explore Dashboard' : 'Explore Mocktails'}
          </h1>
        </div>

        {/* Stats Widget - now authentication-aware */}
        <QuickStatsWidget
          totalMocktailsTried={userStats.totalMocktailsTried}
          totalPoints={userStats.totalPoints}
          currentStreak={userStats.currentStreak}
          isAuthenticated={isAuthenticated}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personalized Recommendations - now authentication-aware */}
          <PersonalizedRecommendations 
            isAuthenticated={isAuthenticated}
            loading={loading}
          />
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {isAuthenticated ? 'Recent Activity' : 'Getting Started'}
            </h2>
            {isAuthenticated ? (
              recentActivity.length > 0 ? (
                <div className="space-y-2">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-3 border rounded-lg">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start exploring mocktails to see your activity here
                  </p>
                </div>
              )
            ) : (
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Welcome to Spiritless!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Discover amazing alcohol-free cocktails, track your favorites, and connect with establishments near you.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse local establishments</li>
                  <li>• Discover new mocktail recipes</li>
                  <li>• Track your taste journey</li>
                  <li>• Earn points and achievements</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;

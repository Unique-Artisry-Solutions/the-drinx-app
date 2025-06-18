
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
          <h1 className="text-3xl font-bold">Explore</h1>
        </div>

        {isAuthenticated ? (
          <>
            <QuickStatsWidget
              totalMocktailsTried={userStats.totalMocktailsTried}
              totalPoints={userStats.totalPoints}
              currentStreak={userStats.currentStreak}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalizedRecommendations 
                isAuthenticated={isAuthenticated}
                loading={loading}
              />
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                {recentActivity.length > 0 ? (
                  <div className="space-y-2">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="p-3 border rounded-lg">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent activity</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Welcome to Explore!</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to get personalized recommendations and track your mocktail journey.
            </p>
            <PersonalizedRecommendations 
              isAuthenticated={isAuthenticated}
              loading={loading}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Explore;

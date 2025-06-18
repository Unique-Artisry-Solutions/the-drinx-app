
import React from 'react';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import QuickStatsWidget from '@/components/explore/personalized/QuickStatsWidget';
import PersonalizedRecommendations from '@/components/explore/personalized/PersonalizedRecommendations';
import { Button } from '@/components/ui/button';
import { MapPin, User, Star } from 'lucide-react';

const Explore: React.FC = () => {
  const { userStats, recentActivity, loading, isAuthenticated, error } = usePersonalizedData();

  // Handle error state
  if (error) {
    return (
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Error loading data: {error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // Render appropriate content based on authentication status
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {isAuthenticated ? (
          // Authenticated user dashboard
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <div className="text-sm text-muted-foreground">
                Your personalized mocktail journey
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <QuickStatsWidget 
                userStats={userStats}
                loading={loading}
                isAuthenticated={isAuthenticated}
              />
              
              <PersonalizedRecommendations 
                isAuthenticated={isAuthenticated}
                loading={loading}
              />
            </div>

            {recentActivity.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          // Guest/unauthenticated user content
          <>
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">Discover Amazing Mocktails</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore the world's best alcohol-free cocktails, find nearby establishments, 
                  and join a community of mocktail enthusiasts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-6 border rounded-lg">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-lg font-semibold mb-2">Find Nearby</h3>
                  <p className="text-muted-foreground">
                    Discover mocktail bars and restaurants in your area
                  </p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <Star className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-lg font-semibold mb-2">Rate & Review</h3>
                  <p className="text-muted-foreground">
                    Share your experiences and help others find great drinks
                  </p>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <User className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                  <p className="text-muted-foreground">
                    Keep track of your mocktail journey and achievements
                  </p>
                </div>
              </div>

              <div className="space-x-4">
                <Button size="lg" className="bg-spiritless-pink hover:bg-spiritless-pink/90">
                  Sign Up Free
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Public content that doesn't require authentication */}
            <div className="mt-12">
              <PersonalizedRecommendations 
                isAuthenticated={false}
                loading={false}
              />
            </div>
          </>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Explore;

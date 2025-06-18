
import React from 'react';
import { Layout } from '@/components/Layout';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/personalized/RewardsHighlightWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';
import { PersonalizedRecommendations } from '@/components/explore/personalized/PersonalizedRecommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Explore: React.FC = () => {
  const { userStats, recentActivity, loading, isAuthenticated, error } = usePersonalizedData();
  const { recommendations, isLoading: recommendationsLoading } = usePersonalizedRecommendations();

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state if data fetching failed
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Data</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show fallback content for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to Explore</CardTitle>
                <CardDescription>
                  Discover personalized mocktail recommendations, track your progress, and connect with the community.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Track Your Journey</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep track of mocktails you've tried and establishments you've visited.
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Get Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive personalized suggestions based on your preferences and history.
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Earn Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Collect points and unlock achievements as you explore.
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Connect & Share</h3>
                    <p className="text-sm text-muted-foreground">
                      Share your experiences and connect with other mocktail enthusiasts.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link to="/login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/signup">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </Link>
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in here</Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  // Show authenticated user content
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore</h1>
          <p className="text-muted-foreground">
            Discover new mocktails, track your progress, and get personalized recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <QuickStatsWidget
            totalMocktailsTried={userStats.totalMocktailsTried}
            totalPoints={userStats.totalPoints}
            currentStreak={userStats.currentStreak}
          />
          
          <RewardsHighlightWidget
            totalPoints={userStats.totalPoints}
            currentTier="Silver"
            nextTier="Gold" 
            progressToNextTier={83}
          />
          
          <ActivityFeedWidget activities={recentActivity} />
        </div>

        <PersonalizedRecommendations 
          recommendations={recommendations}
          isLoading={recommendationsLoading}
        />
      </div>
    </Layout>
  );
};

export default Explore;

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import StreakMotivationWidget from '@/components/explore/personalized/StreakMotivationWidget';
import { QuickStatsWidget } from '@/components/explore/personalized/QuickStatsWidget';
import RecommendationsWidget from '@/components/explore/personalized/RecommendationsWidget';
import RewardsHighlightWidget from '@/components/rewards/RewardsHighlightWidget';
import { NearbyEstablishmentsWidget } from '@/components/explore/personalized/NearbyEstablishmentsWidget';
import { UpcomingEventsWidget } from '@/components/explore/personalized/UpcomingEventsWidget';
import ActivityFeedWidget from '@/components/explore/personalized/ActivityFeedWidget';
import EstablishmentCard from '@/components/EstablishmentCard';
import CocktailCard from '@/components/CocktailCard';
import FeaturedEstablishmentsSection from '@/components/explore/FeaturedEstablishmentsSection';
import CocktailsSection from '@/components/explore/CocktailsSection';
import EventsSection from '@/components/explore/EventsSection';
import BarCrawlSection from '@/components/explore/BarCrawlSection';

const Explore: React.FC = () => {
  const { user } = useAuth();
  const { personalizedData, isLoading } = usePersonalizedData();
  const { activities, isLoading: activitiesLoading } = useRecentActivity();

  // Mock data for personalized widgets
  const mockRecommendations = [
    {
      id: '1',
      type: 'establishment' as const,
      title: 'Try The Mocktail Lounge',
      description: 'Based on your recent visits',
      confidence: 0.9,
      imageUrl: undefined
    },
    {
      id: '2',
      type: 'cocktail' as const,
      title: 'Virgin Bloody Mary',
      description: 'Popular among users like you',
      confidence: 0.85,
      imageUrl: undefined
    }
  ];

  const mockEstablishments = [
    {
      id: '1',
      name: 'The Mocktail Lounge',
      address: '123 Main St, Downtown',
      rating: 4.8,
      cocktailCount: 15,
      image: '/api/placeholder/400/300',
      distance: '0.3 miles',
      latitude: 40.7128,
      longitude: -74.0060
    },
    {
      id: '2',
      name: 'Sober Social Club',
      address: '456 Oak Ave, Midtown',
      rating: 4.5,
      cocktailCount: 12,
      image: '/api/placeholder/400/300',
      distance: '0.7 miles',
      latitude: 40.7580,
      longitude: -73.9855
    }
  ];

  const mockCocktails = [
    {
      id: '1',
      name: 'Virgin Mojito',
      establishment: 'The Mocktail Lounge',
      rating: 4.9,
      image: '/api/placeholder/300/200',
      ingredients: ['Fresh mint', 'Lime juice', 'Club soda', 'Simple syrup']
    },
    {
      id: '2',
      name: 'Cucumber Basil Smash',
      establishment: 'Sober Social Club',
      rating: 4.7,
      image: '/api/placeholder/300/200',
      ingredients: ['Cucumber', 'Fresh basil', 'Lime', 'Tonic water']
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your personalized experience...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {user ? `Welcome back, ${user.email?.split('@')[0]}!` : 'Explore'}
          </h1>
          <p className="text-muted-foreground">
            Discover amazing mocktails and sober-friendly establishments near you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Stats */}
            <QuickStatsWidget 
              totalMocktailsTried={personalizedData?.totalMocktailsTried || 0}
              totalPoints={personalizedData?.totalPoints || 0}
              currentStreak={personalizedData?.currentStreak || 0}
            />

            {/* Recommendations */}
            <RecommendationsWidget recommendations={mockRecommendations} />

            {/* Nearby Establishments */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Nearby Places</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockEstablishments.map((establishment) => (
                  <EstablishmentCard
                    key={establishment.id}
                    id={establishment.id}
                    name={establishment.name}
                    address={establishment.address}
                    distance={establishment.distance}
                    cocktailCount={establishment.cocktailCount}
                    image={establishment.image}
                  />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <ActivityFeedWidget activities={activities} isLoading={activitiesLoading} />

            {/* Featured Cocktails */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Trending Mocktails</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockCocktails.map((cocktail) => (
                  <CocktailCard
                    key={cocktail.id}
                    id={cocktail.id}
                    name={cocktail.name}
                    establishment={cocktail.establishment}
                    rating={cocktail.rating}
                    image={cocktail.image}
                    ingredients={cocktail.ingredients}
                  />
                ))}
              </div>
            </div>

            {/* Other Sections */}
            <FeaturedEstablishmentsSection />
            <CocktailsSection />
            <EventsSection />
            <BarCrawlSection />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <StreakMotivationWidget />
            <RewardsHighlightWidget />
            <UpcomingEventsWidget />
            <NearbyEstablishmentsWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

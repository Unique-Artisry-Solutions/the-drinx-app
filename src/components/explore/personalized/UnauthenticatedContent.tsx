
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  UserPlus, 
  TrendingUp, 
  Calendar, 
  Star,
  Lock,
  ArrowRight
} from 'lucide-react';

interface UnauthenticatedContentProps {
  onSignUpClick?: () => void;
}

export const UnauthenticatedContent: React.FC<UnauthenticatedContentProps> = ({
  onSignUpClick = () => console.log('Sign up clicked')
}) => {
  const publicRecommendations = [
    {
      id: '1',
      title: 'The Zen Garden',
      description: 'Popular alcohol-free venue with meditation-inspired drinks',
      type: 'establishment' as const,
      rating: 4.8,
      distance: '0.3 miles',
      tags: ['Popular', 'Relaxing', 'Organic'],
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Tropical Paradise Punch',
      description: 'Trending mocktail recipe loved by the community',
      type: 'recipe' as const,
      rating: 4.6,
      tags: ['Trending', 'Easy', 'Refreshing'],
      imageUrl: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Weekly Mixology Workshop',
      description: 'Learn to craft professional mocktails',
      type: 'event' as const,
      date: 'Every Friday',
      location: 'Downtown Community Center',
      tags: ['Weekly', 'Learn', 'Social'],
      imageUrl: '/api/placeholder/300/200'
    }
  ];

  const quickActions = [
    {
      id: 'browse',
      title: 'Browse Venues',
      description: 'Discover alcohol-free establishments',
      icon: MapPin,
      color: 'bg-blue-500',
      action: () => console.log('Browse venues')
    },
    {
      id: 'search',
      title: 'Search Drinks',
      description: 'Find your perfect mocktail',
      icon: Search,
      color: 'bg-green-500',
      action: () => console.log('Search drinks')
    },
    {
      id: 'signup',
      title: 'Join Community',
      description: 'Track favorites & earn rewards',
      icon: UserPlus,
      color: 'bg-purple-500',
      action: onSignUpClick
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to Spiritless!
              </h2>
              <p className="text-gray-600 mb-4">
                Discover amazing alcohol-free experiences, track your favorites, and connect with like-minded people.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  500+ Venues
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  10k+ Reviews
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Weekly Events
                </span>
              </div>
            </div>
            <Button onClick={onSignUpClick} className="ml-4">
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3"
                onClick={action.action}
              >
                <div className={`p-3 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Popular This Week
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Sign in for personalized
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publicRecommendations.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{item.title}</h4>
                  <div className="flex gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    {'rating' in item && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {item.rating}
                      </span>
                    )}
                    {'distance' in item && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {item.distance}
                      </span>
                    )}
                    {'date' in item && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {item.date}
                      </span>
                    )}
                  </div>
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Sign up CTA */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-3">
              Sign in to get personalized recommendations based on your preferences and activity
            </p>
            <Button onClick={onSignUpClick} size="sm">
              Sign In to Unlock Personal Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Get With An Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-500 text-white rounded">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Personal Stats</h4>
                <p className="text-sm text-gray-600">
                  Track mocktails tried, points earned, and visit streaks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-500 text-white rounded">
                <Star className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Favorites & Reviews</h4>
                <p className="text-sm text-gray-600">
                  Save favorites and share reviews with the community
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-500 text-white rounded">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Personalized Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Get suggestions based on your taste preferences
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="p-2 bg-orange-500 text-white rounded">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-medium">Event Invitations</h4>
                <p className="text-sm text-gray-600">
                  Join exclusive events and meetups in your area
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthenticatedContent;

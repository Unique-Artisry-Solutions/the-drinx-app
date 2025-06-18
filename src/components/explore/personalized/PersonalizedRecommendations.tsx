
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock } from 'lucide-react';

interface Recommendation {
  id: string;
  name: string;
  type: 'establishment' | 'mocktail' | 'event';
  rating: number;
  distance?: string;
  description: string;
}

interface PersonalizedRecommendationsProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  isAuthenticated,
  loading
}) => {
  // Mock recommendations - in real app this would come from props or hook
  const recommendations: Recommendation[] = isAuthenticated ? [
    {
      id: '1',
      name: 'The Zen Garden',
      type: 'establishment',
      rating: 4.8,
      distance: '0.5 miles',
      description: 'Tranquil atmosphere with premium mocktails'
    },
    {
      id: '2',
      name: 'Tropical Paradise Punch',
      type: 'mocktail',
      rating: 4.6,
      description: 'Your new favorite tropical blend'
    },
    {
      id: '3',
      name: 'Happy Hour Specials',
      type: 'event',
      rating: 4.5,
      description: 'Special deals on mocktails this week'
    }
  ] : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discover Amazing Mocktails</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Sign in to get personalized recommendations based on your preferences and location.
          </p>
          <Button>Sign In to Get Recommendations</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex-shrink-0">
                {rec.type === 'establishment' && <MapPin className="h-5 w-5 text-blue-500" />}
                {rec.type === 'mocktail' && <Star className="h-5 w-5 text-yellow-500" />}
                {rec.type === 'event' && <Clock className="h-5 w-5 text-green-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium truncate">{rec.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
                    {rec.rating}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                {rec.distance && (
                  <p className="text-xs text-blue-600 mt-1">{rec.distance}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;

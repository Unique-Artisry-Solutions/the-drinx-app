
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Star, Sparkles, Calendar, ChefHat } from 'lucide-react';
import { Recommendation } from '@/types/explore/recommendations';

export interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
}

const NewUserRecommendations: Recommendation[] = [
  {
    id: 'new-1',
    title: 'Welcome to Spiritless!',
    description: 'Start your alcohol-free journey by exploring popular mocktails',
    type: 'cocktail',
    rating: 4.8,
    reason: 'Perfect for beginners'
  },
  {
    id: 'new-2',
    title: 'Find Your First Venue',
    description: 'Discover sober-friendly establishments near you',
    type: 'establishment',
    distance: 'Nearby',
    reason: 'Great for first-time visitors'
  },
  {
    id: 'new-3',
    title: 'Join the Community',
    description: 'Connect with like-minded people at local sober events',
    type: 'event',
    reason: 'Build your sober social network'
  }
];

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations = []
}) => {
  const isNewUser = recommendations.length === 0;
  const displayRecommendations = isNewUser ? NewUserRecommendations : recommendations;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'establishment':
        return <MapPin className="h-4 w-4" />;
      case 'cocktail':
        return <Star className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'recipe':
        return <ChefHat className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'establishment':
        return 'bg-blue-100 text-blue-800';
      case 'cocktail':
        return 'bg-purple-100 text-purple-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      case 'recipe':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {isNewUser ? 'Getting Started Recommendations' : 'Personalized Recommendations'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isNewUser && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <p className="text-sm text-blue-700">
                Welcome! These recommendations will help you discover the amazing world of alcohol-free socializing.
              </p>
            </div>
          )}
          
          {displayRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getTypeColor(recommendation.type)}>
                    {getTypeIcon(recommendation.type)}
                    <span className="ml-1 capitalize">{recommendation.type}</span>
                  </Badge>
                </div>
                {recommendation.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{recommendation.rating}</span>
                  </div>
                )}
              </div>

              <h4 className="font-medium text-sm mb-1">{recommendation.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{recommendation.description}</p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="italic">"{recommendation.reason}"</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  {recommendation.distance && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{recommendation.distance}</span>
                    </div>
                  )}
                  {recommendation.date && recommendation.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{recommendation.date} at {recommendation.time}</span>
                    </div>
                  )}
                  {recommendation.attendees && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{recommendation.attendees} attending</span>
                    </div>
                  )}
                  {recommendation.location && !recommendation.distance && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{recommendation.location}</span>
                    </div>
                  )}
                </div>
                <Button size="sm" variant="outline" className="text-xs h-6">
                  {isNewUser ? 'Explore' : 'View Details'}
                </Button>
              </div>
            </div>
          ))}

          {isNewUser && (
            <div className="pt-4 border-t">
              <Button variant="ghost" className="w-full text-xs" size="sm">
                Tell us your preferences for better recommendations
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

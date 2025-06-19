
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users, Star, Sparkles, Calendar } from 'lucide-react';

export interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event';
  title: string;
  description: string;
  reason: string;
  imageUrl?: string;
  rating?: number;
  distance?: string;
  date?: string;
  time?: string;
  attendees?: number;
  location?: string;
}

export interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations = []
}) => {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            No personalized recommendations available at the moment
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'establishment':
        return <MapPin className="h-4 w-4" />;
      case 'cocktail':
        return <Star className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Personalized Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
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
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

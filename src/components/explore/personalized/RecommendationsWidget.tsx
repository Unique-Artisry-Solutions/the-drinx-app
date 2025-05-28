
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'establishment' | 'cocktail' | 'event';
  rating?: number;
  distance?: string;
  imageUrl?: string;
}

export interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'The Mocktail Lounge',
    description: 'Trendy spot with creative non-alcoholic drinks',
    type: 'establishment',
    rating: 4.8,
    distance: '0.3 miles'
  },
  {
    id: '2',
    title: 'Virgin Mojito Supreme',
    description: 'Refreshing mint and lime combination',
    type: 'cocktail',
    rating: 4.6
  },
  {
    id: '3',
    title: 'Sober Social Hour',
    description: 'Weekly meetup for mocktail enthusiasts',
    type: 'event',
    distance: '1.2 miles'
  }
];

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ 
  recommendations = defaultRecommendations 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {rec.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  {rec.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{rec.rating}</span>
                    </div>
                  )}
                  {rec.distance && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{rec.distance}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

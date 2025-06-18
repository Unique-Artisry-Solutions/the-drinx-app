
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Sparkles } from 'lucide-react';

export interface Recommendation {
  id: string;
  type: 'cocktail' | 'establishment' | 'event';
  title: string;
  subtitle: string;
  imageUrl?: string;
  rating?: number;
  reason: string;
}

export interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'cocktail',
    title: 'Tropical Paradise',
    subtitle: 'Pineapple, Coconut & Lime',
    rating: 4.8,
    reason: 'Based on your love for fruity drinks'
  },
  {
    id: '2',
    type: 'establishment',
    title: 'The Garden Lounge',
    subtitle: '2.1 miles away',
    rating: 4.6,
    reason: 'New establishment in your area'
  },
  {
    id: '3',
    type: 'event',
    title: 'Mocktail Masterclass',
    subtitle: 'Tomorrow at 7 PM',
    reason: 'Perfect for your skill level'
  }
];

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations = defaultRecommendations
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cocktail':
        return '🍹';
      case 'establishment':
        return '🏪';
      case 'event':
        return '📅';
      default:
        return '✨';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-3 rounded-lg border">
              <div className="flex items-start gap-3">
                <div className="text-lg">{getTypeIcon(rec.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{rec.title}</h4>
                    {rec.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{rec.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{rec.subtitle}</p>
                  <p className="text-xs text-primary mb-3 italic">{rec.reason}</p>
                  <Button size="sm" variant="outline" className="w-full text-xs h-6">
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Bookmark, Share, Clock } from 'lucide-react';
import { Recommendation } from '@/types/explore';

interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
  isLoading?: boolean;
  activeCategory?: string;
  setActiveCategory?: (category: string) => void;
  onSave?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onShare?: (id: string) => void;
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations = [],
  isLoading = false,
  activeCategory = 'all',
  setActiveCategory,
  onSave,
  onDismiss,
  onShare
}) => {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'establishments', label: 'Places' },
    { id: 'cocktails', label: 'Drinks' },
    { id: 'events', label: 'Events' }
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
        {setActiveCategory && (
          <div className="flex gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recommendations available
            </div>
          ) : (
            recommendations.map((recommendation) => (
              <div key={recommendation.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.description}
                    </p>
                    {recommendation.reason && (
                      <p className="text-xs text-blue-600 mt-1">
                        {recommendation.reason}
                      </p>
                    )}
                  </div>
                  {recommendation.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{recommendation.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">{recommendation.type}</Badge>
                    {recommendation.distance && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {recommendation.distance}
                      </div>
                    )}
                    {recommendation.trending && (
                      <Badge variant="default">Trending</Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {onSave && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSave(recommendation.id)}
                      >
                        <Bookmark className={`h-4 w-4 ${recommendation.isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    )}
                    {onShare && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShare(recommendation.id)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;

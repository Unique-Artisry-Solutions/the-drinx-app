
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Clock, Heart, Share2, X, Sparkles } from 'lucide-react';
import { PersonalizedRecommendation } from '@/hooks/usePersonalizedRecommendations';

export interface RecommendationsWidgetProps {
  recommendations: PersonalizedRecommendation[];
  isLoading?: boolean;
  activeCategory?: 'all' | 'establishments' | 'cocktails' | 'events';
  setActiveCategory?: (category: 'all' | 'establishments' | 'cocktails' | 'events') => void;
  onSave: (recommendationId: string) => Promise<void>;
  onDismiss: (recommendationId: string) => Promise<void>;
  onShare: (recommendationId: string) => Promise<void>;
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations,
  isLoading = false,
  activeCategory = 'all',
  setActiveCategory,
  onSave,
  onDismiss,
  onShare
}) => {
  const filteredRecommendations = recommendations.filter(rec => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'establishments') return rec.type === 'establishment';
    if (activeCategory === 'cocktails') return rec.type === 'cocktail';
    if (activeCategory === 'events') return rec.type === 'event';
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        {setActiveCategory && (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="establishments">Places</TabsTrigger>
              <TabsTrigger value="cocktails">Drinks</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="p-4 rounded-lg border bg-card">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    {recommendation.trending && (
                      <Badge variant="secondary" className="text-xs">Trending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{recommendation.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    {recommendation.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{recommendation.rating}</span>
                      </div>
                    )}
                    {recommendation.distance && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{recommendation.distance}</span>
                      </div>
                    )}
                    {recommendation.availability && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className={
                          recommendation.availability === 'open' ? 'text-green-600' :
                          recommendation.availability === 'closing-soon' ? 'text-orange-600' :
                          'text-red-600'
                        }>
                          {recommendation.availability === 'open' ? 'Open' :
                           recommendation.availability === 'closing-soon' ? 'Closing Soon' :
                           'Closed'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {recommendation.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-blue-600 italic">{recommendation.reason}</p>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDismiss(recommendation.id)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={recommendation.isSaved ? "default" : "outline"}
                    onClick={() => onSave(recommendation.id)}
                    className="text-xs"
                  >
                    <Heart className={`h-3 w-3 mr-1 ${recommendation.isSaved ? 'fill-current' : ''}`} />
                    {recommendation.isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onShare(recommendation.id)}
                    className="text-xs"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {recommendation.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  X, 
  Share2, 
  MapPin, 
  Star, 
  Clock, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Recommendation, RecommendationCategoryType } from '@/types/explore';

interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RecommendationCategoryType>('all');
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [dismissedItems, setDismissedItems] = useState<Set<string>>(new Set());

  // Helper function to map recommendation type to category type
  const getRecommendationCategory = (type: Recommendation['type']): RecommendationCategoryType => {
    switch (type) {
      case 'establishment':
        return 'establishments';
      case 'cocktail':
        return 'cocktails';
      case 'event':
        return 'events';
      case 'recipe':
        return 'recipes';
      default:
        return 'all';
    }
  };

  // Filter recommendations based on selected category
  const filteredRecommendations = recommendations
    .filter(rec => !dismissedItems.has(rec.id))
    .filter(rec => {
      if (selectedCategory === 'all') return true;
      return getRecommendationCategory(rec.type) === selectedCategory;
    });

  const handleSave = (id: string) => {
    const newSaved = new Set(savedItems);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedItems(newSaved);
  };

  const handleDismiss = (id: string) => {
    setDismissedItems(prev => new Set([...prev, id]));
  };

  const handleShare = (recommendation: Recommendation) => {
    if (navigator.share) {
      navigator.share({
        title: recommendation.title,
        text: recommendation.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Check out: ${recommendation.title}`);
    }
  };

  const handleRefresh = () => {
    setDismissedItems(new Set());
    // In a real app, this would trigger a data refresh
  };

  const getCategoryIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'establishment':
        return '🏪';
      case 'cocktail':
        return '🍹';
      case 'event':
        return '🎉';
      case 'recipe':
        return '📝';
      default:
        return '✨';
    }
  };

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'open':
        return 'bg-green-500';
      case 'closing-soon':
        return 'bg-yellow-500';
      case 'closed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✨ Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>No recommendations available right now.</p>
            <p className="text-sm mt-2">Check back later for personalized suggestions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            ✨ Personalized Recommendations
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as RecommendationCategoryType)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="establishments" className="text-xs">Places</TabsTrigger>
            <TabsTrigger value="cocktails" className="text-xs">Drinks</TabsTrigger>
            <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
            <TabsTrigger value="recipes" className="text-xs">Recipes</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <div key={recommendation.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    {recommendation.imageUrl && (
                      <div className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                           style={{ backgroundImage: `url(${recommendation.imageUrl})` }} />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{getCategoryIcon(recommendation.type)}</span>
                            <h4 className="font-medium text-sm leading-tight">{recommendation.title}</h4>
                            {recommendation.trending && (
                              <TrendingUp className="h-3 w-3 text-orange-500" />
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {recommendation.description}
                          </p>

                          {recommendation.reason && (
                            <p className="text-xs text-blue-600 mb-2 italic">
                              💡 {recommendation.reason}
                            </p>
                          )}

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                            
                            {recommendation.price && (
                              <span className="font-medium">{recommendation.price}</span>
                            )}

                            {recommendation.availability && (
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(recommendation.availability)}`} />
                                <span className="capitalize">{recommendation.availability}</span>
                              </div>
                            )}
                          </div>

                          {recommendation.tags && recommendation.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {recommendation.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSave(recommendation.id)}
                            className={`h-8 w-8 p-0 ${savedItems.has(recommendation.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                          >
                            <Heart className={`h-4 w-4 ${savedItems.has(recommendation.id) ? 'fill-current' : ''}`} />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(recommendation)}
                            className="h-8 w-8 p-0 text-muted-foreground"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(recommendation.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRecommendations.length === 0 && (
                <div className="text-center text-muted-foreground py-6">
                  <p>No {selectedCategory} recommendations available.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedCategory('all')}
                    className="mt-2"
                  >
                    View all recommendations
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;

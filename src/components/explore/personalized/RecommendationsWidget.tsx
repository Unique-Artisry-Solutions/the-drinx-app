
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Bookmark, Share, Clock, MapPin, TrendingUp, RefreshCw, X } from 'lucide-react';
import { Recommendation, RecommendationCategoryType } from '@/types/explore';

interface RecommendationsWidgetProps {
  recommendations?: Recommendation[];
  isLoading?: boolean;
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations = [],
  isLoading = false
}) => {
  const [activeCategory, setActiveCategory] = useState<RecommendationCategoryType>('all');
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const categories: { id: RecommendationCategoryType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: recommendations.length },
    { id: 'establishments', label: 'Places', count: recommendations.filter(r => r.type === 'establishment').length },
    { id: 'cocktails', label: 'Drinks', count: recommendations.filter(r => r.type === 'cocktail').length },
    { id: 'events', label: 'Events', count: recommendations.filter(r => r.type === 'event').length },
    { id: 'recipe', label: 'Recipes', count: recommendations.filter(r => r.type === 'recipe').length }
  ];

  // Filter recommendations by category and exclude dismissed ones
  const filteredRecommendations = recommendations
    .filter(rec => !dismissedIds.has(rec.id))
    .filter(rec => {
      if (activeCategory === 'all') return true;
      return rec.type === activeCategory;
    });

  const handleSave = (id: string) => {
    console.log('Save recommendation:', id);
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleShare = (id: string) => {
    console.log('Share recommendation:', id);
  };

  const handleRefresh = () => {
    setDismissedIds(new Set());
    console.log('Refresh recommendations');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Personalized Recommendations</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="text-xs"
            >
              {category.label}
              {category.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredRecommendations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {dismissedIds.size > 0 ? (
                <div>
                  <p className="mb-2">No more recommendations in this category</p>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Show dismissed items
                  </Button>
                </div>
              ) : (
                'No recommendations available'
              )}
            </div>
          ) : (
            filteredRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      {recommendation.trending && (
                        <TrendingUp className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {recommendation.description}
                    </p>
                    {recommendation.reason && (
                      <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                        💡 {recommendation.reason}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 ml-4">
                    {recommendation.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{recommendation.rating}</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(recommendation.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Metadata row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="capitalize">
                      {recommendation.type}
                    </Badge>
                    
                    {recommendation.distance && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {recommendation.distance}
                      </div>
                    )}
                    
                    {recommendation.price && (
                      <span className="font-medium">{recommendation.price}</span>
                    )}
                    
                    {recommendation.availability && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className={`capitalize ${
                          recommendation.availability === 'open' ? 'text-green-600' :
                          recommendation.availability === 'closing-soon' ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {recommendation.availability.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSave(recommendation.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Bookmark className={`h-4 w-4 ${recommendation.isSaved ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(recommendation.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Tags */}
                {recommendation.tags && recommendation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recommendation.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recommendation.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{recommendation.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;

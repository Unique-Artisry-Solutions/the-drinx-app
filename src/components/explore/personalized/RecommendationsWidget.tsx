
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Bookmark, X, Share, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { PersonalizedRecommendation } from '@/hooks/usePersonalizedRecommendations';

export interface RecommendationsWidgetProps {
  recommendations: PersonalizedRecommendation[];
  isLoading: boolean;
  activeCategory: 'all' | 'establishments' | 'cocktails' | 'events';
  setActiveCategory: (category: 'all' | 'establishments' | 'cocktails' | 'events') => void;
  onSave: (id: string) => void;
  onDismiss: (id: string) => void;
  onShare: (id: string) => void;
}

export const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({
  recommendations,
  isLoading,
  activeCategory,
  setActiveCategory,
  onSave,
  onDismiss,
  onShare
}) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = [
    { id: 'all' as const, label: 'All', icon: '🌟' },
    { id: 'establishments' as const, label: 'Places', icon: '🏪' },
    { id: 'cocktails' as const, label: 'Drinks', icon: '🍹' },
    { id: 'events' as const, label: 'Events', icon: '📅' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'establishment': return '🏪';
      case 'cocktail': return '🍹';
      case 'event': return '📅';
      case 'recipe': return '📝';
      default: return '🌟';
    }
  };

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'open': return 'text-green-600';
      case 'closing-soon': return 'text-amber-600';
      case 'closed': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          Recommended for You
        </CardTitle>
        
        {/* Category Filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="text-xs"
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(recommendation.type)}</span>
                  <div>
                    <h4 className="font-medium text-sm">{recommendation.title}</h4>
                    <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {recommendation.trending && (
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(recommendation.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {recommendation.imageUrl && (
                <div className="mb-3 rounded-md overflow-hidden">
                  <img 
                    src={recommendation.imageUrl} 
                    alt={recommendation.title}
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}
              
              {/* Rating and Details */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
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
                    <Clock className="h-3 w-3" />
                    <span className={getAvailabilityColor(recommendation.availability)}>
                      {recommendation.availability.replace('-', ' ')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Reason and Tags */}
              <div className="mb-3">
                <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1 inline-block">
                  💡 {recommendation.reason}
                </p>
              </div>
              
              {recommendation.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {recommendation.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSave(recommendation.id)}
                    className={`text-xs h-7 ${recommendation.isSaved ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    <Bookmark className={`h-3 w-3 mr-1 ${recommendation.isSaved ? 'fill-current' : ''}`} />
                    {recommendation.isSaved ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(recommendation.id)}
                    className="text-xs h-7"
                  >
                    <Share className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
                
                <Button size="sm" className="text-xs h-7">
                  View Details
                </Button>
              </div>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recommendations available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try exploring different categories or updating your preferences.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

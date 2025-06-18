
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { RecommendationCategoryType } from '@/types/explore';
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Share, 
  X, 
  Sparkles,
  Lock,
  UserPlus
} from 'lucide-react';
import UnauthenticatedContent from './UnauthenticatedContent';

interface PersonalizedRecommendationsProps {
  isAuthenticated: boolean;
  loading?: boolean;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  isAuthenticated,
  loading = false
}) => {
  const {
    recommendations,
    isLoading,
    activeCategory,
    setActiveCategory,
    saveRecommendation,
    dismissRecommendation,
    shareRecommendation
  } = usePersonalizedRecommendations();

  // Show loading state
  if (loading || (isAuthenticated && isLoading)) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show unauthenticated content
  if (!isAuthenticated) {
    return <UnauthenticatedContent onSignUpClick={() => console.log('Sign up clicked')} />;
  }

  // Authenticated user content
  const categories: { value: RecommendationCategoryType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'establishments', label: 'Venues' },
    { value: 'cocktails', label: 'Drinks' },
    { value: 'events', label: 'Events' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'establishment': return MapPin;
      case 'cocktail': return Star;
      case 'event': return Clock;
      case 'swig-circuit': return Sparkles;
      default: return Star;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'establishment': return 'bg-blue-500';
      case 'cocktail': return 'bg-green-500';  
      case 'event': return 'bg-purple-500';
      case 'swig-circuit': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Your Personalized Recommendations
        </CardTitle>
        
        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((recommendation) => {
              const TypeIcon = getTypeIcon(recommendation.type);
              const typeColor = getTypeColor(recommendation.type);
              
              return (
                <div key={recommendation.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 ${typeColor} text-white rounded`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{recommendation.title}</h4>
                          {recommendation.trending && (
                            <Badge variant="secondary" className="text-xs">
                              Trending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {recommendation.description}
                        </p>
                        <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                          {recommendation.reason}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissRecommendation(recommendation.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {recommendation.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {recommendation.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {recommendation.rating}
                      </span>
                    )}
                    {recommendation.distance && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {recommendation.distance}
                      </span>
                    )}
                    {recommendation.price && (
                      <span>{recommendation.price}</span>
                    )}
                    {recommendation.availability && (
                      <Badge 
                        variant={recommendation.availability === 'open' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {recommendation.availability}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant={recommendation.isSaved ? "default" : "outline"}
                      size="sm"
                      onClick={() => saveRecommendation(recommendation.id)}
                      className="flex items-center gap-1"
                    >
                      <Heart className={`h-4 w-4 ${recommendation.isSaved ? 'fill-current' : ''}`} />
                      {recommendation.isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareRecommendation(recommendation.id)}
                      className="flex items-center gap-1"
                    >
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Start exploring and interacting with venues to get personalized recommendations
            </p>
            <Button variant="outline" size="sm">
              Explore Venues
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;

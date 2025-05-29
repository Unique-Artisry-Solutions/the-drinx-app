
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Bookmark, 
  ExternalLink,
  Sparkles,
  Building,
  Coffee,
  Calendar
} from 'lucide-react';
import { Recommendation } from './types';

interface RecommendationsWidgetProps {
  recommendations: Recommendation[];
}

const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ recommendations }) => {
  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'establishment':
        return <Building className="h-4 w-4" />;
      case 'cocktail':
        return <Coffee className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'establishment':
        return 'bg-blue-100 text-blue-700';
      case 'cocktail':
        return 'bg-green-100 text-green-700';
      case 'event':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSave = (recommendationId: string) => {
    console.log('Saved recommendation:', recommendationId);
  };

  const handleView = (recommendationId: string) => {
    console.log('Viewed recommendation:', recommendationId);
  };

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recommendations yet</p>
            <p className="text-sm">Explore more to get personalized suggestions!</p>
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
          Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 4).map((recommendation) => (
            <div key={recommendation.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getTypeColor(recommendation.type)}>
                    {getTypeIcon(recommendation.type)}
                    <span className="ml-1 capitalize">{recommendation.type}</span>
                  </Badge>
                  {recommendation.isSaved && (
                    <Bookmark className="h-4 w-4 text-blue-500 fill-current" />
                  )}
                </div>
              </div>

              {recommendation.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={recommendation.imageUrl} 
                    alt={recommendation.title}
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-medium text-sm">{recommendation.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recommendation.description}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  {recommendation.reason}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  {recommendation.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{recommendation.rating}</span>
                    </div>
                  )}
                  {recommendation.distance && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-xs">{recommendation.distance}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(recommendation.id)}
                  className="flex-1"
                >
                  <Bookmark className="h-3 w-3 mr-1" />
                  {recommendation.isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleView(recommendation.id)}
                  className="flex-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>

              {recommendation.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {recommendation.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {recommendations.length > 4 && (
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Recommendations ({recommendations.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;


import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event';
  title: string;
  description: string;
  image?: string;
  rating?: number;
  distance?: string;
  reason: string;
}

interface PersonalizedRecommendationsProps {
  recommendations: Recommendation[];
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ recommendations }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'establishment': return 'bg-blue-100 text-blue-800';
      case 'cocktail': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            {rec.image && (
              <img 
                src={rec.image} 
                alt={rec.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge className={getTypeColor(rec.type)}>{rec.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <p className="text-xs text-blue-600 mb-2">{rec.reason}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {rec.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{rec.rating}</span>
                      </div>
                    )}
                    {rec.distance && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{rec.distance}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PersonalizedRecommendations;

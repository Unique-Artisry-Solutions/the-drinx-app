
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { PersonalizedRecommendation } from '@/hooks/usePersonalizedData';

interface RecommendationsWidgetProps {
  recommendations: PersonalizedRecommendation[];
}

const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ recommendations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recommended for You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                {rec.type === 'cocktail' ? '🍹' : '🏪'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{rec.name}</h3>
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                <div className="flex items-center gap-2 mt-2">
                  {rec.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{rec.rating}</span>
                    </div>
                  )}
                  {rec.distance && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{rec.distance}</span>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {rec.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;

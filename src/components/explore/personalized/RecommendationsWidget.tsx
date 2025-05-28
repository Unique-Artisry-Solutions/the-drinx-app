
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Recommendation {
  id: string;
  type: 'cocktail' | 'establishment' | 'event';
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  rating?: number;
  distance?: string;
  price?: string;
  href: string;
}

interface RecommendationsWidgetProps {
  recommendations: Recommendation[];
}

const RecommendationsWidget: React.FC<RecommendationsWidgetProps> = ({ 
  recommendations 
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cocktail':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'establishment':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'event':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recommended for You</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/explore">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.slice(0, 4).map((item) => (
          <div key={item.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            {item.image && (
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.subtitle}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs flex-shrink-0 ${getTypeColor(item.type)}`}
                >
                  {item.type}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  )}
                  {item.distance && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.distance}</span>
                    </div>
                  )}
                  {item.price && (
                    <span className="font-medium text-primary">{item.price}</span>
                  )}
                </div>
                
                <Button variant="ghost" size="sm" asChild className="text-xs h-auto p-1">
                  <Link to={item.href}>View</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendationsWidget;

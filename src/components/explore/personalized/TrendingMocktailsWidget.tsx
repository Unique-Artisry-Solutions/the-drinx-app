
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendingMocktail {
  id: string;
  name: string;
  establishment: string;
  rating: number;
  trend: 'rising' | 'hot' | 'new';
  image?: string;
  price?: string;
  description: string;
}

interface TrendingMocktailsWidgetProps {
  mocktails?: TrendingMocktail[];
}

const TrendingMocktailsWidget: React.FC<TrendingMocktailsWidgetProps> = ({ 
  mocktails = [] 
}) => {
  // Mock data for trending mocktails
  const trendingMocktails = mocktails.length > 0 ? mocktails : [
    {
      id: '1',
      name: 'Lavender Honey Fizz',
      establishment: 'The Dry Bar',
      rating: 4.9,
      trend: 'hot' as const,
      price: '$12',
      description: 'Refreshing blend of lavender, honey, and sparkling water'
    },
    {
      id: '2',
      name: 'Spiced Pear Mule',
      establishment: 'Spiritless Lounge',
      rating: 4.7,
      trend: 'rising' as const,
      price: '$10',
      description: 'Warming spices with fresh pear and ginger beer'
    },
    {
      id: '3',
      name: 'Cucumber Mint Cooler',
      establishment: 'Green Garden',
      rating: 4.8,
      trend: 'new' as const,
      price: '$9',
      description: 'Cool and refreshing with muddled cucumber and mint'
    }
  ];

  const getTrendBadge = (trend: string) => {
    const styles = {
      hot: 'bg-red-100 text-red-700 border-red-200',
      rising: 'bg-orange-100 text-orange-700 border-orange-200',
      new: 'bg-green-100 text-green-700 border-green-200',
    };
    const labels = {
      hot: '🔥 Hot',
      rising: '📈 Rising',
      new: '✨ New',
    };
    
    return (
      <Badge 
        variant="secondary" 
        className={`text-xs ${styles[trend as keyof typeof styles]}`}
      >
        {labels[trend as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Mocktails
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/explore">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingMocktails.slice(0, 3).map((mocktail) => (
          <div 
            key={mocktail.id} 
            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{mocktail.name}</h3>
                  <p className="text-xs text-muted-foreground">at {mocktail.establishment}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getTrendBadge(mocktail.trend)}
                  {mocktail.price && (
                    <span className="text-sm font-medium text-primary">{mocktail.price}</span>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-2">
                {mocktail.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{mocktail.rating}</span>
                </div>
                
                <Button variant="ghost" size="sm" asChild className="text-xs h-auto p-1">
                  <Link to={`/cocktail/${mocktail.id}`}>Try It</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TrendingMocktailsWidget;

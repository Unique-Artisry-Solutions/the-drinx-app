
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface DrinkHighlight {
  id: string;
  name: string;
  establishment: string;
  rating?: number;
  description?: string;
  price?: number;
  isSpecial?: boolean;
}

interface DrinkHighlightsProps {
  highlights: DrinkHighlight[];
}

const DrinkHighlights: React.FC<DrinkHighlightsProps> = ({ highlights }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {highlights.map((drink) => (
        <Card key={drink.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{drink.name}</CardTitle>
              {drink.isSpecial && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Special
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{drink.establishment}</p>
          </CardHeader>
          <CardContent>
            {drink.description && (
              <p className="text-sm text-gray-600 mb-3">{drink.description}</p>
            )}
            
            <div className="flex justify-between items-center">
              {drink.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{drink.rating}</span>
                </div>
              )}
              
              {drink.price && (
                <span className="font-semibold text-green-600">
                  ${drink.price.toFixed(2)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DrinkHighlights;

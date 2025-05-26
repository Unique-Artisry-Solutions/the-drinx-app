
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, GlassWater, Calendar, Search } from 'lucide-react';
import { QuickAction } from '@/hooks/usePersonalizedData';

interface QuickActionCardsProps {
  actions: QuickAction[];
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({ actions }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'map-pin':
        return MapPin;
      case 'glass-water':
        return GlassWater;
      case 'calendar':
        return Calendar;
      case 'search':
        return Search;
      default:
        return Search;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = getIcon(action.icon);
        
        return (
          <Card 
            key={action.id} 
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            onClick={action.action}
          >
            <CardContent className="p-6 text-center">
              <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActionCards;

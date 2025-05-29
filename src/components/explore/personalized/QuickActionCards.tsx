
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  PlusCircle, 
  Route, 
  Share2, 
  Users,
  Loader2
} from 'lucide-react';
import { QuickAction } from './types';
import { useEnhancedQuickActions } from '@/hooks/useEnhancedQuickActions';

interface QuickActionCardsProps {
  actions: QuickAction[];
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({ actions }) => {
  const { isLoading, handleActionClick } = useEnhancedQuickActions();

  const defaultActions: QuickAction[] = [
    {
      id: 'check-in',
      title: 'Check In Nearby',
      description: 'Find and check into establishments around you',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-blue-500',
      isEnabled: true,
      onClick: () => console.log('Check in nearby')
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Discover upcoming mocktail events',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-green-500',
      isEnabled: true,
      onClick: () => console.log('Find events')
    },
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share your mocktail creation',
      icon: <PlusCircle className="h-5 w-5" />,
      color: 'bg-purple-500',
      isEnabled: true,
      onClick: () => console.log('Create recipe')
    },
    {
      id: 'start-crawl',
      title: 'Start Bar Crawl',
      description: 'Plan your next adventure',
      icon: <Route className="h-5 w-5" />,
      color: 'bg-orange-500',
      isEnabled: true,
      badge: 'Popular',
      onClick: () => console.log('Start bar crawl')
    },
    {
      id: 'share-achievement',
      title: 'Share Achievement',
      description: 'Show off your latest milestone',
      icon: <Share2 className="h-5 w-5" />,
      color: 'bg-pink-500',
      isEnabled: true,
      onClick: () => console.log('Share achievement')
    },
    {
      id: 'find-friends',
      title: 'Find Friends',
      description: 'Connect with other mocktail enthusiasts',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-cyan-500',
      isEnabled: true,
      onClick: () => console.log('Find friends')
    }
  ];

  const actionsToShow = actions.length > 0 ? actions : defaultActions;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actionsToShow.map((action) => (
        <Card key={action.id} className="relative group hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full h-auto p-0 flex flex-col items-center gap-3 text-center"
              onClick={() => handleActionClick(action)}
              disabled={!action.isEnabled || isLoading === action.id}
            >
              <div className={`p-3 rounded-full text-white ${action.color || 'bg-gray-500'} group-hover:scale-110 transition-transform`}>
                {isLoading === action.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  action.icon
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium text-sm leading-tight">{action.title}</h3>
                <p className="text-xs text-muted-foreground leading-tight">
                  {action.description}
                </p>
              </div>
              
              {action.shortcut && (
                <Badge variant="outline" className="text-xs">
                  {action.shortcut}
                </Badge>
              )}
            </Button>
            
            {action.badge && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 text-xs"
              >
                {action.badge}
              </Badge>
            )}
            
            {action.recentlyUsed && (
              <div className="absolute top-2 left-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActionCards;

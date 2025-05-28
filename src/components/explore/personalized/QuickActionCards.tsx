
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useEnhancedQuickActions, EnhancedQuickAction } from '@/hooks/useEnhancedQuickActions';
import { OfflineService } from '@/services/OfflineService';
import { 
  MapPin, 
  Calendar, 
  Coffee, 
  Route, 
  Trophy, 
  Users, 
  Wifi, 
  WifiOff,
  Loader
} from 'lucide-react';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface QuickActionCardsProps {
  actions?: QuickAction[];
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ actions: propActions }) => {
  const { isLoading, handleActionClick, actions: enhancedActions } = useEnhancedQuickActions();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const defaultActions: EnhancedQuickAction[] = [
    {
      id: 'check-in',
      title: 'Check In Nearby',
      description: 'Find and check into nearby establishments',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-blue-500',
      isEnabled: true,
      requiresAuth: false,
      badge: 'Popular',
      shortcut: 'Ctrl+1',
      recentlyUsed: true,
      onClick: enhancedActions.checkInNearby
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Discover upcoming mocktail events',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-green-500',
      isEnabled: true,
      requiresAuth: false,
      badge: 'New',
      shortcut: 'Ctrl+2',
      recentlyUsed: false,
      onClick: enhancedActions.findEvents
    },
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share your mocktail creation',
      icon: <Coffee className="h-5 w-5" />,
      color: 'bg-purple-500',
      isEnabled: true,
      requiresAuth: true,
      shortcut: 'Ctrl+3',
      recentlyUsed: false,
      onClick: enhancedActions.createRecipe
    },
    {
      id: 'start-crawl',
      title: 'Start Bar Crawl',
      description: 'Begin a swig circuit adventure',
      icon: <Route className="h-5 w-5" />,
      color: 'bg-orange-500',
      isEnabled: true,
      requiresAuth: false,
      badge: 'Featured',
      shortcut: 'Ctrl+4',
      recentlyUsed: false,
      onClick: enhancedActions.startBarCrawl
    },
    {
      id: 'share-achievement',
      title: 'Share Achievement',
      description: 'Show off your latest milestone',
      icon: <Trophy className="h-5 w-5" />,
      color: 'bg-yellow-500',
      isEnabled: true,
      requiresAuth: true,
      shortcut: 'Ctrl+5',
      recentlyUsed: false,
      onClick: enhancedActions.shareAchievement
    },
    {
      id: 'find-friends',
      title: 'Find Friends',
      description: 'Connect with other mocktail enthusiasts',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-pink-500',
      isEnabled: true,
      requiresAuth: true,
      shortcut: 'Ctrl+6',
      recentlyUsed: false,
      onClick: enhancedActions.findFriends
    }
  ];

  const actions = propActions || defaultActions;

  const handleClick = async (action: EnhancedQuickAction) => {
    if (!isOnline && action.requiresAuth) {
      OfflineService.queueAction('quick_action', { actionId: action.id });
      return;
    }

    try {
      await handleActionClick(action);
      setCompletedActions(prev => new Set([...prev, action.id]));
      
      // Remove from completed after 3 seconds
      setTimeout(() => {
        setCompletedActions(prev => {
          const newSet = new Set(prev);
          newSet.delete(action.id);
          return newSet;
        });
      }, 3000);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  const getProgressValue = (actionId: string) => {
    if (isLoading === actionId) return 100;
    if (completedActions.has(actionId)) return 100;
    return 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
          {OfflineService.getQueuedActions().length > 0 && (
            <Badge variant="outline">
              {OfflineService.getQueuedActions().length} queued
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Card 
            key={action.id} 
            className={`relative overflow-hidden transition-all hover:scale-105 hover:shadow-lg ${
              !action.isEnabled ? 'opacity-50' : ''
            } ${action.recentlyUsed ? 'ring-2 ring-blue-200' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  {action.icon}
                </div>
                <div className="flex flex-col gap-1">
                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {action.badge}
                    </Badge>
                  )}
                  {action.shortcut && (
                    <Badge variant="outline" className="text-xs">
                      {action.shortcut}
                    </Badge>
                  )}
                </div>
              </div>
              
              <h4 className="font-medium mb-1">{action.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
              
              {(isLoading === action.id || completedActions.has(action.id)) && (
                <div className="mb-3">
                  <Progress 
                    value={getProgressValue(action.id)} 
                    className="h-2"
                  />
                </div>
              )}
              
              <Button
                onClick={() => handleClick(action)}
                disabled={!action.isEnabled || isLoading === action.id}
                className="w-full"
                size="sm"
              >
                {isLoading === action.id ? (
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {completedActions.has(action.id) ? 'Completed!' : 'Start'}
              </Button>
              
              {action.requiresAuth && !isOnline && (
                <p className="text-xs text-orange-600 mt-2">
                  Will sync when online
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

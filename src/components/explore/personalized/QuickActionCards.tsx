
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Camera, 
  User, 
  Search,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import { QuickAction } from './types';

interface QuickActionCardsProps {
  actions: QuickAction[];
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({ actions }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [actionQueue, setActionQueue] = useState<string[]>([]);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  // Enhanced actions with additional properties
  const enhancedActions: QuickAction[] = [
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share your latest mocktail creation',
      icon: <Plus className="h-5 w-5" />,
      onClick: () => handleAction('create-recipe'),
      color: 'bg-purple-500',
      isEnabled: true,
      recentlyUsed: false,
      badge: 'New',
      shortcut: 'Ctrl+N'
    },
    {
      id: 'find-nearby',
      title: 'Find Nearby',
      description: 'Discover establishments around you',
      icon: <MapPin className="h-5 w-5" />,
      onClick: () => handleAction('find-nearby'),
      color: 'bg-green-500',
      isEnabled: true,
      recentlyUsed: true,
      requiresAuth: false
    },
    {
      id: 'join-event',
      title: 'Join Event',
      description: 'Browse upcoming mocktail events',
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => handleAction('join-event'),
      color: 'bg-blue-500',
      isEnabled: true,
      recentlyUsed: false
    },
    {
      id: 'take-photo',
      title: 'Share Photo',
      description: 'Capture and share your experience',
      icon: <Camera className="h-5 w-5" />,
      onClick: () => handleAction('take-photo'),
      color: 'bg-orange-500',
      isEnabled: isOnline,
      recentlyUsed: false,
      badge: 'Popular'
    },
    {
      id: 'update-profile',
      title: 'Update Profile',
      description: 'Customize your preferences',
      icon: <User className="h-5 w-5" />,
      onClick: () => handleAction('update-profile'),
      color: 'bg-indigo-500',
      isEnabled: true,
      recentlyUsed: false,
      requiresAuth: true
    },
    {
      id: 'explore-more',
      title: 'Explore More',
      description: 'Discover new content and features',
      icon: <Search className="h-5 w-5" />,
      onClick: () => handleAction('explore-more'),
      color: 'bg-teal-500',
      isEnabled: true,
      recentlyUsed: false
    }
  ];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process queued actions when back online
      processQueuedActions();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAction = async (actionId: string) => {
    const action = enhancedActions.find(a => a.id === actionId);
    
    if (!action?.isEnabled) {
      console.log('Action disabled:', actionId);
      return;
    }

    if (!isOnline && action.requiresAuth !== false) {
      // Queue action for when online
      setActionQueue(prev => [...prev, actionId]);
      console.log('Action queued for when online:', actionId);
      return;
    }

    // Start processing
    setProcessingActions(prev => new Set([...prev, actionId]));
    
    try {
      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Execute the actual action
      action.onClick();
      
      console.log('Action completed:', actionId);
    } catch (error) {
      console.error('Action failed:', actionId, error);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  const processQueuedActions = async () => {
    if (actionQueue.length === 0) return;
    
    console.log('Processing queued actions:', actionQueue);
    
    for (const actionId of actionQueue) {
      await handleAction(actionId);
    }
    
    setActionQueue([]);
  };

  const getActionProgress = (actionId: string) => {
    if (processingActions.has(actionId)) return 75;
    if (actionQueue.includes(actionId)) return 25;
    return 0;
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Online</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">Offline</span>
            </div>
          )}
          
          {actionQueue.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {actionQueue.length} queued
            </Badge>
          )}
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {enhancedActions.map((action) => {
          const progress = getActionProgress(action.id);
          const isProcessing = processingActions.has(action.id);
          const isQueued = actionQueue.includes(action.id);

          return (
            <Card 
              key={action.id} 
              className={`relative transition-all duration-200 hover:shadow-md cursor-pointer ${
                !action.isEnabled ? 'opacity-50' : ''
              } ${action.recentlyUsed ? 'ring-2 ring-blue-200' : ''}`}
              onClick={() => handleAction(action.id)}
            >
              <CardContent className="p-4">
                {/* Action Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                    {action.recentlyUsed && (
                      <Badge variant="outline" className="text-xs">
                        Recent
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Content */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="mt-3">
                    <Progress value={progress} className="h-1" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {isProcessing ? 'Processing...' : isQueued ? 'Queued' : 'Complete'}
                    </div>
                  </div>
                )}

                {/* Keyboard Shortcut */}
                {action.shortcut && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="outline" className="text-xs">
                      {action.shortcut}
                    </Badge>
                  </div>
                )}

                {/* Offline Indicator */}
                {!isOnline && action.requiresAuth !== false && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="text-xs text-orange-600">
                      Offline
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Queued Actions Summary */}
      {actionQueue.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm text-orange-800">
              <Clock className="h-4 w-4" />
              {actionQueue.length} actions queued for when you're back online
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickActionCards;

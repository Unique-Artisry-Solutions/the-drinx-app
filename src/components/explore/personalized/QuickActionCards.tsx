
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, PlusCircle, Users, Share2, UserPlus, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnhancedQuickActions, EnhancedQuickAction } from '@/hooks/useEnhancedQuickActions';
import { OfflineService } from '@/services/OfflineService';

export interface QuickActionCardsProps {
  actions?: EnhancedQuickAction[];
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ actions: propActions }) => {
  const { isLoading, handleActionClick, actions } = useEnhancedQuickActions();

  const defaultActions: EnhancedQuickAction[] = [
    {
      id: 'check-in',
      title: 'Check In Nearby',
      description: 'Find and check into establishments around you',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      isEnabled: !OfflineService.isOffline(),
      badge: 'New',
      shortcut: '⌘+1',
      recentlyUsed: true,
      onClick: actions.checkInNearby
    },
    {
      id: 'find-events',
      title: 'Find Events',
      description: 'Discover upcoming events and activities',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      isEnabled: true,
      shortcut: '⌘+2',
      onClick: actions.findEvents
    },
    {
      id: 'create-recipe',
      title: 'Create Recipe',
      description: 'Share your own mocktail creation',
      icon: <PlusCircle className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      isEnabled: true,
      shortcut: '⌘+3',
      onClick: actions.createRecipe
    },
    {
      id: 'start-crawl',
      title: 'Start Bar Crawl',
      description: 'Begin a new bar crawling adventure',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      isEnabled: true,
      badge: 'Popular',
      onClick: actions.startBarCrawl
    },
    {
      id: 'share-achievement',
      title: 'Share Achievement',
      description: 'Celebrate your latest accomplishment',
      icon: <Share2 className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      isEnabled: true,
      onClick: actions.shareAchievement
    },
    {
      id: 'find-friends',
      title: 'Find Friends',
      description: 'Connect with other swig enthusiasts',
      icon: <UserPlus className="h-5 w-5" />,
      color: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      isEnabled: true,
      onClick: actions.findFriends
    }
  ];

  const displayActions = propActions || defaultActions;

  if (OfflineService.isOffline()) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Zap className="h-5 w-5" />
            Quick Actions (Offline Mode)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 text-sm">
            Some actions are unavailable while offline. They'll be available when you reconnect.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {displayActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className={`
                    relative h-auto p-4 flex flex-col items-start gap-3 text-left w-full
                    ${action.isEnabled 
                      ? 'hover:shadow-lg transition-all duration-300 hover:border-primary/50' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                    ${action.recentlyUsed ? 'border-primary/30 bg-primary/5' : ''}
                  `}
                  onClick={() => action.isEnabled && handleActionClick(action)}
                  disabled={!action.isEnabled || isLoading === action.id}
                >
                  {/* Badge */}
                  {action.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-1 text-xs animate-pulse"
                    >
                      {action.badge}
                    </Badge>
                  )}

                  {/* Icon with loading state */}
                  <div className={`
                    p-3 rounded-lg text-white transition-all duration-300
                    ${action.color}
                    ${isLoading === action.id ? 'animate-pulse' : ''}
                  `}>
                    {isLoading === action.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      action.icon
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      {action.shortcut && (
                        <kbd className="px-2 py-1 text-xs bg-muted rounded">
                          {action.shortcut}
                        </kbd>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  {/* Progress indicator for recently used */}
                  {action.recentlyUsed && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
                      <div className="h-full w-1/3 bg-primary rounded-r"></div>
                    </div>
                  )}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Offline queue indicator */}
        {OfflineService.getQueuedActions().length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
          >
            <p className="text-sm text-yellow-700">
              {OfflineService.getQueuedActions().length} action(s) queued for when you're back online
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActionCards;

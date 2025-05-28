
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { EnhancedQuickAction } from '@/hooks/useEnhancedQuickActions';

export interface QuickActionCardsProps {
  actions: EnhancedQuickAction[];
  onActionClick: (action: EnhancedQuickAction) => Promise<void>;
  isLoading: string | null;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  actions,
  onActionClick,
  isLoading
}) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={`relative h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all duration-200 ${
                !action.isEnabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${action.color ? 'border-2' : ''}`}
              onClick={() => action.isEnabled && onActionClick(action)}
              disabled={!action.isEnabled || isLoading === action.id}
            >
              {action.badge && (
                <Badge className="absolute -top-2 -right-2 text-xs">
                  {action.badge}
                </Badge>
              )}
              
              <div className={`p-2 rounded-full ${action.color || 'bg-gray-100'} text-white`}>
                {action.icon}
              </div>
              
              <div className="text-center">
                <div className="font-medium text-xs mb-1">{action.title}</div>
                <div className="text-xs text-muted-foreground leading-tight">
                  {action.description}
                </div>
              </div>
              
              {action.shortcut && (
                <Badge variant="secondary" className="text-xs">
                  {action.shortcut}
                </Badge>
              )}
              
              {isLoading === action.id && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

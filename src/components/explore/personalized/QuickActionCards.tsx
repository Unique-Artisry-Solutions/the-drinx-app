
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickAction } from '@/types/explore';

interface QuickActionCardsProps {
  actions?: QuickAction[];
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ actions = [] }) => {
  if (actions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No quick actions available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action) => (
        <Card key={action.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full h-auto flex flex-col gap-2 p-4"
              onClick={action.onClick}
              disabled={!action.isEnabled}
            >
              <div className={`p-3 rounded-lg ${action.color} text-white`}>
                {action.icon}
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActionCards;

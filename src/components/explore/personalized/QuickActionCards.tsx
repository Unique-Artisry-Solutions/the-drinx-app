
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Camera, Share } from 'lucide-react';

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

const defaultActions: QuickAction[] = [
  {
    id: 'add-recipe',
    title: 'Create Recipe',
    description: 'Share your mocktail creation',
    icon: <Plus className="h-5 w-5" />,
    onClick: () => console.log('Create recipe')
  },
  {
    id: 'find-places',
    title: 'Find Places',
    description: 'Discover nearby establishments',
    icon: <MapPin className="h-5 w-5" />,
    onClick: () => console.log('Find places')
  },
  {
    id: 'check-in',
    title: 'Check In',
    description: 'Log your visit',
    icon: <Camera className="h-5 w-5" />,
    onClick: () => console.log('Check in')
  },
  {
    id: 'share',
    title: 'Share Experience',
    description: 'Tell friends about your visit',
    icon: <Share className="h-5 w-5" />,
    onClick: () => console.log('Share')
  }
];

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ 
  actions = defaultActions 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={action.onClick}
            >
              {action.icon}
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

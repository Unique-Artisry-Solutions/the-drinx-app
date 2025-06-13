
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickAction } from '@/types/explore';
import { MapPin, Search, Plus, Users, Share, UserPlus, LucideIcon } from 'lucide-react';

// Icon mapping for converting string names to components
const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Search,
  Plus,
  Users,
  Share,
  UserPlus
};

interface QuickActionCardsProps {
  actions?: QuickAction[];
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  actions = []
}) => {
  if (actions.length === 0) {
    return <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No quick actions available
          </div>
        </CardContent>
      </Card>;
  }

  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      {actions.map(action => {
      const IconComponent = iconMap[action.iconName];
      return <Card key={action.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full h-auto flex flex-col gap-3 p-4" onClick={action.onClick} disabled={!action.isEnabled}>
                <div className={`p-3 rounded-lg ${action.color} text-white`}>
                  {IconComponent && <IconComponent className="h-6 w-6" />}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm leading-tight">{action.title}</div>
                  <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {action.description}
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>;
    })}
    </div>;
};

export default QuickActionCards;

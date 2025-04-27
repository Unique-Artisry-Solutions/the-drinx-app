
import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AchievementNotificationProps {
  title: string;
  description: string;
  type: 'tier' | 'badge' | 'reward';
}

export function AchievementNotification({ title, description, type }: AchievementNotificationProps) {
  const { toast } = useToast();

  const getIcon = () => {
    switch (type) {
      case 'tier':
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case 'badge':
        return <Award className="h-5 w-5 text-blue-500" />;
      case 'reward':
        return <Star className="h-5 w-5 text-purple-500" />;
    }
  };

  React.useEffect(() => {
    toast({
      // Fix: Instead of passing a JSX element directly to title, we'll use the description field
      title,
      description: (
        <div className="flex items-center gap-2">
          {getIcon()}
          <span>{description}</span>
        </div>
      ),
      duration: 5000,
    });
  }, []);

  return null;
}

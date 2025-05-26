
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Award, Zap, Star } from 'lucide-react';

interface UserStats {
  establishmentsVisited: number;
  cocktailsTried: number;
  currentStreak: number;
  totalPoints: number;
}

interface QuickStatsWidgetProps {
  stats: UserStats;
}

const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Places Visited',
      value: stats.establishmentsVisited,
      icon: MapPin,
      color: 'text-blue-600'
    },
    {
      label: 'Drinks Tried',
      value: stats.cocktailsTried,
      icon: Star,
      color: 'text-green-600'
    },
    {
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: Zap,
      color: 'text-orange-600'
    },
    {
      label: 'Points Earned',
      value: stats.totalPoints.toLocaleString(),
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QuickStatsWidget;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Heart, Star, TrendingUp } from 'lucide-react';
import { UserStats } from '@/hooks/usePersonalizedData';

interface QuickStatsWidgetProps {
  stats: UserStats;
}

const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({ stats }) => {
  const statItems = [
    {
      icon: MapPin,
      label: 'Total Visits',
      value: stats.totalVisits,
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Favorites',
      value: stats.favoriteEstablishments,
      color: 'text-red-600'
    },
    {
      icon: Star,
      label: 'Reviews',
      value: stats.reviewsWritten,
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      label: 'Avg Rating',
      value: stats.averageRating.toFixed(1),
      color: 'text-green-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item, index) => (
            <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
              <item.icon className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsWidget;

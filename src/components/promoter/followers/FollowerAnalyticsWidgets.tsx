
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFollowers } from '@/hooks/useFollowers';
import { Users, TrendingUp, Calendar, Activity } from 'lucide-react';

interface FollowerAnalyticsWidgetsProps {
  promoterId: string;
  detailed?: boolean;
}

const FollowerAnalyticsWidgets: React.FC<FollowerAnalyticsWidgetsProps> = ({ 
  promoterId, 
  detailed = false 
}) => {
  const { analytics, isLoading } = useFollowers(promoterId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const widgets = [
    {
      title: 'Total Followers',
      value: analytics.totalFollowers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'New Today',
      value: analytics.newToday.toLocaleString(),
      icon: Calendar,
      color: 'text-green-500'
    },
    {
      title: 'This Week',
      value: analytics.newThisWeek.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-500'
    },
    {
      title: 'Growth Rate',
      value: `${analytics.growthRate}%`,
      icon: Activity,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {widgets.map((widget, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {widget.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{widget.value}</div>
              <widget.icon className={`h-6 w-6 ${widget.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FollowerAnalyticsWidgets;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFollowers } from '@/hooks/useFollowers';
import { TrendingUp, Users, UserPlus, Activity } from 'lucide-react';

interface EnhancedFollowerAnalyticsProps {
  promoterId: string;
}

const EnhancedFollowerAnalytics: React.FC<EnhancedFollowerAnalyticsProps> = ({ promoterId }) => {
  const { followers, analytics, isLoading } = useFollowers(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div>Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: 'Total Followers',
      value: analytics?.totalFollowers || 0,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'New Today',
      value: analytics?.newToday || 0,
      icon: UserPlus,
      color: 'text-green-500'
    },
    {
      title: 'New This Week',
      value: analytics?.newThisWeek || 0,
      icon: Activity,
      color: 'text-orange-500'
    },
    {
      title: 'Growth Rate',
      value: `${analytics?.growthRate || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedFollowerAnalytics;

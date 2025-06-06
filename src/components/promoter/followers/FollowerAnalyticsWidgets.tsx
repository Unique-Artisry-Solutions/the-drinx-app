
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Users, TrendingUp, UserPlus, MessageCircle } from 'lucide-react';
import JourneyTrackingWidget from './JourneyTrackingWidget';
import EnhancedFollowerAnalytics from './EnhancedFollowerAnalytics';

interface FollowerAnalyticsWidgetsProps {
  promoterId: string;
  metrics?: ('total' | 'growth' | 'engagement' | 'journey' | 'detailed')[];
  detailed?: boolean;
}

const FollowerAnalyticsWidgets: React.FC<FollowerAnalyticsWidgetsProps> = ({
  promoterId,
  metrics = ['total', 'growth', 'engagement'],
  detailed = false
}) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalFollowers = followers?.length || 0;
  const recentFollowers = followers?.filter(f => {
    const followDate = new Date(f.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return followDate > sevenDaysAgo;
  }).length || 0;

  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;

  if (detailed) {
    return (
      <div className="space-y-6">
        <EnhancedFollowerAnalytics promoterId={promoterId} />
        <JourneyTrackingWidget promoterId={promoterId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.includes('total') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFollowers}</div>
              <p className="text-xs text-muted-foreground">
                {activeFollowers} active
              </p>
            </CardContent>
          </Card>
        )}

        {metrics.includes('growth') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentFollowers}</div>
              <p className="text-xs text-muted-foreground">
                New followers
              </p>
            </CardContent>
          </Card>
        )}

        {metrics.includes('engagement') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((activeFollowers / totalFollowers) * 100) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Active rate
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {metrics.includes('journey') && (
        <JourneyTrackingWidget promoterId={promoterId} />
      )}
    </div>
  );
};

export default FollowerAnalyticsWidgets;

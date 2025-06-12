
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useSimpleFollowers } from '@/hooks/useSimpleFollowers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react';

export const SubscribersTab: React.FC = () => {
  const { user } = useAuth();
  const promoterId = user?.id || 'mock-promoter-id';
  
  const { followers, analytics, isLoading } = useSimpleFollowers(promoterId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Follower Management</h2>
          <p className="text-muted-foreground">
            Manage your followers and track audience growth
          </p>
        </div>
        
        <Card>
          <CardContent className="flex justify-center py-6">
            <div>Loading follower data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Followers',
      value: analytics?.total_followers || 0,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'New Today',
      value: analytics?.new_followers_today || 0,
      icon: UserPlus,
      color: 'text-green-500'
    },
    {
      title: 'New This Week',
      value: analytics?.new_followers_week || 0,
      icon: Activity,
      color: 'text-orange-500'
    },
    {
      title: 'Growth Rate',
      value: `${analytics?.growth_percentage || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Follower Management</h2>
        <p className="text-muted-foreground">
          Track your follower analytics and manage your audience
        </p>
      </div>
      
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Followers</CardTitle>
        </CardHeader>
        <CardContent>
          {followers.length > 0 ? (
            <div className="space-y-2">
              {followers.slice(0, 5).map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">
                      {follower.follower_profile?.display_name || 
                       follower.follower_profile?.username || 
                       `Follower ${follower.follower_id.slice(0, 8)}...`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(follower.followed_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {followers.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  And {followers.length - 5} more followers...
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No followers yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

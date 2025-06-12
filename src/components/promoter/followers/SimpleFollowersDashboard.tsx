
import React from 'react';
import { useSimpleFollowers } from '@/hooks/useSimpleFollowers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react';

interface SimpleFollowersDashboardProps {
  promoterId: string;
}

const SimpleFollowersDashboard: React.FC<SimpleFollowersDashboardProps> = ({ promoterId }) => {
  const { followers, analytics, isLoading, removeFollower } = useSimpleFollowers(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-6">
          <div>Loading followers...</div>
        </CardContent>
      </Card>
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
      {/* Analytics Cards */}
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

      {/* Followers List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Followers</CardTitle>
        </CardHeader>
        <CardContent>
          {followers.length > 0 ? (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {follower.follower_profile?.display_name || 
                       follower.follower_profile?.username || 
                       `Follower ${follower.follower_id.slice(0, 8)}...`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Followed on: {new Date(follower.followed_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFollower.mutate(follower.follower_id)}
                    disabled={removeFollower.isPending}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No followers yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleFollowersDashboard;

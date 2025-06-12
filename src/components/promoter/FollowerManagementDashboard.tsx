
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFollowers } from '@/hooks/useFollowers';

interface FollowerManagementDashboardProps {
  promoterId: string;
}

const FollowerManagementDashboard: React.FC<FollowerManagementDashboardProps> = ({ promoterId }) => {
  const { followers, analytics, isLoading } = useFollowers(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Follower Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading followers...</div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: followers?.length || 0,
    active: followers?.filter(f => f.follow_status === 'active').length || 0,
    paused: followers?.filter(f => f.follow_status === 'paused').length || 0,
    cancelled: followers?.filter(f => f.follow_status === 'cancelled').length || 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower Management Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.paused}</div>
            <div className="text-sm text-muted-foreground">Paused</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.cancelled}</div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </div>
        </div>

        <div className="space-y-2">
          {followers?.slice(0, 5).map((follower) => (
            <div key={follower.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">
                  {follower.profiles?.display_name || 
                   follower.profiles?.username || 
                   `Follower ${follower.subscriber_id.slice(0, 8)}...`}
                </div>
                <div className="text-sm text-muted-foreground">
                  Joined: {new Date(follower.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  follower.follow_status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {follower.follow_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerManagementDashboard;

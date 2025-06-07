
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSimpleFollowers } from '@/hooks/useSimpleFollowers';
import { Users, TrendingUp, Calendar, Search, UserMinus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SimpleFollowersDashboardProps {
  promoterId: string;
}

const SimpleFollowersDashboard: React.FC<SimpleFollowersDashboardProps> = ({ promoterId }) => {
  const { followers, analytics, isLoading, removeFollower } = useSimpleFollowers(promoterId);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredFollowers = followers.filter(follower => {
    const displayName = follower.follower_profile?.display_name || '';
    const username = follower.follower_profile?.username || '';
    return displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{analytics?.total_followers || 0}</p>
                <p className="text-sm text-muted-foreground">Total Followers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{analytics?.new_followers_today || 0}</p>
                <p className="text-sm text-muted-foreground">New Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{analytics?.new_followers_week || 0}</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{analytics?.growth_percentage || 0}%</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follower Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Total followers are growing at {analytics?.growth_percentage || 0}% this week</span>
                  <Badge variant="outline">
                    {(analytics?.growth_percentage || 0) > 0 ? 'Growing' : 'Stable'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep posting engaging content to continue growing your follower base!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers" className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Followers List */}
          <Card>
            <CardHeader>
              <CardTitle>Followers ({filteredFollowers.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFollowers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No followers found matching your search.' : 'No followers yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFollowers.map((follower) => (
                    <div key={follower.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={follower.follower_profile?.avatar_url} />
                          <AvatarFallback>
                            {(follower.follower_profile?.display_name || follower.follower_profile?.username || 'U')[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {follower.follower_profile?.display_name || follower.follower_profile?.username || 'Anonymous User'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Followed {formatDistanceToNow(new Date(follower.followed_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFollower.mutate(follower.follower_id)}
                        disabled={removeFollower.isPending}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleFollowersDashboard;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Filter, Settings, MessageSquare } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FollowerCountWidget } from './FollowerCountWidget';
import { FollowerCommunication } from './FollowerCommunication';

interface FollowerManagementDashboardProps {
  promoterId: string;
}

export const FollowerManagementDashboard: React.FC<FollowerManagementDashboardProps> = ({ 
  promoterId 
}) => {
  const { subscriptions: followers, tiers, isLoading } = useSubscriptions(promoterId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredFollowers = followers.filter(follower => {
    const matchesSearch = !searchTerm || 
      follower.tier_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTier = filterTier === 'all' || 
      (filterTier === 'free' && !follower.tier_id) ||
      (filterTier === 'premium' && follower.tier_id) ||
      follower.tier_id === filterTier;
    
    return matchesSearch && matchesTier;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div>Loading follower data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Follower Management
          </h1>
          <p className="text-muted-foreground">
            Manage your followers and send targeted communications
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <FollowerCountWidget promoterId={promoterId} />

      <Tabs defaultValue="followers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Followers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search followers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterTier === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterTier('all')}
                  size="sm"
                >
                  All ({followers.length})
                </Button>
                <Button
                  variant={filterTier === 'free' ? 'default' : 'outline'}
                  onClick={() => setFilterTier('free')}
                  size="sm"
                >
                  Free ({followers.filter(f => !f.tier_id).length})
                </Button>
                <Button
                  variant={filterTier === 'premium' ? 'default' : 'outline'}
                  onClick={() => setFilterTier('premium')}
                  size="sm"
                >
                  Premium ({followers.filter(f => f.tier_id).length})
                </Button>
                {tiers.map(tier => (
                  <Button
                    key={tier.id}
                    variant={filterTier === tier.id ? 'default' : 'outline'}
                    onClick={() => setFilterTier(tier.id)}
                    size="sm"
                  >
                    {tier.name} ({followers.filter(f => f.tier_id === tier.id).length})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Followers List */}
          <Card>
            <CardHeader>
              <CardTitle>Followers ({filteredFollowers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFollowers.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No followers found matching your criteria.
                  </div>
                ) : (
                  filteredFollowers.map((follower) => (
                    <div
                      key={follower.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">Follower</div>
                          <div className="text-sm text-muted-foreground">
                            Followed {new Date(follower.subscription_start).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={follower.tier_id ? 'default' : 'secondary'}>
                          {follower.tier_id ? follower.tier_name || 'Premium' : 'Free'}
                        </Badge>
                        
                        <div className="flex gap-1">
                          {follower.notification_preferences.events && (
                            <Badge variant="outline" className="text-xs">Events</Badge>
                          )}
                          {follower.notification_preferences.promotions && (
                            <Badge variant="outline" className="text-xs">Promos</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <FollowerCommunication promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Follower Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Auto-follow Settings</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure how new followers are handled automatically.
                </p>
                <Button variant="outline">Configure Auto-follow</Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Default Notifications</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Set default notification preferences for new followers.
                </p>
                <Button variant="outline">Manage Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

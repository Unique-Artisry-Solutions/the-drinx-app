
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, MessageSquare, Users, TrendingUp, Bell } from 'lucide-react';
import FollowerList from '@/components/promoter/followers/FollowerList';
import FollowerAnalyticsWidgets from '@/components/promoter/followers/FollowerAnalyticsWidgets';
import FollowerNotificationCenter from '@/components/promoter/followers/FollowerNotificationCenter';
import FollowerSystemHealthMonitor from '@/components/promoter/followers/FollowerSystemHealthMonitor';
import { FollowerCountWidget } from '@/components/promoter/FollowerCountWidget';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const PromoterFollowersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('followers');
  
  // Mock promoter ID - in real implementation, this would come from auth context
  const promoterId = 'current-promoter';
  const { followers, isLoading } = useSubscriptions(promoterId);

  const totalFollowers = followers?.length || 0;
  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const notificationEnabledCount = followers?.filter(f => 
    f.notification_preferences?.events !== false
  ).length || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Follower Management</h1>
          <p className="text-muted-foreground">
            Manage and engage with your {totalFollowers.toLocaleString()} followers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FollowerSystemHealthMonitor promoterId={promoterId} />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Followers</div>
                <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Active Followers</div>
                <div className="text-2xl font-bold">{activeFollowers.toLocaleString()}</div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Notifications On</div>
                <div className="text-2xl font-bold">{notificationEnabledCount}</div>
              </div>
              <Bell className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Growth Rate</div>
                <div className="text-2xl font-bold">+12%</div>
              </div>
              <Badge variant="secondary" className="text-green-600">
                This Month
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="space-y-4">
          <FollowerList 
            promoterId={promoterId}
            searchTerm={searchTerm}
            showActions={true}
            className="mt-4"
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <FollowerAnalyticsWidgets 
              promoterId={promoterId} 
              detailed={true}
              className="mt-4"
            />
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Communication Center</CardTitle>
            </CardHeader>
            <CardContent>
              <FollowerNotificationCenter 
                promoterId={promoterId}
                followerCount={totalFollowers}
                allowScheduling={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Follower Management Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  Follower management settings will be available here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoterFollowersPage;

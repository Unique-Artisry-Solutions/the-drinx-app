
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { FollowerCountWidget } from '@/components/promoter/FollowerCountWidget';
import EnhancedFollowerList from '@/components/promoter/followers/EnhancedFollowerList';
import FollowerAnalyticsDashboard from '@/components/promoter/followers/FollowerAnalyticsDashboard';
import FollowerCommunicationHub from '@/components/promoter/followers/FollowerCommunicationHub';
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Calendar,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const PromoterFollowersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('followers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Mock promoter ID - in real implementation, this would come from auth context
  const promoterId = 'mock-promoter-id';
  
  const { followers, isLoading } = useSubscriptions(promoterId);

  // Calculate quick stats
  const totalFollowers = followers?.length || 0;
  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const notificationOptIns = followers?.filter(f => 
    f.notification_preferences?.events === true
  ).length || 0;
  
  // Calculate weekly growth
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newThisWeek = followers?.filter(f => 
    new Date(f.created_at) > weekAgo
  ).length || 0;
  
  const growthRate = totalFollowers > 0 ? ((newThisWeek / totalFollowers) * 100) : 0;

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    console.log(`Bulk ${action} for followers:`, selectedIds);
    // TODO: Implement bulk actions
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Followers</h1>
              <p className="text-muted-foreground">
                Manage and communicate with your {totalFollowers.toLocaleString()} followers
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Enhanced Follower Count Widget */}
          <FollowerCountWidget promoterId={promoterId} />
          
          {/* New Followers This Week */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">New This Week</div>
                  <div className="text-2xl font-bold">{newThisWeek}</div>
                  <div className="text-xs text-green-600">
                    +{growthRate.toFixed(1)}% growth
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                  <div className="text-2xl font-bold">
                    {totalFollowers > 0 ? ((notificationOptIns / totalFollowers) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-xs text-blue-600">Notifications enabled</div>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions (Mock) */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Active Sessions</div>
                  <div className="text-2xl font-bold">24</div>
                  <div className="text-xs text-purple-600">Online now</div>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search followers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Badge variant="secondary" className="cursor-pointer">
              Active Only
            </Badge>
            <Badge variant="outline" className="cursor-pointer">
              Premium
            </Badge>
          </div>
        </div>

        {/* Main Content - Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="followers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Followers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="communication" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Followers Tab */}
          <TabsContent value="followers">
            <EnhancedFollowerList
              promoterId={promoterId}
              searchTerm={searchTerm}
              onBulkAction={handleBulkAction}
              className="space-y-4"
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <FollowerAnalyticsDashboard promoterId={promoterId} />
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication">
            <FollowerCommunicationHub promoterId={promoterId} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Follower Management Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Configure default settings for follower interactions and preferences.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Auto-Welcome Messages</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Automatically send welcome messages to new followers
                        </p>
                        <Button variant="outline" size="sm">Configure</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Notification Preferences</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Set default notification settings for followers
                        </p>
                        <Button variant="outline" size="sm">Configure</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Export Settings</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Configure data export formats and schedules
                        </p>
                        <Button variant="outline" size="sm">Configure</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Privacy & Data</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Manage follower data retention and privacy settings
                        </p>
                        <Button variant="outline" size="sm">Configure</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterFollowersPage;

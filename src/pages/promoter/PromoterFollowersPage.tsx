import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Crown, 
  Bell, 
  TrendingUp, 
  Calendar,
  Heart,
  Clock,
  Download,
  Plus,
  Mail
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FollowerCountWidget } from '@/components/promoter/FollowerCountWidget';
import EnhancedFollowerList from '@/components/promoter/followers/EnhancedFollowerList';
import FollowerAnalyticsDashboard from '@/components/promoter/followers/FollowerAnalyticsDashboard';
import FollowerCommunicationHub from '@/components/promoter/followers/FollowerCommunicationHub';
import { useAuth } from '@/contexts/auth';

const PromoterFollowersPage: React.FC = () => {
  const { user } = useAuth();
  const promoterId = user?.id || 'current-promoter';
  const { followers, isLoading } = useSubscriptions(promoterId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('followers');
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);

  // Calculate stats
  const totalFollowers = followers?.length || 0;
  const activeSubscribers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const notificationOptIns = followers?.filter(f => f.notification_preferences?.events !== false).length || 0;
  const recentFollowers = followers?.filter(f => {
    const joinDate = new Date(f.created_at);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return joinDate > sevenDaysAgo;
  }).length || 0;

  // Mock growth rate calculation
  const growthRate = totalFollowers > 0 ? ((recentFollowers / totalFollowers) * 100).toFixed(1) : '0';

  const handleBulkMessage = () => {
    console.log('Sending bulk message to selected followers:', selectedFollowers);
    // TODO: Implement bulk messaging
  };

  const handleExportFollowers = () => {
    console.log('Exporting followers data');
    // TODO: Implement export functionality
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Followers Management</h1>
            <p className="text-muted-foreground">
              Manage your {totalFollowers.toLocaleString()} followers and grow your audience
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportFollowers}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleBulkMessage} disabled={selectedFollowers.length === 0}>
              <Mail className="h-4 w-4 mr-2" />
              Message Selected ({selectedFollowers.length})
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Followers</p>
                  <p className="text-2xl font-bold">{totalFollowers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Subscribers</p>
                  <p className="text-2xl font-bold">{activeSubscribers}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Notification Opt-ins</p>
                  <p className="text-2xl font-bold">{notificationOptIns}</p>
                </div>
                <Bell className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Growth Rate (7d)</p>
                  <p className="text-2xl font-bold">+{growthRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <FollowerCountWidget promoterId={promoterId} />
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New This Week</p>
                <p className="text-2xl font-bold">{recentFollowers}</p>
                <p className="text-xs text-green-600">+{recentFollowers} from last week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">73%</p>
                <p className="text-xs text-blue-600">+5% from last month</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Session</p>
                <p className="text-2xl font-bold">4.2m</p>
                <p className="text-xs text-purple-600">+0.3m from last week</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers by ID, name, or email..."
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
              <Badge variant="secondary">
                {totalFollowers} total
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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

        <TabsContent value="followers" className="space-y-4">
          <EnhancedFollowerList
            promoterId={promoterId}
            searchTerm={searchTerm}
            showActions={true}
            className="min-h-[400px]"
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <FollowerAnalyticsDashboard
            promoterId={promoterId}
            detailed={true}
            timeRange="month"
            metrics={['total', 'growth', 'engagement', 'notifications']}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Growth chart placeholder - Connect to actual analytics data
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Engagement metrics placeholder - Connect to actual analytics data
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <FollowerCommunicationHub
            promoterId={promoterId}
            className="space-y-4"
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-welcome message</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Send welcome message to new followers</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notification preferences</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Enable email notifications by default</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data retention</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Auto-remove inactive followers after 1 year</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">GDPR Compliance</label>
                  <p className="text-sm text-muted-foreground">
                    All follower data is stored securely and can be exported or deleted upon request.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Export</label>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Follower Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoterFollowersPage;

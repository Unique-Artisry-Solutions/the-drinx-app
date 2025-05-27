
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  TrendingUp, 
  Bell, 
  Search,
  Filter,
  Mail,
  MessageSquare,
  Download
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import FollowerAnalyticsWidgets from './FollowerAnalyticsWidgets';
import FollowerList from './FollowerList';
import FollowerNotificationCenter from './FollowerNotificationCenter';

interface FollowerDashboardProps {
  promoterId: string;
}

const FollowerDashboard: React.FC<FollowerDashboardProps> = ({ promoterId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { followers, isLoading } = useSubscriptions(promoterId);

  const totalFollowers = followers?.length || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading follower dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Follower Management</h2>
          <p className="text-muted-foreground">
            Manage your {totalFollowers.toLocaleString()} followers and engagement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Update
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <FollowerAnalyticsWidgets promoterId={promoterId} />

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>12 new followers today</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Event notification sent to 1.2k followers</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>95% engagement rate this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Create Event Alert
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Growth Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Follower Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Active followers</span>
                    <Badge variant="secondary">87%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Notification enabled</span>
                    <Badge variant="secondary">92%</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. engagement</span>
                    <Badge variant="secondary">4.2/5</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="followers" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <FollowerList promoterId={promoterId} searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="notifications">
          <FollowerNotificationCenter promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <FollowerAnalyticsWidgets promoterId={promoterId} detailed={true} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerDashboard;

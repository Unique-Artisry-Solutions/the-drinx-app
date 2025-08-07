import React, { useState } from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Gift, 
  Plus, 
  Search, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target
} from 'lucide-react';

const AdminRewardsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const pageConfig = {
    title: 'Rewards Management',
    description: 'Manage rewards programs, points, and user incentives',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Create Reward',
      icon: Plus,
      variant: 'default' as const,
      onClick: () => console.log('Create new reward')
    },
    {
      label: 'Export Data',
      icon: TrendingUp,
      variant: 'outline' as const,
      onClick: () => console.log('Export rewards data')
    }
  ];

  // Mock rewards data
  const rewardsStats = [
    { title: 'Total Points Issued', value: '125,847', icon: Award, change: '+12.5%' },
    { title: 'Active Rewards', value: '23', icon: Gift, change: '+2' },
    { title: 'Participating Users', value: '8,934', icon: Users, change: '+8.2%' },
    { title: 'Points Redeemed', value: '45,123', icon: Target, change: '+15.3%' }
  ];

  const activeRewards = [
    { 
      id: '1', 
      title: 'Welcome Bonus', 
      description: '100 points for new users',
      points: 100,
      status: 'active',
      claimed: 234,
      type: 'signup'
    },
    { 
      id: '2', 
      title: 'First Check-in', 
      description: '50 points for first establishment visit',
      points: 50,
      status: 'active',
      claimed: 156,
      type: 'checkin'
    },
    { 
      id: '3', 
      title: 'Review Reward', 
      description: '25 points for writing a review',
      points: 25,
      status: 'active',
      claimed: 89,
      type: 'review'
    },
    { 
      id: '4', 
      title: 'Social Share', 
      description: '15 points for sharing on social media',
      points: 15,
      status: 'paused',
      claimed: 67,
      type: 'social'
    }
  ];

  const recentRedemptions = [
    { user: 'John Doe', reward: 'Free Mocktail', points: 500, date: '2024-01-28' },
    { user: 'Jane Smith', reward: 'Discount 20%', points: 300, date: '2024-01-28' },
    { user: 'Bob Wilson', reward: 'Free Appetizer', points: 400, date: '2024-01-27' },
    { user: 'Alice Brown', reward: 'VIP Access', points: 1000, date: '2024-01-27' }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      paused: 'secondary',
      expired: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      signup: Users,
      checkin: Target,
      review: Award,
      social: Gift
    };
    const IconComponent = icons[type as keyof typeof icons] || Award;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewardsStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rewards Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rewards">Active Rewards</TabsTrigger>
            <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Points Distribution Rate</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Engagement</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Redemption Rate</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Points per User</span>
                      <span className="text-sm font-medium">347</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeRewards.slice(0, 3).map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(reward.type)}
                          <span className="text-sm font-medium">{reward.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reward.claimed} claims
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rewards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reward</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Claims</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reward.title}</div>
                            <div className="text-sm text-muted-foreground">{reward.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1 text-yellow-500" />
                            {reward.points}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeIcon(reward.type)} {reward.type}</TableCell>
                        <TableCell>{getStatusBadge(reward.status)}</TableCell>
                        <TableCell>{reward.claimed}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redemptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Redemptions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Points Used</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRedemptions.map((redemption, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{redemption.user}</TableCell>
                        <TableCell>{redemption.reward}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1 text-yellow-500" />
                            {redemption.points}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(redemption.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
};

export default AdminRewardsPage;
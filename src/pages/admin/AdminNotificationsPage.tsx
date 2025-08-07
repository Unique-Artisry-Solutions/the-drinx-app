import React, { useState } from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Plus, 
  Send, 
  Users, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminNotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const pageConfig = {
    title: 'Notifications Management',
    description: 'Manage system notifications, announcements, and user communications',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Create Notification',
      icon: Plus,
      variant: 'default' as const,
      onClick: () => console.log('Create notification')
    },
    {
      label: 'Send Broadcast',
      icon: Send,
      variant: 'outline' as const,
      onClick: () => console.log('Send broadcast')
    }
  ];

  const notificationStats = [
    { title: 'Total Sent', value: '12,847', icon: Bell, change: '+8.2%' },
    { title: 'Delivered', value: '12,156', icon: CheckCircle, change: '+7.9%' },
    { title: 'Pending', value: '156', icon: Clock, change: '-12%' },
    { title: 'Failed', value: '535', icon: AlertCircle, change: '+2.1%' }
  ];

  const recentNotifications = [
    {
      id: '1',
      title: 'System Maintenance Scheduled',
      content: 'Planned maintenance window on Sunday 2AM-4AM',
      type: 'system',
      status: 'sent',
      recipients: 1247,
      created: '2024-01-28T10:30:00Z'
    },
    {
      id: '2', 
      title: 'New Feature: Cocktail Favorites',
      content: 'Users can now save their favorite cocktails',
      type: 'feature',
      status: 'draft',
      recipients: 0,
      created: '2024-01-28T09:15:00Z'
    },
    {
      id: '3',
      title: 'Weekly Happy Hour Reminder',
      content: 'Don\'t miss out on happy hour specials this week',
      type: 'promotional',
      status: 'scheduled',
      recipients: 8934,
      created: '2024-01-27T16:45:00Z'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      draft: 'secondary', 
      scheduled: 'outline',
      failed: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      system: 'bg-blue-100 text-blue-800',
      feature: 'bg-green-100 text-green-800',
      promotional: 'bg-purple-100 text-purple-800',
      announcement: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors] || colors.announcement}`}>
        {type}
      </span>
    );
  };

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notificationStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last week
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Notifications Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notifications">All Notifications</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Delivery Rate</span>
                      <span className="text-sm font-medium">94.6%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open Rate</span>
                      <span className="text-sm font-medium">68.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Click Rate</span>
                      <span className="text-sm font-medium">12.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Unsubscribe Rate</span>
                      <span className="text-sm font-medium">0.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm">System Alerts</span>
                      </div>
                      <span className="text-sm text-muted-foreground">847</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">Promotional</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2,156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Announcements</span>
                      </div>
                      <span className="text-sm text-muted-foreground">634</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground">{notification.content}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(notification.type)}</TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell>{notification.recipients.toLocaleString()}</TableCell>
                        <TableCell>{new Date(notification.created).toLocaleDateString()}</TableCell>
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

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Template Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Create and manage reusable notification templates for consistent messaging.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageLayout>
  );
};

export default AdminNotificationsPage;
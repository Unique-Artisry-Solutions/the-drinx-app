import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Users, Shield, Bell, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminCommunicationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');

  // Mock data for demonstration
  const mockAlerts = [
    {
      id: '1',
      type: 'critical',
      title: 'Database Connection Issues',
      message: 'Multiple connection timeouts detected',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: '2', 
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Server memory usage at 85%',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true
    }
  ];

  const mockReports = [
    {
      id: '1',
      type: 'user_report',
      title: 'Inappropriate Content Report',
      reporter: 'user@example.com',
      message: 'User reported inappropriate venue photos',
      timestamp: new Date().toISOString(),
      isRead: false
    }
  ];

  const AlertsTab = () => (
    <div className="space-y-4 p-4">
      {mockAlerts.map((alert) => (
        <Card key={alert.id} className={cn(
          "border-l-4",
          alert.type === 'critical' ? "border-l-red-500" : "border-l-yellow-500"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={cn(
                    "h-4 w-4",
                    alert.type === 'critical' ? "text-red-500" : "text-yellow-500"
                  )} />
                  <h4 className="font-medium">{alert.title}</h4>
                  {!alert.isRead && (
                    <Badge variant="destructive" className="text-xs">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Resolve
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-4 p-4">
      {mockReports.map((report) => (
        <Card key={report.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">{report.title}</h4>
                  {!report.isRead && (
                    <Badge variant="default" className="text-xs">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  Reporter: {report.reporter}
                </p>
                <p className="text-sm text-muted-foreground mb-2">{report.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(report.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
                <Button variant="destructive" size="sm">
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ModerationTab = () => (
    <div className="p-4 text-center text-muted-foreground">
      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No items in moderation queue</h3>
      <p className="text-sm">Content moderation items will appear here when reported</p>
    </div>
  );

  const NotificationsTab = () => (
    <div className="p-4 text-center text-muted-foreground">
      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">No system notifications</h3>
      <p className="text-sm">System notifications and announcements will appear here</p>
    </div>
  );

  return (
    <div className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between p-4">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="alerts" className="text-xs">
                Alerts
                <Badge variant="destructive" className="ml-1 text-xs">3</Badge>
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs">Reports</TabsTrigger>
              <TabsTrigger value="moderation" className="text-xs">Moderation</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="alerts" className="m-0 h-full">
            <AlertsTab />
          </TabsContent>
          <TabsContent value="reports" className="m-0 h-full">
            <ReportsTab />
          </TabsContent>
          <TabsContent value="moderation" className="m-0 h-full">
            <ModerationTab />
          </TabsContent>
          <TabsContent value="notifications" className="m-0 h-full">
            <NotificationsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminCommunicationView;
import React from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Building2, FileBarChart2, Bell, Shield } from 'lucide-react';

const AdminSystemOverviewPage: React.FC = () => {
  const pageConfig = {
    title: 'System Overview',
    description: 'Complete overview of system health, performance, and key metrics',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const systemMetrics = [
    { title: 'Total Users', value: '12,847', icon: Users, change: '+5.2%' },
    { title: 'Active Establishments', value: '328', icon: Building2, change: '+2.1%' },
    { title: 'System Uptime', value: '99.9%', icon: Activity, change: '0.0%' },
    { title: 'Daily Transactions', value: '1,543', icon: FileBarChart2, change: '+12.3%' },
    { title: 'Pending Notifications', value: '23', icon: Bell, change: '-8.1%' },
    { title: 'Security Alerts', value: '2', icon: Shield, change: '+1' }
  ];

  return (
    <AdminPageLayout config={pageConfig}>
      <div className="space-y-6">
        {/* System Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Gateway</span>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Storage</span>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Authentication</span>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Admin user</span> updated system configuration
                  <div className="text-xs text-muted-foreground">2 minutes ago</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">System</span> completed daily backup
                  <div className="text-xs text-muted-foreground">1 hour ago</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">User #2847</span> registered new establishment
                  <div className="text-xs text-muted-foreground">3 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminSystemOverviewPage;
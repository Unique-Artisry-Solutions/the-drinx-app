import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, AlertTriangle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminPageLayout } from '@/components/admin/layout';
import AdminCommunicationView from '@/components/admin/communication/AdminCommunicationView';

const AdminAllActionsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const pageConfig = {
    title: 'All Actions',
    description: 'Manage all pending admin items and system communications',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Back to Dashboard',
      onClick: handleBackToDashboard,
      variant: 'outline' as const
    }
  ];

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">System Alerts</span>
                </div>
                <Badge variant="destructive">3 pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Critical system issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">User Reports</span>
                </div>
                <Badge variant="secondary">0 pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                User-reported issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Moderation</span>
                </div>
                <Badge variant="secondary">0 pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Content moderation queue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Analytics</span>
                </div>
                <Badge variant="secondary">Review</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                System performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Communication Section - Full Width */}
        <div className="space-y-4">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Communications
              </CardTitle>
              <CardDescription>
                Monitor system alerts, user reports, and internal communications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-80px)]">
              <AdminCommunicationView />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default AdminAllActionsPage;
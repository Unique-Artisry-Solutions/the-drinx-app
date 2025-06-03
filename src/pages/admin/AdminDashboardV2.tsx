
import React from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { AdminAnalyticsDashboard } from '@/components/admin/examples/AdminAnalyticsDashboard';
import { AdminTablesShowcase } from '@/components/admin/examples/AdminTablesShowcase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Database, Settings } from 'lucide-react';

const AdminDashboardV2: React.FC = () => {
  const pageConfig = {
    title: 'Admin Dashboard V2',
    description: 'Unified admin system with consistent APIs and reusable components',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const pageActions = [
    {
      label: 'Export Data',
      onClick: () => {
        console.log('Export all data');
      }
    },
    {
      label: 'System Settings',
      icon: Settings,
      onClick: () => {
        console.log('Open system settings');
      }
    }
  ];

  return (
    <AdminPageLayout config={pageConfig} actions={pageActions}>
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Dashboard
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Data Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AdminAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="data">
          <AdminTablesShowcase />
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default AdminDashboardV2;

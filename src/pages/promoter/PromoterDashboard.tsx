
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { DashboardWidgets } from '@/components/promoter/DashboardWidgets';
import { QuickActions } from '@/components/promoter/QuickActions';
import { DashboardOverviewTab } from '@/components/promoter/dashboard/DashboardOverviewTab';
import { DashboardPricingTab } from '@/components/promoter/dashboard/DashboardPricingTab';
import { DashboardUrgencyTab } from '@/components/promoter/dashboard/DashboardUrgencyTab';
import { DashboardAnalyticsTab } from '@/components/promoter/dashboard/DashboardAnalyticsTab';
import { DashboardPredictiveAnalyticsTab } from '@/components/promoter/dashboard/DashboardPredictiveAnalyticsTab';
import DashboardReportingTab from '@/components/promoter/dashboard/DashboardReportingTab';
import { DashboardSettingsTab } from '@/components/promoter/dashboard/DashboardSettingsTab';

const PromoterDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock promoter ID - in real implementation, this would come from auth context
  const promoterId = "promoter-123";

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Promoter Dashboard</h1>
          <p className="text-muted-foreground">Monitor your events and promotional campaigns in real-time</p>
        </div>
        <Button onClick={() => navigate('/promoter/events')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Dynamic Pricing</TabsTrigger>
          <TabsTrigger value="urgency">Urgency Features</TabsTrigger>
          <TabsTrigger value="analytics">Real-Time Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="reporting">Reporting Suite</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverviewTab promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <DashboardPricingTab promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="urgency" className="space-y-6">
          <DashboardUrgencyTab promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DashboardAnalyticsTab promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <DashboardPredictiveAnalyticsTab promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <DashboardReportingTab promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <DashboardSettingsTab promoterId={promoterId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoterDashboard;

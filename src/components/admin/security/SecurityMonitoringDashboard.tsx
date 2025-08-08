import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Activity, FileText, Target } from 'lucide-react';
import { PaymentMonitoringTab } from './tabs/PaymentMonitoringTab';
import { FailurePatternTab } from './tabs/FailurePatternTab';
import { RateLimitTab } from './tabs/RateLimitTab';
import { SuspiciousActivityTab } from './tabs/SuspiciousActivityTab';
import { ComplianceAuditTab } from './tabs/ComplianceAuditTab';
import { SecurityOverviewTab } from './tabs/SecurityOverviewTab';
import { useSecurityAlerts } from '@/hooks/useSecurityAlerts';

const SecurityMonitoringDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { alerts, criticalCount, warningCount } = useSecurityAlerts();

  const SecurityHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Security Monitoring Dashboard
        </h2>
        <p className="text-muted-foreground mt-2">
          Real-time security monitoring, fraud detection, and compliance tracking
        </p>
      </div>
      <div className="flex items-center gap-4">
        {criticalCount > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {criticalCount} Critical
          </Badge>
        )}
        {warningCount > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            {warningCount} Warnings
          </Badge>
        )}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 text-green-500" />
          Live Monitoring Active
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SecurityHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="limits" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Rate Limits
          </TabsTrigger>
          <TabsTrigger value="suspicious" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Suspicious
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SecurityOverviewTab />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentMonitoringTab />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <FailurePatternTab />
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <RateLimitTab />
        </TabsContent>

        <TabsContent value="suspicious" className="space-y-6">
          <SuspiciousActivityTab />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceAuditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityMonitoringDashboard;
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Activity, 
  GitBranch, 
  Shield, 
  RefreshCw,
  TrendingUp,
  Database,
  AlertTriangle
} from 'lucide-react';

import { useSystemBreakdown } from './hooks/useSystemBreakdown';
import { useEnhancedSystemData } from './hooks/useEnhancedSystemData';
import SystemHealthCheck from './components/SystemHealthCheck';
import SystemMetricsDashboard from './components/SystemMetricsDashboard';
import ResourceManagementPanel from './components/ResourceManagementPanel';
import DependencyVisualization from './components/DependencyVisualization';
import RiskAssessmentPanel from './components/RiskAssessmentPanel';
import { DashboardOverviewTab } from './dashboard/DashboardOverviewTab';
import { DashboardAnalyticsTab } from './dashboard/DashboardAnalyticsTab';
import { DashboardFeatureTab } from './dashboard/DashboardFeatureTab';

const SystemBreakdownContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    adminFeatures,
    establishmentFeatures,
    individualFeatures,
    promoterFeatures,
    progressHistory,
    monthlyProgressData,
    currentSnapshot,
    dataValidation,
    handleLogout,
    handleExportCSV,
    handleAnalyzeFeatures,
    handleCreateReleaseFromFeatures
  } = useSystemBreakdown();

  const { data: enhancedData, isLoading, refreshData } = useEnhancedSystemData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading system data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Functionality Breakdown</h1>
          <p className="text-muted-foreground">
            Comprehensive system analysis with real-time monitoring and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-600">
            System Healthy
          </Badge>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            Export Data
          </Button>
        </div>
      </div>

      {/* System Health Check */}
      <div className="mb-6">
        <SystemHealthCheck 
          dataValidation={dataValidation} 
          currentSnapshot={currentSnapshot} 
        />
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Dependencies
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Assessment
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardOverviewTab
            adminFeatures={adminFeatures}
            establishmentFeatures={establishmentFeatures}
            individualFeatures={individualFeatures}
            promoterFeatures={promoterFeatures}
            progressHistory={progressHistory}
            monthlyProgressData={monthlyProgressData}
            currentSnapshot={currentSnapshot}
          />
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <SystemMetricsDashboard
            performanceMetrics={enhancedData.performanceMetrics}
            userEngagement={enhancedData.userEngagement}
            qualityMetrics={enhancedData.qualityMetrics}
          />
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <ResourceManagementPanel resourceData={enhancedData.resourceData} />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-6">
          <DependencyVisualization
            dependencies={enhancedData.dependencies}
            technicalDebt={enhancedData.technicalDebt}
            changeImpact={enhancedData.changeImpact}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <RiskAssessmentPanel
            riskFactors={enhancedData.riskFactors}
            complianceItems={enhancedData.complianceItems}
            earlyWarnings={enhancedData.earlyWarnings}
          />
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <DashboardFeatureTab
            adminFeatures={adminFeatures}
            establishmentFeatures={establishmentFeatures}
            individualFeatures={individualFeatures}
            promoterFeatures={promoterFeatures}
            onAnalyzeFeatures={handleAnalyzeFeatures}
            onCreateRelease={handleCreateReleaseFromFeatures}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DashboardAnalyticsTab
            adminFeatures={adminFeatures}
            establishmentFeatures={establishmentFeatures}
            individualFeatures={individualFeatures}
            promoterFeatures={promoterFeatures}
            progressHistory={progressHistory}
            monthlyProgressData={monthlyProgressData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemBreakdownContent;

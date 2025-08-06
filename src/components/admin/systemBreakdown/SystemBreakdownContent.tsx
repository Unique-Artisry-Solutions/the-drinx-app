import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSystemBreakdown } from './hooks/useSystemBreakdown';
import { useFeatureStatus } from './hooks/useFeatureStatus';
import SystemHeader from './SystemHeader';
import EnhancedFeatureTab from './EnhancedFeatureTab';
import { ImplementationStats } from './components/dashboard/ImplementationStats';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { CategoryMetrics } from './components/dashboard/CategoryMetrics';
import { calculateFeatureStatistics } from './utils/featureStatistics';
import ErrorBoundary from './components/ErrorBoundary';

const SystemBreakdownContent: React.FC = () => {
  const systemData = useSystemBreakdown();
  const featureData = useFeatureStatus();
  
  // Calculate comprehensive statistics
  const allFeatures = [
    ...featureData.adminFeatures,
    ...featureData.establishmentFeatures,
    ...featureData.individualFeatures,
    ...featureData.promoterFeatures
  ];
  
  const stats = calculateFeatureStatistics(allFeatures);
  
  const overviewData = {
    implementedFeatures: stats.implementedFeatures,
    inProgressFeatures: stats.inProgressFeatures,
    plannedFeatures: stats.plannedFeatures,
    blockedFeatures: stats.blockedFeatures || 0,
    overallProgressPercentage: stats.implementationRate,
    confidenceScore: stats.confidenceScore
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
      <SystemHeader
        onAnalyzeFeatures={systemData.handleAnalyzeFeatures}
        onExportCSV={systemData.handleExportCSV}
        analyzing={systemData.analyzing}
      />

      <Tabs value={systemData.activeTab} onValueChange={systemData.setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            Overview ({allFeatures.length})
          </TabsTrigger>
          <TabsTrigger value="admin">
            Admin ({featureData.adminFeatures.length})
          </TabsTrigger>
          <TabsTrigger value="establishment">
            Establishment ({featureData.establishmentFeatures.length})
          </TabsTrigger>
          <TabsTrigger value="individual">
            Individual ({featureData.individualFeatures.length})
          </TabsTrigger>
          <TabsTrigger value="promoter">
            Promoter ({featureData.promoterFeatures.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Implementation Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardHeader 
                  overallProgressPercentage={overviewData.overallProgressPercentage}
                  confidenceScore={overviewData.confidenceScore}
                />
                
                <ImplementationStats
                  implementedFeatures={overviewData.implementedFeatures}
                  partialFeatures={0}
                  plannedFeatures={overviewData.plannedFeatures}
                  blockedFeatures={overviewData.blockedFeatures}
                  totalFeatures={allFeatures.length}
                />
                
                <Progress 
                  value={overviewData.overallProgressPercentage} 
                  className="w-full h-3 mb-4" 
                />
                
                <CategoryMetrics
                  adminFeatures={featureData.adminFeatures}
                  establishmentFeatures={featureData.establishmentFeatures}
                  individualFeatures={featureData.individualFeatures}
                  promoterFeatures={featureData.promoterFeatures}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {overviewData.implementedFeatures}
                  </div>
                  <div className="text-sm text-gray-500">Implemented</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {overviewData.inProgressFeatures}
                  </div>
                  <div className="text-sm text-gray-500">In Progress</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {overviewData.plannedFeatures}
                  </div>
                  <div className="text-sm text-gray-500">Planned</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {overviewData.blockedFeatures}
                  </div>
                  <div className="text-sm text-gray-500">Blocked</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    System Operational
                  </Badge>
                  <span className="text-sm text-gray-500">
                    All core systems functioning normally
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admin">
          <EnhancedFeatureTab
            features={featureData.adminFeatures}
            title="Admin Features"
            userType="admin"
          />
        </TabsContent>

        <TabsContent value="establishment">
          <EnhancedFeatureTab
            features={featureData.establishmentFeatures}
            title="Establishment Features"
            userType="establishment"
          />
        </TabsContent>

        <TabsContent value="individual">
          <EnhancedFeatureTab
            features={featureData.individualFeatures}
            title="Individual Features"
            userType="individual"
          />
        </TabsContent>

        <TabsContent value="promoter">
          <EnhancedFeatureTab
            features={featureData.promoterFeatures}
            title="Promoter Features"
            userType="promoter"
          />
        </TabsContent>
      </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default SystemBreakdownContent;

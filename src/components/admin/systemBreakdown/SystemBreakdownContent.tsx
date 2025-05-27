
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Activity, GitBranch, Shield, RefreshCw, TrendingUp, Database } from 'lucide-react';
import { useEnhancedSystemBreakdown } from './hooks/useEnhancedSystemBreakdown';
import { useEnhancedSystemData } from './hooks/useEnhancedSystemData';
import SystemHealthCheck from './components/SystemHealthCheck';
import EnhancedFeatureTab from './EnhancedFeatureTab';

const SystemBreakdownContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    adminFeatures, 
    establishmentFeatures, 
    individualFeatures, 
    promoterFeatures,
    totalFeatures,
    implementedFeaturesCount,
    averageImplementationProgress,
    progressHistory, 
    monthlyProgressData, 
    currentSnapshot, 
    dataValidation, 
    handleLogout, 
    handleExportCSV, 
    handleAnalyzeFeatures, 
    handleCreateReleaseFromFeatures 
  } = useEnhancedSystemBreakdown();

  const { data: enhancedData, isLoading, refreshData } = useEnhancedSystemData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading comprehensive system data...</span>
        </div>
      </div>
    );
  }

  const totalFeatures = adminFeatures.length + establishmentFeatures.length + individualFeatures.length + promoterFeatures.length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Functionality Breakdown</h1>
          <p className="text-muted-foreground">
            Comprehensive system analysis with real-time monitoring and analytics
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="text-blue-600">
              {totalFeatures} Total Features
            </Badge>
            <Badge variant="outline" className="text-green-600">
              {implementedFeaturesCount} Implemented
            </Badge>
            <Badge variant="outline" className="text-purple-600">
              {averageImplementationProgress}% Average Progress
            </Badge>
          </div>
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

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Admin Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminFeatures.length}</div>
            <p className="text-xs text-muted-foreground">
              {adminFeatures.filter(f => f.status === 'implemented').length} implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              Establishment Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{establishmentFeatures.length}</div>
            <p className="text-xs text-muted-foreground">
              {establishmentFeatures.filter(f => f.status === 'implemented').length} implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              User Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{individualFeatures.length}</div>
            <p className="text-xs text-muted-foreground">
              {individualFeatures.filter(f => f.status === 'implemented').length} implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Promoter Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promoterFeatures.length}</div>
            <p className="text-xs text-muted-foreground">
              {promoterFeatures.filter(f => f.status === 'implemented').length} implemented
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health Check */}
      <div className="mb-6">
        <SystemHealthCheck 
          dataValidation={dataValidation}
          currentSnapshot={currentSnapshot}
        />
      </div>

      {/* Enhanced Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admin">Admin ({adminFeatures.length})</TabsTrigger>
          <TabsTrigger value="establishment">Establishments ({establishmentFeatures.length})</TabsTrigger>
          <TabsTrigger value="individual">Users ({individualFeatures.length})</TabsTrigger>
          <TabsTrigger value="promoter">Promoters ({promoterFeatures.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Progress</span>
                    <span className="font-bold">{averageImplementationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${averageImplementationProgress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Database Health</span>
                    <Badge variant="outline" className="text-green-600">Excellent</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>API Performance</span>
                    <Badge variant="outline" className="text-green-600">Optimal</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Status</span>
                    <Badge variant="outline" className="text-green-600">Secure</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admin">
          <EnhancedFeatureTab 
            features={adminFeatures} 
            title="Administrator Features" 
            userType="admin"
          />
        </TabsContent>

        <TabsContent value="establishment">
          <EnhancedFeatureTab 
            features={establishmentFeatures} 
            title="Establishment Features" 
            userType="establishment"
          />
        </TabsContent>

        <TabsContent value="individual">
          <EnhancedFeatureTab 
            features={individualFeatures} 
            title="Individual User Features" 
            userType="individual"
          />
        </TabsContent>

        <TabsContent value="promoter">
          <EnhancedFeatureTab 
            features={promoterFeatures} 
            title="Promoter Features" 
            userType="promoter"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemBreakdownContent;

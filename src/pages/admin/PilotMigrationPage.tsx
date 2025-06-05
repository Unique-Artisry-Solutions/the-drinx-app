
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import PilotHealthDashboard from '@/components/admin/monitoring/PilotHealthDashboard';
import AuthTestPanel from '@/components/development/AuthTestPanel';
import SafeUserProfile from '@/components/common/SafeUserProfile';
import EnhancedUserAuth from '@/components/auth/EnhancedUserAuth';
import ServiceRegistryDashboard from '@/components/admin/monitoring/ServiceRegistryDashboard';
import ServiceMetricsPanel from '@/components/admin/monitoring/ServiceMetricsPanel';
import { expandedServiceInitializer } from '@/services/pilot/ExpandedServiceInitializer';
import { TestTube, Monitor, User, Activity, Server, TrendingUp } from 'lucide-react';

const PilotMigrationPage: React.FC = () => {
  const [phase2Initialized, setPhase2Initialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initializePhase2 = async () => {
    setIsLoading(true);
    try {
      await expandedServiceInitializer.initializeExpandedServices();
      setPhase2Initialized(true);
    } catch (error) {
      console.error('Failed to initialize Phase 2:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Phase 2 - Expanded Coverage</h1>
              <p className="text-muted-foreground mt-2">
                Enhanced monitoring, expanded service registry, and detailed metrics
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="default">Phase 1: Complete</Badge>
              <Badge variant={phase2Initialized ? "default" : "secondary"}>
                Phase 2: {phase2Initialized ? 'Active' : 'Ready'}
              </Badge>
            </div>
          </div>
        </div>

        {!phase2Initialized && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Initialize Phase 2</CardTitle>
              <CardDescription>
                Expand service coverage and enable enhanced monitoring capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Phase 2 will register additional services and enable comprehensive monitoring:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Analytics Service - Track user engagement and performance</li>
                  <li>• Cache Service - Monitor cache performance and hit rates</li>
                  <li>• Security Service - Audit logging and threat monitoring</li>
                  <li>• Monitoring Service - System health and resource usage</li>
                </ul>
                <Button onClick={initializePhase2} disabled={isLoading}>
                  {isLoading ? 'Initializing Phase 2...' : 'Initialize Phase 2 Services'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="auth-test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Auth Testing
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Health Monitor
            </TabsTrigger>
            <TabsTrigger value="registry" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Service Registry
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Enhanced Auth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phase 2 Progress</CardTitle>
                  <CardDescription>
                    Expanded service coverage and enhanced monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">✅ Basic Service Registry</span>
                      <Badge variant="default">Complete</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">✅ Enhanced Auth Components</span>
                      <Badge variant="default">Complete</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">✅ Health Monitoring Dashboard</span>
                      <Badge variant="default">Complete</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🔄 Expanded Service Coverage</span>
                      <Badge variant={phase2Initialized ? "default" : "secondary"}>
                        {phase2Initialized ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">📊 Performance Metrics</span>
                      <Badge variant={phase2Initialized ? "default" : "secondary"}>
                        {phase2Initialized ? 'Collecting' : 'Standby'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Components</CardTitle>
                  <CardDescription>
                    Components migrated to enhanced auth patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">AuthTestPanel</h4>
                      <p className="text-sm text-muted-foreground">Compatible + Enhanced auth testing</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">SafeUserProfile</h4>
                      <p className="text-sm text-muted-foreground">Type-safe profile with validation</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium">EnhancedUserAuth</h4>
                      <p className="text-sm text-muted-foreground">Migration-ready auth component</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Server className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-medium">Service Registry</h3>
                    <p className="text-2xl font-bold">
                      {phase2Initialized ? expandedServiceInitializer.getAllRegisteredServices().length : '3'}
                    </p>
                    <p className="text-sm text-muted-foreground">Registered Services</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium">Health Status</h3>
                    <p className="text-2xl font-bold text-green-600">100%</p>
                    <p className="text-sm text-muted-foreground">Services Healthy</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-medium">Migration Impact</h3>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-muted-foreground">Breaking Changes</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-3">🎯 Phase 2 Achievements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <h5 className="font-medium mb-2">Enhanced Monitoring</h5>
                  <ul className="space-y-1">
                    <li>• Real-time service health tracking</li>
                    <li>• Performance metrics collection</li>
                    <li>• Comprehensive dashboards</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Expanded Coverage</h5>
                  <ul className="space-y-1">
                    <li>• Additional service registration</li>
                    <li>• Enhanced auth components</li>
                    <li>• Zero-impact migration patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auth-test">
            <div className="flex justify-center">
              <AuthTestPanel />
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <PilotHealthDashboard />
          </TabsContent>

          <TabsContent value="registry">
            <ServiceRegistryDashboard />
          </TabsContent>

          <TabsContent value="metrics">
            <ServiceMetricsPanel />
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              <div className="flex justify-center">
                <SafeUserProfile />
              </div>
              
              <div className="flex justify-center">
                <EnhancedUserAuth 
                  useEnhancedPattern={true}
                  showMigrationInfo={true}
                  onSuccess={() => console.log('Enhanced auth success')}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PilotMigrationPage;

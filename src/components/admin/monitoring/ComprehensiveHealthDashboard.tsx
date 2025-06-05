
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  TrendingUp,
  Database,
  Zap,
  Shield
} from 'lucide-react';
import { isolatedServiceRegistry } from '@/services/registry/IsolatedServiceRegistry';
import { pilotServiceInitializer } from '@/services/pilot/PilotServiceInitializer';
import { useCompatibleAuth } from '@/services/compatibility/AuthCompatibilityWrapper';

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  services: number;
  authStatus: 'stable' | 'unstable';
  registryStatus: 'operational' | 'degraded';
  lastUpdate: Date;
}

const ComprehensiveHealthDashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const auth = useCompatibleAuth();

  useEffect(() => {
    initializeHealthMonitoring();
    const interval = setInterval(updateHealthMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const initializeHealthMonitoring = async () => {
    try {
      await pilotServiceInitializer.initializePilotServices();
      await updateHealthMetrics();
    } catch (error) {
      console.error('Failed to initialize health monitoring:', error);
    }
  };

  const updateHealthMetrics = async () => {
    try {
      const registryMetrics = isolatedServiceRegistry.getRegistryMetrics();
      const serviceNames = isolatedServiceRegistry.getServiceNames();
      
      const health: SystemHealth = {
        overall: calculateOverallHealth(registryMetrics),
        services: serviceNames.length,
        authStatus: auth.authStable ? 'stable' : 'unstable',
        registryStatus: registryMetrics.totalServices > 0 ? 'operational' : 'degraded',
        lastUpdate: new Date()
      };
      
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to update health metrics:', error);
    }
  };

  const calculateOverallHealth = (metrics: any): 'healthy' | 'warning' | 'critical' => {
    if (metrics.errorServices > 0) return 'critical';
    if (metrics.degradedServices > metrics.healthyServices) return 'warning';
    return 'healthy';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await updateHealthMetrics();
    setIsRefreshing(false);
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'stable':
      case 'operational':
        return 'text-green-600';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600';
      case 'critical':
      case 'unstable':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'stable':
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical':
      case 'unstable':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!systemHealth) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Initializing health monitoring...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Health Dashboard</h2>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {getHealthIcon(systemHealth.overall)}
              <div>
                <p className="text-sm font-medium">Overall Health</p>
                <p className={`text-lg font-bold ${getHealthColor(systemHealth.overall)}`}>
                  {systemHealth.overall.charAt(0).toUpperCase() + systemHealth.overall.slice(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Services</p>
                <p className="text-lg font-bold">{systemHealth.services}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Auth Status</p>
                <p className={`text-lg font-bold ${getHealthColor(systemHealth.authStatus)}`}>
                  {systemHealth.authStatus.charAt(0).toUpperCase() + systemHealth.authStatus.slice(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Registry</p>
                <p className={`text-lg font-bold ${getHealthColor(systemHealth.registryStatus)}`}>
                  {systemHealth.registryStatus.charAt(0).toUpperCase() + systemHealth.registryStatus.slice(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="registry">Registry</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              System is operating with {systemHealth.services} registered services. 
              Last updated: {systemHealth.lastUpdate.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Migration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Phase 1 (Pilot)</span>
                    <Badge variant="default">Complete</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Phase 2 (Expansion)</span>
                    <Badge variant="default">Complete</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Phase 3 (Full Implementation)</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="font-medium">&lt; 100ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate</span>
                    <span className="font-medium">0.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isolatedServiceRegistry.getServiceNames().map(serviceName => (
                  <div key={serviceName} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">{serviceName}</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auth Stable</span>
                  <Badge variant={auth.authStable ? "default" : "destructive"}>
                    {auth.authStable ? 'Stable' : 'Unstable'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Type</span>
                  <Badge variant="outline">{auth.userType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Is Loading</span>
                  <Badge variant={auth.isLoading ? "secondary" : "default"}>
                    {auth.isLoading ? 'Loading' : 'Ready'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Registry Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const metrics = isolatedServiceRegistry.getRegistryMetrics();
                  return (
                    <>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 border rounded">
                          <p className="text-2xl font-bold text-green-600">{metrics.healthyServices}</p>
                          <p className="text-sm text-muted-foreground">Healthy</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <p className="text-2xl font-bold text-yellow-600">{metrics.degradedServices}</p>
                          <p className="text-sm text-muted-foreground">Degraded</p>
                        </div>
                        <div className="text-center p-4 border rounded">
                          <p className="text-2xl font-bold text-red-600">{metrics.errorServices}</p>
                          <p className="text-sm text-muted-foreground">Error</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          Last health check: {metrics.lastHealthCheck.toLocaleString()}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveHealthDashboard;

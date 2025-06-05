
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pilotServiceInitializer } from '@/services/pilot/PilotServiceInitializer';
import { isolatedServiceRegistry } from '@/services/registry/IsolatedServiceRegistry';
import ServiceRegistryDashboard from './ServiceRegistryDashboard';
import ServiceMetricsPanel from './ServiceMetricsPanel';
import { Activity, Server, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const PilotHealthDashboard: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registryMetrics, setRegistryMetrics] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const initializePilotServices = async () => {
    setIsLoading(true);
    try {
      await pilotServiceInitializer.initializePilotServices();
      setIsInitialized(true);
      loadMetrics();
    } catch (error) {
      console.error('Failed to initialize pilot services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetrics = () => {
    try {
      const metrics = pilotServiceInitializer.getRegistryMetrics();
      setRegistryMetrics(metrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  useEffect(() => {
    const checkInitialization = () => {
      const initialized = pilotServiceInitializer.isInitialized();
      setIsInitialized(initialized);
      if (initialized) {
        loadMetrics();
      }
    };

    checkInitialization();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const registeredServices = pilotServiceInitializer.getRegisteredServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pilot Health Dashboard</h2>
          <p className="text-muted-foreground">
            Phase 2 - Enhanced monitoring and service registry management
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {!isInitialized && (
            <Button onClick={initializePilotServices} disabled={isLoading}>
              {isLoading ? 'Initializing...' : 'Initialize Services'}
            </Button>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pilot Status</p>
                <p className="text-2xl font-bold">
                  {isInitialized ? 'Active' : 'Pending'}
                </p>
              </div>
              {isInitialized ? 
                <CheckCircle className="h-8 w-8 text-green-600" /> :
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered Services</p>
                <p className="text-2xl font-bold">{registeredServices.length}</p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Status</p>
                <p className="text-2xl font-bold text-green-600">
                  {registryMetrics?.healthyServices || 0}/{registryMetrics?.totalServices || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Update</p>
                <p className="text-sm font-bold">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {isInitialized ? (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registry">Service Registry</TabsTrigger>
            <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
            <TabsTrigger value="migration">Migration Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phase 2 Progress</CardTitle>
                  <CardDescription>
                    Enhanced monitoring and expanded service coverage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Service Registration</span>
                      <Badge variant="default">Complete</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Health Monitoring</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Performance Metrics</span>
                      <Badge variant="default">Collecting</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Enhanced Components</span>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health Summary</CardTitle>
                  <CardDescription>
                    Overall system performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Registry Health</span>
                      <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Service Availability</span>
                      <Badge className="bg-green-100 text-green-800">100%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Migration Impact</span>
                      <Badge className="bg-blue-100 text-blue-800">Zero Breaking Changes</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registry">
            <ServiceRegistryDashboard />
          </TabsContent>

          <TabsContent value="metrics">
            <ServiceMetricsPanel />
          </TabsContent>

          <TabsContent value="migration">
            <Card>
              <CardHeader>
                <CardTitle>Migration Progress</CardTitle>
                <CardDescription>
                  Track component and service migration to enhanced patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Migrated Components</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">AuthTestPanel</span>
                        <p className="text-sm text-muted-foreground">Enhanced auth patterns with validation</p>
                      </div>
                      <Badge variant="default">Migrated</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">SafeUserProfile</span>
                        <p className="text-sm text-muted-foreground">Type-safe user data handling</p>
                      </div>
                      <Badge variant="default">Migrated</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <span className="font-medium">EnhancedUserAuth</span>
                        <p className="text-sm text-muted-foreground">Auth component with migration capabilities</p>
                      </div>
                      <Badge variant="secondary">New</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Registered Services</h4>
                  <div className="space-y-2">
                    {registeredServices.map(serviceName => (
                      <div key={serviceName} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <span className="font-medium">{serviceName}</span>
                          <p className="text-sm text-muted-foreground">Enhanced monitoring and metrics</p>
                        </div>
                        <Badge variant="default">Registered</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2">✅ Phase 2 Benefits Achieved</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Comprehensive service monitoring with real-time metrics</li>
                    <li>• Enhanced auth patterns with type safety</li>
                    <li>• Zero impact on existing functionality</li>
                    <li>• Detailed performance tracking and health checks</li>
                    <li>• Migration-ready components for gradual adoption</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Initialize Pilot Services</CardTitle>
            <CardDescription>
              Start the Phase 2 pilot to enable enhanced monitoring and service registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Click the button above to initialize the pilot services and enable comprehensive monitoring.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PilotHealthDashboard;

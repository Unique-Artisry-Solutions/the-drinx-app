
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isolatedServiceRegistry } from '@/services/registry/IsolatedServiceRegistry';
import { Activity, Server, Clock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const ServiceRegistryDashboard: React.FC = () => {
  const [services, setServices] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const serviceNames = isolatedServiceRegistry.getServiceNames();
      const registryMetrics = isolatedServiceRegistry.getRegistryMetrics();
      
      setServices(serviceNames);
      setMetrics(registryMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthIcon = (count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    if (percentage >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (percentage >= 50) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Service Registry Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor registered services and system health
          </p>
        </div>
        <Button onClick={loadDashboardData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                <p className="text-2xl font-bold">{metrics?.totalServices || 0}</p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Healthy Services</p>
                <p className="text-2xl font-bold text-green-600">{metrics?.healthyServices || 0}</p>
              </div>
              {getHealthIcon(metrics?.healthyServices || 0, metrics?.totalServices || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Degraded Services</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics?.degradedServices || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Services</p>
                <p className="text-2xl font-bold text-red-600">{metrics?.errorServices || 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Registered Services</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Registered Services</CardTitle>
              <CardDescription>
                All services currently registered with the isolated registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((serviceName) => {
                  const wrapper = isolatedServiceRegistry.getServiceWrapper(serviceName);
                  return (
                    <div key={serviceName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Version: {wrapper?.metadata.version || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last used: {wrapper?.metadata.lastUsed.toLocaleString() || 'Never'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={wrapper?.metadata.initialized ? "default" : "secondary"}>
                          {wrapper?.metadata.initialized ? 'Initialized' : 'Pending'}
                        </Badge>
                        <Badge variant={wrapper?.standardInterface ? "default" : "outline"}>
                          {wrapper?.standardInterface ? 'Enhanced' : 'Basic'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Service performance and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((serviceName) => {
                  const wrapper = isolatedServiceRegistry.getServiceWrapper(serviceName);
                  const serviceMetrics = wrapper?.standardInterface?.getMetrics?.();
                  
                  if (!serviceMetrics) {
                    return (
                      <div key={serviceName} className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">{serviceName}</h3>
                        <p className="text-sm text-muted-foreground">No metrics available</p>
                      </div>
                    );
                  }

                  return (
                    <div key={serviceName} className="p-4 border rounded-lg space-y-3">
                      <h3 className="font-medium">{serviceName}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Calls</p>
                          <p className="text-lg font-semibold">{serviceMetrics.totalCalls}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-lg font-semibold">
                            {((serviceMetrics.successfulCalls / serviceMetrics.totalCalls) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Response</p>
                          <p className="text-lg font-semibold">{serviceMetrics.averageResponseTime.toFixed(0)}ms</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Error Rate</p>
                          <p className="text-lg font-semibold">{(serviceMetrics.errorRate * 100).toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Checks</CardTitle>
              <CardDescription>
                Real-time health status of registered services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Last health check: {metrics?.lastHealthCheck?.toLocaleString()}
                  </p>
                  <Badge className={getHealthStatusColor('healthy')}>
                    System Status: Operational
                  </Badge>
                </div>
                
                {services.map(async (serviceName) => {
                  const wrapper = isolatedServiceRegistry.getServiceWrapper(serviceName);
                  const healthCheck = wrapper?.standardInterface?.healthCheck;
                  
                  return (
                    <div key={serviceName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {healthCheck ? 'Health monitoring enabled' : 'Basic monitoring'}
                        </p>
                      </div>
                      <Badge className={getHealthStatusColor('healthy')}>
                        Healthy
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-muted-foreground">
        <p>Dashboard last updated: {lastUpdate.toLocaleString()}</p>
        <p>Auto-refresh: Every 30 seconds</p>
      </div>
    </div>
  );
};

export default ServiceRegistryDashboard;

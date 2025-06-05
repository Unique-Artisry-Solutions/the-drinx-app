
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isolatedServiceRegistry } from '@/services/registry/IsolatedServiceRegistry';
import { useServiceRegistry } from '@/hooks/useServiceRegistry';
import { Activity, CheckCircle, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

interface ServiceHealthData {
  name: string;
  isHealthy: boolean;
  lastCheck: Date;
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  responseTime?: number;
  metrics?: {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    averageResponseTime: number;
    lastUsed: Date;
    errorRate: number;
  };
}

const ServiceRegistryDashboard: React.FC = () => {
  const [services, setServices] = useState<ServiceHealthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const serviceRegistry = useServiceRegistry();

  const refreshServiceData = async () => {
    setIsLoading(true);
    try {
      const serviceNames = isolatedServiceRegistry.getServiceNames();
      const serviceData: ServiceHealthData[] = [];

      for (const serviceName of serviceNames) {
        const wrapper = isolatedServiceRegistry.getServiceWrapper(serviceName);
        if (wrapper) {
          let healthData: ServiceHealthData = {
            name: serviceName,
            isHealthy: true,
            lastCheck: new Date(),
            status: 'healthy'
          };

          // Get health check if available
          if (wrapper.standardInterface?.healthCheck) {
            try {
              const health = await wrapper.standardInterface.healthCheck();
              healthData = {
                ...healthData,
                isHealthy: health.isHealthy,
                status: health.status,
                responseTime: health.responseTime
              };
            } catch (error) {
              healthData = {
                ...healthData,
                isHealthy: false,
                status: 'error'
              };
            }
          }

          // Get metrics if available
          if (wrapper.standardInterface?.getMetrics) {
            try {
              const metrics = wrapper.standardInterface.getMetrics();
              healthData.metrics = metrics;
            } catch (error) {
              console.warn(`Failed to get metrics for ${serviceName}:`, error);
            }
          }

          serviceData.push(healthData);
        }
      }

      setServices(serviceData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh service data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshServiceData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const registryMetrics = isolatedServiceRegistry.getRegistryMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Service Registry Dashboard</h2>
        <Button 
          onClick={refreshServiceData} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Registry Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Registry Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{registryMetrics.totalServices}</div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{registryMetrics.healthyServices}</div>
              <div className="text-sm text-gray-600">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{registryMetrics.degradedServices}</div>
              <div className="text-sm text-gray-600">Degraded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{registryMetrics.errorServices}</div>
              <div className="text-sm text-gray-600">Error</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Tabs defaultValue="services" className="w-full">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading service data...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.name}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        <h3 className="font-semibold">{service.name}</h3>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Health</div>
                        <div className={service.isHealthy ? 'text-green-600' : 'text-red-600'}>
                          {service.isHealthy ? 'Healthy' : 'Unhealthy'}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div>{service.responseTime ? `${service.responseTime.toFixed(1)}ms` : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="font-medium">Last Check</div>
                        <div>{service.lastCheck.toLocaleTimeString()}</div>
                      </div>
                      <div>
                        <div className="font-medium">Error Rate</div>
                        <div>{service.metrics ? `${(service.metrics.errorRate * 100).toFixed(2)}%` : 'N/A'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4">
            {services.filter(s => s.metrics).map((service) => (
              <Card key={service.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    {service.name} Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {service.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Total Calls</div>
                        <div className="text-lg">{service.metrics.totalCalls}</div>
                      </div>
                      <div>
                        <div className="font-medium">Successful</div>
                        <div className="text-lg text-green-600">{service.metrics.successfulCalls}</div>
                      </div>
                      <div>
                        <div className="font-medium">Failed</div>
                        <div className="text-lg text-red-600">{service.metrics.failedCalls}</div>
                      </div>
                      <div>
                        <div className="font-medium">Avg Response</div>
                        <div className="text-lg">{service.metrics.averageResponseTime.toFixed(1)}ms</div>
                      </div>
                      <div>
                        <div className="font-medium">Error Rate</div>
                        <div className="text-lg">{(service.metrics.errorRate * 100).toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Last Used</div>
                        <div className="text-lg">{service.metrics.lastUsed.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceRegistryDashboard;

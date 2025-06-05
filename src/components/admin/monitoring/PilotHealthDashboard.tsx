
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isolatedServiceRegistry } from '@/services/registry/IsolatedServiceRegistry';
import { pilotServiceInitializer } from '@/services/pilot/PilotServiceInitializer';
import { RefreshCw, Activity, CheckCircle, AlertCircle, Clock, BarChart } from 'lucide-react';

interface ServiceHealth {
  name: string;
  isHealthy: boolean;
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  responseTime?: number;
  lastCheck: Date;
}

interface ServiceMetrics {
  name: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageResponseTime: number;
  errorRate: number;
  lastUsed: Date;
}

const PilotHealthDashboard: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceHealth, setServiceHealth] = useState<ServiceHealth[]>([]);
  const [serviceMetrics, setServiceMetrics] = useState<ServiceMetrics[]>([]);
  const [registryMetrics, setRegistryMetrics] = useState<any>(null);

  const initializePilot = async () => {
    if (isInitialized) return;
    
    setIsLoading(true);
    try {
      await pilotServiceInitializer.initializePilotServices();
      setIsInitialized(true);
      await refreshData();
    } catch (error) {
      console.error('Failed to initialize pilot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const serviceNames = isolatedServiceRegistry.getServiceNames();
      const healthData: ServiceHealth[] = [];
      const metricsData: ServiceMetrics[] = [];

      // Get health and metrics for each service
      for (const serviceName of serviceNames) {
        const wrapper = isolatedServiceRegistry.getServiceWrapper(serviceName);
        if (wrapper?.standardInterface) {
          // Get health check
          if (wrapper.standardInterface.healthCheck) {
            const health = await wrapper.standardInterface.healthCheck();
            healthData.push({
              name: serviceName,
              isHealthy: health.isHealthy,
              status: health.status,
              responseTime: health.responseTime,
              lastCheck: health.lastCheck
            });
          }

          // Get metrics
          if (wrapper.standardInterface.getMetrics) {
            const metrics = wrapper.standardInterface.getMetrics();
            metricsData.push({
              name: serviceName,
              ...metrics
            });
          }
        }
      }

      setServiceHealth(healthData);
      setServiceMetrics(metricsData);
      setRegistryMetrics(isolatedServiceRegistry.getRegistryMetrics());

    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  useEffect(() => {
    if (pilotServiceInitializer.isInitialized()) {
      setIsInitialized(true);
      refreshData();
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Pilot Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            {!isInitialized ? (
              <Button onClick={initializePilot} disabled={isLoading}>
                {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Activity className="h-4 w-4 mr-2" />}
                Initialize Pilot Services
              </Button>
            ) : (
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            )}
            
            <Badge variant={isInitialized ? "default" : "secondary"}>
              {isInitialized ? 'Pilot Active' : 'Not Initialized'}
            </Badge>
          </div>

          {registryMetrics && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{registryMetrics.totalServices}</p>
                  <p className="text-sm text-gray-600">Total Services</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{registryMetrics.healthyServices}</p>
                  <p className="text-sm text-gray-600">Healthy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{registryMetrics.degradedServices}</p>
                  <p className="text-sm text-gray-600">Degraded</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{registryMetrics.errorServices}</p>
                  <p className="text-sm text-gray-600">Error</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {isInitialized && (
        <Tabs defaultValue="health" className="w-full">
          <TabsList>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Service Health
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Performance Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            {serviceHealth.map((service) => (
              <Card key={service.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-gray-600">
                          Last check: {service.lastCheck.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {service.responseTime && (
                        <Badge variant="outline">
                          {service.responseTime.toFixed(0)}ms
                        </Badge>
                      )}
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            {serviceMetrics.map((service) => (
              <Card key={service.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Calls</p>
                      <p className="text-xl font-semibold">{service.totalCalls}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-xl font-semibold text-green-600">
                        {((service.successfulCalls / service.totalCalls) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Response</p>
                      <p className="text-xl font-semibold">{service.averageResponseTime.toFixed(0)}ms</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Failed Calls</p>
                      <p className="text-xl font-semibold text-red-600">{service.failedCalls}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Error Rate</p>
                      <p className="text-xl font-semibold text-red-600">
                        {(service.errorRate * 100).toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Used</p>
                      <p className="text-sm">{service.lastUsed.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pilot Phase 1: Testing useCompatibleAuth() migration and isolated service registry
            </p>
            <p className="text-xs text-gray-500 mt-1">
              All changes are additive and don't affect existing functionality
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PilotHealthDashboard;

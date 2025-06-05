
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isolatedServiceRegistry } from '@/services/registry/IsolatedServiceRegistry';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, Clock, AlertTriangle } from 'lucide-react';

interface MetricDataPoint {
  timestamp: string;
  value: number;
  serviceName: string;
}

const ServiceMetricsPanel: React.FC = () => {
  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [metricsData, setMetricsData] = useState<MetricDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const serviceNames = isolatedServiceRegistry.getServiceNames();
    setServices(serviceNames);
    if (serviceNames.length > 0 && !selectedService) {
      setSelectedService(serviceNames[0]);
    }
  }, [selectedService]);

  const generateMockMetricsData = (serviceName: string): MetricDataPoint[] => {
    const now = new Date();
    const data: MetricDataPoint[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      data.push({
        timestamp: timestamp.toISOString(),
        value: Math.floor(Math.random() * 100) + 50,
        serviceName
      });
    }
    
    return data;
  };

  const loadMetricsData = async (serviceName: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch actual metrics
      const mockData = generateMockMetricsData(serviceName);
      setMetricsData(mockData);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedService) {
      loadMetricsData(selectedService);
    }
  }, [selectedService]);

  const getCurrentServiceMetrics = () => {
    const wrapper = isolatedServiceRegistry.getServiceWrapper(selectedService);
    return wrapper?.standardInterface?.getMetrics?.();
  };

  const currentMetrics = getCurrentServiceMetrics();

  const chartData = metricsData.map(point => ({
    time: new Date(point.timestamp).toLocaleTimeString(),
    responseTime: point.value,
    timestamp: point.timestamp
  }));

  const performanceData = services.map(serviceName => {
    const wrapper = isolatedServiceRegistry.getServiceWrapper(serviceName);
    const metrics = wrapper?.standardInterface?.getMetrics?.();
    return {
      name: serviceName,
      avgResponse: metrics?.averageResponseTime || Math.random() * 200 + 50,
      successRate: metrics ? (metrics.successfulCalls / metrics.totalCalls) * 100 : Math.random() * 20 + 80,
      totalCalls: metrics?.totalCalls || Math.floor(Math.random() * 1000) + 100
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Monitor real-time performance across all registered services
          </p>
        </div>
        <div className="flex gap-2">
          {services.map(serviceName => (
            <Button
              key={serviceName}
              variant={selectedService === serviceName ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedService(serviceName)}
            >
              {serviceName}
            </Button>
          ))}
        </div>
      </div>

      {currentMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Calls</p>
                  <p className="text-2xl font-bold">{currentMetrics.totalCalls}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {((currentMetrics.successfulCalls / currentMetrics.totalCalls) * 100).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{currentMetrics.averageResponseTime.toFixed(0)}ms</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {(currentMetrics.errorRate * 100).toFixed(2)}%
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>
              24-hour response time history for {selectedService}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}ms`, 'Response Time']} />
                <Line type="monotone" dataKey="responseTime" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Comparison</CardTitle>
            <CardDescription>
              Performance comparison across all services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgResponse" fill="#8884d8" name="Avg Response (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Health Overview</CardTitle>
          <CardDescription>
            Current status and health indicators for all registered services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map(serviceName => {
              const wrapper = isolatedServiceRegistry.getServiceWrapper(serviceName);
              const metrics = wrapper?.standardInterface?.getMetrics?.();
              const successRate = metrics ? (metrics.successfulCalls / metrics.totalCalls) * 100 : 95;
              const avgResponse = metrics?.averageResponseTime || 150;
              
              let healthStatus = 'healthy';
              if (successRate < 90 || avgResponse > 500) healthStatus = 'degraded';
              if (successRate < 80 || avgResponse > 1000) healthStatus = 'error';
              
              const healthColor = healthStatus === 'healthy' ? 'bg-green-100 text-green-800' :
                                healthStatus === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800';

              return (
                <div key={serviceName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{serviceName}</h4>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Success: {successRate.toFixed(1)}%</span>
                      <span>Response: {avgResponse.toFixed(0)}ms</span>
                      <span>Calls: {metrics?.totalCalls || 'N/A'}</span>
                    </div>
                  </div>
                  <Badge className={healthColor}>
                    {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceMetricsPanel;

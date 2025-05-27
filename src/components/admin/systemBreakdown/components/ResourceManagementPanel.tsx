
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  Server, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Database,
  Cpu
} from 'lucide-react';

interface ResourceData {
  developers: {
    allocated: number;
    available: number;
    utilization: number;
    hourlyRate: number;
  };
  infrastructure: {
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    monthlyCost: number;
  };
  capacity: {
    currentLoad: number;
    maxCapacity: number;
    projectedGrowth: number;
    scalingThreshold: number;
  };
}

interface ResourceManagementPanelProps {
  resourceData: ResourceData;
}

const ResourceManagementPanel: React.FC<ResourceManagementPanelProps> = ({ resourceData }) => {
  const { developers, infrastructure, capacity } = resourceData;

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 75) return 'text-yellow-600';
    if (utilization >= 50) return 'text-green-600';
    return 'text-blue-600';
  };

  const getUtilizationBadge = (utilization: number) => {
    if (utilization >= 90) return <Badge className="bg-red-100 text-red-800">Overloaded</Badge>;
    if (utilization >= 75) return <Badge className="bg-yellow-100 text-yellow-800">High</Badge>;
    if (utilization >= 50) return <Badge className="bg-green-100 text-green-800">Optimal</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">Underutilized</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Developer Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Developer Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Team Allocation</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {developers.allocated}/{developers.available}
              </div>
              <Progress value={(developers.allocated / developers.available) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Developers assigned</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Utilization</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUtilizationColor(developers.utilization)}`}>
                {developers.utilization}%
              </div>
              <Progress value={developers.utilization} className="mt-2" />
              {getUtilizationBadge(developers.utilization)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${developers.hourlyRate}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average per developer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${(developers.allocated * developers.hourlyRate * 160).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Development costs</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Infrastructure Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Infrastructure Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                <Cpu className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUtilizationColor(infrastructure.cpuUsage)}`}>
                {infrastructure.cpuUsage}%
              </div>
              <Progress value={infrastructure.cpuUsage} className="mt-2" />
              {getUtilizationBadge(infrastructure.cpuUsage)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <Database className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUtilizationColor(infrastructure.memoryUsage)}`}>
                {infrastructure.memoryUsage}%
              </div>
              <Progress value={infrastructure.memoryUsage} className="mt-2" />
              {getUtilizationBadge(infrastructure.memoryUsage)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                <Server className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUtilizationColor(infrastructure.storageUsage)}`}>
                {infrastructure.storageUsage}%
              </div>
              <Progress value={infrastructure.storageUsage} className="mt-2" />
              {getUtilizationBadge(infrastructure.storageUsage)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                ${infrastructure.monthlyCost.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Infrastructure costs</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Capacity Planning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Capacity Planning & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Load</span>
                <span className="text-sm text-muted-foreground">{capacity.currentLoad}%</span>
              </div>
              <Progress value={capacity.currentLoad} className="mb-4" />
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Scaling Threshold</span>
                <span className="text-sm text-muted-foreground">{capacity.scalingThreshold}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded relative">
                <div 
                  className="h-full bg-red-200 rounded absolute"
                  style={{ left: `${capacity.scalingThreshold}%`, width: `${100 - capacity.scalingThreshold}%` }}
                />
                <div 
                  className="h-full bg-green-500 rounded absolute"
                  style={{ width: `${Math.min(capacity.currentLoad, capacity.scalingThreshold)}%` }}
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Projected Growth</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Next 30 days:</span>
                  <span className="text-sm font-medium">+{capacity.projectedGrowth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Estimated capacity:</span>
                  <span className="text-sm font-medium">{capacity.currentLoad + capacity.projectedGrowth}%</span>
                </div>
                {capacity.currentLoad + capacity.projectedGrowth > capacity.scalingThreshold && (
                  <Badge className="bg-yellow-100 text-yellow-800 mt-2">
                    Scaling Required Soon
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Resource Alerts</h4>
              <div className="space-y-2">
                {infrastructure.cpuUsage > 80 && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    High CPU usage detected
                  </div>
                )}
                {infrastructure.memoryUsage > 85 && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    Memory usage critical
                  </div>
                )}
                {developers.utilization > 90 && (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    Team overutilized
                  </div>
                )}
                {capacity.currentLoad + capacity.projectedGrowth > capacity.scalingThreshold && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    Scaling needed soon
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceManagementPanel;

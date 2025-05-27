
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cpu, MemoryStick, Clock, TrendingUp } from 'lucide-react';

interface SystemMetricsDashboardProps {
  performanceMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
  userEngagement: {
    activeUsers: number;
    sessionDuration: number;
    pageViews: number;
    bounceRate: number;
  };
  qualityMetrics: {
    codeQuality: number;
    testCoverage: number;
    securityScore: number;
    performanceScore: number;
  };
}

const SystemMetricsDashboard: React.FC<SystemMetricsDashboardProps> = ({
  performanceMetrics,
  userEngagement,
  qualityMetrics
}) => {
  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <Progress value={performanceMetrics.cpuUsage} className="h-2" />
              <span className="text-sm text-muted-foreground">{performanceMetrics.cpuUsage}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <Progress value={performanceMetrics.memoryUsage} className="h-2" />
              <span className="text-sm text-muted-foreground">{performanceMetrics.memoryUsage}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Response Time</span>
              </div>
              <div className="text-2xl font-bold">{performanceMetrics.responseTime}ms</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <div className="text-2xl font-bold">{performanceMetrics.uptime}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Engagement */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userEngagement.activeUsers}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userEngagement.sessionDuration}s</div>
              <div className="text-sm text-muted-foreground">Session Duration</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userEngagement.pageViews}</div>
              <div className="text-sm text-muted-foreground">Page Views</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{userEngagement.bounceRate}%</div>
              <div className="text-sm text-muted-foreground">Bounce Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Code Quality</span>
              <Progress value={qualityMetrics.codeQuality} className="h-2" />
              <span className="text-sm text-muted-foreground">{qualityMetrics.codeQuality}/100</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Test Coverage</span>
              <Progress value={qualityMetrics.testCoverage} className="h-2" />
              <span className="text-sm text-muted-foreground">{qualityMetrics.testCoverage}%</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Security Score</span>
              <Progress value={qualityMetrics.securityScore} className="h-2" />
              <span className="text-sm text-muted-foreground">{qualityMetrics.securityScore}/100</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium">Performance Score</span>
              <Progress value={qualityMetrics.performanceScore} className="h-2" />
              <span className="text-sm text-muted-foreground">{qualityMetrics.performanceScore}/100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMetricsDashboard;

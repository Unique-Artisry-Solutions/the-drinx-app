
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Shield,
  Code,
  Zap
} from 'lucide-react';

interface SystemMetricsDashboardProps {
  performanceMetrics: {
    responseTime: number;
    uptime: number;
    errorRate: number;
    throughput: number;
  };
  userEngagement: {
    activeUsers: number;
    sessionDuration: number;
    featureUsage: number;
    satisfaction: number;
  };
  qualityMetrics: {
    codeQuality: number;
    testCoverage: number;
    securityScore: number;
    technicalDebt: number;
  };
}

const SystemMetricsDashboard: React.FC<SystemMetricsDashboardProps> = ({
  performanceMetrics,
  userEngagement,
  qualityMetrics
}) => {
  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (value >= thresholds.warning) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Real-Time Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(300 - performanceMetrics.responseTime, { good: 200, warning: 100 })}`}>
                {performanceMetrics.responseTime}ms
              </div>
              <Progress value={Math.max(0, 100 - (performanceMetrics.responseTime / 5))} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: &lt;200ms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Zap className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(performanceMetrics.uptime, { good: 99.5, warning: 99 })}`}>
                {performanceMetrics.uptime}%
              </div>
              <Progress value={performanceMetrics.uptime} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: &gt;99.5%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(5 - performanceMetrics.errorRate, { good: 4, warning: 2 })}`}>
                {performanceMetrics.errorRate}%
              </div>
              <Progress value={Math.max(0, 100 - (performanceMetrics.errorRate * 20))} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: &lt;1%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {performanceMetrics.throughput}/min
              </div>
              <Progress value={(performanceMetrics.throughput / 1000) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Requests per minute</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Engagement Analytics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User Engagement Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {userEngagement.activeUsers.toLocaleString()}
              </div>
              {getStatusBadge(userEngagement.activeUsers, { good: 1000, warning: 500 })}
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Session Duration</CardTitle>
                <Clock className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(userEngagement.sessionDuration)}m
              </div>
              <Progress value={(userEngagement.sessionDuration / 30) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Average per session</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Feature Usage</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {userEngagement.featureUsage}%
              </div>
              <Progress value={userEngagement.featureUsage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Feature adoption rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {userEngagement.satisfaction}/5
              </div>
              <Progress value={(userEngagement.satisfaction / 5) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">User satisfaction score</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quality & Security Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quality & Security Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
                <Code className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(qualityMetrics.codeQuality, { good: 80, warning: 60 })}`}>
                {qualityMetrics.codeQuality}/100
              </div>
              <Progress value={qualityMetrics.codeQuality} className="mt-2" />
              {getStatusBadge(qualityMetrics.codeQuality, { good: 80, warning: 60 })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(qualityMetrics.testCoverage, { good: 80, warning: 60 })}`}>
                {qualityMetrics.testCoverage}%
              </div>
              <Progress value={qualityMetrics.testCoverage} className="mt-2" />
              {getStatusBadge(qualityMetrics.testCoverage, { good: 80, warning: 60 })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                <Shield className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(qualityMetrics.securityScore, { good: 90, warning: 70 })}`}>
                {qualityMetrics.securityScore}/100
              </div>
              <Progress value={qualityMetrics.securityScore} className="mt-2" />
              {getStatusBadge(qualityMetrics.securityScore, { good: 90, warning: 70 })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Technical Debt</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(100 - qualityMetrics.technicalDebt, { good: 80, warning: 60 })}`}>
                {qualityMetrics.technicalDebt}%
              </div>
              <Progress value={Math.max(0, 100 - qualityMetrics.technicalDebt)} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemMetricsDashboard;

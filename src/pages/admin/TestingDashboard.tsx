
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AdminTopNav from '@/components/navigation/admin/AdminTopNav';
import { 
  TestControls, 
  TestSuite, 
  TestProgressMatrix,
  AudienceAnalyticsTestSuite,
  PerformanceTestRunner,
  SegmentationTestValidator
} from '@/components/admin/testing';
import { 
  TestTube, 
  Users, 
  Zap, 
  Filter,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const TestingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock statistics for the overview
  const testStats = {
    totalTests: 24,
    passedTests: 18,
    failedTests: 3,
    pendingTests: 3,
    inProgress: 0,
    passRate: 75
  };

  const testCategories = [
    {
      name: 'Audience Analytics',
      icon: Users,
      total: 8,
      passed: 6,
      failed: 1,
      pending: 1,
      description: 'Segmentation, relationships, and analytics testing'
    },
    {
      name: 'Performance Tests',
      icon: Zap,
      total: 6,
      passed: 4,
      failed: 1,
      pending: 1,
      description: 'Load testing and performance validation'
    },
    {
      name: 'UI Components',
      icon: BarChart3,
      total: 5,
      passed: 4,
      failed: 0,
      pending: 1,
      description: 'Component functionality and integration'
    },
    {
      name: 'Data Validation',
      icon: Filter,
      total: 5,
      passed: 4,
      failed: 1,
      pending: 0,
      description: 'Data integrity and validation tests'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminTopNav />
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Phase 9B Testing Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive testing suite for audience analytics and medium-risk components
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audience">Audience Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="suite">Test Suite</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                      <p className="text-2xl font-bold">{testStats.totalTests}</p>
                    </div>
                    <TestTube className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Passed</p>
                      <p className="text-2xl font-bold text-green-600">{testStats.passedTests}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{testStats.failedTests}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-blue-600">{testStats.pendingTests}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Test Categories Overview</CardTitle>
                <CardDescription>
                  Status breakdown by testing category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testCategories.map((category) => {
                    const IconComponent = category.icon;
                    const passRate = category.total > 0 ? (category.passed / category.total) * 100 : 0;
                    
                    return (
                      <div key={category.name} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{category.total} total</Badge>
                              <Badge variant="success" className="bg-green-100 text-green-800">
                                {category.passed} passed
                              </Badge>
                              {category.failed > 0 && (
                                <Badge variant="destructive">{category.failed} failed</Badge>
                              )}
                              {category.pending > 0 && (
                                <Badge variant="outline">{category.pending} pending</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Pass Rate</span>
                              <span>{passRate.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${passRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <TestControls />
          </TabsContent>

          <TabsContent value="audience">
            <AudienceAnalyticsTestSuite />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTestRunner />
          </TabsContent>

          <TabsContent value="validation">
            <SegmentationTestValidator />
          </TabsContent>

          <TabsContent value="suite">
            <TestSuite />
          </TabsContent>

          <TabsContent value="progress">
            <TestProgressMatrix />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestingDashboard;

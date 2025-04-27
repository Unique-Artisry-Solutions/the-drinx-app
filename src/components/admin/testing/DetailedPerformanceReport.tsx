
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, CheckCircle, Database, Loader, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface PerformanceData {
  queryStats: {
    queryId: string;
    executionTime: number;
    rowsProcessed: number;
    cacheHitRate: number;
  }[];
  systemHealth: {
    status: string;
    responseTime: number;
    errorRate: number;
    transactionCount: number;
  };
  relationshipHealth: {
    validConstraints: number;
    totalConstraints: number;
    issues: string[];
  };
  rewardSystemMetrics: {
    transactionThroughput: number;
    avgProcessingTime: number;
    errorRate: number;
    cacheHitRate: number;
    activeRules: number;
    pendingRedemptions: number;
    tierProgressions: number[];
    recentPointsAdjustments: {
      user: string;
      points: number;
      reason: string;
      timestamp: string;
    }[];
  };
}

const DetailedPerformanceReport = () => {
  const [activeTab, setActiveTab] = useState<string>('system');
  
  const { data: performanceData, isLoading, refetch } = useQuery<PerformanceData>({
    queryKey: ['detailedPerformance'],
    queryFn: async () => {
      // This would be replaced with actual API call
      return {
        queryStats: [
          {
            queryId: "Q1",
            executionTime: 45,
            rowsProcessed: 1200,
            cacheHitRate: 95
          },
          {
            queryId: "Q2",
            executionTime: 120,
            rowsProcessed: 5000,
            cacheHitRate: 85
          }
        ],
        systemHealth: {
          status: "healthy",
          responseTime: 45,
          errorRate: 0.01,
          transactionCount: 15000
        },
        relationshipHealth: {
          validConstraints: 24,
          totalConstraints: 26,
          issues: [
            "Foreign key constraint violation in user_rewards",
            "Unique constraint violation in loyalty_points"
          ]
        },
        rewardSystemMetrics: {
          transactionThroughput: 256,
          avgProcessingTime: 42,
          errorRate: 0.03,
          cacheHitRate: 92.5,
          activeRules: 8,
          pendingRedemptions: 12,
          tierProgressions: [45, 28, 10],
          recentPointsAdjustments: [
            {
              user: "user_123",
              points: 500,
              reason: "Purchase Reward",
              timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
            },
            {
              user: "user_456",
              points: 250,
              reason: "Referral Bonus",
              timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
            },
            {
              user: "user_789",
              points: -1000,
              reason: "Reward Redemption",
              timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
            }
          ]
        }
      };
    },
    refetchInterval: 30000
  });

  const { data: testResults, isLoading: testLoading, refetch: runTest } = useQuery({
    queryKey: ['rewardSystemTests'],
    queryFn: async () => {
      // This would be an actual API call to test_reward_system_performance function
      return {
        tests: [
          { test_name: "points_calculation", duration_ms: 115, rows_processed: 1000, status: "completed" },
          { test_name: "tier_progression", duration_ms: 89, rows_processed: 500, status: "completed" },
          { test_name: "redemption_flow", duration_ms: 210, rows_processed: 350, status: "completed" },
          { test_name: "rule_evaluation", duration_ms: 175, rows_processed: 850, status: "completed" }
        ],
        summary: {
          totalTests: 4,
          passedTests: 4,
          averageDuration: 147.25,
          totalRowsProcessed: 2700
        }
      };
    },
    enabled: false
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!performanceData) return null;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="rewards">Rewards Metrics</TabsTrigger>
          <TabsTrigger value="tests">Performance Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    {performanceData.systemHealth.status === 'healthy' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    )}
                    <span className="text-2xl font-bold">
                      {performanceData.systemHealth.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Response Time</p>
                  <p className="text-2xl font-bold">{performanceData.systemHealth.responseTime}ms</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Error Rate</p>
                  <p className="text-2xl font-bold">{(performanceData.systemHealth.errorRate * 100).toFixed(2)}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Transactions</p>
                  <p className="text-2xl font-bold">{performanceData.systemHealth.transactionCount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Query Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Query ID</TableHead>
                    <TableHead>Execution Time (ms)</TableHead>
                    <TableHead>Rows Processed</TableHead>
                    <TableHead>Cache Hit Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.queryStats.map((stat) => (
                    <TableRow key={stat.queryId}>
                      <TableCell>{stat.queryId}</TableCell>
                      <TableCell>{stat.executionTime}</TableCell>
                      <TableCell>{stat.rowsProcessed.toLocaleString()}</TableCell>
                      <TableCell>{stat.cacheHitRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relationship Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Constraint Validation</span>
                  <span className="font-mono">
                    {performanceData.relationshipHealth.validConstraints} / {performanceData.relationshipHealth.totalConstraints}
                  </span>
                </div>
                
                {performanceData.relationshipHealth.issues.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Issues Detected:</h4>
                    <ul className="space-y-2">
                      {performanceData.relationshipHealth.issues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-red-600">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward System Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">Transaction Throughput</p>
                  <p className="text-2xl font-bold">{performanceData.rewardSystemMetrics.transactionThroughput}/min</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-700">Processing Time</p>
                  <p className="text-2xl font-bold">{performanceData.rewardSystemMetrics.avgProcessingTime}ms</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm font-medium text-amber-700">Error Rate</p>
                  <p className="text-2xl font-bold">{performanceData.rewardSystemMetrics.errorRate}%</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700">Cache Hit Rate</p>
                  <p className="text-2xl font-bold">{performanceData.rewardSystemMetrics.cacheHitRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Active Rules</p>
                    <p className="text-xl font-bold">{performanceData.rewardSystemMetrics.activeRules}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Pending Redemptions</p>
                    <p className="text-xl font-bold">{performanceData.rewardSystemMetrics.pendingRedemptions}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-700 mb-2">Tier Progressions</p>
                    <div className="flex gap-2">
                      {performanceData.rewardSystemMetrics.tierProgressions.map((count, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-xs text-gray-500">Tier {idx + 1}</span>
                          <span className="text-lg font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Recent Points Adjustments</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.rewardSystemMetrics.recentPointsAdjustments.map((adj, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{adj.user}</TableCell>
                        <TableCell className={adj.points > 0 ? "text-green-600" : "text-red-600"}>
                          {adj.points > 0 ? `+${adj.points}` : adj.points}
                        </TableCell>
                        <TableCell>{adj.reason}</TableCell>
                        <TableCell>{new Date(adj.timestamp).toLocaleTimeString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cache Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Cache Hit Rate</span>
                    <span className="text-sm font-medium">
                      {performanceData.rewardSystemMetrics.cacheHitRate}%
                    </span>
                  </div>
                  <Progress 
                    value={performanceData.rewardSystemMetrics.cacheHitRate} 
                    className="h-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Invalidations</p>
                    <p className="text-xl font-bold">24 / hour</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Avg TTL</p>
                    <p className="text-xl font-bold">300s</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Performance Tests</CardTitle>
              <Button 
                onClick={() => runTest()} 
                disabled={testLoading}
                size="sm"
              >
                {testLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Run Tests
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {testResults ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Total Tests</p>
                      <p className="text-2xl font-bold">{testResults.summary.totalTests}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-700">Passed Tests</p>
                      <p className="text-2xl font-bold">{testResults.summary.passedTests}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-700">Avg Duration</p>
                      <p className="text-2xl font-bold">{testResults.summary.averageDuration.toFixed(2)}ms</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm font-medium text-purple-700">Rows Processed</p>
                      <p className="text-2xl font-bold">{testResults.summary.totalRowsProcessed.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Name</TableHead>
                        <TableHead>Duration (ms)</TableHead>
                        <TableHead>Rows Processed</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testResults.tests.map((test, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{test.test_name}</TableCell>
                          <TableCell>{test.duration_ms}</TableCell>
                          <TableCell>{test.rows_processed.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${test.status === "completed" ? "bg-green-100 text-green-800" : 
                                test.status === "failed" ? "bg-red-100 text-red-800" : 
                                "bg-yellow-100 text-yellow-800"}`}>
                              {test.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : testLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-gray-500">Running performance tests...</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center text-center">
                    <Database className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-2">No test results available</p>
                    <p className="text-sm text-gray-400">Click 'Run Tests' to execute performance tests on the reward system</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedPerformanceReport;

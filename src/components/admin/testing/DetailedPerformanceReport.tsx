
import React from 'react';
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
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

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
}

const DetailedPerformanceReport = () => {
  const { data: performanceData, isLoading } = useQuery<PerformanceData>({
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
        }
      };
    },
    refetchInterval: 30000
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
    </div>
  );
};

export default DetailedPerformanceReport;

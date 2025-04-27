
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Activity, AlertTriangle, Zap } from "lucide-react";
import type { PerformanceTestResult } from '@/lib/rewards/types';

interface PerformanceTestCardProps {
  performanceTest: PerformanceTestResult | null;
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
}

const getTestStatusIcon = (status: 'fast' | 'average' | 'slow' | 'error') => {
  switch (status) {
    case 'fast':
      return <Zap className="h-4 w-4 text-green-500" />;
    case 'average':
      return <Activity className="h-4 w-4 text-yellow-500" />;
    case 'slow':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

export const PerformanceTestCard: React.FC<PerformanceTestCardProps> = ({
  performanceTest,
  isLoading,
  error,
  onRefresh
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Tests</CardTitle>
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          onClick={onRefresh}
        >
          <Activity className="h-4 w-4" />
          Run Tests
        </button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 animate-pulse text-blue-500" />
              <p className="text-sm text-muted-foreground">Running performance tests...</p>
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Test Failed</AlertTitle>
            <AlertDescription>
              Unable to run performance tests. Please try again later.
            </AlertDescription>
          </Alert>
        ) : !performanceTest ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Results</AlertTitle>
            <AlertDescription>
              No test results available. Click "Run Tests" to get the latest performance metrics.
            </AlertDescription>
          </Alert>
        ) : Object.keys(performanceTest).length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No tests to display</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
            {Object.entries(performanceTest).map(([testName, result]) => (
              <div key={testName} className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getTestStatusIcon(result.status)}
                  <h3 className="font-medium text-sm">{testName}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-mono">
                    {`${result.duration_ms}ms`}
                  </span>
                  <span className={
                    result.status === 'fast' ? "text-green-500" : 
                    result.status === 'average' ? "text-yellow-500" : 
                    result.status === 'slow' ? "text-red-500" : "text-gray-500"
                  }>
                    {result.status === 'fast' ? "Fast" : 
                     result.status === 'average' ? "Average" : 
                     result.status === 'slow' ? "Slow" : "Error"}
                  </span>
                </div>
                {result.rows_processed && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Rows processed: {result.rows_processed}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

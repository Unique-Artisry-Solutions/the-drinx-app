
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceTestResult } from '@/lib/rewards/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from 'lucide-react';

interface PerformanceTestCardProps {
  performanceTest: PerformanceTestResult | null;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  onExport?: () => void;  // Added this prop to fix the TS2322 error
}

export function PerformanceTestCard({ 
  performanceTest, 
  isLoading, 
  error,
  onRefresh,
  onExport
}: PerformanceTestCardProps) {
  if (error) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Performance Tests</CardTitle>
          <CardDescription>System performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Error Loading Performance Tests</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
          <div className="text-right mt-4">
            <Button onClick={onRefresh}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <ArrowDownUp className="h-4 w-4 mr-2" />
            Performance Tests
          </div>
          {!isLoading && (
            <Button size="sm" variant="outline" onClick={onRefresh}>
              <RefreshCcw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          )}
        </CardTitle>
        <CardDescription>Current system response times (in ms)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 items-center">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          ) : performanceTest ? (
            Object.entries(performanceTest).map(([testName, result]) => (
              <div key={testName} className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">{testName}</div>
                <div 
                  className={
                    result.status === 'error' ? 'text-red-500' :
                    result.status === 'slow' ? 'text-yellow-500' :
                    result.status === 'fast' ? 'text-green-500' : 'text-blue-500'
                  }
                >
                  {result.status === 'error' ? 'Error' : `${result.duration_ms}ms`}
                </div>
                <div className="text-muted-foreground text-sm">
                  {result.rows_processed} rows
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No performance data available
            </div>
          )}
        </div>
      </CardContent>
      {onExport && performanceTest && (
        <CardFooter className="justify-end">
          <Button 
            size="sm"
            variant="outline"
            onClick={onExport}
          >
            Export Metrics
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

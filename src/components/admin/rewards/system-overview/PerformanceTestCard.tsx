
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface PerformanceTestResult {
  name: string;
  duration_ms: number;
  status: string;
  timestamp: string;
}

interface PerformanceTestCard {
  performanceTest: PerformanceTestResult[] | null;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  onExport: () => void;
}

export const PerformanceTestCard: React.FC<PerformanceTestCard> = ({
  performanceTest,
  isLoading,
  error,
  onRefresh,
  onExport
}) => {
  // Function to determine badge color based on test status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Performance Tests</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} disabled={isLoading || !performanceTest}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error.message || "Failed to load performance tests"}
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : performanceTest && performanceTest.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead className="text-right">Duration (ms)</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceTest.map((test, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell className="text-right">{test.duration_ms}</TableCell>
                  <TableCell className="text-right">{getStatusBadge(test.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No performance test results available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

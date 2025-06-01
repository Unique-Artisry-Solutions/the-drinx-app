
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SystemHealthMetric } from "@/lib/rewards/system/RewardsSystemMonitor";

interface SystemHealthCardProps {
  healthMetrics: SystemHealthMetric | null;
  isLoading: boolean;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ 
  healthMetrics, 
  isLoading 
}) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-amber-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">System Health</CardTitle>
        {!isLoading && healthMetrics && (
          <div className="flex items-center space-x-1">
            {getStatusIcon(healthMetrics.status)}
            <span className={cn("text-sm font-medium", getStatusColor(healthMetrics.status))}>
              {healthMetrics.status}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : healthMetrics ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Response Time</p>
              <p className="text-sm font-medium">{healthMetrics.response_time_ms}ms</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Transactions</p>
              <p className="text-sm font-medium">{healthMetrics.transaction_count}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Errors</p>
              <div className="flex items-center space-x-1">
                <span className={`text-sm font-medium ${healthMetrics.error_count > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {healthMetrics.error_count}
                </span>
                {healthMetrics.error_count === 0 && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No health data available</p>
        )}
      </CardContent>
    </Card>
  );
};

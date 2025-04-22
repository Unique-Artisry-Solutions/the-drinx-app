
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEdgeFunctionHealth } from '@/hooks/useEdgeFunctionHealth';
import { useServiceWorkerStatus } from '@/hooks/service-worker/useServiceWorkerStatus';
import { useDirectNotifications } from '@/hooks/useDirectNotifications';
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

const NotificationSystemMonitor = () => {
  const { isHealthy, isChecking, lastCheck, error, checkHealth } = useEdgeFunctionHealth();
  const { hasServiceWorker, permissionStatus } = useServiceWorkerStatus();
  const { isSupported: isBrowserSupported } = useDirectNotifications();
  const [systemHealth, setSystemHealth] = useState<number>(0);
  
  useEffect(() => {
    let score = 0;
    
    // Edge function health (30%)
    if (isHealthy) score += 30;
    
    // Service worker health (30%)
    if (hasServiceWorker) score += 30;
    
    // Permission status (40%)
    if (permissionStatus === 'granted') score += 40;
    else if (permissionStatus === 'default') score += 20;
    
    setSystemHealth(score);
  }, [isHealthy, hasServiceWorker, permissionStatus]);
  
  const getHealthIndicator = (healthy: boolean | null) => {
    if (healthy === true) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (healthy === false) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <RefreshCw className="h-5 w-5 text-amber-500 animate-spin" />;
  };
  
  const getHealthColor = () => {
    if (systemHealth >= 90) return "bg-green-500";
    if (systemHealth >= 70) return "bg-green-400";
    if (systemHealth >= 50) return "bg-yellow-400";
    if (systemHealth >= 30) return "bg-orange-400";
    return "bg-red-500";
  };
  
  const getStatusText = () => {
    if (systemHealth >= 90) return "Excellent";
    if (systemHealth >= 70) return "Good";
    if (systemHealth >= 50) return "Fair";
    if (systemHealth >= 30) return "Poor";
    return "Critical";
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Notification System Health</CardTitle>
          <CardDescription>System status and diagnostics</CardDescription>
        </div>
        <Badge 
          variant={systemHealth >= 50 ? "default" : "destructive"}
          className="text-xs py-1"
        >
          {getStatusText()}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>System Health</span>
            <span className="font-medium">{systemHealth}%</span>
          </div>
          <Progress value={systemHealth} className={getHealthColor()} />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-md bg-muted p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">Edge Function</div>
              {getHealthIndicator(isHealthy)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isHealthy ? 
                "Edge function is responding correctly" : 
                error || "Edge function health check failed"
              }
            </p>
          </div>
          
          <div className="rounded-md bg-muted p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">Service Worker</div>
              {getHealthIndicator(hasServiceWorker)}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasServiceWorker ? 
                "Service worker is active and running" : 
                "Service worker is not registered or active"
              }
            </p>
          </div>
          
          <div className="rounded-md bg-muted p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm">Notification Permission</div>
              {permissionStatus === 'granted' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : permissionStatus === 'denied' ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {permissionStatus === 'granted' ? 
                "Notification permission is granted" : 
                permissionStatus === 'denied' ?
                "Notification permission is denied" :
                "Notification permission not yet requested"
              }
            </p>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={checkHealth}
          className="w-full"
          variant="outline"
          disabled={isChecking}
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run System Check
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSystemMonitor;

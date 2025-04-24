
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info, RefreshCw, Settings, Zap } from "lucide-react";
import { useNotificationDiagnostics } from '@/hooks/notifications/diagnostics/useNotificationDiagnostics';

export function NotificationSystemDiagnostics() {
  const {
    isSupported,
    permission,
    serviceWorkerStatus,
    serviceWorkerController,
    serviceWorkerRegistrations,
    error,
    isRunningTests,
    runDiagnostics,
    resetServiceWorker
  } = useNotificationDiagnostics();
  
  const [showDetails, setShowDetails] = useState(false);

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge className="bg-green-500">Granted</Badge>;
      case 'denied':
        return <Badge className="bg-red-500">Denied</Badge>;
      default:
        return <Badge className="bg-amber-500">Not Set</Badge>;
    }
  };

  const getServiceWorkerBadge = () => {
    switch (serviceWorkerStatus) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-amber-500">Inactive</Badge>;
      case 'checking':
        return <Badge className="bg-blue-500">Checking</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Notification System Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Diagnostic Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Notification Support</p>
              <p className="text-xs text-muted-foreground">
                {isSupported ? 'Supported in this browser' : 'Not supported in this browser'}
              </p>
            </div>
            <Badge className={isSupported ? "bg-green-500" : "bg-red-500"}>
              {isSupported ? 'Supported' : 'Not Supported'}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Permission Status</p>
              <p className="text-xs text-muted-foreground">
                {permission === 'granted' 
                  ? 'Notifications allowed' 
                  : permission === 'denied' 
                    ? 'Notifications blocked by user' 
                    : 'Permission not requested yet'}
              </p>
            </div>
            {getPermissionBadge()}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Service Worker</p>
              <p className="text-xs text-muted-foreground">
                {serviceWorkerStatus === 'active' 
                  ? 'Service worker active and controlling page' 
                  : serviceWorkerStatus === 'inactive' 
                    ? 'Service worker installed but not active' 
                    : 'Service worker not active'}
              </p>
            </div>
            {getServiceWorkerBadge()}
          </div>

          {showDetails && (
            <>
              <div className="p-3 bg-slate-50 rounded-md mt-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Controller active:</span>
                  <span className={serviceWorkerController ? "text-green-600" : "text-amber-600"}>
                    {serviceWorkerController ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service worker registrations:</span>
                  <span className={serviceWorkerRegistrations > 0 ? "text-green-600" : "text-amber-600"}>
                    {serviceWorkerRegistrations}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>User agent:</span>
                  <span className="max-w-[70%] truncate" title={navigator.userAgent}>
                    {navigator.userAgent.split(' ').slice(-1)[0]}
                  </span>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Tips</AlertTitle>
                <AlertDescription className="text-xs">
                  {serviceWorkerStatus !== 'active' ? (
                    <>
                      Service worker issues are often fixed by refreshing the page or clearing browser data.
                      Try resetting the system if notifications aren't working.
                    </>
                  ) : permission !== 'granted' ? (
                    <>
                      You need to grant notification permission to receive notifications.
                      Click "Request Permission" on the notification testing panel.
                    </>
                  ) : (
                    <>
                      Your notification system appears to be configured correctly.
                      If you're still having issues, try the reset button below.
                    </>
                  )}
                </AlertDescription>
              </Alert>
            </>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runDiagnostics} 
              disabled={isRunningTests}
              className="text-xs"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRunningTests ? 'animate-spin' : ''}`} />
              Run Diagnostics
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs"
            >
              <Info className="h-3 w-3 mr-1" />
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetServiceWorker}
              disabled={isRunningTests}
              className="text-xs text-red-500 hover:text-red-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Reset System
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDirectNotifications } from '@/hooks/useDirectNotifications';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw, Bell, Zap, AlertCircle, Lock, CheckCircle, Info } from "lucide-react";
import { DiagnosticStatusSection } from './DiagnosticStatusSection';

const DirectNotificationTester = () => {
  const {
    isSupported,
    permissionStatus,
    lastCheck,
    isLoading,
    error,
    requestPermission,
    checkPermission,
    sendTestNotification,
    resetPermissionState
  } = useDirectNotifications();
  
  const [activeTab, setActiveTab] = useState("test");
  const [notificationSent, setNotificationSent] = useState(false);
  
  const handleRefreshPermission = () => {
    checkPermission();
  };

  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification();
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 10000);
    } catch (err) {
      console.error("Failed to send test notification:", err);
    }
  };
  
  const getPermissionBadge = () => {
    switch (permissionStatus) {
      case 'granted':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Granted</span>;
      case 'denied':
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Denied</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded">Not Set</span>;
    }
  };
  
  useEffect(() => {
    if (notificationSent) {
      if (permissionStatus === 'granted' && document.visibilityState !== 'visible') {
        console.log('[DirectNotificationTester] Document not visible, notification may be missed');
      }
    }
  }, [notificationSent, permissionStatus]);
  
  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Browser Notifications</CardTitle>
          <CardDescription>Direct notification testing</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Your browser does not support the Notifications API.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle>Browser Notifications</CardTitle>
          {getPermissionBadge()}
        </div>
        <CardDescription>Test notifications directly from the browser</CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <DiagnosticStatusSection 
          notificationSent={notificationSent}
          permissionStatus={permissionStatus}
        />
        
        <Tabs defaultValue="test" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test" className="py-4">
            <div className="space-y-4">
              {permissionStatus === 'granted' ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Notification Access Granted</AlertTitle>
                  <AlertDescription>
                    You can now receive browser notifications. Try sending a test notification.
                  </AlertDescription>
                </Alert>
              ) : permissionStatus === 'denied' ? (
                <Alert variant="destructive">
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Notifications Blocked</AlertTitle>
                  <AlertDescription>
                    You've denied notification permissions. To enable them:
                    <ol className="list-decimal ml-5 space-y-1 text-sm mt-2">
                      <li>Click the lock/info icon in your browser's address bar</li>
                      <li>Find "Notifications" in the site settings</li>
                      <li>Change the setting to "Allow"</li>
                      <li>Use the refresh button to update permission status</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Permission Required</AlertTitle>
                  <AlertDescription>
                    Please allow notifications when prompted to enable this feature.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Button 
                  onClick={permissionStatus === 'granted' ? handleSendTestNotification : requestPermission}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : permissionStatus === 'granted' ? (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Send Test Notification
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Request Notification Permission
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleRefreshPermission}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Permission Status
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="debug" className="py-4">
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="font-medium mb-2 text-sm">Notification System Status</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">API Available:</div>
                  <div>{isSupported ? 'Yes' : 'No'}</div>
                  <div className="text-muted-foreground">Permission Status:</div>
                  <div>{permissionStatus}</div>
                  <div className="text-muted-foreground">Last Checked:</div>
                  <div>{lastCheck.toLocaleTimeString()}</div>
                  <div className="text-muted-foreground">Service Worker:</div>
                  <div>{'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}</div>
                  <div className="text-muted-foreground">Browser Focus:</div>
                  <div>{document.visibilityState}</div>
                  <div className="text-muted-foreground">Device Type:</div>
                  <div>{/Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'}</div>
                </div>
              </div>
              
              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertTitle>Browser Support</AlertTitle>
                <AlertDescription className="text-xs">
                  Different browsers handle notifications differently. Chrome, Firefox, and Edge provide the best notification support. Safari requires special permission handling.
                </AlertDescription>
              </Alert>
              
              <Button 
                variant="outline" 
                onClick={checkPermission}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Run Diagnostics
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reset" className="py-4">
            <div className="space-y-4">
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle>System Reset</AlertTitle>
                <AlertDescription>
                  If you're experiencing issues with notifications, you can reset the entire notification system. This will:
                  <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
                    <li>Unregister all service workers</li>
                    <li>Refresh permission status</li>
                    <li>Clear any cached data</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <Button 
                variant="destructive" 
                onClick={resetPermissionState}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Reset Notification System
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col text-xs text-muted-foreground space-y-2">
        <div className="flex justify-between w-full">
          <span>Last checked: {lastCheck.toLocaleTimeString()}</span>
          {navigator.userAgent && (
            <span className="truncate max-w-[200px]" title={navigator.userAgent}>
              {navigator.userAgent.split(' ').slice(-1)[0]}
            </span>
          )}
        </div>
        
        <p className="text-xs text-center text-gray-500 italic w-full">
          Note: Some browsers and operating systems may block notifications
        </p>
      </CardFooter>
    </Card>
  );
};

export default DirectNotificationTester;

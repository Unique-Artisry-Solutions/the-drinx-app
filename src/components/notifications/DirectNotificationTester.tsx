
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Info, AlertCircle } from "lucide-react";
import { useDirectNotifications } from '@/hooks/useDirectNotifications';
import { NotificationStatusAlert } from './direct/NotificationStatusAlert';
import { NotificationActionButtons } from './direct/NotificationActionButtons';
import { SystemStatusPanel } from './direct/SystemStatusPanel';
import { ResetSystemSection } from './direct/ResetSystemSection';

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
  
  const handleSendTestNotification = async () => {
    try {
      await sendTestNotification();
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 10000);
    } catch (err) {
      console.error("Failed to send test notification:", err);
    }
  };
  
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
          <span className={`px-2 py-1 text-xs rounded ${
            permissionStatus === 'granted' ? 'bg-green-100 text-green-800' :
            permissionStatus === 'denied' ? 'bg-red-100 text-red-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {permissionStatus === 'granted' ? 'Granted' :
             permissionStatus === 'denied' ? 'Denied' : 'Not Set'}
          </span>
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
        
        <Tabs defaultValue="test" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="debug">Debug</TabsTrigger>
            <TabsTrigger value="reset">Reset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="test" className="py-4">
            <div className="space-y-4">
              <NotificationStatusAlert permissionStatus={permissionStatus} />
              <NotificationActionButtons
                permissionStatus={permissionStatus}
                isLoading={isLoading}
                onSendTest={handleSendTestNotification}
                onRequestPermission={requestPermission}
                onRefreshPermission={checkPermission}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="debug" className="py-4">
            <div className="space-y-4">
              <SystemStatusPanel
                isSupported={isSupported}
                permissionStatus={permissionStatus}
                lastCheck={lastCheck}
              />
              
              <Alert className="bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertTitle>Browser Support</AlertTitle>
                <AlertDescription className="text-xs">
                  Different browsers handle notifications differently. Chrome, Firefox, and Edge provide the best notification support. Safari requires special permission handling.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="reset" className="py-4">
            <ResetSystemSection
              isLoading={isLoading}
              onReset={resetPermissionState}
            />
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


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, AlertCircle, Bell, Settings } from "lucide-react";
import { useEnhancedNotificationTesting } from '@/hooks/notifications/testing/useEnhancedNotificationTesting';
import { NotificationStatusAlert } from './direct/NotificationStatusAlert';
import { SystemStatusPanel } from './direct/SystemStatusPanel';
import { ResetSystemSection } from './direct/ResetSystemSection';
import { EnhancedTestControls } from './testing/EnhancedTestControls';
import { NotificationSystemDiagnostics } from './diagnostics/NotificationSystemDiagnostics';

const NotificationTester = () => {
  const {
    config,
    setConfig,
    isLoading,
    error,
    sendEnhancedTestNotification
  } = useEnhancedNotificationTesting();
  
  const [activeTab, setActiveTab] = useState("test");

  const handleSendTest = async () => {
    try {
      await sendEnhancedTestNotification();
    } catch (err) {
      console.error("Failed to send test notification:", err);
    }
  };

  if (!('Notification' in window)) {
    return (
      <Card>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Your browser does not support the Notifications API.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <NotificationStatusAlert permissionStatus={Notification.permission} />
      
      {/* Add diagnostics panel */}
      <NotificationSystemDiagnostics />
      
      <Tabs defaultValue="test" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="test">Test</TabsTrigger>
          <TabsTrigger value="config">Configure</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
        </TabsList>
        
        <TabsContent value="test" className="py-4">
          <div className="space-y-4">
            <Button 
              onClick={handleSendTest}
              disabled={isLoading}
              className="w-full"
              aria-label={isLoading ? "Sending test notification..." : "Send test notification"}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  <span>Sending...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  <span>Send Test Notification</span>
                </span>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <EnhancedTestControls />
          </div>
        </TabsContent>
        
        <TabsContent value="config" className="py-4">
          <SystemStatusPanel
            isSupported={'Notification' in window}
            permissionStatus={Notification.permission}
            lastCheck={new Date()}
          />
        </TabsContent>
        
        <TabsContent value="debug" className="py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Browser Information</AlertTitle>
            <AlertDescription className="text-xs mt-2">
              {navigator.userAgent}
            </AlertDescription>
          </Alert>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Testing Commands</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm"
                variant="outline"
                onClick={() => {
                  if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                      action: 'setDebugLevel',
                      level: 'DEBUG'
                    });
                  } else {
                    console.error('No service worker controller');
                  }
                }}
              >
                <Settings className="h-3 w-3 mr-1" />
                Enable Debug Logs
              </Button>
              
              <Button 
                size="sm"
                variant="outline"
                onClick={() => {
                  if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                      action: 'healthCheck'
                    });
                  } else {
                    console.error('No service worker controller');
                  }
                }}
              >
                <Settings className="h-3 w-3 mr-1" />
                Run Health Check
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationTester;

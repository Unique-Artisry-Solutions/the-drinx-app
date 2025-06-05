
import React from 'react';
import { Bell, BellRing, BellOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NotificationSubscriptionManagerProps {
  permissionStatus: NotificationPermission;
  isSending: boolean;
  onSendTest: () => Promise<void>;
  onRequestPermission: () => Promise<void>;
}

export const NotificationSubscriptionManager: React.FC<NotificationSubscriptionManagerProps> = ({
  permissionStatus,
  isSending,
  onSendTest,
  onRequestPermission
}) => {
  const renderPermissionStatus = () => {
    switch (permissionStatus) {
      case 'granted':
        return (
          <>
            <Alert className="border-green-200 bg-green-50 mb-4">
              <BellRing className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Push notifications are enabled
              </AlertDescription>
            </Alert>
            <Button 
              onClick={onSendTest}
              disabled={isSending}
              className="w-full"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isSending ? 'Sending...' : 'Send Test Notification'}
            </Button>
          </>
        );
      case 'denied':
        return (
          <Alert className="border-red-200 bg-red-50">
            <BellOff className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Notifications are blocked. Please enable them in your browser settings.
            </AlertDescription>
          </Alert>
        );
      default:
        return (
          <Button 
            onClick={onRequestPermission}
            disabled={isSending}
            className="w-full"
          >
            <Bell className="h-4 w-4 mr-2" />
            Request Notification Permission
          </Button>
        );
    }
  };

  return (
    <div className="space-y-4">
      {renderPermissionStatus()}
    </div>
  );
};

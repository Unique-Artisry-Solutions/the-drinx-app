
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Lock, AlertCircle } from "lucide-react";

interface NotificationStatusAlertProps {
  permissionStatus: NotificationPermission;
}

export const NotificationStatusAlert: React.FC<NotificationStatusAlertProps> = ({ permissionStatus }) => {
  if (permissionStatus === 'granted') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Notification Access Granted</AlertTitle>
        <AlertDescription>
          You can now receive browser notifications. Try sending a test notification.
        </AlertDescription>
      </Alert>
    );
  }

  if (permissionStatus === 'denied') {
    return (
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
    );
  }

  return (
    <Alert className="bg-blue-50 border-blue-200">
      <AlertCircle className="h-4 w-4 text-blue-600" />
      <AlertTitle>Permission Required</AlertTitle>
      <AlertDescription>
        Please allow notifications when prompted to enable this feature.
      </AlertDescription>
    </Alert>
  );
};

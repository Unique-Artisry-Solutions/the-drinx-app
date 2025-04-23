
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DiagnosticStatusSectionProps {
  notificationSent: boolean;
  permissionStatus: NotificationPermission;
}

export const DiagnosticStatusSection: React.FC<DiagnosticStatusSectionProps> = ({
  notificationSent,
  permissionStatus
}) => {
  if (!notificationSent || permissionStatus !== 'granted') {
    return null;
  }

  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle>Notification Troubleshooting</AlertTitle>
      <AlertDescription>
        <p>A notification was sent but not visible? Check:</p>
        <ul className="list-disc ml-5 space-y-1 text-sm mt-2">
          <li>Browser "Focus Assist" or "Do Not Disturb" mode</li>
          <li>System notification settings (check your OS control panel)</li>
          <li>Browser-specific notification settings</li>
          <li>Look at the top-right or bottom-right of your screen</li>
          <li>Try using a different browser</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

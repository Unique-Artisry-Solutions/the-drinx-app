
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell } from "lucide-react";

interface NotificationActionButtonsProps {
  permissionStatus: NotificationPermission;
  isLoading: boolean;
  onSendTest: () => void;
  onRequestPermission: () => void;
  onRefreshPermission: () => void;
}

export const NotificationActionButtons: React.FC<NotificationActionButtonsProps> = ({
  permissionStatus,
  isLoading,
  onSendTest,
  onRequestPermission,
  onRefreshPermission
}) => {
  return (
    <div className="space-y-2">
      <Button 
        onClick={permissionStatus === 'granted' ? onSendTest : onRequestPermission}
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
        onClick={onRefreshPermission}
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh Permission Status
      </Button>
    </div>
  );
};

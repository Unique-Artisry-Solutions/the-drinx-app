
import React from 'react';

interface SystemStatusPanelProps {
  isSupported: boolean;
  permissionStatus: NotificationPermission;
  lastCheck: Date;
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
  isSupported,
  permissionStatus,
  lastCheck,
}) => {
  return (
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
  );
};

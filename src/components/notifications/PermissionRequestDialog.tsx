
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PermissionRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestPermission: () => Promise<void>;
  permissionStatus: NotificationPermission;
}

const PermissionRequestDialog = ({
  open,
  onOpenChange,
  onRequestPermission,
  permissionStatus,
}: PermissionRequestDialogProps) => {
  const handleRequestClick = async () => {
    await onRequestPermission();
    onOpenChange(false);
  };

  const getBrowserInstructions = () => {
    const browser = navigator.userAgent;
    if (browser.includes('Chrome')) {
      return 'Click the lock icon in the address bar, then select "Notifications" and change it to "Allow"';
    } else if (browser.includes('Firefox')) {
      return 'Click the lock icon in the address bar, then click "More Information" and update notification permissions';
    } else {
      return 'Check your browser settings to enable notifications';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enable Push Notifications</DialogTitle>
          <DialogDescription className="pt-2">
            Stay updated with important alerts and updates from Spiritless Sips
          </DialogDescription>
        </DialogHeader>

        {permissionStatus === 'denied' ? (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {getBrowserInstructions()}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Get Important Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about new promotions, events, and important updates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BellOff className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">You're in Control</h4>
                <p className="text-sm text-muted-foreground">
                  You can customize or disable notifications at any time in your settings
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          {permissionStatus !== 'denied' && (
            <Button onClick={handleRequestClick}>
              Enable Notifications
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionRequestDialog;

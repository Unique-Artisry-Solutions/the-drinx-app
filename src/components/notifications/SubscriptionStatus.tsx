
import { Button } from "@/components/ui/button";
import { BellRing, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionStatusProps {
  isLoading: boolean;
  hasServiceWorker: boolean;
  permissionStatus: NotificationPermission;
  subscribeToNotifications: () => Promise<void>;
}

export const SubscriptionStatus = ({
  isLoading,
  hasServiceWorker,
  permissionStatus,
  subscribeToNotifications
}: SubscriptionStatusProps) => {
  const getStatusMessage = () => {
    if (permissionStatus === 'denied') {
      return 'Push notifications are blocked in your browser settings.';
    } else if (permissionStatus === 'granted' && !hasServiceWorker) {
      return 'Notification permission is granted but service needs to be initialized.';
    } else if (permissionStatus === 'default') {
      return 'Push notifications require your permission.';
    }
    return 'Push notifications are ready to be enabled.';
  };

  const getStatusColor = () => {
    if (permissionStatus === 'denied') {
      return 'border-red-200 bg-red-50';
    } else if (!hasServiceWorker) {
      return 'border-amber-200 bg-amber-50';
    }
    return 'border-amber-200 bg-amber-50';
  };

  const getButtonText = () => {
    if (permissionStatus === 'denied') {
      return 'Unblock Notifications';
    } else if (!hasServiceWorker) {
      return 'Initialize Notifications';
    }
    return 'Enable Notifications';
  };

  return (
    <>
      <div className={`border ${getStatusColor()} p-4 rounded-md mb-4`}>
        <p className="text-sm text-amber-800 mb-3">
          {getStatusMessage()}
        </p>
        <Button 
          onClick={subscribeToNotifications}
          disabled={isLoading}
          className={permissionStatus === 'denied' 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-amber-500 hover:bg-amber-600 text-white"}
        >
          <BellRing className="h-4 w-4 mr-2" />
          {isLoading ? 'Setting up...' : getButtonText()}
        </Button>
      </div>

      {permissionStatus === 'denied' && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Notifications are currently blocked. To enable them, click the lock icon in your browser's address bar and change notification permission settings.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

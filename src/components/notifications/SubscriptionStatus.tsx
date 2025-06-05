
import { Button } from "@/components/ui/button";
import { BellRing, Info, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionStatusProps {
  isLoading: boolean;
  hasServiceWorker: boolean;
  permissionStatus: NotificationPermission;
  subscribeToNotifications: () => Promise<void>;
  refreshPermissions?: () => void;
}

const SubscriptionStatus = ({
  isLoading,
  hasServiceWorker,
  permissionStatus,
  subscribeToNotifications,
  refreshPermissions
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
        <div className="flex justify-between items-start mb-3">
          <p className="text-sm text-amber-800">
            {getStatusMessage()}
          </p>
          {refreshPermissions && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-7 w-7 -mt-1" 
              onClick={refreshPermissions}
              title="Refresh permission status"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          )}
        </div>
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
            Notifications are currently blocked. To enable them, click the lock icon in your browser's address bar and change notification permission settings. After changing permissions, click the refresh button above.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default SubscriptionStatus;

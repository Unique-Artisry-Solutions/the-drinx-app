
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
  return (
    <div className="border border-amber-200 bg-amber-50 p-4 rounded-md mb-4">
      <p className="text-sm text-amber-800 mb-3">
        Push notifications are {permissionStatus === 'granted' ? 'enabled in your browser' : 'not enabled yet'}.
        {!hasServiceWorker && ' Notification service needs to be initialized.'}
      </p>
      <Button 
        onClick={subscribeToNotifications}
        disabled={isLoading}
        className="bg-amber-500 hover:bg-amber-600 text-white"
      >
        <BellRing className="h-4 w-4 mr-2" />
        {isLoading ? 'Setting up...' : 'Enable Notifications'}
      </Button>
    </div>
  );
};

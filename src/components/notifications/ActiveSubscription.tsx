
import React from 'react';
import { Bell, BellRing } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ActiveSubscriptionProps {
  isSending: boolean;
  sendTestNotification: () => Promise<void>;
}

export const ActiveSubscription = ({
  isSending,
  sendTestNotification
}: ActiveSubscriptionProps) => {
  return (
    <>
      <div className="border border-green-200 bg-green-50 p-4 rounded-md mb-4">
        <p className="text-sm text-green-800">
          <span className="flex items-center">
            <BellRing className="h-4 w-4 mr-2 text-green-600" /> 
            Push notifications are enabled
          </span>
        </p>
      </div>
      <Button 
        onClick={sendTestNotification}
        disabled={isSending}
        className="flex gap-2"
      >
        <Bell className="h-4 w-4" />
        {isSending ? 'Sending...' : 'Send Test Notification'}
      </Button>
    </>
  );
};

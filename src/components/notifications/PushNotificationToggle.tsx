import React from 'react';
import { Button } from '@/components/ui/button';
import { BellRing, BellOff, Loader2 } from 'lucide-react';
import { usePushSubscription } from '@/hooks/notifications/usePushSubscription';
import { useToast } from '@/hooks/use-toast';

interface PushNotificationToggleProps {
  isDarkTheme?: boolean;
  size?: 'sm' | 'default';
  variant?: 'ghost' | 'outline';
}

export const PushNotificationToggle: React.FC<PushNotificationToggleProps> = ({
  isDarkTheme = false,
  size = 'sm',
  variant = 'ghost'
}) => {
  const { 
    isSupported, 
    permissionStatus, 
    isSubscribed, 
    isLoading, 
    requestPermission, 
    unsubscribe 
  } = usePushSubscription();
  const { toast } = useToast();

  const handleToggle = async () => {
    try {
      if (permissionStatus === 'default' || permissionStatus === 'denied') {
        const granted = await requestPermission();
        if (granted) {
          toast({
            title: "Push notifications enabled",
            description: "You'll receive important updates",
            variant: "success"
          });
        } else {
          toast({
            title: "Permission needed",
            description: "Enable notifications in your browser settings",
            variant: "warning"
          });
        }
      } else if (isSubscribed) {
        await unsubscribe();
        toast({
          title: "Push notifications disabled",
          description: "You won't receive push notifications",
          variant: "info"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  const getIcon = () => {
    if (isLoading) return Loader2;
    return isSubscribed ? BellRing : BellOff;
  };

  const Icon = getIcon();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={`text-muted-foreground hover:text-foreground ${
        isSubscribed ? 'text-green-600 hover:text-green-700' : ''
      }`}
      aria-label={isSubscribed ? 'Disable push notifications' : 'Enable push notifications'}
    >
      <Icon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      <span className="sr-only">
        {isSubscribed ? 'Disable push notifications' : 'Enable push notifications'}
      </span>
    </Button>
  );
};
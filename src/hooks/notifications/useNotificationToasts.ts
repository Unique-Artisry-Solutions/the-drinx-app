
import { useToast } from '@/hooks/use-toast';

export const useNotificationToasts = () => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: "Success",
      description: "Test notification sent successfully!",
      variant: "success"
    });
  };

  const showErrorToast = (error: Error) => {
    toast({
      title: "Notification Error",
      description: error.message || "Failed to send test notification",
      variant: "destructive"
    });
  };

  const showAuthErrorToast = () => {
    toast({
      title: "Authentication Required",
      description: "Please log in to use push notifications",
      variant: "warning"
    });
  };

  const showInfoToast = (message: string) => {
    toast({
      title: "Information",
      description: message,
      variant: "info"
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
    showAuthErrorToast,
    showInfoToast
  };
};

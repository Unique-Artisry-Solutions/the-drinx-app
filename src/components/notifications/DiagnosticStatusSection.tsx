
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface DiagnosticStatusSectionProps {
  notificationSent: boolean;
  permissionStatus: NotificationPermission;
}

export const DiagnosticStatusSection: React.FC<DiagnosticStatusSectionProps> = ({
  notificationSent,
  permissionStatus
}) => {
  const getStatusIcon = () => {
    if (notificationSent && permissionStatus === 'granted') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (permissionStatus === 'denied') {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const getStatusMessage = () => {
    if (notificationSent && permissionStatus === 'granted') {
      return 'Test notification sent successfully';
    }
    if (permissionStatus === 'denied') {
      return 'Notifications are blocked by the browser';
    }
    if (permissionStatus === 'default') {
      return 'Notification permission not requested yet';
    }
    return 'Ready to send notifications';
  };

  const getAlertVariant = () => {
    if (permissionStatus === 'denied') return 'destructive';
    if (notificationSent && permissionStatus === 'granted') return 'default';
    return 'default';
  };

  return (
    <Alert variant={getAlertVariant()} className="mt-4">
      {getStatusIcon()}
      <AlertDescription>
        {getStatusMessage()}
      </AlertDescription>
    </Alert>
  );
};

export default DiagnosticStatusSection;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationPreferencesManagerProps {
  promoterId: string;
}

const NotificationPreferencesManager: React.FC<NotificationPreferencesManagerProps> = ({ promoterId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Notification preferences management coming soon...
        </p>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferencesManager;

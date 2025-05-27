
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { FollowerNotificationPreferences } from '@/types/SubscriptionTypes';
import { Settings, Clock, Mail, Smartphone } from 'lucide-react';

interface FollowerNotificationSettingsProps {
  preferences: FollowerNotificationPreferences;
  onSave: (preferences: FollowerNotificationPreferences) => void;
  isLoading?: boolean;
}

const FollowerNotificationSettings: React.FC<FollowerNotificationSettingsProps> = ({
  preferences,
  onSave,
  isLoading = false
}) => {
  const [localPrefs, setLocalPrefs] = useState<FollowerNotificationPreferences>(preferences);

  const updatePreference = (key: keyof FollowerNotificationPreferences, value: any) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateQuietHours = (key: string, value: any) => {
    setLocalPrefs(prev => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(localPrefs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Content Preferences</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="events" className="flex items-center gap-2">
              Event notifications
            </Label>
            <Switch
              id="events"
              checked={localPrefs.events}
              onCheckedChange={(checked) => updatePreference('events', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="discounts" className="flex items-center gap-2">
              Discount codes & offers
            </Label>
            <Switch
              id="discounts"
              checked={localPrefs.discounts}
              onCheckedChange={(checked) => updatePreference('discounts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="updates" className="flex items-center gap-2">
              General updates
            </Label>
            <Switch
              id="updates"
              checked={localPrefs.updates}
              onCheckedChange={(checked) => updatePreference('updates', checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Delivery Methods</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email notifications
            </Label>
            <Switch
              id="email"
              checked={localPrefs.email_notifications}
              onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="push" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Push notifications
            </Label>
            <Switch
              id="push"
              checked={localPrefs.push_notifications}
              onCheckedChange={(checked) => updatePreference('push_notifications', checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Quiet Hours
          </h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="quiet-enabled">Enable quiet hours</Label>
            <Switch
              id="quiet-enabled"
              checked={localPrefs.quiet_hours.enabled}
              onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
            />
          </div>

          {localPrefs.quiet_hours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiet-start">Start time</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={localPrefs.quiet_hours.start}
                  onChange={(e) => updateQuietHours('start', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="quiet-end">End time</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={localPrefs.quiet_hours.end}
                  onChange={(e) => updateQuietHours('end', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationSettings;

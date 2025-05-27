
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Mail, 
  Clock, 
  Volume2, 
  VolumeX,
  Settings,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreferences {
  events: boolean;
  discounts: boolean;
  updates: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  notification_frequency: 'immediate' | 'daily' | 'weekly';
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

interface FollowerNotificationSettingsProps {
  userId: string;
  promoterId: string;
}

const FollowerNotificationSettings: React.FC<FollowerNotificationSettingsProps> = ({
  userId,
  promoterId
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    events: true,
    discounts: true,
    updates: true,
    email_notifications: true,
    push_notifications: true,
    notification_frequency: 'immediate',
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    sound_enabled: true,
    vibration_enabled: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUserPreferences();
  }, [userId, promoterId]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('notification_preferences')
        .eq('subscriber_id', userId)
        .eq('promoter_id', promoterId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error;
      }

      if (data?.notification_preferences) {
        setPreferences(prev => ({
          ...prev,
          ...data.notification_preferences
        }));
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const handlePreferenceChange = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('promoter_followers')
        .update({
          notification_preferences: preferences
        })
        .eq('subscriber_id', userId)
        .eq('promoter_id', promoterId);

      if (error) throw error;

      setHasChanges(false);
      toast({
        title: 'Settings Saved',
        description: 'Your notification preferences have been updated.',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
            {hasChanges && (
              <Badge variant="outline" className="ml-auto">
                Unsaved changes
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Types */}
          <div className="space-y-4">
            <h4 className="font-medium">What would you like to be notified about?</h4>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <div>
                    <Label className="text-sm font-medium">Events</Label>
                    <p className="text-xs text-muted-foreground">New events and event updates</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.events}
                  onCheckedChange={(checked) => handlePreferenceChange('events', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Badge className="h-4 w-4 rounded-full" />
                  <div>
                    <Label className="text-sm font-medium">Discounts</Label>
                    <p className="text-xs text-muted-foreground">Special offers and discount codes</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.discounts}
                  onCheckedChange={(checked) => handlePreferenceChange('discounts', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <div>
                    <Label className="text-sm font-medium">General Updates</Label>
                    <p className="text-xs text-muted-foreground">News and announcements</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.updates}
                  onCheckedChange={(checked) => handlePreferenceChange('updates', checked)}
                />
              </div>
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="space-y-4">
            <h4 className="font-medium">How would you like to receive notifications?</h4>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label className="text-sm font-medium">Email Notifications</Label>
                </div>
                <Switch
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label className="text-sm font-medium">Push Notifications</Label>
                </div>
                <Switch
                  checked={preferences.push_notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('push_notifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-4">
            <h4 className="font-medium">Notification Frequency</h4>
            
            <div className="space-y-2">
              <Label>How often would you like to receive notifications?</Label>
              <select
                className="w-full p-2 border rounded"
                value={preferences.notification_frequency}
                onChange={(e) => handlePreferenceChange('notification_frequency', e.target.value as typeof preferences.notification_frequency)}
              >
                <option value="immediate">Immediately</option>
                <option value="daily">Daily Summary</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Label className="text-sm font-medium">Quiet Hours</Label>
              </div>
              <Switch
                checked={preferences.quiet_hours_enabled}
                onCheckedChange={(checked) => handlePreferenceChange('quiet_hours_enabled', checked)}
              />
            </div>
            
            {preferences.quiet_hours_enabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Start</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={preferences.quiet_hours_start}
                    onChange={(e) => handlePreferenceChange('quiet_hours_start', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">End</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={preferences.quiet_hours_end}
                    onChange={(e) => handlePreferenceChange('quiet_hours_end', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sound & Vibration */}
          <div className="space-y-4">
            <h4 className="font-medium">Sound & Vibration</h4>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  {preferences.sound_enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <Label className="text-sm font-medium">Sound</Label>
                </div>
                <Switch
                  checked={preferences.sound_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('sound_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <Label className="text-sm font-medium">Vibration</Label>
                </div>
                <Switch
                  checked={preferences.vibration_enabled}
                  onCheckedChange={(checked) => handlePreferenceChange('vibration_enabled', checked)}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={savePreferences} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerNotificationSettings;

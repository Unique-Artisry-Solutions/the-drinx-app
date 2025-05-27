
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { followerPreferencesToJson, safeJsonToFollowerPreferences } from '@/utils/followerTypeUtils';
import { FollowerNotificationPreferences } from '@/types/SubscriptionTypes';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Gift,
  Clock,
  Volume2,
  Vibrate
} from 'lucide-react';

interface FollowerNotificationSettingsProps {
  promoterId?: string;
}

const FollowerNotificationSettings: React.FC<FollowerNotificationSettingsProps> = ({ promoterId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<FollowerNotificationPreferences>({
    events: true,
    discounts: true,
    updates: true,
    email_notifications: true,
    push_notifications: false,
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  useEffect(() => {
    loadPreferences();
  }, [user, promoterId]);

  const loadPreferences = async () => {
    if (!user || !promoterId) return;

    try {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('notification_preferences')
        .eq('subscriber_id', user.id)
        .eq('promoter_id', promoterId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.notification_preferences) {
        const prefs = safeJsonToFollowerPreferences(data.notification_preferences);
        setPreferences(prefs);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const handleSavePreferences = async () => {
    if (!user || !promoterId) {
      toast({
        title: 'Error',
        description: 'Please log in to save preferences',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const preferencesJson = followerPreferencesToJson(preferences);
      
      const { error } = await supabase
        .from('promoter_followers')
        .update({ 
          notification_preferences: preferencesJson
        })
        .eq('subscriber_id', user.id)
        .eq('promoter_id', promoterId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notification preferences saved!',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (key: keyof FollowerNotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateQuietHours = (key: keyof FollowerNotificationPreferences['quiet_hours'], value: any) => {
    setPreferences(prev => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        [key]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="font-medium">Notification Types</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="events" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Event Announcements
              </Label>
              <input
                type="checkbox"
                id="events"
                checked={preferences.events}
                onChange={(e) => updatePreference('events', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="discounts" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Discount Codes & Offers
              </Label>
              <input
                type="checkbox"
                id="discounts"
                checked={preferences.discounts}
                onChange={(e) => updatePreference('discounts', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="updates" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                General Updates
              </Label>
              <input
                type="checkbox"
                id="updates"
                checked={preferences.updates}
                onChange={(e) => updatePreference('updates', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Delivery Methods */}
        <div className="space-y-4">
          <h3 className="font-medium">Delivery Methods</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <input
                type="checkbox"
                id="email"
                checked={preferences.email_notifications}
                onChange={(e) => updatePreference('email_notifications', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Push Notifications
              </Label>
              <input
                type="checkbox"
                id="push"
                checked={preferences.push_notifications}
                onChange={(e) => updatePreference('push_notifications', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <h3 className="font-medium">Quiet Hours</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="quietHours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Enable Quiet Hours
              </Label>
              <input
                type="checkbox"
                id="quietHours"
                checked={preferences.quiet_hours.enabled}
                onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                className="w-4 h-4"
              />
            </div>

            {preferences.quiet_hours.enabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div>
                  <Label htmlFor="quietStart">Start Time</Label>
                  <input
                    type="time"
                    id="quietStart"
                    value={preferences.quiet_hours.start}
                    onChange={(e) => updateQuietHours('start', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="quietEnd">End Time</Label>
                  <input
                    type="time"
                    id="quietEnd"
                    value={preferences.quiet_hours.end}
                    onChange={(e) => updateQuietHours('end', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleSavePreferences}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationSettings;

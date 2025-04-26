
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { subscriptionSettings, getCurrentUserId } from '@/lib/typedSupabase';
import { SubscriptionSettings } from '@/types/SubscriptionTypes';

export const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscriptions, tiers, isLoading, subscribe, unsubscribe } = useSubscriptions();
  const { userLocation, refreshLocation } = useUserLocation();
  const [locationSharing, setLocationSharing] = useState(false);
  const [notificationRadius, setNotificationRadius] = useState(10);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Fetch subscription settings
  React.useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await subscriptionSettings()
          .select('*')
          .eq('user_id', user.id)
          .single<SubscriptionSettings>();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription settings:', error);
          return;
        }
        
        if (data) {
          setLocationSharing(data.location_sharing);
          setNotificationRadius(data.notification_radius);
        }
      } catch (err) {
        console.error('Error in subscription settings fetch:', err);
      }
    };
    
    fetchSettings();
  }, [user]);

  const saveSubscriptionSettings = async () => {
    if (!user?.id) return;
    
    setUpdatingSettings(true);
    
    try {
      const { error } = await subscriptionSettings()
        .upsert({
          user_id: user.id,
          location_sharing: locationSharing,
          notification_radius: notificationRadius,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast({
        title: 'Settings saved',
        description: 'Your subscription settings have been updated.',
      });
      
      if (locationSharing && userLocation === null) {
        refreshLocation();
      }
    } catch (error: any) {
      toast({
        title: 'Error saving settings',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdatingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Subscription Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="location-sharing">Location Sharing</Label>
              <p className="text-sm text-gray-500">
                Allow promoters to send you notifications based on your location
              </p>
            </div>
            <Switch
              id="location-sharing"
              checked={locationSharing}
              onCheckedChange={setLocationSharing}
            />
          </div>
          
          {locationSharing && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="notification-radius">
                Notification Radius (miles)
              </Label>
              <div className="flex items-center gap-4">
                <input
                  id="notification-radius"
                  type="range"
                  min="1"
                  max="50"
                  value={notificationRadius}
                  onChange={(e) => setNotificationRadius(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-12 text-center">{notificationRadius}</span>
              </div>
            </div>
          )}
          
          <Button 
            onClick={saveSubscriptionSettings} 
            className="w-full mt-4"
            disabled={updatingSettings}
          >
            {updatingSettings ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">My Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading subscriptions...</div>
          ) : subscriptions.length > 0 ? (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{subscription.promoter_name || 'Promoter'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={subscription.status === 'active' ? 'default' : 'outline'}>
                        {subscription.status}
                      </Badge>
                      {subscription.tier_name && (
                        <Badge variant="secondary">{subscription.tier_name}</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => unsubscribe.mutate(subscription.id)}
                    disabled={unsubscribe.isPending}
                  >
                    Unsubscribe
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                You are not subscribed to any promoters yet
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/promoter'}>
                Discover Promoters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

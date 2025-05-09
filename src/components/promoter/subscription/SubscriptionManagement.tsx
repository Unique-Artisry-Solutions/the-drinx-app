import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription settings:', error);
          return;
        }
        
        if (data) {
          try {
            const bioData = data.bio ? JSON.parse(data.bio) : {};
            if (bioData.location_settings) {
              setLocationSharing(bioData.location_settings.sharing || false);
              setNotificationRadius(bioData.location_settings.radius || 10);
            }
          } catch (parseError) {
            console.error('Error parsing bio JSON:', parseError);
          }
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('bio')
        .eq('id', user.id)
        .single();
      
      let bioData = {};
      
      if (profile?.bio) {
        try {
          bioData = JSON.parse(profile.bio);
        } catch (e) {
          // If the bio isn't valid JSON, just use an empty object
          console.warn('Existing bio was not valid JSON:', e);
        }
      }
      
      // Update the location settings within the bio
      const updatedBio = {
        ...bioData,
        location_settings: {
          sharing: locationSharing,
          radius: notificationRadius
        }
      };
      
      // Update the location data if we have it and location sharing is enabled
      if (locationSharing && userLocation) {
        updatedBio.location = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          updated_at: new Date().toISOString()
        };
      } else if (!locationSharing) {
        // Remove location data if location sharing is disabled
        delete updatedBio.location;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          bio: JSON.stringify(updatedBio)
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Settings saved',
        description: 'Your subscription settings have been updated',
      });
      
    } catch (err: any) {
      toast({
        title: 'Failed to save settings',
        description: err.message,
        variant: 'destructive',
      });
      console.error('Error saving subscription settings:', err);
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleLocationSharingToggle = (enabled: boolean) => {
    setLocationSharing(enabled);
    
    if (enabled && !userLocation) {
      refreshLocation();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Location-Based Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about events happening near you
                </p>
              </div>
              <Switch
                checked={locationSharing}
                onCheckedChange={handleLocationSharingToggle}
              />
            </div>
            
            {locationSharing && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notification-radius">Notification Radius</Label>
                    <span className="text-sm font-medium">{notificationRadius} miles</span>
                  </div>
                  <Slider
                    id="notification-radius"
                    min={1}
                    max={50}
                    step={1}
                    value={[notificationRadius]}
                    onValueChange={(values) => setNotificationRadius(values[0])}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll receive notifications for events within {notificationRadius} miles of your location
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Current Location</h4>
                  {userLocation ? (
                    <div className="text-sm">
                      <Badge variant="outline" className="mr-2">
                        Lat: {userLocation.latitude.toFixed(4)}
                      </Badge>
                      <Badge variant="outline">
                        Long: {userLocation.longitude.toFixed(4)}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Location not available. Please enable location services in your browser.
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshLocation}
                    disabled={!locationSharing}
                  >
                    Refresh Location
                  </Button>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button 
                onClick={saveSubscriptionSettings}
                disabled={updatingSettings}
              >
                {updatingSettings ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Active Subscriptions</h3>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading subscriptions...</p>
            ) : subscriptions && subscriptions.length > 0 ? (
              <div className="space-y-2">
                {subscriptions.map((sub) => (
                  <Card key={sub.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{sub.promoter_name || 'Unknown Promoter'}</h4>
                        <p className="text-sm text-muted-foreground">
                          {sub.tier_name ? `${sub.tier_name} tier` : 'Basic subscription'}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unsubscribe.mutate(sub.id)}
                        disabled={unsubscribe.isPending}
                      >
                        Unsubscribe
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                You don't have any active subscriptions.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;

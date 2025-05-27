
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { eventVisibilityService, type EventVisibilitySettings } from '@/services/EventVisibilityService';

interface EventVisibilitySettingsProps {
  eventId: string;
  onSettingsChange?: (settings: EventVisibilitySettings) => void;
}

export const EventVisibilitySettingsComponent: React.FC<EventVisibilitySettingsProps> = ({
  eventId,
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<EventVisibilitySettings>({
    isPublic: true,
    requiresFollowing: false,
    accessType: 'public',
    followerOnlyAccess: false,
    premiumFollowerAccess: false,
    specificTierAccess: [],
    earlyAccess: {
      enabled: false,
      daysEarly: 0,
      forFollowerTypes: [],
      specificTiers: []
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, [eventId]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const eventSettings = await eventVisibilityService.getEventVisibilitySettings(eventId);
      setSettings(eventSettings);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load event visibility settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      await eventVisibilityService.updateEventVisibility(eventId, settings);
      onSettingsChange?.(settings);
      toast({
        title: 'Success',
        description: 'Event visibility settings updated successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update event visibility settings',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (updates: Partial<EventVisibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Derive UI state from settings
  const isEarlyAccessEnabled = settings.earlyAccess?.enabled || false;
  const earlyAccessDays = settings.earlyAccess?.daysEarly || 0;

  // Update access type based on UI toggles
  React.useEffect(() => {
    let newAccessType = settings.accessType;
    
    if (settings.specificTierAccess && settings.specificTierAccess.length > 0) {
      newAccessType = 'tier_specific';
    } else if (settings.premiumFollowerAccess) {
      newAccessType = 'premium_only';
    } else if (settings.followerOnlyAccess) {
      newAccessType = 'followers_only';
    } else if (isEarlyAccessEnabled) {
      newAccessType = 'early_access';
    } else {
      newAccessType = 'public';
    }

    if (newAccessType !== settings.accessType) {
      updateSettings({ accessType: newAccessType });
    }
  }, [settings.specificTierAccess, settings.premiumFollowerAccess, settings.followerOnlyAccess, isEarlyAccessEnabled]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Visibility Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Public Access */}
        <div className="flex items-center space-x-2">
          <Switch
            id="public-access"
            checked={settings.isPublic}
            onCheckedChange={(checked) => updateSettings({ isPublic: checked })}
          />
          <Label htmlFor="public-access">Public Event</Label>
        </div>

        {/* Follower Only Access */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="follower-only"
              checked={settings.followerOnlyAccess}
              onCheckedChange={(checked) => 
                updateSettings({ followerOnlyAccess: !!checked })
              }
            />
            <Label htmlFor="follower-only">Followers Only</Label>
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Only users who follow you can see this event
          </p>
        </div>

        {/* Premium Follower Access */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium-only"
              checked={settings.premiumFollowerAccess}
              onCheckedChange={(checked) => 
                updateSettings({ premiumFollowerAccess: !!checked })
              }
            />
            <Label htmlFor="premium-only">Premium Followers Only</Label>
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Only premium subscribers can see this event
          </p>
        </div>

        {/* Specific Tier Access */}
        <div className="space-y-2">
          <Label>Specific Tier Access</Label>
          <div className="space-y-2">
            {settings.specificTierAccess && settings.specificTierAccess.map((tierId, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={tierId}
                  onChange={(e) => {
                    const newTiers = [...settings.specificTierAccess];
                    newTiers[index] = e.target.value;
                    updateSettings({ specificTierAccess: newTiers });
                  }}
                  placeholder="Enter tier ID"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newTiers = settings.specificTierAccess.filter((_, i) => i !== index);
                    updateSettings({ specificTierAccess: newTiers });
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newTiers = [...(settings.specificTierAccess || []), ''];
                updateSettings({ specificTierAccess: newTiers });
              }}
            >
              Add Tier
            </Button>
          </div>
        </div>

        {/* Early Access */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="early-access"
              checked={settings.earlyAccess?.enabled || false}
              onCheckedChange={(checked) => 
                updateSettings({
                  earlyAccess: {
                    ...settings.earlyAccess,
                    enabled: checked
                  }
                })
              }
            />
            <Label htmlFor="early-access">Early Access</Label>
          </div>

          {isEarlyAccessEnabled && (
            <div className="ml-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="early-days">Days Early</Label>
                <Input
                  id="early-days"
                  type="number"
                  value={settings.earlyAccess?.daysEarly || 0}
                  onChange={(e) => 
                    updateSettings({
                      earlyAccess: {
                        ...settings.earlyAccess,
                        daysEarly: parseInt(e.target.value) || 0
                      }
                    })
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Early Access For</Label>
                <div className="space-y-2">
                  {['premium', 'vip'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`early-${type}`}
                        checked={settings.earlyAccess?.forFollowerTypes?.includes(type) || false}
                        onCheckedChange={(checked) => {
                          const currentTypes = settings.earlyAccess?.forFollowerTypes || [];
                          const newTypes = checked 
                            ? [...currentTypes, type]
                            : currentTypes.filter(t => t !== type);
                          updateSettings({
                            earlyAccess: {
                              ...settings.earlyAccess,
                              forFollowerTypes: newTypes
                            }
                          });
                        }}
                      />
                      <Label htmlFor={`early-${type}`} className="capitalize">{type} Followers</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specific Tiers for Early Access</Label>
                {settings.earlyAccess?.specificTiers?.map((tierId, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={tierId}
                      onChange={(e) => {
                        const newTiers = [...(settings.earlyAccess?.specificTiers || [])];
                        newTiers[index] = e.target.value;
                        updateSettings({
                          earlyAccess: {
                            ...settings.earlyAccess,
                            specificTiers: newTiers
                          }
                        });
                      }}
                      placeholder="Enter tier ID"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventVisibilitySettingsComponent;

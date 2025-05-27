
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { eventVisibilityService, type EventVisibilitySettings } from '@/services/EventVisibilityService';
import { Eye, EyeOff, Users, Crown, Clock } from 'lucide-react';

interface EventVisibilitySettingsProps {
  eventId: string;
  promoterId: string;
  initialSettings?: EventVisibilitySettings;
  onSettingsChange?: (settings: EventVisibilitySettings) => void;
}

export const EventVisibilitySettingsComponent: React.FC<EventVisibilitySettingsProps> = ({
  eventId,
  promoterId,
  initialSettings,
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<EventVisibilitySettings>(
    initialSettings || {
      isPublic: true,
      followerOnlyAccess: false,
      premiumFollowerAccess: false,
      specificTierAccess: [],
      earlyAccess: {
        enabled: false,
        daysEarly: 3,
        forFollowerTypes: [],
        specificTiers: []
      }
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [availableTiers, setAvailableTiers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableTiers();
  }, [promoterId]);

  const loadAvailableTiers = async () => {
    // This would load the promoter's subscription tiers
    // For now, we'll use mock data
    setAvailableTiers([
      { id: 'tier1', name: 'Silver Tier', count: 45 },
      { id: 'tier2', name: 'Gold Tier', count: 23 },
      { id: 'tier3', name: 'Platinum Tier', count: 12 }
    ]);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await eventVisibilityService.setEventVisibility(eventId, settings);
      onSettingsChange?.(settings);
      
      toast({
        title: 'Settings Saved',
        description: 'Event visibility settings have been updated'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to save visibility settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (updates: Partial<EventVisibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateEarlyAccess = (updates: Partial<NonNullable<EventVisibilitySettings['earlyAccess']>>) => {
    setSettings(prev => ({
      ...prev,
      earlyAccess: { ...prev.earlyAccess!, ...updates }
    }));
  };

  const getVisibilityDescription = () => {
    if (settings.isPublic) return 'Anyone can see this event';
    if (settings.specificTierAccess?.length) return 'Only specific tier followers can see this event';
    if (settings.premiumFollowerAccess) return 'Only premium followers can see this event';
    if (settings.followerOnlyAccess) return 'Only followers can see this event';
    return 'Event visibility is restricted';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {settings.isPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          Event Visibility Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          {getVisibilityDescription()}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Public Access */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Public Event</label>
            <p className="text-sm text-gray-500">Anyone can see and register for this event</p>
          </div>
          <Switch
            checked={settings.isPublic}
            onCheckedChange={(checked) => updateSettings({ isPublic: checked })}
          />
        </div>

        {!settings.isPublic && (
          <>
            <Separator />
            
            {/* Follower Access Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Access Restrictions</h4>
              
              {/* Followers Only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <div>
                    <label className="text-sm font-medium">Followers Only</label>
                    <p className="text-sm text-gray-500">Only people following you can see this event</p>
                  </div>
                </div>
                <Switch
                  checked={settings.followerOnlyAccess}
                  onCheckedChange={(checked) => updateSettings({ followerOnlyAccess: checked })}
                />
              </div>

              {/* Premium Followers Only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  <div>
                    <label className="text-sm font-medium">Premium Followers Only</label>
                    <p className="text-sm text-gray-500">Only premium tier followers can see this event</p>
                  </div>
                </div>
                <Switch
                  checked={settings.premiumFollowerAccess}
                  onCheckedChange={(checked) => updateSettings({ premiumFollowerAccess: checked })}
                />
              </div>

              {/* Specific Tiers */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Specific Tier Access</label>
                <p className="text-sm text-gray-500">Choose which subscription tiers can see this event</p>
                
                <div className="grid grid-cols-1 gap-2">
                  {availableTiers.map((tier) => (
                    <label key={tier.id} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={settings.specificTierAccess?.includes(tier.id)}
                        onCheckedChange={(checked) => {
                          const currentTiers = settings.specificTierAccess || [];
                          if (checked) {
                            updateSettings({
                              specificTierAccess: [...currentTiers, tier.id]
                            });
                          } else {
                            updateSettings({
                              specificTierAccess: currentTiers.filter(id => id !== tier.id)
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{tier.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {tier.count} followers
                      </Badge>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Early Access */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <label className="text-sm font-medium">Early Access</label>
                    <p className="text-sm text-gray-500">Give certain followers early access to see the event</p>
                  </div>
                </div>
                <Switch
                  checked={settings.earlyAccess?.enabled}
                  onCheckedChange={(checked) => updateEarlyAccess({ enabled: checked })}
                />
              </div>

              {settings.earlyAccess?.enabled && (
                <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                  <div>
                    <label className="block text-sm font-medium mb-2">Days Early</label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.earlyAccess.daysEarly}
                      onChange={(e) => updateEarlyAccess({ daysEarly: parseInt(e.target.value) || 1 })}
                      className="w-20"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      How many days before the event becomes visible to others
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Early Access For:</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={settings.earlyAccess.forFollowerTypes.includes('free')}
                          onCheckedChange={(checked) => {
                            const types = settings.earlyAccess!.forFollowerTypes;
                            updateEarlyAccess({
                              forFollowerTypes: checked 
                                ? [...types, 'free']
                                : types.filter(t => t !== 'free')
                            });
                          }}
                        />
                        <span className="text-sm">Free Followers</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          checked={settings.earlyAccess.forFollowerTypes.includes('premium')}
                          onCheckedChange={(checked) => {
                            const types = settings.earlyAccess!.forFollowerTypes;
                            updateEarlyAccess({
                              forFollowerTypes: checked 
                                ? [...types, 'premium']
                                : types.filter(t => t !== 'premium')
                            });
                          }}
                        />
                        <span className="text-sm">Premium Followers</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : 'Save Visibility Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventVisibilitySettingsComponent;

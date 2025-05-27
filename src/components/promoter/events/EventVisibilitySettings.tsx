import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { eventVisibilityService } from '@/services/EventVisibilityService';
import { EventVisibilitySettings as EventVisibilitySettingsType } from '@/types/EventVisibilityTypes';

interface EventVisibilitySettingsProps {
  eventId: string;
}

const EventVisibilitySettings: React.FC<EventVisibilitySettingsProps> = ({ eventId }) => {
  const [settings, setSettings] = useState<EventVisibilitySettingsType>({
    isPrivate: false,
    requiresFollowing: false,
    allowedTiers: [],
    guestListOnly: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const availableTiers = ['basic', 'premium', 'vip'];

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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await eventVisibilityService.updateEventVisibilitySettings(eventId, settings);
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

  const handleTierChange = (tier: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      allowedTiers: checked 
        ? [...prev.allowedTiers, tier]
        : prev.allowedTiers.filter(t => t !== tier)
    }));
  };

  if (isLoading) {
    return <div>Loading event visibility settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Visibility Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="private"
            checked={settings.isPrivate}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isPrivate: checked }))}
          />
          <Label htmlFor="private">Private Event</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="following"
            checked={settings.requiresFollowing}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requiresFollowing: checked }))}
          />
          <Label htmlFor="following">Requires Following</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="guestList"
            checked={settings.guestListOnly}
            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, guestListOnly: checked }))}
          />
          <Label htmlFor="guestList">Guest List Only</Label>
        </div>

        <div className="space-y-2">
          <Label>Allowed Tiers</Label>
          {availableTiers.map(tier => (
            <div key={tier} className="flex items-center space-x-2">
              <Checkbox
                id={tier}
                checked={settings.allowedTiers.includes(tier)}
                onCheckedChange={(checked) => handleTierChange(tier, checked as boolean)}
              />
              <Label htmlFor={tier} className="capitalize">{tier}</Label>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventVisibilitySettings;

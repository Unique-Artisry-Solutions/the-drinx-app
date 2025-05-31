
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Gift, Percent, Star } from 'lucide-react';

interface RewardConfiguratorProps {
  onRewardConfigured: (config: any) => void;
}

export function RewardConfigurator({ onRewardConfigured }: RewardConfiguratorProps) {
  const [rewardType, setRewardType] = useState('');
  const [rewardValue, setRewardValue] = useState('');
  const [rewardName, setRewardName] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [isStackable, setIsStackable] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDays, setExpiryDays] = useState('30');

  const rewardTypes = [
    { value: 'points', label: 'Points', icon: Star },
    { value: 'discount', label: 'Discount', icon: Percent },
    { value: 'freebie', label: 'Free Item', icon: Gift }
  ];

  const handleSave = () => {
    const config = {
      type: rewardType,
      value: rewardValue,
      name: rewardName,
      description: rewardDescription,
      isStackable,
      hasExpiry,
      expiryDays: hasExpiry ? parseInt(expiryDays) : null
    };
    onRewardConfigured(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Reward Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Reward Type</Label>
          <Select value={rewardType} onValueChange={setRewardType}>
            <SelectTrigger>
              <SelectValue placeholder="Select reward type" />
            </SelectTrigger>
            <SelectContent>
              {rewardTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reward-name">Reward Name</Label>
            <Input
              id="reward-name"
              value={rewardName}
              onChange={(e) => setRewardName(e.target.value)}
              placeholder="e.g., Welcome Bonus"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward-value">
              {rewardType === 'points' ? 'Points Amount' : 
               rewardType === 'discount' ? 'Discount %' : 'Item Name'}
            </Label>
            <Input
              id="reward-value"
              value={rewardValue}
              onChange={(e) => setRewardValue(e.target.value)}
              placeholder={rewardType === 'points' ? '100' : 
                          rewardType === 'discount' ? '10' : 'Free drink'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reward-description">Description</Label>
          <Textarea
            id="reward-description"
            value={rewardDescription}
            onChange={(e) => setRewardDescription(e.target.value)}
            placeholder="Describe the reward and how to claim it..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="stackable">Stackable with other rewards</Label>
              <p className="text-sm text-muted-foreground">Allow combining with other active rewards</p>
            </div>
            <Switch
              id="stackable"
              checked={isStackable}
              onCheckedChange={setIsStackable}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="has-expiry">Has expiry date</Label>
              <p className="text-sm text-muted-foreground">Set expiration for this reward</p>
            </div>
            <Switch
              id="has-expiry"
              checked={hasExpiry}
              onCheckedChange={setHasExpiry}
            />
          </div>

          {hasExpiry && (
            <div className="space-y-2">
              <Label htmlFor="expiry-days">Expires after (days)</Label>
              <Input
                id="expiry-days"
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                min="1"
                max="365"
              />
            </div>
          )}
        </div>

        <Button 
          onClick={handleSave} 
          disabled={!rewardType || !rewardName || !rewardValue}
          className="w-full"
        >
          Save Reward Configuration
        </Button>
      </CardContent>
    </Card>
  );
}


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Settings, Shield, TrendingUp } from 'lucide-react';

interface AdvancedConfigOptionsProps {
  onConfigChange: (config: any) => void;
}

export function AdvancedConfigOptions({ onConfigChange }: AdvancedConfigOptionsProps) {
  const [enableAutoTiers, setEnableAutoTiers] = useState(false);
  const [pointsExpiry, setPointsExpiry] = useState(false);
  const [expiryDays, setExpiryDays] = useState([365]);
  const [fraudProtection, setFraudProtection] = useState(true);
  const [maxDailyPoints, setMaxDailyPoints] = useState('1000');
  const [tierCalculationMethod, setTierCalculationMethod] = useState('points');

  const handleConfigUpdate = () => {
    const config = {
      enableAutoTiers,
      pointsExpiry,
      expiryDays: expiryDays[0],
      fraudProtection,
      maxDailyPoints: parseInt(maxDailyPoints),
      tierCalculationMethod
    };
    onConfigChange(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Automatic Tier Progression</Label>
              <p className="text-sm text-muted-foreground">
                Automatically move users to higher tiers based on activity
              </p>
            </div>
            <Switch
              checked={enableAutoTiers}
              onCheckedChange={(checked) => {
                setEnableAutoTiers(checked);
                handleConfigUpdate();
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Points Expiry</Label>
              <p className="text-sm text-muted-foreground">
                Enable expiration for earned points
              </p>
            </div>
            <Switch
              checked={pointsExpiry}
              onCheckedChange={(checked) => {
                setPointsExpiry(checked);
                handleConfigUpdate();
              }}
            />
          </div>

          {pointsExpiry && (
            <div className="space-y-2">
              <Label>Points expire after (days): {expiryDays[0]}</Label>
              <Slider
                value={expiryDays}
                onValueChange={(value) => {
                  setExpiryDays(value);
                  handleConfigUpdate();
                }}
                max={730}
                min={30}
                step={30}
                className="w-full"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <div>
                <Label>Fraud Protection</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic fraud detection and prevention
                </p>
              </div>
            </div>
            <Switch
              checked={fraudProtection}
              onCheckedChange={(checked) => {
                setFraudProtection(checked);
                handleConfigUpdate();
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-daily-points">Maximum Daily Points</Label>
            <Input
              id="max-daily-points"
              type="number"
              value={maxDailyPoints}
              onChange={(e) => {
                setMaxDailyPoints(e.target.value);
                handleConfigUpdate();
              }}
              placeholder="1000"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tier Calculation Method
            </Label>
            <Select 
              value={tierCalculationMethod} 
              onValueChange={(value) => {
                setTierCalculationMethod(value);
                handleConfigUpdate();
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Total Points Earned</SelectItem>
                <SelectItem value="spending">Total Spending</SelectItem>
                <SelectItem value="visits">Visit Frequency</SelectItem>
                <SelectItem value="hybrid">Hybrid Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

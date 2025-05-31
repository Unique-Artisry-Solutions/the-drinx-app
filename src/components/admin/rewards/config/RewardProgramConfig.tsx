
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, RefreshCw } from 'lucide-react';

interface RewardProgramConfigProps {
  onConfigSave: (config: any) => void;
}

export function RewardProgramConfig({ onConfigSave }: RewardProgramConfigProps) {
  const [programName, setProgramName] = useState('');
  const [programType, setProgramType] = useState('points');
  const [isActive, setIsActive] = useState(true);
  const [pointsPerDollar, setPointsPerDollar] = useState('1');
  const [welcomeBonus, setWelcomeBonus] = useState('100');
  const [minRedemption, setMinRedemption] = useState('100');

  const handleSave = () => {
    const config = {
      programName,
      programType,
      isActive,
      pointsPerDollar: parseFloat(pointsPerDollar),
      welcomeBonus: parseInt(welcomeBonus),
      minRedemption: parseInt(minRedemption)
    };
    onConfigSave(config);
  };

  const handleReset = () => {
    setProgramName('');
    setProgramType('points');
    setIsActive(true);
    setPointsPerDollar('1');
    setWelcomeBonus('100');
    setMinRedemption('100');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Reward Program Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="program-name">Program Name</Label>
                  <Input
                    id="program-name"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder="e.g., VIP Rewards Program"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Program Type</Label>
                  <Select value={programType} onValueChange={setProgramType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Points Based</SelectItem>
                      <SelectItem value="tiers">Tier Based</SelectItem>
                      <SelectItem value="cashback">Cashback</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="points-per-dollar">Points per Dollar</Label>
                  <Input
                    id="points-per-dollar"
                    type="number"
                    value={pointsPerDollar}
                    onChange={(e) => setPointsPerDollar(e.target.value)}
                    min="0.1"
                    step="0.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome-bonus">Welcome Bonus Points</Label>
                  <Input
                    id="welcome-bonus"
                    type="number"
                    value={welcomeBonus}
                    onChange={(e) => setWelcomeBonus(e.target.value)}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-redemption">Minimum Redemption</Label>
                  <Input
                    id="min-redemption"
                    type="number"
                    value={minRedemption}
                    onChange={(e) => setMinRedemption(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="is-active">Program Active</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable the reward program</p>
                </div>
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div className="text-center py-8 text-muted-foreground">
                <p>Advanced configuration options will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="rules">
              <div className="text-center py-8 text-muted-foreground">
                <p>Complex rule builder will be displayed here</p>
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="text-center py-8 text-muted-foreground">
                <p>Seasonal template selector will be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

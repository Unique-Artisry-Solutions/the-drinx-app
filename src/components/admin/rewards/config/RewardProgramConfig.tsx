
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export interface RewardProgramConfigProps {
  onConfigSave: (config: any) => void;
}

export function RewardProgramConfig({ onConfigSave }: RewardProgramConfigProps) {
  const [config, setConfig] = useState({
    programName: 'Swig Rewards',
    pointsPerVisit: 10,
    isActive: true,
    tierSystemEnabled: true
  });
  const { toast } = useToast();

  const handleSave = () => {
    onConfigSave(config);
    toast({
      title: 'Configuration Saved',
      description: 'Reward program configuration has been updated successfully.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Program Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="program-name">Program Name</Label>
          <Input
            id="program-name"
            value={config.programName}
            onChange={(e) => setConfig({ ...config, programName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="points-per-visit">Points Per Visit</Label>
          <Input
            id="points-per-visit"
            type="number"
            value={config.pointsPerVisit}
            onChange={(e) => setConfig({ ...config, pointsPerVisit: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="program-active"
            checked={config.isActive}
            onCheckedChange={(checked) => setConfig({ ...config, isActive: checked })}
          />
          <Label htmlFor="program-active">Program Active</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="tier-system"
            checked={config.tierSystemEnabled}
            onCheckedChange={(checked) => setConfig({ ...config, tierSystemEnabled: checked })}
          />
          <Label htmlFor="tier-system">Tier System Enabled</Label>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}

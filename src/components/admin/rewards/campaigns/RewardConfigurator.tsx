
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface RewardConfig {
  type: 'points' | 'offering' | 'tier';
  value: string;
  description: string;
}

interface RewardConfiguratorProps {
  rewards: RewardConfig[];
  onRewardsChange: (rewards: RewardConfig[]) => void;
}

export const RewardConfigurator: React.FC<RewardConfiguratorProps> = ({
  rewards,
  onRewardsChange
}) => {
  const [newReward, setNewReward] = useState<RewardConfig>({
    type: 'points',
    value: '',
    description: ''
  });

  const addReward = () => {
    if (newReward.value && newReward.description) {
      onRewardsChange([...rewards, newReward]);
      setNewReward({ type: 'points', value: '', description: '' });
    }
  };

  const removeReward = (index: number) => {
    onRewardsChange(rewards.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new reward */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Select
              value={newReward.type}
              onValueChange={(value: 'points' | 'offering' | 'tier') =>
                setNewReward({ ...newReward, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="offering">Offering</SelectItem>
                <SelectItem value="tier">Tier</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Value"
              value={newReward.value}
              onChange={(e) => setNewReward({ ...newReward, value: e.target.value })}
            />
            
            <Input
              placeholder="Description"
              value={newReward.description}
              onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
            />
            
            <Button onClick={addReward}>Add Reward</Button>
          </div>

          {/* Current rewards */}
          <div className="space-y-2">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <Badge variant="outline">{reward.type}</Badge>
                <span className="font-medium">{reward.value}</span>
                <span className="text-muted-foreground flex-1">{reward.description}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeReward(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {rewards.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No rewards configured. Add rewards above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardConfigurator;

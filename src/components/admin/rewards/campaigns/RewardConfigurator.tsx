
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Gift, Award } from 'lucide-react';
import { CampaignReward } from '@/lib/rewards/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RewardConfiguratorProps {
  rewards: CampaignReward[];
  onChange: (rewards: CampaignReward[]) => void;
}

export const RewardConfigurator = ({ rewards, onChange }: RewardConfiguratorProps) => {
  const [rewardType, setRewardType] = useState('points');
  const [rewardValue, setRewardValue] = useState('');
  
  const addReward = () => {
    if (!rewardValue.trim()) return;
    
    let description = '';
    
    switch (rewardType) {
      case 'points':
        description = `${rewardValue} bonus points`;
        break;
      case 'offering':
        description = `Reward offering: ${rewardValue}`;
        break;
      case 'tier':
        description = `Tier upgrade: ${rewardValue}`;
        break;
      default:
        description = `${rewardType}: ${rewardValue}`;
    }
    
    const newReward: CampaignReward = {
      id: `reward-${Date.now()}`,
      type: rewardType as CampaignReward['type'],
      value: rewardValue,
      description
    };
    
    onChange([...rewards, newReward]);
    setRewardValue('');
  };
  
  const removeReward = (rewardId: string) => {
    onChange(rewards.filter(reward => reward.id !== rewardId));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Campaign Rewards
          </CardTitle>
          <CardDescription>
            Define what rewards users will receive during this campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Select 
              value={rewardType} 
              onValueChange={setRewardType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Reward type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Bonus Points</SelectItem>
                <SelectItem value="offering">Reward Offering</SelectItem>
                <SelectItem value="tier">Tier Upgrade</SelectItem>
              </SelectContent>
            </Select>
            
            <Input 
              placeholder={rewardType === 'points' ? 'Enter points amount...' : 'Enter reward details...'}
              value={rewardValue} 
              onChange={(e) => setRewardValue(e.target.value)} 
              className="flex-1"
            />
            
            <Button onClick={addReward} type="button">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Reward
            </Button>
          </div>
          
          {rewards.length === 0 ? (
            <Alert>
              <AlertTitle>No rewards defined</AlertTitle>
              <AlertDescription>
                Add at least one reward that users will receive during this campaign.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-wrap gap-2">
              {rewards.map(reward => (
                <Badge 
                  key={reward.id} 
                  variant="secondary"
                  className="px-2 py-1 flex items-center gap-1"
                >
                  {reward.description}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeReward(reward.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Reward Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            {rewards.length === 0 ? (
              <p className="text-muted-foreground text-center">
                Add rewards to see a preview
              </p>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">Users will receive:</p>
                <ul className="list-disc list-inside space-y-1">
                  {rewards.map(reward => (
                    <li key={reward.id}>{reward.description}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
